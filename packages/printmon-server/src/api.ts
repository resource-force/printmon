import { Meter, Device } from "./store";
import { Op } from "sequelize";
import moment from "moment";
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
    [MeterTypes.TOTAL_COPIER_UNITS]: number;
    [MeterTypes.TOTAL_PRINT_UNITS]: number;
    [MeterTypes.TOTAL_SCAN_UNITS]: number;
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
  const hsDevices = await Device.findAll({
    where: {
      groupId: {
        [Op.eq]: Groups.HIGH_SCHOOL
      }
    }
  });

  let records = await Meter.findAll({
    where: {
      firstReportedAt: {
        [Op.between]: [start.toDate(), end.toDate()]
      },
      type: {
        [Op.or]: [
          MeterTypes.TOTAL_UNITS_OUTPUT,
          MeterTypes.DUPLEX,
          MeterTypes.TOTAL_COPIER_UNITS,
          MeterTypes.TOTAL_PRINT_UNITS,
          MeterTypes.TOTAL_SCAN_UNITS
        ]
      },
      deviceId: {
        [Op.or]: hsDevices.map(d => d.dataValues.id)
      }
    }
  });

  const output: HistoricalTotals = {};
  const deviceTotals = {};

  records.forEach(({ dataValues }) => {
    const date: string = dataValues.firstReportedAt.toISOString();
    if (output[date] === undefined) {
      output[date] = {
        [MeterTypes.TOTAL_UNITS_OUTPUT]: 0,
        [MeterTypes.DUPLEX]: 0,
        [MeterTypes.TOTAL_COPIER_UNITS]: 0,
        [MeterTypes.TOTAL_PRINT_UNITS]: 0,
        [MeterTypes.TOTAL_SCAN_UNITS]: 0
      };
    }
    output[date][dataValues.type] += dataValues.delta;

    const name = hsDevices.find(d => d.dataValues.id === dataValues.deviceId)!
      .dataValues.name;
    if (deviceTotals[name] === undefined) {
      deviceTotals[name] = 0;
    }

    if (dataValues.type === MeterTypes.TOTAL_UNITS_OUTPUT)
      deviceTotals[name] += dataValues.delta;
  });
  console.log(deviceTotals);
  res.send(sortObject(output));
}
