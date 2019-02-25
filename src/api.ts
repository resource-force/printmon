import { PrintRecord } from "./store";
import { Op } from "sequelize";
import moment from "moment";
import { Request, Response } from "express";

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

  const count = records
    .map(val => val.dataValues.delta)
    .reduce((prev, curr) => prev + curr, 0);

  res.send("" + count);
}
