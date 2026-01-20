interface Client {
  id: string;
  user_id: string; // FK to User
  name: string;
  email: string;
  company_name?: string;
  address?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}


interface DashboardStats {
    totalReceived: {
        amount: number;
        change: string;     // e.g., "+5%" or "-3% since last month"
    };
    pending: {
        amount: number;
    };
    inDrafts: {
        amount: number;
    };
}

interface Invoice {
    id: string;
    user_id: string;
    client_id: string;
    invoice_number: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issue_date: Date;  // ISO date string
    due_date: string;    // ISO date string
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    total: number;
    notes?: string;
    created_at: Date;  // ISO date string
    updated_at: Date;  // ISO date string
}

interface InvoiceDetail {
    invoiceNumber: string;
    companyInfo: {
        name: string;
        address: string;
        logo: string;
    };
    issuedOn: Date;
    dueOn: Date;
    billTo: {
        name: string;
        address: string;
    };
    items: InvoiceLineItem[];
    subtotal: number;
    notes?: string;
    total: number;
}

interface InvoiceItem {
  id: string;
  invoice_id: string; // FK to Invoice
  description: string;
  quantity: number;
  unit_price: number;
  amount: number; // quantity * unit_price
  order: number; // For sorting
}


interface InvoiceLineItem { 
    id: string;
    description: string;
    quantity: number;
    price: number;
    total: number; // quantity * unitPrice
}

interface InvoiceListItem {
    id: string;
    invoiceNumber: string;
    date: Date;
    client: string;
    amount: number;
    status: 'pending' | 'paid' | 'draft' | 'overdue';
    total: number;
}

interface InvoiceStore {
    // State
    invoices: Invoice[];
    selectedInvoice: Invoice | null;
    isDrawerOpen: boolean;
    isModalOpen: boolean;

    // Actions
    fetchInvoices: () => Promise<void>;
    createInvoice: (data: NewInvoiceForm) => Promise<void>;
    updateInvoice: (id: string, data: Partial<Invoice>) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    selectInvoice: (id: string) => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    openModal: (id: string) => void;
    closeModal: () => void;
}

interface LayoutState {
    sidebarOpen: boolean;
    currentRoute: string;
    user: {
        name: string;
        avatar: string;
        email: string;
    };
}

interface NavItem {
    name: string;
    href: string;
    icon: string;
    isActive: boolean;
}

interface NewInvoiceForm {
    invoiceNumber: string;      //Auto-generated on the backend
    recipientEmail: string;
    projectDescription: string;
    issuedOn: Date;
    dueOn: Date;
    isRecurring: boolean;
    items: InvoiceLineItem[];
    additionalNotes: string;
    total: number;            //Auto-calculated on the backend
}

interface Payment {
    id: string;
    invoice_id: string; // FK to Invoice
    amount: number;
    payment_date: Date;
    payment_method: 'bank_transfer' | 'card' | 'cash' | 'mpesa' | 'other';
    reference?: string;
    notes?: string;
    created_at: Date;
}

interface PublicInvoice extends InvoiceDetail {
    paymentForm: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
    };
    paymentmethods: string[]
}

interface TableState {
    invoices: InvoiceListItem[];
    searchQuery: string;
    sortBy: 'date' | 'client' | 'amount';
    sortOrder: 'asc' | 'desc';
    showAll: boolean;
}

interface QuickPayLink {
    url: string;
    description: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  company_name: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}
