"use client";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            aria-label="Voltar para a home"
            className="flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95"
        >
            <div className="relative w-55.5 h-25.5 md:w-60 md:h-20">
                <Image
                    src="/logoflowfun.png"
                    alt="NextPlay Logo"
                    fill
                    priority
                    className="object-contain"
                />
            </div>
        </Link>
    );
}
