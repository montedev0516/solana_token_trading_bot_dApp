import { PhantomProvider } from "@/utils/wallet";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from "buffer";

export async function deserializeTransaction(
  swapTransaction: string,
  wallet: PhantomProvider
) {
  try {
    try {
      console.log("swaptransaction", swapTransaction);
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      console.log("beforesigh", transaction);

      const signedTransaction = await wallet.signTransaction(transaction);

      console.log("signed transaction", signedTransaction);
      const connection = new Connection(
        "https://mainnet.helius-rpc.com/?api-key=cbf18dcf-67d6-4dff-af09-4444056c06e3"
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      console.log('blochhash', blockhash)

      const rawTransaction = signedTransaction.serialize();
      console.log('rawTransaction', rawTransaction)
      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 5,
      });
      console.log('signature before confirm', signature)

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      console.log('signature', signature)
      return signature;
    } catch (error) {
      console.error("Error while getDeserialize:", error);
      throw new Error("Error while getDeserialize");
    }
  } catch (error) {
    console.error(error);
  }
}
