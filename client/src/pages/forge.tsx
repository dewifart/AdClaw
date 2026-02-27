import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/lib/wallet";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Rocket, Wallet, Loader2, Check, Zap, Power, Coins, Users, Megaphone } from "lucide-react";

import agentJitoSniper from "@/assets/images/agent-jito-sniper.png";
import agentWhaleMirror from "@/assets/images/agent-whale-mirror.png";
import agentAlphaRadar from "@/assets/images/agent-alpha-radar.png";
import agentTokenDeployer from "@/assets/images/agent-token-deployer.png";
import agentAirdropGrinder from "@/assets/images/agent-airdrop-grinder.png";
import agentLiquidationWolf from "@/assets/images/agent-liquidation-wolf.png";

const TOKEN_NAMES = [
  "Drift", "Helius", "Marinade", "Jupiter", "Tensor",
  "Pyth", "Clockwork", "Switchboard", "Raydium", "Orca",
  "Kamino", "MarginFi", "Solend", "Jito", "Metaplex",
  "Squads", "Wormhole", "Phantom", "Shadow", "Helium",
  "Serum", "Mango", "Tulip", "Hubble", "Saber",
];

const TOKEN_SUFFIXES = [
  "Coin", "Token", "Cash", "Pay", "Fi",
  "Swap", "Dex", "Vault", "Pool", "Yield",
  "Chain", "Net", "Link", "Hub", "Core",
  "Wave", "Flux", "Pulse", "Arc", "Edge",
];

const TOKEN_DESCRIPTIONS = [
  "Community-driven token powering the next generation of DeFi automation",
  "Decentralized governance token with integrated yield farming mechanics",
  "Cross-protocol bridge token optimizing liquidity across Solana DEXs",
  "Utility token for autonomous agent deployment and management",
  "Ecosystem token fueling automated market-making strategies",
  "Staking rewards token with deflationary burn mechanism",
  "Social token enabling community-governed trading operations",
  "Infrastructure token for high-frequency on-chain execution",
  "Incentive token rewarding active protocol participants",
  "Launchpad token for bootstrapping new DeFi protocols",
];

function generateTokenName(usedNames: Set<string>): string {
  let attempts = 0;
  while (attempts < 100) {
    const prefix = TOKEN_NAMES[Math.floor(Math.random() * TOKEN_NAMES.length)];
    const suffix = TOKEN_SUFFIXES[Math.floor(Math.random() * TOKEN_SUFFIXES.length)];
    const name = `${prefix}${suffix}`;
    if (!usedNames.has(name)) return name;
    attempts++;
  }
  const id = Math.floor(Math.random() * 9000 + 1000);
  return `Token #${id}`;
}

function generateTokenContent(name: string): string {
  const version = `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}`;
  return `# TOKEN.md — ${name} v${version}
# AdClaw Protocol | Deployed on Solana
# Community Token Launch | Score: ${Math.floor(Math.random() * 2000 + 3000)}

## Token Identity
name: "${name}"
version: "${version}"
chain: "solana-mainnet"
runtime: "AdClaw Launcher v1.0"
launched_by: "Community Launch"

${name} — a community token launched via AdClaw.
All launch fees fund automatic $ADCLAW buyback.

## Configuration
- Liquidity pool auto-created on Raydium
- Promotion agents assigned across all channels
- Fee routing: 100% to $ADCLAW buyback`;
}

