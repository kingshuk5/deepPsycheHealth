import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";

if (!uri && process.env.NODE_ENV === "production") {
  throw new Error("MONGODB_URI environment variable is not set.");
}

/**
 * In development, reuse the MongoClient across hot-reloads.
 * In production, create a fresh client per serverless invocation.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV !== "production") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(dbName = "deeppsyche"): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
