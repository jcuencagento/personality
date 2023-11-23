import CuencaLogo from '@/app/ui/cuenca-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
    return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow flex flex-col p-6 bg-black text-white">
                    <div className="flex items-end rounded-lg bg-gray-800 p-4 md:h-42 lg:h-62 mx-auto md:max-w-[40%] lg:max-w-[40%]">
                        <CuencaLogo width={40}/>
                    </div>
                    <div className="flex justify-center mt-8">
                        <Link href="/dashboard" className="bg-gray-800 hover:bg-gray-700 text-xl text-white font-bold py-14 px-20 rounded-lg flex items-center gap-2">
                            <ArrowRightIcon className="w-10 h-10" />
                            <span><h1>GET INTO IT!</h1></span>
                        </Link>
                    </div>
                </main>
                <footer className="text-center bg-black py-4">
                    <h3>With 🧠 by Javier Cuenca Gento</h3>
                </footer>
            </div>
    );
}
