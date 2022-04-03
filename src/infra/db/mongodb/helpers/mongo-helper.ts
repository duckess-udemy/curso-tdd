import { Collection, MongoClient, InsertOneResult, Document } from "mongodb";
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

  map(result: InsertOneResult<Document>, data: any): any {
    return {
      ...data,
      id: String(result.insertedId),
    };
  }
}

export const mongoHelper = new MongoHelper();
