import { useWallet } from "@/lib/wallet";
import { useQuery } from "@tanstack/react-query";
import { SoulCard } from "@/components/SoulCard";
import { Link } from "wouter";
import { Flame, Rocket, Wallet } from "lucide-react";
import type { Soul } from "@shared/schema";

export default function Dashboard() {
  const { connected, address, connect } = useWallet();

  const { data: souls, isLoading } = useQuery<Soul[]>({
    queryKey: [`/api/souls?ownerWallet=${address}`],
    enabled: connected && !!address,
  });

  if (!connected) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-full bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-[#6B7B8D]" />
          </div>
          <h2 className="font-brand font-bold text-2xl uppercase text-white mb-3">
            Connect Your Wallet
          </h2>
          <p className="text-sm text-white/55 mb-8 max-w-md mx-auto">
            Connect your Solana wallet to view your launched tokens and manage your collection.
          </p>
          <button
            onClick={connect}
            className="flex items-center gap-2 bg-[#6B7B8D] text-white font-bold rounded-lg px-6 py-3 text-sm mx-auto transition-all duration-200 hover:brightness-110"
            data-testid="button-connect-dashboard"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-brand font-bold text-2xl uppercase gold-gradient" data-testid="text-dashboard-title">
              My Agents
            </h1>
            <p className="text-xs text-white/45 mt-1">Your launched tokens and deployed agents</p>
          </div>
          <Link href="/forge">
            <button
              className="flex items-center gap-2 bg-[#6B7B8D] text-white font-bold rounded-lg px-5 py-2.5 text-sm transition-all duration-200 hover:brightness-110"
              data-testid="button-launch-new"
            >
              <Rocket className="w-4 h-4" />
              Launch New Token
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
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
        ) : souls && souls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {souls.map((soul) => (
              <SoulCard key={soul.id} soul={soul} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center mx-auto mb-6">
              <Flame className="w-8 h-8 text-[#6B7B8D]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Agents Yet</h3>
            <p className="text-sm text-white/55 mb-6 max-w-sm mx-auto">
              You haven't launched any tokens yet. Launch your first community token to start promoting $ADCLAW.
            </p>
            <Link href="/forge">
              <button
                className="flex items-center gap-2 bg-[#6B7B8D] text-white font-bold rounded-lg px-6 py-3 text-sm mx-auto transition-all duration-200 hover:brightness-110"
                data-testid="button-launch-first"
              >
                <Rocket className="w-4 h-4" />
                Launch Your First Token
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
