// ./pages/api/getTokenAccounts/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CONNECTION } from "../../../constants.ts";

type TokenInfo = {
  mint: string;
  amount: string;
};

export default async function getTokenAccounts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("getTokenAccounts: Request received", req.body);

    // Perform your logic here to retrieve the token accounts for the given address
    const result = await CONNECTION.getParsedTokenAccountsByOwner(
      new PublicKey(req.body.address),
      { programId: TOKEN_PROGRAM_ID },
      "confirmed"
    );

    const tokenInfos: TokenInfo[] = [];
    for (const {
      account: {
        data: {
          parsed: { info },
        },
      },
    } of result.value) {
      if (info.tokenAmount.uiAmount !== "0") {
        tokenInfos.push({
          mint: info.mint.toString(),
          amount: info.tokenAmount.uiAmountString,
        });
      }
    }

    console.log("getTokenAccounts: Token accounts retrieved", tokenInfos);

    res.status(200).json(tokenInfos);
  } catch (error) {
    console.error("getTokenAccounts: Error occurred", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
