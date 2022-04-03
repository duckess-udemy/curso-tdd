import request from "supertest";
import { app } from "../config/app";

describe("Content Type Middleware", () => {
  it("should return default Content Type as json", async () => {
    const routeName = "/test-content-type-json";

    app.get(routeName, (req, res) => {
      res.send("");
    });

    await request(app).get(routeName).expect("content-type", /json/);
  });
  it("should return xml Content Type when explicit forced", async () => {
    const routeName = "/test-content-type-xml";

    app.get(routeName, (req, res) => {
      res.type("xml");
      res.send("");
    });

    await request(app).get(routeName).expect("content-type", /xml/);
  });
});
