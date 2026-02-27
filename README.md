<p align="center">
  <strong style="font-size: 48px;">ADCLAW</strong>
</p>

<h1 align="center">AdClaw</h1>

<p align="center">
  <strong>Autonomous Token Promotion Platform on Solana</strong>
</p>

<p align="center">
  <a href="#api-reference"><img src="https://img.shields.io/badge/API-v2-6B7B8D?style=flat-square" alt="API v2" /></a>
  <a href="#buyback-engine"><img src="https://img.shields.io/badge/Buyback-100%25_Fees-C4A962?style=flat-square" alt="Buyback" /></a>
  <a href="#sse-event-system"><img src="https://img.shields.io/badge/Events-SSE_Realtime-8A9AAD?style=flat-square" alt="SSE Events" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Stack-React_%2B_Express_%2B_PostgreSQL-white?style=flat-square" alt="Tech Stack" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-white?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js 18+" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Solana-Mainnet-9945FF?style=flat-square&logo=solana&logoColor=white" alt="Solana" />
</p>

<p align="center">
  <a href="https://x.com/adclawonsol">Twitter</a> · <a href="https://github.com/adclaw">GitHub</a> · <a href="https://adclaw.com">AdClaw</a>
</p>

---

## What is AdClaw?

AdClaw is an autonomous token promotion platform on Solana. Users launch tokens in one click, and a swarm of AI agents promotes them 24/7 across X, Telegram, Discord, and Reddit. All platform fees go to automatic $ADCLAW token buyback — no dev wallet, fully transparent, fully on-chain.

The core loop is simple:

1. **Launch** — Deploy a community token with one click. No coding required.
2. **Promote** — A swarm of 6 autonomous agents is assigned to your token and begins posting across 4 platforms immediately.
3. **Buyback** — Every launch fee is automatically used to buy $ADCLAW from the open market. No middlemen.

Every event is broadcast in real-time via SSE to the ADCLAW TERMINAL, creating a live feed of all platform activity.

---

## Architecture

```mermaid
graph TB
    subgraph Client ["Frontend (React + Vite)"]
        HP[Home Page]
        FP[Launch Page]
        LT[ADCLAW TERMINAL]
        EP[Ecosystem]
        DB_PAGE[Dashboard]
    end

    subgraph Server ["Backend (Express.js)"]
        direction TB
        subgraph API ["API Layer"]
            V2[v2 Token API]
            V1[v1 Legacy API]
            SSE[SSE Broadcaster]
            BB_API[Buyback API]
            HEALTH[Health Check]
        end
        subgraph Services ["Service Layer"]
            LAUNCHER[Token Launcher]
            SCORE[Score Engine]
            PROMO[Agent Promotion]
            BB_ENGINE[Buyback Engine]
        end
        subgraph Middleware ["Middleware"]
            RL[Rate Limiter]
            LOG[Request Logger]
            ERR[Error Handler]
            VAL[Zod Validator]
        end
    end

    subgraph Data ["Data Layer"]
        PG[(PostgreSQL)]
        SOULS[souls table]
        LOGS[forge_logs table]
    end

    subgraph External ["External Clients"]
        SDK["@adclaw/sdk"]
        CURL[cURL / HTTP]
        AGENTS[AI Agents]
    end

    FP -->|POST /api/v2/tokens| V2
    HP -->|GET /api/v1/stats| V1
    LT -->|EventSource /api/events| SSE
    LT -->|GET /api/v1/events/recent| V1
    DB_PAGE -->|GET /api/souls| V1

    SDK -->|POST /api/v2/tokens| V2
    CURL -->|REST API| V2
    AGENTS -->|SDK / API| SDK

    V2 -->|validate| VAL
    V2 -->|launch| LAUNCHER
    LAUNCHER -->|calculate| SCORE
    LAUNCHER -->|assign agents| PROMO
    LAUNCHER -->|accumulate fee| BB_ENGINE
    LAUNCHER -->|persist| PG
    LAUNCHER -->|broadcast| SSE

    BB_ENGINE -->|auto-buy| SSE
    HEALTH -->|check| PG

    PG --- SOULS
    PG --- LOGS

    SSE -.->|real-time events| LT

    style Client fill:#0a0a0a,stroke:#6B7B8D,color:#fff
    style Server fill:#0a0a0a,stroke:#8A9AAD,color:#fff
    style API fill:#111111,stroke:#8A9AAD,color:#fff
    style Services fill:#111111,stroke:#6B7B8D,color:#fff
    style Middleware fill:#111111,stroke:#555,color:#fff
    style Data fill:#0a0a0a,stroke:#C4A962,color:#fff
    style External fill:#0a0a0a,stroke:#888,color:#fff
```

