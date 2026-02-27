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
- Cards: glass-panel class (rgba(14,14,14,0.92) with backdrop-blur), card-elevated class for key cards
- CSS vars: --card 0 0% 6%, --border 0 0% 15%, --muted-foreground 0 0% 70%, --input 0 0% 16%
- Contrast standard: text minimum /60 for body, /55 for tertiary/muted, /50 for subtle labels; borders minimum /[0.10]
- Text gradient: gold-gradient class for section headings
- Font: Inter (brand + body), Fira Code (mono/terminal)
- Aurora animated background with subtle gray/steel blobs (1.5x opacity for depth)
- No neon colors, clean minimalist shadows

## Project Structure

### Frontend
- `client/src/pages/` - Page components: home, forge, live, ecosystem, dashboard
- `client/src/components/` - Reusable: Header, AgentCard, WalletButton, AuroraBackground, LiveForgeTerminal, UploadZone
- `client/src/components/ui/` - Shadcn UI components
- `client/src/lib/` - Utilities (wallet context, queryClient)

### Backend
- `server/index.ts` - Express entry point
- `server/routes.ts` - Route registration (existing v1 + legacy)
- `server/storage.ts` - Data access layer (IStorage interface)
- `server/events.ts` - SSE EventBroadcaster class
- `server/db.ts` - Drizzle database connection
- `server/seed.ts` - Database seeding with sample data
- `server/api/` - Domain-specific route handlers:
  - `tokens.ts` - Token launch endpoints (POST/GET with score engine)
  - `buyback.ts` - Buyback stats, recent, ledger endpoints
  - `health.ts` - Health check with DB/SSE/memory diagnostics
- `server/services/` - Business logic:
  - `scoreEngine.ts` - Agent Engine Score calculation and breakdown
  - `buybackEngine.ts` - Fee accumulation and auto-buyback execution
  - `agentPromotion.ts` - Campaign creation, agent assignment, post simulation
  - `tokenLauncher.ts` - Token launch orchestration (score + buyback + promotion)
- `server/middleware/` - Express middleware:
  - `rateLimit.ts` - In-memory rate limiter with per-client tracking
  - `requestLogger.ts` - Structured request logging with log levels
  - `errorHandler.ts` - Centralized error handling (AppError, NotFoundError, ValidationError)
- `server/config/` - Configuration:
  - `index.ts` - Environment config with Zod validation
  - `constants.ts` - Platform constants (fees, score weights, tiers, API limits)
- `server/utils/` - Utilities:
  - `wallet.ts` - Solana wallet validation, address formatting
  - `crypto.ts` - SHA256 hashing, content integrity, ID generation
  - `formatters.ts` - Number/time/SOL formatting, text sanitization
- `server/types/api.ts` - TypeScript types for API requests/responses

### Shared
- `shared/schema.ts` - Drizzle schema and Zod types (souls + forge_logs tables)

## Pages
1. **Home** - Hero with "Launch Your Token. Let the Swarm Promote It.", platform stats bar (4 metrics), live agent activity + buyback feeds side-by-side, animated terminal, How It Works (3 steps), Community Token Launch section, Why AdClaw (4 value props), footer
2. **Launch** (/forge) - Token launch form (name, ticker, description, marketing image selection), community launch explanation with 3 benefit cards, Auto-Launch Mode toggle with live log
3. **Live** (/live) - ADCLAW TERMINAL with real SSE events + system messages, tab filters (All, Launches, Marketplace, Agent Activity, Thoughts)
4. **Ecosystem** (/ecosystem) - Tabbed SDK install (AdClaw SDK/x402-fetch/cURL/Solana), ecosystem flow diagram, roadmap

## Navigation
Home / Launch / Live / Ecosystem

## API Routes

### v2 API (New Domain Routes)
- POST /api/v2/tokens - Launch token (with score engine, buyback, promotion)
- GET /api/v2/tokens - List tokens
- GET /api/v2/tokens/listed - Listed tokens
- GET /api/v2/tokens/:id - Get token by ID
- GET /api/v2/tokens/:id/score - Score breakdown with tier
- GET /api/v2/buyback/stats - Buyback statistics
- GET /api/v2/buyback/recent - Recent buyback entries
- GET /api/v2/buyback/ledger - Full buyback ledger
- GET /api/v2/health - Health check (DB, SSE, memory)
- GET /api/v2/health/detailed - Detailed diagnostics

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
