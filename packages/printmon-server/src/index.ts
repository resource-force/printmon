import cron from "node-cron";
import update from "./updaters";
import init from "./store";
import server from "./express";
import program from "commander";
import { version } from "../package.json";
import { cwd } from "process";

(async () => {
  program
    .version(version)
    .option(
      "-d, --data-directory [directory]",
      "Data directory to store SQLite DB in (default: current directory)"
    )
    .parse(process.argv);

  const dataDirectory: string = program.dataDirectory || cwd();

  await init(dataDirectory);
  // await update();
  server();
  // Update print records every day
  cron.schedule("0 0 * * *", async () => {
    await update();
  });
})();
