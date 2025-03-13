import { Token, TradeHistory, TradeParams } from "@/utils/types";
import { toast } from "sonner";

// Mock data for tokens
const mockTokens: Token[] = [
  {
    id: "1",
    name: "Solana",
    symbol: "SOL",
    price: 93.42,
    priceChange24h: 5.8,
    volume24h: 2453789054,
    logoUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
    address: "So11111111111111111111111111111111111111112",
  },
  {
    id: "2",
    name: "Raydium",
    symbol: "RAY",
    price: 0.385,
    priceChange24h: -2.1,
    volume24h: 58934201,
    logoUrl: "https://cryptologos.cc/logos/raydium-ray-logo.png",
    address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  },
  {
    id: "3",
    name: "Serum",
    symbol: "SRM",
    price: 0.051,
    priceChange24h: 1.2,
    volume24h: 12489503,
    logoUrl: "https://cryptologos.cc/logos/serum-srm-logo.png",
    address: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
  },
  {
    id: "4",
    name: "Mango",
    symbol: "MNGO",
    price: 0.021,
    priceChange24h: -3.7,
    volume24h: 5893421,
    logoUrl: "https://cryptologos.cc/logos/mango-markets-mngo-logo.png",
    address: "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac",
  },
  {
    id: "5",
    name: "Orca",
    symbol: "ORCA",
    price: 0.641,
    priceChange24h: 7.5,
    volume24h: 34562108,
    logoUrl: "https://cryptologos.cc/logos/orca-orca-logo.png",
    address: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
  },
  {
    id: "6",
    name: "Bonk",
    symbol: "BONK",
    price: 0.000024,
    priceChange24h: 15.3,
    volume24h: 456721089,
    logoUrl: "https://cryptologos.cc/logos/bonk-bonk-logo.png",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  },
];

// Mock trade history
const mockTradeHistory: TradeHistory[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 3600000),
    tokenSymbol: "SOL",
    tokenName: "Solana",
    action: "BUY",
    amount: 2.5,
    price: 91.22,
    total: 228.05,
    status: "COMPLETED",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 7200000),
    tokenSymbol: "RAY",
    tokenName: "Raydium",
    action: "SELL",
    amount: 100,
    price: 0.391,
    total: 39.1,
    status: "COMPLETED",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 86400000),
    tokenSymbol: "BONK",
    tokenName: "Bonk",
    action: "BUY",
    amount: 10000000,
    price: 0.000021,
    total: 210,
    status: "COMPLETED",
  },
];

// Function to fetch tokens
export const fetchTokens = async (): Promise<Token[]> => {
  // In a real app, this would call your GraphQL API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTokens);
    }, 500);
  });
};

// Function to search tokens
export const searchTokens = async (query: string): Promise<Token[]> => {
  // In a real app, this would call your GraphQL API with the search parameter
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockTokens.filter(
        (token) =>
          token.name.toLowerCase().includes(query.toLowerCase()) ||
          token.symbol.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, 300);
  });
};

// Function to fetch trade history
export const fetchTradeHistory = async (): Promise<TradeHistory[]> => {
  // In a real app, this would call your backend API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTradeHistory);
    }, 500);
  });
};

// Function to execute a trade
export const executeTrade = async (params: TradeParams): Promise<TradeHistory> => {
  // In a real app, this would call your backend API
  console.log("Executing trade:", params);
  
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Simulate token lookup by address
        const token = mockTokens.find((t) => t.address === params.tokenAddress);
        
        if (!token) {
          throw new Error("Token not found");
        }
        
        // Simulate trade execution
        const newTrade: TradeHistory = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
          tokenSymbol: token.symbol,
          tokenName: token.name,
          action: params.action,
          amount: params.amount,
          price: token.price,
          total: params.amount * token.price,
          status: "COMPLETED",
        };
        
        // In a real app, we would add this to our database
        mockTradeHistory.unshift(newTrade);
        
        toast.success(`${params.action === "BUY" ? "Bought" : "Sold"} ${params.amount} ${token.symbol} successfully!`);
        resolve(newTrade);
      } catch (error) {
        toast.error(`Trade failed: ${(error as Error).message}`);
        reject(error);
      }
    }, 1000);
  });
};

// Function to add a token to watchlist by address
export const addTokenToWatchlist = async (address: string): Promise<Token | null> => {
  // In a real app, this would verify the token exists and add it to the user's watchlist
  console.log("Adding token to watchlist:", address);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, we'll just pretend we added a new token
      const newToken: Token = {
        id: Math.random().toString(36).substring(2, 9),
        name: "New Token",
        symbol: "NEW",
        price: 0.001,
        priceChange24h: 25.5,
        volume24h: 1000000,
        logoUrl: "https://cryptologos.cc/logos/placeholder-logo.png",
        address: address,
      };
      
      // In a real app, we would add this to our database
      mockTokens.push(newToken);
      
      toast.success(`Added ${newToken.symbol} to watchlist!`);
      resolve(newToken);
    }, 1000);
  });
};
