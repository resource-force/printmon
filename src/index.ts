import cron from "node-cron";
import express from "express";
import fetchIntoDb from "./fetch-into-db";
import moment = require("moment");

(async () => {
  // await fetchIntoDb(moment("2011-01-01"), moment("2019-01-24"));
})();

// cron.schedule("* * * * *", () => {
//   console.log("Running every minute.");
// });

// const app = express();
// app.get("/", (_, res) => res.send("HELLO WORLD!"));

// app.listen(4000, () => console.log("API server running on port 4000"));
