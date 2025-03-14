
import { PublicKey, Connection } from '@solana/web3.js';

export type WalletStatus = 'connected' | 'disconnected' | 'connecting';

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isPhantom?: boolean;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signTransaction: any;
  signAllTransactions: any;
  on: (event: string, callback: (args: any) => void) => void;
  request: (method: any, params: any) => Promise<any>;
}

export interface WalletContextType {
  wallet: PhantomProvider | null;
  publicKey: PublicKey | null;
  status: WalletStatus;
  walletAddress: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const getPhantomProvider = (): PhantomProvider | null => {
  if (typeof window !== 'undefined' && 'solana' in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  return null;
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
