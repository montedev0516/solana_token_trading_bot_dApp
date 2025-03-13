
import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Sliders, BellDot } from "lucide-react";
import { Token, TradeParams } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { executeTrade } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TradingPanelProps {
  selectedToken: Token | null;
  onTradeComplete: () => void;
  tradingMode: 'AUTO' | 'MANUAL';
  onTradingModeChange: (mode: 'AUTO' | 'MANUAL') => void;
}

export function TradingPanel({
  selectedToken,
  onTradeComplete,
  tradingMode,
  onTradingModeChange,
}: TradingPanelProps) {
  const [amount, setAmount] = useState<string>("");
  const [slippageTolerance, setSlippageTolerance] = useState<string>("1");
  const [stopLossPrice, setStopLossPrice] = useState<string>("");
  const [isBuying, setIsBuying] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasStopLoss, setHasStopLoss] = useState<boolean>(false);

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal points
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleStopLossChange = (value: string) => {
    // Only allow numbers and decimal points
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      setStopLossPrice(value);
    }
  };

  const calculateTotal = (): number => {
    if (!selectedToken || !amount || isNaN(parseFloat(amount))) return 0;
    return parseFloat(amount) * selectedToken.price;
  };

  const handleSubmit = async () => {
    if (!selectedToken) return;
    
    try {
      setIsSubmitting(true);
      
      const params: TradeParams = {
        tokenAddress: selectedToken.address,
        amount: parseFloat(amount),
        slippageTolerance: parseFloat(slippageTolerance),
        stopLossPrice: hasStopLoss ? parseFloat(stopLossPrice) : null,
        action: isBuying ? "BUY" : "SELL",
      };
      
      await executeTrade(params);
      
      // Reset form
      setAmount("");
      setStopLossPrice("");
      
      // Notify parent component
      onTradeComplete();
    } catch (error) {
      console.error("Trade execution failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPriceUp = selectedToken?.priceChange24h && selectedToken.priceChange24h >= 0;
  
  return (
    <Card className="glass-panel animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Trading Panel</CardTitle>
            <CardDescription>Execute simulated trades on Solana testnet</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {tradingMode === "MANUAL" ? "Manual" : "Auto"}
            </span>
            <Switch
              checked={tradingMode === "AUTO"}
              onCheckedChange={(checked) => onTradingModeChange(checked ? "AUTO" : "MANUAL")}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedToken ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Sliders className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Token Selected</h3>
            <p className="text-muted-foreground max-w-md">
              Select a token from the list to begin trading. You'll be able to simulate buying and selling tokens with various parameters.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-secondary">
                <img
                  src={selectedToken.logoUrl}
                  alt={selectedToken.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/placeholder-logo.png";
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedToken.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedToken.symbol}</span>
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded",
                      isPriceUp
                        ? "bg-success-light text-success-dark"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {isPriceUp ? "+" : ""}
                    {selectedToken.priceChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${selectedToken.price.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 6 
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vol: ${(selectedToken.volume24h / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="buy" onValueChange={(value) => setIsBuying(value === "buy")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" className="data-[state=active]:bg-success-light data-[state=active]:text-success">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive">Sell</TabsTrigger>
              </TabsList>
              <TabsContent value="buy" className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Buy ({selectedToken.symbol})</Label>
                    <Input
                      id="amount"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slippage">Slippage Tolerance</Label>
                      <Select value={slippageTolerance} onValueChange={setSlippageTolerance}>
                        <SelectTrigger id="slippage">
                          <SelectValue placeholder="Select slippage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5%</SelectItem>
                          <SelectItem value="1">1%</SelectItem>
                          <SelectItem value="2">2%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="stopLoss" className="flex items-center gap-1">
                          <span>Stop Loss</span>
                          <BellDot className={cn("h-3.5 w-3.5", hasStopLoss ? "text-warning" : "text-muted-foreground")} />
                        </Label>
                        <Switch 
                          checked={hasStopLoss} 
                          onCheckedChange={setHasStopLoss} 
                          className="scale-75"
                        />
                      </div>
                      <Input
                        id="stopLoss"
                        placeholder="0.00"
                        value={stopLossPrice}
                        onChange={(e) => handleStopLossChange(e.target.value)}
                        disabled={!hasStopLoss}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-sm pb-2">
                      <span className="text-muted-foreground">Total Cost</span>
                      <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full group bg-success hover:bg-success-dark"
                      disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
                      onClick={handleSubmit}
                    >
                      <ArrowUpCircle className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                      {isSubmitting ? "Processing..." : "Buy Token"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sell" className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sell-amount">Amount to Sell ({selectedToken.symbol})</Label>
                    <Input
                      id="sell-amount"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sell-slippage">Slippage Tolerance</Label>
                      <Select value={slippageTolerance} onValueChange={setSlippageTolerance}>
                        <SelectTrigger id="sell-slippage">
                          <SelectValue placeholder="Select slippage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5%</SelectItem>
                          <SelectItem value="1">1%</SelectItem>
                          <SelectItem value="2">2%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sell-stopLoss" className="flex items-center gap-1">
                          <span>Stop Loss</span>
                          <BellDot className={cn("h-3.5 w-3.5", hasStopLoss ? "text-warning" : "text-muted-foreground")} />
                        </Label>
                        <Switch 
                          checked={hasStopLoss} 
                          onCheckedChange={setHasStopLoss} 
                          className="scale-75"
                        />
                      </div>
                      <Input
                        id="sell-stopLoss"
                        placeholder="0.00"
                        value={stopLossPrice}
                        onChange={(e) => handleStopLossChange(e.target.value)}
                        disabled={!hasStopLoss}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-sm pb-2">
                      <span className="text-muted-foreground">Total Return</span>
                      <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full group bg-destructive hover:bg-destructive/90"
                      disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
                      onClick={handleSubmit}
                    >
                      <ArrowDownCircle className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                      {isSubmitting ? "Processing..." : "Sell Token"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
