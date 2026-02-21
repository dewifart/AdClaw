import { Link } from "wouter";
import { useWallet } from "@/lib/wallet";
import { Flame, ArrowRight } from "lucide-react";
import { LiveForgeTerminal } from "@/components/LiveForgeTerminal";
import forgeFlowImg from "@/assets/images/forge-flow.png";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF2D55]/10 border border-[#FF2D55]/20 rounded-full px-4 py-1.5 mb-8">
            <Flame className="w-3.5 h-3.5 text-[#FF2D55]" />
            <span className="text-xs font-medium text-[#FF2D55]">The First On-Chain Soul Marketplace by SoulClaw</span>
          </div>

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
        </div>
      </section>

      <LiveForgeTerminal />

      <section className="py-16 px-4" data-testid="section-how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-brand font-bold text-2xl uppercase gold-gradient text-center mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-start">
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

            <div className="glass-panel rounded-xl overflow-hidden border border-[#FF2D55]/10" data-testid="img-forge-flow">
              <img
                src={forgeFlowImg}
                alt="Soul Forge Flow"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-[#FF2D55]" />
            <span className="font-brand font-extrabold uppercase brand-3d-sm text-sm">SoulClaw</span>
          </div>
          <p className="text-xs text-white/30">
            Built for the OpenClaw ecosystem. SoulClaw keeps souls alive forever on-chain.
          </p>
        </div>
      </footer>
    </div>
  );
}
