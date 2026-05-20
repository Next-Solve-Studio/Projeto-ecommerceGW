"use client";
import { FaCartShopping } from "react-icons/fa6";

export default function Cart() {
    return (
        <button
            type="button"
            className="relative flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-gray/10 text-white transition-all duration-300 hover:bg-white/10 hover:border-gold/50 group"
        >
            <FaCartShopping
                size={22}
                className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
            />
            <span className="hidden lg:block ml-3 text-sm font-medium">
                Carrinho
            </span>

            <div className="absolute inset-0 rounded-xl bg-gold opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-10 pointer-events-none"></div>
        </button>
    );
}