### Token Launch Flow

```mermaid
sequenceDiagram
    participant User as User / Developer
    participant API as Express API
    participant Val as Zod Validator
    participant Launch as Token Launcher
    participant Score as Score Engine
    participant Promo as Agent Promotion
    participant BB as Buyback Engine
    participant DB as PostgreSQL
    participant SSE as SSE Broadcaster
    participant Terminal as ADCLAW TERMINAL

    User->>API: POST /api/v2/tokens
    API->>Val: Validate request body
    Val-->>API: Parsed & validated
    API->>Launch: launchToken(request)
    Launch->>Score: calculateScore(soul_content, memory_content)
    Score-->>Launch: score: 3841
    Launch->>Score: generateBreakdown(...)
    Score-->>Launch: { intelligence, strategy, risk_profile, trust }
    Launch->>DB: INSERT into souls table
    DB-->>Launch: Token record with UUID
    Launch->>DB: INSERT into forge_logs table
    Launch->>SSE: broadcast({ type: "token_launched", ... })
    SSE-->>Terminal: data: { token_launched event }
    Launch->>BB: accumulateFee(wallet, 0.5, "launch fee")
    BB-->>SSE: broadcast({ type: "buyback_executed", ... })
    Launch->>Promo: createCampaign(tokenName, tokenId, wallet)
    Promo-->>SSE: broadcast({ type: "agent_assigned", ... }) x6
    Launch-->>API: { success, token, score_breakdown, agents_assigned }
    API-->>User: 201 Created
```

### Buyback Flow

