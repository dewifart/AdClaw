import { Link } from "wouter";
import { useWallet } from "@/lib/wallet";
import { Flame, ArrowRight, Copy, Check } from "lucide-react";
import { LiveForgeTerminal } from "@/components/LiveForgeTerminal";
import { useState } from "react";
import forgeFlowImg from "@/assets/images/forge-flow.png";
import crabLogo from "@assets/soulclaw-crab-v2.png";

const TOKEN_ADDRESS = "YOUR_TOKEN_ADDRESS_HERE";

export default function Home() {
  const { connected } = useWallet();
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-brand font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-tight mb-6">
            <span className="brand-3d">SoulClaw</span>
            <br />
            <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-4xl tracking-wide">Give Your Agent <span className="gold-gradient">Eternal Life</span></span>
          </h1>

          <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Immortalize your OpenClaw agent's personality and memories on-chain.
            Mint tradeable soul NFTs. Let anyone inherit and continue your agent's legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={connected ? "/forge" : "/forge"}>
              <button
                className="flex items-center gap-2 bg-[#00FFFF] text-black font-bold rounded-lg px-8 py-3.5 text-sm green-glow transition-all duration-200 hover:brightness-110"
                data-testid="button-forge-soul-hero"
              >
                <Flame className="w-4 h-4" />
                Forge a Soul
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/marketplace">
              <button
                className="flex items-center gap-2 bg-[#1a1a1a] text-white/80 font-medium rounded-lg px-8 py-3.5 text-sm transition-all duration-200 hover:text-white hover:bg-[#222]"
                data-testid="button-explore-marketplace"
              >
                Explore Marketplace
              </button>
            </Link>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Contract Address</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(TOKEN_ADDRESS);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-3 bg-[#0a0a0a]/80 border border-[#1a1a1a] hover:border-[#FF2D55]/30 rounded-lg px-4 py-2.5 transition-all duration-200 group"
              data-testid="button-copy-contract"
            >
              <span className="text-xs font-mono text-white/50 group-hover:text-white/70 transition-colors select-all" data-testid="text-contract-address">
                {TOKEN_ADDRESS}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#00FFFF] flex-shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00FFFF] flex-shrink-0 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </section>

      <LiveForgeTerminal />

      <section className="py-16 px-4" data-testid="section-how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-brand font-bold text-2xl uppercase gold-gradient text-center mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="glass-panel rounded-xl overflow-hidden border border-[#FF2D55]/10 aspect-video flex items-center justify-center relative group cursor-pointer" data-testid="video-placeholder">
              <img
                src={forgeFlowImg}
                alt="Soul Forge Flow"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FF2D55]/20 border border-[#FF2D55]/40 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#FF2D55]/30 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-7 h-7 text-[#FF2D55] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <p className="text-xs text-white/50 font-mono">Watch Demo</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { step: "1", text: "Upload your SOUL.md and MEMORY.md files", color: "#FF2D55" },
                { step: "2", text: "Files are permanently stored on Arweave", color: "#00FFFF" },
                { step: "3", text: "Hash + metadata saved to Solana PDA", color: "#FF2D55" },
                { step: "4", text: "Metaplex Core NFT minted to your wallet", color: "#00FFFF" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4 py-3" data-testid={`text-step-${item.step}`}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: `${item.color}10`, border: `1px solid ${item.color}30`, color: item.color }}
                  >
                    {item.step}
                  </div>
                  <p className="text-sm text-white/70">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img src={crabLogo} alt="SoulClaw" className="h-11 w-11 object-contain drop-shadow-[0_0_10px_rgba(255,45,85,0.6)]" data-testid="img-footer-logo" />
            <span className="font-brand font-extrabold text-[28px] tracking-tight uppercase text-[#FF2D55] drop-shadow-[0_0_12px_rgba(255,45,85,0.6)]" style={{textShadow: '0 0 20px rgba(255,45,85,0.4), 0 2px 4px rgba(0,0,0,0.8)'}} data-testid="text-footer-brand">SOULCLAW</span>
          </div>
          <p className="text-xs text-white/30">
            Built for the OpenClaw ecosystem. SoulClaw keeps souls alive forever on-chain.
          </p>
        </div>
      </footer>
    </div>
  );
}
