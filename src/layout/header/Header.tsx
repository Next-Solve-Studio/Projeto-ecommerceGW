"use client";
import { useEffect, useState } from "react";
/* import { usePathname } from "next/navigation" */
import Logo from "./sections/Logo";
import SearchBar from "./sections/SearchBar";
import Buttons from "./sections/Buttons";
import Department from "./sections/Department";
import Navigation from "./sections/Navigation";
import Sidebar from "./sections/Sidebar";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    /*   const pathname = usePathname(); */

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkScreen();

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", checkScreen);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkScreen);
        };
    }, []);

    return (
        <header
            className={
                "w-full fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out bg-black"
            }
        >
            <div className="max-w-360 mx-auto px-4 md:px-8">
                <section className="flex items-center m-0 justify-between py-4 gap-6">
                    <div className="shrink-0">
                        <Logo />
                    </div>

                    {!isMobile && (
                        <div className="grow max-w-2xl">
                            <SearchBar />
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {!isMobile ? <Buttons /> : <Sidebar />}
                    </div>
                </section>

                {!isMobile && (
                    <section className="flex items-center justify-between py-2 border-t border-gray/10">
                        <div className="flex items-center gap-8">
                            <Department />
                            <Navigation />
                        </div>
                    </section>
                )}

                {isMobile && (
                    <div className="pb-4">
                        {" "}
                        <SearchBar />
                    </div>
                )}
            </div>
        </header>
    );
}
