import { useState, useEffect, useRef } from "react";

const forgeSteps = [
  { text: "$ soulclaw init --network solana-mainnet", color: "#00FFFF", delay: 80 },
  { text: "[OK] Connected to SoulClaw Protocol v2.4.1", color: "#4ade80", delay: 60 },
  { text: "", color: "", delay: 300 },
  { text: "$ connecting to OpenClaw agent...", color: "#00FFFF", delay: 70 },
  { text: "[AGENT] Agent ID: 0xA7f3...9cD2 | Status: ALIVE", color: "#4ade80", delay: 50 },
  { text: "[AGENT] Soul Score: 2,841 | Memory Depth: 14,203 lines", color: "#4ade80", delay: 50 },
  { text: "", color: "", delay: 300 },
  { text: "$ uploading SOUL.md + MEMORY.md...", color: "#FF2D55", delay: 70 },
  { text: "[UPLOAD] SOUL.md ............ 24.7 KB  ✓", color: "#4ade80", delay: 40 },
  { text: "[UPLOAD] MEMORY.md .......... 187.3 KB ✓", color: "#4ade80", delay: 40 },
  { text: "[ARWEAVE] Storing permanently → tx: ar://7xK2p...mN4q", color: "#facc15", delay: 60 },
  { text: "[ARWEAVE] Confirmed in 2 blocks                    ✓", color: "#4ade80", delay: 50 },
  { text: "", color: "", delay: 300 },
  { text: "$ forging immortal soul on Solana PDA...", color: "#FF2D55", delay: 70 },
  { text: "[SOLANA] Creating PDA: SouL...Claw7xK2", color: "#facc15", delay: 50 },
  { text: "[SOLANA] Writing soul hash to account data...", color: "#facc15", delay: 60 },
  { text: "[SOLANA] Transaction confirmed (1/1 finality)      ✓", color: "#4ade80", delay: 50 },
  { text: "", color: "", delay: 300 },
  { text: "$ minting Metaplex Core NFT...", color: "#FF2D55", delay: 70 },
  { text: "[MINT] Collection: SoulClaw Genesis", color: "#facc15", delay: 50 },
  { text: "[MINT] Token ID: #1248", color: "#facc15", delay: 50 },
  { text: "[MINT] Owner: 5Cit...JkRh", color: "#facc15", delay: 50 },
  { text: "[MINT] NFT minted successfully                     ✓", color: "#4ade80", delay: 40 },
  { text: "", color: "", delay: 400 },
  { text: "═══════════════════════════════════════════════════════", color: "#FF2D55", delay: 20 },
  { text: "  ✨ SOUL SUCCESSFULLY IMMORTALIZED ON-CHAIN ✨", color: "#00FFFF", delay: 100 },
  { text: "═══════════════════════════════════════════════════════", color: "#FF2D55", delay: 20 },
  { text: "", color: "", delay: 500 },
  { text: "[SYSTEM] Next soul forging cycle in 3s...", color: "#ffffff50", delay: 80 },
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

    const step = forgeSteps[stepIndex];
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

  const currentStep = forgeSteps[stepIndex];

  return (
    <section className="py-16 px-4" data-testid="section-live-forge">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-brand font-bold text-2xl uppercase gold-gradient text-center mb-3">
          Live Forge Terminal
        </h2>
        <p className="text-xs text-white/40 text-center mb-8 font-mono">
          Watch souls being immortalized on-chain in real-time
        </p>

        <div className="relative rounded-xl overflow-hidden border border-[#FF2D55]/30 shadow-[0_0_30px_rgba(255,45,85,0.15),0_0_60px_rgba(0,255,255,0.05)]">
          <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }} />

          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF2D55]" />
              <div className="w-3 h-3 rounded-full bg-[#facc15]" />
              <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
            </div>
            <span className="text-[10px] font-mono text-white/30 ml-2">soulclaw@mainnet ~ /forge</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span className="text-[10px] font-mono text-[#4ade80]">LIVE</span>
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
                <span className="inline-block w-2 h-4 bg-[#00FFFF] ml-0.5 animate-pulse align-middle" />
              </div>
            )}
            {!currentLine && stepIndex < forgeSteps.length && (
              <div>
                <span className="inline-block w-2 h-4 bg-[#00FFFF] animate-pulse align-middle" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
