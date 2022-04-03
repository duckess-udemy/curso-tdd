import env from "./config/env";
import { mongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
// import { mongoHelper } from "@infra/db/mongodb/helpers/mongo-helper"; // IDK WHY THIS DIDNT WORK???

mongoHelper
  .connect(env.mongoUrl)
  .then(async () => {
    const { app } = await import("./config/app");
    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port}`)
    );
  })
  .catch(console.error);
