import * as lw from "./laserwatch";
import { FetchHistory, Meter, MeterData, Device, sequelize } from "./store";
import moment from "moment";
import { MeterTypes, DeviceMeterSummary } from "./laserwatch/types";
import { Transaction } from "sequelize";
import Groups from "./laserwatch/groups";

const METERS: string[] = Object.values(MeterTypes);
const START_DATE = moment("2001-01-01");
const GROUP = Groups.ACTON_PUBLIC_SCHOOLS;

async function addMeterData(
  type: MeterTypes,
  data: DeviceMeterSummary[],
  transaction: Transaction
) {
  let values: MeterData[] = [];
  for (const deviceRecord of data) {
    values = values.concat(
      deviceRecord.values.map(value => ({
        deviceId: deviceRecord.deviceId,
        type,
        count: value.count,
        delta: value.delta,
        firstReportedAt: new Date(value.firstReportedAt),
        lastReportedAt: new Date(value.lastReportedAt)
      }))
    );
  }
  console.log("# of records to add:", values.length);
  await Meter.bulkCreate(values, { ignoreDuplicates: true, transaction });
}

export default async function update() {
  console.log("Beginning DB update.");
  // 1. Log into LaserWatch.
  const fetcher = await lw.login();
  console.log("Successfully logged into LaserWatch.");

  // 2. Fetch the list of devices in the high school group and update the local
  // table.
  await sequelize.transaction(async t => {
    const newDevices = await updateDevices(fetcher, t);
    console.log("New devices:", newDevices);

    const currentFetchTime = moment()
      .subtract(5, "days")
      .toDate();
    for (const meter of METERS) {
      console.log(`Fetching ${meter}`);
      // 3. For each of the new devices, fetch all history.
      if (newDevices.length > 0) {
        console.log(`- Fetching ${meter} for new devices`);
        await addMeterData(
          (meter as unknown) as MeterTypes,
          await fetcher.meterHistoryForDevices(
            meter,
            newDevices,
            START_DATE,
            moment()
          ),
          t
        );
      }

      // 4. Fetch all history since last fetch time for each meter
      const lastFetchRes = await FetchHistory.findOne({
        where: { meterType: meter },
        transaction: t
      });
      const lastFetch = lastFetchRes
        ? moment(lastFetchRes.dataValues.lastFetch)
        : START_DATE;
      console.log(
        "- Fetching all history since last fetch at",
        lastFetch.toLocaleString()
      );
      await addMeterData(
        (meter as unknown) as MeterTypes,
        await fetcher.meterHistoryForGroup(meter, GROUP, lastFetch, moment()),
        t
      );

      console.log("- Saving fetch time for this meter at", currentFetchTime);
      await FetchHistory.upsert(
        {
          meterType: meter,
          lastFetch: currentFetchTime
        },
        { transaction: t }
      );
      console.log("DB update complete.");
    }
  });
}

async function updateDevices(
  fetcher: lw.LaserWatchFetcher,
  transaction: Transaction
) {
  const devices = await fetcher.devices(GROUP);
  console.log("Got", devices.length, "devices from LaserWatch.");
  const newDeviceIds: string[] = [];
  for (const device of devices) {
    if ((await Device.findOne({ where: { id: device.id } })) == null) {
      newDeviceIds.push(device.id);
    }
  }
  await Device.bulkCreate(
    devices.map(device => ({
      name: device.name,
      id: device.id,
      groupId: device.groupId,
      manufacturer: device.modelMatch.model.manufacturer,
      isColor: device.modelMatch.model.isColor,
      hasImage: device.modelMatch.model.hasImage
    })),
    { ignoreDuplicates: true, transaction }
  );
  return newDeviceIds;
}
