"use client"
import { FiSearch } from "react-icons/fi"

export default function SearchBar() {
    return (
        <form className="w-full">
            <div className="relative flex items-center w-full">
                <input
                    type="text"
                    placeholder="Busque produtos gamers..."
                    className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 px-4 pr-14 text-sm text-white placeholder:text-zinc-500 outline-none transition-all
                    duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                    type="submit"
                    className="absolute right-2 flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white transition-all duration-300 hover:bg-blue-500 active:scale-95">
                    <FiSearch size={18} />
                </button>
            </div>
        </form>
    )
}   