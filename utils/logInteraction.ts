// ./utils/logInteraction.ts
// import { MongoClient } from "mongodb";

export default async function logInteraction(
  userInput: string,
  chatbotResponse: string
) {
  console.log("User input: ", userInput);
  console.log("Chatbot output: ", chatbotResponse);
  // try {
  //   const uri = process.env.MONGO_URI;
  //   const client = new MongoClient(uri, { useUnifiedTopology: true });
  //   await client.connect();

  //   const db = client.db("heytoly");
  //   const interactionsCollection = db.collection("interactions");

  //   const result = await interactionsCollection.insertOne({
  //     userInput,
  //     chatbotResponse,
  //     timestamp: new Date().toISOString(),
  //   });

  //   console.log(`Inserted interaction with _id: ${result.insertedId}`);
  //   await client.close();
  // } catch (error) {
  //   console.error(error);
  // }
}
