"use client"
import Link from "next/link"
import { HiOutlineTicket, HiOutlineLightningBolt } from "react-icons/hi"; 

export default function Navigation() {
    type ItemType = {
        id: number;
        label: string;
        href: string;
    }

    const buttonsNav: ItemType[] = [
        { id: 1, label: 'Cupons', href: '/' },
        { id: 2, label: 'Mais Vendidos', href: '/' },
    ];

    const linksNav: ItemType[] = [
        { id: 1, label: 'Hardwares', href: '/' },
        { id: 2, label: 'PC Gamer', href: '/' },
        { id: 3, label: 'Computadores', href: '/' },
        { id: 4, label: 'Notebooks', href: '/' },
        { id: 5, label: 'Periféricos', href: '/' },
        { id: 6, label: 'Monitores', href: '/' },
    ];

    return (
        <nav className="flex items-center gap-8">
            <div className="flex items-center gap-3">
                {buttonsNav.map((item) => (
                    <Link key={item.id} href={item.href}
                        className="group relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(121,196,242,0.4)]">
                        {item.id === 1 ? <HiOutlineTicket size={16} /> : <HiOutlineLightningBolt size={16} />}
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="w-px h-4 bg-gray/30"></div>

            <ul className="flex items-center gap-6">
                {linksNav.map((link) => (
                    <li key={link.id}>
                        <Link href={link.href} className="relative text-sm font-medium text-gray transition-colors duration-300 hover:text-white group">
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}