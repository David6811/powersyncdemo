import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
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

// Handles PUT requests to add a customer
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { _id, name, email } = body;
  await connectToDatabase();
  const newCustomer = {
    _id: new ObjectId(_id),
    id: _id,
    name,
    email,
  };

  const insertResult = await client.db("powersync").collection("customers").insertOne(newCustomer);
  return NextResponse.json({ message: 'Customer added successfully', id: insertResult.insertedId });
}


