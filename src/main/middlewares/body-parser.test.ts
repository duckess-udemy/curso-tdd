import request from "supertest";
import { app } from "../config/app";

describe("Body Parser Middleware", () => {
  it("should parse body as json", async () => {
    const routeName = "/test-body-parser";

    app.post(routeName, (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post(routeName)
      .send({ name: "Mateus" })
      .expect({ name: "Mateus" });
  });
});
