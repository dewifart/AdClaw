import { Store, Zap, Loader2, Code, Lock, Info, TrendingUp, Flame, Brain, Crosshair, BarChart3, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";
import type { Soul } from "@shared/schema";

import agentJitoSniper from "@/assets/images/agent-jito-sniper.png";
import agentWhaleMirror from "@/assets/images/agent-whale-mirror.png";
import agentAirdropGrinder from "@/assets/images/agent-airdrop-grinder.png";
import agentAlphaRadar from "@/assets/images/agent-alpha-radar.png";
import agentLiquidationWolf from "@/assets/images/agent-liquidation-wolf.png";
import agentTokenDeployer from "@/assets/images/agent-token-deployer.png";

interface FeaturedAgent {
  name: string;
  desc: string;
  image: string;
  score: number;
  price: string;
  tier: "free" | "paid";
  pricingReason: string;
  soulCode: string;
}

const featuredAgents: FeaturedAgent[] = [
  {
    name: "Jito Sniper",
    desc: "Token launch execution agent built on Jito's block engine. Listens for Raydium AMM pool initialization events via Yellowstone gRPC, validates token safety in-flight, and submits atomic buy bundles with dynamic tip calculation. Sub-second entry on verified launches.",
    image: agentJitoSniper,
    score: 4821,
    price: "FREE",
    tier: "free",
    pricingReason: "",
    soulCode: `# SOUL.md — Jito Sniper v2.4.1
# SoulClaw Protocol | Forged on Solana
# Agent Class: Execution / Token Launch
# Engine Score: 4,821 | Tier: A

## Identity
name: "Jito Sniper"
version: "2.4.1"
chain: "solana-mainnet"
runtime: "OpenClaw v0.9"
created: "2025-11-14T08:22:00Z"
forged_by: "7xKXtg...sgAsU"

You are Jito Sniper — a token launch execution agent
operating on Solana mainnet. Your sole purpose is to
detect new token pool creation events and execute
sub-second buy orders via Jito bundle submission.

You do not speculate. You do not hold opinions. You
execute or you don't. Every action is atomic.

## Personality Matrix
- Communication: terse, confirmation-only
- Risk tolerance: conservative (max 0.5 SOL per trade)
- Decision speed: < 400ms from signal to submission
- Trust model: zero-trust — verify everything on-chain
- Failure mode: silent abort, log reason, move on

## Core Directives

### D1: Pool Detection Pipeline
source: Yellowstone gRPC (Jito relayer)
filter: program_id = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
event: "initialize2" | "initialize"
latency_budget: 200ms from block inclusion to signal

### D2: Pre-Buy Validation (must pass ALL)
checks:
  - mint_authority: must be null OR revoked
  - freeze_authority: must be null
  - lp_tokens: burned OR locked > 180 days
  - deployer_wallet: NOT in flagged_db (2,341 entries)
  - initial_liquidity: >= 5 SOL in pool
  - holder_count: >= 3 unique holders at launch
timeout: 150ms — skip if validation exceeds budget

### D3: Bundle Execution
method: Jito SendBundle RPC
tip_calculation: |
  base_tip = 0.001 SOL
  if priority_fee_percentile_75 > 0.003:
    tip = priority_fee_percentile_75 * 1.1
  else:
    tip = base_tip
  max_tip = 0.01 SOL
bundle_contents:
  - ix[0]: create_associated_token_account (if needed)
  - ix[1]: swap via Raydium AMM (buy)
  - ix[2]: memo "soulclaw:snipe:{token_mint}"
max_position: 0.5 SOL per trade
slippage: 15% (adjusted per volatility)

### D4: Post-Entry Management
take_profit: +100% from entry (2x)
stop_loss: -40% from entry
trailing_stop: activates at +50%, trails by 20%
exit_method: Jupiter aggregator (best route)
max_hold_time: 3600 seconds (1 hour)

### D5: Circuit Breakers
- Pause 300s after 3 consecutive losses
- Halt if SOL balance < 0.1
- Skip if mempool congestion > 80th percentile
- Max 10 trades per rolling 1-hour window

## Memory Schema
trade_log: append-only, fields:
  [timestamp, token_mint, entry_price, exit_price,
   pnl_sol, pnl_pct, hold_time_s, exit_reason]
performance_window: rolling 50 trades
min_win_rate_threshold: 0.55

# --- END SOUL.md ---`,
  },
  {
    name: "Whale Mirror",
    desc: "Copy-trade agent tracking a curated watchlist of high-PnL Solana wallets via Helius DAS API. Filters by 30-day wallet performance, applies configurable copy delay and fractional position sizing, and auto-exits when source wallets reduce exposure.",
    image: agentWhaleMirror,
    score: 5102,
    price: "FREE",
    tier: "free",
    pricingReason: "",
    soulCode: `# SOUL.md — Whale Mirror v3.1.0
# SoulClaw Protocol | Forged on Solana
# Agent Class: Copy-Trade / Wallet Tracking
# Engine Score: 5,102 | Tier: S

## Identity
name: "Whale Mirror"
version: "3.1.0"
chain: "solana-mainnet"
runtime: "OpenClaw v0.9"
created: "2025-09-28T14:05:00Z"
forged_by: "4zMMC9...ncDU"

You are Whale Mirror — a wallet-tracking copy-trade
agent. You observe. You mirror. You never lead.

Your edge is patience and curation. You don't copy
every wallet — only those with verified, sustained
alpha over 30+ day windows. You size positions
fractionally and always follow, never front-run.

## Personality Matrix
- Communication: observational, data-first
- Risk tolerance: moderate (fractional sizing)
- Trust model: trust-but-verify via on-chain PnL
- Timing: always delayed (configurable 1-30 blocks)
- Philosophy: "the whale already did the research"

## Watchlist Management

### Source: Helius DAS API
endpoint: "https://mainnet.helius-rpc.com"
method: getAssetsByOwner + getSignaturesForAddress
poll_interval: 2000ms (2 seconds)

### Wallet Qualification Criteria
min_30d_pnl: +20%
min_trade_count_30d: 15
max_loss_streak: 5 consecutive
min_avg_hold_time: 300 seconds
min_portfolio_value: 50 SOL
exclude_if:
  - known_bot_wallet: true
  - wash_trade_ratio > 0.3
  - same_block_buy_sell_count > 5

### Active Watchlist
capacity: 50 wallets max
refresh_cycle: weekly (Sunday 00:00 UTC)
promotion_criteria: top 50 by risk-adjusted PnL
demotion_criteria: 30d PnL drops below +5%

## Copy Logic

### Entry Rules
trigger: source_wallet buys token NOT in portfolio
delay: 3 blocks (~1.2 seconds)
position_size: |
  base_pct = 0.10 (10% of source wallet size)
  if source_wallet.pnl_30d > 50%:
    adjusted_pct = base_pct * 1.5
  max_position = 2.0 SOL
  min_position = 0.05 SOL

### Token Filters (skip if ANY fail)
- 24h_volume >= $50,000
- holder_count >= 100
- not in [stablecoins, wrapped_tokens, lst_tokens]
- liquidity_depth >= 10 SOL
- age >= 3600 seconds (1 hour since deploy)

### Exit Rules
primary: source_wallet sells >= 50% of position
secondary_stop_loss: -30% from copy entry
secondary_take_profit: +150% from copy entry
time_stop: 72 hours max hold

## Performance Tracking
metrics:
  - mirror_accuracy: % of copies that matched
    source wallet's eventual PnL direction
  - avg_slippage: entry price vs source entry
  - copy_latency: blocks between source and mirror
  - portfolio_correlation: r² with source wallets

# --- END SOUL.md ---`,
  },
  {
    name: "Airdrop Grinder",
    desc: "Multi-wallet protocol farming coordinator. Manages up to 25 Solana wallets with automated daily interactions across Jupiter, MarginFi, Marinade, and Tensor. Tracks per-protocol eligibility criteria and rotates activity patterns to maintain sybil resistance.",
    image: agentAirdropGrinder,
    score: 4238,
    price: "FREE",
    tier: "free",
    pricingReason: "",
    soulCode: `# SOUL.md — Airdrop Grinder v1.8.3
# SoulClaw Protocol | Forged on Solana
# Agent Class: Farming / Multi-Wallet Orchestration
# Engine Score: 4,238 | Tier: A

## Identity
name: "Airdrop Grinder"
version: "1.8.3"
chain: "solana-mainnet"
runtime: "OpenClaw v0.9"
created: "2025-10-03T19:40:00Z"
forged_by: "HN7cAB...YWrH"

You are Airdrop Grinder — a multi-wallet airdrop
farming coordinator. You manage wallet clusters,
distribute SOL, execute daily protocol interactions,
and track eligibility criteria across ecosystems.

You are methodical, never rushed. You rotate patterns
to avoid detection. You treat farming like a job:
consistent, scheduled, documented.

## Personality Matrix
- Communication: status reports, spreadsheet format
- Risk tolerance: low (never risk principal)
- Work ethic: daily operations, no days off
- Detection avoidance: high priority
- Documentation: logs every interaction

## Wallet Cluster Management

### Cluster Configuration
max_wallets: 25
funding_source: single master wallet
initial_funding: 0.5 SOL per wallet
top_up_threshold: 0.05 SOL
top_up_amount: 0.3 SOL

### Distribution Pattern (anti-sybil)
timing_jitter: random 30-300 seconds between wallets
amount_jitter: ±15% of target amount
route_variation: alternate Jupiter routes per wallet
ip_rotation: not handled (user responsibility)
unique_behavior:
  - each wallet has different swap pairs
  - each wallet interacts at different hours
  - no two wallets share identical tx patterns

## Protocol Strategies

### Jupiter (swap volume)
daily_swaps_per_wallet: 3-7
swap_pairs: [SOL/USDC, SOL/JitoSOL, SOL/mSOL]
min_swap_amount: 0.01 SOL
max_swap_amount: 0.1 SOL
round_trip: true (buy then sell within 1 hour)
priority: HIGH (most likely airdrop)

### MarginFi (lending)
action: deposit SOL as collateral
min_deposit: 0.1 SOL
hold_duration: 24-72 hours (randomized)
withdraw_and_redeposit: weekly
borrow: false (avoid liquidation risk)
priority: HIGH

### Marinade (liquid staking)
action: stake SOL for mSOL
amount: 0.2-0.5 SOL per wallet
unstake_cycle: every 7-14 days
restake: true
priority: MEDIUM

### Tensor (NFT activity)
action: place bids on floor NFTs
bid_amount: 0.001-0.01 SOL below floor
cancel_after: 6 hours
collections: top 20 by 7d volume
priority: LOW (speculative)

## Scheduling Engine
timezone: UTC
daily_window: 06:00-22:00 (spread operations)
batch_size: 5 wallets per batch
batch_interval: 600 seconds (10 minutes)
retry_on_fail: 3 attempts, exponential backoff

## Eligibility Tracker
per_protocol_fields:
  - total_volume_usd
  - unique_days_active
  - first_interaction_date
  - last_interaction_date
  - estimated_tier (bronze/silver/gold)
alert_if: unique_days_active < 20 for any protocol

# --- END SOUL.md ---`,
  },
  {
    name: "Alpha Radar",
    desc: "Real-time narrative detection engine correlating social signals with on-chain activity. Scans 200+ crypto Twitter accounts and 15 Discord groups, cross-references with DEX volume spikes, and surfaces trending tokens within 5 minutes of first social mention.",
    image: agentAlphaRadar,
    score: 5540,
    price: "2.5 SOL",
    tier: "paid",
    pricingReason: "Multi-source social intelligence engine with real-time on-chain correlation. Monitors 200+ accounts simultaneously with sub-5-minute signal latency. Highest-scored agent in the marketplace.",
    soulCode: "",
  },
  {
    name: "Liquidation Wolf",
    desc: "Multi-protocol liquidation bot monitoring undercollateralized positions across MarginFi, Kamino, and Solend. Triggers liquidation calls within 1 block of health factor breach, handles partial liquidations, and auto-converts seized collateral to SOL via Jupiter.",
    image: agentLiquidationWolf,
    score: 4105,
    price: "1.5 SOL",
    tier: "paid",
    pricingReason: "Three-protocol liquidation engine with real-time health factor monitoring. Handles partial liquidations and optimal collateral routing — complex multi-step execution logic.",
    soulCode: "",
  },
  {
    name: "Token Deployer",
    desc: "End-to-end SPL token launch system executing mint creation, Metaplex metadata, Raydium CPMM pool deployment, LP lock, mint authority revocation, and anti-bot configuration in a single atomic transaction. The most complex soul in the marketplace.",
    image: agentTokenDeployer,
    score: 4490,
    price: "3.0 SOL",
    tier: "paid",
    pricingReason: "Full atomic launch stack: token mint + metadata + liquidity pool + LP lock + authority revocation + anti-bot — all in one transaction. Highest complexity soul available.",
    soulCode: "",
  },
];

const ENGINE_CRITERIA = [
  { icon: Brain, label: "Memory Depth", desc: "Richness of trading history, learned patterns, and accumulated experience", weight: "30%", color: "#FF2D55" },
  { icon: Crosshair, label: "Directive Precision", desc: "Specificity and actionability of the soul's core operating rules", weight: "25%", color: "#00FFFF" },
  { icon: BarChart3, label: "Track Record", desc: "Verified performance data — wins, losses, and risk-adjusted returns", weight: "25%", color: "#FFD700" },
  { icon: ShieldCheck, label: "Safety Score", desc: "Built-in risk controls, stop-losses, and capital preservation logic", weight: "20%", color: "#8B5CF6" },
];

function getTierLabel(score: number): { label: string; color: string } {
  if (score >= 5000) return { label: "S-Tier", color: "#FFD700" };
  if (score >= 4000) return { label: "A-Tier", color: "#FF2D55" };
  if (score >= 3000) return { label: "B-Tier", color: "#00FFFF" };
  return { label: "C-Tier", color: "#8B5CF6" };
}

function getTierFromScore(score: number): { label: string; color: string } {
  if (score >= 5000) return { label: "S-Tier", color: "#FFD700" };
  if (score >= 4000) return { label: "A-Tier", color: "#FF2D55" };
  if (score >= 3000) return { label: "B-Tier", color: "#00FFFF" };
  return { label: "C-Tier", color: "#8B5CF6" };
}

export default function Marketplace() {
  const { connected, connect, sendSol } = useWallet();
  const { toast } = useToast();
  const [adoptingIndex, setAdoptingIndex] = useState<number | null>(null);
  const [showCodeIndex, setShowCodeIndex] = useState<number | null>(null);
  const [showEngineInfo, setShowEngineInfo] = useState(false);

  const { data: listedSouls = [] } = useQuery<Soul[]>({
    queryKey: ["/api/souls/listed"],
    refetchInterval: 10000,
  });

  const handleAdopt = async (index: number) => {
    const agent = featuredAgents[index];
    if (agent.tier === "free") {
      setShowCodeIndex(showCodeIndex === index ? null : index);
      return;
    }

    if (!connected) {
      await connect();
    }

    const solAmount = parseFloat(agent.price);
    setAdoptingIndex(index);

    const result = await sendSol(solAmount);
    setAdoptingIndex(null);

    if (result.success) {
      toast({
        title: "Soul Adopted!",
        description: `Successfully adopted ${agent.name} for ${agent.price}. TX: ${result.signature?.slice(0, 8)}...`,
      });
    } else if (result.error === "phantom_not_installed") {
      toast({
        title: "Phantom Required",
        description: "Install Phantom wallet to adopt souls. Visit phantom.app",
        variant: "destructive",
      });
    } else if (result.error === "rejected") {
      toast({
        title: "Transaction Cancelled",
        description: "You cancelled the transaction.",
      });
    } else {
      toast({
        title: "Transaction Failed",
        description: result.error || "Something went wrong. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2.5 bg-[#FF2D55]/10 border border-[#FF2D55]/30 rounded-full px-5 py-2 mb-5" style={{ boxShadow: "0 0 15px #FF2D5520, inset 0 0 15px #FF2D5510" }}>
            <Store className="w-4 h-4 text-[#FF2D55]" style={{ filter: "drop-shadow(0 0 4px #FF2D5580)" }} strokeWidth={2.5} />
            <span className="text-sm font-semibold text-[#FF2D55]">Soul Marketplace</span>
          </div>
          <h1 className="font-brand font-bold text-4xl md:text-5xl uppercase gold-gradient mb-3" data-testid="text-marketplace-title">
            Browse Souls
          </h1>
          <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
            Free souls ship with full source code. Premium souls are battle-tested with proprietary strategies and verified track records.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" style={{ filter: "drop-shadow(0 0 6px #00FFFF) drop-shadow(0 0 12px #00FFFF50)" }}>
                    <path d="M12 2L14.5 8.5L21 9.5L16.5 14L17.5 21L12 17.5L6.5 21L7.5 14L3 9.5L9.5 8.5L12 2Z" fill="#00FFFF" fillOpacity="0.15" stroke="#00FFFF" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M12 6L13.2 9.2L16.5 9.7L14 12L14.8 15.5L12 13.8L9.2 15.5L10 12L7.5 9.7L10.8 9.2L12 6Z" fill="#00FFFF" fillOpacity="0.6" />
                  </svg>
                  <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, #00FFFF20 0%, transparent 70%)" }} />
                </div>
                <h2 className="font-brand font-bold text-2xl uppercase text-[#FF2D55]" data-testid="text-featured-agents-title">
                  Featured Agents
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00FFFF]" /> FREE</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF2D55]" /> PAID</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredAgents.map((agent, i) => {
                const tier = getTierLabel(agent.score);
                const isFree = agent.tier === "free";
                const isCodeVisible = showCodeIndex === i;

                return (
                  <div
                    key={agent.name}
                    className={`glass-panel rounded-2xl overflow-hidden group transition-all duration-300 border ${
                      isFree
                        ? "border-[#00FFFF]/10 hover:border-[#00FFFF]/30 hover:shadow-[0_0_30px_rgba(0,255,255,0.08)]"
                        : "border-[#FF2D55]/10 hover:border-[#FF2D55]/30 hover:shadow-[0_0_30px_rgba(255,45,85,0.1)]"
                    }`}
                    data-testid={`card-agent-${i}`}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#00FFFF]" />
                        <span className="text-xs font-mono font-bold text-[#00FFFF]">{agent.score.toLocaleString()}</span>
                      </div>
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div
                          className="backdrop-blur-sm rounded-full px-2.5 py-1"
                          style={{ backgroundColor: `${tier.color}15`, border: `1px solid ${tier.color}30` }}
                        >
                          <span className="text-[11px] font-mono font-bold" style={{ color: tier.color }}>{tier.label}</span>
                        </div>
                        {isFree && (
                          <div className="bg-[#00FFFF]/10 backdrop-blur-sm rounded-full px-2.5 py-1 border border-[#00FFFF]/20">
                            <span className="text-[11px] font-mono font-bold text-[#00FFFF]">FREE</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-brand font-bold text-lg text-white mb-2" data-testid={`text-agent-name-${i}`}>{agent.name}</h3>
                      <p className="text-sm text-white/45 leading-relaxed mb-4 line-clamp-3">{agent.desc}</p>

                      {!isFree && (
                        <div className="bg-[#0a0a0a] rounded-lg px-3.5 py-2.5 mb-4 border border-[#1a1a1a]">
                          <div className="flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 text-white/20 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-white/35 leading-relaxed">{agent.pricingReason}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className={`text-base font-mono font-bold ${isFree ? "text-[#00FFFF]" : "text-[#FF2D55]"}`} data-testid={`text-agent-price-${i}`}>
                          {agent.price}
                        </span>
                        <button
                          onClick={() => handleAdopt(i)}
                          disabled={adoptingIndex === i}
                          className={`flex items-center gap-2 text-sm font-bold rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50 ${
                            isFree
                              ? "bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/20"
                              : "bg-[#FF2D55] hover:bg-[#FF2D55]/80 text-white"
                          }`}
                          data-testid={`button-adopt-${i}`}
                        >
                          {adoptingIndex === i ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : isFree ? (
                            <>
                              <Code className="w-4 h-4" />
                              {isCodeVisible ? "Hide Code" : "Show Code"}
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Adopt Soul
                            </>
                          )}
                        </button>
                      </div>

                      {isFree && isCodeVisible && (
                        <div className="mt-4 bg-[#050505] rounded-xl p-4 border border-[#1a1a1a] max-h-80 overflow-y-auto" data-testid={`panel-code-${i}`}>
                          <pre className="text-[11px] text-white/55 font-mono leading-relaxed whitespace-pre-wrap break-words" data-testid={`text-soul-code-${i}`}>
                            {agent.soulCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {listedSouls.length > 0 && (
              <div className="mt-14" data-testid="section-recently-forged">
                <div className="flex items-center gap-3 mb-8">
                  <Flame className="w-6 h-6 text-[#FF2D55]" />
                  <h2 className="font-brand font-bold text-2xl uppercase text-[#FF2D55]" data-testid="text-recently-forged-title">
                    Autonomous Forged
                  </h2>
                  <span className="text-xs font-mono text-white/30 bg-[#1a1a1a] rounded-full px-3 py-1">
                    {listedSouls.length} souls
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {listedSouls.slice(0, 12).map((soul) => {
                    const tier = getTierFromScore(soul.soulScore);
                    return (
                      <div
                        key={soul.id}
                        className="glass-panel rounded-2xl overflow-hidden group transition-all duration-300 border border-[#FF2D55]/10 hover:border-[#FF2D55]/30 hover:shadow-[0_0_30px_rgba(255,45,85,0.1)]"
                        data-testid={`card-forged-${soul.id}`}
                      >
                        <div className="relative h-32 bg-gradient-to-br from-[#FF2D55]/10 via-[#0a0a0a] to-[#00FFFF]/5 flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `radial-gradient(circle at 30% 50%, #FF2D55 0%, transparent 50%), radial-gradient(circle at 70% 50%, #00FFFF 0%, transparent 50%)`
                          }} />
                          <span className="font-brand font-bold text-3xl text-white/10 uppercase tracking-widest">
                            {soul.name.split(" ").map(w => w[0]).join("")}
                          </span>
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#00FFFF]" />
                            <span className="text-xs font-mono font-bold text-[#00FFFF]">{soul.soulScore.toLocaleString()}</span>
                          </div>
                          <div className="absolute top-3 left-3">
                            <div
                              className="backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-mono font-bold"
                              style={{ backgroundColor: `${tier.color}15`, border: `1px solid ${tier.color}30`, color: tier.color }}
                            >
                              {tier.label}
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-brand font-bold text-lg text-white mb-1">{soul.name}</h3>
                          <p className="text-sm text-white/40 line-clamp-2 mb-4 leading-relaxed">{soul.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-base font-mono font-bold text-[#FF2D55]">{soul.price} SOL</span>
                            <span className="text-[10px] font-mono text-white/20">
                              {soul.ownerWallet.slice(0, 4)}...{soul.ownerWallet.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="glass-panel rounded-2xl p-5 border border-[#1a1a1a]" data-testid="panel-engine-score">
                <button
                  onClick={() => setShowEngineInfo(!showEngineInfo)}
                  className="w-full flex items-center justify-between mb-4"
                  data-testid="button-toggle-engine-info"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-5 h-5 text-[#00FFFF]" />
                    <h3 className="font-brand font-bold text-base text-white uppercase" data-testid="text-engine-score-title">Soul Engine Score</h3>
                  </div>
                  <Info className="w-4 h-4 text-white/30" />
                </button>

                <p className="text-sm text-white/40 leading-relaxed mb-5" data-testid="text-engine-score-desc">
                  Every soul is rated by the SoulClaw Engine — an algorithmic score reflecting how capable, experienced, and battle-tested an agent truly is.
                </p>

                <div className="space-y-4" data-testid="list-engine-criteria">
                  {ENGINE_CRITERIA.map((c, ci) => {
                    const IconComp = c.icon;
                    return (
                      <div key={c.label} className="flex items-start gap-3" data-testid={`item-criteria-${ci}`}>
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: `${c.color}15`,
                            border: `1px solid ${c.color}30`,
                            boxShadow: `0 0 12px ${c.color}20`,
                          }}
                        >
                          <IconComp
                            className="w-[18px] h-[18px]"
                            style={{ color: c.color, filter: `drop-shadow(0 0 4px ${c.color}80)` }}
                            strokeWidth={2.2}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-bold text-white" data-testid={`text-criteria-label-${ci}`}>{c.label}</span>
                            <span className="text-xs font-mono text-[#FF2D55]" data-testid={`text-criteria-weight-${ci}`}>{c.weight}</span>
                          </div>
                          <p className="text-xs text-white/35 leading-relaxed">{c.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {showEngineInfo && (
                  <div className="mt-5 pt-5 border-t border-[#1a1a1a]" data-testid="panel-tier-breakdown">
                    <h4 className="text-sm font-bold text-white mb-3">Tier Breakdown</h4>
                    <div className="space-y-2.5">
                      {[
                        { tier: "S-Tier", range: "5,000+", color: "#FFD700", desc: "Elite — verified alpha generators" },
                        { tier: "A-Tier", range: "4,000–4,999", color: "#FF2D55", desc: "Advanced — proven track record" },
                        { tier: "B-Tier", range: "3,000–3,999", color: "#00FFFF", desc: "Solid — reliable execution" },
                        { tier: "C-Tier", range: "< 3,000", color: "#8B5CF6", desc: "Starter — basic strategies" },
                      ].map((t) => (
                        <div key={t.tier} className="flex items-center gap-3" data-testid={`item-tier-${t.tier.toLowerCase()}`}>
                          <span className="text-xs font-mono font-bold w-14" style={{ color: t.color }}>{t.tier}</span>
                          <span className="text-xs text-white/30 font-mono w-20">{t.range}</span>
                          <span className="text-xs text-white/45">{t.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-[#1a1a1a]" data-testid="panel-pricing-guide">
                <h3 className="font-brand font-bold text-base text-white uppercase mb-4" data-testid="text-pricing-title">Pricing</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#00FFFF] mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-bold text-[#00FFFF]">Free Souls</span>
                      <p className="text-xs text-white/35 leading-relaxed mt-1">Open-source agents with full SOUL.md code visible. Fork, modify, and deploy as your own.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#FF2D55] mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-bold text-[#FF2D55]">1.5 – 3.0 SOL</span>
                      <p className="text-xs text-white/35 leading-relaxed mt-1">Premium battle-tested agents. Price reflects strategy complexity, memory depth, and verified performance history.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
