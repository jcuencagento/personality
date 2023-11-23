'use client';

import { HomeIcon, MusicalNoteIcon, FilmIcon, PowerIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    { name: 'Home of Personality', href: '/dashboard', icon: HomeIcon },
    { name: 'Music & Podcasts', href: '/dashboard/music', icon: MusicalNoteIcon },
    { name: 'Films & Shows', href: '/dashboard/films', icon: FilmIcon },
    { name: 'Sports & Health', href: '/dashboard/sports', icon: PowerIcon }
];

export default function NavLinks() {
    const pathname = usePathname();
    const darkModeClasses = {
        linkContainer: 'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-800 p-3 text-sm font-medium hover:bg-gray-600 hover:text-yellow-500 md:flex-none md:justify-start md:p-2 md:px-3',
        activeLink: 'bg-yellow-500 text-black',
        linkText: 'hidden md:block text-white'
    };
    
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            darkModeClasses.linkContainer,
                            { [darkModeClasses.activeLink]: pathname === link.href },
                        )}>
                        <LinkIcon className="w-6" />
                        <p className={darkModeClasses.linkText}>{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
