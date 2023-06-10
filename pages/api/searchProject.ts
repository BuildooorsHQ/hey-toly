// pages/api/searchProject.ts

import { NextApiRequest, NextApiResponse } from "next";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { VectorStore, Project } from "../../utils/VectorStore.ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project | { error: string }>
) {
  const { query }: { query: string } = req.body;

  try {
    const loader = new JSONLoader(
      "./pages/scraper/puppeteer-solana-ecosystem.json"
    );
    const docs = await loader.load();

    // Load the docs into the vector store
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );

    const result = await vectorStore.similaritySearch(query, 1);

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
