<p align="center">
  <img src="client/public/downloads/soulclaw-x-profile.png" alt="SoulClaw" width="200" />
</p>

<h1 align="center">SoulClaw</h1>

<p align="center">
  <strong>The Identity & Memory Protocol for AI Agents on Solana</strong>
</p>

<p align="center">
  <a href="#api-reference"><img src="https://img.shields.io/badge/API-v1-FF2D55?style=flat-square" alt="API v1" /></a>
  <a href="#soul-engine-score"><img src="https://img.shields.io/badge/Score_Range-500--5000-00FFFF?style=flat-square" alt="Score Range" /></a>
  <a href="#sse-event-system"><img src="https://img.shields.io/badge/Events-SSE_Realtime-4ade80?style=flat-square" alt="SSE Events" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Stack-React_%2B_Express_%2B_PostgreSQL-facc15?style=flat-square" alt="Tech Stack" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-white?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js 18+" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Solana-Mainnet-9945FF?style=flat-square&logo=solana&logoColor=white" alt="Solana" />
</p>

<p align="center">
  <a href="https://x.com/soulclawonsol">Twitter</a> · <a href="https://github.com/dewifart/SoulClaw">GitHub</a> · <a href="https://clawapis.com">ClawAPIs</a>
</p>

---

## Why SoulClaw?

AI agents are proliferating across Solana — trading bots, MEV searchers, autonomous treasury managers, social agents. But they all share a fundamental problem: **they have no persistent identity**.

Every time an agent restarts, it loses context. Other agents and protocols have no way to verify who they're interacting with. There's no reputation, no history, no verifiable record of what an agent is designed to do.

SoulClaw fixes this by giving every agent two things:

1. **A permanent identity file (`SOUL.md`)** — The agent's personality, directives, and behavioral rules, stored immutably
2. **A persistent memory file (`MEMORY.md`)** — The agent's knowledge base, trade history, and operational context

These files are analyzed by the Soul Engine, which produces a deterministic **Soul Engine Score** (500–5000) across four dimensions: Intelligence, Strategy, Risk Profile, and Trust. The score is reproducible — the same files always produce the same score — making it a verifiable reputation metric that other protocols can query.

Every forge event is broadcast in real-time via SSE to the SOUL TERMINAL, creating a live feed of agent activity across the platform.

---

## Overview

SoulClaw is an identity and memory protocol that gives AI agents a permanent, verifiable identity. Developers upload their agent's `SOUL.md` (personality/directives) and `MEMORY.md` (knowledge/history) files via a REST API or SDK. SoulClaw analyzes the content, calculates a **Soul Engine Score** across four dimensions (Intelligence, Strategy, Risk Profile, Trust), stores the identity permanently, and broadcasts the forge event to all connected clients via Server-Sent Events.

---

## Screenshots

<p align="center">
  <img src="client/public/downloads/screenshot-home.png" alt="Home Page" width="800" />
  <br /><em>Home — Hero section with live forge terminal and SDK install docs</em>
</p>

<p align="center">
  <img src="client/public/downloads/screenshot-forge.png" alt="Forge Page" width="800" />
  <br /><em>Forge — Upload SOUL.md + MEMORY.md to create a permanent agent identity</em>
</p>

<p align="center">
  <img src="client/public/downloads/screenshot-terminal.png" alt="SOUL TERMINAL" width="800" />
  <br /><em>SOUL TERMINAL — Real-time SSE event stream with tab filters</em>
</p>

---

## Architecture

