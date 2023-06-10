// ./pages/api/getSignaturesForAddress/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import { CONNECTION } from "../../../constants.ts";

export default async function getSignaturesForAddress(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("getSignaturesForAddress: Request received", req.body);

    const accountAddress = new PublicKey(req.body.address);

    // Perform your logic here to retrieve the signatures for the address
    const signatures = await CONNECTION.getSignaturesForAddress(
      accountAddress,
      {
        limit: 11,
        before: req.body.beforeSignature ?? null,
        until: req.body.untilSignature ?? null,
      }
    );

    console.log("getSignaturesForAddress: Signatures retrieved", signatures);

    res.status(200).json({
      hasMore: signatures.length === 11,
      nextPage:
        signatures.length === 11
          ? { beforeSignature: signatures[10].signature }
          : null,
      signatures: JSON.stringify(signatures),
    });
  } catch (error) {
    console.error("getSignaturesForAddress: Error occurred", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
