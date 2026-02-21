import { WalletButton } from "./WalletButton";
import { Link, useLocation } from "wouter";
import { Flame, LayoutDashboard, Hammer, Store, Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import crabLogo from "@assets/gemini-2.5-flash-image_the_crab_needs_to_hold_the_hammer_with__1771656994477.jpg";
import soulclawText from "@assets/flux-kontext-max_exact_same_bold_thick_rounded_chunky_sans-ser_1771657081305.jpg";

const navItems = [
  { href: "/", label: "Home", icon: Flame },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forge", label: "Forge", icon: Hammer },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/inherit", label: "Inherit", icon: Zap },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-1.5 cursor-pointer" data-testid="link-logo">
              <img src={crabLogo} alt="SoulClaw" className="h-10 w-10 object-contain" data-testid="img-logo-crab" />
              <img src={soulclawText} alt="SOULCLAW" className="h-7 object-contain" data-testid="img-logo-text" />
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
          </nav>
        </div>
      )}
    </header>
  );
}