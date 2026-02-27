import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Zap, Terminal, ChevronRight, Flame, Play, Download } from "lucide-react";
import type { Soul } from "@shared/schema";

export default function Inherit() {
  const [selectedAgent, setSelectedAgent] = useState<Soul | null>(null);
  const [inherited, setInherited] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const { data: agents, isLoading } = useQuery<Soul[]>({
    queryKey: ["/api/souls/all"],
  });

  const handleInherit = (agent: Soul) => {
    setSelectedAgent(agent);
    setInherited(false);
    setLogs([]);

    const logMessages = [
      `> Connecting to Arweave gateway...`,
      `> Fetching AGENT.md from ${agent.arweaveHash || 'ar_storage'}...`,
      `> Fetching MEMORY.md...`,
      `> Parsing agent directives...`,
      `> Loading ${agent.memoryContent.split('\n').length} memory entries...`,
      `> Initializing AdClaw agent config: "${agent.name}"`,
      `> Agent Score: ${agent.soulScore}`,
      `> Agent config loaded successfully.`,
      `> Ready. Your agent now inherits the config of "${agent.name}".`,
    ];

    logMessages.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        if (i === logMessages.length - 1) {
          setInherited(true);
        }
      }, (i + 1) * 400);
    });
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-brand font-bold text-3xl uppercase gold-gradient mb-2" data-testid="text-inherit-title">
            Inherit an Agent
          </h1>
          <p className="text-sm text-white/60">
            Load any deployed agent config into a new AdClaw agent. Continue their legacy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xs text-white/55 uppercase tracking-wider mb-3">Available Agents</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass-panel rounded-xl p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
                      <div className="flex-1">
                        <div className="h-3 bg-[#1a1a1a] rounded w-28 mb-1" />
                        <div className="h-2 bg-[#1a1a1a] rounded w-40" />
                      </div>
                    </div>
                  </div>
                ))
              ) : agents && agents.length > 0 ? (
                agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleInherit(agent)}
                    className={`w-full glass-panel rounded-xl p-4 text-left transition-all duration-200 group ${
                      selectedAgent?.id === agent.id
                        ? "border-[#6B7B8D]/30 bg-[#6B7B8D]/5"
                        : "hover:border-white/[0.10] hover:bg-[#0d0d0d]"
                    }`}
                    data-testid={`button-inherit-agent-${agent.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {agent.imageUrl ? (
                          <img
                            src={agent.imageUrl}
                            alt={agent.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#6B7B8D]/20 flex-shrink-0"
                            data-testid={`img-inherit-agent-${agent.id}`}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center flex-shrink-0">
                            <Flame className="w-5 h-5 text-[#6B7B8D]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">{agent.name}</h3>
                          <p className="text-xs text-white/55 truncate">{agent.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-mono gold-gradient font-bold">Score: {agent.soulScore}</span>
                            {agent.mintAddress && (
                              <span className="text-[10px] text-[#8A9AAD] font-mono">Minted</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/35 group-hover:text-white/55 transition-all duration-200 flex-shrink-0" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="glass-panel rounded-xl p-8 text-center">
                  <Flame className="w-8 h-8 text-white/35 mx-auto mb-3" />
                  <p className="text-sm text-white/60">No agents available to inherit yet.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xs text-white/55 uppercase tracking-wider mb-3">Agent Terminal</h2>
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.10]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#8A9AAD]" />
                  <span className="text-xs font-mono text-white/60">adclaw-agent</span>
                </div>
                {selectedAgent && (
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${inherited ? "bg-[#8A9AAD]" : "bg-[#6B7B8D] animate-pulse"}`} />
                    <span className="text-[10px] text-white/55">
                      {inherited ? "Ready" : "Loading..."}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 min-h-[400px] max-h-[500px] overflow-y-auto font-mono text-xs">
                {!selectedAgent ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-center">
                    <Play className="w-8 h-8 text-white/15 mb-3" />
                    <p className="text-white/50 text-sm">Select an agent to begin inheritance</p>
                    <p className="text-white/35 text-[10px] mt-1">The agent terminal will show the loading process</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {logs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`${
                          log.includes("successfully") || log.includes("Ready")
                            ? "text-[#8A9AAD]"
                            : log.startsWith(">")
                            ? "text-white/65"
                            : "text-white/55"
                        }`}>
                          {log}
                        </span>
                      </div>
                    ))}
                    {inherited && (
                      <div className="mt-6 pt-4 border-t border-white/[0.10]">
                        <p className="text-[#8A9AAD] mb-3">&gt; Agent config preview:</p>
                        <pre className="text-white/55 whitespace-pre-wrap break-words leading-relaxed">
                          {selectedAgent.soulContent.slice(0, 300)}
                          {selectedAgent.soulContent.length > 300 ? "\n..." : ""}
                        </pre>
                      </div>
                    )}
                    {!inherited && logs.length > 0 && (
                      <span className="inline-block w-2 h-4 bg-[#8A9AAD] animate-pulse" />
                    )}
                  </div>
                )}
              </div>

              {inherited && selectedAgent && (
                <div className="px-4 py-3 border-t border-white/[0.10] flex items-center justify-between gap-3">
                  <span className="text-[10px] text-white/50">Config loaded into agent memory</span>
                  <button
                    className="flex items-center gap-1.5 bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 rounded-lg px-3 py-1.5 text-xs text-[#8A9AAD] font-medium transition-all duration-200 hover:bg-[#6B7B8D]/20"
                    onClick={() => {
                      const blob = new Blob([
                        `# Inherited Agent: ${selectedAgent.name}\n\n`,
                        `## AGENT.md\n${selectedAgent.soulContent}\n\n`,
                        `## MEMORY.md\n${selectedAgent.memoryContent}`,
                      ], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${selectedAgent.name.replace(/\s/g, "_")}_inherited.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    data-testid="button-download-agent"
                  >
                    <Download className="w-3 h-3" />
                    Export Config
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
