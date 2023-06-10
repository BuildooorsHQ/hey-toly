// ./pages/api/getTransaction/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { CONNECTION } from "../../../constants.ts";

export default async function getTransaction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("getTransaction: Request received", req.body);

    const { signature } = req.body;

    // Perform your logic here to retrieve the transaction
    const transaction = await CONNECTION.getTransaction(signature, {
      maxSupportedTransactionVersion: 2,
    });

    console.log("getTransaction: Transaction retrieved", transaction);

    // send back the transaction data
    res.status(200).json({ transaction });
  } catch (error) {
    console.error("getTransaction: Error occurred", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
