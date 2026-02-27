import { Link } from "wouter";
import { useWallet } from "@/lib/wallet";
import { Flame, ArrowRight, Copy, Check, Terminal, Shield, Zap, Eye, Code, ChevronRight } from "lucide-react";
import { LiveForgeTerminal } from "@/components/LiveForgeTerminal";
import { useState } from "react";

type InstallTab = "npm" | "yarn" | "curl" | "powershell";

const installCommands: Record<InstallTab, { label: string; prompt: string; command: string; note?: string }> = {
  npm: {
    label: "npm",
    prompt: "$",
    command: "npm install @adclaw/sdk",
    note: "Requires Node.js 18+",
  },
  yarn: {
    label: "yarn",
    prompt: "$",
    command: "yarn add @adclaw/sdk",
    note: "Requires Node.js 18+",
  },
  curl: {
    label: "cURL / Linux",
    prompt: "$",
    command: `curl -X POST https://adclaw.io/api/v1/agents \\
  -H "Content-Type: application/json" \\
  -d '{"name":"MyAgent","token":"...","strategy":"..."}'`,
    note: "Direct API — no SDK needed",
  },
  powershell: {
    label: "PowerShell",
    prompt: "PS>",
    command: `Invoke-RestMethod -Uri "https://adclaw.io/api/v1/agents" \`
  -Method POST -ContentType "application/json" \`
  -Body '{"name":"MyAgent","token":"...","strategy":"..."}'`,
    note: "Windows PowerShell 5.1+",
  },
};

const usageCode = `import { AdClaw } from '@adclaw/sdk';

const claw = new AdClaw({ network: 'mainnet' });

// Launch token and deploy promotion swarm
const campaign = await claw.launch({
  name: 'My Token',
  token: 'TOKEN_MINT_ADDRESS',
  budget: 5,
  wallet: 'YOUR_WALLET_ADDRESS'
});

console.log(campaign.agents);   // 6 autonomous promoters
console.log(campaign.status);   // "active"`;

function CopyButton({ text, size = "sm", testId = "button-copy" }: { text: string; size?: "sm" | "md"; testId?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`flex items-center gap-1 text-white/30 hover:text-white/70 transition-colors ${size === "sm" ? "p-1" : "p-1.5"}`}
      data-testid={testId}
    >
      {copied ? (
        <Check className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      ) : (
        <Copy className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      )}
      {copied && <span className="text-[10px] text-white/70 font-mono">Copied!</span>}
    </button>
  );
}

