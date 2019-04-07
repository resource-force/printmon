import cron from "node-cron";
import express from "express";
import update from "./updaters";
import init from "./store";
import { getHistoricalTotal } from "./api";

(async () => {
  await init();
  await update();

  const app = express();
  // Allow all CORS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/historical", getHistoricalTotal);

  const port = process.env.PORT || 4005;

  app.listen(port, () => console.log("API server running on port", port));

  // Update print records every day
  cron.schedule("0 0 * * *", async () => {
    await update();
  });
})();
