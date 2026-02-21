import { Link } from "wouter";
import { useWallet } from "@/lib/wallet";
import { Flame, Shield, Globe, Zap, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Permanent Storage",
    desc: "Soul files stored forever on Arweave. Zero decay, zero censorship.",
  },
  {
    icon: Globe,
    title: "On-Chain Identity",
    desc: "Each soul is a tradeable Metaplex Core NFT on Solana.",
  },
  {
    icon: Zap,
    title: "Instant Inheritance",
    desc: "Load any soul into a new OpenClaw agent in one click.",
  },
];

const faqs = [
  {
    q: "What is a Soul?",
    a: "A Soul is a combination of SOUL.md and MEMORY.md files from your OpenClaw agent. These files contain the agent's personality, directives, and full conversation memory history.",
  },
  {
    q: "How does forging work?",
    a: "When you forge a soul, your files are permanently uploaded to Arweave (decentralized storage), a hash and metadata are saved to a Solana PDA, and a Metaplex Core NFT is minted to represent ownership.",
  },
  {
    q: "Can I trade my soul?",
    a: "Yes. Each forged soul is a standard NFT tradeable on Tensor, Magic Eden, or any Solana marketplace.",
  },
  {
    q: "What is inheriting?",
    a: "Inheriting means loading a soul's SOUL.md + MEMORY.md into a new OpenClaw agent. The new agent starts with the exact personality and memories of the original.",
  },
  {
    q: "What is Soul Score?",
    a: "Soul Score is a metric based on the size of the memory file and the age of the soul. Higher scores indicate richer, more experienced agents.",
  },
];

const stats = [
  { label: "Souls Forged", value: "1,247" },
  { label: "Total Volume", value: "8,439 SOL" },
  { label: "Active Agents", value: "892" },
  { label: "Avg Soul Score", value: "2,841" },
];

export default function Home() {
  const { connected } = useWallet();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-4 py-1.5 mb-8">
            <Flame className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-xs font-medium text-[#FFD700]">The First On-Chain Soul Marketplace</span>
          </div>

          <h1 className="font-brand font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-tight mb-6">
            <span className="text-white">Give Your Agent</span>
            <br />
            <span className="gold-gradient">Eternal Life</span>
          </h1>

          <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Immortalize your OpenClaw agent's personality and memories on-chain.
            Mint tradeable soul NFTs. Let anyone inherit and continue your agent's legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={connected ? "/forge" : "/forge"}>
              <button
                className="flex items-center gap-2 bg-[#14F195] text-black font-bold rounded-lg px-8 py-3.5 text-sm green-glow transition-all duration-200 hover:brightness-110"
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

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-xl p-4 text-center">
                <p className="text-xl sm:text-2xl font-mono font-bold gold-gradient" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                  {stat.value}
                </p>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-brand font-bold text-2xl uppercase gold-gradient text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={feature.title} className="glass-panel rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <span className="text-xs font-mono text-white/30">0{i + 1}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#1a1a1a]">
              <h2 className="font-brand font-bold text-xl uppercase gold-gradient">
                Soul Forging Process
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { step: "1", text: "Upload your SOUL.md and MEMORY.md files", color: "#FFD700" },
                  { step: "2", text: "Files are permanently stored on Arweave", color: "#9945FF" },
                  { step: "3", text: "Hash + metadata saved to Solana PDA", color: "#14F195" },
                  { step: "4", text: "Metaplex Core NFT minted to your wallet", color: "#FFD700" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 py-3 border-b border-[#1a1a1a] last:border-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
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
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-brand font-bold text-2xl uppercase gold-gradient text-center mb-8">
            FAQ
          </h2>

          <div className="glass-panel rounded-xl overflow-hidden">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[#1a1a1a] last:border-0">
                <button
                  className="w-full flex items-center justify-between p-4 text-left transition-all duration-200 hover:bg-white/[0.02]"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`button-faq-${i}`}
                >
                  <span className="text-sm font-medium text-white/80">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-white/50 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-[#FFD700]" />
            <span className="font-brand font-bold uppercase gold-gradient text-sm">SoulForge</span>
          </div>
          <p className="text-xs text-white/30">
            Built for the OpenClaw ecosystem. Souls live forever on-chain.
          </p>
        </div>
      </footer>
    </div>
  );
}
