import { useQuery } from "@tanstack/react-query";
import { SoulCard } from "@/components/SoulCard";
import { Store, Search, SlidersHorizontal, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import type { Soul } from "@shared/schema";
import { useWallet } from "@/lib/wallet";

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

const featuredAgents = [
  { name: "Sniper", desc: "Instant token sniper for Raydium and Jupiter launches. Detects new pools in <200ms and executes buys with custom slippage and priority fees.", image: agent1, score: 4821, price: "1.2 SOL" },
  { name: "Scalper", desc: "High-frequency scalping bot for Solana DEXs. Runs 50+ trades/min with tight stop-losses and auto-compounding profit targets.", image: agent2, score: 3944, price: "0.8 SOL" },
  { name: "Tracker", desc: "Whale wallet tracker that mirrors top-performing wallets in real-time. Auto-copies buys/sells with configurable delay and position sizing.", image: agent3, score: 5102, price: "1.5 SOL" },
  { name: "Guard", desc: "Rug-pull detection agent. Scans contract code, liquidity locks, and dev wallet activity before you buy. Flags red tokens instantly.", image: agent4, score: 3672, price: "0.5 SOL" },
  { name: "Grinder", desc: "Airdrop farming agent that manages 20+ wallets across protocols. Auto-bridges, swaps, and interacts to maximize airdrop eligibility.", image: agent5, score: 4238, price: "2.0 SOL" },
  { name: "Alpha", desc: "Cross-chain alpha scanner. Monitors Twitter, Discord, and on-chain data to surface trending tokens before they pump. Push alerts in <30s.", image: agent6, score: 5540, price: "2.5 SOL" },
  { name: "Arb", desc: "MEV arbitrage bot for Solana. Finds price discrepancies across Raydium, Orca, and Jupiter and executes atomic swaps for risk-free profit.", image: agent7, score: 2987, price: "0.7 SOL" },
  { name: "Liquidator", desc: "DeFi liquidation bot for Solend, MarginFi, and Kamino. Monitors undercollateralized positions and executes liquidations for rewards.", image: agent8, score: 4105, price: "1.8 SOL" },
  { name: "Deployer", desc: "One-click token deployer and market maker. Creates SPL tokens, sets up Raydium pools, and manages initial liquidity with anti-bot protection.", image: agent9, score: 4490, price: "3.0 SOL" },
  { name: "Sentinel", desc: "Portfolio risk manager. Monitors your holdings 24/7, auto-rebalances based on market conditions, and triggers stop-losses on drawdowns.", image: agent10, score: 6012, price: "1.0 SOL" },
];

export default function Marketplace() {
  const { connected, connect } = useWallet();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "price" | "recent">("recent");

  const handleAdopt = () => {
    if (!connected) {
      connect();
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FF2D55]/10 border border-[#FF2D55]/20 rounded-full px-4 py-1.5 mb-4">
            <Store className="w-3.5 h-3.5 text-[#FF2D55]" />
            <span className="text-xs font-medium text-[#FF2D55]">Soul Marketplace</span>
          </div>
          <h1 className="font-brand font-bold text-3xl uppercase gold-gradient mb-2" data-testid="text-marketplace-title">
            Browse Souls
          </h1>
          <p className="text-sm text-white/50">
            Discover and acquire immortalized agent souls from the marketplace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
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
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#00FFFF]" />
            <h2 className="font-brand font-bold text-xl uppercase text-[#FF2D55]" data-testid="text-featured-agents-title">
              Featured Agents
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredAgents.map((agent, i) => (
              <div
                key={agent.name}
                className="glass-panel rounded-xl overflow-hidden group transition-all duration-300 hover:border-[#FF2D55]/30 hover:shadow-[0_0_20px_rgba(255,45,85,0.1)] border border-transparent"
                data-testid={`card-agent-${i}`}
              >
                <div className="relative h-48 overflow-hidden">
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
                </div>
                <div className="p-4">
                  <h3 className="font-brand font-bold text-sm text-white mb-1" data-testid={`text-agent-name-${i}`}>{agent.name}</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed mb-3 line-clamp-2">{agent.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#00FFFF]" data-testid={`text-agent-price-${i}`}>{agent.price}</span>
                    <button
                      onClick={handleAdopt}
                      className="flex items-center gap-1 bg-[#FF2D55] hover:bg-[#FF2D55]/80 text-white text-[11px] font-bold rounded-lg px-3 py-1.5 transition-all duration-200"
                      data-testid={`button-adopt-${i}`}
                    >
                      Adopt Soul
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}