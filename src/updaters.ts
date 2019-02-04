import * as lw from "./backends/laserwatch";
import { KV, PrintRecord, PrintRecordData } from "./store";
import moment from "moment";

export default async function updatePrintRecords() {
  const cookies = await lw.login();
  console.log("Successfully logged into LaserWatch.");
  const startDate = moment(
    (await KV.findOne({ where: { k: "last_record_fetch_time" } }))!.dataValues.v
  );
  const endDate = moment();
  console.log("Fetching records from", startDate, "to", endDate);
  const records = await lw.fetchUnitsOutput(cookies, startDate, endDate);
  let values: PrintRecordData[] = [];
  for (const deviceRecord of records) {
    values = values.concat(
      deviceRecord.values.map(value => ({
        deviceId: deviceRecord.deviceId,
        count: value.count,
        firstReportedAt: new Date(value.firstReportedAt),
        lastReportedAt: new Date(value.lastReportedAt)
      }))
    );
  }
  console.log("# of records to add:", values.length);
  await PrintRecord.bulkCreate(values, { ignoreDuplicates: true });
  await KV.upsert({ k: "last_record_fetch_time", v: endDate.toISOString() });
}