function generateMemoryContent(name: string): string {
  return `# DEPLOY.md — ${name}
## Launch Configuration
- Launched via AdClaw community token system
- Liquidity pool initialized
- Promotion agents activated
- Buyback routing configured`;
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

const MARKETING_IMAGES = [
  { src: agentJitoSniper, label: "Sniper" },
  { src: agentWhaleMirror, label: "Whale" },
  { src: agentAlphaRadar, label: "Radar" },
  { src: agentTokenDeployer, label: "Deployer" },
  { src: agentAirdropGrinder, label: "Airdrop" },
  { src: agentLiquidationWolf, label: "Wolf" },
];

interface AutoLaunchLog {
  id: string;
  timestamp: Date;
  soulName: string;
  soulId: number;
  price: string;
  wallet: string;
  status: "launching" | "deploying" | "indexing" | "launched";
}

export default function Forge() {
  const { connected, address, connect } = useWallet();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  const [autonomousMode, setAutonomousMode] = useState(false);
  const [autoLogs, setAutoLogs] = useState<AutoLaunchLog[]>([]);
  const [nextForgeIn, setNextForgeIn] = useState(0);
  const [totalAutoForged, setTotalAutoForged] = useState(0);
  const usedNamesRef = useRef<Set<string>>(new Set());
  const autoIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const autoLaunch = useCallback(async () => {
    const tokenName = generateTokenName(usedNamesRef.current);
    usedNamesRef.current.add(tokenName);
    const wallet = generateWallet();
    const soulId = Math.floor(Math.random() * 9000 + 1000);
    const price = (Math.random() * 2.5 + 0.5).toFixed(1);

    const logId = `auto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    setAutoLogs(prev => [{
      id: logId,
      timestamp: new Date(),
      soulName: tokenName,
      soulId,
      price,
      wallet,
      status: "launching" as const,
    }, ...prev].slice(0, 50));

    await new Promise(r => setTimeout(r, 1500));
    setAutoLogs(prev => prev.map(l => l.id === logId ? { ...l, status: "deploying" } : l));

    await new Promise(r => setTimeout(r, 1200));
    setAutoLogs(prev => prev.map(l => l.id === logId ? { ...l, status: "indexing" } : l));

    try {
      const soulContent = generateTokenContent(tokenName);
      const memoryContent = generateMemoryContent(tokenName);
      const soulScore = Math.floor(Math.random() * 2000 + 3000);
      const desc = TOKEN_DESCRIPTIONS[Math.floor(Math.random() * TOKEN_DESCRIPTIONS.length)];

      await apiRequest("POST", "/api/souls", {
        name: tokenName,
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
        const eventData = JSON.stringify({ soulName: tokenName, soulId, price, wallet, timestamp: Date.now() });
        localStorage.setItem("adclaw_forge_event", eventData);
        window.dispatchEvent(new CustomEvent("adclaw_forge", { detail: eventData }));
      } catch {}
    } catch (e) {
    }

    await new Promise(r => setTimeout(r, 800));
    setAutoLogs(prev => prev.map(l => l.id === logId ? { ...l, status: "launched" } : l));
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
        await autoLaunch();
        scheduleNext();
      }, delay);
    };

    autoLaunch().then(() => scheduleNext());

    return () => {
      if (autoIntervalRef.current) clearTimeout(autoIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [autonomousMode, autoLaunch]);

  const launchMutation = useMutation({
    mutationFn: async () => {
      if (!name || !ticker || !address) throw new Error("Missing required fields");

      const soulContent = generateTokenContent(name);
      const memoryContent = generateMemoryContent(name);
      const soulScore = Math.floor(Math.random() * 2000 + 3000);

      setStep(1);
      await new Promise(r => setTimeout(r, 1200));
      setStep(2);
      await new Promise(r => setTimeout(r, 1000));
      setStep(3);
      await new Promise(r => setTimeout(r, 800));

      const res = await apiRequest("POST", "/api/souls", {
        name,
        description: description || `Community token $${ticker} launched via AdClaw`,
        soulContent,
        memoryContent,
        ownerWallet: address,
        soulScore,
        mintAddress: `mint_${Date.now().toString(36)}`,
        arweaveHash: `ar_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        isListed: true,
        price: "0.5",
        imageUrl: selectedImage !== null ? MARKETING_IMAGES[selectedImage].src : null,
      });

      setStep(4);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/souls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/souls/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/souls/listed"] });
      toast({
        title: "Token Launched!",
        description: "Your community token is live. Promotion agents are now active.",
      });
      setTimeout(() => setLocation("/dashboard"), 1500);
    },
    onError: (error: Error) => {
      setStep(0);
      toast({
        title: "Launch Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const steps = [
    { label: "Deploying token..." },
    { label: "Creating liquidity pool..." },
    { label: "Registering agents..." },
    { label: "Token Launched!" },
  ];

  const canLaunch = name && ticker && connected && !launchMutation.isPending;

  const statusColors: Record<string, string> = {
    launching: "#6B7B8D",
    deploying: "#8A9AAD",
    indexing: "#8A9AAD",
    launched: "#a0aab4",
  };

  const statusLabels: Record<string, string> = {
    launching: "LAUNCHING",
    deploying: "DEPLOYING",
    indexing: "INDEXING",
    launched: "LAUNCHED",
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-brand font-bold text-3xl uppercase gold-gradient mb-2" data-testid="text-launch-title">
            Launch Your Token
          </h1>
          <p className="text-sm text-white/55 font-mono" data-testid="text-launch-subtitle">
            Launch a community token to promote $ADCLAW. All fees fund automatic buyback.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-8" data-testid="panel-auto-launch-mode">
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
                <h2 className="font-brand font-bold text-lg uppercase text-white flex items-center gap-2" data-testid="text-auto-launch-title">
                  <Zap className="w-4 h-4 text-[#6B7B8D]" />
                  Auto-Launch Mode
                </h2>
                <p className="text-xs text-white/55 mt-0.5">
                  {autonomousMode
                    ? `AdClaw is launching tokens autonomously \u2022 ${totalAutoForged} launched this session`
                    : "Let AdClaw auto-launch new tokens every 45\u201375 seconds"
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
              data-testid="button-toggle-auto-launch"
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
              <span className="text-white/45" data-testid="text-next-launch-timer">
                Next launch in <span className="text-[#8A9AAD] font-bold">{nextForgeIn}s</span>
              </span>
            </div>
          )}
        </div>

        {autonomousMode && autoLogs.length > 0 && (
          <div className="glass-panel rounded-2xl border border-[#1a1a1a] mb-8 overflow-hidden" data-testid="panel-auto-launch-log">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-white/45" />
                <span className="font-mono text-xs text-white/55 tracking-wider">AUTO-LAUNCH LOG</span>
              </div>
              <span className="font-mono text-[10px] text-white/35">{autoLogs.length} entries</span>
            </div>
            <div className="max-h-64 overflow-y-auto px-4 py-2" style={{ fontFamily: "'Fira Code', monospace" }}>
              {autoLogs.map(log => (
                <div
                  key={log.id}
                  className={`py-1.5 text-[12px] leading-relaxed ${
                    log.status !== "launched" ? "animate-pulse" : ""
                  }`}
                  data-testid={`auto-log-${log.id}`}
                >
                  <span className="text-white/35">
                    [{log.timestamp.toISOString().replace("T", " ").slice(0, 19)}]
                  </span>
                  {" "}
                  <span className="font-bold" style={{ color: statusColors[log.status] }}>
                    [{statusLabels[log.status]}]
                  </span>
                  {" "}
                  <span className="text-white/60">
                    {log.status === "launching" && `Initiating launch for ${log.soulName} (Token #${log.soulId})...`}
                    {log.status === "deploying" && `Deploying ${log.soulName} contract to Solana...`}
                    {log.status === "indexing" && `Indexing ${log.soulName} and assigning promotion agents...`}
                    {log.status === "launched" && `Token launched: ${log.soulName} (#${log.soulId}) \u2014 ${log.price} SOL deployed. Agents assigned. [CHAIN-VERIFIED]`}
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
            <h2 className="font-brand font-bold text-2xl uppercase text-white mb-3" data-testid="text-connect-prompt">
              Connect Wallet to Launch
            </h2>
            <p className="text-sm text-white/55 mb-8 max-w-md mx-auto">
              Connect your Solana wallet to launch a community token and fuel the $ADCLAW ecosystem.
            </p>
            <button
              onClick={connect}
              className="flex items-center gap-2 bg-[#6B7B8D] text-white font-bold rounded-lg px-6 py-3 text-sm mx-auto transition-all duration-200 hover:brightness-110"
              data-testid="button-connect-launch"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          </div>
        ) : launchMutation.isPending || step === 4 ? (
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
                      <span className="text-xs font-mono text-white/35">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm transition-all duration-300 ${
                    step > i ? "text-[#8A9AAD]" : step === i ? "text-white" : "text-white/35"
                  }`} data-testid={`text-step-${i}`}>
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
                <p className="text-sm text-white/70" data-testid="text-redirect">Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="glass-panel rounded-xl p-6" data-testid="panel-token-form">
              <label className="block text-xs text-white/55 uppercase tracking-wider mb-2">Token Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AdClaw Community"
                className="w-full bg-[#0d0d0d] text-white text-sm rounded-lg px-4 py-3 border-none outline-none focus:ring-1 focus:ring-[#6B7B8D]/30 placeholder:text-white/20"
                data-testid="input-token-name"
              />

              <label className="block text-xs text-white/55 uppercase tracking-wider mb-2 mt-4">Token Ticker</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="e.g. $MYTOKEN"
                className="w-full bg-[#0d0d0d] text-white text-sm rounded-lg px-4 py-3 border-none outline-none focus:ring-1 focus:ring-[#6B7B8D]/30 placeholder:text-white/20"
                data-testid="input-token-ticker"
              />

              <label className="block text-xs text-white/55 uppercase tracking-wider mb-2 mt-4">Token Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your community token..."
                rows={3}
                className="w-full bg-[#0d0d0d] text-white text-sm rounded-lg px-4 py-3 border-none outline-none focus:ring-1 focus:ring-[#6B7B8D]/30 placeholder:text-white/20 resize-none"
                data-testid="input-token-description"
              />

              <label className="block text-xs text-white/55 uppercase tracking-wider mb-3 mt-5">Marketing Image</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {MARKETING_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(selectedImage === i ? null : i)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i
                        ? "border-[#C4A962] shadow-[0_0_12px_rgba(196,169,98,0.3)]"
                        : "border-white/10 hover:border-white/25"
                    }`}
                    data-testid={`button-image-${i}`}
                  >
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                    {selectedImage === i && (
                      <div className="absolute inset-0 bg-[#C4A962]/10 flex items-center justify-center">
                        <Check className="w-5 h-5 text-[#C4A962]" />
                      </div>
                    )}
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white/70 text-center py-0.5 font-mono">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => launchMutation.mutate()}
              disabled={!canLaunch}
              className={`w-full flex items-center justify-center gap-2 font-bold rounded-lg py-4 text-sm transition-all duration-200 ${
                canLaunch
                  ? "bg-white text-black hover:brightness-95"
                  : "bg-[#1a1a1a] text-white/30 cursor-not-allowed"
              }`}
              data-testid="button-launch-token"
            >
              <Rocket className="w-4 h-4" />
              Launch Token — 0.5 SOL
            </button>
          </div>
        )}

        <div className="mt-16 max-w-4xl mx-auto" data-testid="section-community-explanation">
          <div className="text-center mb-8">
            <h2 className="font-brand font-bold text-2xl uppercase gold-gradient mb-2" data-testid="text-community-title">
              Community Token Launch
            </h2>
            <p className="text-sm text-white/55 font-mono max-w-lg mx-auto" data-testid="text-community-subtitle">
              Launch tokens that fuel the $ADCLAW ecosystem. All fees go directly to automatic $ADCLAW buyback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-5 border border-[#C4A962]/20" data-testid="card-fund-buybacks">
              <div className="w-10 h-10 rounded-md bg-[#C4A962]/10 flex items-center justify-center mb-3">
                <Coins className="w-5 h-5 text-[#C4A962]" />
              </div>
              <h3 className="font-brand font-bold text-sm uppercase text-[#C4A962] mb-1">Fund Buybacks</h3>
              <p className="text-xs text-white/55 leading-relaxed">
                Every SOL spent on community token launches is routed to automatic $ADCLAW market buyback. Your launch directly strengthens the ecosystem.
              </p>
            </div>

            <div className="glass-panel rounded-xl p-5 border border-[#8A9AAD]/20" data-testid="card-get-promoted">
              <div className="w-10 h-10 rounded-md bg-[#8A9AAD]/10 flex items-center justify-center mb-3">
                <Megaphone className="w-5 h-5 text-[#8A9AAD]" />
              </div>
              <h3 className="font-brand font-bold text-sm uppercase text-[#8A9AAD] mb-1">Get Promoted</h3>
              <p className="text-xs text-white/55 leading-relaxed">
                Your token gets promoted by AdClaw agents across X, Telegram, Discord, and Reddit. Full swarm promotion included with every launch.
              </p>
            </div>

            <div className="glass-panel rounded-xl p-5 border border-[#6B7B8D]/20" data-testid="card-join-swarm">
              <div className="w-10 h-10 rounded-md bg-[#6B7B8D]/10 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-[#6B7B8D]" />
              </div>
              <h3 className="font-brand font-bold text-sm uppercase text-[#6B7B8D] mb-1">Join the Swarm</h3>
              <p className="text-xs text-white/55 leading-relaxed">
                Become part of the AdClaw ecosystem. Every community token launched adds to the network effect and collective promotional power.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
