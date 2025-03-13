
import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { addTokenToWatchlist } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SnipeFormProps {
  onTokenAdded: () => void;
}

export function SnipeForm({ onTokenAdded }: SnipeFormProps) {
  const [tokenAddress, setTokenAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddToken = async () => {
    if (!tokenAddress.trim()) {
      setError("Token address is required");
      return;
    }

    // Simple validation for Solana address-like format
    if (tokenAddress.length < 32) {
      setError("Invalid Solana token address format");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await addTokenToWatchlist(tokenAddress);
      setTokenAddress("");
      onTokenAdded();
    } catch (error) {
      console.error("Failed to add token:", error);
      setError("Failed to add token to watchlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-panel animate-slide-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Target className="h-5 w-5 mr-2 text-primary" />
          Snipe New Token
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token-address">Token Address</Label>
            <div className="relative">
              <Input
                id="token-address"
                placeholder="Enter Solana token address..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className={cn(error && "border-destructive")}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          
          <Button 
            onClick={handleAddToken} 
            disabled={isSubmitting} 
            className="w-full group"
          >
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            {isSubmitting ? "Adding..." : "Add to Watchlist"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Add any Solana token to your watchlist by its address to track and trade it
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
