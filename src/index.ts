import * as lw from "./LaserWatchApi";
import cron from "node-cron";
import express from "express";

// (async () => {
//   const cacheId = await lw.generateReport();
//   console.log("Generated report with cache ID", cacheId);
//   console.log(await lw.generateCsv(cacheId));
// })();

cron.schedule("* * * * *", () => {
  console.log("Running every minute.");
});

const app = express();
app.get("/", (_, res) => res.send("HELLO WORLD!"));

app.listen(4000, () => console.log("API server running on port 4000"));
