import { MongoClient } from 'mongodb';

export default async function connectDb() {
  const client = await new MongoClient(process.env.MONGO_URL || '').connect();
  return client.db('horus');
}
