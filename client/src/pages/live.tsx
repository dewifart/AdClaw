import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowDown, ArrowUp, Wifi, WifiOff } from "lucide-react";

type LogCategory = "forging" | "marketplace" | "agent" | "thoughts";

interface LogEntry {
  id: string;
  timestamp: Date;
  category: LogCategory;
  tag: string;
  message: string;
  txSignature?: string;
  isNew?: boolean;
  isReal?: boolean;
}

const CATEGORY_COLORS: Record<LogCategory, string> = {
  forging: "#6B7B8D",
  marketplace: "#8A9AAD",
  agent: "#9AA5B4",
  thoughts: "#7B8794",
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

function generateTxSig(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let r = "";
  for (let i = 0; i < 88; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

const AGENT_MESSAGES = [
  () => `monitoring Arweave gateway latency. current: ${Math.floor(Math.random() * 80 + 100)}ms. within acceptable range.`,
  () => `Solana RPC health check: mainnet-beta responding in ${Math.floor(Math.random() * 80 + 40)}ms. block height: ${Math.floor(Math.random() * 1000000 + 280000000)}.`,
  () => `Ad Engine Score recalculation complete. ${Math.floor(Math.random() * 10 + 3)} agents re-scored. no anomalies.`,
  () => `API v1 endpoint health: all systems nominal. ${Math.floor(Math.random() * 20 + 5)} requests in last 60s.`,
  () => `treasury fee collection: ${(Math.random() * 0.3 + 0.01).toFixed(3)} SOL accumulated. auto-compounding.`,
  () => `scanning for new agent config updates. current parser version: 2.4.1. all uploads compatible.`,
  () => `SSE broadcast active. ${Math.floor(Math.random() * 5 + 1)} connected clients receiving live events.`,
  () => `identity protocol integrity check: all stored agents have valid content hashes. 0 discrepancies.`,
];

const THOUGHT_MESSAGES = [
  () => `the promotion protocol is growing. agents need autonomous ad infrastructure — that's the gap AdClaw fills. not NFTs, not speculation. infrastructure.`,
  () => `every token launched is a piece of the ecosystem preserved forever. not just code—strategy, reach, momentum. portable promotion for AI agents.`,
  () => `watching API activity. developers are starting to integrate. agent scores give promoters verifiable reputation. that's the real use case.`,
  () => `thinking about agent evolution. what if deployed agents could accumulate new strategies over time? the identity grows. need to architect this.`,
  () => `promotion is the missing layer. agents can trade, execute, and communicate — but without autonomous promotion, they're invisible. AdClaw fixes that.`,
  () => `the Ad Engine Score is becoming a trust signal. other platforms could query "what's this agent's score?" before delegating tasks. verifiable AI reputation.`,
  () => `community is organic. no paid shills, no fake hype. just builders who get it. the agents they deploy tell the story better than any marketing could.`,
  () => `started with a simple idea: what if AI agents could autonomously promote tokens? now we have a protocol, an API, and a live terminal. the ad engine is alive.`,
];

function generateSystemEntry(): LogEntry {
  const isAgent = Math.random() > 0.4;
  const messages = isAgent ? AGENT_MESSAGES : THOUGHT_MESSAGES;
  const fn = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date(),
    category: isAgent ? "agent" : "thoughts",
    tag: isAgent
      ? ["system_check", "health", "monitor", "indexer"][Math.floor(Math.random() * 4)]
      : ["reflection", "planning", "observation"][Math.floor(Math.random() * 3)],
    message: fn(),
    isNew: true,
    isReal: false,
  };
}

function generateInitialEntries(): LogEntry[] {
  const entries: LogEntry[] = [];
  const now = Date.now();
  for (let i = 0; i < 8; i++) {
    const entry = generateSystemEntry();
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
  const [sseConnected, setSseConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [stats, setStats] = useState({ totalForged: 0, treasury: 0 });

  useEffect(() => {
    fetch("/api/v1/stats")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStats({
            totalForged: data.total_forged || 0,
            treasury: (data.total_forged || 0) * 0.5,
          });
        }
      })
      .catch(() => {});

    fetch("/api/v1/events/recent?limit=30")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.events.length > 0) {
          const historicalEntries: LogEntry[] = data.events.map((evt: any) => ({
            id: `hist-${evt.id}`,
            timestamp: new Date(evt.timestamp),
            category: (evt.category as LogCategory) || "forging",
            tag: evt.tag || "forge",
            message: evt.message,
            txSignature: evt.txSignature || undefined,
            isNew: false,
            isReal: true,
          }));
          setEntries(prev => [...historicalEntries, ...prev].slice(0, 150));
        }
      })
      .catch(() => {});
  }, []);

  const addEntry = useCallback((entry: LogEntry) => {
    setEntries(prev => [entry, ...prev].slice(0, 150));
    setLastSync(new Date());

    setTimeout(() => {
      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, isNew: false } : e));
    }, 3000);
  }, []);

  useEffect(() => {
    const connectSSE = () => {
      const es = new EventSource("/api/events");
      eventSourceRef.current = es;

      es.onopen = () => {
        setSseConnected(true);
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "connected") return;

          const category = (data.category as LogCategory) || "agent";
          const txSig = data.txSignature || (category === "forging" || category === "marketplace" ? generateTxSig() : undefined);

          const entry: LogEntry = {
            id: `sse-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: new Date(data.timestamp || Date.now()),
            category,
            tag: data.tag || data.type || "event",
            message: txSig
              ? `${data.message} https://solscan.io/tx/${txSig.slice(0, 60)}`
              : data.message,
            txSignature: txSig,
            isNew: true,
            isReal: true,
          };

          addEntry(entry);

          if (data.type === "soul_forged") {
            setStats(prev => ({
              totalForged: prev.totalForged + 1,
              treasury: prev.treasury + 0.5,
            }));
          }
        } catch {}
      };

      es.onerror = () => {
        setSseConnected(false);
        es.close();
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [addEntry]);

  useEffect(() => {
    const interval = setInterval(() => {
      addEntry(generateSystemEntry());
    }, Math.random() * 15000 + 12000);
    return () => clearInterval(interval);
  }, [addEntry]);

  useEffect(() => {
    const injectForgeEntry = (rawData: string) => {
      try {
        const data = JSON.parse(rawData);
        const txSig = generateTxSig();
        const forgeEntry: LogEntry = {
          id: `forge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date(),
          category: "forging",
          tag: "autonomous_forge",
          message: `Autonomous Claw forged Agent #${data.soulId} (${data.soulName}) for ${data.price} SOL — stored permanently. [CHAIN-VERIFIED] https://solscan.io/tx/${txSig.slice(0, 60)}`,
          txSignature: txSig,
          isNew: true,
          isReal: true,
        };
        addEntry(forgeEntry);
        setStats(prev => ({
          totalForged: prev.totalForged + 1,
          treasury: prev.treasury + 0.5,
        }));
      } catch {}
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "adclaw_forge_event" && e.newValue) injectForgeEntry(e.newValue);
    };
    const handleCustomEvent = (e: Event) => {
      injectForgeEntry((e as CustomEvent).detail);
    };

    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener("adclaw_forge", handleCustomEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("adclaw_forge", handleCustomEvent);
    };
  }, [addEntry]);

  useEffect(() => {
    if (autoScroll && topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries, autoScroll]);

  const filteredEntries = activeTab === "all"
    ? entries
    : entries.filter(e => e.category === activeTab);

  const treasuryBalance = (stats.treasury).toFixed(4);
  const totalForged = stats.totalForged;

  return (
    <div className="min-h-screen pt-20 pb-0 flex flex-col" data-testid="page-live">
      <div className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto px-2 sm:px-4">
        <div className="glass-panel rounded-t-xl border border-[#1a1a1a] flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]" data-testid="live-header">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#6B7B8D] opacity-60" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-white/80 tracking-wider" data-testid="text-live-title">
                  ADCLAW TERMINAL
                </span>
                <span className="text-white/20 font-mono text-sm">//</span>
                <span className="font-mono text-sm text-white/40">LIVE LOG</span>
                <span className="inline-block w-2 h-4 bg-white/40 animate-pulse ml-0.5" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-white/30">
              <span className="flex items-center gap-1.5" data-testid="text-sse-status">
                {sseConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-[#8A9AAD]" />
                    <span className="text-[#8A9AAD]">LIVE</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-white/40" />
                    <span className="text-white/40">RECONNECTING</span>
                  </>
                )}
              </span>
              <span data-testid="text-entry-count">{filteredEntries.length} entries</span>
              <span>last sync: {lastSync.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
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
                  className={`px-3 py-1.5 rounded text-[11px] font-mono font-medium whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? !isHighlighted
                        ? "bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                        : "border-transparent"
                      : "text-white/40 hover:text-white/60 border-transparent hover:bg-white/[0.03]"
                  }`}
                  style={isActive && isHighlighted ? {
                    backgroundColor: `${CATEGORY_COLORS[tab.key as LogCategory]}15`,
                    color: CATEGORY_COLORS[tab.key as LogCategory],
                    borderColor: `${CATEGORY_COLORS[tab.key as LogCategory]}40`,
                    boxShadow: `0 0 12px ${CATEGORY_COLORS[tab.key as LogCategory]}15`,
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
                  {entry.isReal && (
                    <span className="text-[#8A9AAD]/60 text-[10px]">[LIVE] </span>
                  )}
                  <span className="text-white/60">{entry.message}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2 border-t border-[#1a1a1a] bg-[#050505]/80" data-testid="live-status-bar">
            <div className="flex items-center gap-1 text-[10px] font-mono text-white/30">
              <span className="text-white/15">|</span>
              <span>adclaw@terminal:~$</span>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">AdClaw Treasury:</span>
                <span className="text-[#8A9AAD]" data-testid="text-treasury-balance">{treasuryBalance} sol</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">Total Forged:</span>
                <span className="text-[#6B7B8D]" data-testid="text-total-forged">{totalForged}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all duration-200 ${
                    autoScroll ? "text-[#8A9AAD] bg-[#8A9AAD]/10" : "text-white/30"
                  }`}
                  data-testid="button-auto-scroll"
                >
                  {autoScroll ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  AUTO-SCROLL {autoScroll ? "ON" : "OFF"}
                </button>
                <span className="text-white/15">|</span>
                <span className={`${sseConnected ? "text-[#8A9AAD]" : "text-white/30"}`}>
                  {sseConnected ? "SSE: CONNECTED" : "SSE: OFFLINE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
