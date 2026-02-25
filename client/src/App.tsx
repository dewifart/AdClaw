import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/lib/wallet";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Header } from "@/components/Header";
import Home from "@/pages/home";

import Forge from "@/pages/forge";
import Marketplace from "@/pages/marketplace";
import Live from "@/pages/live";
import Ecosystem from "@/pages/ecosystem";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/forge" component={Forge} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/live" component={Live} />
      <Route path="/ecosystem" component={Ecosystem} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <AuroraBackground />
          <div className="relative z-10">
            <Header />
            <Router />
          </div>
          <Toaster />
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
