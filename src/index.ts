import cron from "node-cron";
import express from "express";
import update from "./updaters";
import init from "./store";
import { getHistoricalTotal } from "./api";

(async () => {
  await init();
  await update();

  const app = express();
  app.get("/historical", getHistoricalTotal);
  
  const port = process.env.PORT || 4000;

  app.listen(port, () => console.log("API server running on port", port));

  // Update print records every day
  cron.schedule("0 0 * * *", async () => {
    await update();
  });
})();
