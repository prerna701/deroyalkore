import { Db, MongoClient } from 'mongodb';
import { env } from './env';

let client: MongoClient | null = null;
let db: Db | null = null;
let connectionPromise: Promise<Db> | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      const mongoClient = new MongoClient(env.MONGO_URI, {
        maxPoolSize: env.MONGO_MAX_POOL_SIZE,
        serverSelectionTimeoutMS: env.MONGO_SERVER_SELECTION_TIMEOUT_MS,
        connectTimeoutMS: env.MONGO_CONNECT_TIMEOUT_MS,
      });

      await mongoClient.connect();
      client = mongoClient;
      db = mongoClient.db(env.MONGO_DB_NAME);

      await Promise.all([
        db.collection('treatments').createIndex({ slug: 1 }, { unique: true }),
        db.collection('treatments').createIndex({ createdAt: -1 }),
        db.collection('treatments').createIndex({ title: 'text', about: 'text' }),
        db.collection('faqs').createIndex({ createdAt: -1 }),
        db.collection('beforeAfterCases').createIndex({ createdAt: -1 }),
        db.collection('contacts').createIndex({ createdAt: -1 }),
        db.collection('galleries').createIndex({ createdAt: -1 }),
        db.collection('appointments').createIndex({ createdAt: -1 }),
        db.collection('appointments').createIndex({ status: 1 }),
        db.collection('users').createIndex({ email: 1 }, { unique: true }),
      ]);

      return db;
    })();
  }

  return connectionPromise;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    connectionPromise = null;
  }
}

export async function getCollection<T extends object = Record<string, unknown>>(name: string) {
  const database = await connectToDatabase();
  return database.collection<T>(name);
}

export async function getDatabase(): Promise<Db> {
  return connectToDatabase();
}
