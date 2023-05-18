import { ChatOpenAI, HumanChatMessage } from "langchain";
import saveToDb from "./saveToDb.js";

function generatePrompt(toly) {
  const capitalizedToly = toly[0].toUpperCase() + toly.slice(1).toLowerCase();
  return `give me a technical answer to the question: "${capitalizedToly}"`;
}

export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured correctly",
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
    const chat = new ChatOpenAI({ temperature: 0, apiKey: process.env.OPENAI_API_KEY });
    const response = await chat.call([
      new HumanChatMessage(generatePrompt(toly)),
    ]);

    const removeEscapedCharacters = (str) => str.replace(/\\n/g, '\n');
    const text = removeEscapedCharacters(response.choices[0].message.content);

    res.status(200).json({ completion: text });
    saveToDb("heytoly", "faqs", { toly, result: text });
  } catch (error) {
    // Error handling
    console.error(`Error with Langchain API request: ${error.message}`);

    if (error.response) {
      // The request was made and the API responded with an error
      console.error(`API response status: ${error.response.status}`);
      console.error(`API response data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`No response received from the API. Request details: ${error.request}`);
    } else {
      // Other types of errors
      console.error(`Error message: ${error.message}`);
    }

    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      },
    });
  }
}