"use client";
import { BiSupport } from "react-icons/bi";

export default function Suport() {
    return (
        <button
            type="button"
            className="relative flex items-center justify-center p-3 rounded-xl bg-white/5 border border-gray/10 text-white transition-all duration-300 hover:bg-white/10 hover:border-blue/50 group"
        >
            <BiSupport
                size={22}
                className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            />

            <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            <span className="hidden lg:block ml-3 text-sm font-medium">
                Ajuda
            </span>

            <div className="absolute inset-0 rounded-xl bg-blue opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-10 pointer-events-none"></div>
        </button>
    );
}
