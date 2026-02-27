# AdClaw - Autonomous Token Promotion Platform

## Overview
AdClaw is a platform where anyone can launch their own token in 1 click, and a swarm of autonomous agents automatically promote it across X, Telegram, Discord, and Reddit 24/7. All platform fees go to automatic buyback of the $ADCLAW token. Built on Solana with a premium minimalist black & white aesthetic.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Wouter routing + TanStack Query
- Backend: Express.js + TypeScript + SSE (Server-Sent Events)
- Database: PostgreSQL with Drizzle ORM
- Real-time: EventSource/SSE for live terminal events
- Styling: Premium minimalist luxury aesthetic — pure black background, white/gray text, steel blue + gold accents

## Design System
- Background: Pure black #000000
- Primary accent: Steel blue #6B7B8D (agent activity, buttons, highlights)
- Secondary accent: Light steel blue #8A9AAD (live indicators, scores)
- Gold accent: #C4A962 (buyback/financial highlights, fee-related elements)
- Cards: glass-panel class (rgba(10,10,10,0.85) with backdrop-blur)
- Text gradient: gold-gradient class for section headings
- Font: Inter (brand + body), Fira Code (mono/terminal)
- Aurora animated background with subtle gray/steel blobs
- No neon colors, clean minimalist shadows

## Project Structure
- `client/src/pages/` - All page components:
  - `home.tsx` - Homepage with hero, stats, feeds, terminal, how it works, community launch, why AdClaw
  - `forge.tsx` - Token Launch page (1-click launch form with image selection, auto-launch mode)
  - `marketplace.tsx` - Agent Swarm page (featured agents, recently deployed, engine score sidebar)
  - `live.tsx` - Live terminal (SSE events, tab filters, auto-scroll)
  - `ecosystem.tsx` - SDK docs, ecosystem flow, roadmap
  - `dashboard.tsx` - User's launched tokens/agents
  - `inherit.tsx` - Agent config inheritance
- `client/src/components/` - Reusable components (Header, SoulCard, WalletButton, AuroraBackground, LiveForgeTerminal, UploadZone)
- `client/src/components/ui/` - Shadcn UI components
- `client/src/lib/` - Utilities (wallet context, queryClient)
- `server/` - Express backend (routes, storage, db, events, seed)
- `server/events.ts` - SSE event broadcaster for real-time terminal
- `shared/schema.ts` - Drizzle schema and types (souls table used for all token/agent data)

## Pages
1. **Home** - Hero with "Launch Your Token. Let the Swarm Promote It.", platform stats bar (4 metrics), live agent activity + buyback feeds side-by-side, animated terminal, How It Works (3 steps), Community Token Launch section, Why AdClaw (4 value props), footer
2. **Launch** (/forge) - Token launch form (name, ticker, description, marketing image selection), community launch explanation with 3 benefit cards, Auto-Launch Mode toggle with live log
3. **Agents** (/marketplace) - Agent Swarm page with 4 featured agents + recently deployed agents, Agent Engine Score sidebar with tier breakdown
4. **Live** (/live) - ADCLAW TERMINAL with real SSE events + system messages, tab filters (All, Launches, Marketplace, Agent Activity, Thoughts)
5. **Ecosystem** (/ecosystem) - Tabbed SDK install (AdClaw SDK/x402-fetch/cURL/Solana), ecosystem flow diagram, roadmap

## Navigation
Home / Launch / Agents / Live / Ecosystem

## Homepage Sections (in order)
1. Hero: Status badge, headline, subtext, 2 CTAs, contract address copy
2. Platform Stats: 4-column grid (Tokens Launched, Active Agents, Total Impressions, Buybacks Executed)
3. Live Feeds: Agent activity feed + auto-buyback feed (gold accents)
4. Live Agent Terminal: Animated terminal showing launch → swarm → promote → buyback cycle
5. How It Works: 3 steps (Launch Token, Swarm Promotes, Auto-Buyback)
6. Community Token Launch: Explanation section with benefits grid + CTA to /forge
7. Why AdClaw: 4 value cards
8. Footer: Brand, tagline, social links

## API Routes

### v1 API (Developer Integration)
- POST /api/v1/souls - Create a new token/agent identity
- GET /api/v1/souls - List all
- GET /api/v1/souls/:id - Get by ID
- GET /api/v1/score/:id - Get Agent Engine Score breakdown
- GET /api/v1/stats - Platform stats
- POST /api/v1/forge-log - Create log entry
- GET /api/v1/forge-log - List logs with pagination
- GET /api/v1/events/recent - Recent events for live terminal
- GET /api/events - SSE stream for real-time events

### Frontend API
- GET /api/souls?ownerWallet=xxx - Get by owner
- GET /api/souls/all - Get all
- GET /api/souls/listed - Get listed
- POST /api/souls - Create new
- PATCH /api/souls/:id - Update

## Running
- `npm run dev` starts both frontend and backend on port 5000
