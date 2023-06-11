// ./pages/api/searchProject.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  Project,
  VectorStore,
  vectorStoreInstance,
} from "../../utils/VectorStore.ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project | { error: string }>
) {
  if (!vectorStoreInstance.vectorStore) {
    res.status(500).json({ error: "VectorStore is not initialized" });
    return;
  }

  const { query }: { query: string } = req.body;

  try {
    const result = await vectorStoreInstance.vectorStore.similaritySearch(
      query,
      1
    );
    console.log("Search project result: ", result);

    let mostSimilarProject: Project = VectorStore.defaultProject;
    if (result.length > 0) {
      const candidateProject = result[0];
      if (
        "name" in candidateProject &&
        "description" in candidateProject &&
        "category" in candidateProject &&
        "link" in candidateProject
      ) {
        mostSimilarProject = candidateProject as Project;
      }
    }

    res.status(200).json(mostSimilarProject);
  } catch (err) {
    res.status(500).json({ error: "Error searching for similar project" });
  }
}
