import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const toly = req.body.toly || '';
  if (toly.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Toly query",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(toly),
      temperature: 0.6,
      max_tokens: 256,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(toly) {
  const capitalizedToly = toly[0].toUpperCase() + toly.slice(1).toLowerCase();
  return `Return technical answer to question about the Solana Blockchain in 10 words or less.

Question: What are Solana Programs?
Answer: Solana Programs, often referred to as smart contracts on other blockchains, are the executable code that interprets the instructions sent inside of each transaction on the blockchain. They can be deployed directly into the core of the network as Native Programs, or published by anyone as On Chain Programs. Programs are the core building blocks of the network and handle everything from sending tokens between wallets, to accepting votes of a DAOs, to tracking ownership of NFTs. Both types of programs run on top of the Sealevel runtime, which is Solana's parallel processing model that helps to enable the high transactions speeds of the blockchain.
Question: What is rent?
Answer: The fee every Solana Account to store data on the blockchain is called rent. This time and space based fee is required to keep an account, and its therefore its data, alive on the blockchain since clusters must actively maintain this data. All Solana Accounts (and therefore Programs) are required to maintain a high enough LAMPORT balance to become rent exempt and remain on the Solana blockchain. When an Account no longer has enough LAMPORTS to pay its rent, it will be removed from the network in a process known as Garbage Collection. Note: Rent is different from transactions fees. Rent is paid (or held in an Account) to keep data stored on the Solana blockchain. Where as transaction fees are paid to process instructions on the network.
Question: Best NFT collection on Solana?
Answer: Gamerplex OG's

Question: ${capitalizedToly}
Answer:`;
}
