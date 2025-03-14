import { PhantomProvider } from "./wallet";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  logoUrl: string;
  address: string;
  decimal: number;
}


export interface TradeHistory {
  id: string;
  timestamp: Date;
  tokenSymbol: string;
  tokenName: string;
  action: 'BUY' | 'SELL';
  amount: number;
  price: number;
  total: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface TradeParams {
  walletAddress: string
  tokenAddress: string;
  amount: number;
  slippageTolerance: number;
  stopLossPrice: number | null;
  action: 'Buy' | 'Sell';
  decimal: number;
  wallet: PhantomProvider
}

export type TradingMode = 'AUTO' | 'MANUAL';
