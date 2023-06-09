// ./pages/api/generate.js
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
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
 const chat = new ChatOpenAI({ temperature: 0.9, apiKey: process.env.OPENAI_API_KEY, modelName: "gpt-3.5-turbo" });
 // Add some logging statements to check the input and options
 console.log([new SystemChatMessage("You are a technical FAQ chatbot that answers questions about Solana Blockchain with a cheeky degen tone."), new HumanChatMessage(generatePrompt(toly))]);

 console.log({ temperature: chat.temperature, apiKey: process.env.OPENAI_API_KEY ? "VALID" : "INVALID" });

 const response = await chat.call([
 // Add a SystemChatMessage as the first message
 new SystemChatMessage("You are a technical FAQ chatbot that answers questions about Solana Blockchain with a cheeky degen tone."),
 new HumanChatMessage(generatePrompt(toly)),
 ]);

 // Add a console log output of the response
 console.log("Generate API Response 1: ", response);

 const { text } = response;

 console.log("Generate Text: ", text);

 // Send the text as the completion
 res.status(200).json({ completion: text });
 saveToDb("heytoly", "faqs", { toly, result: text });
} catch (error) {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 console.error(error);
 res.status(500).json({
 error: {
 message: "An error occurred",
 },
 });
}
}
