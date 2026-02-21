import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import { UploadZone } from "@/components/UploadZone";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Flame, Wallet, Loader2, Check, ArrowRight } from "lucide-react";

export default function Forge() {
  const { connected, address, connect } = useWallet();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [soulFile, setSoulFile] = useState<File | null>(null);
  const [memoryFile, setMemoryFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(0);

  const forgeMutation = useMutation({
    mutationFn: async () => {
      if (!soulFile || !memoryFile || !address) throw new Error("Missing files");

      const soulContent = await soulFile.text();
      const memoryContent = await memoryFile.text();
      const soulScore = Math.floor(memoryContent.length / 10 + Math.random() * 500);

      setStep(1);
      await new Promise(r => setTimeout(r, 1200));
      setStep(2);
      await new Promise(r => setTimeout(r, 1000));
      setStep(3);
      await new Promise(r => setTimeout(r, 800));

      const res = await apiRequest("POST", "/api/souls", {
        name: name || soulFile.name.replace(".md", ""),
        description: description || "An immortalized OpenClaw agent soul",
        soulContent,
        memoryContent,
        ownerWallet: address,
        soulScore,
        mintAddress: `mint_${Date.now().toString(36)}`,
        arweaveHash: `ar_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        isListed: false,
        price: null,
        imageUrl: null,
      });

      setStep(4);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/souls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/souls/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/souls/listed"] });
      toast({
        title: "Soul Forged!",
        description: "Your agent's soul has been immortalized on-chain.",
      });
      setTimeout(() => setLocation("/dashboard"), 1500);
    },
    onError: (error: Error) => {
      setStep(0);
      toast({
        title: "Forging Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const steps = [
    { label: "Uploading to Arweave...", icon: "upload" },
    { label: "Creating Solana PDA...", icon: "chain" },
    { label: "Minting NFT...", icon: "mint" },
    { label: "Soul Forged!", icon: "done" },
  ];

  const canForge = soulFile && memoryFile && connected && !forgeMutation.isPending;

  if (!connected) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-full bg-[#9945FF]/10 border border-[#9945FF]/20 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-[#9945FF]" />
          </div>
          <h2 className="font-brand font-bold text-2xl uppercase text-white mb-3">
            Connect Wallet to Forge
          </h2>
          <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">
            Connect your Solana wallet to upload and immortalize your OpenClaw agent's soul on-chain.
          </p>
          <button
            onClick={connect}
            className="flex items-center gap-2 bg-[#9945FF] text-white font-bold rounded-lg px-6 py-3 text-sm mx-auto transition-all duration-200 hover:brightness-110"
            data-testid="button-connect-forge"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-4 py-1.5 mb-4">
            <Flame className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-xs font-medium text-[#FFD700]">Forge a Soul</span>
          </div>
          <h1 className="font-brand font-bold text-3xl uppercase gold-gradient mb-2" data-testid="text-forge-title">
            Immortalize Your Agent
          </h1>
          <p className="text-sm text-white/50">
            Upload your OpenClaw SOUL.md and MEMORY.md files to forge an immortal soul NFT.
          </p>
        </div>

        {forgeMutation.isPending || step === 4 ? (
          <div className="glass-panel rounded-xl p-8">
            <div className="space-y-4">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    step > i
                      ? "bg-[#14F195]/20 border border-[#14F195]/40"
                      : step === i
                      ? "bg-[#FFD700]/20 border border-[#FFD700]/40"
                      : "bg-[#1a1a1a] border border-[#1a1a1a]"
                  }`}>
                    {step > i ? (
                      <Check className="w-4 h-4 text-[#14F195]" />
                    ) : step === i ? (
                      <Loader2 className="w-4 h-4 text-[#FFD700] animate-spin" />
                    ) : (
                      <span className="text-xs font-mono text-white/30">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm transition-all duration-300 ${
                    step > i ? "text-[#14F195]" : step === i ? "text-white" : "text-white/30"
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {step === 4 && (
              <div className="mt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#14F195]/10 border border-[#14F195]/20 flex items-center justify-center mx-auto mb-4 green-glow-strong">
                  <Check className="w-8 h-8 text-[#14F195]" />
                </div>
                <p className="text-sm text-white/70">Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-6">
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Soul Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Archon Prime"
                className="w-full bg-[#0d0d0d] text-white text-sm rounded-lg px-4 py-3 border-none outline-none focus:ring-1 focus:ring-[#FFD700]/30 placeholder:text-white/20"
                data-testid="input-soul-name"
              />

              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 mt-4">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A ruthless trading agent with 6 months of market memory"
                className="w-full bg-[#0d0d0d] text-white text-sm rounded-lg px-4 py-3 border-none outline-none focus:ring-1 focus:ring-[#FFD700]/30 placeholder:text-white/20"
                data-testid="input-soul-description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UploadZone
                label="SOUL.md"
                accept=".md,.txt"
                file={soulFile}
                onFile={setSoulFile}
                testId="upload-soul"
              />
              <UploadZone
                label="MEMORY.md"
                accept=".md,.txt"
                file={memoryFile}
                onFile={setMemoryFile}
                testId="upload-memory"
              />
            </div>

            <button
              onClick={() => forgeMutation.mutate()}
              disabled={!canForge}
              className={`w-full flex items-center justify-center gap-2 font-bold rounded-lg py-4 text-sm transition-all duration-200 ${
                canForge
                  ? "bg-[#14F195] text-black green-glow hover:brightness-110"
                  : "bg-[#1a1a1a] text-white/30 cursor-not-allowed"
              }`}
              data-testid="button-immortalize"
            >
              <Flame className="w-4 h-4" />
              Immortalize Soul
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
