import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Zap, Terminal, ChevronRight, Flame, Play, Download } from "lucide-react";
import type { Soul } from "@shared/schema";

export default function Inherit() {
  const [selectedSoul, setSelectedSoul] = useState<Soul | null>(null);
  const [inherited, setInherited] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const { data: souls, isLoading } = useQuery<Soul[]>({
    queryKey: ["/api/souls/all"],
  });

  const handleInherit = (soul: Soul) => {
    setSelectedSoul(soul);
    setInherited(false);
    setLogs([]);

    const logMessages = [
      `> Connecting to Arweave gateway...`,
      `> Fetching SOUL.md from ${soul.arweaveHash || 'ar_storage'}...`,
      `> Fetching MEMORY.md...`,
      `> Parsing personality directives...`,
      `> Loading ${soul.memoryContent.split('\n').length} memory entries...`,
      `> Initializing OpenClaw agent with soul: "${soul.name}"`,
      `> Soul Score: ${soul.soulScore}`,
      `> Agent personality loaded successfully.`,
      `> Ready. Your agent now carries the soul of "${soul.name}".`,
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
          <div className="inline-flex items-center gap-2 bg-[#14F195]/10 border border-[#14F195]/20 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-3.5 h-3.5 text-[#14F195]" />
            <span className="text-xs font-medium text-[#14F195]">Soul Inheritance</span>
          </div>
          <h1 className="font-brand font-bold text-3xl uppercase gold-gradient mb-2" data-testid="text-inherit-title">
            Inherit a Soul
          </h1>
          <p className="text-sm text-white/50">
            Load any immortalized soul into a new OpenClaw agent. Continue their legacy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xs text-white/40 uppercase tracking-wider mb-3">Available Souls</h2>
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
              ) : souls && souls.length > 0 ? (
                souls.map((soul) => (
                  <button
                    key={soul.id}
                    onClick={() => handleInherit(soul)}
                    className={`w-full glass-panel rounded-xl p-4 text-left transition-all duration-200 group ${
                      selectedSoul?.id === soul.id
                        ? "border-[#14F195]/30 bg-[#14F195]/5"
                        : "hover:border-[#1a1a1a] hover:bg-[#0d0d0d]"
                    }`}
                    data-testid={`button-inherit-soul-${soul.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                          <Flame className="w-5 h-5 text-[#FFD700]" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">{soul.name}</h3>
                          <p className="text-xs text-white/40 truncate">{soul.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-mono gold-gradient font-bold">Score: {soul.soulScore}</span>
                            {soul.mintAddress && (
                              <span className="text-[10px] text-[#14F195] font-mono">Minted</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-all duration-200 flex-shrink-0" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="glass-panel rounded-xl p-8 text-center">
                  <Flame className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/50">No souls available to inherit yet.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xs text-white/40 uppercase tracking-wider mb-3">Agent Terminal</h2>
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#14F195]" />
                  <span className="text-xs font-mono text-white/60">openclaw-agent</span>
                </div>
                {selectedSoul && (
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${inherited ? "bg-[#14F195]" : "bg-[#FFD700] animate-pulse"}`} />
                    <span className="text-[10px] text-white/40">
                      {inherited ? "Ready" : "Loading..."}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 min-h-[400px] max-h-[500px] overflow-y-auto font-mono text-xs">
                {!selectedSoul ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-center">
                    <Play className="w-8 h-8 text-white/10 mb-3" />
                    <p className="text-white/30 text-sm">Select a soul to begin inheritance</p>
                    <p className="text-white/20 text-[10px] mt-1">The agent terminal will show the loading process</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {logs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`${
                          log.includes("successfully") || log.includes("Ready")
                            ? "text-[#14F195]"
                            : log.startsWith(">")
                            ? "text-white/60"
                            : "text-white/40"
                        }`}>
                          {log}
                        </span>
                      </div>
                    ))}
                    {inherited && (
                      <div className="mt-6 pt-4 border-t border-[#1a1a1a]">
                        <p className="text-[#14F195] mb-3">&gt; Soul personality preview:</p>
                        <pre className="text-white/50 whitespace-pre-wrap break-words leading-relaxed">
                          {selectedSoul.soulContent.slice(0, 300)}
                          {selectedSoul.soulContent.length > 300 ? "\n..." : ""}
                        </pre>
                      </div>
                    )}
                    {!inherited && logs.length > 0 && (
                      <span className="inline-block w-2 h-4 bg-[#14F195] animate-pulse" />
                    )}
                  </div>
                )}
              </div>

              {inherited && selectedSoul && (
                <div className="px-4 py-3 border-t border-[#1a1a1a] flex items-center justify-between gap-3">
                  <span className="text-[10px] text-white/30">Soul loaded into agent memory</span>
                  <button
                    className="flex items-center gap-1.5 bg-[#14F195]/10 border border-[#14F195]/20 rounded-lg px-3 py-1.5 text-xs text-[#14F195] font-medium transition-all duration-200 hover:bg-[#14F195]/20"
                    onClick={() => {
                      const blob = new Blob([
                        `# Inherited Soul: ${selectedSoul.name}\n\n`,
                        `## SOUL.md\n${selectedSoul.soulContent}\n\n`,
                        `## MEMORY.md\n${selectedSoul.memoryContent}`,
                      ], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${selectedSoul.name.replace(/\s/g, "_")}_inherited.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    data-testid="button-download-soul"
                  >
                    <Download className="w-3 h-3" />
                    Export Soul
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
