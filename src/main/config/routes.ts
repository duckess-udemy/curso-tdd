import { Express, Router } from "express";
import fg from "fast-glob";
import path from "path";

const getRoute = async (filePath: string): Promise<any> => {
  let module = null;
  try {
    module = await import(
      `${path.resolve(__dirname, "../../../../", filePath)}`
    );
  } catch (error) {
    module = await import(`${path.resolve(__dirname, "../../../", filePath)}`);
  }
  return module;
};

const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use("/v1", router);

  let files = fg.sync("**/src/main/routes/**routes.js");

  if (files.length === 0) {
    files = fg.sync("**/src/main/routes/**routes.ts");
  }

  files.map(async (filePath) => (await getRoute(filePath)).default(router));
};

export { setupRoutes };