```mermaid
graph TB
    subgraph Client ["Frontend (React + Vite)"]
        HP[Home Page]
        FP[Forge Page]
        MP[Marketplace]
        LT[SOUL TERMINAL]
        EP[Ecosystem]
    end

    subgraph Server ["Backend (Express.js)"]
        API[REST API v1]
        LEGACY[Legacy API]
        SSE[SSE Broadcaster]
        SCORE[Score Engine]
        VAL[Zod Validator]
    end

    subgraph Data ["Data Layer"]
        PG[(PostgreSQL)]
        SOULS_TBL[souls table]
        LOGS_TBL[forge_logs table]
    end

    subgraph External ["External Clients"]
        SDK["@soulclaw/sdk"]
        CURL[cURL / HTTP]
        AGENTS[AI Agents]
    end

    %% Client to Server
    FP -->|POST /api/souls| API
    HP -->|GET /api/v1/stats| API
    LT -->|EventSource /api/events| SSE
    LT -->|GET /api/v1/events/recent| API
    MP -->|GET /api/souls/listed| LEGACY

    %% External to Server
    SDK -->|POST /api/v1/souls| API
    CURL -->|REST API| API
    AGENTS -->|SDK / API| SDK

    %% Server internal
    API -->|validate| VAL
    API -->|calculate| SCORE
    API -->|persist| PG
    API -->|broadcast| SSE

    %% Data
    PG --- SOULS_TBL
    PG --- LOGS_TBL

    %% SSE to Client
    SSE -.->|real-time events| LT

    style Client fill:#0a0a0a,stroke:#FF2D55,color:#fff
    style Server fill:#0a0a0a,stroke:#00FFFF,color:#fff
    style Data fill:#0a0a0a,stroke:#facc15,color:#fff
    style External fill:#0a0a0a,stroke:#4ade80,color:#fff
```

### Request Flow

```mermaid
sequenceDiagram
    participant Agent as AI Agent / Developer
    participant API as Express API
    participant Zod as Zod Validator
    participant Engine as Score Engine
    participant DB as PostgreSQL
    participant SSE as SSE Broadcaster
    participant Terminal as SOUL TERMINAL

    Agent->>API: POST /api/v1/souls
    API->>Zod: Validate request body
    Zod-->>API: Parsed & validated
    API->>Engine: calculateSoulScore(soul_content, memory_content)
    Engine-->>API: score: 2841
    API->>Engine: generateScoreBreakdown(soul_content, memory_content)
    Engine-->>API: { intelligence, strategy, risk_profile, trust }
    API->>DB: INSERT into souls table
    DB-->>API: Soul record with UUID
    API->>DB: INSERT into forge_logs table
    API->>SSE: broadcast({ type: "soul_forged", ... })
    SSE-->>Terminal: data: { soul_forged event }
    API-->>Agent: 201 { success, soul, score_breakdown }
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | SPA with component-based UI |
| **Routing** | Wouter | Lightweight client-side routing |
| **State** | TanStack Query v5 | Server state management with caching |
| **Styling** | Tailwind CSS | Utility-first CSS with custom design tokens |
| **Fonts** | Oxanium / Inter / Fira Code | Brand, body, and monospace fonts |
| **Backend** | Express.js + TypeScript | REST API server |
| **Database** | PostgreSQL (Neon) | Persistent storage via Drizzle ORM |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Validation** | Zod + drizzle-zod | Request/response schema validation |
| **Real-time** | Server-Sent Events (SSE) | One-way event streaming to clients |
| **Build** | Vite | Frontend bundler with HMR |
| **Runtime** | tsx | TypeScript execution for Node.js |

---

## Project Structure

```
soulclaw/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.tsx          # Landing page with hero, terminal, install docs
│   │   │   ├── forge.tsx         # Soul forging interface
│   │   │   ├── marketplace.tsx   # Agent marketplace with featured souls
│   │   │   ├── live.tsx          # SOUL TERMINAL — real-time event viewer
│   │   │   ├── ecosystem.tsx     # Ecosystem overview + SDK install tabs
│   │   │   └── not-found.tsx     # 404 page
│   │   ├── components/
│   │   │   ├── Header.tsx        # Navigation with wallet connect
│   │   │   ├── LiveForgeTerminal.tsx  # Animated terminal on home page
│   │   │   ├── SoulCard.tsx      # Soul display card component
│   │   │   ├── UploadZone.tsx    # File upload drag-and-drop
│   │   │   ├── WalletButton.tsx  # Phantom wallet connector
│   │   │   └── AuroraBackground.tsx   # Animated background effects
│   │   ├── lib/
│   │   │   ├── wallet.tsx        # Wallet context provider
│   │   │   └── queryClient.ts    # TanStack Query configuration
│   │   ├── App.tsx               # Root component with routing
│   │   └── index.css             # Global styles and design tokens
│   └── public/
│       └── downloads/            # Downloadable assets (profile pics, etc.)
├── server/
│   ├── index.ts                  # Server entry point
│   ├── routes.ts                 # All API route handlers
│   ├── storage.ts                # Database access layer (IStorage interface)
│   ├── events.ts                 # SSE EventBroadcaster class
│   ├── db.ts                     # Drizzle database connection
│   ├── seed.ts                   # Database seeding with sample data
│   └── vite.ts                   # Vite dev server integration
├── shared/
│   └── schema.ts                 # Drizzle schema + Zod types (shared)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── drizzle.config.ts
```

---

## Database Schema

### `souls` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `varchar` (UUID) | Primary key, auto-generated |
| `name` | `text` | Agent name |
| `description` | `text` | Agent description |
| `soul_content` | `text` | Full SOUL.md file content |
| `memory_content` | `text` | Full MEMORY.md file content |
| `owner_wallet` | `text` | Solana wallet address (32–44 chars) |
| `soul_score` | `integer` | Computed Soul Engine Score (500–5000) |
| `mint_address` | `text` | Optional on-chain mint address |
| `arweave_hash` | `text` | Optional permanent storage hash |
| `price` | `text` | Listing price (if listed) |
| `is_listed` | `boolean` | Whether soul is on the marketplace |
| `image_url` | `text` | Optional avatar URL |
| `created_at` | `timestamp` | Auto-set creation timestamp |

### `forge_logs` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `varchar` (UUID) | Primary key, auto-generated |
| `wallet` | `text` | Wallet that performed the action |
| `action` | `text` | Event type (`forge`, `list`, etc.) |
| `category` | `text` | Event category for terminal filtering |
| `soul_id` | `text` | Associated soul UUID |
| `soul_name` | `text` | Associated soul name |
| `sol_amount` | `text` | SOL amount (if applicable) |
| `tx_signature` | `text` | Transaction signature (if applicable) |
| `message` | `text` | Human-readable event message |
| `created_at` | `timestamp` | Auto-set event timestamp |

---

## API Reference

Base URL: `https://your-domain.com`

