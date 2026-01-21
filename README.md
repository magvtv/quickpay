# QuickPay Dashboard

A modern invoice management dashboard built with Next.js 15, TypeScript, and Supabase. Features real-time data synchronization with automatic fallback to mock data.

## Features

- **Real-time Dashboard**: View invoice statistics with live data updates
- **Invoice Management**: Create, view, edit, and delete invoices
- **Client Management**: Manage clients with Marvel superhero themed mock data
- **Payment Tracking**: Track payments and payment methods
- **Supabase Integration**: Backend powered by Supabase with automatic fallback
- **Mock Data**: 10 Marvel superhero clients with realistic invoice data
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Data Architecture

### Supabase + Mock Data Fallback

The app uses a **hybrid data strategy**:

1. **Primary**: Attempts to fetch data from Supabase
2. **Fallback**: If Supabase is unavailable or returns no data, uses mock data from `/data` folder
3. **Seamless**: Users get a working app regardless of backend status

### Mock Data

Mock data includes **10 Marvel superhero clients**:
- Tony Stark (Stark Industries)
- Steve Rogers (Avengers Initiative)
- Peter Parker (Daily Bugle Photography)
- Natasha Romanoff (S.H.I.E.L.D. Operations)
- Thor Odinson (Asgardian Embassy)
- Bruce Banner (Culver University Research)
- Stephen Strange (Sanctum Sanctorum)
- T'Challa (Wakanda Design Group)
- Carol Danvers (NASA Space Command)
- Wanda Maximoff (Chaos Magic Consulting)

See `/data/README.md` for detailed mock data documentation.

## Project Structure

```
quickpay/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── stores/          # Zustand stores
│   ├── lib/             # Utilities and Supabase client
│   └── types/           # TypeScript types
├── data/                # Mock JSON data files
└── public/              # Static assets
```

## Key Components

- **InvoiceStore** (`src/stores/invoiceStore.ts`): Central state management with Supabase integration
- **Dashboard** (`src/app/(dashboard)/page.tsx`): Main dashboard with real-time stats
- **Mock Data** (`src/lib/mockData.ts`): Fallback data loader

## Database Schema

The app uses the following Supabase tables:
- `invoices` - Invoice records
- `clients` - Client information
- `invoice_items` - Line items for invoices
- `payments` - Payment records
- `users` - User accounts

## Development

### Without Supabase

The app works out of the box using mock data. No Supabase setup required for development.

### With Supabase

1. Create a Supabase project
2. Run the database migrations (create tables matching the schema)
3. Add your Supabase credentials to `.env.local`
4. The app will automatically use Supabase data

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

Deploy your Next.js app on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Don't forget to add your environment variables in the Vercel dashboard!
