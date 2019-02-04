import Sequelize from "sequelize";

export type PrintRecordData = {
  deviceId: string;
  count: number;
  firstReportedAt: Date;
  lastReportedAt: Date;
};

export let PrintRecord: Sequelize.Model<{ dataValues: PrintRecordData }, PrintRecordData> = undefined!;

type KVData = {
  k: string;
  v: string;
};

export let KV: Sequelize.Model<{ dataValues: KVData }, KVData> = undefined!;

export default async function init() {
  const sequelize = new Sequelize("database", "x", "y", {
    dialect: "sqlite",
    storage: "./db.sqlite"
  });
  await sequelize.sync();
  await sequelize.authenticate();

  PrintRecord = sequelize.define("print_record", {
    deviceId: {
      type: Sequelize.UUID,
      unique: "compositeIndex",
      allowNull: false
    },
    count: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    firstReportedAt: {
      type: Sequelize.DATE,
      unique: "compositeIndex",
      allowNull: false
    },
    lastReportedAt: {
      type: Sequelize.DATE,
      unique: "compositeIndex",
      allowNull: false
    }
  });
  // force: true will drop the table if it already exists
  await PrintRecord.sync({ force: false });

  KV = sequelize.define("kvstore", {
    k: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    v: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  await KV.sync({ force: false });
}
