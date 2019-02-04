import cron from "node-cron";
import express from "express";
import updatePrintRecords from "./updaters";
import moment = require("moment");
import init from "./store";
import { getPreviousCounts } from "./api";

(async () => {
  await init();
  await updatePrintRecords();

  const app = express();
  app.get("/", async (_, res) => res.send(await getPreviousCounts()));

  app.listen(4000, () => console.log("API server running on port 4000"));

  // Update print records every day
  cron.schedule("0 0 * * *", async () => {
  });
})();
