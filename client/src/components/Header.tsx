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
    <svg viewBox="0 0 252 300" fill="currentColor" className={className}>
      <path d="M151.818 106.866c9.177-4.576 20.854-11.312 32.545-20.541 2.465 5.119 2.735 9.586 1.465 13.193-.9 2.542-2.596 4.753-4.826 6.512-2.415 1.901-5.431 3.285-8.765 4.033-6.326 1.425-13.712.593-20.419-3.197m1.591 46.886l12.148 7.017c-24.804 13.902-31.547 39.716-39.557 64.859-8.009-25.143-14.753-50.957-39.556-64.859l12.148-7.017a5.95 5.95 0 003.84-5.845c-1.113-23.547 5.245-33.96 13.821-40.249 3.076-2.258 6.795-3.874 11.301-4.907 4.507 1.033 8.225 2.649 11.301 4.907 8.576 6.289 14.934 16.702 13.821 40.249a5.95 5.95 0 003.733 5.845m-75.233-52.015c-11.692 9.229-23.369 15.965-32.546 20.541-6.707 3.79-14.093 4.622-20.418 3.197-3.335-.748-6.351-2.132-8.766-4.033-2.23-1.759-3.925-3.97-4.826-6.512-1.27-3.607-1-8.074 1.465-13.193 11.691-9.229 23.369-15.965 32.545-20.541 6.707-3.79 14.093-4.622 20.418-3.197 3.335.748 6.351 2.132 8.766 4.033 2.23 1.759 3.925 3.97 4.826 6.512 1.27 3.607 1 8.074-1.464 13.193M126 0c14.042 0 27.67 14.939 35.498 38.749a101.937 101.937 0 01-12.332-2.36C143.532 34.822 135.334 34 126 34c-9.334 0-17.532.822-23.166 2.389a101.89 101.89 0 01-12.332 2.36C98.33 14.939 111.958 0 126 0m-25.818 106.866c-9.176-4.576-20.854-11.312-32.545-20.541-2.465 5.119-2.735 9.586-1.465 13.193.901 2.542 2.597 4.753 4.826 6.512 2.415 1.901 5.431 3.285 8.766 4.033 6.325 1.425 13.711.593 20.418-3.197M126 300l-9-9c-28.243-28.243-51.279-58.348-69.168-90.313l12.193-7.043c27.316 14.58 34.082 44.073 42.675 72.154a254.91 254.91 0 0023.3-34.511c6.848-12.227 12.552-24.911 17.118-37.825l12.193 7.043C137.279 232.652 154.243 262.757 126 300" />
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