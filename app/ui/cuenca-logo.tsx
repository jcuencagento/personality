import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';

export default function CuencaLogo() {
    return (
        <div className={`${lusitana.className} flex flex-row items-center justify-center text-white`}>
            <Image
                src="/gabi2.jpg"
                width={100}
                height={80}
                alt="Logo"
            />
            <p className="text-[22px] ">Cuenca Gento</p>
        </div>
    );
}
