import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51K4SC7GieOYPdQpZa9rYkWo587OY3e1UTCCTyvKzZ1FraZqXdiRKYO8tV1uTs28QJm4BeWW84mVWyQumuhBxufNA00NUmH7mLt";

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
