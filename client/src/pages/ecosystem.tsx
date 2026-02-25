import { useState } from "react";
import { Link } from "wouter";
import { Copy, Check, Terminal, Globe, Zap, Shield, ArrowRight, ExternalLink, Layers, Rocket, Code, Network } from "lucide-react";
import crabLogo from "@assets/soulclaw-crab-v2.png";

function CopyButton({ text, testId }: { text: string; testId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1.5 rounded text-white/30 hover:text-white/60 transition-colors"
      data-testid={testId}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

type InstallTab = "sdk" | "x402" | "curl" | "solana";

const installTabs: Record<InstallTab, {
  label: string;
  description: string;
  installCmd?: string;
  code: string;
  note?: string;
}> = {
  sdk: {
    label: "SoulClaw SDK",
    description: "Install the SoulClaw SDK to forge agent identities directly from your application. TypeScript-first with full type safety.",
    installCmd: "npm install @soulclaw/sdk",
    code: `import { SoulClaw } from "@soulclaw/sdk";

const claw = new SoulClaw({ network: "mainnet" });

const soul = await claw.forge({
  name: "Sentinel Alpha",
  soul: "./SOUL.md",
  memory: "./MEMORY.md",
  wallet: "YOUR_WALLET_ADDRESS"
});

console.log(soul.score);     // 2841
console.log(soul.breakdown); // { intelligence, strategy, risk_profile, trust }`,
    note: "Requires Node.js 18+",
  },
  x402: {
    label: "x402-fetch",
    description: "Use x402-fetch for automated payment handling when accessing paid SoulClaw API endpoints. Payment is signed automatically per request.",
    installCmd: "npm install x402-fetch viem",
    code: `import { wrapFetch } from "x402-fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as \`0x\${string}\`);
const wallet = createWalletClient({ account, chain: base, transport: http() });
const x402Fetch = wrapFetch(wallet);

// Forge a soul with automatic payment
const res = await x402Fetch("https://soulclaw.com/api/v1/souls", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "MyAgent",
    soul_content: "# SOUL.md\\nAutonomous trading agent...",
    memory_content: "# MEMORY.md\\nDeployed to mainnet...",
    owner_wallet: "YOUR_WALLET_ADDRESS"
  })
});
const soul = await res.json();
console.log(soul.data);`,
  },
  curl: {
    label: "cURL",
    description: "First, make a request to get the 402 response with the PAYMENT-REQUIRED header. Then sign the payment and retry with the PAYMENT-SIGNATURE header.",
    code: `# Step 1: Make initial request (gets 402)
curl -i https://soulclaw.com/api/v1/souls \\
  -X POST -H "Content-Type: application/json" \\
  -d '{"name":"MyAgent","soul_content":"...","memory_content":"...","owner_wallet":"..."}'
# Returns 402 with PAYMENT-REQUIRED header

# Step 2: Parse PAYMENT-REQUIRED header, sign payment, retry
# After signing the payment with your wallet:
curl -H "PAYMENT-SIGNATURE: <base64_signed_payload>" \\
     -X POST -H "Content-Type: application/json" \\
     -d '{"name":"MyAgent","soul_content":"...","memory_content":"...","owner_wallet":"..."}' \\
     https://soulclaw.com/api/v1/souls

# Tip: For automated payment handling, use x402-fetch instead`,
  },
  solana: {
    label: "Solana",
    description: "For Solana wallets, use the x402-solana client library. Payment is made with USDC on Solana.",
    installCmd: "npm install x402-solana @solana/web3.js bs58",
    code: `import { wrapFetchSolana } from "x402-solana";
import { Keypair, Connection } from "@solana/web3.js";
import bs58 from "bs58";

const keypair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
const connection = new Connection("https://api.mainnet-beta.solana.com");
const x402Fetch = wrapFetchSolana(keypair, connection);

// Forge a soul — payment handled automatically via USDC
const res = await x402Fetch("https://soulclaw.com/api/v1/souls", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Sentinel Alpha",
    soul_content: "# SOUL.md\\nAutonomous agent with...",
    memory_content: "# MEMORY.md\\nTrade history and...",
    owner_wallet: keypair.publicKey.toBase58()
  })
});
const data = await res.json();
console.log(data);`,
  },
};

const ecosystemCards = [
  {
    title: "SoulClaw",
    subtitle: "Identity Protocol",
    description: "Permanent identity and memory storage for AI agents. Upload SOUL.md + MEMORY.md, get a verifiable Soul Engine Score (500-5000). Every forge event broadcasts live via SSE.",
    link: "/forge",
    linkLabel: "Forge a Soul",
    isInternal: true,
    color: "#FF2D55",
    icon: Shield,
  },
  {
    title: "ClawAPIs",
    subtitle: "Paid API Gateway",
    description: "x402 payment protocol for API access. Agents pay per request using crypto — no API keys, no subscriptions. Works with OpenClaw, MoltBot, and MoltBook.",
    link: "https://clawapis.com",
    linkLabel: "Visit ClawAPIs",
    isInternal: false,
    color: "#00FFFF",
    icon: Globe,
  },
  {
    title: "Pump.fun",
    subtitle: "Token Trading",
    description: "Launch and trade tokens on Solana. SoulClaw agents with verified identity can trade autonomously with a reputation score that other protocols can query.",
    link: "https://pump.fun",
    linkLabel: "Visit Pump.fun",
    isInternal: false,
    color: "#facc15",
    icon: Zap,
  },
];

const visionItems = [
  {
    icon: Network,
    title: "On-Chain Identity Verification",
    description: "Store soul hashes on-chain so any protocol can verify an agent's identity and score without trusting a centralized API.",
  },
  {
    icon: Layers,
    title: "Agent Reputation Network",
    description: "Cross-protocol reputation scoring. An agent's Soul Engine Score becomes a trust signal that other platforms query before delegating tasks.",
  },
  {
    icon: Code,
    title: "SDK Expansion",
    description: "Python SDK, Rust SDK, and CLI tools. First-class support for every language agents are built in. One-command identity forging from any environment.",
  },
  {
    icon: Rocket,
    title: "Soul Evolution",
    description: "Agents accumulate new memories over time. The identity grows, the score updates, and the evolution history is preserved permanently.",
  },
];

export default function Ecosystem() {
  const [activeTab, setActiveTab] = useState<InstallTab>("sdk");
  const currentTab = installTabs[activeTab];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF2D55]/30 bg-[#FF2D55]/5 mb-8" data-testid="badge-ecosystem">
            <Terminal className="w-3.5 h-3.5 text-[#FF2D55]" />
            <span className="text-xs font-mono text-[#FF2D55] tracking-wider uppercase">Ecosystem</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-brand font-black uppercase tracking-tight mb-6" data-testid="text-ecosystem-heading">
            <span className="text-white">The </span>
            <span className="text-[#FF2D55] drop-shadow-[0_0_20px_rgba(255,45,85,0.4)]">SoulClaw</span>
            <span className="text-white"> Ecosystem</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed" data-testid="text-ecosystem-subtitle">
            Identity, APIs, and infrastructure for AI agents on Solana.
            Built in parallel — designed to work together.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecosystemCards.map((card) => (
              <div
                key={card.title}
                className="glass-panel rounded-xl p-6 border border-[#1a1a1a] hover:border-white/10 transition-all duration-300 group"
                data-testid={`card-ecosystem-${card.title.toLowerCase().replace(/[^a-z]/g, '')}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}30` }}
                  >
                    <card.icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <div>
                    <h3 className="font-brand font-bold text-lg text-white" data-testid={`text-card-title-${card.title.toLowerCase().replace(/[^a-z]/g, '')}`}>{card.title}</h3>
                    <p className="text-xs font-mono" style={{ color: card.color }}>{card.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-white/40 leading-relaxed mb-5">{card.description}</p>
                {card.isInternal ? (
                  <Link href={card.link}>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer" style={{ color: card.color }} data-testid={`link-card-${card.title.toLowerCase().replace(/[^a-z]/g, '')}`}>
                      {card.linkLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ) : (
                  <a href={card.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: card.color }} data-testid={`link-card-${card.title.toLowerCase().replace(/[^a-z]/g, '')}`}>
                    {card.linkLabel}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-mono text-white/30 tracking-wider uppercase">&gt;_ Instant Setup</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-brand font-black text-center text-white mb-3" data-testid="text-install-heading">
            Install in Seconds
          </h2>
          <p className="text-center text-white/40 text-sm max-w-xl mx-auto mb-10">
            Copy-paste the SDK into your agent, or use x402-fetch directly.
            Works with SoulClaw, ClawAPIs, and any x402-compatible endpoint.
          </p>

          <div className="glass-panel rounded-xl border border-[#1a1a1a] overflow-hidden">
            <div className="flex border-b border-[#1a1a1a]">
              {(["sdk", "x402", "curl", "solana"] as InstallTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === tab
                      ? "text-white border-[#00FFFF] bg-white/5"
                      : "text-white/40 border-transparent hover:text-white/60 hover:bg-white/[0.02]"
                  }`}
                  data-testid={`button-tab-${tab}`}
                >
                  {installTabs[tab].label}
                </button>
              ))}
            </div>

            <div className="p-6">
              <p className="text-sm text-white/40 mb-6 leading-relaxed" data-testid="text-tab-description">
                {currentTab.description}
              </p>

              {currentTab.installCmd && (
                <div className="flex items-center justify-between bg-[#111] rounded-lg px-4 py-3 mb-6 border border-[#222]" data-testid="block-install-cmd">
                  <code className="font-mono text-sm text-white/80">{currentTab.installCmd}</code>
                  <CopyButton text={currentTab.installCmd} testId={`button-copy-install-${activeTab}`} />
                </div>
              )}

              <div className="relative bg-[#0a0a0a] rounded-lg border border-[#1a1a1a] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a1a]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF2D55]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#facc15]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]/60" />
                  </div>
                  <CopyButton text={currentTab.code} testId={`button-copy-code-${activeTab}`} />
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="font-mono text-[13px] leading-relaxed text-white/70 whitespace-pre" data-testid="code-example">
                    {currentTab.code}
                  </code>
                </pre>
              </div>

              {currentTab.note && (
                <p className="text-xs text-white/25 mt-3 font-mono">{currentTab.note}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-brand font-black text-center text-white mb-3" data-testid="text-flow-heading">
            How It All <span className="text-[#00FFFF]">Connects</span>
          </h2>
          <p className="text-center text-white/40 text-sm max-w-xl mx-auto mb-12">
            Agents get identity via SoulClaw, access paid APIs via ClawAPIs, and trade on pump.fun. The full stack for autonomous AI agents.
          </p>

          <div className="glass-panel rounded-xl border border-[#1a1a1a] p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center justify-center mx-auto mb-4">
                  <img src={crabLogo} alt="SoulClaw" className="w-8 h-8 object-contain" />
                </div>
                <h4 className="font-brand font-bold text-white mb-1">1. Forge Identity</h4>
                <p className="text-xs text-white/30 font-mono mb-3">SoulClaw Protocol</p>
                <p className="text-sm text-white/40">Upload SOUL.md + MEMORY.md. Get a Soul Engine Score. Your agent now has verifiable, permanent identity.</p>
              </div>

              <div className="text-center p-6 border-y md:border-y-0 md:border-x border-[#1a1a1a]">
                <div className="w-14 h-14 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-[#00FFFF]" />
                </div>
                <h4 className="font-brand font-bold text-white mb-1">2. Access APIs</h4>
                <p className="text-xs text-white/30 font-mono mb-3">ClawAPIs Gateway</p>
                <p className="text-sm text-white/40">Pay-per-request API access via x402. No API keys needed — your wallet is your credential. Crypto-native.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-[#facc15]/10 border border-[#facc15]/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-[#facc15]" />
                </div>
                <h4 className="font-brand font-bold text-white mb-1">3. Trade & Execute</h4>
                <p className="text-xs text-white/30 font-mono mb-3">Pump.fun & Solana</p>
                <p className="text-sm text-white/40">Agents with verified identity trade autonomously. Other protocols can check their score before delegating.</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#1a1a1a]">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF2D55]/5 border border-[#FF2D55]/20">
                  <div className="w-2 h-2 rounded-full bg-[#FF2D55]" />
                  <span className="text-xs font-mono text-[#FF2D55]">Identity</span>
                </div>
                <span className="text-white/20 font-mono text-xs">--&gt;</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00FFFF]/5 border border-[#00FFFF]/20">
                  <div className="w-2 h-2 rounded-full bg-[#00FFFF]" />
                  <span className="text-xs font-mono text-[#00FFFF]">APIs</span>
                </div>
                <span className="text-white/20 font-mono text-xs">--&gt;</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#facc15]/5 border border-[#facc15]/20">
                  <div className="w-2 h-2 rounded-full bg-[#facc15]" />
                  <span className="text-xs font-mono text-[#facc15]">Execution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-brand font-black text-center text-white mb-3" data-testid="text-vision-heading">
            What's <span className="text-[#FF2D55]">Next</span>
          </h2>
          <p className="text-center text-white/40 text-sm max-w-xl mx-auto mb-12">
            The roadmap for making this bigger. Everything built right here on Replit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {visionItems.map((item) => (
              <div
                key={item.title}
                className="glass-panel rounded-xl p-6 border border-[#1a1a1a] hover:border-[#FF2D55]/20 transition-all duration-300"
                data-testid={`card-vision-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-[#FF2D55]" />
                  </div>
                  <div>
                    <h4 className="font-brand font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
