import { Collection, MongoClient } from "mongodb";

class MongoHelper {
  client: MongoClient;
  async connect(): Promise<void> {
    this.client = await MongoClient.connect(String(process.env.MONGO_URL));
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  }
}

export const mongoHelper = new MongoHelper();
