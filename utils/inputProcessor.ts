// ./utils/inputProcessor.ts
export async function processInput(tolyInput: string): Promise<string> {
  const publicKeyRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/;
  const match = tolyInput.match(publicKeyRegex);
  const solanaFunctionMappings: Record<string, string[]> = {
    getBalance: ["balance", "show me", "how much in", "get the balance"],
    getAccountInfo: ["accountInfo"],
    getTransaction: ["transaction"],
    getAssetsByOwner: ["assetsByOwner"],
    getCollectionsByFloorPrice: ["collectionsByFloorPrice"],
    getListedCollectionNFTs: ["listedCollectionNFTs"],
    getSignaturesForAddress: ["signaturesForAddress"],
    getTokenAccounts: ["tokenAccounts"],
  };

  if (match) {
    const publicKey = match[0];
    for (const keyword in solanaFunctionMappings) {
      if (solanaFunctionMappings[keyword].some((kw) => tolyInput.includes(kw))) {
        const functionName = keyword;
        const response = await fetch("/api/solanaRouter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: publicKey, functionName }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.result;
        }
        throw new Error(
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      }
    }
  }

  // Perform the regular ChatGPT interaction
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ toly: tolyInput }),
  });

  if (response.ok) {
    const data: Record<string, string> = await response.json();

    if (data === undefined) {
      console.error("data is undefined");
      throw new Error("data is undefined");
    }
    const generatedResponse = data.completion;
    return generatedResponse;
  }
  throw new Error(
    `Request failed with status ${response.status}: ${response.statusText}`
  );
}