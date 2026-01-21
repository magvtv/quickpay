import { createClient } from "@supabase/supabase-js"; 
import { Database } from "../types/database";

// Environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variables. Check your .env.local file.'
  );
}

// Supabase Client Browser
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
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
export function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
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
}

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

  const { error } = await supabase.storage
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
interface SupabaseError {
  code?: string;
  message?: string;
}

export const handleSupabaseError = (error: unknown): string => {
  const supabaseError = error as SupabaseError;
  
  if (supabaseError?.code === 'PGRST116') {
    return 'No data found';
  }
  if (supabaseError?.code === '23505') {
    return 'This record already exists';
  }
  if (supabaseError?.code === '23503') {
    return 'Related record not found';
  }
  if (supabaseError?.message) {
    return supabaseError.message;
  }
  return 'An unexpected error occurred';
};