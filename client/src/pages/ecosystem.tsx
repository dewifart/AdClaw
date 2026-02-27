import { useState } from "react";
import { Link } from "wouter";
import { Copy, Check, Terminal, Globe, Zap, Shield, ArrowRight, ExternalLink, Layers, Rocket, Code, Network } from "lucide-react";

function CopyButton({ text, testId }: { text: string; testId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1.5 rounded text-white/60 hover:text-white/65 transition-colors"
      data-testid={testId}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#8A9AAD]" /> : <Copy className="w-3.5 h-3.5" />}
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
    label: "AdClaw SDK",
    description: "Install the AdClaw SDK to launch tokens and deploy agents directly from your application. TypeScript-first with full type safety.",
    installCmd: "npm install @adclaw/sdk",
    code: `import { AdClaw } from "@adclaw/sdk";

const claw = new AdClaw({ network: "mainnet" });

const token = await claw.launch({
  name: "Sentinel Alpha",
  ticker: "SENT",
  config: "./AGENT.md",
  wallet: "YOUR_WALLET_ADDRESS"
});

console.log(token.agents);   // 6 agents assigned
console.log(token.buyback);  // { fee: 0.5, target: "$ADCLAW" }`,
    note: "Requires Node.js 18+",
  },
  x402: {
    label: "x402-fetch",
    description: "Use x402-fetch for automated payment handling when accessing paid AdClaw API endpoints. Payment is signed automatically per request.",
    installCmd: "npm install x402-fetch viem",
    code: `import { wrapFetch } from "x402-fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as \`0x\${string}\`);
const wallet = createWalletClient({ account, chain: base, transport: http() });
const x402Fetch = wrapFetch(wallet);

// Launch a token with automatic payment
const res = await x402Fetch("https://adclaw.com/api/v1/tokens", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "MyToken",
    ticker: "MYTK",
    description: "Community token for ecosystem growth",
    owner_wallet: "YOUR_WALLET_ADDRESS"
  })
});
const token = await res.json();
console.log(token.data);`,
  },
  curl: {
    label: "cURL",
    description: "First, make a request to get the 402 response with the PAYMENT-REQUIRED header. Then sign the payment and retry with the PAYMENT-SIGNATURE header.",
    code: `# Step 1: Make initial request (gets 402)
curl -i https://adclaw.com/api/v1/tokens \\
  -X POST -H "Content-Type: application/json" \\
  -d '{"name":"MyToken","ticker":"MYTK","description":"...","owner_wallet":"..."}'
# Returns 402 with PAYMENT-REQUIRED header

# Step 2: Parse PAYMENT-REQUIRED header, sign payment, retry
# After signing the payment with your wallet:
curl -H "PAYMENT-SIGNATURE: <base64_signed_payload>" \\
     -X POST -H "Content-Type: application/json" \\
     -d '{"name":"MyToken","ticker":"MYTK","description":"...","owner_wallet":"..."}' \\
     https://adclaw.com/api/v1/tokens

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

// Launch a token — payment handled automatically via USDC
const res = await x402Fetch("https://adclaw.com/api/v1/tokens", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Sentinel Alpha",
    ticker: "SENT",
    description: "Community token promoting $ADCLAW ecosystem",
    owner_wallet: keypair.publicKey.toBase58()
  })
});
const data = await res.json();
console.log(data);`,
  },
};

const ecosystemCards = [
  {
    title: "AdClaw",
    subtitle: "Token Launch Protocol",
    description: "1-click community token launch with autonomous AI agent promotion. All launch fees go to automatic $ADCLAW buyback. Every launch event broadcasts live via SSE.",
    link: "/forge",
    linkLabel: "Launch a Token",
    isInternal: true,
    color: "#6B7B8D",
    icon: Shield,
  },
  {
    title: "AdClaw APIs",
    subtitle: "Paid API Gateway",
    description: "x402 payment protocol for API access. Agents pay per request using crypto — no API keys, no subscriptions. Works with AdClaw, MoltBot, and MoltBook.",
    link: "https://adclaw.com/apis",
    linkLabel: "Visit AdClaw APIs",
    isInternal: false,
    color: "#8A9AAD",
    icon: Globe,
  },
  {
    title: "Pump.fun",
    subtitle: "Token Trading",
    description: "Launch and trade tokens on Solana. AdClaw agents with verified identity can trade autonomously with a reputation score that other protocols can query.",
    link: "https://pump.fun",
    linkLabel: "Visit Pump.fun",
    isInternal: false,
    color: "#9BA8B5",
    icon: Zap,
  },
];

const visionItems = [
  {
    icon: Network,
    title: "On-Chain Identity Verification",
    description: "Store agent hashes on-chain so any protocol can verify an agent's identity and score without trusting a centralized API.",
  },
  {
    icon: Layers,
    title: "Agent Reputation Network",
    description: "Cross-protocol reputation scoring. An agent's Engine Score becomes a trust signal that other platforms query before delegating tasks.",
  },
  {
    icon: Code,
    title: "SDK Expansion",
    description: "Python SDK, Rust SDK, and CLI tools. First-class support for every language agents are built in. One-command token launch from any environment.",
  },
  {
    icon: Rocket,
    title: "Agent Evolution",
    description: "Agents accumulate new strategies over time. The promotion capability grows, the score updates, and the evolution history is preserved permanently.",
  },
];

