# 🚀 Quick Start Guide - DressArt Marketplace

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git

## Setup in 5 Minutes

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Marketplace
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local and fill in your Supabase credentials
```

**Get your Supabase credentials:**
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Project Settings → API
3. Copy these values to `.env.local`:
   - `SUPABASE_URL` → Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role secret (⚠️ keep this secret!)
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL (same as above)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon public key

### 3. Setup Database

1. Go to your Supabase project → SQL Editor
2. Run these migrations in order:
   - Copy/paste content from `migrations/001_pending_payments.sql` → Run
   - Copy/paste content from `migrations/002_add_transaction_id_to_orders.sql` → Run
   - Copy/paste content from `migrations/003_unique_transaction_id_orders.sql` → Run

### 4. Verify Configuration

```bash
npm run check-env
```

You should see all ✅ for required variables.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Optional: Enable Payments

To enable FedaPay payments (optional for development):

1. Sign up at [fedapay.com](https://fedapay.com)
2. Get your API keys from the dashboard
3. Add to `.env.local`:
```bash
FEDAPAY_API_KEY=sk_sandbox_xxxxx
FEDAPAY_ENVIRONMENT=sandbox
FEDAPAY_WEBHOOK_SECRET=whsec_xxxxx
FEDAPAY_CALLBACK_URL=http://localhost:3000/api/payment/callback
```

Without these, the app runs in **dev mode** with mock payments.

## Common Issues

### ❌ "supabaseKey is required"

**Solution:** Run `npm run check-env` and add missing Supabase variables to `.env.local`

### ❌ "Failed to create order"

**Solution:** Run the database migrations (step 3)

### ⚠️ Payments not working

**Solution:** Add FedaPay variables or continue in dev mode

## Project Structure

```
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   │   └── payment/       # Payment endpoints
│   ├── models/            # Product catalog
│   └── suivi/             # Order tracking
├── components/            # React components
├── lib/
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   └── hooks/             # React hooks
├── migrations/            # Supabase SQL migrations
└── scripts/              # Utility scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check-env` - Verify environment variables
- `npm run lint` - Run ESLint

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Full deployment guide with all platforms
- **[PAYMENT_SETUP.md](PAYMENT_SETUP.md)** - Detailed payment integration guide
- **[migrations/](migrations/)** - Database schema

## Need Help?

1. Run `npm run check-env` to diagnose configuration issues
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting
3. Review the migration files in `migrations/` folder

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Payments:** FedaPay
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

---

Built with ❤️ for African fashion artisans
