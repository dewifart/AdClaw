import type { Soul, ForgeLog } from "@shared/schema";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  count: number;
  offset: number;
  limit: number;
}

export interface TokenLaunchRequest {
  name: string;
  description?: string;
  soul_content: string;
  memory_content: string;
  owner_wallet: string;
  image_url?: string;
}

export interface TokenLaunchResponse {
  id: string;
  name: string;
  description: string;
  score: number;
  score_breakdown: ScoreBreakdown;
  owner_wallet: string;
  mint_address: string | null;
  agents_assigned: number;
  created_at: string;
}

export interface ScoreBreakdown {
  intelligence: ScoreDimension;
  strategy: ScoreDimension;
  risk_profile: ScoreDimension;
  trust: ScoreDimension;
}

export interface ScoreDimension {
  score: number;
  max: number;
  matches: string[];
}

export interface BuybackEntry {
  id: string;
  trigger: string;
  sol_amount: number;
  tokens_acquired: number;
  token_price_sol: number;
  tx_signature: string | null;
  source_wallet: string;
  executed_at: string;
}

export interface BuybackStats {
  total_buybacks: number;
  total_sol_spent: number;
  total_tokens_acquired: number;
  average_price: number;
  last_buyback_at: string | null;
}

export interface PlatformStats {
  total_launched: number;
  total_listed: number;
  average_score: number;
  connected_clients: number;
  total_buyback_sol: number;
  active_campaigns: number;
}

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  uptime_seconds: number;
  checks: {
    database: ComponentHealth;
    sse: ComponentHealth;
    memory: ComponentHealth;
  };
}

export interface ComponentHealth {
  status: "up" | "down" | "degraded";
  latency_ms?: number;
  details?: string;
}

export interface ForgeLogInput {
  wallet: string;
  action: string;
  category: string;
  soul_id?: string;
  soul_name?: string;
  sol_amount?: string;
  tx_signature?: string;
  message: string;
}

export interface PromotionEvent {
  agent_id: string;
  platform: "x" | "telegram" | "discord" | "reddit";
  action: "post" | "reply" | "retweet" | "thread";
  content_preview: string;
  impressions: number;
  engagement_rate: number;
  token_name: string;
  timestamp: string;
}

export type SoulPublic = Omit<Soul, "soulContent" | "memoryContent">;

export function toPublicSoul(soul: Soul): SoulPublic {
  const { soulContent, memoryContent, ...rest } = soul;
  return rest;
}

export function formatForgeLog(log: ForgeLog) {
  return {
    id: log.id,
    wallet: log.wallet,
    action: log.action,
    category: log.category,
    soul_id: log.soulId,
    soul_name: log.soulName,
    sol_amount: log.solAmount,
    tx_signature: log.txSignature,
    message: log.message,
    created_at: log.createdAt.toISOString(),
  };
}