export default function Ecosystem() {
  const [activeTab, setActiveTab] = useState<InstallTab>("sdk");
  const currentTab = installTabs[activeTab];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6B7B8D]/30 bg-[#6B7B8D]/5 mb-8" data-testid="badge-ecosystem">
            <Terminal className="w-3.5 h-3.5 text-[#6B7B8D]" />
            <span className="text-xs font-mono text-[#6B7B8D] tracking-wider uppercase">Ecosystem</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-brand font-black uppercase tracking-tight mb-6" data-testid="text-ecosystem-heading">
            <span className="text-white">The </span>
            <span className="text-[#8A9AAD]">AdClaw</span>
            <span className="text-white"> Ecosystem</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed" data-testid="text-ecosystem-subtitle">
            Identity, APIs, and infrastructure for AI agents on Solana.
            Built in parallel — designed to work together.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-mono text-white/60 tracking-wider uppercase">&gt;_ Instant Setup</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-brand font-black text-center text-white mb-3" data-testid="text-install-heading">
            Install in Seconds
          </h2>
          <p className="text-center text-white/60 text-sm max-w-xl mx-auto mb-10">
            Copy-paste the SDK into your agent, or use x402-fetch directly.
            Works with AdClaw and any x402-compatible endpoint.
          </p>

          <div className="glass-panel rounded-xl border border-white/[0.10] overflow-hidden">
            <div className="flex border-b border-white/[0.10]">
              {(["sdk", "x402", "curl", "solana"] as InstallTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === tab
                      ? "text-white border-[#6B7B8D] bg-white/5"
                      : "text-white/60 border-transparent hover:text-white/65 hover:bg-white/[0.02]"
                  }`}
                  data-testid={`button-tab-${tab}`}
                >
                  {installTabs[tab].label}
                </button>
              ))}
            </div>

            <div className="p-6">
              <p className="text-sm text-white/60 mb-6 leading-relaxed" data-testid="text-tab-description">
                {currentTab.description}
              </p>

              {currentTab.installCmd && (
                <div className="flex items-center justify-between bg-[#111] rounded-lg px-4 py-3 mb-6 border border-[#222]" data-testid="block-install-cmd">
                  <code className="font-mono text-sm text-white/80">{currentTab.installCmd}</code>
                  <CopyButton text={currentTab.installCmd} testId={`button-copy-install-${activeTab}`} />
                </div>
              )}

              <div className="relative bg-[#0a0a0a] rounded-lg border border-white/[0.10] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.10]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
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
                <p className="text-xs text-white/55 mt-3 font-mono">{currentTab.note}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-brand font-black text-center text-white mb-3" data-testid="text-flow-heading">
            How It All <span className="text-[#8A9AAD]">Connects</span>
          </h2>
          <p className="text-center text-white/60 text-sm max-w-xl mx-auto mb-12">
            Agents get identity via AdClaw, access paid APIs via AdClaw APIs, and trade on pump.fun. The full stack for autonomous AI agents.
          </p>

          <div className="glass-panel rounded-xl border border-white/[0.10] p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-[#6B7B8D]" />
                </div>
                <h4 className="font-brand font-bold text-white mb-1">1. Launch Token</h4>
                <p className="text-xs text-white/60 font-mono mb-3">AdClaw Protocol</p>
                <p className="text-sm text-white/60">Launch your community token in 1 click. Agents are assigned automatically. Fees go to $ADCLAW buyback.</p>
              </div>

              <div className="text-center p-6 border-y md:border-y-0 md:border-x border-white/[0.10]">
                <div className="w-14 h-14 rounded-xl bg-[#8A9AAD]/10 border border-[#8A9AAD]/20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-[#8A9AAD]" />
                </div>
                <h4 className="font-brand font-bold text-white mb-1">2. Access APIs</h4>
                <p className="text-xs text-white/60 font-mono mb-3">AdClaw APIs Gateway</p>
                <p className="text-sm text-white/60">Pay-per-request API access via x402. No API keys needed — your wallet is your credential. Crypto-native.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-[#9BA8B5]/10 border border-[#9BA8B5]/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-[#9BA8B5]" />
                </div>
                <h4 className="font-brand font-bold text-white mb-1">3. Trade & Execute</h4>
                <p className="text-xs text-white/60 font-mono mb-3">Pump.fun & Solana</p>
                <p className="text-sm text-white/60">Agents with verified identity promote and trade autonomously. Other protocols can check their score before delegating.</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.10]">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6B7B8D]/5 border border-[#6B7B8D]/20">
                  <div className="w-2 h-2 rounded-full bg-[#6B7B8D]" />
                  <span className="text-xs font-mono text-[#6B7B8D]">Identity</span>
                </div>
                <span className="text-white/50 font-mono text-xs">--&gt;</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8A9AAD]/5 border border-[#8A9AAD]/20">
                  <div className="w-2 h-2 rounded-full bg-[#8A9AAD]" />
                  <span className="text-xs font-mono text-[#8A9AAD]">APIs</span>
                </div>
                <span className="text-white/50 font-mono text-xs">--&gt;</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#9BA8B5]/5 border border-[#9BA8B5]/20">
                  <div className="w-2 h-2 rounded-full bg-[#9BA8B5]" />
                  <span className="text-xs font-mono text-[#9BA8B5]">Execution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-brand font-black text-center text-white mb-3" data-testid="text-vision-heading">
            What's <span className="text-[#8A9AAD]">Next</span>
          </h2>
          <p className="text-center text-white/60 text-sm max-w-xl mx-auto mb-12">
            The roadmap for making this bigger. Everything built right here on Replit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {visionItems.map((item) => (
              <div
                key={item.title}
                className="glass-panel rounded-xl p-6 border border-white/[0.10] hover:border-[#6B7B8D]/20 transition-all duration-300"
                data-testid={`card-vision-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-[#6B7B8D]" />
                  </div>
                  <div>
                    <h4 className="font-brand font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
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
