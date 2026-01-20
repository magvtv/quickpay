import { createClient } from "@supabase/supabase-js"; 
import { Database } from "../types/database";

// Environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check your .env.local file.'
  );
}

// Supabase Client Browser
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'quickpay-dashboard',
    },
  },
});

// Supabase Client Server-Side

// Database Types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Real-time Subscription

// Storage Helpers
export const uploadInvoiceAttachment = async (
  file: File,
  invoiceId: string
) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${invoiceId}-${Date.now()}.${fileExt}`;
  const filePath = `invoices/${fileName}`;

  const { data, error } = await supabase.storage
    .from('attachments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('attachments')
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: publicUrl.publicUrl,
  };
};


// Error Handlers
export const handleSupabaseError = (error: any): string => {
  if (error?.code === 'PGRST116') {
    return 'No data found';
  }
  if (error?.code === '23505') {
    return 'This record already exists';
  }
  if (error?.code === '23503') {
    return 'Related record not found';
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};