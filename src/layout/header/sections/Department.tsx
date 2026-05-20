"use client";
import { useState } from "react";
import Link from "next/link";
import { HiMenuAlt1, HiChevronDown, HiChevronRight } from "react-icons/hi";

export default function Department() {
    const [isOpen, setIsOpen] = useState(false);

    type ItemType = {
        id: number;
        label: string;
        href: string;
    };

    const linksNav: ItemType[] = [
        { id: 1, label: "EvoroX", href: "/" },
        { id: 2, label: "Black Skull", href: "/" },
        { id: 3, label: "VitaFor", href: "/" },
        { id: 4, label: "Max Titanium", href: "/" },
        { id: 5, label: "Dux", href: "/" },
        { id: 6, label: "DR. Peanut", href: "/" },
        { id: 7, label: "SyntheSize", href: "/" },
    ];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-t-lg transition-all duration-300 font-bold text-sm uppercase tracking-wide
                    ${isOpen ? "bg-white text-black" : "bg-gold text-black hover:scale-105"}`}
            >
                <HiMenuAlt1 size={20} />
                Categorias
                <HiChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <nav
                    onMouseLeave={() => setIsOpen(false)}
                    className="absolute top-full left-0 w-64 bg-white border-t-2 border-gold shadow-2xl rounded-b-lg overflow-hidden z-60 animate-in fade-in slide-in-from-top-2 duration-200"
                    aria-label="Menu de departamentos"
                >
                    <ul className="py-2">
                        {linksNav.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className="flex items-center justify-between px-5 py-3 text-black hover:bg-gold/10 hover:text-gold transition-colors duration-200 group"
                                >
                                    <span className="text-sm font-medium tracking-tight">
                                        {item.label}
                                    </span>

                                    <HiChevronRight
                                        size={14}
                                        className="text-gray group-hover:text-gold transform transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="bg-gray-50 p-3 border-t border-gray-100">
                        <Link
                            href="/"
                            className="block text-center text-[10px] uppercase font-bold text-gray hover:text-gold transition-colors duration-200"
                        >
                            Ver todos os departamentos
                        </Link>
                    </div>
                </nav>
            )}
        </div>
    );
}
