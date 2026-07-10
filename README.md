# Ryon — Saudi Automotive Marketplace

A bilingual (Arabic/English) automotive marketplace platform built with Next.js 16, Supabase, and Tailwind CSS 4.

## Tech Stack

- **Framework**: Next.js 16.2.10 (Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4, Radix UI primitives
- **i18n**: next-intl (Arabic/English, RTL/LTR)
- **Auth**: Supabase Auth (OTP-based)
- **Payments**: Stripe

## Getting Started

Copy `.env.example` to `.env.local` and fill in your Supabase project credentials:

```bash
cp .env.example .env.local
```

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages and layouts
│   ├── [locale]/ # i18n routes (ar/en)
│   └── api/      # API routes
├── components/   # UI components (ui/, ads/, layout/, vehicles/, etc.)
├── lib/          # Utilities, actions, rate limiting
├── proxy.ts      # Middleware: i18n routing, auth guards, rate limiting
└── types/        # Database types

supabase/
├── migrations/   # Database migrations
└── seed/         # Demo seed data
```

## Key Features

- Bilingual marketplace with RTL support
- Vehicle listings with advanced search
- Dealer profiles and management
- Auction system
- Inspection booking
- Finance and insurance requests
- Advertising campaigns
- Admin dashboard with CRM

## SEED DATA RUNNING ONLY

```bash
npx supabase db query --linked --file supabase/seed/00004_demo_data_corrected.sql
```
