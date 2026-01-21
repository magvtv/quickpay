# Mock Data

This folder contains mock data for development and testing purposes featuring **Marvel superhero clients**.

## Files

- `users.json` - User accounts
- `clients.json` - **10 Marvel superhero clients** (Tony Stark, Steve Rogers, Peter Parker, etc.)
- `invoices.json` - **12 invoices** with various statuses (paid, sent, overdue, draft)
- `invoice_items.json` - Line items for each invoice with Marvel-themed services
- `payments.json` - **7 payment records** for paid invoices

## Marvel Superhero Clients

The mock data includes 10 Marvel superheroes as clients:

1. **Tony Stark** - Stark Industries (Arc Reactor maintenance)
2. **Steve Rogers** - Avengers Initiative (Leadership training)
3. **Peter Parker** - Daily Bugle Photography
4. **Natasha Romanoff** - S.H.I.E.L.D. Operations (Security assessment)
5. **Thor Odinson** - Asgardian Embassy
6. **Bruce Banner** - Culver University Research (Gamma radiation consulting)
7. **Stephen Strange** - Sanctum Sanctorum (Mystical consulting)
8. **T'Challa** - Wakanda Design Group (Vibranium tech integration)
9. **Carol Danvers** - NASA Space Command
10. **Wanda Maximoff** - Chaos Magic Consulting

## Dashboard Stats Overview

Based on the mock data:
- **Total Received**: $170,532.50 (7 paid invoices)
- **Pending**: $55,130.00 (3 sent + 1 overdue invoice)
- **In Drafts**: $30,520.00 (1 draft invoice)
- **Total Invoices**: 12

## Usage

These mock data files serve as **fallback data** when Supabase is not available or returns no data:

1. **Real-time from Supabase**: The app first attempts to fetch data from Supabase
2. **Fallback to Mock Data**: If Supabase is unavailable or returns no data, the app uses these mock files
3. **Development**: Test components without needing a live database connection
4. **Seeding**: Use these files to populate your Supabase database

## Data Structure

All data follows the database schema defined in `src/types/database.ts` and matches the Supabase table structures exactly.
