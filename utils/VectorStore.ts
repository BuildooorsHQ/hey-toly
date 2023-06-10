// ./utils/VectorStore.ts
import { HNSWLib } from "langchain/vectorstores/hnswlib";

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
}
