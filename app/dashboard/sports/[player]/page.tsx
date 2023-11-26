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
    console.log(averages);

    if (!averages) {
        notFound();
    }

     return (
        <div className="player-page">
            <Link key={player} href="/dashboard/sports" className="back-button">Back...</Link>
            <div className="card">
                <div className="player-info">
                    <p className="player-name">{player}</p>
                    <Image 
                        src={`/players/${player}.jpg`}
                        alt={player}
                        width={1000}
                        height={1000}
                        quality={100}
                        className="player-image-personal"
                    />
                </div>
                <div className="player-stats">
                    <p>With {averages.games_played} games played</p>
                    <p>Points per game: {averages.pts}</p>
                    <p>Assists per game: {averages.ast}</p>
                    <p>Rebounds per game: {averages.reb}</p>
                    <p>Steals per game: {averages.stl}</p>
                    <p>Blocks per game: {averages.blk}</p>
                </div>
            </div>
        </div>
    );
}
