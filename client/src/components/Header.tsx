import { WalletButton } from "./WalletButton";
import { Link, useLocation } from "wouter";
import { Home, Rocket, Bot, Radio, Globe, Menu, X } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/forge", label: "Launch", icon: Rocket },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/ecosystem", label: "Ecosystem", icon: Globe },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/[0.10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2.5 cursor-pointer" data-testid="link-logo">
              <span className="font-brand font-extrabold text-[28px] tracking-tight uppercase text-white" data-testid="text-brand-logo">ADCLAW</span>
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
                        ? "text-white bg-white/[0.08]"
                        : "text-white/70 hover:text-white hover:bg-white/[0.04]"
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
                href="https://github.com/adclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                data-testid="link-github"
              >
                <SiGithub className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/adclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                data-testid="link-x"
              >
                <SiX className="w-3.5 h-3.5" />
              </a>
            </div>
            <WalletButton />
            <button
              className="md:hidden text-white/70 hover:text-white transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/[0.10]">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-white bg-white/[0.08]"
                        : "text-white/70 hover:text-white"
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
            <div className="flex items-center gap-2 px-3 pt-3 mt-2 border-t border-white/[0.10]">
              <a
                href="https://github.com/adclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white transition-all duration-200"
                data-testid="link-mobile-github"
              >
                <SiGithub className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://x.com/adclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white transition-all duration-200"
                data-testid="link-mobile-x"
              >
                <SiX className="w-3.5 h-3.5" />
                <span className="text-sm">X</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
