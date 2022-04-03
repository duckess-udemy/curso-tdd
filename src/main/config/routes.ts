import { Express, Router } from "express";
import fg from "fast-glob";
import path from "path";

const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use("/v1", router);

  fg.sync("**/src/main/routes/**routes.ts").map(async (filePath) =>
    (await import(`${path.join(__dirname, "../../../", filePath)}`)).default(
      router
    )
  );
};

export { setupRoutes };
