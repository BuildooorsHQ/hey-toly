// ./pages/api/getTokenAccounts/index.ts
import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CONNECTION } from "../../../constants.ts";

type TokenInfo = {
  mint: string;
  amount: string;
};

export async function getTokenAccounts(req: Request, res: Response) {
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
  res.status(200).json(tokenInfos);
}
