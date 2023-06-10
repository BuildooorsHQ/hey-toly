// ./utils/inputProcessor.ts
export async function processInput(tolyInput: string): Promise<string> {
  const publicKeyRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/;
  const match = tolyInput.match(publicKeyRegex);

  if (match) {
    // Directly retrieve the wallet balance for a valid Solana wallet address
    const publicKey = match[0];
    const balanceResponse = await fetch("/api/solanaRouter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: publicKey }),
    });

    if (balanceResponse.ok) {
      const balanceData = await balanceResponse.json();
      const balance = balanceData.sol;
      return `Wallet Balance: ${balance}`;
    } else {
      throw new Error(
        `Request failed with status ${balanceResponse.status}: ${balanceResponse.statusText}`
      );
    }
  } else {
    // Perform the regular ChatGPT interaction
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toly: tolyInput }),
    });

    console.log("Index response: ", response);

    if (response.ok) {
      const data: Record<string, string> = await response.json();

      console.log("Index data: ", data);

      if (data === undefined) {
        console.error("data is undefined");
      } else {
        const generatedResponse = data.completion;
        return generatedResponse;
      }
    } else {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }
  }
}
