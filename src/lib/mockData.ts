/**
 * Utility to load mock data for development
 */

import type { Database } from '@/types/database';

type Invoice = Database['public']['Tables']['invoices']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];
type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

// Import mock data
import usersData from '../../data/users.json';
import clientsData from '../../data/clients.json';
import invoicesData from '../../data/invoices.json';
import invoiceItemsData from '../../data/invoice_items.json';
import paymentsData from '../../data/payments.json';

export const mockUsers = usersData;
export const mockClients = clientsData as Client[];
export const mockInvoices = invoicesData as Invoice[];
export const mockInvoiceItems = invoiceItemsData as InvoiceItem[];
export const mockPayments = paymentsData as Payment[];

/**
 * Load mock invoices into the store
 * Use this in development when Supabase is not available
 */
export const loadMockInvoices = (): Invoice[] => {
  return mockInvoices;
};

/**
 * Get mock invoice with items
 */
export const getMockInvoiceWithItems = (invoiceId: string) => {
  const invoice = mockInvoices.find((inv) => inv.id === invoiceId);
  const items = mockInvoiceItems.filter((item) => item.invoice_id === invoiceId);
  
  return invoice ? { invoice, items } : null;
};

/**
 * Get mock client by ID
 */
export const getMockClient = (clientId: string): Client | undefined => {
  return mockClients.find((client) => client.id === clientId);
};

/**
 * Get mock payments for an invoice
 */
export const getMockPayments = (invoiceId: string): Payment[] => {
  return mockPayments.filter((payment) => payment.invoice_id === invoiceId);
};
