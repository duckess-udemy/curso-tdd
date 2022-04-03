import request from "supertest";
import { mongoHelper } from "@infra/db/mongodb/helpers/mongo-helper";
import { app } from "../config/app";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
  });
  beforeEach(async () => {
    const accountCollection = await mongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await mongoHelper.disconnect();
  });
  it("should return an account on success", async () => {
    const testData = {
      name: "valid-name",
      email: "valid-email@mail.com",
      password: "valid-password",
      passwordConfirmation: "valid-password",
    };

    await request(app).post("/v1/signup").send(testData).expect(200);
  });
});
