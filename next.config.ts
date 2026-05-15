import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                pathname: "/**",
            },
            {
                protocol: 'https',
                hostname: 'xbipdhhbepkmopdbromp.supabase.co',
                pathname: '/storage/v1/object/public/**', // permite qualquer imagem dentro do bucket público
            },
        ],
    },
};

export default nextConfig;
