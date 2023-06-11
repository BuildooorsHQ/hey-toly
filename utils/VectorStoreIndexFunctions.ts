// ./utils/VectorStoreIndexFunctions.ts

import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Searchable } from "./Searchable.ts";

export interface Function extends Searchable {}

export class VectorStoreIndexFunctions {
  private static instance: VectorStoreIndexFunctions;
  vectorStore: HNSWLib | null = null;

  private constructor() {}

  public static getInstance(): VectorStoreIndexFunctions {
    if (!VectorStoreIndexFunctions.instance) {
      VectorStoreIndexFunctions.instance = new VectorStoreIndexFunctions();
    }

    return VectorStoreIndexFunctions.instance;
  }

  async initialize() {
    const loader = new JSONLoader(
      "./path/to/function/data.json" // Specify the path to your function data file
    );
    const docs = await loader.load();

    // Load the docs into the vector store
    this.vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
  }

  async search(query: string, k: number = 1): Promise<Function[]> {
    if (!this.vectorStore) {
      throw new Error("VectorStore is not initialized");
    }

    const result = await this.vectorStore.similaritySearch(query, k);

    const functions: Function[] = [];
    for (const candidate of result) {
      if ("name" in candidate && "description" in candidate) {
        functions.push(candidate as Function);
      }
    }

    return functions;
  }
}
