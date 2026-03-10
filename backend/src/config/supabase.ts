import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

// Client avec la clé anon — pour les opérations côté utilisateur
export const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);

// Client avec la clé service_role — pour les opérations admin (bypass RLS)
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);
