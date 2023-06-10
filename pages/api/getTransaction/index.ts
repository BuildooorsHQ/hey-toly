// ./pages/api/getTransaction/index.ts
import { Request, Response } from "express";
import { CONNECTION } from "../../../constants.ts";

export async function getTransaction(req: Request, res: Response) {
  const { signature } = req.body;
  const transaction = await CONNECTION.getTransaction(signature, {
    maxSupportedTransactionVersion: 2,
  });
  res.status(200).json(transaction);
}
