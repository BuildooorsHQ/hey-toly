// ./pages/api/getAssetsByOwner/index.ts
import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { HELIUS_URL } from "../../../constants.ts";

/**
 * Returns the data from the Metaplex Read API
 * @param address
 * @param page (optional) page number
 * @param limit (optional) set to 5 to prevent overflowing GPT context window
 * @returns
 */
const _getAssetsByOwner = async (address: string, number = 1, number = 5) => {
  const sortBy = {
    sortBy: "created",
    sortDirection: "asc",
  };
  const before = "";
  const after = "";
  const { data } = await axios.post(HELIUS_URL, {
    jsonrpc: "2.0",
    id: "my-id",
    method: "getAssetsByOwner",
    params: [address, sortBy, limit, page, before, after],
  });
  return data.result;
};

export default async function getAssetsByOwner(req: Request, res: Response) {
  try {
    console.log("getAssetsByOwner: Request received", req.body);

    const { address } = req.body;

    // Perform your logic here to retrieve the assets owned by the given address
    const assets = await _getAssetsByOwner(address);

    console.log("getAssetsByOwner: Assets retrieved", assets);

    res.status(200).send({ message: JSON.stringify(assets) });
  } catch (error) {
    console.error("getAssetsByOwner: Error occurred", error);
    res.status(500).send({ error: error.message });
  }
}
