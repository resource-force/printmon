import { PrintRecord, DeviceRecord } from "./store";
import { Op } from "sequelize";
import { groupBy } from "lodash";
import moment from "moment";

function sortObject(o: any) {
  return Object.keys(o)
    .sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
  })
    .reduce((r, k) => ((r[k] = o[k]), r), {});
}

export async function getPreviousCounts() {
  let records = await PrintRecord.findAll({
    where: {
      firstReportedAt: {
        [Op.between]: [
          moment()
            .subtract(90, "days")
            .utc()
            .startOf("day")
            .toDate(),
          moment().toDate()
        ]
      }
      // deviceId: {
      //   [Op.eq]: "cdbb15ac-742a-2241-7999-a1299a96d6f5"
      // }
    }
  });

  const groups = groupBy(records, "dataValues.deviceId");
  const out: { [name: string]: number } = {};
  for (const deviceId in groups) {
    const name = await DeviceRecord.findOne({
      where: { id: { [Op.eq]: deviceId } }
    });
    if (!name) {
      throw new Error("Cannot translate id to name.");
    }
    out[name.dataValues.name] = groups[deviceId]
      .map(record => record.dataValues.delta)
      .reduce((prev, curr) => prev + curr);
  }

  let count = 0;
  for (const device in out) {
    count += out[device];
  }
  
  return "" + count;
}
