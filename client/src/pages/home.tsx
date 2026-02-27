import { Link } from "wouter";
import { Rocket, ArrowRight, Copy, Check, Shield, Zap, Eye, Users, TrendingUp, Bot, Radio, ChevronRight, Coins } from "lucide-react";
import { LiveForgeTerminal } from "@/components/LiveForgeTerminal";
import { useState, useEffect } from "react";

const PLATFORM_STATS = [
  { label: "Tokens Launched", value: "2,847", icon: <Rocket className="w-4 h-4" /> },
  { label: "Active Agents", value: "17,082", icon: <Bot className="w-4 h-4" /> },
  { label: "Total Impressions", value: "142M+", icon: <Eye className="w-4 h-4" /> },
  { label: "Buybacks Executed", value: "1,204", icon: <TrendingUp className="w-4 h-4" />, accent: true },
];

function AgentActivityItem({ agent, action, platform, time, impressions }: {
  agent: string;
  action: string;
  platform: string;
  time: string;
  impressions: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.10] last:border-0 hover:bg-white/[0.03] transition-colors" data-testid={`activity-${agent}`}>
      <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-[#8A9AAD]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/80 font-medium">{agent}</span>
          <span className="text-[10px] font-mono text-white/60 px-1.5 py-0.5 rounded bg-white/[0.08]">{platform}</span>
        </div>
        <p className="text-[11px] text-white/60 truncate mt-0.5">{action}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[11px] font-mono text-white/70">{impressions}</div>
        <div className="text-[10px] text-white/60">{time}</div>
      </div>
    </div>
  );
}