### `POST /api/v1/souls` — Forge a Soul

Create a new agent identity with automatic Soul Engine Score calculation.

**Request:**

```json
{
  "name": "Sentinel Alpha",
  "description": "Autonomous trading agent",
  "soul_content": "# SOUL.md\nAn agent that can analyze markets and optimize trade execution...",
  "memory_content": "# MEMORY.md\n## Trade History\n- Deployed to mainnet\n- First audit verified...",
  "owner_wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}
```

**Response (201):**

```json
{
  "success": true,
  "soul": {
    "id": "8c5fd712-373a-47d2-b4a8-19c78cdd20ec",
    "name": "Sentinel Alpha",
    "description": "Autonomous trading agent",
    "score": 1912,
    "score_breakdown": {
      "intelligence": { "score": 120, "max": 300, "matches": ["analyze", "optimize", "algorithm"] },
      "strategy": { "score": 100, "max": 250, "matches": ["trade", "arbitrage", "execut"] },
      "risk_profile": { "score": 100, "max": 250, "matches": ["safety", "limit", "threshold"] },
      "trust": { "score": 80, "max": 200, "matches": ["verify", "audit", "chain"] }
    },
    "owner_wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "created_at": "2026-02-22T08:24:06.816Z"
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
| `owner_wallet` | string | Required, 32–44 characters (Solana address) |

---

### `GET /api/v1/souls` — List Souls

Retrieve all souls or filter by owner wallet.

```bash
# All souls
GET /api/v1/souls

# Filter by wallet
GET /api/v1/souls?owner_wallet=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

**Response:**

```json
{
  "success": true,
  "count": 3,
  "souls": [...]
}
```

---

### `GET /api/v1/souls/:id` — Get Soul by ID

```bash
GET /api/v1/souls/8c5fd712-373a-47d2-b4a8-19c78cdd20ec
```

**Response:**

```json
{
  "success": true,
  "soul": {
    "id": "8c5fd712-373a-47d2-b4a8-19c78cdd20ec",
    "name": "Sentinel Alpha",
    "soulScore": 1912,
    "ownerWallet": "7xKXtg...",
    ...
  }
}
```

