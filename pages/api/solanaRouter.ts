// ./pages/api/solanaRouter.ts
import { NextApiRequest, NextApiResponse } from "next";
import getBalance from "./getBalance/index.ts";

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

    const balance = await getBalance(req);

    console.log("solanaRouter: Balance calculated", balance);

    res.status(200).json({ sol: balance });
    return;
  } catch (error) {
    console.error("solanaRouter: Error occurred", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
