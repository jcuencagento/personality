import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import CuencaLogo from '@/app/ui/cuenca-logo';


export default function SideNav() {
    const darkModeClasses = {
        navLink: 'bg-gray-800 text-white hover:bg-gray-600 hover:text-yellow-400',
        container: 'bg-black',
        divider: { backgroundColor: '#333' }, // Replace with your actual divider color
    };
      
    // Apply dark mode classes based on the state
    return (
        <div className={`flex h-full flex-col px-3 py-4 md:px-2 ${darkModeClasses.container}`}>
            <Link className={`mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40 ${darkModeClasses.navLink}`} href="/">
                <div className="w-32 text-black md:w-40">
                    <CuencaLogo />
                </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
                <div className="hidden h-auto w-full grow rounded-md md:block" style={darkModeClasses.divider}></div>
            </div>
        </div>
    );
}
