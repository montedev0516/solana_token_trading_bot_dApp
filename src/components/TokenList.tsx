
import { useEffect, useState } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { fetchTokens, searchTokens } from "@/lib/api";
import { Token } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TokenListProps {
  onSelectToken: (token: Token) => void;
}

export function TokenList({ onSelectToken }: TokenListProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTokens();
        setTokens(data);
        setFilteredTokens(data);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (query.trim() === "") {
      setFilteredTokens(tokens);
      return;
    }

    try {
      const results = await searchTokens(query);
      setFilteredTokens(results);
    } catch (error) {
      console.error("Failed to search tokens:", error);
    }
  };

  return (
    <div className="space-y-4 section-transition">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <TokenCardSkeleton key={i} />
            ))
          : filteredTokens.map((token) => (
              <TokenCard
                key={token.id}
                token={token}
                onSelectToken={onSelectToken}
              />
            ))}

        {!isLoading && filteredTokens.length === 0 && (
          <div className="col-span-full text-center py-6">
            <p className="text-muted-foreground">
              No tokens found matching &quot;{search}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TokenCardProps {
  token: Token;
  onSelectToken: (token: Token) => void;
}

function TokenCard({ token, onSelectToken }: TokenCardProps) {
  const priceChangeFormatted = token.priceChange24h.toFixed(2);
  const isPriceUp = token.priceChange24h >= 0;
  const formattedPrice = token.price < 0.01 
    ? token.price.toExponential(2) 
    : token.price.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 6 
      });

  return (
    <Card className="token-card overflow-hidden card-hover-effect">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-secondary flex-shrink-0 mr-3">
            <img
              src={token.logoUrl}
              alt={token.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://cryptologos.cc/logos/placeholder-logo.png";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{token.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{token.symbol}</p>
          </div>
        </div>

        <div className="px-4 pb-4 pt-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-semibold">${formattedPrice}</span>
            <div
              className={cn(
                "flex items-center px-2 py-0.5 rounded text-xs",
                isPriceUp
                  ? "bg-success-light text-success-dark"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {isPriceUp ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {isPriceUp ? "+" : ""}
              {priceChangeFormatted}%
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              24h Vol: ${(token.volume24h / 1000000).toFixed(2)}M
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onSelectToken(token)}
              className="transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TokenCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0 mr-3" />
          <div className="flex-1">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="px-4 pb-4 pt-0">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>

          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-16 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
