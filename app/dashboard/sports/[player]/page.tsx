import Link from 'next/link';
import Image from 'next/image';
import { fetchAverages } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import '../../../ui/sports/sports.css';

export const metadata: Metadata = {
  title: 'Sports Players!',
};

export default async function Page({ params }: { params: { player: string } }) {
    const player = params.player;
    const averages = await fetchAverages(player);

    if (!averages) {
        notFound();
    }

     return (
        <div className="player-page">
            <div className='flex items-center gap-3'>
                <Link key={`${player}-home`} href="/dashboard" className="home-button">Go home</Link>
                <Link key={`${player}-players`} href="/dashboard/sports" className="players-button">NBA players</Link>
            </div>
            <div className="card">
                <div className="player-info">
                    <p className="player-name">{player}</p>
                    <Image 
                        src={`/players/${player}.jpg`}
                        alt={player}
                        width={2000}
                        height={2000}
                        quality={100}
                        className="player-image-personal"
                    />
                </div>
                <div className="player-stats">
                    <span className="stat-value">With {averages.games_played} games played</span>

                    <div className="stat">
                        <span className="stat-label">Points per game:</span>
                        <span className="stat-value">{averages.pts}</span>
                    </div>

                    <div className="stat">
                        <span className="stat-label">Assists per game:</span>
                        <span className="stat-value">{averages.ast}</span>
                    </div>

                    <div className="stat">
                        <span className="stat-label">Rebounds per game:</span>
                        <span className="stat-value">{averages.reb}</span>
                    </div>

                    <div className="stat">
                        <span className="stat-label">Stocks per game:</span>
                        <span className="stat-value">
                            {Math.round((averages.stl + averages.blk) * 10) / 10}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
