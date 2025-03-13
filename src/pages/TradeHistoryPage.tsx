
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { fetchTradeHistory } from "@/lib/api";
import { TradeHistory as TradeHistoryType } from "@/utils/types";
import { format } from "date-fns";
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const TradeHistoryPage = () => {
  const [trades, setTrades] = useState<TradeHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const loadTradeHistory = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTradeHistory();
      setTrades(data);
      setTotalPages(Math.max(1, Math.ceil(data.length / itemsPerPage)));
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

  const paginatedTrades = trades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Trade History
            </h1>
            <p className="text-muted-foreground mt-2">
              View all your past trades and transactions
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </section>

        <Card className="bg-card border-border/40">
          <CardHeader className="pb-2">
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <TradeHistorySkeleton key={i} />
                ))}
              </div>
            ) : paginatedTrades.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No trade history found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedTrades.map((trade) => (
                  <TradeHistoryItem key={trade.id} trade={trade} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)} 
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

interface TradeHistoryItemProps {
  trade: TradeHistoryType;
}

function TradeHistoryItem({ trade }: TradeHistoryItemProps) {
  const isBuy = trade.action === "BUY";
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:border-border transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center",
          isBuy ? "bg-success-light text-success" : "bg-destructive/10 text-destructive"
        )}>
          {isBuy ? (
            <ArrowUpCircle className="h-6 w-6" />
          ) : (
            <ArrowDownCircle className="h-6 w-6" />
          )}
        </div>
        <div>
          <p className="font-medium text-lg">{isBuy ? "Bought" : "Sold"} {trade.tokenSymbol}</p>
          <p className="text-sm text-muted-foreground">{format(new Date(trade.timestamp), "MMMM d, yyyy · h:mm a")}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">{trade.amount} {trade.tokenSymbol}</p>
        <p className="text-sm text-muted-foreground">${trade.total.toFixed(2)} at ${trade.price.toFixed(6)}</p>
      </div>
    </div>
  );
}

function TradeHistorySkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-6 w-20 mb-2" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

export default TradeHistoryPage;
