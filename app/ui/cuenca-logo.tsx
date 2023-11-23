import Image from 'next/image';
import { montserrat } from '@/app/ui/fonts';

export default function CuencaLogo({ width = 100 }) {
    return (
        <div 
            className={`${montserrat.className}
            flex flex-col items-center justify-center text-white
            md:max-w-[${width}%] lg:max-w-[${width}%]`}
        >
            <div className="rounded mb-2">
                <Image src="/levi.jpg" alt="Logo" width={100} height={100} layout="responsive" />
            </div>
            <p className="text-xl">PERSONALITY</p>
        </div>
    );
}
