// utils/VectorStore.ts
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { JSONLoader } from "langchain/document_loaders/fs/json";

export interface Project {
  name: string;
  description: string;
  category: string;
  link: string;
}

export class VectorStore {
  vectorStore: HNSWLib | null = null;

  // Define the default project.
  static defaultProject: Project = {
    name: "Hey Toly",
    description:
      "AI powered agent to help discover the Solana ecosystem do cool shit on-chain | OPOS",
    category: "AI",
    link: "http://heytoly.com",
  };

  async initialize() {
    const loader = new JSONLoader(
      "./pages/scraper/puppeteer-solana-ecosystem.json"
    );
    const docs = await loader.load();

    // Load the docs into the vector store
    this.vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
  }
}

// Create a global instance
export const vectorStoreInstance = new VectorStore();
