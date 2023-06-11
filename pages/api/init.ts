// ./pages/api/init.ts
import { NextApiRequest, NextApiResponse } from "next";
import { vectorStoreInstance } from "../../utils/VectorStore.ts";

let initialized = false;

export default async function init(
  _req: NextApiRequest,
  res: NextApiResponse<{ status: string }>
) {
  if (!initialized) {
    try {
      await vectorStoreInstance.initialize();
      initialized = true;
      res.status(200).json({ status: "VectorStore initialized" });
    } catch (error) {
      console.error("Error during VectorStore initialization", error);
      res.status(500).json({ status: "Failed to initialize VectorStore" });
    }
  } else {
    res.status(200).json({ status: "VectorStore already initialized" });
  }
}
