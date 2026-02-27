import { useWallet } from "@/lib/wallet";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";

export function WalletButton() {
  const { connected, connect, disconnect, shortenedAddress } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (shortenedAddress) {
      navigator.clipboard.writeText(shortenedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-[#0a0a0a]/80 border border-[#1a1a1a] rounded-lg px-3 py-2 text-xs font-mono text-white/60 transition-all duration-200 hover:text-white hover:border-[#6B7B8D]/30"
          data-testid="button-copy-address"
        >
          {copied ? <Check className="w-3 h-3 text-[#8A9AAD]" /> : <Copy className="w-3 h-3" />}
          {shortenedAddress}
        </button>
        <button
          onClick={disconnect}
          className="flex items-center gap-2 bg-[#6B7B8D] text-white font-bold rounded-lg px-4 py-2 text-xs transition-all duration-200 hover:brightness-110"
          data-testid="button-disconnect-wallet"
        >
          <LogOut className="w-3 h-3" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="flex items-center gap-2 bg-[#6B7B8D] text-white font-bold rounded-lg px-4 py-2.5 text-sm transition-all duration-200 hover:brightness-110"
      data-testid="button-connect-wallet"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}
