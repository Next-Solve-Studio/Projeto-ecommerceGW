"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CircularProgress } from "@mui/material";

/**
 * Componente de guarda para rotas administrativas.
 * Verifica se o usuário está autenticado. Se não estiver, redireciona para o login.
 */
export default function AdminGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <CircularProgress sx={{ color: "var(--color-blue)" }} />
            </div>
        );
    }

    return <>{children}</>;
}
