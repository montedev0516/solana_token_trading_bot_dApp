
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getPhantomProvider, PhantomProvider, WalletStatus, WalletContextType } from '@/utils/wallet';
import { toast } from 'sonner';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<PhantomProvider | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [status, setStatus] = useState<WalletStatus>('disconnected');

  // Initialize wallet
  useEffect(() => {
    const provider = getPhantomProvider();
    if (provider) {
      setWallet(provider);
      
      // Check if already connected
      if (provider.publicKey) {
        setPublicKey(provider.publicKey);
        setStatus('connected');
      }

      // Listen for account changes
      provider.on('connect', (publicKey: PublicKey) => {
        setPublicKey(publicKey);
        setStatus('connected');
      });

      provider.on('disconnect', () => {
        setPublicKey(null);
        setStatus('disconnected');
      });
    }
  }, []);

  const connect = async () => {
    try {
      if (!wallet) {
        window.open('https://phantom.app/', '_blank');
        toast.error("Phantom wallet not found! Please install it first.");
        return;
      }

      setStatus('connecting');
      const { publicKey } = await wallet.connect();
      setPublicKey(publicKey);
      setStatus('connected');
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('disconnected');
      toast.error("Failed to connect wallet");
    }
  };

  const disconnect = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setPublicKey(null);
        setStatus('disconnected');
        toast.success("Wallet disconnected");
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error("Failed to disconnect wallet");
    }
  };

  const walletAddress = publicKey ? publicKey.toString() : '';

  return (
    <WalletContext.Provider 
      value={{ 
        wallet, 
        publicKey, 
        status, 
        walletAddress, 
        connect, 
        disconnect 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
