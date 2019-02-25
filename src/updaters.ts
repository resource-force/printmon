import * as lw from "./backends/laserwatch";
import { KV, PrintRecord, PrintRecordData, DeviceRecord } from "./store";
import moment from "moment";

export default async function update() {
  const cookies = await lw.login();
  console.log("Successfully logged into LaserWatch.");
  await updatePrintRecords(cookies);
  await updateDevices(cookies);
}

async function updatePrintRecords(cookies: string) {
  const lastFetchTime = await KV.findOne({
    where: { k: "last_record_fetch_time" }
  });
  const startDate = moment(
    lastFetchTime ? lastFetchTime.dataValues.v : "2011-01-01"
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
        delta: value.delta,
        firstReportedAt: new Date(value.firstReportedAt),
        lastReportedAt: new Date(value.lastReportedAt)
      }))
    );
  }
  console.log("# of records to add:", values.length);
  await PrintRecord.bulkCreate(values, { ignoreDuplicates: true });
  await KV.upsert({ k: "last_record_fetch_time", v: endDate.toISOString() });
}

async function updateDevices(cookies: string) {
  const devices = await lw.fetchDevices(cookies);
  await DeviceRecord.bulkCreate(
    devices.map(device => ({ name: device.name, id: device.id })),
    { ignoreDuplicates: true }
  );
}
