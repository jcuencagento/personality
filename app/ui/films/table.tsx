import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { FilmsTable } from '@/app/lib/definitions';

export default async function FilmsTable({
    films
}: {
    films: FilmsTable[];
}) {
    return (
        <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
            Films
        </h1>
        <Search placeholder="Search films..." />
        <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                <div className="md:hidden">
                    {films?.map((film) => (
                    <div
                        key={film.id}
                        className="mb-2 w-full rounded-md bg-white p-4"
                    >
                        <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <div className="mb-2 flex items-center">
                            <div className="flex items-center gap-3">
                                <Image
                                src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}
                                alt={`${film.title}'s picture`}
                                width={50}
                                height={50}
                                />
                                <p>{film.title}</p>
                            </div>
                            </div>
                            <p className="text-sm text-gray-500">
                            Released in {film.release_date}
                            </p>
                        </div>
                        </div>
                        <div className="pt-4 text-sm">
                            <p className="font-bold text-lg">
                                {Math.round(parseFloat(film.vote_average) * 10) / 10}<span role="img" aria-label="star">⭐</span>
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
                <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                    <thead className="rounded-md bg-gray-50 text-left text-medium font-big">
                    <tr>
                        <th scope="col" className="px-10 py-10 font-big sm:pl-6">
                        Movie
                        </th>
                        <th scope="col" className="px-10 py-10 font-big">
                        Release Date
                        </th>
                        <th scope="col" className="px-10 py-10 font-big">
                        Average Voting
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-gray-900">
                    {films.map((film) => (
                        <tr key={film.id} className="group">
                        <td className="whitespace-nowrap bg-white py-8 pl-6 pr-4 text-medium text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                            <div className="flex items-center gap-3">
                            <Image
                                src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}
                                alt={`${film.title}'s picture`}
                                width={80}
                                height={80}
                            />
                            <p className="font-bold text-lg">{film.title}</p>
                            </div>
                        </td>
                        <td className="whitespace-nowrap bg-white px-8 py-8 text-big">
                            <p className="font-bold text-lg">{film.release_date}</p>
                        </td>
                        <td className="whitespace-nowrap bg-white px-8 py-8 text-big group-first-of-type:rounded-md group-last-of-type:rounded-md">
                            <p className="font-bold text-lg">
                                {Math.round(parseFloat(film.vote_average) * 10) / 10}<span role="img" aria-label="star">⭐</span>
                            </p>
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
