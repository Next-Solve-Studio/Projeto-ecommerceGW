import type { Metadata } from "next";
import "./globals.css";

import Header from "@/layout/header/Header";


export const metadata: Metadata = {
    title: "E-Commerce",
    description: "Loja de Games",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={`h-full antialiased`}>
            <Header />
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
