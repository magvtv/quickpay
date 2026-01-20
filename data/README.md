# Mock Data

This folder contains mock data for development and testing purposes.

## Files

- `users.json` - User accounts
- `clients.json` - Client information
- `invoices.json` - Invoice records with various statuses
- `invoice_items.json` - Line items for each invoice
- `payments.json` - Payment records for paid invoices

## Usage

These mock data files can be used to:
1. Seed the database during development
2. Test components without connecting to a live database
3. Populate the Zustand store for UI development

## Data Structure

All data follows the database schema defined in `src/types/database.ts` and matches the Supabase table structures.