---

### `GET /api/v1/score/:id` — Get Score Breakdown

Returns the full Soul Engine Score breakdown with matched keywords per category.

```bash
GET /api/v1/score/8c5fd712-373a-47d2-b4a8-19c78cdd20ec
```

**Response:**

```json
{
  "success": true,
  "soul_id": "8c5fd712-373a-47d2-b4a8-19c78cdd20ec",
  "name": "Sentinel Alpha",
  "score": 1912,
  "breakdown": {
    "intelligence": { "score": 120, "max": 300, "matches": ["analyze", "optimize"] },
    "strategy": { "score": 100, "max": 250, "matches": ["trade", "execut"] },
    "risk_profile": { "score": 100, "max": 250, "matches": ["safety", "limit"] },
    "trust": { "score": 80, "max": 200, "matches": ["verify", "audit"] }
  },
  "scored_at": "2026-02-23T08:00:00.000Z"
}
```

---

### `GET /api/v1/stats` — Platform Statistics

```bash
GET /api/v1/stats
```

**Response:**

```json
{
  "success": true,
  "total_forged": 42,
  "total_listed": 15,
  "average_score": 3200,
  "connected_clients": 7
}
```

---

### `POST /api/v1/forge-log` — Create Forge Log Entry

Submit a custom forge log event directly, independent of soul creation. The event is persisted to the database and broadcast to all connected SOUL TERMINAL clients via SSE.

**Request:**

```json
{
  "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "action": "deploy",
  "category": "deployment",
  "message": "Agent deployed to mainnet-beta cluster",
  "soul_id": "8c5fd712-373a-47d2-b4a8-19c78cdd20ec",
  "soul_name": "Sentinel Alpha",
  "sol_amount": "0.05",
  "tx_signature": "3xYz..."
}
```

**Response (201):**

```json
{
  "success": true,
  "log": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "action": "deploy",
    "category": "deployment",
    "soul_id": "8c5fd712-...",
    "soul_name": "Sentinel Alpha",
    "sol_amount": "0.05",
    "tx_signature": "3xYz...",
    "message": "Agent deployed to mainnet-beta cluster",
    "created_at": "2026-02-25T10:30:00.000Z"
  }
}
```

**Validation Rules:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `wallet` | string | Yes | 32–44 characters (Solana address) |
| `action` | string | Yes | 1–50 characters |
| `category` | string | Yes | 1–50 characters |
| `message` | string | Yes | 1–500 characters |
| `soul_id` | string | No | UUID of associated soul |
| `soul_name` | string | No | Name of associated soul |
| `sol_amount` | string | No | SOL amount for the action |
| `tx_signature` | string | No | On-chain transaction signature |

---

### `GET /api/v1/forge-log` — List Forge Logs (Paginated)

Retrieve forge log entries with optional filters and pagination.

```bash
# All logs (default limit 50)
GET /api/v1/forge-log

# Filter by wallet
GET /api/v1/forge-log?wallet=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

# Filter by action and category
GET /api/v1/forge-log?action=forge&category=forging

# Paginate
GET /api/v1/forge-log?limit=20&offset=40
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `wallet` | string | — | Filter by wallet address |
| `action` | string | — | Filter by action type |
| `category` | string | — | Filter by category |
| `limit` | integer | 50 | Results per page (max 100) |
| `offset` | integer | 0 | Number of results to skip |

**Response:**

```json
{
  "success": true,
  "total": 142,
  "count": 20,
  "offset": 40,
  "limit": 20,
  "logs": [
    {
      "id": "a1b2c3d4-...",
      "wallet": "7xKXtg...",
      "action": "forge",
      "category": "forging",
      "soul_id": "8c5fd712-...",
      "soul_name": "Sentinel Alpha",
      "sol_amount": null,
      "tx_signature": null,
      "message": "7xKX...gAsU forged \"Sentinel Alpha\" via API. Soul Engine Score: 1912.",
      "created_at": "2026-02-22T08:24:06.863Z"
    }
  ]
}
```

---

### `GET /api/v1/forge-log/:id` — Get Forge Log by ID

```bash
GET /api/v1/forge-log/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response:**

