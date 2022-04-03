import request from "supertest";
import { app } from "../config/app";

describe("CORS Middleware", () => {
  it("should enable cors", async () => {
    const routeName = "/test-cors";

    app.get(routeName, (req, res) => {
      res.send();
    });

    await request(app)
      .get(routeName)
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-methods", "*")
      .expect("access-control-allow-headers", "*");
  });
});
