import { fetchMySongs } from '@/app/lib/data';
import SongsTable from '@/app/ui/music/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Songs',
};

export default async function Page({ }: { }) {
    const songs = await fetchMySongs();
    return (
        <main>
            <SongsTable songs={songs} />
        </main>
    );
}