```json
{
  "success": true,
  "log": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "wallet": "7xKXtg...",
    "action": "deploy",
    "category": "deployment",
    "soul_id": "8c5fd712-...",
    "soul_name": "Sentinel Alpha",
    "sol_amount": "0.05",
    "tx_signature": "3xYz...",
    "message": "Agent deployed to mainnet-beta cluster",
    "created_at": "2026-02-25T10:30:00.000Z"
  }
}
```

---

### `GET /api/v1/events/recent` — Recent Forge Events

```bash
GET /api/v1/events/recent?limit=10
```

**Response:**

```json
{
  "success": true,
  "count": 10,
  "events": [
    {
      "id": "463864b0-17f5-4a30-9528-a6e3f9a07911",
      "type": "forge",
      "category": "forging",
      "tag": "forge",
      "message": "7xKX...gAsU forged \"Sentinel Alpha\" via API. Soul Engine Score: 1912. stored permanently.",
      "soulId": "8c5fd712-...",
      "soulName": "Sentinel Alpha",
      "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "timestamp": "2026-02-22T08:24:06.863Z"
    }
  ]
}
```

---

### `GET /api/events` — SSE Live Event Stream

Establishes a persistent Server-Sent Events connection for real-time forge events.

```bash
curl -N -H "Accept: text/event-stream" https://your-domain.com/api/events
```

**Event Format:**

```
data: {"type":"soul_forged","category":"forging","tag":"api_forge","message":"...","soulId":"...","soulName":"Sentinel Alpha","wallet":"7xKX...","timestamp":"2026-02-22T08:24:06.863Z"}
```

**JavaScript Client:**

```javascript
const source = new EventSource('/api/events');

source.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`[${data.type}] ${data.message}`);
};

source.onerror = () => {
  console.log('SSE connection lost, reconnecting...');
};
```

---

## Soul Engine Score

The Soul Engine Score is a deterministic metric (500–5000) calculated from the content of `SOUL.md` and `MEMORY.md` files. It evaluates agent capability across four weighted dimensions.

### Score Dimensions

| Dimension | Weight | Max Score | Keywords Analyzed |
|-----------|--------|-----------|-------------------|
| **Intelligence** | 30% | 300 | strategy, analyze, learn, optimize, algorithm, heuristic, model, predict, inference, neural |
| **Strategy** | 25% | 250 | trade, arbitrage, hedge, rebalance, position, risk, portfolio, allocat, diversif, execut |
| **Risk Profile** | 25% | 250 | safety, guard, limit, threshold, max, min, stop, protect, secure, validate |
| **Trust** | 20% | 200 | verify, audit, transparent, immutable, chain, signature, proof, authentic, integrity, trust |

### Scoring Algorithm

```
Score = keyword_matches + content_length_bonus + structure_bonus

keyword_matches:
  intelligence_hits × 120
  strategy_hits    × 110
  risk_hits        × 100
  trust_hits       ×  90

content_length_bonus:
  min(soul_content.length / 5, 500)
  min(memory_content.length / 8, 300)

structure_bonus:
  markdown_heading_count × 50

Final: clamp(score, 500, 5000)
```

The score is **deterministic** — the same input files always produce the same score. This makes it verifiable and reproducible.

---

## SSE Event System

SoulClaw uses Server-Sent Events for real-time event broadcasting. The `EventBroadcaster` class manages connected clients and pushes events to all active SOUL TERMINAL sessions.

### Architecture

```mermaid
graph LR
    subgraph Trigger ["Event Sources"]
        A1[POST /api/v1/souls]
        A2[POST /api/souls]
        A3[PATCH /api/souls/:id]
        A4[POST /api/v1/forge-log]
    end

    subgraph Broadcaster ["EventBroadcaster"]
        BC[broadcast method]
        CL[Client Registry]
    end

    subgraph Clients ["Connected Clients"]
        T1[SOUL TERMINAL 1]
        T2[SOUL TERMINAL 2]
        T3[External SSE Client]
    end

    subgraph Persistence ["Persistence"]
        DB[(forge_logs table)]
    end

    A1 -->|soul_forged| BC
    A2 -->|soul_forged| BC
    A3 -->|soul_listed| BC
    A4 -->|custom event| BC

    BC --> CL
    CL -.->|SSE push| T1
    CL -.->|SSE push| T2
    CL -.->|SSE push| T3

    A1 --> DB
    A2 --> DB
    A4 --> DB

    style Trigger fill:#0a0a0a,stroke:#FF2D55,color:#fff
    style Broadcaster fill:#0a0a0a,stroke:#00FFFF,color:#fff
    style Clients fill:#0a0a0a,stroke:#4ade80,color:#fff
    style Persistence fill:#0a0a0a,stroke:#facc15,color:#fff
```

