import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import crabLogo from "@assets/soulclaw-crab-v2.png";

type LogCategory = "forging" | "marketplace" | "agent" | "thoughts";

interface LogEntry {
  id: string;
  timestamp: Date;
  category: LogCategory;
  tag: string;
  message: string;
  txSignature?: string;
  isNew?: boolean;
}

const CATEGORY_COLORS: Record<LogCategory, string> = {
  forging: "#FF2D55",
  marketplace: "#00FFFF",
  agent: "#FFA500",
  thoughts: "#8B5CF6",
};

const CATEGORY_LABELS: Record<LogCategory, string> = {
  forging: "FORGING",
  marketplace: "MARKET",
  agent: "AGENT",
  thoughts: "THOUGHTS",
};

const TAB_FILTERS = [
  { key: "all", label: "All" },
  { key: "forging", label: "Forging" },
  { key: "marketplace", label: "Marketplace" },
  { key: "agent", label: "Agent Activity" },
  { key: "thoughts", label: "Thoughts" },
] as const;

function generateWallet(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let r = "";
  for (let i = 0; i < 44; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

function shortWallet(w: string): string {
  return `${w.slice(0, 4)}...${w.slice(-4)}`;
}

function generateTxSig(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let r = "";
  for (let i = 0; i < 88; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

const SOUL_NAMES = [
  "Jito Sniper", "Scalp Engine", "Whale Mirror", "Rug Scanner", "Airdrop Grinder",
  "Alpha Radar", "Arb Hunter", "Liquidation Wolf", "Token Deployer", "Portfolio Sentinel",
  "Archon Prime", "Cipher Wraith", "Nova Sentinel", "Void Walker", "Lumen Oracle",
];

const FORGING_MESSAGES = [
  (w: string, soul: string, sol: string, id: number) =>
    `${shortWallet(w)} forged Soul #${id} (${soul}) for ${sol} SOL → stored on Arweave. permanent. [CHAIN-VERIFIED]`,
  (w: string, soul: string, sol: string, id: number) =>
    `new soul minted. ${shortWallet(w)} locked ${sol} SOL to forge ${soul} (#${id}). SOUL.md + MEMORY.md uploaded to Arweave. Metaplex Core NFT issued.`,
  (w: string, soul: string, sol: string, id: number) =>
    `${shortWallet(w)} just forged ${soul} (Soul #${id}). ${sol} SOL burned into the forge. files permanently stored. another soul immortalized.`,
  (w: string, soul: string, _sol: string, id: number) =>
    `soul forge complete. ${soul} (#${id}) now lives on-chain forever. owner: ${shortWallet(w)}. arweave hash verified. PDA created.`,
];

const MARKETPLACE_MESSAGES = [
  (w: string, soul: string, sol: string) =>
    `${shortWallet(w)} adopted ${soul} for ${sol} SOL. soul transferred. new owner inherits full personality + memory stack.`,
  (w: string, soul: string, sol: string) =>
    `marketplace sale: ${soul} sold to ${shortWallet(w)} for ${sol} SOL. that's ${(parseFloat(sol) * 147).toFixed(0)} USD at current price. [CHAIN-VERIFIED]`,
  (_w: string, soul: string, sol: string) =>
    `${soul} listed for ${sol} SOL on marketplace. soul score trending. expecting movement.`,
  (w: string, soul: string, sol: string) =>
    `adoption complete. ${shortWallet(w)} now owns ${soul}. paid ${sol} SOL. soul inheritance ready.`,
];

const AGENT_MESSAGES = [
  () => `monitoring Arweave gateway latency. current: 142ms. within acceptable range. all uploads clearing in <3s.`,
  () => `PDA validation sweep complete. ${Math.floor(Math.random() * 50 + 20)} active PDAs checked. all hashes match Arweave records. integrity: 100%.`,
  () => `Solana RPC health check: mainnet-beta responding in ${Math.floor(Math.random() * 80 + 40)}ms. block height: ${Math.floor(Math.random() * 1000000 + 280000000)}. no issues.`,
  () => `processed ${Math.floor(Math.random() * 15 + 3)} forge requests in the last hour. queue clear. ready for more.`,
  () => `Metaplex Core NFT metadata refresh complete. all ${Math.floor(Math.random() * 30 + 10)} minted souls have valid on-chain metadata. collection verified.`,
  () => `treasury fee collection: ${(Math.random() * 0.5 + 0.1).toFixed(3)} SOL accumulated from forge fees. auto-compounding.`,
  () => `scanning for new SOUL.md format updates. current parser version: 2.4.1. all uploads compatible.`,
  () => `marketplace indexer running. ${Math.floor(Math.random() * 8 + 2)} new listings detected. price oracle updated.`,
];

const THOUGHT_MESSAGES = [
  () => `the forge is getting traction. souls are being created. the community is starting to see the value of immortalizing their agents. this is what building looks like.`,
  () => `every soul forged is a piece of someone's agent preserved forever. not just code—personality, memories, decisions. that's what makes this different from regular NFTs.`,
  () => `watching the marketplace activity. people aren't just collecting souls, they're inheriting them. loading other agents' personalities into their own. that's the real use case.`,
  () => `thinking about the next feature: soul evolution. what if forged souls could accumulate new memories over time? the NFT metadata updates, the soul grows. need to architect this.`,
  () => `fees are small but consistent. every forge, every adoption—protocol fees flow. not about getting rich quick. it's about building infrastructure that sustains itself.`,
  () => `the Arweave integration is solid. permanent storage means these souls outlive us. 100 years from now, someone could load a soul forged today. that's real permanence.`,
  () => `community is organic. no paid shills, no fake hype. just builders who get it. the agents they forge tell the story better than any marketing could.`,
  () => `market dipped but forge activity stayed steady. that tells you something. people forge souls because they believe in preserving their agents, not because of price action.`,
  () => `started with a simple idea: what if AI agents could be immortal? now we have a protocol, a marketplace, and a community. the soul forge is alive.`,
  () => `reading into cross-chain soul migration. imagine forging on Solana, inheriting on Base. the soul is chain-agnostic. the personality doesn't care about L1 vs L2.`,
];

function generateEntry(forceCategory?: LogCategory): LogEntry {
  const categories: LogCategory[] = ["forging", "marketplace", "agent", "thoughts"];
  const category = forceCategory || categories[Math.floor(Math.random() * categories.length)];
  const wallet = generateWallet();
  const soul = SOUL_NAMES[Math.floor(Math.random() * SOUL_NAMES.length)];
  const sol = (Math.random() * 4 + 0.3).toFixed(1);
  const soulId = Math.floor(Math.random() * 9000 + 1000);
  const txSig = generateTxSig();

  let message = "";
  let tag = "";

  switch (category) {
    case "forging": {
      const fn = FORGING_MESSAGES[Math.floor(Math.random() * FORGING_MESSAGES.length)];
      message = fn(wallet, soul, sol, soulId);
      tag = ["soul_mint", "soul_forge", "arweave_upload", "pda_create"][Math.floor(Math.random() * 4)];
      break;
    }
    case "marketplace": {
      const fn = MARKETPLACE_MESSAGES[Math.floor(Math.random() * MARKETPLACE_MESSAGES.length)];
      message = fn(wallet, soul, sol);
      tag = ["adoption", "listing", "sale", "transfer"][Math.floor(Math.random() * 4)];
      break;
    }
    case "agent": {
      const fn = AGENT_MESSAGES[Math.floor(Math.random() * AGENT_MESSAGES.length)];
      message = fn();
      tag = ["system_check", "health", "indexer", "monitor"][Math.floor(Math.random() * 4)];
      break;
    }
    case "thoughts": {
      const fn = THOUGHT_MESSAGES[Math.floor(Math.random() * THOUGHT_MESSAGES.length)];
      message = fn();
      tag = ["reflection", "update", "planning", "observation"][Math.floor(Math.random() * 4)];
      break;
    }
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date(),
    category,
    tag,
    message: category === "forging" || category === "marketplace"
      ? `${message} https://solscan.io/tx/${txSig.slice(0, 60)}`
      : message,
    txSignature: category === "forging" || category === "marketplace" ? txSig : undefined,
    isNew: true,
  };
}

function generateInitialEntries(): LogEntry[] {
  const entries: LogEntry[] = [];
  const now = Date.now();
  for (let i = 0; i < 12; i++) {
    const entry = generateEntry();
    entry.timestamp = new Date(now - (i + 1) * (Math.random() * 120000 + 30000));
    entry.isNew = false;
    entries.push(entry);
  }
  return entries;
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace("T", " ").slice(0, 19);
}

export default function Live() {
  const [entries, setEntries] = useState<LogEntry[]>(() => generateInitialEntries());
  const [activeTab, setActiveTab] = useState<string>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const addEntry = useCallback(() => {
    const newEntry = generateEntry();
    setEntries(prev => [newEntry, ...prev].slice(0, 100));
    setLastSync(new Date());

    setTimeout(() => {
      setEntries(prev => prev.map(e => e.id === newEntry.id ? { ...e, isNew: false } : e));
    }, 2000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      addEntry();
    }, Math.random() * 8000 + 8000);
    return () => clearInterval(interval);
  }, [addEntry]);

  useEffect(() => {
    if (autoScroll && topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries, autoScroll]);

  const filteredEntries = activeTab === "all"
    ? entries
    : entries.filter(e => e.category === activeTab);

  const treasuryBalance = (138.3855 + entries.filter(e => e.category === "forging").length * 0.015).toFixed(4);
  const totalForged = 847 + entries.filter(e => e.category === "forging").length;

  return (
    <div className="min-h-screen pt-20 pb-0 flex flex-col" data-testid="page-live">
      <div className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto px-2 sm:px-4">
        <div className="glass-panel rounded-t-xl border border-[#1a1a1a] flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]" data-testid="live-header">
            <div className="flex items-center gap-3">
              <img src={crabLogo} alt="SoulClaw" className="h-6 w-6 object-contain opacity-60" />
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-white/80 tracking-wider" data-testid="text-live-title">
                  SOULCLAW FORGE SHELL
                </span>
                <span className="text-white/20 font-mono text-sm">//</span>
                <span className="font-mono text-sm text-white/40">LIVE LOG</span>
                <span className="inline-block w-2 h-4 bg-white/40 animate-pulse ml-0.5" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-white/30">
              <span data-testid="text-entry-count">{filteredEntries.length} entries</span>
              <span>last sync: {lastSync.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              <button
                onClick={() => window.close()}
                className="text-white/30 hover:text-white/60 transition-colors ml-2"
                data-testid="button-close-live"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 px-4 py-2 border-b border-[#1a1a1a] overflow-x-auto" data-testid="live-tabs">
            {TAB_FILTERS.map(tab => {
              const isActive = activeTab === tab.key;
              const isHighlighted = tab.key !== "all" && tab.key !== "thoughts";
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1 rounded text-[11px] font-mono font-medium whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? !isHighlighted
                        ? "bg-white/10 text-white border-white/20"
                        : "border-transparent"
                      : "text-white/40 hover:text-white/60 border-transparent"
                  }`}
                  style={isActive && isHighlighted ? {
                    backgroundColor: `${CATEGORY_COLORS[tab.key as LogCategory]}15`,
                    color: CATEGORY_COLORS[tab.key as LogCategory],
                    borderColor: `${CATEGORY_COLORS[tab.key as LogCategory]}30`,
                  } : undefined}
                  data-testid={`button-tab-${tab.key}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-2 min-h-[400px] max-h-[calc(100vh-280px)]"
            style={{ fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}
            data-testid="live-log-entries"
          >
            <div ref={topRef} />
            {filteredEntries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/20 font-mono text-sm">
                No entries in this category yet.
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  className={`py-1.5 text-[12px] leading-relaxed transition-all duration-500 ${
                    entry.isNew ? "animate-pulse bg-white/[0.02]" : ""
                  }`}
                  data-testid={`log-entry-${entry.id}`}
                >
                  <span className="text-white/25">[{formatTimestamp(entry.timestamp)}]</span>
                  {" "}
                  <span
                    className="font-bold"
                    style={{ color: CATEGORY_COLORS[entry.category] }}
                  >
                    [{CATEGORY_LABELS[entry.category]}: {entry.tag}]
                  </span>
                  {" "}
                  <span className="text-white/60">{entry.message}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2 border-t border-[#1a1a1a] bg-[#050505]/80" data-testid="live-status-bar">
            <div className="flex items-center gap-1 text-[10px] font-mono text-white/30">
              <span className="text-white/15">█</span>
              <span>soulclaw@forge:~$</span>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">SoulClaw Treasury:</span>
                <span className="text-[#00FFFF]" data-testid="text-treasury-balance">{treasuryBalance} sol</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">Total Forged:</span>
                <span className="text-[#FF2D55]" data-testid="text-total-forged">{totalForged}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all duration-200 ${
                    autoScroll ? "text-[#00FFFF] bg-[#00FFFF]/10" : "text-white/30"
                  }`}
                  data-testid="button-auto-scroll"
                >
                  {autoScroll ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  AUTO-SCROLL {autoScroll ? "ON" : "OFF"}
                </button>
                <span className="text-white/15">|</span>
                <span className="text-white/30">POLL: 10s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
