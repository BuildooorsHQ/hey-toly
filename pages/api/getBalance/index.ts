// ./pages/api/getBalance/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CONNECTION } from "../../../constants.ts";

export default async function getBalance(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("getBalance: Request received", req.body);

    const { address } = req.body;

    // Perform your logic here to calculate the balance
    const balance = await CONNECTION.getBalance(new PublicKey(address));
    const calculatedBalance = balance / LAMPORTS_PER_SOL;

    console.log("getBalance: Balance calculated", calculatedBalance);

    res.status(200).json({ sol: calculatedBalance });
  } catch (error) {
    console.error("getBalance: Error occurred", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
