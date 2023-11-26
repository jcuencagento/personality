import Link from 'next/link';
import Image from 'next/image';
import '../../ui/sports/sports.css';

export default function Page({ }: { }) {
    const players = [
        { name: 'lebron' },
        { name: 'ant' },
        { name: 'haliburton' },
        { name: 'turner' },
        { name: 'shai' },
        { name: 'jokic' },
        { name: 'tatum' },
        { name: 'george' },
        { name: 'antetokounmpo' },
        { name: 'durant' },
        { name: 'steph' },
        { name: 'nesmith' }
    ];

    return (
        <div className="sports-page">
            {players.map((player, index) => (
                <Link key={index} href={`/dashboard/sports/${player.name}`}>
                <div className="player-card" >
                    <Image
                        src={`/players/${player.name}.jpg`}
                        alt={player.name}
                        width={1000}
                        height={1000}
                        quality={100}
                        className="player-image"
                    />
                    <div className="player-overlay">{player.name}</div>
                </div>
                </Link>
            ))}
        </div>
    );
}
