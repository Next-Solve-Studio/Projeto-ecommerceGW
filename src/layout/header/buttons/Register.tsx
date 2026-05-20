"use client";
import { FaUserAlt } from "react-icons/fa";

export default function Register() {
    return (
        <button
            type="button"
            className="relative flex items-center justify-center p-3 rounded-xl bg-white/5 border border-gray/10 text-white transition-all duration-300 hover:bg-white/10 hover:border-gold/50 group"
        >
            <FaUserAlt
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
            />

            <div className="hidden lg:flex flex-col items-start ml-3 leading-tight">
                <span className="text-[10px] text-gray uppercase tracking-wider">
                    Olá, faça seu
                </span>
                <span className="text-sm font-bold tracking-wide">
                    Login ou Cadastro
                </span>
            </div>

            <div className="absolute inset-0 rounded-xl bg-gold opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-10 pointer-events-none"></div>
        </button>
    );
}
