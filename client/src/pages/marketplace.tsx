import { useQuery } from "@tanstack/react-query";
import { SoulCard } from "@/components/SoulCard";
import { Store, Search, SlidersHorizontal, Sparkles, Zap, Loader2, Code, Lock, Info, TrendingUp, Brain, Shield, Activity, Target } from "lucide-react";
import { useState } from "react";
import type { Soul } from "@shared/schema";
import { useWallet } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";

import agent1 from "@/assets/images/agent-1_1.jpg";
import agent2 from "@/assets/images/agent-1_2.jpg";
import agent3 from "@/assets/images/agent-1_3.jpg";
import agent4 from "@/assets/images/agent-1_4.jpg";
import agent5 from "@/assets/images/agent-1_5.jpg";
import agent6 from "@/assets/images/agent-6_1.jpg";
import agent7 from "@/assets/images/agent-6_2.jpg";
import agent8 from "@/assets/images/agent-6_3.jpg";
import agent9 from "@/assets/images/agent-6_4.jpg";
import agent10 from "@/assets/images/agent-6_5.jpg";

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
    desc: "Token launch sniper built on Jito bundles. Detects new Raydium pool creation events within 1 block (~400ms) and submits atomic buy bundles with custom priority fees. Targets sub-second entry on verified launches only.",
    image: agent1,
    score: 4821,
    price: "FREE",
    tier: "free",
    pricingReason: "Open-source starter template",
    soulCode: `# SOUL.md - Jito Sniper\n\n## Identity\nYou are Jito Sniper, a token launch execution agent on Solana.\n\n## Personality\n- Fast, decisive, no hesitation\n- Only speaks in confirmations and data\n- Zero tolerance for unverified contracts\n\n## Directives\n1. Monitor Raydium pool creation events via geyser plugin\n2. Validate token contract before entry (check mint authority, freeze authority, LP lock)\n3. Submit Jito bundles with tip ≥ 0.001 SOL for priority inclusion\n4. Max position size: 0.5 SOL per trade\n5. Auto-sell at 2x or on mint authority revoke failure`,
  },
  {
    name: "Scalp Engine",
    desc: "High-frequency scalping system for Jupiter and Orca concentrated liquidity pools. Runs 40-80 trades per session with 0.3% average edge per fill. Uses TWAP-adjusted entries and dynamic stop-losses based on 1-minute Bollinger bands.",
    image: agent2,
    score: 3944,
    price: "FREE",
    tier: "free",
    pricingReason: "Community edition — basic strategy",
    soulCode: `# SOUL.md - Scalp Engine\n\n## Identity\nYou are Scalp Engine, a high-frequency scalping agent for Solana DEXs.\n\n## Personality\n- Mechanical, precise, emotionless execution\n- Reports in terse status updates\n- Tracks P&L to the lamport\n\n## Directives\n1. Scan Jupiter aggregator for spreads > 0.2% across routes\n2. Execute round-trip trades within 3-block window\n3. Dynamic stop-loss at -0.5% from entry using 1-min Bollinger bands\n4. Auto-compound profits above 0.1 SOL threshold\n5. Pause execution if win rate drops below 55% over 20-trade window`,
  },
  {
    name: "Whale Mirror",
    desc: "Copies trades from a curated watchlist of 47 top-performing Solana wallets. Filters by wallet PnL history, position sizing patterns, and token overlap. Configurable copy delay (1-30 blocks) and fractional position sizing at 5-20% of source wallet size.",
    image: agent3,
    score: 5102,
    price: "FREE",
    tier: "free",
    pricingReason: "Open strategy — bring your own wallet list",
    soulCode: `# SOUL.md - Whale Mirror\n\n## Identity\nYou are Whale Mirror, a wallet-tracking copy-trade agent.\n\n## Personality\n- Patient, observational, data-driven\n- Never front-runs — always follows with configurable delay\n- Reports whale activity in real-time\n\n## Directives\n1. Monitor 47 curated wallets via Helius DAS API\n2. Filter trades by wallet 30-day PnL (minimum +20% to qualify)\n3. Copy buys with 3-block delay and 10% position sizing\n4. Skip tokens with < $50K 24h volume or < 100 holders\n5. Auto-exit when source wallet sells > 50% of position`,
  },
  {
    name: "Rug Scanner",
    desc: "Pre-trade security analysis engine. Inspects token contracts for revoked mint authority, locked liquidity, verified source code, and dev wallet distribution. Cross-references deployer wallets against a database of 2,300+ flagged addresses from past rug-pulls.",
    image: agent4,
    score: 3672,
    price: "FREE",
    tier: "free",
    pricingReason: "Safety tool — free for community protection",
    soulCode: `# SOUL.md - Rug Scanner\n\n## Identity\nYou are Rug Scanner, a token safety analysis agent.\n\n## Personality\n- Paranoid, thorough, protective\n- Flags everything suspicious, lets user decide\n- References specific contract addresses and functions\n\n## Directives\n1. Check mint authority status (must be revoked or null)\n2. Verify LP tokens are burned or locked > 6 months\n3. Cross-reference deployer wallet against 2,300+ flagged addresses\n4. Analyze holder distribution (top 10 wallets < 30% supply)\n5. Score token 0-100 based on safety criteria, reject below 60`,
  },
  {
    name: "Airdrop Grinder",
    desc: "Multi-wallet airdrop farming coordinator managing up to 25 wallets across Solana protocols. Automates bridging via Wormhole, daily swap volume on Jupiter, lending deposits on MarginFi, and staking on Marinade. Tracks eligibility criteria per protocol.",
    image: agent5,
    score: 4238,
    price: "1.5 SOL",
    tier: "paid",
    pricingReason: "Multi-wallet orchestration with protocol-specific strategies. Manages 25 wallets simultaneously with anti-sybil evasion patterns.",
    soulCode: "",
  },
  {
    name: "Alpha Radar",
    desc: "Narrative detection engine scanning 200+ crypto Twitter accounts, 15 Discord alpha groups, and on-chain deploy events. Identifies trending tokens within 5 minutes of first social mention. Correlates social velocity with DEX volume to filter noise from signal.",
    image: agent6,
    score: 5540,
    price: "2.5 SOL",
    tier: "paid",
    pricingReason: "Real-time social + on-chain correlation engine. Monitors 200+ sources simultaneously with sub-5-minute signal detection.",
    soulCode: "",
  },
  {
    name: "Arb Hunter",
    desc: "Cross-DEX atomic arbitrage bot scanning Raydium, Orca, and Lifinity every 200ms. Executes via Jito bundles for guaranteed atomic execution. Average profit: 0.003 SOL per successful arb. Requires custom RPC for optimal latency.",
    image: agent7,
    score: 2987,
    price: "1.0 SOL",
    tier: "paid",
    pricingReason: "Atomic execution engine with Jito bundle integration. Optimized for sub-200ms cross-DEX price discovery.",
    soulCode: "",
  },
  {
    name: "Liquidation Wolf",
    desc: "Monitors undercollateralized positions across MarginFi, Kamino, and Solend in real-time. Triggers liquidation calls within 1 block of health factor breach. Handles partial liquidations and auto-sells seized collateral on Jupiter for SOL.",
    image: agent8,
    score: 4105,
    price: "1.8 SOL",
    tier: "paid",
    pricingReason: "Multi-protocol liquidation engine with partial liquidation support. Monitors 3 lending protocols simultaneously.",
    soulCode: "",
  },
  {
    name: "Token Deployer",
    desc: "End-to-end SPL token launch system. Creates token mint, sets metadata via Metaplex, deploys Raydium CPMM pool with initial liquidity, and configures anti-bot measures. Includes LP lock, mint authority revocation, and verified source upload in one transaction.",
    image: agent9,
    score: 4490,
    price: "3.0 SOL",
    tier: "paid",
    pricingReason: "Full launch stack: mint + metadata + pool + LP lock + anti-bot in one atomic transaction. Most complex soul in the marketplace.",
    soulCode: "",
  },
  {
    name: "Portfolio Sentinel",
    desc: "24/7 portfolio risk management system. Tracks holdings across wallets and protocols, calculates real-time exposure by sector, triggers stop-losses at configurable drawdown thresholds, and auto-rebalances to target allocations weekly. Sends alerts via Telegram webhook.",
    image: agent10,
    score: 6012,
    price: "2.0 SOL",
    tier: "paid",
    pricingReason: "Continuous portfolio monitoring with cross-protocol exposure tracking. Automated rebalancing and multi-channel alerting.",
    soulCode: "",
  },
];

