// ./pages/api/solanaRouters.ts
import { NextApiRequest, NextApiResponse } from "next";
import getBalance from "./getBalance/index.ts";
import getAccountInfo from "./getAccountInfo/index.ts";
import getTransaction from "./getTransaction/index.ts";
import getAssetsByOwner from "./getAssetsByOwner/index.ts";
import getCollectionsByFloorPrice from "./getCollectionsByFloorPrice/index.ts";
import getListedCollectionNFTs from "./getListedCollectionNFTs/index.ts";
import getSignaturesForAddress from "./getSignaturesForAddress/index.ts";
import getTokenAccounts from "./getTokenAccounts/index.ts";

export default async function solanaRouter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    console.log("solanaRouter: Request received", req.body);

    const { functionName } = req.body;

    if (functionName === "getBalance") {
      await getBalance(req, res);
    } else if (functionName === "getAccountInfo") {
      await getAccountInfo(req, res);
    } else if (functionName === "getAssetsByOwner") {
      await getAssetsByOwner(req, res);
    } else if (functionName === "getTransaction") {
      await getTransaction(req, res);
    } else if (functionName === "getCollectionsByFloorPrice") {
      await getCollectionsByFloorPrice(req, res);
    } else if (functionName === "getListedCollectionNFTs") {
      await getListedCollectionNFTs(req, res);
    } else if (functionName === "getSignaturesForAddress") {
      await getSignaturesForAddress(req, res);
    } else if (functionName === "getTokenAccounts") {
      await getTokenAccounts(req, res);
    } else {
      throw new Error(`Unknown function: ${functionName}`);
    }
  } catch (error) {
    console.error("solanaRouter: Error occurred", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
