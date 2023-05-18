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
 const chat = new ChatOpenAI({ temperature: 0, apiKey: process.env.OPENAI_API_KEY, modelName: "gpt-3.5-turbo" });
 // Add some logging statements to check the input and options
 console.log([new SystemChatMessage("This is a technical FAQ chatbot that answers questions about Toly."), new HumanChatMessage(generatePrompt(toly))]);
 console.log({ temperature: 0.9, apiKey: process.env.OPENAI_API_KEY });
 const response = await chat.call([
 // Add a SystemChatMessage as the first message
 new SystemChatMessage("This is a technical FAQ chatbot that answers questions about Toly."),
 new HumanChatMessage(generatePrompt(toly)),
 ]);

 // Add a console log output of the response
 console.log(response);

 // Check if the response is valid and has choices
 if (response && response.choices && response.choices.length > 0) {
 // Get the first choice and its message
 const choice = response.choices[0];
 const { message } = choice;
 
 // Check if the message is valid and has content
 if (message && message.content) {
 // Remove escaped characters from the content
 const removeEscapedCharacters = (str) => str.replace(/\\n/g, '\n');
 const text = removeEscapedCharacters(message.content);

 // Send the text as the completion
 res.status(200).json({ completion: text });
 saveToDb("heytoly", "faqs", { toly, result: text });
 } else {
 // The message is invalid or has no content
 throw new Error("The message is invalid or has no content");
 }
 } else {
 // The response is invalid or has no choices
 throw new Error("The response is invalid or has no choices");
 }
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
