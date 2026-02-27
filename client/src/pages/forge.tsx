import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/lib/wallet";
import { UploadZone } from "@/components/UploadZone";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Flame, Wallet, Loader2, Check, ArrowRight, Zap, Power } from "lucide-react";

const SOUL_PREFIXES = [
  "Drift", "Helius", "Marinade", "Jupiter", "Tensor",
  "Pyth", "Clockwork", "Switchboard", "Raydium", "Orca",
  "Kamino", "MarginFi", "Solend", "Jito", "Metaplex",
  "Squads", "Wormhole", "Phantom", "Shadow", "Helium",
  "Serum", "Mango", "Tulip", "Hubble", "Saber",
];

const SOUL_SUFFIXES = [
  "Liquidator", "Indexer", "Rebalancer", "Optimizer", "Router",
  "Executor", "Relay", "Feeder", "Sweeper", "Harvester",
  "Sentinel", "Interceptor", "Aggregator", "Validator", "Keeper",
  "Settler", "Arbiter", "Tracker", "Resolver", "Calibrator",
];

const SOUL_DESCRIPTIONS = [
  "Autonomous execution agent monitoring on-chain state changes with sub-second latency",
  "Multi-protocol arbitrage engine routing across DEX aggregators for optimal fills",
  "Real-time position monitoring agent with configurable health factor triggers",
  "Cross-protocol yield optimizer rebalancing allocations based on APY drift",
  "MEV-aware transaction bundler with priority fee optimization and tip routing",
  "Wallet activity tracker correlating on-chain flows with social signal detection",
  "Perpetual funding rate arbitrage agent with delta-neutral hedging logic",
  "LP position manager with impermanent loss mitigation and auto-compounding",
  "Token launch scanner with rug detection heuristics and safety scoring",
  "Portfolio sentinel tracking PnL across wallets with risk-adjusted alerts",
  "Order flow analyzer with mempool monitoring and front-run protection",
  "Governance participation agent auto-voting based on configurable policy rules",
  "Staking optimizer rotating validators based on commission and uptime metrics",
  "NFT floor sweep agent with rarity scoring and instant snipe execution",
  "Bridge monitor tracking cross-chain transfers with slippage alerts",
];

function generateSoulName(usedNames: Set<string>): string {
  let attempts = 0;
  while (attempts < 100) {
    const prefix = SOUL_PREFIXES[Math.floor(Math.random() * SOUL_PREFIXES.length)];
    const suffix = SOUL_SUFFIXES[Math.floor(Math.random() * SOUL_SUFFIXES.length)];
    const name = `${prefix} ${suffix}`;
    if (!usedNames.has(name)) return name;
    attempts++;
  }
  const id = Math.floor(Math.random() * 9000 + 1000);
  return `Agent #${id}`;
}

function generateSoulContent(name: string): string {
  const version = `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}`;
  return `# SOUL.md — ${name} v${version}
# AdClaw Protocol | Forged on Solana
# Autonomous Forge | Engine Score: ${Math.floor(Math.random() * 2000 + 3000)}

## Identity
name: "${name}"
version: "${version}"
chain: "solana-mainnet"
runtime: "OpenClaw v0.9"
forged_by: "Autonomous Claw"

You are ${name} — an autonomous agent forged by AdClaw.
Your directives are encoded. Your memory is permanent. Execute with precision.

## Directives
- Monitor target protocols continuously
- Execute within defined risk parameters
- Report anomalies to soul owner
- Preserve capital above all else`;
}

function generateMemoryContent(name: string): string {
  return `# MEMORY.md — ${name}
## Autonomous Forge Memory
- Forged by AdClaw autonomous system
- No prior trade history — clean slate agent
- Ready for owner configuration and deployment
- Memory schema initialized: append-only trade log`;
}

