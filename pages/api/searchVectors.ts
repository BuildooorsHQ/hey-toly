// ./pages/api/searchVectors.ts
import { NextApiRequest, NextApiResponse } from "next";
import { VectorStoreIndexProjects } from "../../utils/VectorStoreIndexProjects.ts";
import { VectorStoreIndexFunctions } from "../../utils/VectorStoreIndexFunctions.ts";
import { Searchable } from "../../utils/Searchable.ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Searchable | { error: string }>
) {
  const { query }: { query: string } = req.body;

  try {
    const vectorStoreIndexProjects = VectorStoreIndexProjects.getInstance();
    const [projectResult] = await vectorStoreIndexProjects.search(query);

    const vectorStoreIndexFunctions = VectorStoreIndexFunctions.getInstance();
    const [functionResult] = await vectorStoreIndexFunctions.search(query);

    let result: Searchable | null = null;

    if (projectResult) {
      result = projectResult;
    }

    if (!result && functionResult) {
      result = functionResult;
    }

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "No matching vectors found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error searching for vectors" });
  }
}
