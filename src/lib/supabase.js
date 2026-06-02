import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabasePublishableKey) : null;

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
}

export async function signOut() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