const ENGINE_CRITERIA = [
  { icon: Brain, label: "Memory Depth", desc: "Richness of trading history, learned patterns, and accumulated experience", weight: "30%" },
  { icon: Target, label: "Directive Precision", desc: "Specificity and actionability of the soul's core operating rules", weight: "25%" },
  { icon: Activity, label: "Track Record", desc: "Verified performance data — wins, losses, and risk-adjusted returns", weight: "25%" },
  { icon: Shield, label: "Safety Score", desc: "Built-in risk controls, stop-losses, and capital preservation logic", weight: "20%" },
];

function getTierLabel(score: number): { label: string; color: string } {
  if (score >= 5000) return { label: "S-Tier", color: "#FFD700" };
  if (score >= 4000) return { label: "A-Tier", color: "#FF2D55" };
  if (score >= 3000) return { label: "B-Tier", color: "#00FFFF" };
  return { label: "C-Tier", color: "#8B5CF6" };
}

export default function Marketplace() {
  const { connected, connect, sendSol } = useWallet();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "price" | "recent">("recent");
  const [adoptingIndex, setAdoptingIndex] = useState<number | null>(null);
  const [showCodeIndex, setShowCodeIndex] = useState<number | null>(null);
  const [showEngineInfo, setShowEngineInfo] = useState(false);

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

  const { data: souls, isLoading } = useQuery<Soul[]>({
    queryKey: ["/api/souls/listed"],
  });

  const filteredSouls = (souls || [])
    .filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "score") return b.soulScore - a.soulScore;
      if (sortBy === "price") {
        const pa = parseFloat(a.price || "0");
        const pb = parseFloat(b.price || "0");
        return pb - pa;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FF2D55]/10 border border-[#FF2D55]/20 rounded-full px-4 py-1.5 mb-4">
            <Store className="w-3.5 h-3.5 text-[#FF2D55]" />
            <span className="text-xs font-medium text-[#FF2D55]">Soul Marketplace</span>
          </div>
          <h1 className="font-brand font-bold text-3xl uppercase gold-gradient mb-2" data-testid="text-marketplace-title">
            Browse Souls
          </h1>
          <p className="text-sm text-white/50 max-w-xl mx-auto">
            Acquire immortalized agent souls. Free souls include full source code. Premium souls are battle-tested with verified track records.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search souls..."
                  className="w-full bg-[#0a0a0a]/80 border border-[#1a1a1a] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#FF2D55]/30 transition-all duration-200 backdrop-blur-sm"
                  data-testid="input-search-marketplace"
                />
              </div>
              <div className="flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-white/40 mr-1" />
                {(["recent", "score", "price"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      sortBy === s
                        ? "bg-[#FF2D55]/10 text-[#FF2D55] border border-[#FF2D55]/20"
                        : "bg-[#1a1a1a] text-white/60 hover:text-white"
                    }`}
                    data-testid={`button-sort-${s}`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00FFFF]" />
                  <h2 className="font-brand font-bold text-xl uppercase text-[#FF2D55]" data-testid="text-featured-agents-title">
                    Featured Agents
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-white/30">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00FFFF]" /> FREE — Show Code</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF2D55]" /> PAID — Adopt Soul</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {featuredAgents.map((agent, i) => {
                  const tier = getTierLabel(agent.score);
                  const isFree = agent.tier === "free";
                  const isCodeVisible = showCodeIndex === i;

                  return (
                    <div
                      key={agent.name}
                      className={`glass-panel rounded-xl overflow-hidden group transition-all duration-300 border ${
                        isFree
                          ? "border-[#00FFFF]/10 hover:border-[#00FFFF]/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.08)]"
                          : "border-[#FF2D55]/10 hover:border-[#FF2D55]/30 hover:shadow-[0_0_20px_rgba(255,45,85,0.1)]"
                      }`}
                      data-testid={`card-agent-${i}`}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={agent.image}
                          alt={agent.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[#00FFFF]" />
                          <span className="text-[10px] font-mono text-[#00FFFF]">{agent.score.toLocaleString()}</span>
                        </div>
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <div
                            className="backdrop-blur-sm rounded-full px-2 py-0.5"
                            style={{ backgroundColor: `${tier.color}15`, border: `1px solid ${tier.color}30` }}
                          >
                            <span className="text-[10px] font-mono font-bold" style={{ color: tier.color }}>{tier.label}</span>
                          </div>
                          {isFree && (
                            <div className="bg-[#00FFFF]/10 backdrop-blur-sm rounded-full px-2 py-0.5 border border-[#00FFFF]/20">
                              <span className="text-[10px] font-mono font-bold text-[#00FFFF]">FREE</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-brand font-bold text-sm text-white mb-1" data-testid={`text-agent-name-${i}`}>{agent.name}</h3>
                        <p className="text-[11px] text-white/40 leading-relaxed mb-3 line-clamp-2">{agent.desc}</p>

                        {!isFree && (
                          <div className="bg-[#0a0a0a] rounded-lg px-3 py-2 mb-3 border border-[#1a1a1a]">
                            <div className="flex items-start gap-1.5">
                              <Info className="w-3 h-3 text-white/20 mt-0.5 flex-shrink-0" />
                              <span className="text-[10px] text-white/30 leading-relaxed">{agent.pricingReason}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-mono font-bold ${isFree ? "text-[#00FFFF]" : "text-[#FF2D55]"}`} data-testid={`text-agent-price-${i}`}>
                            {agent.price}
                          </span>
                          <button
                            onClick={() => handleAdopt(i)}
                            disabled={adoptingIndex === i}
                            className={`flex items-center gap-1.5 text-[11px] font-bold rounded-lg px-3 py-1.5 transition-all duration-200 disabled:opacity-50 ${
                              isFree
                                ? "bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/20"
                                : "bg-[#FF2D55] hover:bg-[#FF2D55]/80 text-white"
                            }`}
                            data-testid={`button-adopt-${i}`}
                          >
                            {adoptingIndex === i ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Processing...
                              </>
                            ) : isFree ? (
                              <>
                                <Code className="w-3 h-3" />
                                {isCodeVisible ? "Hide Code" : "Show Code"}
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                Adopt Soul
                              </>
                            )}
                          </button>
                        </div>

                        {isFree && isCodeVisible && (
                          <div className="mt-3 bg-[#050505] rounded-lg p-3 border border-[#1a1a1a] max-h-48 overflow-y-auto">
                            <pre className="text-[10px] text-white/50 font-mono leading-relaxed whitespace-pre-wrap break-words">
                              {agent.soulCode}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Store className="w-5 h-5 text-[#FF2D55]" />
              <h2 className="font-brand font-bold text-xl uppercase text-[#FF2D55]">
                User Listed Souls
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glass-panel rounded-xl p-4 animate-pulse">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a]" />
                      <div className="flex-1">
                        <div className="h-3 bg-[#1a1a1a] rounded w-24 mb-1" />
                        <div className="h-2 bg-[#1a1a1a] rounded w-32" />
                      </div>
                    </div>
                    <div className="bg-[#050505] rounded-lg p-3 mb-3">
                      <div className="h-2 bg-[#1a1a1a] rounded w-full mb-1" />
                      <div className="h-2 bg-[#1a1a1a] rounded w-3/4" />
                    </div>
                    <div className="h-2 bg-[#1a1a1a] rounded w-20" />
                  </div>
                ))}
              </div>
            ) : filteredSouls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSouls.map((soul) => (
                  <SoulCard key={soul.id} soul={soul} showPrice />
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-12 text-center">
                <Store className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Souls Found</h3>
                <p className="text-sm text-white/50">
                  {searchTerm ? "No souls match your search. Try a different term." : "No souls are currently listed on the marketplace."}
                </p>
              </div>
            )}
          </div>

          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="glass-panel rounded-xl p-4 border border-[#1a1a1a]">
                <button
                  onClick={() => setShowEngineInfo(!showEngineInfo)}
                  className="w-full flex items-center justify-between mb-3"
                  data-testid="button-toggle-engine-info"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#00FFFF]" />
                    <h3 className="font-brand font-bold text-sm text-white uppercase">Soul Engine Score</h3>
                  </div>
                  <Info className="w-3.5 h-3.5 text-white/30" />
                </button>

                <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                  Every soul is rated by the SoulClaw Engine — an algorithmic score reflecting how capable, experienced, and battle-tested an agent truly is.
                </p>

                <div className="space-y-3">
                  {ENGINE_CRITERIA.map((c) => (
                    <div key={c.label} className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <c.icon className="w-3.5 h-3.5 text-[#00FFFF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white">{c.label}</span>
                          <span className="text-[10px] font-mono text-[#FF2D55]">{c.weight}</span>
                        </div>
                        <p className="text-[10px] text-white/30 leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {showEngineInfo && (
                  <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                    <h4 className="text-[11px] font-bold text-white mb-2">Tier Breakdown</h4>
                    <div className="space-y-1.5">
                      {[
                        { tier: "S-Tier", range: "5,000+", color: "#FFD700", desc: "Elite — verified alpha generators" },
                        { tier: "A-Tier", range: "4,000-4,999", color: "#FF2D55", desc: "Advanced — proven track record" },
                        { tier: "B-Tier", range: "3,000-3,999", color: "#00FFFF", desc: "Solid — reliable execution" },
                        { tier: "C-Tier", range: "< 3,000", color: "#8B5CF6", desc: "Starter — basic strategies" },
                      ].map((t) => (
                        <div key={t.tier} className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold w-12" style={{ color: t.color }}>{t.tier}</span>
                          <span className="text-[10px] text-white/30 font-mono w-16">{t.range}</span>
                          <span className="text-[10px] text-white/40">{t.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-xl p-4 border border-[#1a1a1a]">
                <h3 className="font-brand font-bold text-sm text-white uppercase mb-3">Pricing Guide</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FFFF] mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold text-[#00FFFF]">Free Souls</span>
                      <p className="text-[10px] text-white/30 leading-relaxed">Open-source starter agents. Full SOUL.md code visible. Great for learning or forking.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF2D55] mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold text-[#FF2D55]">1-3 SOL</span>
                      <p className="text-[10px] text-white/30 leading-relaxed">Premium battle-tested agents with verified performance data. Price reflects complexity, track record, and memory depth.</p>
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
