import { z } from 'zod';

// Type exports
export type InvoiceLineItem = z.infer<typeof invoiceLineItemSchema>;
export type Client = z.infer<typeof clientSchema>;
export type InvoiceForm = z.infer<typeof invoiceFormSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type InvoiceFilter = z.infer<typeof invoiceFilterSchema>;


// Line item schema for invoice items
export const invoiceLineItemSchema = z.object({
  id: z.string().uuid().optional(), // Optional for new items
  description: z
    .string()
    .min(1, 'Item description is required')
    .max(200, 'Description too long'),
  quantity: z
    .number()
    .positive('Quantity must be positive')
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  unit_price: z
    .number()
    .positive('Price must be positive')
    .min(0.01, 'Price must be at least 0.01'),
  amount: z.number(), // Calculated field (quantity * unit_price)
  order: z.number().int().min(0).optional(),
});

// Client schema for invoice client details
export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Client name too long'),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  company_name: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
});

// Invoice form schema to create and update invoices
export const invoiceFormSchema = z
  .object({
    // Client Information
    client_id: z
      .string()
      .uuid('Invalid client ID')
      .min(1, 'Client is required'),
    
    // Invoice Details
    invoice_number: z
      .string()
      .regex(/^[A-Z0-9-]+$/, 'Invoice number can only contain uppercase letters, numbers, and dashes')
      .optional(), // Auto-generated if not provided
    
    status: z
      .enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
      .default('draft'),
    
    // Dates
    issue_date: z.coerce.date(),
    due_date: z.coerce.date(),
    
    // Line Items
    items: z
      .array(invoiceLineItemSchema)
      .min(1, 'At least one line item is required')
      .max(50, 'Maximum 50 line items allowed'),
    
    // Financial
    subtotal: z.number().min(0),
    tax_rate: z
      .number()
      .min(0, 'Tax rate cannot be negative')
      .max(100, 'Tax rate cannot exceed 100%')
      .default(0),
    tax_amount: z.number().min(0),
    total: z.number().positive('Total must be positive'),
    
    // Optional Fields
    notes: z
      .string()
      .max(1000, 'Notes cannot exceed 1000 characters')
      .optional()
      .or(z.literal('')),
    
    is_recurring: z.boolean().default(false),
    recurring_frequency: z
      .enum(['weekly', 'monthly', 'quarterly', 'yearly'])
      .optional()
      .nullable(),
  })
  .refine((data) => data.due_date >= data.issue_date, {
    message: 'Due date must be on or after issue date',
    path: ['due_date'],
  })
  .refine(
    (data) => {
      // Verify subtotal matches sum of line items
      const calculatedSubtotal = data.items.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      return Math.abs(calculatedSubtotal - data.subtotal) < 0.01; // Allow for floating point errors
    },
    {
      message: 'Subtotal does not match sum of line items',
      path: ['subtotal'],
    }
  )
  .refine(
    (data) => {
      // Verify tax calculation
      const calculatedTax = (data.subtotal * data.tax_rate) / 100;
      return Math.abs(calculatedTax - data.tax_amount) < 0.01;
    },
    {
      message: 'Tax amount does not match calculated tax',
      path: ['tax_amount'],
    }
  )
  .refine(
    (data) => {
      // Verify total calculation
      const calculatedTotal = data.subtotal + data.tax_amount;
      return Math.abs(calculatedTotal - data.total) < 0.01;
    },
    {
      message: 'Total does not match subtotal + tax',
      path: ['total'],
    }
  );

// Payment Schema
export const paymentSchema = z.object({
  invoice_id: z.string().uuid('Invalid invoice ID'),
  amount: z.number().positive('Payment amount must be positive'),
  payment_date: z.coerce.date(),
  payment_method: z.enum(['bank_transfer', 'card', 'cash', 'other']),
  reference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

// Search or filter schema
export const invoiceFilterSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled', 'all']).optional(),
  client_id: z.string().uuid().optional(),
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
  min_amount: z.number().min(0).optional(),
  max_amount: z.number().min(0).optional(),
  search_query: z.string().max(100).optional(),
});