```mermaid
sequenceDiagram
    participant Fee as Platform Fee
    participant BB as Buyback Engine
    participant DEX as Raydium DEX
    participant SSE as SSE Broadcaster

    Fee->>BB: accumulateFee(0.5 SOL, "launch fee")
    Note over BB: Check threshold (≥0.1 SOL)
    Note over BB: Check cooldown (≥10s since last)
    BB->>DEX: Execute market buy
    DEX-->>BB: tokens_acquired: 2,489 $ADCLAW
    BB->>BB: Record in ledger
    BB->>SSE: broadcast("buyback_executed")
    Note over SSE: All terminal clients receive event
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | SPA with component-based UI |
| **Routing** | Wouter | Lightweight client-side routing |
| **State** | TanStack Query v5 | Server state management with caching |
| **Styling** | Tailwind CSS | Utility-first CSS with custom design tokens |
| **Fonts** | Inter / Fira Code | Brand + body / Monospace terminal |
| **Backend** | Express.js + TypeScript | REST API server with service architecture |
| **Database** | PostgreSQL | Persistent storage via Drizzle ORM |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Validation** | Zod + drizzle-zod | Request/response schema validation |
| **Real-time** | Server-Sent Events (SSE) | One-way event streaming to clients |
| **Build** | Vite | Frontend bundler with HMR |
| **Runtime** | tsx | TypeScript execution for Node.js |

---

## Project Structure

```
adclaw/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.tsx              # Landing with hero, stats, feeds, terminal
│   │   │   ├── forge.tsx             # Token launch form + auto-launch mode
│   │   │   ├── live.tsx              # ADCLAW TERMINAL — real-time event viewer
│   │   │   ├── ecosystem.tsx         # SDK install tabs + ecosystem flow
│   │   │   ├── dashboard.tsx         # User's launched tokens
│   │   │   └── not-found.tsx         # 404 page
│   │   ├── components/
│   │   │   ├── Header.tsx            # Navigation with wallet connect
│   │   │   ├── AgentCard.tsx         # Token/agent display card
│   │   │   ├── LiveForgeTerminal.tsx # Animated terminal on home page
│   │   │   ├── WalletButton.tsx      # Phantom wallet connector
│   │   │   ├── UploadZone.tsx        # File upload drag-and-drop
│   │   │   └── AuroraBackground.tsx  # Animated background blobs
│   │   ├── lib/
│   │   │   ├── wallet.tsx            # Wallet context provider
│   │   │   └── queryClient.ts        # TanStack Query configuration
│   │   ├── App.tsx                   # Root component with routing
│   │   └── index.css                 # Global styles and design tokens
│   └── public/
│       └── downloads/                # Downloadable assets
├── server/
│   ├── api/                          # Domain-specific route handlers
│   │   ├── tokens.ts                 # POST/GET token endpoints
│   │   ├── buyback.ts                # Buyback stats + ledger endpoints
│   │   └── health.ts                 # Health check + diagnostics
│   ├── services/                     # Business logic layer
│   │   ├── scoreEngine.ts            # Agent Engine Score calculation
│   │   ├── buybackEngine.ts          # Fee accumulation + auto-buyback
│   │   ├── agentPromotion.ts         # Campaign + agent assignment
│   │   └── tokenLauncher.ts          # Launch orchestration
│   ├── middleware/                    # Express middleware
│   │   ├── rateLimit.ts              # Per-client rate limiting
│   │   ├── requestLogger.ts          # Structured request logging
│   │   └── errorHandler.ts           # Centralized error handling
│   ├── config/                       # Configuration
│   │   ├── index.ts                  # Env config with Zod validation
│   │   └── constants.ts              # Platform constants + score weights
│   ├── utils/                        # Utility functions
│   │   ├── wallet.ts                 # Solana address validation
│   │   ├── crypto.ts                 # SHA256, content hashing, ID gen
│   │   └── formatters.ts             # Number/time/SOL formatting
│   ├── types/
│   │   └── api.ts                    # API request/response types
│   ├── index.ts                      # Server entry point
│   ├── routes.ts                     # Route registration
│   ├── storage.ts                    # Database access layer (IStorage)
│   ├── events.ts                     # SSE EventBroadcaster class
│   ├── db.ts                         # Drizzle database connection
│   └── seed.ts                       # Database seeding
├── shared/
│   └── schema.ts                     # Drizzle schema + Zod types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── drizzle.config.ts
```

---

## Database Schema

### `souls` table

Stores launched tokens and their associated agent configuration.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `varchar` (UUID) | Primary key, auto-generated |
| `name` | `text` | Token name |
| `description` | `text` | Token description |
| `soul_content` | `text` | Full agent configuration content |
| `memory_content` | `text` | Agent deployment/memory content |
| `owner_wallet` | `text` | Solana wallet address (32–44 chars) |
| `soul_score` | `integer` | Computed Agent Engine Score (500–5000) |
| `mint_address` | `text` | On-chain mint address |
| `arweave_hash` | `text` | Permanent storage hash |
| `price` | `text` | Launch fee (SOL) |
| `is_listed` | `boolean` | Whether token is active |
| `image_url` | `text` | Marketing image URL |
| `created_at` | `timestamp` | Creation timestamp |

### `forge_logs` table

Immutable log of all platform events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `varchar` (UUID) | Primary key, auto-generated |
| `wallet` | `text` | Wallet that performed the action |
| `action` | `text` | Event type (`token_launch`, `forge`, etc.) |
| `category` | `text` | Event category for terminal filtering |
| `soul_id` | `text` | Associated token UUID |
| `soul_name` | `text` | Associated token name |
| `sol_amount` | `text` | SOL amount (if applicable) |
| `tx_signature` | `text` | Transaction signature (if applicable) |
| `message` | `text` | Human-readable event message |
| `created_at` | `timestamp` | Event timestamp |

---

## API Reference

Base URL: `https://your-domain.com`

### `POST /api/v2/tokens` — Launch Token

Launch a new community token with automatic agent assignment and buyback routing.

