import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
    title: {
        template: '%s | Personality',
        default: '🛸 Cuenca Gento',
    },
    description: 'Personal Next.js Learnin Project with with App Router.'
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <meta name="color-scheme" content="dark light"></meta>
            <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
    );
}
