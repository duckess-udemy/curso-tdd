import request from "supertest";
import { app } from "../config/app";

describe("SignUp Routes", () => {
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
