
export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  logoUrl: string;
  address: string;
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
  tokenAddress: string;
  amount: number;
  slippageTolerance: number;
  stopLossPrice: number | null;
  action: 'BUY' | 'SELL';
}

export type TradingMode = 'AUTO' | 'MANUAL';
