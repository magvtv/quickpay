import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { mockInvoices, mockClients, mockPayments } from '@/lib/mockData';
import type { Database } from '@/types/database';

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
    filterStatus: 'all' | 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    searchQuery: string;

    fetchInvoices: () => Promise<void>;
    fetchInvoiceById: (id: string) => Promise<void>;
    createInvoice: (data: InvoiceInsert) => Promise<void>;
    updateInvoice: (id: string, data: Omit<InvoiceUpdate, 'id'>) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;

    selectInvoice: (invoice: Invoice | null) => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    openModal: (invoice: Invoice) => void;
    closeModal: () => void;
    setFilterStatus: (status: 'all' | 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled') => void;
    setSearchQuery: (query: string) => void;
}

// Zustand Store
export const useInvoiceStore = create<InvoiceStore>()(
  devtools(
    (set, get) => ({
        // Initial State
        invoices: [],
        selectedInvoice: null,
        isLoading: false,
        error: null,
        isDrawerOpen: false,
        isModalOpen: false,
        filterStatus: 'all',
        searchQuery: '',
        
        // Fetch all invoices
        fetchInvoices: async () => {
          set({ isLoading: true, error: null });
          try {
            const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .order('created_at', { ascending: false });

            // If Supabase returns data successfully, use it
            if (!error && data && data.length > 0) {
              set({ 
                  invoices: data, isLoading: false 
              });
              return;
            }

            // Otherwise, fall back to mock data
            console.log('Using mock data as fallback');
            set({ 
                invoices: mockInvoices as Invoice[], 
                isLoading: false 
            });
          } catch (error: unknown) {
            // If there's an error connecting to Supabase, use mock data
            console.log('Error connecting to Supabase, using mock data:', error);
            set({
              invoices: mockInvoices as Invoice[], 
              isLoading: false,
              error: null // Clear error since we have fallback data
            });
          }
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

            // If Supabase returns data successfully, use it
            if (!error && data) {
              set({ 
                  selectedInvoice: data, isLoading: false 
              });
              return;
            }

            // Otherwise, fall back to mock data
            const mockInvoice = mockInvoices.find(inv => inv.id === id) as Invoice | undefined;
            set({ 
                selectedInvoice: mockInvoice || null, 
                isLoading: false 
            });
          } catch (error: unknown) {
            // If there's an error connecting to Supabase, use mock data
            const mockInvoice = mockInvoices.find(inv => inv.id === id) as Invoice | undefined;
            set({ 
              selectedInvoice: mockInvoice || null, 
              isLoading: false,
              error: null // Clear error since we have fallback data
            });
            return null;
          }
        },

        // Create Invoice
        createInvoice: async (invoiceData: InvoiceInsert) => {
          set({ isLoading: true, error: null });
          try {
            const { error } = await (supabase
              .from('invoices') as any)
              .insert([invoiceData]);
            
            if (error) throw error;
            await get().fetchInvoices();
            set({ isLoading: false });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create invoice';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
          }
        },

        // Update Invoice
        updateInvoice: async (id: string, updates: Omit<InvoiceUpdate, 'id'>) => {
          set({ isLoading: true, error: null });
          try {
            // Update invoice - exclude id from updates
            const updateData = updates as Partial<InvoiceUpdate>;
            const { error } = await (supabase
              .from('invoices') as any)
              .update(updateData)
              .eq('id', id);

            if (error) throw error;

            // Refresh invoices
            await get().fetchInvoices();
            set({ isLoading: false });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update invoice';
            set({ 
              error: errorMessage, 
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
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete invoice';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
          }
        },

        // UI Actions
        selectInvoice: (invoice) => set({ selectedInvoice: invoice }),
        openDrawer: () => set({ isDrawerOpen: true }),
        closeDrawer: () => set({ isDrawerOpen: false }),
        openModal: (invoice) => set({ selectedInvoice: invoice, isModalOpen: true }),
        closeModal: () => set({ isModalOpen: false }),
        setFilterStatus: (status) => set({ filterStatus: status }),
        setSearchQuery: (query) => set({ searchQuery: query }),
      }),
    { name: 'invoice-store' }
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
          inv.client_name?.toLowerCase().includes(query) ||
          inv.client_email?.toLowerCase().includes(query)
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
