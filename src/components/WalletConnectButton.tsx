
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { shortenAddress } from "@/utils/wallet";
import { Loader2, Wallet } from "lucide-react";

export function WalletConnectButton() {
  const { status, connect, disconnect, walletAddress } = useWallet();

  return (
    <>
      {status === 'connected' ? (
        <Button 
          variant="outline"
          size="sm" 
          onClick={disconnect}
          className="text-sm border-border/40 bg-background/80 hover:bg-secondary/80"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {shortenAddress(walletAddress)}
        </Button>
      ) : status === 'connecting' ? (
        <Button disabled size="sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </Button>
      ) : (
        <Button 
          onClick={connect} 
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </>
  );
}
