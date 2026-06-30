import { MongoClient } from 'mongodb';

const uri = process.env.NUXT_MONGODB_URI;

if (!uri) {
  throw new Error(
    'Error: NUXT_MONGODB_URI variable is not defined in environment variables.',
  );
}

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
};
export const client: MongoClient =
  globalForMongo._mongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== 'production') {
  globalForMongo._mongoClient = client;
}

export const connectDB = async () => {
  await client.connect();
  return { client, db: client.db() };
};

export default connectDB;