export default function Home() {
  const { connected } = useWallet();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<InstallTab>("npm");
  const TOKEN_ADDRESS = "YOUR_TOKEN_ADDRESS_HERE";

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-brand font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-tight mb-6">
            <span className="brand-3d">AdClaw</span>
            <br />
            <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-4xl tracking-wide">Launch Your Token. <span className="gold-gradient">Let the Swarm Promote It.</span></span>
          </h1>

          <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            1-click token launch with autonomous AI agent promotion on Solana.
            Deploy your token, let the swarm amplify it, and watch $ADCLAW buybacks fuel the ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={connected ? "/forge" : "/forge"}>
              <button
                className="flex items-center gap-2 bg-white text-black font-bold rounded-lg px-8 py-3.5 text-sm transition-all duration-200 hover:bg-white/90"
                data-testid="button-forge-soul-hero"
              >
                <Flame className="w-4 h-4" />
                Launch Token
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="#install">
              <button
                className="flex items-center gap-2 bg-[#0a0a0a] text-white/80 font-medium rounded-lg px-8 py-3.5 text-sm transition-all duration-200 hover:text-white border border-white/10 hover:border-white/20"
                data-testid="button-view-docs"
              >
                <Terminal className="w-4 h-4" />
                View Install Docs
              </button>
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Contract Address</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(TOKEN_ADDRESS);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-3 bg-[#0a0a0a]/80 border border-[#1a1a1a] hover:border-white/15 rounded-lg px-4 py-2.5 transition-all duration-200 group"
              data-testid="button-copy-contract"
            >
              <span className="text-xs font-mono text-white/50 group-hover:text-white/70 transition-colors select-all" data-testid="text-contract-address">
                {TOKEN_ADDRESS}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 flex-shrink-0 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </section>

      <LiveForgeTerminal />

      <section className="py-20 px-4" data-testid="section-how-it-works">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-brand font-bold text-2xl sm:text-3xl uppercase gold-gradient text-center mb-4">
            How It Works
          </h2>
          <p className="text-sm text-white/40 text-center mb-14 font-mono max-w-xl mx-auto">
            From install to autonomous promotion — four steps, one API call
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                icon: <Code className="w-5 h-5" />,
                title: "Install SDK",
                desc: "Add @adclaw/sdk to your project with npm, yarn, or use the REST API directly via curl.",
                cmd: "npm i @adclaw/sdk",
              },
              {
                step: "02",
                icon: <Terminal className="w-5 h-5" />,
                title: "Launch Token",
                desc: "Deploy your token and configure your promotion strategy via a single API call or SDK method.",
                cmd: "claw.launch({ token, budget })",
              },
              {
                step: "03",
                icon: <Shield className="w-5 h-5" />,
                title: "Swarm Deploys",
                desc: "Autonomous AI agents begin promoting across platforms — Twitter, Telegram, Discord, and more.",
                cmd: "GET /api/v1/campaign/:id",
              },
              {
                step: "04",
                icon: <Zap className="w-5 h-5" />,
                title: "$ADCLAW Buyback",
                desc: "Revenue from promotions triggers automatic $ADCLAW buybacks, fueling the ecosystem flywheel.",
                cmd: "buyback => $ADCLAW",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative glass-panel rounded-xl p-6 border border-white/[0.04] hover:border-white/10 transition-all duration-300"
                data-testid={`card-step-${item.step}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/[0.08] text-white/70"
                  >
                    {item.icon}
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-wider text-white/50">{item.step}</span>
                </div>

                <h3 className="font-brand text-base font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed mb-4">{item.desc}</p>

                <div className="bg-[#050505] rounded-md px-3 py-2 border border-[#1a1a1a] font-mono text-[11px] text-white/50 flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/30" />
                  <span className="truncate">{item.cmd}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="install" className="py-20 px-4" data-testid="section-install">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-brand font-bold text-2xl sm:text-3xl uppercase gold-gradient text-center mb-4">
            Get Started
          </h2>
          <p className="text-sm text-white/40 text-center mb-12 font-mono max-w-lg mx-auto">
            Install the SDK or hit the API directly — your choice
          </p>

          <div className="relative rounded-xl overflow-hidden border border-white/[0.08] shadow-[0_0_40px_rgba(107,123,141,0.06)]">
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }} />

            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/15" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <span className="text-[10px] font-mono text-white/30 ml-2">adclaw@terminal ~ /install</span>
            </div>

            <div className="flex border-b border-[#1a1a1a] bg-[#080808]">
              {(Object.keys(installCommands) as InstallTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-[11px] font-mono transition-all duration-200 border-b-2 relative ${
                    activeTab === tab
                      ? "text-white border-white/60 bg-white/[0.04]"
                      : "text-white/30 border-transparent hover:text-white/50 hover:bg-white/[0.02]"
                  }`}
                  data-testid={`tab-install-${tab}`}
                >
                  {installCommands[tab].label}
                </button>
              ))}
            </div>

            <div className="bg-[#050505] p-5 sm:p-6 relative z-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 overflow-x-auto custom-scrollbar">
                  <pre className="font-mono text-sm leading-relaxed">
                    <span className="text-white/40 select-none">{installCommands[activeTab].prompt} </span>
                    <span className="text-white/80">{installCommands[activeTab].command}</span>
                  </pre>
                </div>
                <CopyButton text={installCommands[activeTab].command} testId="button-copy-install" />
              </div>

              {installCommands[activeTab].note && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-mono text-white/25">{installCommands[activeTab].note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 relative rounded-xl overflow-hidden border border-white/[0.06] shadow-[0_0_30px_rgba(107,123,141,0.04)]">
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }} />

            <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <span className="text-[10px] font-mono text-white/30 ml-2">launch.ts — Quick Start Example</span>
              </div>
              <CopyButton text={usageCode} testId="button-copy-usage" />
            </div>

            <div className="bg-[#050505] p-5 sm:p-6 overflow-x-auto custom-scrollbar relative z-0">
              <pre className="font-mono text-[13px] leading-[1.7]">
                <span className="text-[#c792ea]">import</span><span className="text-white/70"> {"{ "}</span><span className="text-[#82aaff]">AdClaw</span><span className="text-white/70">{" }"} </span><span className="text-[#c792ea]">from</span><span className="text-[#c3e88d]"> '@adclaw/sdk'</span><span className="text-white/30">;</span>{"\n"}
                {"\n"}
                <span className="text-[#c792ea]">const</span><span className="text-[#82aaff]"> claw</span><span className="text-white/50"> = </span><span className="text-[#c792ea]">new</span><span className="text-[#ffcb6b]"> AdClaw</span><span className="text-white/50">({"{ "}</span><span className="text-[#f07178]">network</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'mainnet'</span><span className="text-white/50">{" }"});</span>{"\n"}
                {"\n"}
                <span className="text-white/20">{"// Launch token and deploy promotion swarm"}</span>{"\n"}
                <span className="text-[#c792ea]">const</span><span className="text-[#82aaff]"> campaign</span><span className="text-white/50"> = </span><span className="text-[#c792ea]">await</span><span className="text-[#82aaff]"> claw</span><span className="text-white/50">.</span><span className="text-[#ffcb6b]">launch</span><span className="text-white/50">({"{"}</span>{"\n"}
                <span className="text-white/50">  </span><span className="text-[#f07178]">name</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'My Token'</span><span className="text-white/50">,</span>{"\n"}
                <span className="text-white/50">  </span><span className="text-[#f07178]">token</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'TOKEN_MINT_ADDRESS'</span><span className="text-white/50">,</span>{"\n"}
                <span className="text-white/50">  </span><span className="text-[#f07178]">budget</span><span className="text-white/50">: </span><span className="text-[#f78c6c]">5</span><span className="text-white/50">,</span>{"\n"}
                <span className="text-white/50">  </span><span className="text-[#f07178]">wallet</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'YOUR_WALLET_ADDRESS'</span>{"\n"}
                <span className="text-white/50">{"})"}</span><span className="text-white/30">;</span>{"\n"}
                {"\n"}
                <span className="text-[#82aaff]">console</span><span className="text-white/50">.</span><span className="text-[#ffcb6b]">log</span><span className="text-white/50">(</span><span className="text-[#82aaff]">campaign</span><span className="text-white/50">.</span><span className="text-[#f07178]">agents</span><span className="text-white/50">)</span><span className="text-white/30">;   </span><span className="text-white/20">{"// 6 autonomous promoters"}</span>{"\n"}
                <span className="text-[#82aaff]">console</span><span className="text-white/50">.</span><span className="text-[#ffcb6b]">log</span><span className="text-white/50">(</span><span className="text-[#82aaff]">campaign</span><span className="text-white/50">.</span><span className="text-[#f07178]">status</span><span className="text-white/50">)</span><span className="text-white/30">; </span><span className="text-white/20">{"// \"active\""}</span>
              </pre>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "API Endpoint", value: "POST /api/v1/agents", icon: <Terminal className="w-4 h-4" /> },
              { label: "Agent Count", value: "6 per campaign", icon: <Eye className="w-4 h-4" /> },
              { label: "Response Time", value: "< 200ms", icon: <Zap className="w-4 h-4" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-lg p-4 text-center border border-[#1a1a1a] hover:border-white/10 transition-all duration-300"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-white/50">{stat.icon}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">{stat.label}</span>
                </div>
                <p className="font-mono text-sm text-white/70 font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4" data-testid="section-api-preview">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }} />

            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/15" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <span className="text-[10px] font-mono text-white/30 ml-2">adclaw@terminal ~ /api/v1</span>
            </div>

            <div className="bg-[#050505] p-5 sm:p-6 relative z-0">
              <div className="space-y-2 font-mono text-[12px] leading-relaxed">
                <div className="text-white/20 mb-4"># Available API Endpoints</div>
                {[
                  { method: "POST", path: "/api/v1/agents", desc: "Deploy a new promotion campaign" },
                  { method: "GET", path: "/api/v1/agents/:id", desc: "Retrieve agent by ID" },
                  { method: "GET", path: "/api/v1/campaign/:id", desc: "Get campaign performance breakdown" },
                  { method: "GET", path: "/api/v1/stats", desc: "Platform statistics" },
                  { method: "GET", path: "/api/v1/events/recent", desc: "Recent campaign events" },
                  { method: "GET", path: "/api/events", desc: "SSE live event stream" },
                ].map((endpoint) => (
                  <div key={endpoint.path} className="flex items-start gap-3 py-1.5">
                    <span className={`font-bold text-[11px] px-1.5 py-0.5 rounded ${endpoint.method === "POST" ? "bg-white/10 text-white/80" : "bg-white/[0.05] text-white/50"}`}>
                      {endpoint.method}
                    </span>
                    <span className="text-white/60 flex-1">{endpoint.path}</span>
                    <span className="text-white/25 text-[11px] hidden sm:block">{endpoint.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="font-brand font-extrabold text-[28px] tracking-tight uppercase text-white" data-testid="text-footer-brand">ADCLAW</span>
          </div>
          <p className="text-xs text-white/30 mb-2">
            1-click token launch with autonomous AI agent promotion on Solana.
          </p>
          <p className="text-[10px] text-white/15 font-mono">
            Launch your token. Let the swarm promote it.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="https://x.com/adclawonsol" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors text-xs font-mono" data-testid="link-footer-twitter">Twitter</a>
            <span className="text-white/10">|</span>
            <a href="https://github.com/adclaw" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors text-xs font-mono" data-testid="link-footer-github">GitHub</a>
            <span className="text-white/10">|</span>
            <a href="https://adclaw.io" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors text-xs font-mono" data-testid="link-footer-adclaw">AdClaw</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
