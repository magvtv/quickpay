export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string // Must match auth.users.id
          email: string
          full_name?: string | null
          company_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          company_name: string | null
          address: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          company_name?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          company_name?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          invoice_number: string
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          subtotal: number
          tax_rate: number
          tax_amount: number
          total: number
          notes: string | null
          is_recurring: boolean
          recurring_frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null
          created_at: string
          updated_at: string
          // Legacy fields (if you want to keep them for backward compatibility)
          client_name?: string
          client_email?: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          invoice_number: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date?: string
          due_date: string
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          total: number
          notes?: string | null
          is_recurring?: boolean
          recurring_frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null
          created_at?: string
          updated_at?: string
          client_name?: string
          client_email?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          invoice_number?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date?: string
          due_date?: string
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          total?: number
          notes?: string | null
          is_recurring?: boolean
          recurring_frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null
          created_at?: string
          updated_at?: string
          client_name?: string
          client_email?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          amount?: number
          order?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string
          amount: number
          payment_date: string
          payment_method: 'bank_transfer' | 'card' | 'cash' | 'mpesa' | 'other'
          reference: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          amount: number
          payment_date?: string
          payment_method: 'bank_transfer' | 'card' | 'cash' | 'mpesa' | 'other'
          reference?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          amount?: number
          payment_date?: string
          payment_method?: 'bank_transfer' | 'card' | 'cash' | 'mpesa' | 'other'
          reference?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<string, never>
        Returns: string
      }
      update_invoice_status: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
