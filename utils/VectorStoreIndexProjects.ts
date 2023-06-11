// ./utils/VectorStoreIndexProjects.ts
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Searchable } from "./Searchable.ts";

export interface Project extends Searchable {
  category: string;
  link: string;
}
export class VectorStoreIndexProjects {
  private static instance: VectorStoreIndexProjects;
  vectorStore: HNSWLib | null = null;

  private constructor() {}

  public static getInstance(): VectorStoreIndexProjects {
    if (!VectorStoreIndexProjects.instance) {
      VectorStoreIndexProjects.instance = new VectorStoreIndexProjects();
    }

    return VectorStoreIndexProjects.instance;
  }

  async initialize() {
    const loader = new JSONLoader(
      "./pages/scraper/solana-projects.json" // Specify the path to your project data file
    );

    let docs;
    try {
      docs = await loader.load();
      console.log("Successfully loaded Solana projects data.");
    } catch (err) {
      console.error("Error while loading Solana projects data: ", err);
      throw err;
    }

    try {
      // Load the docs into the vector store
      this.vectorStore = await HNSWLib.fromDocuments(
        docs,
        new OpenAIEmbeddings()
      );
      console.log("Successfully initialized VectorStore.");
    } catch (err) {
      console.error("Error while initializing VectorStore: ", err);
      throw err;
    }
  }

  async search(query: string, k: number = 1): Promise<Project[]> {
    if (!this.vectorStore) {
      throw new Error("VectorStore is not initialized");
    }

    let result;
    try {
      result = await this.vectorStore.similaritySearch(query, k);
      console.log(
        `Successfully completed similarity search with query "${query}".`
      );
    } catch (err) {
      console.error(
        `Error while conducting similarity search with query "${query}": `,
        err
      );
      throw err;
    }

    const projects: Project[] = [];
    for (const candidate of result) {
      if (
        "name" in candidate &&
        "description" in candidate &&
        "category" in candidate &&
        "link" in candidate
      ) {
        projects.push(candidate as Project);
      }
    }

    return projects;
  }
}
