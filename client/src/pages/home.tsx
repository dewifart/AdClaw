import { Link } from "wouter";
import { useWallet } from "@/lib/wallet";
import { Flame, ArrowRight, Copy, Check, Terminal, Shield, Zap, Eye, Code, ChevronRight } from "lucide-react";
import { LiveForgeTerminal } from "@/components/LiveForgeTerminal";
import { useState } from "react";
import crabLogo from "@assets/soulclaw-crab-v2.png";

type InstallTab = "npm" | "yarn" | "curl" | "powershell";

const installCommands: Record<InstallTab, { label: string; prompt: string; command: string; note?: string }> = {
  npm: {
    label: "npm",
    prompt: "$",
    command: "npm install @soulclaw/sdk",
    note: "Requires Node.js 18+",
  },
  yarn: {
    label: "yarn",
    prompt: "$",
    command: "yarn add @soulclaw/sdk",
    note: "Requires Node.js 18+",
  },
  curl: {
    label: "cURL / Linux",
    prompt: "$",
    command: `curl -X POST https://soulclaw.com/api/v1/souls \\
  -H "Content-Type: application/json" \\
  -d '{"name":"MyAgent","soul_content":"...","memory_content":"..."}'`,
    note: "Direct API — no SDK needed",
  },
  powershell: {
    label: "PowerShell",
    prompt: "PS>",
    command: `Invoke-RestMethod -Uri "https://soulclaw.com/api/v1/souls" \`
  -Method POST -ContentType "application/json" \`
  -Body '{"name":"MyAgent","soul_content":"...","memory_content":"..."}'`,
    note: "Windows PowerShell 5.1+",
  },
};

const usageCode = `import { SoulClaw } from '@soulclaw/sdk';

const claw = new SoulClaw({ network: 'mainnet' });

// Forge your agent's identity
const soul = await claw.forge({
  name: 'Sentinel Alpha',
  soul: './SOUL.md',
  memory: './MEMORY.md',
  wallet: 'YOUR_WALLET_ADDRESS'
});

console.log(soul.score);     // 2841
console.log(soul.breakdown); // { intelligence, strategy, risk, trust }`;

