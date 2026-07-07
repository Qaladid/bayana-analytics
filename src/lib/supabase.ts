import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser (client-component) Supabase client.
 * Call inside a 'use client' component or event handler.
 * For server components / API routes use createServerSupabaseClient() from supabase-server.ts.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
