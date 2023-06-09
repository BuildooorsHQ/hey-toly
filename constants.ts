// ./constants.ts
import { Connection } from "@solana/web3.js";

export const PORT = process.env.PORT || 3000;
export const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
export const CONNECTION = new Connection(SOLANA_RPC_URL);
