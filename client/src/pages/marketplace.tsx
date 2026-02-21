import { useQuery } from "@tanstack/react-query";
import { SoulCard } from "@/components/SoulCard";
import { Store, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { Soul } from "@shared/schema";

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "price" | "recent">("recent");

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