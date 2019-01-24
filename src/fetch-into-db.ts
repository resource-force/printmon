import * as lw from "./backends/laserwatch";
import init from "./store";
import { Moment } from "moment";

export default async function fetchIntoDb(startDate: Moment, endDate: Moment) {
  const db = await init();
  console.log("Initialized DB.");
  const cookies = await lw.login();
  console.log("Successfully logged into LaserWatch.");
  const records = await lw.fetchUnitsOutput(cookies, startDate, endDate);
  let count = 0;
  for (const deviceRecord of records) {
    count++;
    console.log(
      "[",
      (count / records.length) * 100,
      "%] Adding for device",
      deviceRecord.deviceId
    );

    const values = deviceRecord.values.map(value => ({
      deviceId: deviceRecord.deviceId,
      count: value.count,
      firstReportedAt: new Date(value.firstReportedAt),
      lastReportedAt: new Date(value.lastReportedAt)
    }));

    await db.PrintRecord.bulkCreate(values);
  }
  await db.KV.upsert({ k: "last_record_fetch_time", v: endDate.toISOString() });
}
