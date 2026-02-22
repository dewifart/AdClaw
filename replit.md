# SoulClaw - AI Agent Identity Protocol

## Overview
SoulClaw is an identity and memory protocol for AI agents on Solana. Developers upload agent SOUL.md + MEMORY.md files via API, which are stored permanently with a verifiable Soul Engine Score. Features a dark luxury aesthetic with real-time SSE-powered live terminal showing all platform events.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Wouter routing + TanStack Query
- Backend: Express.js + TypeScript + SSE (Server-Sent Events)
- Database: PostgreSQL with Drizzle ORM
- Real-time: EventSource/SSE for live terminal events
- Styling: Dark luxury/premium gaming aesthetic with aurora background effects

## Project Structure
- `client/src/pages/` - All page components (home, dashboard, forge, marketplace, live)
- `client/src/components/` - Reusable components (Header, SoulCard, UploadZone, WalletButton, AuroraBackground)
- `client/src/lib/` - Utilities (wallet context, queryClient)
- `server/` - Express backend (routes, storage, db, events, seed)
- `server/events.ts` - SSE event broadcaster for real-time terminal
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
2. Forge - Upload files and forge soul, Autonomous Forge Mode
3. Marketplace - Featured agents (6 curated: 3 free, 3 coming soon) + user listed souls
4. Live - SOUL TERMINAL with real SSE events + system messages, tab filters, LIVE indicator, connection status
5. Dashboard - User's forged souls (wallet-connected)

## API Routes

### v1 API (Developer Integration)
- POST /api/v1/souls - Forge a new soul (accepts name, description, soul_content, memory_content, owner_wallet)
- GET /api/v1/souls - List all souls (optional ?owner_wallet= filter)
- GET /api/v1/souls/:id - Get soul by ID
- GET /api/v1/score/:id - Get Soul Engine Score breakdown (intelligence, strategy, risk_profile, trust)
- GET /api/v1/stats - Platform stats (total forged, listed, average score, connected clients)
- GET /api/events - SSE stream for real-time terminal events

### Legacy API (Frontend)
- GET /api/souls?ownerWallet=xxx - Get souls by owner
- GET /api/souls/all - Get all souls
- GET /api/souls/listed - Get listed souls
- GET /api/souls/:id - Get soul by ID
- POST /api/souls - Create new soul
- PATCH /api/souls/:id - Update soul

## Soul Engine Score
Calculated from SOUL.md + MEMORY.md content analysis:
- Intelligence (30%): strategy, analyze, learn, optimize, algorithm, etc.
- Strategy (25%): trade, arbitrage, hedge, rebalance, position, etc.
- Risk Profile (25%): safety, guard, limit, threshold, max, etc.
- Trust (20%): verify, audit, transparent, immutable, chain, etc.
Score range: 500-5000

## SSE Event System
- All soul forging events (manual + autonomous + API) are broadcast to connected clients
- Live terminal connects via EventSource and displays real events with [LIVE] tag
- System health messages (agent activity, thoughts) generated client-side as ambient content
- Status bar shows SSE connection status and treasury/forged counts

## Running
- `npm run dev` starts both frontend and backend on port 5000
