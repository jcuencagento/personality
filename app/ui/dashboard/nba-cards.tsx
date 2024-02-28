import Link from 'next/link';
import Image from 'next/image';
import './dashboard.css';

export default async function NBAWrapper() {
    const fav_players = [
        { name: 'haliburton' },
        { name: 'george' },
        { name: 'nesmith' },
        { name: 'steph' }
    ];

    return (
        <div className="player-grid-dash w-full">
            {fav_players.map((player, index) => (
                <Link key={index} href={`/dashboard/sports/${player.name}`}>
                <div className="player-card-dash" >
                    <Image
                        src={`/players/${player.name}.jpg`}
                        alt={player.name}
                        width={1200}
                        height={900}
                        quality={100}
                        className="player-image-dash"
                    />
                </div>
                </Link>
            ))}
        </div>
    );
}
