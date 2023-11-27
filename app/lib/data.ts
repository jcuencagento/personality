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

/*
export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTable>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
*/

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

    console.log(query); //Not used yet
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

async function getAccessToken() {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
            },
            body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch access token');
        }

        const data = await response.json();
        const accessToken = data.access_token;

        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

type Record = {
    [playerName: string]: string;
};

const recommendationsURLs: Record = {
    nirvana_rock_metal_punk_rap: 'https://api.spotify.com/v1/recommendations?limit=8&market=ES&seed_artists=6olE6TJLqED3rqDCT0FyPh&seed_genres=rock%2Cpunk%2Cmetal%2Crap',
    nirvana_pop_punk_reggae: 'https://api.spotify.com/v1/recommendations?limit=8&market=ES&seed_artists=6olE6TJLqED3rqDCT0FyPh&seed_genres=pop%2Cpunk%2Creggae',
    nirvana_rap_metal_punk: 'https://api.spotify.com/v1/recommendations?limit=8&market=ES&seed_artists=6olE6TJLqED3rqDCT0FyPh&seed_genres=rap%2Cpunk%2Cmetal'
};

async function getSongs(accessToken: string) {
    const keys = Object.keys(recommendationsURLs);
    const randomKeyIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomKeyIndex];
    const apiUrl = recommendationsURLs[randomKey];
    console.log(apiUrl);
    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log({ data });
        const songs = data.tracks;
        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

export async function fetchSongs() {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            console.error('Failed to obtain access token');
            return;
        }

        const songs = await getSongs(accessToken);
        console.log(songs);
        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
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
    // Add more players and their URLs here
};

export async function fetchAverages(player: string) {
    const URL = playerURLs[player] 
        ? playerURLs[player] 
        : 'https://www.balldontlie.io/api/v1/season_averages?player_ids[]=304' // TJ xd
    try {
        const response = await fetch(URL, {
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
