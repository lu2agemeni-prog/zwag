import { createClient } from "@supabase/supabase-js";

// Retrieve configuration keys with direct fallback to ensure seamless operation
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || "https://ckuvpjbxperbbbunjsph.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdXZwamJ4cGVyYmJidW5qc3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTU1MjcsImV4cCI6MjA5ODIzMTUyN30.btpPyFgMK6MvISLELcs5U6fMGDWDNDYLtyILYjHVwPc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

