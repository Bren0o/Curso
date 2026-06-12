import { createClient } from "@supabase/supabase-js";

// Chaves vêm de variáveis de ambiente (.env local / painel da Vercel).
// A anon key é pública por design — a proteção real é o RLS no banco.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sem as chaves o app funciona normalmente, só com localStorage.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
