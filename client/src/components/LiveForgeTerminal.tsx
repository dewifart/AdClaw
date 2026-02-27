import { useState, useEffect, useRef } from "react";

const launchSteps = [
  { text: "$ adclaw launch --token $MYTOKEN --network mainnet", color: "#b0bec5", delay: 80 },
  { text: "[OK] Connected to AdClaw Protocol v2.4.1", color: "#a8b8c4", delay: 60 },
  { text: "[DEPLOY] Token mint: 7xK2p...mN4q created on Solana", color: "#a8b8c4", delay: 50 },
  { text: "", color: "", delay: 300 },
  { text: "$ deploying agent swarm...", color: "#8a9aad", delay: 70 },
  { text: "[SWARM] Agent #1 @claw_alpha     → assigned to X/Twitter    ✓", color: "#a8b8c4", delay: 40 },
  { text: "[SWARM] Agent #2 @claw_bravo     → assigned to X/Twitter    ✓", color: "#a8b8c4", delay: 40 },
  { text: "[SWARM] Agent #3 @claw_charlie   → assigned to Telegram     ✓", color: "#a8b8c4", delay: 40 },
  { text: "[SWARM] Agent #4 @claw_delta     → assigned to Discord      ✓", color: "#a8b8c4", delay: 40 },
  { text: "[SWARM] Agent #5 @claw_echo      → assigned to Reddit       ✓", color: "#a8b8c4", delay: 40 },
  { text: "[SWARM] Agent #6 @claw_foxtrot   → assigned to X/Twitter    ✓", color: "#a8b8c4", delay: 40 },
  { text: "[SWARM] 6 agents deployed — all systems active              ✓", color: "#c4a962", delay: 60 },
  { text: "", color: "", delay: 300 },
  { text: "$ agents starting autonomous promotion cycle...", color: "#8a9aad", delay: 70 },
  { text: "[POST] @claw_alpha   tweeted: \"$MYTOKEN just launched...\"     ✓", color: "#a8b8c4", delay: 50 },
  { text: "[POST] @claw_bravo   replied to @solana_whale thread         ✓", color: "#a8b8c4", delay: 50 },
  { text: "[POST] @claw_charlie posted in /solana_gems channel          ✓", color: "#a8b8c4", delay: 50 },
  { text: "[POST] @claw_foxtrot quote-tweeted @dex_screener listing     ✓", color: "#a8b8c4", delay: 50 },
  { text: "", color: "", delay: 300 },
  { text: "$ tracking engagement metrics...", color: "#8a9aad", delay: 70 },
  { text: "[METRICS] Impressions ████████████████░░░░ 12,847", color: "#b0bec5", delay: 50 },
  { text: "[METRICS] Clicks      ██████████░░░░░░░░░░   1,204", color: "#b0bec5", delay: 50 },
  { text: "[METRICS] Engagement  ████████████████████   9.4%", color: "#b0bec5", delay: 50 },
  { text: "", color: "", delay: 300 },
  { text: "$ processing platform fees...", color: "#8a9aad", delay: 70 },
  { text: "[BUYBACK] Fee collected: 0.25 SOL", color: "#c4a962", delay: 50 },
  { text: "[BUYBACK] Executing $ADCLAW market buy → 0.25 SOL            ✓", color: "#c4a962", delay: 50 },
  { text: "[BUYBACK] Tokens acquired: 1,247 $ADCLAW → burned           ✓", color: "#c4a962", delay: 50 },
  { text: "", color: "", delay: 400 },
  { text: "═══════════════════════════════════════════════════════", color: "#8a9aad", delay: 20 },
  { text: "  >>> TOKEN LAUNCHED — SWARM ACTIVE — BUYBACK COMPLETE <<<", color: "#c4a962", delay: 100 },
  { text: "═══════════════════════════════════════════════════════", color: "#8a9aad", delay: 20 },
  { text: "", color: "", delay: 500 },
  { text: "[SYSTEM] Next promotion cycle in 3s...", color: "#ffffff50", delay: 80 },
];

export function LiveForgeTerminal() {
  const [lines, setLines] = useState<{ text: string; color: string }[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTyping) return;

    const step = launchSteps[stepIndex];
    if (!step) {
      const timeout = setTimeout(() => {
        setLines([]);
        setCurrentLine("");
        setCharIndex(0);
        setStepIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    if (step.text === "") {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, { text: "", color: "" }]);
        setStepIndex((prev) => prev + 1);
        setCharIndex(0);
        setCurrentLine("");
      }, step.delay);
      return () => clearTimeout(timeout);
    }

    if (charIndex < step.text.length) {
      const speed = step.delay > 60 ? 35 : 18;
      const timeout = setTimeout(() => {
        setCurrentLine(step.text.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, { text: step.text, color: step.color }]);
        setCurrentLine("");
        setCharIndex(0);
        setStepIndex((prev) => prev + 1);
      }, step.delay);
      return () => clearTimeout(timeout);
    }
  }, [stepIndex, charIndex, isTyping]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines, currentLine]);

  const currentStep = launchSteps[stepIndex];

  return (
    <section className="py-16 px-4" data-testid="section-live-terminal">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-brand font-bold text-2xl uppercase gold-gradient text-center mb-3">
          Live Agent Terminal
        </h2>
        <p className="text-xs text-white/60 text-center mb-8 font-mono">
          Watch tokens launch and agents promote in real-time
        </p>

        <div className="relative rounded-xl overflow-hidden border border-white/[0.12] shadow-[0_0_30px_rgba(107,123,141,0.1)]">
          <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }} />

          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0c0c0c] border-b border-white/[0.10]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/25" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/15" />
            </div>
            <span className="text-[10px] font-mono text-white/60 ml-2">adclaw@swarm ~ /launch</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8A9AAD] animate-pulse" />
              <span className="text-[10px] font-mono text-[#8A9AAD]">LIVE</span>
            </div>
          </div>

          <div
            ref={terminalRef}
            className="bg-[#050505] p-4 sm:p-6 h-[420px] overflow-y-auto font-mono text-sm leading-relaxed custom-scrollbar"
            data-testid="terminal-output"
          >
            {lines.map((line, i) => (
              <div key={i} className={line.text === "" ? "h-3" : ""}>
                {line.text && (
                  <span style={{ color: line.color }}>{line.text}</span>
                )}
              </div>
            ))}
            {currentLine && currentStep && (
              <div>
                <span style={{ color: currentStep.color }}>{currentLine}</span>
                <span className="inline-block w-2 h-4 bg-[#8A9AAD] ml-0.5 animate-pulse align-middle" />
              </div>
            )}
            {!currentLine && stepIndex < launchSteps.length && (
              <div>
                <span className="inline-block w-2 h-4 bg-[#8A9AAD] animate-pulse align-middle" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
