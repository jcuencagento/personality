import NBAWrapper from '@/app/ui/dashboard/nba-cards';
import MusicChart from '@/app/ui/dashboard/music-chart';
import FilmsChart from '@/app/ui/dashboard/films-chart';
import { montserrat } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
    return (
        <main style={{ height: '100%' }}>
            <h2 className={`${montserrat.className} mb-1 md:text-xl`}>
                Fav NBA players rn!
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <Suspense fallback={<CardsSkeleton />}>
                    <NBAWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <MusicChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <FilmsChart />
                </Suspense>
            </div>
            <footer style={{ marginTop: '0.5vh' }} className="text-center py-4">
                <h3>With 🧠 by Javier Cuenca Gento</h3>
            </footer>
        </main>
    );
}
