// ./constants.ts
import { Connection } from "@solana/web3.js";
import { HyperspaceClient } from "hyperspace-client-js";

export const PORT = process.env.PORT || 3000;
export const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
export const CONNECTION = new Connection(SOLANA_RPC_URL);
export const HELIUS_URL = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;
export const HYPERSPACE_CLIENT = new HyperspaceClient(
  process.env.HYPERSPACE_API_KEY as string
);
