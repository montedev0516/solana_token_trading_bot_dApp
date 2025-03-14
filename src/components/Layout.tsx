
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "@/components/WalletConnectButton";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn(
      "min-h-screen w-full overflow-hidden bg-gradient-to-b from-background to-background/90",
      className
    )}>
      <Header />
      <main className="container mx-auto px-4 py-6 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isHistory = location.pathname === '/history';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-solana to-blue-500 flex items-center justify-center">
            <X className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-xl">Solana Trader</span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2">
            <Button 
              asChild 
              variant={isHome ? "default" : "outline"}
              size="sm"
            >
              <Link to="/">Dashboard</Link>
            </Button>
            <Button 
              asChild 
              variant={isHistory ? "default" : "outline"}
              size="sm"
            >
              <Link to="/history">Trade History</Link>
            </Button>
          </nav>
          <WalletConnectButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6 mt-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Solana Trader. All rights reserved.</p>
        <p>Trading simulated tokens on Solana testnet only. No real assets are used.</p>
      </div>
    </footer>
  );
}
