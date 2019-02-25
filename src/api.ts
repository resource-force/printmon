import { PrintRecord } from "./store";
import { Op } from "sequelize";
import moment from "moment";
import { Request, Response } from "express";

function sortObject(o: any) {
  return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
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

  let records = await PrintRecord.findAll({
    where: {
      firstReportedAt: {
        [Op.between]: [start.toDate(), end.toDate()]
      }
    }
  });

  const output: { [date: string]: number } = {};

  for (const record of records) {
    const date = moment(record.dataValues.firstReportedAt).format("YYYY-MM-DD");
    if (output[date] === undefined) {
      output[date] = 0;
    }
    output[date] += record.dataValues.delta;
  }
  res.send(sortObject(output));
}