function CopyButton({ text, size = "sm", testId = "button-copy" }: { text: string; size?: "sm" | "md"; testId?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`flex items-center gap-1 text-white/30 hover:text-[#00FFFF] transition-colors ${size === "sm" ? "p-1" : "p-1.5"}`}
      data-testid={testId}
    >
      {copied ? (
        <Check className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      ) : (
        <Copy className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      )}
      {copied && <span className="text-[10px] text-[#00FFFF] font-mono">Copied!</span>}
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
            <span className="brand-3d">SoulClaw</span>
            <br />
            <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-4xl tracking-wide">Give Your Agent <span className="gold-gradient">Eternal Identity</span></span>
          </h1>

          <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The identity and memory protocol for AI agents on Solana.
            Upload SOUL.md + MEMORY.md, get a verifiable Soul Engine Score.
            One API call to give your agent permanent identity.
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
            <a href="#install">
              <button
                className="flex items-center gap-2 bg-[#0a0a0a] text-white/80 font-medium rounded-lg px-8 py-3.5 text-sm transition-all duration-200 hover:text-white border border-[#FF2D55]/20 hover:border-[#FF2D55]/40 hover:shadow-[0_0_20px_rgba(255,45,85,0.1)]"
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

      <section className="py-20 px-4" data-testid="section-how-it-works">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-brand font-bold text-2xl sm:text-3xl uppercase gold-gradient text-center mb-4">
            How It Works
          </h2>
          <p className="text-sm text-white/40 text-center mb-14 font-mono max-w-xl mx-auto">
            From install to immortal identity — four steps, one API call
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                icon: <Code className="w-5 h-5" />,
                title: "Install SDK",
                desc: "Add @soulclaw/sdk to your project with npm, yarn, or use the REST API directly via curl.",
                color: "#FF2D55",
                cmd: "npm i @soulclaw/sdk",
              },
              {
                step: "02",
                icon: <Terminal className="w-5 h-5" />,
                title: "Upload Identity",
                desc: "Send your agent's SOUL.md and MEMORY.md files via a single API call or SDK method.",
                color: "#00FFFF",
                cmd: "claw.forge({ soul, memory })",
              },
              {
                step: "03",
                icon: <Shield className="w-5 h-5" />,
                title: "Score Calculated",
                desc: "Soul Engine analyzes intelligence, strategy, risk profile, and trust — scored 500 to 5000.",
                color: "#FF2D55",
                cmd: "GET /api/v1/score/:id",
              },
              {
                step: "04",
                icon: <Zap className="w-5 h-5" />,
                title: "Identity Stored",
                desc: "Soul is permanently stored with a verifiable score. Events broadcast live to SOUL TERMINAL.",
                color: "#00FFFF",
                cmd: "soul.id => stored forever",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative glass-panel rounded-xl p-6 border border-white/[0.04] hover:border-[color:var(--accent)]/30 transition-all duration-300"
                style={{ "--accent": item.color } as any}
                data-testid={`card-step-${item.step}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}12`, border: `1px solid ${item.color}25`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-wider" style={{ color: item.color }}>{item.step}</span>
                </div>

                <h3 className="font-brand text-base font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed mb-4">{item.desc}</p>

                <div className="bg-[#050505] rounded-md px-3 py-2 border border-[#1a1a1a] font-mono text-[11px] text-white/50 flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: item.color }} />
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

          <div className="relative rounded-xl overflow-hidden border border-[#FF2D55]/20 shadow-[0_0_40px_rgba(255,45,85,0.1),0_0_80px_rgba(0,255,255,0.03)]">
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }} />

            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF2D55]" />
                <div className="w-3 h-3 rounded-full bg-[#facc15]" />
                <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
              </div>
              <span className="text-[10px] font-mono text-white/30 ml-2">soul@terminal ~ /install</span>
            </div>

            <div className="flex border-b border-[#1a1a1a] bg-[#080808]">
              {(Object.keys(installCommands) as InstallTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-[11px] font-mono transition-all duration-200 border-b-2 relative ${
                    activeTab === tab
                      ? "text-[#00FFFF] border-[#00FFFF] bg-[#00FFFF]/[0.04]"
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
                    <span className="text-[#4ade80] select-none">{installCommands[activeTab].prompt} </span>
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

          <div className="mt-8 relative rounded-xl overflow-hidden border border-[#00FFFF]/10 shadow-[0_0_30px_rgba(0,255,255,0.05)]">
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }} />

            <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF2D55]" />
                  <div className="w-3 h-3 rounded-full bg-[#facc15]" />
                  <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                </div>
                <span className="text-[10px] font-mono text-white/30 ml-2">forge.ts — Quick Start Example</span>
              </div>
              <CopyButton text={usageCode} testId="button-copy-usage" />
            </div>

            <div className="bg-[#050505] p-5 sm:p-6 overflow-x-auto custom-scrollbar relative z-0">
              <pre className="font-mono text-[13px] leading-[1.7]">
                <span className="text-[#c792ea]">import</span><span className="text-white/70"> {"{ "}</span><span className="text-[#82aaff]">SoulClaw</span><span className="text-white/70">{" }"} </span><span className="text-[#c792ea]">from</span><span className="text-[#c3e88d]"> '@soulclaw/sdk'</span><span className="text-white/30">;</span>{"\n"}
                {"\n"}
                <span className="text-[#c792ea]">const</span><span className="text-[#82aaff]"> claw</span><span className="text-white/50"> = </span><span className="text-[#c792ea]">new</span><span className="text-[#ffcb6b]"> SoulClaw</span><span className="text-white/50">({"{ "}</span><span className="text-[#f07178]">network</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'mainnet'</span><span className="text-white/50">{" }"});</span>{"\n"}
                {"\n"}
                <span className="text-white/20">{"// Forge your agent's identity"}</span>{"\n"}
                <span className="text-[#c792ea]">const</span><span className="text-[#82aaff]"> soul</span><span className="text-white/50"> = </span><span className="text-[#c792ea]">await</span><span className="text-[#82aaff]"> claw</span><span className="text-white/50">.</span><span className="text-[#ffcb6b]">forge</span><span className="text-white/50">({"{"}</span>{"\n"}
                <span className="text-white/50">  </span><span className="text-[#f07178]">name</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'Sentinel Alpha'</span><span className="text-white/50">,</span>{"\n"}
                <span className="text-white/50">  </span><span className="text-[#f07178]">soul</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'./SOUL.md'</span><span className="text-white/50">,</span>{"\n"}
                <span className="text-white/50">  </span><span className="text-[#f07178]">memory</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'./MEMORY.md'</span><span className="text-white/50">,</span>{"\n"}
                <span className="text-white/50">  </span><span className="text-[#f07178]">wallet</span><span className="text-white/50">: </span><span className="text-[#c3e88d]">'YOUR_WALLET_ADDRESS'</span>{"\n"}
                <span className="text-white/50">{"})"}</span><span className="text-white/30">;</span>{"\n"}
                {"\n"}
                <span className="text-[#82aaff]">console</span><span className="text-white/50">.</span><span className="text-[#ffcb6b]">log</span><span className="text-white/50">(</span><span className="text-[#82aaff]">soul</span><span className="text-white/50">.</span><span className="text-[#f07178]">score</span><span className="text-white/50">)</span><span className="text-white/30">;     </span><span className="text-white/20">{"// 2841"}</span>{"\n"}
                <span className="text-[#82aaff]">console</span><span className="text-white/50">.</span><span className="text-[#ffcb6b]">log</span><span className="text-white/50">(</span><span className="text-[#82aaff]">soul</span><span className="text-white/50">.</span><span className="text-[#f07178]">breakdown</span><span className="text-white/50">)</span><span className="text-white/30">; </span><span className="text-white/20">{"// { intelligence, strategy, risk, trust }"}</span>
              </pre>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "API Endpoint", value: "POST /api/v1/souls", icon: <Terminal className="w-4 h-4" />, color: "#FF2D55" },
              { label: "Score Range", value: "500 — 5,000", icon: <Eye className="w-4 h-4" />, color: "#00FFFF" },
              { label: "Response Time", value: "< 200ms", icon: <Zap className="w-4 h-4" />, color: "#4ade80" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-lg p-4 text-center border border-[#1a1a1a] hover:border-white/10 transition-all duration-300"
                style={{ boxShadow: `0 0 20px ${stat.color}08` }}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span style={{ color: stat.color }}>{stat.icon}</span>
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
          <div className="relative rounded-xl overflow-hidden border border-[#FF2D55]/10">
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }} />

            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF2D55]" />
                <div className="w-3 h-3 rounded-full bg-[#facc15]" />
                <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
              </div>
              <span className="text-[10px] font-mono text-white/30 ml-2">soul@terminal ~ /api/v1</span>
            </div>

            <div className="bg-[#050505] p-5 sm:p-6 relative z-0">
              <div className="space-y-2 font-mono text-[12px] leading-relaxed">
                <div className="text-white/20 mb-4"># Available API Endpoints</div>
                {[
                  { method: "POST", path: "/api/v1/souls", desc: "Forge a new soul identity" },
                  { method: "GET", path: "/api/v1/souls/:id", desc: "Retrieve soul by ID" },
                  { method: "GET", path: "/api/v1/score/:id", desc: "Get Soul Engine Score breakdown" },
                  { method: "GET", path: "/api/v1/stats", desc: "Platform statistics" },
                  { method: "GET", path: "/api/v1/events/recent", desc: "Recent forge events" },
                  { method: "GET", path: "/api/events", desc: "SSE live event stream" },
                ].map((endpoint) => (
                  <div key={endpoint.path} className="flex items-start gap-3 py-1.5">
                    <span className={`font-bold text-[11px] px-1.5 py-0.5 rounded ${endpoint.method === "POST" ? "bg-[#FF2D55]/15 text-[#FF2D55]" : "bg-[#00FFFF]/10 text-[#00FFFF]"}`}>
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
            <img src={crabLogo} alt="SoulClaw" className="h-11 w-11 object-contain drop-shadow-[0_0_10px_rgba(255,45,85,0.6)]" data-testid="img-footer-logo" />
            <span className="font-brand font-extrabold text-[28px] tracking-tight uppercase text-[#FF2D55] drop-shadow-[0_0_12px_rgba(255,45,85,0.6)]" style={{textShadow: '0 0 20px rgba(255,45,85,0.4), 0 2px 4px rgba(0,0,0,0.8)'}} data-testid="text-footer-brand">SOULCLAW</span>
          </div>
          <p className="text-xs text-white/30 mb-2">
            The identity and memory protocol for AI agents on Solana.
          </p>
          <p className="text-[10px] text-white/15 font-mono">
            One API call to give your agent permanent identity.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="https://x.com/soulclawonsol" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors text-xs font-mono" data-testid="link-footer-twitter">Twitter</a>
            <span className="text-white/10">|</span>
            <a href="https://github.com/dewifart/SoulClaw" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors text-xs font-mono" data-testid="link-footer-github">GitHub</a>
            <span className="text-white/10">|</span>
            <a href="https://clawapis.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors text-xs font-mono" data-testid="link-footer-clawapis">ClawAPIs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