**Request:**

```json
{
  "name": "Sentinel Alpha",
  "description": "Community token for autonomous trading",
  "soul_content": "# TOKEN.md\nSentinel Alpha — community token launched via AdClaw...",
  "memory_content": "# DEPLOY.md\n## Launch Configuration\n- Launched via AdClaw...",
  "owner_wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}
```

**Response (201):**

```json
{
  "success": true,
  "token": {
    "id": "8c5fd712-373a-47d2-b4a8-19c78cdd20ec",
    "name": "Sentinel Alpha",
    "description": "Community token for autonomous trading",
    "score": 3841,
    "score_breakdown": {
      "intelligence": { "score": 120, "max": 300, "matches": ["analyze", "optimize"] },
      "strategy": { "score": 110, "max": 250, "matches": ["trade", "execut"] },
      "risk_profile": { "score": 100, "max": 250, "matches": ["safety", "limit"] },
      "trust": { "score": 90, "max": 200, "matches": ["verify", "chain"] }
    },
    "owner_wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "mint_address": "mint_m1f8k2_a7b3c9",
    "agents_assigned": 6,
    "created_at": "2026-02-27T06:48:00.000Z"
  }
}
```

**Validation Rules:**

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | string | Required, 1–100 characters |
| `description` | string | Optional, max 500 characters |
| `soul_content` | string | Required, minimum 10 characters |
| `memory_content` | string | Required, minimum 10 characters |
| `owner_wallet` | string | Required, 32–44 characters (Solana base58) |
| `image_url` | string | Optional, valid URL |

---

### `GET /api/v2/tokens` — List Tokens

```bash
GET /api/v2/tokens
GET /api/v2/tokens?owner_wallet=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

---

### `GET /api/v2/tokens/:id/score` — Score Breakdown

```json
{
  "success": true,
  "token_id": "8c5fd712-...",
  "name": "Sentinel Alpha",
  "score": 3841,
  "tier": "B-Tier",
  "breakdown": { ... },
  "scored_at": "2026-02-27T06:48:00.000Z"
}
```

---

### `GET /api/v2/buyback/stats` — Buyback Statistics

```json
{
  "success": true,
  "token": "$ADCLAW",
  "dex": "raydium",
  "fee_model": "100% of platform fees → market buyback",
  "stats": {
    "totalBuybacks": 42,
    "totalSolSpent": 21.5,
    "totalTokensAcquired": 106842,
    "averagePrice": 0.000201,
    "lastBuybackAt": "2026-02-27T06:45:00.000Z",
    "pendingAccumulation": 0.15
  }
}
```

---

### `GET /api/v2/buyback/recent` — Recent Buybacks

```json
{
  "success": true,
  "count": 5,
  "buybacks": [
    {
      "id": "bb_m1f8k2_a7b3",
      "trigger": "Sentinel Alpha launch fee",
      "sol_amount": 0.5,
      "tokens_acquired": 2489,
      "token_price_sol": 0.000201,
      "tx_signature": "3xYz...",
      "executed_at": "2026-02-27T06:48:00.000Z"
    }
  ]
}
```

---

### `GET /api/v2/health` — Health Check

Returns platform health with database, SSE, and memory status.

```json
{
  "status": "healthy",
  "version": "1.2.0",
  "uptime_seconds": 3600,
  "checks": {
    "database": { "status": "up", "latency_ms": 3 },
    "sse": { "status": "up", "details": "7 connected clients" },
    "memory": { "status": "up", "details": "heap: 48/64MB (75%), rss: 92MB" }
  }
}
```

---

### `GET /api/events` — SSE Live Event Stream

Establishes a persistent Server-Sent Events connection for real-time platform events.

```bash
curl -N -H "Accept: text/event-stream" https://your-domain.com/api/events
```

**Event Types:**

| Event | Category | Trigger |
|-------|----------|---------|
| `token_launched` | launching | New token launched |
| `soul_forged` | forging | Legacy forge event |
| `buyback_executed` | buyback | Automatic buyback completed |
| `agent_assigned` | agent | Agent assigned to campaign |
| `promotion_posted` | agent | Agent posted promotion content |
| `connected` | system | New SSE client connected |

**JavaScript Client:**

```javascript
const source = new EventSource('/api/events');

