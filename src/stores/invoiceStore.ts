import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';  
import { is } from 'zod/locales';

// Types
type Invoice = Database['public']['Tables']['invoices']['Row'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  order: number;
}

interface InvoiceStore {
    invoices: Invoice[];
    selectedInvoice: Invoice | null;
    isLoading: boolean;
    error: string | null;
    isDrawerOpen: boolean;
    isModalOpen: boolean;
   

    fetchInvoices: () => Promise<void>;
    fetchInvoiceById: (id: string) => Promise<void>;
    createInvoice: (data: InvoiceInsert) => Promise<void>;
    updateInvoice: (id: string, data: InvoiceUpdate) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;

    selectInvoice: (invice: Invoice | null) => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    openModal: (invoice: Invoice) => void;
    closeModal: () => void;
}

// Zustand Store
export const useInvoiceStore = create<InvoiceStore>()(
  devtools((set, get) => ({
        // Initial State
        invoices: [],
        selectedInvoice: null,
        isLoading: false,
        error: null,
        isDrawerOpen: false,
        isModalOpen: false,
        
        // Fetch all invoices
        fetchInvoices: async () => {
          set({ isLoading: true, error: null });
          try {
            const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .order('created_at', { ascending: false });

            if (error) throw error;
            set({ 
                invoices: data || [], isLoading: false 
            });
          } catch (error: any) {
            set({
                error: error.message, isLoading: false
            })
          };
        },

        // Fetch single invoice by ID
        fetchInvoiceById: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const { data, error } = await supabase
              .from('invoices')
              .select('*')
              .eq('id', id)
              .single();

            if (error) throw error;
            set({ 
                selectedInvoice: data, isLoading: false 
            });
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
            return null;
          }
        },

        // Create Invoice
        createInvoice: async (invoiceData: InvoiceInsert) => {
          set({ isLoading: true, error: null });
          try {
            const { error } = await supabase
            .from('invoices')
            .insert([invoiceData]);
            
            if (error) throw error;
            await get().fetchInvoices();
            set({ isLoading: false });
          } catch (error: any) {
                set({ 
                    error: error.message, 
                    isLoading: false 
                });
            };
        },

        // Update Invoice
        updateInvoice: async (id: string, updates: InvoiceUpdate) => {
          set({ isLoading: true, error: null });
          try {
            // Update invoice
            const { error } = await supabase
              .from('invoices')
              .update(updates)
              .eq('id', id);

            if (error) throw error;

            // Refresh invoices
            await get().fetchInvoices();
            set({ isLoading: false });
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
          }
        },

        // Delete Invoice
        deleteInvoice: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const { error } = await supabase
              .from('invoices')
              .delete()
              .eq('id', id);

            if (error) throw error;

            set((state) => ({
              invoices: state.invoices.filter((inv) => inv.id !== id),
              isLoading: false,
            }));
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
          }
        },

        // UI Actions
        selectInvoice: (invoice) => set({ selectedInvoice: invoice }),
        openDrawer: () => set({ isDrawerOpen: true }),
        closeDrawer: () => set({ isDrawerOpen: false }),
        openModal: (invoice) => set({ selectedInvoice: invoice, isModalOpen: true }),
        closeModal: () => set({ isModalOpen: false })
      }),
    )
  )
);

// Computed Selectors
export const useFilteredInvoices = () => {
  return useInvoiceStore((state) => {
    let filtered = state.invoices;

    // Filter by status
    if (state.filterStatus !== 'all') {
      filtered = filtered.filter((inv) => inv.status === state.filterStatus);
    }

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(query) ||
          inv.client?.name.toLowerCase().includes(query) ||
          inv.client?.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  });
};

export const useDashboardStats = () => {
  return useInvoiceStore((state) => {
    const totalReceived = state.invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const pending = state.invoices
      .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);

    const drafts = state.invoices
      .filter((inv) => inv.status === 'draft')
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalReceived,
      pending,
      drafts,
      totalInvoices: state.invoices.length,
    };
  });
};
