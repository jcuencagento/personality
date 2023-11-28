import { montserrat } from '@/app/ui/fonts';
import { getToWatch } from '@/app/lib/data';
import { FilmsTable } from '@/app/lib/definitions';
import Image from 'next/image';

export default async function FilmsChart() {
    const films: FilmsTable[] = await getToWatch();

    if (!films || films.length === 0) {
        return <p className="mt-4 text-gray-400">No data available.</p>;
    }

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${montserrat.className} mb-1 md:text-xl`}>
                Next films to watch...
            </h2>
            <div className="rounded-xl bg-yellow-50 p-4">
                {films?.map((film) => (
                    <div
                        key={film.id}
                        className="mb-2 w-full rounded-md text-black bg-gray-500 p-4">
                        <div
                            className="flex items-center gap-3">
                            <Image
                                src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}
                                alt={`${film.title}'s picture`}
                                width={53}
                                height={53}
                            />
                            <div>
                                <p className="font-bold text-lg">{film.title}</p>
                                <p>{film.vote_average} <span role="img" aria-label="star">⭐</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
