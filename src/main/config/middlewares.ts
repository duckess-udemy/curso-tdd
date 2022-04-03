import { Express } from "express";
import { bodyParser, cors } from "../middlewares";

const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
};

export { setupMiddlewares };
