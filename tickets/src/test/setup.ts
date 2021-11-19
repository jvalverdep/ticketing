import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "asdasd";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
