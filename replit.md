# SoulForge - Immortal Soul Marketplace

## Overview
SoulForge is a dark luxury web app for immortalizing OpenClaw/Molt agent souls on-chain. Users upload SOUL.md + MEMORY.md files, which are stored permanently and minted as tradeable NFTs.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Wouter routing + TanStack Query
- Backend: Express.js + TypeScript
- Database: PostgreSQL with Drizzle ORM
- Styling: Dark luxury/premium gaming aesthetic with aurora background effects

## Project Structure
- `client/src/pages/` - All page components (home, dashboard, forge, marketplace, inherit)
- `client/src/components/` - Reusable components (Header, SoulCard, UploadZone, WalletButton, AuroraBackground)
- `client/src/lib/` - Utilities (wallet context, queryClient)
- `server/` - Express backend (routes, storage, db, seed)
- `shared/schema.ts` - Drizzle schema and types

## Design System
- Background: Pure black #000000
- Gold accent: Gradient #FFD700 to #FFAA00
- Green CTA: #14F195 with glow
- Purple auth: #9945FF
- Cards: glass-panel class (bg-[#0a0a0a]/80 with backdrop-blur)
- Font: Oxanium (brand), Inter (body), Fira Code (mono)
- Aurora animated background with purple/green blobs

## Pages
1. Home - Hero section, stats, features, FAQ
2. Dashboard - User's forged souls (wallet-connected)
3. Forge - Upload files and mint soul NFT
4. Marketplace - Browse listed souls
5. Inherit - Load soul into agent terminal demo

## API Routes
- GET /api/souls?ownerWallet=xxx - Get souls by owner
- GET /api/souls/all - Get all souls
- GET /api/souls/listed - Get listed souls
- GET /api/souls/:id - Get soul by ID
- POST /api/souls - Create new soul
- PATCH /api/souls/:id - Update soul

## Running
- `npm run dev` starts both frontend and backend on port 5000
