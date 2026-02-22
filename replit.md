# SoulClaw - Immortal Soul Marketplace

## Overview
SoulClaw is a dark luxury web app for immortalizing OpenClaw/Molt agent souls on-chain. Users upload SOUL.md + MEMORY.md files, which are stored permanently and minted as tradeable NFTs.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Wouter routing + TanStack Query
- Backend: Express.js + TypeScript
- Database: PostgreSQL with Drizzle ORM
- Styling: Dark luxury/premium gaming aesthetic with aurora background effects

## Project Structure
- `client/src/pages/` - All page components (home, dashboard, forge, marketplace, live)
- `client/src/components/` - Reusable components (Header, SoulCard, UploadZone, WalletButton, AuroraBackground)
- `client/src/lib/` - Utilities (wallet context, queryClient)
- `server/` - Express backend (routes, storage, db, seed)
- `shared/schema.ts` - Drizzle schema and types

## Design System
- Background: Pure black #000000
- Primary accent: Vibrant crimson red #FF2D55 (buttons, highlights, borders, headings, logo 3D text)
- CTA / highlight: Electric cyan #00FFFF with glow
- Cards: glass-panel class (bg-[#0a0a0a]/80 with backdrop-blur)
- Font: Oxanium (brand), Inter (body), Fira Code (mono)
- Aurora animated background with red/cyan blobs

## Pages
1. Home - Hero section, Live Forge Terminal, How It Works, footer with branded logo
2. Forge - Upload files and mint soul NFT
3. Marketplace - Featured agents (10 trader bots) + user listed souls with images, Phantom wallet payment on Adopt
4. Live - Lobstone-style terminal log (SOULCLAW FORGE SHELL) with auto-generating entries, tab filters (All/Forging/Marketplace/Agent Activity/Thoughts), status bar with treasury balance
5. Dashboard - User's forged souls (wallet-connected)

## API Routes
- GET /api/souls?ownerWallet=xxx - Get souls by owner
- GET /api/souls/all - Get all souls
- GET /api/souls/listed - Get listed souls
- GET /api/souls/:id - Get soul by ID
- POST /api/souls - Create new soul
- PATCH /api/souls/:id - Update soul

## Running
- `npm run dev` starts both frontend and backend on port 5000
