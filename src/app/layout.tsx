import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/layout/header/Header";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
    title:
        "Flowfun Suplementos || Sua loja online de suplementos, saúde e performance",

    description:
        "Na Flowfun Suplementos, você encontra os melhores suplementos para potencializar seus resultados: whey protein, creatina, pré-treinos, vitaminas, aminoácidos e muito mais. Produtos de alta qualidade, preços acessíveis e ofertas exclusivas para ajudar você a alcançar sua melhor performance.",

    keywords: [
        "Suplementos",
        "Loja de Suplementos",
        "Whey Protein",
        "Creatina",
        "Pré-Treino",
        "Hipercalórico",
        "BCAA",
        "Aminoácidos",
        "Vitaminas",
        "Suplementos Fitness",
        "Suplementos Academia",
        "Nutrição Esportiva",
        "Performance Fitness",
        "Ganhar Massa Muscular",
        "Emagrecimento",
        "Saúde e Performance",
        "Flowfun Suplementos",
    ],

    authors: [{ name: "Flowfun Suplementos", url: "" }],

    icons: {
        icon: "/logoflowfun.png",
    },

    openGraph: {
        title:
            "Flowfun Suplementos - Energia, Performance e Resultados",
        description:
            "Encontre os melhores suplementos para academia e performance esportiva na Flowfun Suplementos. Whey, creatina, pré-treinos, vitaminas e muito mais com ofertas exclusivas.",
        url: "",
        siteName: "Flowfun Suplementos",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Flowfun Suplementos - Loja de Suplementos Fitness",
            },
        ],
        locale: "pt_BR",
        type: "website",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={`h-full antialiased`}>
            <Header />
            <AuthProvider>
                <body className="min-h-full flex flex-col">{children}<Toaster /></body>
            </AuthProvider>
        </html>
    );
}
