import type { Metadata } from "next";
import "./globals.css";

import Header from "@/layout/header/Header";


export const metadata: Metadata = {
    title: "NexPlay - A Melhor Loja Gamer do Brasil",

    description: "Na NexPlay, você encontra os melhores produtos para o seu setup: computadores gamers, notebooks, periféricos e acessórios de alta qualidade. Tudo o que você precisa para elevar sua experiência está aqui! Aproveite nossas ofertas e promoções exclusivas e venha conferir tudo o que a NexPlay tem para você.",

  keywords: [
    "Computadores Gamers",
    "Setup Gamer",
    "Notebook Gamer",
    "Periféricos Gamer",
    "Mouse Gamer",
    "Teclado Mecânico",
    "Headset Gamer",
    "Monitor Gamer",
    "Cadeiras Gamer",
    "Hardware de Alta Performance",
    "PC Gamer Completo",
    "Acessórios para Setup",
    "Tecnologia Gamer",
    "Promoções Gamer",
    "NexPlay"
],

    authors: [{ name: "NexPlay Shop", url: "" }],

    icons: {
        icon: "/logonextplay.png",
    },

    openGraph: {
        title: "NexPlay - A Melhor Loja Gamer do Brasil",
        description:
            "Explore projetos de alta performance, de sistemas de gestão financeira a e-commerces institucionais, desenvolvidos com as tecnologias mais modernas do mercado.",
        url: "",
        siteName: "NexPlay",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Site de Vendas de Produtos Gamers",
            },
        ],
        locale: "pt_BR",
        type: "website",
    },

    robots: {
        index: true,
        follow: true,
    },
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
