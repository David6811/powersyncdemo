import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
// npm install mongodb
// npm install @types/mongodb --save-dev

const uri = "mongodb://xuwei19850423:OoOMdNaqqCR3FyIX@clusterpowersyncdemo-shard-00-02.9dax1.mongodb.net/powersync?ssl=true&authSource=admin";

// Create a global variable to hold the MongoDB client
let client: MongoClient;

// Function to initialize the client
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      socketTimeoutMS: 30000,
    });
    await client.connect();
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await client.db("admin").command({ ping: 1 });
    return NextResponse.json("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
