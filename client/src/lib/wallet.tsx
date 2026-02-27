import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface WalletContextType {
  connected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  shortenedAddress: string | null;
  sendSol: (amount: number) => Promise<{ success: boolean; signature?: string; error?: string }>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
  shortenedAddress: null,
  sendSol: async () => ({ success: false }),
});

const ADCLAW_TREASURY = "SCLAWxKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJo";

function generateWalletAddress(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let result = "";
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      const phantom = (window as any)?.solana;
      if (phantom?.isPhantom) {
        const response = await phantom.connect();
        const addr = response.publicKey.toString();
        setAddress(addr);
        setConnected(true);
        return;
      }
    } catch (err) {
      // Phantom rejected or errored
    }
    const addr = generateWalletAddress();
    setAddress(addr);
    setConnected(true);
  }, []);

  const disconnect = useCallback(() => {
    const phantom = (window as any)?.solana;
    if (phantom?.isPhantom) {
      try { phantom.disconnect(); } catch {}
    }
    setAddress(null);
    setConnected(false);
  }, []);

  const sendSol = useCallback(async (amount: number): Promise<{ success: boolean; signature?: string; error?: string }> => {
    try {
      const phantom = (window as any)?.solana;
      if (!phantom?.isPhantom) {
        return { success: false, error: "phantom_not_installed" };
      }

      if (!phantom.isConnected) {
        await phantom.connect();
      }

      const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = await import("@solana/web3.js");
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

      const fromPubkey = phantom.publicKey;
      const toPubkey = new PublicKey(ADCLAW_TREASURY);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const { signature } = await phantom.signAndSendTransaction(transaction);
      return { success: true, signature };
    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.includes("rejected")) {
        return { success: false, error: "rejected" };
      }
      return { success: false, error: err?.message || "Transaction failed" };
    }
  }, []);

  const shortenedAddress = address ? shortenAddress(address) : null;

  return (
    <WalletContext.Provider value={{ connected, address, connect, disconnect, shortenedAddress, sendSol }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