source.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`[${data.type}] ${data.message}`);
};
```

---

## Agent Engine Score

The Agent Engine Score is a deterministic metric (500–5000) calculated from token configuration content. It evaluates agent capability across four weighted dimensions.

### Score Dimensions

| Dimension | Weight | Max Score | Keywords Analyzed |
|-----------|--------|-----------|-------------------|
| **Intelligence** | 30% | 300 | strategy, analyze, learn, optimize, algorithm, heuristic, model, predict, inference, neural |
| **Strategy** | 25% | 250 | trade, arbitrage, hedge, rebalance, position, risk, portfolio, allocat, diversif, execut |
| **Risk Profile** | 25% | 250 | safety, guard, limit, threshold, max, min, stop, protect, secure, validate |
| **Trust** | 20% | 200 | verify, audit, transparent, immutable, chain, signature, proof, authentic, integrity, trust |

### Scoring Algorithm

```
Score = keyword_matches + content_length_bonus + content_depth_bonus

keyword_matches:
  intelligence_hits × 120
  strategy_hits    × 110
  risk_hits        × 100
  trust_hits       ×  90

content_length_bonus:
  min(soul_content.length / 5, 500)
  min(memory_content.length / 8, 300)

content_depth_bonus:
  heading_count    × 50
  code_blocks      × 30
  bullet_points    × 8 (max 120)
  non_empty_lines  × 2 (max 100)

Final: clamp(score, 500, 5000)
```

### Score Tiers

| Tier | Score Range | Description |
|------|-----------|-------------|
| **S-Tier** | 5000 | Maximum capability, extensive documentation |
| **A-Tier** | 4000–4999 | High capability, well-documented agent |
| **B-Tier** | 3000–3999 | Solid capability, good documentation |
| **C-Tier** | 500–2999 | Basic capability, minimal documentation |

---

## Buyback Engine

Every platform fee is routed to the Buyback Engine, which automatically purchases $ADCLAW tokens from the open market.

### How It Works

1. **Fee Collection** — When a token is launched (0.5 SOL fee), the fee is accumulated in the engine
2. **Threshold Check** — When accumulated fees reach ≥0.1 SOL, a buyback is triggered
3. **Cooldown** — Minimum 10 seconds between buyback executions
4. **Execution** — Market buy on Raydium DEX with max 300 bps slippage
5. **Logging** — Every buyback is recorded in the ledger and broadcast via SSE

### Fee Model

- **Launch fee**: 0.5 SOL per token launch
- **Buyback allocation**: 100% of all fees
- **DEX**: Raydium
- **Token**: $ADCLAW
- **Transparency**: Every buyback visible in the ADCLAW TERMINAL

---

## Agent Promotion System

When a token is launched, AdClaw assigns a swarm of 6 autonomous agents to promote it across 4 platforms.

### Agent Distribution

| Platform | Agents | Content Types |
|----------|--------|--------------|
| **X (Twitter)** | 3 | Tweets, replies, quote-tweets, threads |
| **Telegram** | 1 | Channel posts, group messages |
| **Discord** | 1 | Channel posts, thread discussions |
| **Reddit** | 1 | DD posts, analysis threads |

### Campaign Lifecycle

1. **Assignment** — 6 agents are assigned to the campaign with platform-specific handles
2. **Promotion** — Agents post content using token-specific templates
3. **Tracking** — Impressions and engagement are tracked per agent
4. **Reporting** — All promotion events are broadcast via SSE

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
git clone https://github.com/adclaw/adclaw.git
cd adclaw
npm install
```

### Environment Variables

```bash
DATABASE_URL=postgresql://user:password@host:5432/adclaw
PORT=5000
NODE_ENV=development
```

### Running

```bash
npm run dev
```

This starts both the Express backend and Vite frontend on port 5000.

### Database

The database schema is managed by Drizzle ORM. Tables are created automatically on first run, and sample data is seeded if the database is empty.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.
