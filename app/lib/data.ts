import { sql } from '@vercel/postgres';
import {
    CustomerField,
    InvoiceForm,
    InvoicesTable,
    LatestInvoiceRaw,
    User,
    Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import dotenv from 'dotenv';
dotenv.config();


export async function fetchRevenue() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
    noStore();
    try {
        // Artificially delay a reponse for demo purposes.
        // Don't do this in real life :)

        // console.log('Fetching revenue data...');
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        const data = await sql<Revenue>`SELECT * FROM revenue`;

        // console.log('Data fetch complete after 3 seconds.');

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * from USERS where email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getFilms(query: any) {
    const apiKey = '8d30a0b229ea5c741cccef3304393f72';
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_average.desc&vote_count.gte=1000&language=en-US&page=1&include_adult=false&include_video=false`;
    https://api.themoviedb.org/3/account/20706337/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const films = data.results.slice(0, 10); // Get the top 10 films

        //console.log(films);
        return films;
    } catch (error) {
        console.error('Error fetching films:', error);
        return [];
    }
}

export async function getToWatch() {
    const apiUrl = `https://api.themoviedb.org/3/account/20706337/watchlist/movies?language=en-US&page=1&sort_by=created_at.desc&date=${new Date()}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZDMwYTBiMjI5ZWE1Yzc0MWNjY2VmMzMwNDM5M2Y3MiIsInN1YiI6IjY1NTQwNWZiOTAzYzUyMDBlMWYwMTdlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NGfKWQMflqkXDcJ58Vg9C0l1wqiSsEIfQTlP-_bYws4'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const films = data.results.slice(0, 4); // Get the next 4 films TO WATCH
        return films;
    } catch (error) {
        console.error('Error fetching films:', error);
        return [];
    }
}

async function getAccessToken() {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'client_credentials');
    requestBody.append('scope', 'user-library-read playlist-read-private user-library-read');
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
            },
            body: requestBody.toString()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch access token');
        }

        const data = await response.json();
        const now_object = { now: Date.now() };
        return { ...data, ...now_object };
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

async function refreshTokenFunction(refreshToken: string | null) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'refresh_token');
  requestBody.append('refresh_token', refreshToken || 'error...');

  const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  try {
      const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${basicAuth}`,
          },
          body: requestBody.toString(),
      });

      if (!response.ok) {
          throw new Error('Failed to refresh access token');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error; // Propagate the error to handle it where refreshTokenFunction() is called
  }
}

type Record = {
    [playerName: string]: string;
};

/* Every time you add a URL you need to ask for new access token -> change scope */
const recommendationsURLs: Record = {
    nirvana_rock_metal_punk_rap: 'https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_artists=6olE6TJLqED3rqDCT0FyPh&seed_genres=rock%2Cpunk%2Cmetal%2Crap',
    nirvana_pop_metal_reggae: 'https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_artists=6olE6TJLqED3rqDCT0FyPh&seed_genres=pop%2Creggae%2Cmetal',
    blink_metal_pop: 'https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_artists=6FBDaR13swtiWwGhX1WQsP&seed_genres=metal%2Cpop',
    blink_rap_reggae_country: 'https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_artists=6FBDaR13swtiWwGhX1WQsP&seed_genres=rap%2Creggae%2Ccountry',
    evaristo_rap_reggae_country: 'https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_artists=3vHlZN6pTa2zOl2eVxiEdJ&seed_genres=rap%2Creggae%2Ccountry',
    evaristo_rock_pop_metal: 'https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_artists=3vHlZN6pTa2zOl2eVxiEdJ&seed_genres=rock%2Cpop%2Cmetal'
};

async function getSongs(token: Token | null) {
    const keys = Object.keys(recommendationsURLs);
    const randomKeyIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomKeyIndex];
    const apiUrl = recommendationsURLs[randomKey];
    console.log(randomKey);
    console.log(apiUrl);
    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token?.access_token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const songs = data.tracks;
        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

async function getMySongs(token: Token | null) {
    const apiUrl = 'https://api.spotify.com/v1/playlists/536YjoAObZRmpu4FEjUoHs';
    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token?.access_token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const my_songs = data.tracks.items;
        return my_songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

type Token = {
    access_token: string,
    token_type: string,
    expires_in: number,
    now: number
}

let access_token_object: Token | null;
export async function fetchSongs() {
    if (!access_token_object || isTokenExpired(access_token_object)) {
        access_token_object = await getAccessToken();
    }

    try {
        const songs = await getSongs(access_token_object);
        return songs;
    } catch (error) {
        console.log(error);
        access_token_object = await refreshTokenFunction(access_token_object?.access_token || null);

        try {
            const songs = await getSongs(access_token_object);
            return songs;
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }
}

export async function fetchMySongs() {
    if (!access_token_object || isTokenExpired(access_token_object)) {
        access_token_object = await getAccessToken();
    }

    try {
        const songs = await getMySongs(access_token_object);
        return songs;
    } catch (error) {
        console.log(error);
        access_token_object = await refreshTokenFunction(access_token_object?.access_token || null);

        try {
            const songs = await getMySongs(access_token_object);
            return songs;
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }
}

function isTokenExpired(token: Token) {
    if (!token) {
        return true;
    }

    if (!token.access_token || !token.expires_in) {
        return true;
    }

    const expiration_time = token.now + token.expires_in;
    return expiration_time < Date.now();
}

type PlayerURLDictionary = {
    [playerName: string]: string;
};
  
const playerURLs: PlayerURLDictionary = {
    haliburton: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=3547245',
    turner: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=452',
    lebron: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=237',
    ant: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=3547238',
    shai: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=175',
    nesmith: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=3547250',
    antetokounmpo: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=15',
    george: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=172',
    jokic: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=246',
    tatum: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=434',
    durant: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=140',
    steph: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=115',
    mathurin: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=38017686',
    toppin: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=3547243',
    wembanyama: 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=56677822',
    // Add more players and their URLs here
};

export async function fetchAverages(player: string) {
    const URL = playerURLs[player] 
        ? playerURLs[player]
        : 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=304' // TJ xd
    try {
        const response = await fetch(`${URL}?date=${new Date()}`, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const averages = data.data[0];
        return averages;
    } catch (error) {
        console.error('Error fetching averages:', error);
        return [];
    }
}
