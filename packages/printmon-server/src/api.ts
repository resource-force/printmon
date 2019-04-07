import { Meter } from "./store";
import { Op } from "sequelize";
import moment from "moment";
import { Request, Response } from "express";
import { MeterTypes } from "./laserwatch/types";

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
      }
    }
  });

  const output: HistoricalTotals = {};

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
  });

  res.send(sortObject(output));
}
