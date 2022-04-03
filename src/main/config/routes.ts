import { Express, Router } from "express";
import fg from "fast-glob";

const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use("/v1", router);

  fg.sync("**/src/main/routes/**routes.ts").map(async (filePath) =>
    (await import(`../../../${filePath}`)).default(router)
  );
};

export { setupRoutes };
