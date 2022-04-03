import { Express } from "express";
import { bodyParser, cors, contentType } from "../middlewares";

const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};

export { setupMiddlewares };
