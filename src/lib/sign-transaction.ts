import { PhantomProvider } from "@/utils/wallet";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from 'buffer';


export async function deserializeTransaction(swapTransaction: string, wallet: PhantomProvider) {
  try {
    try {
        console.log('swaptransaction', swapTransaction)
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      const signature = wallet.signTransaction(transaction);

      console.log('signed transaction', transaction);
      return transaction;
    } catch (error) {
      console.error("Error while getDeserialize:", error);
      throw new Error("Error while getDeserialize");
    }
  } catch (error) {
    console.error(error);
  }
}
