import express, { Request, Response } from "express";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CONNECTION } from "../constants.ts";

const app = express();

function errorHandle(
  handler: (req: Request, res: Response<any, Record<string, any>>) => Promise<void>
) {
  return (req: Request, res: Response<any, Record<string, any>>) => {
    handler(req, res).catch((error: Error) => {
      console.error(error);
      res.status(500).send({ message: "An error occurred" });
    });
  };
}

app.post(
  "/getBalance",
  errorHandle(async (req: Request, res: Response) => {
    const { address } = req.body;
    const balance = await CONNECTION.getBalance(new PublicKey(address));
    res.status(200).send({ sol: balance / LAMPORTS_PER_SOL });
  })
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
