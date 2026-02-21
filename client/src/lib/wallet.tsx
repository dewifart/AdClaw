import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface WalletContextType {
  connected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
  shortenedAddress: string | null;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  connect: () => {},
  disconnect: () => {},
  shortenedAddress: null,
});

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
    setAddress(null);
    setConnected(false);
  }, []);

  const shortenedAddress = address ? shortenAddress(address) : null;

  return (
    <WalletContext.Provider value={{ connected, address, connect, disconnect, shortenedAddress }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
