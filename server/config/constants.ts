export const PLATFORM = {
  NAME: "AdClaw",
  VERSION: "1.2.0",
  DESCRIPTION: "Autonomous token promotion platform on Solana",
  CHAIN: "solana-mainnet",
  TOKEN_SYMBOL: "$ADCLAW",
} as const;

export const LAUNCH_FEE_SOL = 0.5;

export const BUYBACK = {
  FEE_PERCENTAGE: 1.0,
  MIN_ACCUMULATION_SOL: 0.1,
  MAX_SLIPPAGE_BPS: 300,
  COOLDOWN_MS: 10_000,
  DEX: "raydium" as const,
} as const;

export const SCORE = {
  MIN: 500,
  MAX: 5000,
  TIERS: {
    S: { min: 5000, label: "S-Tier", color: "#E0E4E8" },
    A: { min: 4000, label: "A-Tier", color: "#8A9AAD" },
    B: { min: 3000, label: "B-Tier", color: "#6B7B8D" },
    C: { min: 0, label: "C-Tier", color: "#4A5568" },
  },
} as const;

export const SCORE_WEIGHTS = {
  intelligence: {
    weight: 0.3,
    multiplier: 120,
    keywords: [
      "strategy", "analyze", "learn", "optimize", "algorithm",
      "heuristic", "model", "predict", "inference", "neural",
    ],
  },
  strategy: {
    weight: 0.25,
    multiplier: 110,
    keywords: [
      "trade", "arbitrage", "hedge", "rebalance", "position",
      "risk", "portfolio", "allocat", "diversif", "execut",
    ],
  },
  risk_profile: {
    weight: 0.25,
    multiplier: 100,
    keywords: [
      "safety", "guard", "limit", "threshold", "max",
      "min", "stop", "protect", "secure", "validate",
    ],
  },
  trust: {
    weight: 0.2,
    multiplier: 90,
    keywords: [
      "verify", "audit", "transparent", "immutable", "chain",
      "signature", "proof", "authentic", "integrity", "trust",
    ],
  },
} as const;

export const PROMOTION_PLATFORMS = ["x", "telegram", "discord", "reddit"] as const;
export type PromotionPlatform = (typeof PROMOTION_PLATFORMS)[number];

export const AGENTS_PER_CAMPAIGN = 6;

export const API = {
  V1_PREFIX: "/api/v1",
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 50,
  SOUL_CONTENT_MIN_LENGTH: 10,
  MEMORY_CONTENT_MIN_LENGTH: 10,
  WALLET_MIN_LENGTH: 32,
  WALLET_MAX_LENGTH: 44,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

export const SSE_EVENT_TYPES = {
  CONNECTED: "connected",
  TOKEN_LAUNCHED: "token_launched",
  SOUL_FORGED: "soul_forged",
  SOUL_LISTED: "soul_listed",
  BUYBACK_EXECUTED: "buyback_executed",
  AGENT_ASSIGNED: "agent_assigned",
  PROMOTION_POSTED: "promotion_posted",
} as const;
