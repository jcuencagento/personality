import { montserrat } from '@/app/ui/fonts';
import { fetchSongs } from '@/app/lib/data';
import { Song } from '@/app/lib/definitions';
import SongComponent from '../music/song-component';

export default async function MusicChart() {
    const songs: Song[] = await fetchSongs();

    if (!songs || songs.length === 0) {
        return <p className="mt-4 text-gray-400">No data available.</p>;
    }

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${montserrat.className} mb-1 md:text-xl`}>
                Try out todays recommendations...
            </h2>
            <div className="rounded-xl bg-yellow-50 p-4">
                {songs?.filter((song) => song.preview_url).slice(0, 4).map((song) => (
                    <div
                        key={song.id}
                        className="mb-2 w-full rounded-md text-black bg-gray-500 p-4">
                        <SongComponent song={song} />
                    </div>
                ))}
            </div>
        </div>
    );
}
