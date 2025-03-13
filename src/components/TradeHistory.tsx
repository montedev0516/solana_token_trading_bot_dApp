
import { useEffect, useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { fetchTradeHistory } from "@/lib/api";
import { TradeHistory as TradeHistoryType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TradeHistory() {
  const [trades, setTrades] = useState<TradeHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTradeHistory = async () => {
    try {
      const data = await fetchTradeHistory();
      setTrades(data);
    } catch (error) {
      console.error("Failed to fetch trade history:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTradeHistory();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTradeHistory();
  };

  return (
    <Card className="glass-panel h-full animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Trade History</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <TradeHistorySkeleton key={i} />
            ))}
          </div>
        ) : trades.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No trade history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trades.map((trade) => (
              <TradeHistoryItem key={trade.id} trade={trade} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TradeHistoryItemProps {
  trade: TradeHistoryType;
}

function TradeHistoryItem({ trade }: TradeHistoryItemProps) {
  const isBuy = trade.action === "BUY";
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50 hover:border-border transition-colors">
      <div className="flex items-center">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center mr-3",
          isBuy ? "bg-success-light text-success" : "bg-destructive/10 text-destructive"
        )}>
          {isBuy ? (
            <ArrowUpCircle className="h-5 w-5" />
          ) : (
            <ArrowDownCircle className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="font-medium">{isBuy ? "Bought" : "Sold"} {trade.tokenSymbol}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(trade.timestamp), "MMM d, h:mm a")}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{trade.amount} {trade.tokenSymbol}</p>
        <p className="text-xs text-muted-foreground">${trade.total.toFixed(2)} at ${trade.price.toFixed(6)}</p>
      </div>
    </div>
  );
}

function TradeHistorySkeleton() {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
      <div className="flex items-center">
        <Skeleton className="h-8 w-8 rounded-full mr-3" />
        <div>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-5 w-16 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
