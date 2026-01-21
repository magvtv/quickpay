# QuickPay Dashboard - Code Challenge Submission

This project is my implementation of the Full Stack Engineer code challenge. I've built a production-ready invoice management dashboard that demonstrates proficiency in modern full-stack development, thoughtful architecture decisions, and robust error handling.

## Challenge Overview

This code challenge required building a complete invoice management system with:
- Full-stack implementation using Next.js 15 and TypeScript
- Database integration with Supabase (PostgreSQL)
- Real-time dashboard statistics
- Robust error handling and fallback mechanisms
- Form validation and data integrity
- Responsive, modern UI design

## Key Implementation Highlights

### Architecture Decisions

**Hybrid Data Strategy**: I implemented a robust fallback system that attempts Supabase first, then gracefully falls back to mock data. This ensures the application works seamlessly whether the database is available or not—critical for development, demos, and production resilience.

**State Management**: Used Zustand for lightweight, performant state management. The `InvoiceStore` centralizes all invoice operations and provides computed statistics for the dashboard.

**Type Safety**: Full TypeScript implementation with strict typing across the entire codebase, including database schemas, API responses, and form validations.

### Core Features Implemented

- ✅ **Real-time Dashboard**: Live statistics calculated from invoice data (Total Received, Pending, Drafts)
- ✅ **CRUD Operations**: Complete invoice lifecycle management (Create, Read, Update, Delete)
- ✅ **Form Validation**: Comprehensive validation using Zod schemas with custom business rules
- ✅ **Error Handling**: Graceful error handling with automatic fallback to mock data
- ✅ **Responsive Design**: Mobile-first design using Tailwind CSS
- ✅ **Type Safety**: End-to-end TypeScript with proper type definitions

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

## Technical Implementation Details

### Data Architecture: Hybrid Strategy

One of the key challenges was ensuring the application works reliably in all scenarios. I implemented a **hybrid data strategy** that prioritizes Supabase but gracefully handles failures:

**Implementation Flow:**
1. **Primary**: Attempts to fetch from Supabase with proper error handling
2. **Validation**: Checks for both connection errors and empty result sets
3. **Fallback**: Automatically switches to mock data if Supabase is unavailable
4. **Seamless UX**: Users never see errors—the app always has data to display

**Why This Approach:**
- Enables development without database setup
- Provides demo-ready functionality immediately
- Ensures production resilience against database outages
- Allows for easy testing and iteration

**Code Location**: `src/stores/invoiceStore.ts` - See `fetchInvoices()` and `fetchInvoiceById()` methods

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

## Code Structure & Key Components

### State Management (`src/stores/invoiceStore.ts`)
- Centralized Zustand store for invoice state
- Implements fallback logic for Supabase → mock data
- Provides computed statistics via `useDashboardStats()` hook
- Handles loading states and error management

### Dashboard (`src/app/(dashboard)/page.tsx`)
- Real-time statistics calculated from invoice data
- Loading states with skeleton UI
- Client-side rendering for interactivity
- Responsive grid layout

### Form Validation (`src/lib/validations/invoiceSchema.ts`)
- Zod schemas for type-safe validation
- Business rule validation (e.g., due date after issue date)
- Subtotal calculation verification
- Custom error messages

### Mock Data (`src/lib/mockData.ts` & `/data/*.json`)
- 10 Marvel superhero clients (fun, but realistic data)
- 12 invoices with varying statuses
- Complete payment records
- Matches database schema exactly for seamless integration

## Database Schema

The app uses the following Supabase tables:
- `invoices` - Invoice records
- `clients` - Client information
- `invoice_items` - Line items for invoices
- `payments` - Payment records
- `users` - User accounts

## Development Workflow

### Quick Start (Mock Data Only)

The application works immediately without any backend setup—perfect for reviewing the code challenge submission:

```bash
npm install
npm run dev
```

The app will automatically use mock data from `/data` folder, displaying 10 Marvel superhero clients and 12 invoices.

### Full Stack Setup (With Supabase)

To test with a real database:

1. **Create Supabase Project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project

2. **Set Up Database Schema**
   - Use the SQL migration file: `src/supabase/migrations/001_enhance_invoices_schema.sql`
   - Or manually create tables matching the schema in `src/types/database.ts`

3. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
   ```

4. **Run the Application**
   - The app will automatically detect Supabase and use it
   - If Supabase has no data, it falls back to mock data seamlessly

### Testing the Fallback System

To verify the fallback mechanism:
1. Start the app without Supabase credentials → Uses mock data
2. Add invalid credentials → Gracefully falls back to mock data
3. Add valid credentials with empty database → Uses mock data
4. Add valid credentials with data → Uses Supabase data

## Challenge Requirements Met

✅ **Full-Stack Implementation**: Complete Next.js application with TypeScript  
✅ **Database Integration**: Supabase (PostgreSQL) with proper schema design  
✅ **State Management**: Zustand for efficient, scalable state handling  
✅ **Error Handling**: Robust fallback system ensuring app always works  
✅ **Form Validation**: Comprehensive validation with Zod schemas  
✅ **Real-time Features**: Live dashboard statistics calculated from data  
✅ **Responsive Design**: Mobile-first approach with Tailwind CSS  
✅ **Type Safety**: End-to-end TypeScript with strict typing  
✅ **Code Quality**: Clean architecture, separation of concerns, reusable components  

## Technical Decisions & Rationale

**Why Zustand over Redux?**  
Lighter weight, less boilerplate, easier to learn, and sufficient for this application's state needs.

**Why Hybrid Data Strategy?**  
Ensures the application works in all scenarios—critical for code challenges where reviewers may not have database access.

**Why Zod for Validation?**  
Type-safe validation that integrates seamlessly with TypeScript, providing both runtime and compile-time safety.

**Why Next.js 15 App Router?**  
Modern React patterns, better performance, built-in optimizations, and aligns with current best practices.

## Deployment

### Deploy on Netlify

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**:
   - Add your Supabase credentials in Netlify dashboard:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

3. **Deploy**:
   - Connect your Git repository to Netlify
   - Netlify will automatically detect Next.js and configure build settings
   - Your app will deploy automatically on every push to your main branch

### Optional: Netlify Configuration

Create a `netlify.toml` file in your project root for custom configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev/)

---

**Note**: This project was built as part of a Full Stack Engineer code challenge. All requirements from the assignment rubric have been implemented with attention to code quality, user experience, and production readiness.
