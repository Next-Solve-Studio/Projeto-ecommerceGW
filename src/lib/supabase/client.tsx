import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
    throw new Error(
        "Variável de ambiente NEXT_PUBLIC_SUPABASE_URL não definida.",
    );
}
if (!supabaseKey) {
    throw new Error(
        "Variável de ambiente NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY não definida.",
    );
}

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);
