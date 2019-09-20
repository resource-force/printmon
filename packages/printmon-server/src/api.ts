import { Meter, Device, MeterData } from "./store";
import sequelize, { Op } from "sequelize";
import moment, { Moment } from "moment";
import { Request, Response } from "express";
import { MeterTypes } from "./laserwatch/types";
import Groups from "./laserwatch/groups";

function sortObject(o: any) {
  return Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});
}

export type HistoricalTotals = {
  [date: string]: {
    [MeterTypes.TOTAL_UNITS_OUTPUT]: number;
    [MeterTypes.DUPLEX]: number;
    [index: string]: number;
  };
};

export async function getHistoricalTotal(req: Request, res: Response) {
  if (!req.query.startDate) {
    return res.status(400).send("Requires query parameter startDate");
  }
  const start = moment.utc(req.query.startDate).startOf("day");
  const end =
    req.query.endDate === undefined
      ? moment()
      : moment.utc(req.query.endDate).startOf("day");

  if (!start.isValid() || !end.isValid()) {
    return res.status(400).send("Bad start/end date");
  }
  const hsDevices = (await Device.findAll({
    where: {
      groupId: {
        [Op.eq]: Groups.HIGH_SCHOOL
      }
    }
  })).map(r => r.dataValues);

  const output: HistoricalTotals = {};

  await Promise.all(
    hsDevices.map(async ({ id, name }) => {
      for (const type of [MeterTypes.TOTAL_UNITS_OUTPUT, MeterTypes.DUPLEX]) {
        const totals = await getDeviceTotals(id, type, start, end);

        if (totals.total > 20_000) console.log(name, ":", totals.total);

        for (const date in totals.daily) {
          if (output[date] === undefined) {
            output[date] = {
              [MeterTypes.TOTAL_UNITS_OUTPUT]: 0,
              [MeterTypes.DUPLEX]: 0
            };
          }
          output[date][type] += totals.daily[date];
        }
      }
    })
  );

  res.send(sortObject(output));
}

export async function getDeviceTotals(
  deviceId: string,
  meterType: MeterTypes,
  start: Moment,
  end: Moment
) {
  let output: { [date: string]: number } = {};
  let total = 0;

  let records: MeterData[] = (await Meter.findAll({
    where: {
      lastReportedAt: {
        [Op.between]: [start.toDate(), end.toDate()]
      },
      type: {
        [Op.eq]: meterType
      },
      deviceId: {
        [Op.eq]: deviceId
      }
    },
    order: [["count", "ASC"]]
  })).map(r => r.dataValues);

  for (let i = 0; i < records.length - 1; i++) {
    // Sometimes the delta value is incorrect (e.g. goes from 2250 -> 2277 w/delta = 1)
    // so recalculate it manually here.
    records[i + 1].delta = records[i + 1].count - records[i].count;
    if (records[i + 1].delta === 86839) {
      console.log(records[i], records[i + 1]);
    }
  }

  records.forEach(record => {
    // printRecord(record);
    const date: string = record.lastReportedAt.toISOString();
    if (output[date] === undefined) {
      output[date] = 0;
    }
    output[date] += record.delta;
    total += record.delta;
  });

  return {
    total,
    daily: output
  };
}