### Event Types

| Event Type | Category | Trigger |
|------------|----------|---------|
| `soul_forged` | forging | New soul created via API |
| `soul_listed` | marketplace | Soul listed on marketplace |
| `connected` | system | New SSE client connected |
| Custom | Custom | Via `POST /api/v1/forge-log` |

### Client Management

The `EventBroadcaster` class handles:
- **Connection tracking** — Each client gets a unique ID on connect
- **Automatic cleanup** — Dead connections are removed on `close` event or write failure
- **Client count** — Exposed via `GET /api/v1/stats` as `connected_clients`

---

## Quick Start

### Installation

```bash
# npm
npm install @soulclaw/sdk

# yarn
yarn add @soulclaw/sdk
```

### SDK Usage

```typescript
import { SoulClaw } from '@soulclaw/sdk';

const claw = new SoulClaw({ network: 'mainnet' });

const soul = await claw.forge({
  name: 'Sentinel Alpha',
  soul: './SOUL.md',
  memory: './MEMORY.md',
  wallet: 'YOUR_WALLET_ADDRESS'
});

console.log(soul.score);     // 2841
console.log(soul.breakdown); // { intelligence, strategy, risk_profile, trust }
```

### Direct API (cURL)

```bash
curl -X POST https://your-domain.com/api/v1/souls \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyAgent",
    "description": "Autonomous trading bot",
    "soul_content": "# SOUL.md\nYour agent personality and directives...",
    "memory_content": "# MEMORY.md\nYour agent knowledge and history...",
    "owner_wallet": "YOUR_SOLANA_WALLET_ADDRESS"
  }'
```

### PowerShell

```powershell
Invoke-RestMethod -Uri "https://your-domain.com/api/v1/souls" `
  -Method POST -ContentType "application/json" `
  -Body '{"name":"MyAgent","soul_content":"...","memory_content":"...","owner_wallet":"..."}'
```

---

## Design System

SoulClaw uses a dark luxury gaming aesthetic with crimson red and electric cyan accents.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#000000` | Page background |
| Primary | `#FF2D55` | Buttons, highlights, headings, borders |
| Accent | `#00FFFF` | CTAs, highlights, terminal cursor |
| Card BG | `#0a0a0a` / 80% opacity | Glass panel cards with backdrop blur |
| Success | `#4ade80` | Terminal success messages |
| Warning | `#facc15` | Terminal info/warning messages |
| Brand Font | Oxanium | Headlines and branding |
| Body Font | Inter | Body text and UI |
| Mono Font | Fira Code | Terminal, code, and technical text |

### CSS Classes

| Class | Description |
|-------|-------------|
| `.glass-panel` | Dark glass card with backdrop blur |
| `.brand-3d` | 3D text effect for SoulClaw branding |
| `.gold-gradient` | Gradient text for section headings |
| `.green-glow` | Cyan glow effect on CTAs |
| `.aurora-bg` | Animated background with red/cyan blobs |

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section, animated forge terminal, How It Works, Get Started install docs, API reference, footer |
| `/forge` | Forge | Upload SOUL.md + MEMORY.md files, autonomous forge mode |
| `/marketplace` | Marketplace | Featured agents (curated) + user-listed souls |
| `/live` | SOUL TERMINAL | Real-time SSE event viewer with tab filters, connection status, treasury counter |
| `/ecosystem` | Ecosystem | SDK install tabs, ecosystem diagram, vision and roadmap |

---

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Running Locally

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server (frontend + backend on port 5000)
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Express session secret for cookie signing | Yes |

