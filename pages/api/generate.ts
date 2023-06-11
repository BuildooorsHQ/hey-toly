// ./pages/api/generate.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SystemChatMessage, HumanChatMessage } from "langchain/schema";
import logInteraction from "../../utils/logInteraction.ts";

function generatePrompt(toly: string): string {
  const capitalizedToly = toly[0].toUpperCase() + toly.slice(1).toLowerCase();
  return `give me a technical answer to the question: "${capitalizedToly}"`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured correctly",
      },
    });
    return;
  }

  const toly: string = req.body.toly || "";
  if (toly.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Toly query",
      },
    });
    return;
  }

  try {
    const chat = new ChatOpenAI({
      temperature: 0.9,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
    });

    // Add some logging statements to check the input and options
    console.log([
      new SystemChatMessage(
        "You are a technical FAQ chatbot that answers questions about Solana Blockchain with a cheeky degen tone."
      ),
      new HumanChatMessage(generatePrompt(toly)),
    ]);

    console.log({
      temperature: chat.temperature,
      apiKey: process.env.OPENAI_API_KEY ? "VALID" : "INVALID",
    });

    const response = await chat.call([
      // Add a SystemChatMessage as the first message
      new SystemChatMessage(
        "You are a technical FAQ chatbot that answers questions about Solana Blockchain with a cheeky degen tone."
      ),
      new HumanChatMessage(generatePrompt(toly)),
    ]);

    // Add a console log output of the response
    console.log("Generate API Response 1: ", response);

    const { text } = response;

    console.log("Generate Text: ", text);

    // Send the text as the completion
    res.status(200).json({ completion: text });

    await logInteraction(toly, text); // Log the interaction to the database
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "An error occurred",
      },
    });
  }
}
