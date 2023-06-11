// ./pages/api/init.ts

import { NextApiRequest, NextApiResponse } from "next";
import { VectorStoreIndexProjects } from "../../utils/VectorStoreIndexProjects.ts";
import { VectorStoreIndexFunctions } from "../../utils/VectorStoreIndexFunctions.ts";

export default async function init(
  _req: NextApiRequest,
  res: NextApiResponse<{ status: string }>
) {
  try {
    const vectorStoreIndexProjects = VectorStoreIndexProjects.getInstance();
    await vectorStoreIndexProjects.initialize();

    const vectorStoreIndexFunctions = VectorStoreIndexFunctions.getInstance();
    await vectorStoreIndexFunctions.initialize();

    res.status(200).json({ status: "VectorStores initialized" });
  } catch (error) {
    console.error("Error during VectorStore initialization", error);
    res.status(500).json({ status: "Failed to initialize VectorStores" });
  }
}
