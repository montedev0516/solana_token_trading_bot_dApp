
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { TokenList } from "@/components/TokenList";
import { TradingPanel } from "@/components/TradingPanel";
import { SnipeForm } from "@/components/SnipeForm";
import { Token, TradingMode } from "@/utils/types";

const Index = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tradingMode, setTradingMode] = useState<TradingMode>("MANUAL");
  const [refreshTokens, setRefreshTokens] = useState(0);

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
    // Scroll to trading panel on mobile
    if (window.innerWidth < 768) {
      document.getElementById("trading-panel")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTradeComplete = () => {
    // Trigger a refresh of the tokens
    setRefreshTokens((prev) => prev + 1);
  };

  const handleTokenAdded = () => {
    // Trigger a refresh of the token list
    setRefreshTokens((prev) => prev + 1);
  };

  const handleTradingModeChange = (mode: TradingMode) => {
    setTradingMode(mode);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Solana Token Trading Bot
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Execute simulated trades on Solana tokens. Search for tokens, set your parameters, and trade with ease. All trades are simulated on the Solana testnet.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TokenList onSelectToken={handleSelectToken} key={`tokens-${refreshTokens}`} />
          </div>
          
          <div className="space-y-6">
            <div id="trading-panel">
              <TradingPanel 
                selectedToken={selectedToken}
                onTradeComplete={handleTradeComplete}
                tradingMode={tradingMode}
                onTradingModeChange={handleTradingModeChange}
              />
            </div>
            
            <SnipeForm onTokenAdded={handleTokenAdded} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
