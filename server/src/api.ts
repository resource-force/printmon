import { Meter, Device } from "./store";
import { Op } from "sequelize";
import moment, { Moment } from "moment";
import { Request, Response } from "express";
import { groupBy } from "lodash";
import { MeterTypes } from "./laserwatch/types";

function sortObject(o: any) {
  return Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});
}

function roundUp(date: Moment, type: string, offset: number) {
  let val = date[type]();
  let roundedVal = Math.ceil((val + 1) / offset) * offset;
  return date[type](roundedVal);
}

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
      type: MeterTypes.TOTAL_UNITS_OUTPUT
    }
  });

  const output: {
    [date: string]: number;
  } = {};

  records.forEach(({ dataValues }) => {
    const date: string = dataValues.firstReportedAt.toISOString();
    if (output[date] === undefined) {
      output[date] = 0;
    }
    output[date] += dataValues.delta;
  });

  res.send(sortObject(output));
}
