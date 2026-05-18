import AdminGuard from "@/components/admin/AdminGuard";
import { AuthProvider } from "@/context/AuthContext";

/**
 * Layout para rotas administrativas.
 * Aplica o AdminGuard para garantir que apenas usuários logados acessem.
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AdminGuard>{children}</AdminGuard>
        </AuthProvider>
    );
}
