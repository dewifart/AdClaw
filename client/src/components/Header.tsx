import { WalletButton } from "./WalletButton";
import { Link, useLocation } from "wouter";
import { Flame, LayoutDashboard, Hammer, Store, Radio, Menu, X } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";
import { useState } from "react";
import crabLogo from "@assets/soulclaw-crab-v2.png";

const PLACEHOLDER_TOKEN_ADDRESS = "YOUR_TOKEN_ADDRESS_HERE";

const navItems = [
  { href: "/", label: "Home", icon: Flame },
  { href: "/forge", label: "Forge", icon: Hammer },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

function DexScreenerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 14l3-4 3 2 4-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2.5 cursor-pointer" data-testid="link-logo">
              <img src={crabLogo} alt="SoulClaw" className="h-11 w-11 object-contain drop-shadow-[0_0_10px_rgba(255,45,85,0.6)]" data-testid="img-logo-crab" />
              <span className="font-brand font-extrabold text-[28px] tracking-tight uppercase text-[#FF2D55] drop-shadow-[0_0_12px_rgba(255,45,85,0.6)]" style={{textShadow: '0 0 20px rgba(255,45,85,0.4), 0 2px 4px rgba(0,0,0,0.8)'}} data-testid="text-brand-logo">SOULCLAW</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-white bg-white/5"
                        : "text-white/60 hover:text-white"
                    }`}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <a
                href="https://github.com/soulclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
                data-testid="link-github"
              >
                <SiGithub className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/soulclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
                data-testid="link-x"
              >
                <SiX className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://dexscreener.com/solana/${PLACEHOLDER_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/40 hover:text-[#00FFFF] hover:bg-white/5 transition-all duration-200"
                data-testid="link-dexscreener"
              >
                <DexScreenerIcon className="w-4 h-4" />
              </a>
            </div>
            <WalletButton />
            <button
              className="md:hidden text-white/60 hover:text-white transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-[#1a1a1a]">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-white bg-white/5"
                        : "text-white/60 hover:text-white"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
            <div className="flex items-center gap-2 px-3 pt-3 mt-2 border-t border-[#1a1a1a]">
              <a
                href="https://github.com/soulclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white transition-all duration-200"
                data-testid="link-mobile-github"
              >
                <SiGithub className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://x.com/soulclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white transition-all duration-200"
                data-testid="link-mobile-x"
              >
                <SiX className="w-3.5 h-3.5" />
                <span className="text-sm">X</span>
              </a>
              <a
                href={`https://dexscreener.com/solana/${PLACEHOLDER_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-[#00FFFF] transition-all duration-200"
                data-testid="link-mobile-dexscreener"
              >
                <DexScreenerIcon className="w-4 h-4" />
                <span className="text-sm">DexScreener</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}