import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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
          // Use mock data for demo
          setTimeout(() => {
            set({ 
                invoices: mockInvoices as Invoice[], 
                isLoading: false 
            });
          }, 100); // Simulate loading
        },

        // Fetch single invoice by ID
        fetchInvoiceById: async (id: string) => {
          set({ isLoading: true, error: null });
          // Use mock data for demo
          setTimeout(() => {
            const mockInvoice = mockInvoices.find(inv => inv.id === id) as Invoice | undefined;
            set({ 
                selectedInvoice: mockInvoice || null, 
                isLoading: false 
            });
          }, 100);
        },

        // Create Invoice
        createInvoice: async (invoiceData: InvoiceInsert) => {
          set({ isLoading: true, error: null });
          // Simulate API call with mock data
          setTimeout(() => {
            const newInvoice = {
              ...invoiceData,
              id: `inv-${Date.now()}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as Invoice;
            
            set((state) => ({
              invoices: [newInvoice, ...state.invoices],
              isLoading: false,
            }));
          }, 300);
        },

        // Update Invoice
        updateInvoice: async (id: string, updates: Omit<InvoiceUpdate, 'id'>) => {
          set({ isLoading: true, error: null });
          // Simulate API call with mock data
          setTimeout(() => {
            set((state) => ({
              invoices: state.invoices.map((inv) =>
                inv.id === id ? { ...inv, ...updates, updated_at: new Date().toISOString() } : inv
              ),
              isLoading: false,
            }));
          }, 300);
        },

        // Delete Invoice
        deleteInvoice: async (id: string) => {
          set({ isLoading: true, error: null });
          // Simulate API call with mock data
          setTimeout(() => {
            set((state) => ({
              invoices: state.invoices.filter((inv) => inv.id !== id),
              isLoading: false,
            }));
          }, 300);
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
  const invoices = useInvoiceStore((state) => state.invoices);
  const filterStatus = useInvoiceStore((state) => state.filterStatus);
  const searchQuery = useInvoiceStore((state) => state.searchQuery);

  // Memoize filtered invoices to prevent infinite loops
  return useMemo(() => {
    let filtered = invoices;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((inv) => inv.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(query) ||
          inv.client_name?.toLowerCase().includes(query) ||
          inv.client_email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [invoices, filterStatus, searchQuery]);
};

export const useDashboardStats = () => {
  const invoices = useInvoiceStore((state) => state.invoices);
  
  return useMemo(() => {
    const totalReceived = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const pending = invoices
      .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);

    const drafts = invoices
      .filter((inv) => inv.status === 'draft')
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalReceived,
      pending,
      drafts,
      totalInvoices: invoices.length,
    };
  }, [invoices]);
};
