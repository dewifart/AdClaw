# AdClaw - Autonomous Token Promotion Platform

## Overview
AdClaw is a platform where anyone can launch their own token in 1 click, and a swarm of autonomous agents automatically promote it across X and other platforms 24/7. All platform fees go to automatic buyback of the $ADCLAW token. Built on Solana with a premium minimalist black & white aesthetic.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Wouter routing + TanStack Query
- Backend: Express.js + TypeScript + SSE (Server-Sent Events)
- Database: PostgreSQL with Drizzle ORM
- Real-time: EventSource/SSE for live terminal events
- Styling: Premium minimalist luxury aesthetic — pure black background, white/gray text, steel blue accents

## Project Structure
- `client/src/pages/` - All page components (home, dashboard, forge, marketplace, live, ecosystem, inherit)
- `client/src/components/` - Reusable components (Header, SoulCard, UploadZone, WalletButton, AuroraBackground, LiveForgeTerminal)
- `client/src/components/ui/` - Shadcn UI components
- `client/src/lib/` - Utilities (wallet context, queryClient)
- `server/` - Express backend (routes, storage, db, events, seed)
- `server/events.ts` - SSE event broadcaster for real-time terminal
- `shared/schema.ts` - Drizzle schema and types

## Design System
- Background: Pure black #000000
- Primary accent: Steel blue #6B7B8D (buttons, highlights, borders)
- Secondary accent: Light steel blue #8A9AAD
- Cards: glass-panel class (rgba(10,10,10,0.85) with backdrop-blur)
- Text gradient: White to light gray (#ffffff → #a0a8b4)
- Font: Inter (brand + body), Fira Code (mono)
- Aurora animated background with subtle gray/steel blobs
- No neon colors, no glow effects, clean minimalist shadows

## Pages
1. Home - Hero with "Launch Your Token. Let the Swarm Promote It.", Live Terminal animation, How It Works (4-step flow), Get Started (tabbed install), API Reference, footer
2. Forge - Upload files and forge agent identity, Autonomous Forge Mode
3. Marketplace - Featured agents (4 curated) + user listed agents
4. Live - ADCLAW TERMINAL with real SSE events + system messages, tab filters
5. Ecosystem - Tabbed install section (AdClaw SDK/x402-fetch/cURL/Solana), ecosystem flow diagram, vision/roadmap

## API Routes

### v1 API (Developer Integration)
- POST /api/v1/souls - Create a new agent identity
- GET /api/v1/souls - List all agents
- GET /api/v1/souls/:id - Get agent by ID
- GET /api/v1/score/:id - Get Agent Engine Score breakdown
- GET /api/v1/stats - Platform stats
- POST /api/v1/forge-log - Create a forge log entry
- GET /api/v1/forge-log - List forge logs with pagination and filters
- GET /api/v1/forge-log/:id - Get individual forge log by ID
- GET /api/events - SSE stream for real-time terminal events

### Legacy API (Frontend)
- GET /api/souls?ownerWallet=xxx - Get agents by owner
- GET /api/souls/all - Get all agents
- GET /api/souls/listed - Get listed agents
- POST /api/souls - Create new agent
- PATCH /api/souls/:id - Update agent

## Running
- `npm run dev` starts both frontend and backend on port 5000
