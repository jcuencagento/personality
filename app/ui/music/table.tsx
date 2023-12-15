import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { MySong } from '@/app/lib/definitions';
import SongComponent from './song-component';

export default async function SongsTable({
    songs,
} : {
    songs: MySong[];
}) {
    return (
        <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
            My 2023 Spotify recommendations!
        </h1>
        <Search placeholder="Search songs..." />
        <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                <div className="md:hidden">
                    {songs?.map((song) => (
                    <div
                        key={song.track.id}
                        className="mb-2 w-full rounded-md bg-white p-4"
                    >
                        <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <div className="mb-2 flex items-center">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={song.track.album.images[0].url}
                                    alt={`${song.track.name}'s picture`}
                                    width={80}
                                    height={80}
                                />
                                <p>{song.track.name}</p>
                            </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                <a href={song.track.artists[0].external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                    {song.track.artists[0].name}
                                </a>
                            </p>
                        </div>
                        </div>
                        <div className="flex w-full items-center justify-between border-b py-5">
                        <div className="flex w-1/2 flex-col">
                            <p className="text-xs">Album</p>
                            <a href={song.track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                <p className="font-big">{song.track.album.name}</p>
                            </a>
                        </div>
                        <div className="flex w-1/2 flex-col">
                            <p className="text-xs">Popularity</p>
                            <p className="font-big">{song.track.popularity}</p>
                        </div>
                        </div>
                        <div className="pt-4 text-sm">
                        <p>Explicit {song.track.explicit}</p>
                        </div>
                    </div>
                    ))}
                </div>
                <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                    <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-4 py-5 font-big sm:pl-6">
                        Song
                        </th>
                        <th scope="col" className="px-3 py-5 font-big">
                        Artist
                        </th>
                        <th scope="col" className="px-3 py-5 font-big">
                        Album
                        </th>
                        <th scope="col" className="px-3 py-5 font-big">
                        Popularity
                        </th>
                        <th scope="col" className="px-4 py-5 font-big">
                        Explicit
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-gray-900">
                    {songs?.map((song) => (
                        <tr key={song.track.id} className="group">
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                            <SongComponent song={song.track}  chart={false}/>
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            <a href={song.track.artists[0].external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                <p className="font-bold text-lg">{song.track.artists[0].name}</p>
                            </a>
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            <a href={song.track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                <p className="font-bold text-lg">{song.track.album.name}</p>
                            </a>
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            <p className="font-bold text-lg">{song.track.popularity} <span role="img" aria-label="star">⭐</span></p>
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                            <p className="font-bold text-lg">{song.track.explicit ? <span role="img" aria-label="no">🔞</span> : <span role="img" aria-label="ok">🆗</span>}</p>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
        </div>
  );
}
