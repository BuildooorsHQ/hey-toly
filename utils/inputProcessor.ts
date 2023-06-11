// ./utils/inputProcessor.ts
import { Project } from "./VectorStoreIndexProjects.ts";
import { Function } from "./VectorStoreIndexFunctions.ts";
import logInteraction from "./logInteraction.ts";

function formatSearchResult(data: Project | Function): string {
  return "name" in data && "description" in data && "link" in data
    ? `Name: ${data.name}\nDescription: ${data.description}\nLink: ${data.link}`
    : `Name: ${data.name}\nDescription: ${data.description}`;
}

export async function processInput(userInput: string): Promise<string> {
  logInteraction(userInput, "");

  const publicKeyRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/;
  const match = userInput.match(publicKeyRegex);
  const solanaFunctionMappings: Record<string, string[]> = {
    getBalance: ["balance", "show me", "how much in", "get the balance"],
    getAccountInfo: ["accountInfo", "account info", "account"],
    getTransaction: ["transaction", "get transaction"],
    getAssetsByOwner: ["assetsByOwner", "get assets by owner", "by owner"],
    getCollectionsByFloorPrice: [
      "collectionsByFloorPrice",
      "collections by floor price",
    ],
    getListedCollectionNFTs: ["listedCollectionNFTs", "listed collection nfts"],
    getSignaturesForAddress: ["signaturesForAddress", "signatures for address"],
    getTokenAccounts: ["tokenAccounts", "get token accounts", "token accounts"],
  };

  for (const keyword in solanaFunctionMappings) {
    if (solanaFunctionMappings[keyword].some((kw) => userInput.includes(kw))) {
      console.log("Keyword found:", keyword);

      const functionName = keyword;
      const publicKey = match ? match[0] : null;
      const solanaResponse = await fetch("/api/solanaRouter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: publicKey, functionName }),
      });

      if (solanaResponse.ok) {
        const data = await solanaResponse.json();
        console.log("Response from solanaRouter:", data);
        return data.sol.toString(); // Use data.sol instead of data.result
      }
      throw new Error(
        `Request failed with status ${solanaResponse.status}: ${solanaResponse.statusText}`
      );
    }
  }

  const vectorResponse = await fetch("/api/searchVectors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: userInput }),
  });

  if (vectorResponse.ok) {
    const data: Project | Function = await vectorResponse.json();
    console.log("Response from vector search:", data);
    return formatSearchResult(data);
  }

  const generateResponse = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ toly: userInput }),
  });

  if (generateResponse.ok) {
    const data: Record<string, string> = await generateResponse.json();
    console.log("Response from /api/generate:", data);

    if (data === undefined) {
      console.error("data is undefined");
      throw new Error("data is undefined");
    }
    const generatedResponse = data.completion;
    logInteraction("", generatedResponse);
    return generatedResponse;
  }
  throw new Error(
    `Request failed with status ${generateResponse.status}: ${generateResponse.statusText}`
  );
}
