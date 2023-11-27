import NBAWrapper from '@/app/ui/dashboard/nba-cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { montserrat } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
    return (
        <main style={{ height: '100%' }}>
            <h2 className={`${montserrat.className} mb-4 text-xl md:text-2xl`}>
                Fav NBA players rn!
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <NBAWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <p>Hola</p>
                </Suspense>
            </div>
            <footer style={{ marginTop: '3vh' }} className="text-center py-4">
                <h3>With 🧠 by Javier Cuenca Gento</h3>
            </footer>
        </main>
    );
}
