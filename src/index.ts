import * as lw from "./LaserWatchApi";

(async () => {
  const cacheId = await lw.generateReport();
  console.log("Generated report with cache ID", cacheId);
  console.log(await lw.generateCsv(cacheId));
})();
