import type { Soul } from "@shared/schema";
import { Flame, Clock, Tag } from "lucide-react";

interface SoulCardProps {
  soul: Soul;
  onClick?: () => void;
  showPrice?: boolean;
}

export function SoulCard({ soul, onClick, showPrice }: SoulCardProps) {
  const snippet = soul.soulContent.slice(0, 120) + (soul.soulContent.length > 120 ? "..." : "");
  const createdDate = new Date(soul.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="glass-panel rounded-xl p-4 transition-all duration-200 soul-card-glow cursor-pointer group"
      onClick={onClick}
      data-testid={`card-soul-${soul.id}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4 text-[#FF2D55]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate" data-testid={`text-soul-name-${soul.id}`}>
              {soul.name}
            </h3>
            <p className="text-xs text-white/40 truncate">{soul.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xs font-mono gold-gradient font-bold" data-testid={`text-soul-score-${soul.id}`}>
            {soul.soulScore}
          </span>
          <span className="text-[10px] text-white/30 uppercase">pts</span>
        </div>
      </div>

      <div className="bg-[#050505] rounded-lg p-3 mb-3 border border-[#111111]">
        <pre className="text-[11px] text-white/50 font-mono leading-relaxed whitespace-pre-wrap break-words">
          {snippet}
        </pre>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-white/30">
            <Clock className="w-3 h-3" />
            <span className="text-[10px]">{createdDate}</span>
          </div>
          {soul.mintAddress && (
            <span className="text-[10px] text-[#00FFFF] font-mono">
              Minted
            </span>
          )}
        </div>
        {showPrice && soul.price && (
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#FF2D55]" />
            <span className="text-xs font-mono font-bold text-white">{soul.price} SOL</span>
          </div>
        )}
      </div>
    </div>
  );
}