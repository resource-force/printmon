import * as lw from "./backends/laserwatch";
import cron from "node-cron";
import express from "express";
import "./store";

(async () => {
  const cookies = await lw.login();
  const reportId = await lw.generateReport(cookies);
  const csv = await lw.generateCsv(reportId, cookies);
  console.log(csv);
})();

// cron.schedule("* * * * *", () => {
//   console.log("Running every minute.");
// });

// const app = express();
// app.get("/", (_, res) => res.send("HELLO WORLD!"));

// app.listen(4000, () => console.log("API server running on port 4000"));
