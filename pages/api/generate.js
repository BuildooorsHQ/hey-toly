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
  const capitalizedToly =
    toly[0].toUpperCase() + toly.slice(1).toLowerCase();
  return `Suggest three names for a blockchain that is a superhero.

Toly: Solana
Names: Flash Gordon, Speedy Gonzales, Lightspeed Linus
Toly: Ethereum
Names: OG, Solidity Sam, TVL Tom
Toly: ${capitalizedToly}
Names:`;
}
