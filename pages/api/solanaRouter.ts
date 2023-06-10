import { NextApiRequest, NextApiResponse } from "next";
import { getBalance } from "./getBalance/index.ts";
import { getAccountInfo } from "./getAccountInfo/index.ts";
import { getTransaction } from "./getTransaction/index.ts";
import { getAssetsByOwner } from "./getAssetsByOwner/index.ts";
import { getCollectionsByFloorPrice } from "./getCollectionsByFloorPrice/index.ts";
import { getListedCollectionNFTs } from "./getListedCollectionNFTs/index.ts";
import { getSignaturesForAddress } from "./getSignaturesForAddress/index.ts";
import { getTokenAccounts } from "./getTokenAccounts/index.ts";

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

    if (req.url === "/getBalance") {
      const balance = await getBalance(req);
      console.log("solanaRouter: Balance calculated", balance);
      res.status(200).json({ sol: balance });
    } else if (req.url === "/getAccountInfo") {
      const accountInfo = await getAccountInfo(req);
      console.log("solanaRouter: Account info retrieved", accountInfo);
      res.status(200).json({ accountInfo });
    } else if (req.url === "/getAssetsByOwner") {
      const assets = await getAssetsByOwner(req);
      console.log("solanaRouter: Assets retrieved", assets);
      res.status(200).json({ assets });
    } else if (req.url === "/getTransaction") {
      const transaction = await getTransaction(req);
      console.log("solanaRouter: Transaction retrieved", transaction);
      res.status(200).json({ transaction });
    } else if (req.url === "/getCollectionsByFloorPrice") {
      const collections = await getCollectionsByFloorPrice(req);
      console.log("solanaRouter: Collections retrieved", collections);
      res.status(200).json({ collections });
    } else if (req.url === "/getListedCollectionNFTs") {
      const listedNFTs = await getListedCollectionNFTs(req);
      console.log("solanaRouter: Listed NFTs retrieved", listedNFTs);
      res.status(200).json({ listedNFTs });
    } else if (req.url === "/getSignaturesForAddress") {
      const signatures = await getSignaturesForAddress(req);
      console.log("solanaRouter: Signatures retrieved", signatures);
      res.status(200).json({ signatures });
    } else if (req.url === "/getTokenAccounts") {
      const tokenAccounts = await getTokenAccounts(req);
      console.log("solanaRouter: Token accounts retrieved", tokenAccounts);
      res.status(200).json({ tokenAccounts });
    } else {
      throw new Error("Unknown endpoint");
    }
  } catch (error) {
    console.error("solanaRouter: Error occurred", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
