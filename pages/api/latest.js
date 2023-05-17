import { MongoClient } from 'mongodb';

export default async function getFreshRecords(req, res) {
    try {
        // Connect to the MongoDB database
        const uri = process.env.MONGO_URI; // replace with your MongoDB URI
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Select the collection
        const db = client.db('heytoly'); // replace with your database name
        const targetCollection = db.collection('faqs');

        // Find the freshest 20 records
        const query = {};
        const options = { sort: { timestampField: -1 }, limit: 20 };
        const records = await targetCollection.find(query, options).toArray();

        console.log('Freshest 20 records:', records);
        // Close the database connection
        await client.close();

        return res.status(200).json(records);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}
