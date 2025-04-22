import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a singleton instance to prevent multiple instances
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (supabaseClient) return supabaseClient

  supabaseClient = createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        detectSessionInUrl: false, // We'll handle this manually in the callback page
        persistSession: true,
        storageKey: "supabase-auth-token",
      },
    },
  })

  return supabaseClient
}
