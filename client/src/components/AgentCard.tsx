import type { Soul } from "@shared/schema";
import { Flame, Clock, Tag, Zap } from "lucide-react";

interface AgentCardProps {
  agent: Soul;
  onClick?: () => void;
  showPrice?: boolean;
}

export function AgentCard({ agent, onClick, showPrice }: AgentCardProps) {
  const snippet = agent.soulContent.slice(0, 100) + (agent.soulContent.length > 100 ? "..." : "");
  const createdDate = new Date(agent.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="glass-panel rounded-xl overflow-hidden transition-all duration-200 agent-card-glow cursor-pointer group border border-transparent hover:border-white/10"
      onClick={onClick}
      data-testid={`card-agent-${agent.id}`}
    >
      {agent.imageUrl && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={agent.imageUrl}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#8A9AAD]" />
            <span className="text-[10px] font-mono text-[#8A9AAD]">{agent.soulScore.toLocaleString()}</span>
          </div>
          {agent.mintAddress && (
            <div className="absolute top-2 left-2 bg-[#6B7B8D]/10 backdrop-blur-sm rounded-full px-2 py-0.5">
              <span className="text-[10px] font-mono text-[#8A9AAD]">Minted</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {!agent.imageUrl && (
              <div className="w-8 h-8 rounded-full bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center flex-shrink-0">
                <Flame className="w-4 h-4 text-[#6B7B8D]" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate" data-testid={`text-agent-name-${agent.id}`}>
                {agent.name}
              </h3>
              <p className="text-[11px] text-white/60 truncate">{agent.description}</p>
            </div>
          </div>
          {!agent.imageUrl && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs font-mono gold-gradient font-bold" data-testid={`text-agent-score-${agent.id}`}>
                {agent.soulScore}
              </span>
              <span className="text-[10px] text-white/60 uppercase">pts</span>
            </div>
          )}
        </div>

        <div className="bg-black/40 rounded-lg p-3 mb-3 border border-white/[0.08]">
          <pre className="text-[11px] text-white/60 font-mono leading-relaxed whitespace-pre-wrap break-words line-clamp-3">
            {snippet}
          </pre>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-white/60">
              <Clock className="w-3 h-3" />
              <span className="text-[10px]">{createdDate}</span>
            </div>
          </div>
          {showPrice && agent.price && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#6B7B8D]" />
              <span className="text-xs font-mono font-bold text-white">{agent.price} SOL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