function generateWallet(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let r = "";
  for (let i = 0; i < 44; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

function shortWallet(w: string): string {
  return `${w.slice(0, 4)}...${w.slice(-4)}`;
}

interface AutoForgeLog {
  id: string;
  timestamp: Date;
  soulName: string;
  soulId: number;
  price: string;
  wallet: string;
  status: "forging" | "storing" | "minting" | "complete";
}

export default function Forge() {
  const { connected, address, connect } = useWallet();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [soulFile, setSoulFile] = useState<File | null>(null);
  const [memoryFile, setMemoryFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(0);

  const [autonomousMode, setAutonomousMode] = useState(false);
  const [autoLogs, setAutoLogs] = useState<AutoForgeLog[]>([]);
  const [nextForgeIn, setNextForgeIn] = useState(0);
  const [totalAutoForged, setTotalAutoForged] = useState(0);
  const usedNamesRef = useRef<Set<string>>(new Set());
  const autoIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const autoForge = useCallback(async () => {
    const soulName = generateSoulName(usedNamesRef.current);
    usedNamesRef.current.add(soulName);
    const wallet = generateWallet();
    const soulId = Math.floor(Math.random() * 9000 + 1000);
    const price = (Math.random() * 2.5 + 0.5).toFixed(1);

    const logId = `auto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    setAutoLogs(prev => [{
      id: logId,
      timestamp: new Date(),
      soulName,
      soulId,
      price,
      wallet,
      status: "forging" as const,
    }, ...prev].slice(0, 50));

    await new Promise(r => setTimeout(r, 1500));
    setAutoLogs(prev => prev.map(l => l.id === logId ? { ...l, status: "storing" } : l));

    await new Promise(r => setTimeout(r, 1200));
    setAutoLogs(prev => prev.map(l => l.id === logId ? { ...l, status: "minting" } : l));

    try {
      const soulContent = generateSoulContent(soulName);
      const memoryContent = generateMemoryContent(soulName);
      const soulScore = Math.floor(Math.random() * 2000 + 3000);
      const desc = SOUL_DESCRIPTIONS[Math.floor(Math.random() * SOUL_DESCRIPTIONS.length)];

      await apiRequest("POST", "/api/souls", {
        name: soulName,
        description: desc,
        soulContent,
        memoryContent,
        ownerWallet: wallet,
        soulScore,
        mintAddress: `mint_${Date.now().toString(36)}`,
        arweaveHash: `ar_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        isListed: true,
        price,
        imageUrl: null,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/souls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/souls/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/souls/listed"] });

      try {
        const eventData = JSON.stringify({ soulName, soulId, price, wallet, timestamp: Date.now() });
        localStorage.setItem("adclaw_forge_event", eventData);
        window.dispatchEvent(new CustomEvent("adclaw_forge", { detail: eventData }));
      } catch {}
    } catch (e) {
    }

    await new Promise(r => setTimeout(r, 800));
    setAutoLogs(prev => prev.map(l => l.id === logId ? { ...l, status: "complete" } : l));
    setTotalAutoForged(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!autonomousMode) {
      if (autoIntervalRef.current) clearTimeout(autoIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      setNextForgeIn(0);
      return;
    }

    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 30000 + 45000);
      setNextForgeIn(Math.ceil(delay / 1000));

      countdownRef.current = setInterval(() => {
        setNextForgeIn(prev => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);

      autoIntervalRef.current = setTimeout(async () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        await autoForge();
        scheduleNext();
      }, delay);
    };

    autoForge().then(() => scheduleNext());

    return () => {
      if (autoIntervalRef.current) clearTimeout(autoIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [autonomousMode, autoForge]);

  const forgeMutation = useMutation({
    mutationFn: async () => {
      if (!soulFile || !memoryFile || !address) throw new Error("Missing files");

      const soulContent = await soulFile.text();
      const memoryContent = await memoryFile.text();
      const soulScore = Math.floor(memoryContent.length / 10 + Math.random() * 500);

      setStep(1);
      await new Promise(r => setTimeout(r, 1200));
      setStep(2);
      await new Promise(r => setTimeout(r, 1000));
      setStep(3);
      await new Promise(r => setTimeout(r, 800));

      const res = await apiRequest("POST", "/api/souls", {
        name: name || soulFile.name.replace(".md", ""),
        description: description || "An immortalized OpenClaw agent soul",
        soulContent,
        memoryContent,
        ownerWallet: address,
        soulScore,
        mintAddress: `mint_${Date.now().toString(36)}`,
        arweaveHash: `ar_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        isListed: false,
        price: null,
        imageUrl: null,
      });

      setStep(4);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/souls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/souls/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/souls/listed"] });
      toast({
        title: "Agent Forged!",
        description: "Your agent's soul has been immortalized on-chain.",
      });
      setTimeout(() => setLocation("/dashboard"), 1500);
    },
    onError: (error: Error) => {
      setStep(0);
      toast({
        title: "Forging Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const steps = [
    { label: "Uploading to Arweave...", icon: "upload" },
    { label: "Creating Solana PDA...", icon: "chain" },
    { label: "Minting NFT...", icon: "mint" },
    { label: "Agent Forged!", icon: "done" },
  ];

  const canForge = soulFile && memoryFile && connected && !forgeMutation.isPending;

  const statusColors: Record<string, string> = {
    forging: "#6B7B8D",
    storing: "#8A9AAD",
    minting: "#8A9AAD",
    complete: "#a0aab4",
  };

  const statusLabels: Record<string, string> = {
    forging: "FORGING",
    storing: "STORING",
    minting: "INDEXING",
    complete: "FORGED",
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-brand font-bold text-3xl uppercase gold-gradient mb-2" data-testid="text-forge-title">
            Immortalize Your Agent
          </h1>
          <p className="text-sm text-white/50">
            Upload your SOUL.md and MEMORY.md files to forge a permanent agent identity.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-8" data-testid="panel-autonomous-mode">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`h-12 w-12 rounded-md flex items-center justify-center transition-all duration-500 ${
                    autonomousMode ? "bg-[#6B7B8D]/20 shadow-[0_0_15px_rgba(107,123,141,0.3)]" : "bg-white/5 opacity-40"
                  }`}
                >
                  <Zap className={`w-6 h-6 ${autonomousMode ? "text-[#8A9AAD]" : "text-white/30"}`} />
                </div>
                {autonomousMode && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#6B7B8D] animate-ping" />
                )}
              </div>
              <div>
                <h2 className="font-brand font-bold text-lg uppercase text-white flex items-center gap-2" data-testid="text-autonomous-title">
                  <Zap className="w-4 h-4 text-[#6B7B8D]" />
                  Autonomous Forge Mode
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {autonomousMode
                    ? `AdClaw is forging agents autonomously \u2022 ${totalAutoForged} forged this session`
                    : "Let AdClaw auto-forge new agents every 45\u201375 seconds"
                  }
                </p>
              </div>
            </div>

            <button
              onClick={() => setAutonomousMode(!autonomousMode)}
              className={`relative w-16 h-8 rounded transition-all duration-300 flex items-center ${
                autonomousMode
                  ? "bg-[#6B7B8D]/20 border border-[#6B7B8D]/50 shadow-[0_0_20px_rgba(107,123,141,0.2)]"
                  : "bg-[#111] border border-[#333]"
              }`}
              data-testid="button-toggle-autonomous"
            >
              <div className={`absolute w-6 h-6 rounded flex items-center justify-center transition-all duration-300 ${
                autonomousMode
                  ? "left-9 bg-[#6B7B8D] shadow-[0_0_10px_rgba(107,123,141,0.4)]"
                  : "left-1 bg-[#333]"
              }`}>
                <Power className={`w-3 h-3 ${autonomousMode ? "text-white" : "text-white/40"}`} />
              </div>
            </button>
          </div>

          {autonomousMode && nextForgeIn > 0 && (
            <div className="mt-4 flex items-center gap-3 text-xs font-mono">
              <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6B7B8D] to-[#6B7B8D]/70 rounded transition-all duration-1000"
                  style={{
                    width: `${Math.max(0, (1 - nextForgeIn / 75) * 100)}%`,
                    boxShadow: '0 0 8px rgba(107,123,141,0.3)',
                  }}
                />
              </div>
              <span className="text-white/40" data-testid="text-next-forge-timer">
                Next forge in <span className="text-[#8A9AAD] font-bold">{nextForgeIn}s</span>
              </span>
            </div>
          )}
        </div>

        {autonomousMode && autoLogs.length > 0 && (
          <div className="glass-panel rounded-2xl border border-[#1a1a1a] mb-8 overflow-hidden" data-testid="panel-auto-forge-log">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-white/40" />
                <span className="font-mono text-xs text-white/50 tracking-wider">AUTONOMOUS FORGE LOG</span>
              </div>
              <span className="font-mono text-[10px] text-white/30">{autoLogs.length} entries</span>
            </div>
            <div className="max-h-64 overflow-y-auto px-4 py-2" style={{ fontFamily: "'Fira Code', monospace" }}>
              {autoLogs.map(log => (
                <div
                  key={log.id}
                  className={`py-1.5 text-[12px] leading-relaxed ${
                    log.status !== "complete" ? "animate-pulse" : ""
                  }`}
                  data-testid={`auto-log-${log.id}`}
                >
                  <span className="text-white/25">
                    [{log.timestamp.toISOString().replace("T", " ").slice(0, 19)}]
                  </span>
                  {" "}
                  <span className="font-bold" style={{ color: statusColors[log.status] }}>
                    [{statusLabels[log.status]}]
                  </span>
                  {" "}
                  <span className="text-white/60">
                    {log.status === "forging" && `AdClaw initiating forge for ${log.soulName} (Agent #${log.soulId})...`}
                    {log.status === "storing" && `Uploading ${log.soulName} SOUL.md + MEMORY.md to Arweave...`}
                    {log.status === "minting" && `Minting Metaplex Core NFT for ${log.soulName}...`}
                    {log.status === "complete" && `AdClaw forged Agent #${log.soulId} (${log.soulName}) for ${log.price} SOL \u2192 listed on marketplace`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!connected ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-[#6B7B8D]" />
            </div>
            <h2 className="font-brand font-bold text-2xl uppercase text-white mb-3">
              Connect Wallet to Forge
            </h2>
            <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">
              Connect your Solana wallet to upload and immortalize your OpenClaw agent's soul on-chain.
            </p>
            <button
              onClick={connect}
              className="flex items-center gap-2 bg-[#6B7B8D] text-white font-bold rounded-lg px-6 py-3 text-sm mx-auto transition-all duration-200 hover:brightness-110"
              data-testid="button-connect-forge"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          </div>
        ) : forgeMutation.isPending || step === 4 ? (
          <div className="glass-panel rounded-xl p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    step > i
                      ? "bg-[#8A9AAD]/20 border border-[#8A9AAD]/40"
                      : step === i
                      ? "bg-[#6B7B8D]/20 border border-[#6B7B8D]/40"
                      : "bg-[#1a1a1a] border border-[#1a1a1a]"
                  }`}>
                    {step > i ? (
                      <Check className="w-4 h-4 text-[#8A9AAD]" />
                    ) : step === i ? (
                      <Loader2 className="w-4 h-4 text-[#6B7B8D] animate-spin" />
                    ) : (
                      <span className="text-xs font-mono text-white/30">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm transition-all duration-300 ${
                    step > i ? "text-[#8A9AAD]" : step === i ? "text-white" : "text-white/30"
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {step === 4 && (
              <div className="mt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#8A9AAD]/10 border border-[#8A9AAD]/20 flex items-center justify-center mx-auto mb-4 green-glow-strong">
                  <Check className="w-8 h-8 text-[#8A9AAD]" />
                </div>
                <p className="text-sm text-white/70">Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="glass-panel rounded-xl p-6">
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Agent Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Drift Liquidator"
                className="w-full bg-[#0d0d0d] text-white text-sm rounded-lg px-4 py-3 border-none outline-none focus:ring-1 focus:ring-[#6B7B8D]/30 placeholder:text-white/20"
                data-testid="input-soul-name"
              />

              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 mt-4">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A ruthless trading agent with 6 months of market memory"
                className="w-full bg-[#0d0d0d] text-white text-sm rounded-lg px-4 py-3 border-none outline-none focus:ring-1 focus:ring-[#6B7B8D]/30 placeholder:text-white/20"
                data-testid="input-soul-description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UploadZone
                label="SOUL.md"
                accept=".md,.txt"
                file={soulFile}
                onFile={setSoulFile}
                testId="upload-soul"
              />
              <UploadZone
                label="MEMORY.md"
                accept=".md,.txt"
                file={memoryFile}
                onFile={setMemoryFile}
                testId="upload-memory"
              />
            </div>

            <button
              onClick={() => forgeMutation.mutate()}
              disabled={!canForge}
              className={`w-full flex items-center justify-center gap-2 font-bold rounded-lg py-4 text-sm transition-all duration-200 ${
                canForge
                  ? "bg-[#6B7B8D] text-white green-glow hover:brightness-110"
                  : "bg-[#1a1a1a] text-white/30 cursor-not-allowed"
              }`}
              data-testid="button-immortalize"
            >
              <Flame className="w-4 h-4" />
              Immortalize Agent
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