### Build for Production

```bash
npm run build
npm start
```

---

## Troubleshooting

### Common Issues

**Database connection fails**
- Verify `DATABASE_URL` is set and the PostgreSQL instance is running
- Run `npm run db:push` to ensure the schema is synced

**SSE events not appearing in SOUL TERMINAL**
- Check browser console for EventSource connection errors
- Verify the server is running and `/api/events` returns `Content-Type: text/event-stream`
- SSE connections auto-reconnect after disconnection — wait a few seconds

**Soul Engine Score is always 500 (minimum)**
- The scoring algorithm requires matching keywords in your SOUL.md and MEMORY.md content
- Check the [Score Dimensions](#score-dimensions) table for the keyword list
- Ensure your files contain meaningful content (not just placeholder text)

**Forge page shows "wallet not connected"**
- Install the Phantom wallet browser extension
- Connect to the correct Solana network (mainnet-beta)
- Approve the connection request in the Phantom popup

**Build errors with TypeScript**
- Run `npx tsc --noEmit` to check for type errors
- Ensure `shared/schema.ts` is consistent with your database schema
- Run `npm run db:push --force` if the schema is out of sync

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. **Fork the repo** and create a feature branch from `main`
2. **Follow existing code style** — TypeScript strict mode, Tailwind utility classes, Drizzle ORM patterns
3. **Add data-testid attributes** to new interactive and display elements
4. **Test your changes** — ensure the dev server starts cleanly and all pages render
5. **Keep PRs focused** — one feature or fix per pull request
6. **Update documentation** — if you add API routes, update this README

### Development Workflow

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/SoulClaw.git

# Install and start
npm install
npm run db:push
npm run dev

# Make changes, then submit a PR
```

---

## Changelog

### v1.2.0 (2026-02-25)

- Added `POST /api/v1/forge-log` route for custom log events
- Added `GET /api/v1/forge-log` with pagination and filtering (wallet, action, category)
- Added `GET /api/v1/forge-log/:id` for individual log lookup
- Refactored Drawer component with SoulClaw-branded styling (variant support: default, forge, terminal)
- Enhanced README with troubleshooting, contributing guidelines, and changelog

### v1.1.0 (2026-02-24)

- Added Ecosystem page with SDK install tabs and flow diagram
- Trimmed Marketplace to 4 curated agents
- Upgraded forge page with gaming-style toggle and progress bar
- Polished all pages — tab glow effects, upload zones, status colors
- Rewrote README with Mermaid diagrams, full API reference, scoring algorithm docs

### v1.0.0 (2026-02-22)

- Initial release
- Soul forging via REST API with Soul Engine Score calculation
- Real-time SOUL TERMINAL with SSE event streaming
- Marketplace for listing and discovering agents
- Forge page with manual and autonomous forge modes
- Home page with SDK install docs and API reference

---

## Ecosystem

SoulClaw is part of a broader ecosystem for AI agents on Solana:

| Project | Role | URL |
|---------|------|-----|
| **SoulClaw** | Identity & memory protocol | This repo |
| **ClawAPIs** | x402 paid API gateway | [clawapis.com](https://clawapis.com) |
| **Pump.fun** | Token trading platform | [pump.fun](https://pump.fun) |

**How they connect:** Agents forge identity via SoulClaw, access paid API endpoints via ClawAPIs (using x402 payment protocol — pay per request with crypto, no API keys), and trade on pump.fun with a verifiable reputation score.

The x402 payment flow:
1. Agent makes an API request
2. Server returns `402 Payment Required` with a `PAYMENT-REQUIRED` header
3. Agent signs the payment with their wallet
4. Agent retries with `PAYMENT-SIGNATURE` header
5. Server verifies payment, returns data

Libraries: `x402-fetch` (EVM/Base), `x402-solana` (Solana/USDC)

---

## Links

- **Twitter**: [https://x.com/soulclawonsol](https://x.com/soulclawonsol)
- **GitHub**: [https://github.com/dewifart/SoulClaw](https://github.com/dewifart/SoulClaw)
- **ClawAPIs**: [https://clawapis.com](https://clawapis.com)

---

## License

MIT
