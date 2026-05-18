"use client";

// src/context/AuthContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// ─── Constantes ────────────────────────────────────────────────────────────────
// Espelha o cookie do proxy — garante logout mesmo sem passar pelo servidor
const LAST_ACTIVE_KEY = "nexplay_last_active";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (
        email: string,
        password: string,
    ) => Promise<{ error: Error | null }>;
    signUp: (
        email: string,
        password: string,
        name: string,
    ) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

// ─── Contexto ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const supabase = createClient();

    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const updateLastActive = useCallback(() => {
        localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    }, []);

    // Verificação client-side de inatividade (camada extra além do proxy)
    const checkInactivity = useCallback(async () => {
        const raw = localStorage.getItem(LAST_ACTIVE_KEY);
        if (!raw) return;
        if (Date.now() - parseInt(raw, 10) > THIRTY_DAYS_MS) {
            await supabase.auth.signOut();
            localStorage.removeItem(LAST_ACTIVE_KEY);
        }
    }, [supabase]);

    useEffect(() => {
        const init = async () => {
            await checkInactivity();

            const {
                data: { session },
            } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            if (session) updateLastActive();

            setLoading(false);
        };

        init();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session) updateLastActive();
        });

        return () => subscription.unsubscribe();
    }, [checkInactivity, updateLastActive, supabase]);

    const signIn = useCallback(
        async (email: string, password: string) => {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (!error) updateLastActive();
            return { error };
        },
        [supabase, updateLastActive],
    );

    const signUp = useCallback(
        async (email: string, password: string, name: string) => {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });
            if (!error) updateLastActive();
            return { error };
        },
        [supabase, updateLastActive],
    );

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        localStorage.removeItem(LAST_ACTIVE_KEY);
    }, [supabase]);

    return (
        <AuthContext.Provider
            value={{ user, session, loading, signIn, signUp, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
    return ctx;
}
