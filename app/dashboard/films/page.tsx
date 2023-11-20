import { getFilms, fetchAverages } from '@/app/lib/data';
import FilmsTable from '@/app/ui/films/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Films',
};

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const films = await getFilms(query);
    const haliburton_averages = await fetchAverages('haliburton');
    console.log(haliburton_averages);
    return (
        <main>
            <p>{haliburton_averages.games_played}</p>
            <FilmsTable films={films} />
        </main>
    );
}