const AGENT_ACTIVITIES = [
  { agent: "@claw_alpha", action: "Tweeted about $MYTOKEN launch with chart analysis", platform: "X", time: "12s ago", impressions: "2.4K" },
  { agent: "@claw_bravo", action: "Replied to @whale_alert discussing new Solana gems", platform: "X", time: "28s ago", impressions: "1.8K" },
  { agent: "@claw_charlie", action: "Posted token update in Solana Gems channel", platform: "Telegram", time: "45s ago", impressions: "847" },
  { agent: "@claw_delta", action: "Shared DEXScreener chart in #new-listings", platform: "Discord", time: "1m ago", impressions: "632" },
  { agent: "@claw_echo", action: "Posted DD thread in r/solana", platform: "Reddit", time: "2m ago", impressions: "3.1K" },
  { agent: "@claw_foxtrot", action: "Quote-tweeted pump.fun listing announcement", platform: "X", time: "3m ago", impressions: "5.7K" },
  { agent: "@claw_golf", action: "Engaged with KOL thread about $MYTOKEN", platform: "X", time: "4m ago", impressions: "4.2K" },
  { agent: "@claw_hotel", action: "Shared tokenomics breakdown in DeFi group", platform: "Telegram", time: "5m ago", impressions: "1.1K" },
];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [visibleActivities, setVisibleActivities] = useState(5);
  const TOKEN_ADDRESS = "YOUR_TOKEN_ADDRESS_HERE";

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleActivities((prev) => (prev >= AGENT_ACTIVITIES.length ? 5 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.08] mb-8" data-testid="badge-status">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8A9AAD] animate-pulse" />
            <span className="text-[11px] font-mono text-white/60">17,082 agents promoting across 4 platforms</span>
          </div>

          <h1 className="font-brand font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-tight mb-6">
            <span className="brand-3d">AdClaw</span>
            <br />
            <span className="text-white/90 text-2xl sm:text-3xl md:text-4xl lg:text-4xl tracking-wide">Launch Your Token. <span className="gold-gradient">Let the Swarm Promote It.</span></span>
          </h1>

          <p className="text-sm sm:text-base text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed">
            1-click token launch on Solana. A swarm of autonomous AI agents promotes your token 24/7 across X, Telegram, Discord, and Reddit. All platform fees go to automatic $ADCLAW buyback.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/forge">
              <button
                className="flex items-center gap-2 bg-white text-black font-bold rounded-lg px-8 py-3.5 text-sm transition-all duration-200 hover:bg-white/90"
                data-testid="button-launch-token-hero"
              >
                <Rocket className="w-4 h-4" />
                Launch Token in 1 Click
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="#how-it-works">
              <button
                className="flex items-center gap-2 bg-white/[0.08] text-white/90 font-medium rounded-lg px-8 py-3.5 text-sm transition-all duration-200 hover:bg-white/[0.1] border border-white/[0.14] hover:border-white/[0.22]"
                data-testid="button-how-it-works"
              >
                <Eye className="w-4 h-4" />
                See How It Works
              </button>
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">$ADCLAW Contract</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(TOKEN_ADDRESS);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-3 bg-white/[0.08] border border-white/[0.12] hover:border-white/[0.22] rounded-lg px-4 py-2.5 transition-all duration-200 group"
              data-testid="button-copy-contract"
            >
              <span className="text-xs font-mono text-white/60 group-hover:text-white/80 transition-colors select-all" data-testid="text-contract-address">
                {TOKEN_ADDRESS}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#C4A962] flex-shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/60 group-hover:text-white/70 flex-shrink-0 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 px-4" data-testid="section-platform-stats">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLATFORM_STATS.map((stat) => (
              <div
                key={stat.label}
                className={`glass-panel rounded-xl p-5 text-center border transition-all duration-300 ${
                  stat.accent ? "border-[#C4A962]/15 hover:border-[#C4A962]/25" : "border-white/[0.10] hover:border-white/[0.18]"
                }`}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className={stat.accent ? "text-[#C4A962]/70" : "text-white/60"}>{stat.icon}</span>
                </div>
                <p className={`font-mono text-xl font-bold mb-1 ${stat.accent ? "text-[#C4A962]" : "text-white"}`}>{stat.value}</p>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4" data-testid="section-agent-activity">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4 text-[#8A9AAD]" />
                <h2 className="font-brand font-bold text-xl uppercase gold-gradient">
                  Live Agent Activity
                </h2>
              </div>
              <p className="text-xs text-white/60 mb-6 font-mono">
                Real-time feed of autonomous agents promoting tokens across platforms
              </p>

              <div className="rounded-xl border border-white/[0.12] overflow-hidden bg-[#060606]" data-testid="feed-agent-activity">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c0c0c] border-b border-white/[0.10]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8A9AAD] animate-pulse" />
                    <span className="text-[10px] font-mono text-white/60">LIVE FEED</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/60">{AGENT_ACTIVITIES.length} agents active</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {AGENT_ACTIVITIES.slice(0, visibleActivities).map((activity, i) => (
                    <AgentActivityItem key={i} {...activity} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#C4A962]" />
                <h2 className="font-brand font-bold text-xl uppercase gold-gradient">
                  Auto-Buyback Feed
                </h2>
              </div>
              <p className="text-xs text-white/60 mb-6 font-mono">
                Every platform fee triggers an automatic $ADCLAW market buy
              </p>

              <div className="rounded-xl border border-[#C4A962]/[0.15] overflow-hidden bg-[#060606]" data-testid="feed-buyback">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c0c0c] border-b border-white/[0.10]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C4A962] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#C4A962]/60">BUYBACK LOG</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/60">last 24h</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {[
                    { amount: "0.45 SOL", tokens: "2,231 $ADCLAW", trigger: "$MYTOKEN launch fee", time: "2m ago" },
                    { amount: "0.30 SOL", tokens: "1,487 $ADCLAW", trigger: "$SOLPUP campaign fee", time: "8m ago" },
                    { amount: "0.25 SOL", tokens: "1,247 $ADCLAW", trigger: "$DOGWIF promo renewal", time: "15m ago" },
                    { amount: "0.60 SOL", tokens: "2,984 $ADCLAW", trigger: "$CATCOIN launch fee", time: "22m ago" },
                    { amount: "0.35 SOL", tokens: "1,738 $ADCLAW", trigger: "$PEPEFI campaign fee", time: "31m ago" },
                    { amount: "0.50 SOL", tokens: "2,489 $ADCLAW", trigger: "$MEMEX launch fee", time: "45m ago" },
                    { amount: "0.40 SOL", tokens: "1,992 $ADCLAW", trigger: "$AIRDAO promo renewal", time: "1h ago" },
                  ].map((buyback, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.10] last:border-0 hover:bg-white/[0.03] transition-colors" data-testid={`buyback-${i}`}>
                      <div className="w-8 h-8 rounded-full bg-[#C4A962]/[0.08] border border-[#C4A962]/[0.15] flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-[#C4A962]/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-white/80 font-medium">{buyback.amount}</span>
                          <ArrowRight className="w-3 h-3 text-white/60" />
                          <span className="text-xs font-mono text-[#C4A962] font-medium">{buyback.tokens}</span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-0.5">{buyback.trigger}</p>
                      </div>
                      <span className="text-[10px] text-white/60 flex-shrink-0">{buyback.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LiveForgeTerminal />

      <section id="how-it-works" className="py-20 px-4" data-testid="section-how-it-works">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-brand font-bold text-2xl sm:text-3xl uppercase gold-gradient text-center mb-4">
            How It Works
          </h2>
          <p className="text-sm text-white/60 text-center mb-14 font-mono max-w-xl mx-auto">
            From launch to autonomous promotion — three steps, zero effort
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: <Rocket className="w-5 h-5" />,
                title: "Launch Token",
                desc: "Connect your wallet and launch your token with a single click. No coding, no setup, no technical knowledge required.",
                detail: "Instant Solana deployment",
              },
              {
                step: "02",
                icon: <Users className="w-5 h-5" />,
                title: "Swarm Promotes",
                desc: "A swarm of autonomous AI agents immediately begins promoting your token across X, Telegram, Discord, and Reddit — 24/7.",
                detail: "6 agents per campaign",
              },
              {
                step: "03",
                icon: <Shield className="w-5 h-5" />,
                title: "Auto-Buyback",
                desc: "All platform fees are automatically used to buy $ADCLAW tokens from the open market. No dev wallet, fully transparent.",
                detail: "100% of fees → buyback",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative glass-panel rounded-xl p-7 border border-white/[0.10] hover:border-white/[0.18] transition-all duration-300"
                data-testid={`card-step-${item.step}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-white/[0.08] border border-white/[0.12] text-white/80">
                    {item.icon}
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-wider text-white/60">{item.step}</span>
                </div>

                <h3 className="font-brand text-lg font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed mb-5">{item.desc}</p>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#C4A962]/90">
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  <span>{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4" data-testid="section-community-launch">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-brand font-bold text-2xl sm:text-3xl uppercase gold-gradient text-center mb-4">
            Community Token Launch
          </h2>
          <p className="text-sm text-white/60 text-center mb-14 font-mono max-w-xl mx-auto">
            Launch tokens that fuel the $ADCLAW ecosystem
          </p>

          <div className="glass-panel rounded-xl border border-white/[0.10] p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="w-5 h-5 text-[#C4A962]" />
                  <h3 className="font-brand text-lg font-bold text-white uppercase tracking-wide" data-testid="text-launch-heading">
                    Your Launch Powers the Ecosystem
                  </h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-6" data-testid="text-launch-description">
                  Every community token you launch through AdClaw directly strengthens the $ADCLAW ecosystem. 
                  Our autonomous AI agents immediately begin promoting your token across X, Telegram, Discord, and Reddit — 
                  while every launch fee goes directly to automatic $ADCLAW market buyback. No middlemen, no dev wallet, fully on-chain.
                </p>
                <p className="text-xs text-[#C4A962]/90 font-mono mb-8 leading-relaxed" data-testid="text-launch-key-point">
                  Every community token launch fee goes directly to automatic $ADCLAW market buyback
                </p>
                <div>
                  <Link href="/forge">
                    <button
                      className="flex items-center gap-2 bg-white/[0.08] text-white/90 font-medium rounded-lg px-6 py-3 text-sm transition-all duration-200 hover:bg-white/[0.1] border border-white/[0.14] hover:border-white/[0.22]"
                      data-testid="button-launch-token-community"
                    >
                      <Rocket className="w-4 h-4" />
                      Launch Your Token
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl p-5 border border-[#C4A962]/15 bg-[#C4A962]/[0.04]" data-testid="card-benefit-buyback">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#C4A962]/[0.1] border border-[#C4A962]/20">
                      <TrendingUp className="w-4 h-4 text-[#C4A962]" />
                    </div>
                    <h4 className="font-brand text-sm font-bold text-white uppercase tracking-wide">100% Fee &rarr; Buyback</h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed pl-12">
                    Every SOL spent on launches buys $ADCLAW from the open market
                  </p>
                </div>

                <div className="rounded-xl p-5 border border-[#8A9AAD]/15 bg-[#8A9AAD]/[0.04]" data-testid="card-benefit-promotion">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#8A9AAD]/[0.1] border border-[#8A9AAD]/20">
                      <Users className="w-4 h-4 text-[#8A9AAD]" />
                    </div>
                    <h4 className="font-brand text-sm font-bold text-white uppercase tracking-wide">Full Swarm Promotion</h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed pl-12">
                    Your token gets promoted across X, Telegram, Discord, and Reddit
                  </p>
                </div>

                <div className="rounded-xl p-5 border border-[#6B7B8D]/15 bg-[#6B7B8D]/[0.04]" data-testid="card-benefit-nocode">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#6B7B8D]/[0.1] border border-[#6B7B8D]/20">
                      <Zap className="w-4 h-4 text-[#6B7B8D]" />
                    </div>
                    <h4 className="font-brand text-sm font-bold text-white uppercase tracking-wide">1-Click, No Code</h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed pl-12">
                    Launch in seconds. No technical knowledge required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4" data-testid="section-why-adclaw">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-brand font-bold text-2xl sm:text-3xl uppercase gold-gradient text-center mb-4">
            Why AdClaw
          </h2>
          <p className="text-sm text-white/60 text-center mb-14 font-mono max-w-lg mx-auto">
            Real infrastructure, not another meme tool
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: "No Dev Wallet",
                desc: "Zero tokens held by the team. All fees go directly to open market buybacks — fully verifiable on-chain.",
                icon: <Shield className="w-4.5 h-4.5" />,
              },
              {
                title: "Autonomous 24/7",
                desc: "AI agents never sleep. They promote your token around the clock across multiple platforms simultaneously.",
                icon: <Bot className="w-4.5 h-4.5" />,
              },
              {
                title: "Transparent Buybacks",
                desc: "Every buyback is logged, timestamped, and visible. Watch the $ADCLAW supply shrink in real-time.",
                icon: <Eye className="w-4.5 h-4.5" />,
              },
              {
                title: "Multi-Platform Reach",
                desc: "Agents deploy across X, Telegram, Discord, and Reddit. Maximum exposure, minimum effort.",
                icon: <Zap className="w-4.5 h-4.5" />,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-panel rounded-xl p-6 border border-white/[0.10] hover:border-white/[0.18] transition-all duration-300"
                data-testid={`card-why-${item.title.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.08] border border-white/[0.12] text-white/70 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-brand text-base font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-white/[0.10]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="font-brand font-extrabold text-[28px] tracking-tight uppercase text-white" data-testid="text-footer-brand">ADCLAW</span>
          </div>
          <p className="text-xs text-white/60 mb-2">
            1-click token launch with autonomous AI agent promotion on Solana.
          </p>
          <p className="text-[10px] text-white/60 font-mono">
            All fees → $ADCLAW buyback. No dev wallet. Fully transparent.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="https://x.com/adclawonsol" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white/80 transition-colors text-xs font-mono" data-testid="link-footer-twitter">Twitter</a>
            <span className="text-white/40">|</span>
            <a href="https://github.com/adclaw" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white/80 transition-colors text-xs font-mono" data-testid="link-footer-github">GitHub</a>
            <span className="text-white/40">|</span>
            <a href="https://adclaw.io" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white/80 transition-colors text-xs font-mono" data-testid="link-footer-adclaw">AdClaw</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
