import { getFilms } from '@/app/lib/data';
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

    return (
        <main>
            <FilmsTable films={films} />
        </main>
    );
}
