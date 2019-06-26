import Sequelize from "sequelize";
import path from "path";

export type MeterData = {
  deviceId: string;
  type: string;
  count: number;
  delta: number;
  firstReportedAt: Date;
  lastReportedAt: Date;
};

export let Meter: Sequelize.Model<
  { dataValues: MeterData },
  MeterData
> = undefined!;

type FetchHistoryData = {
  meterType: string;
  lastFetch: Date;
};

export let FetchHistory: Sequelize.Model<
  { dataValues: FetchHistoryData },
  FetchHistoryData
> = undefined!;

export type DeviceData = {
  id: string;
  groupId: string;
  name: string;
  manufacturer: string;
  isColor: boolean;
  hasImage: boolean;
};

export let Device: Sequelize.Model<
  { dataValues: DeviceData },
  DeviceData
> = undefined!;

export let sequelize: Sequelize.Sequelize = undefined!;

const RESET_DB = false;

export default async function init(dataFolder: string) {
  const dbPath = path.join(dataFolder, "./db.sqlite");
  console.log("Connecting to SQLite db at", dbPath);
  sequelize = new Sequelize("database", "", "", {
    dialect: "sqlite",
    storage: dbPath,
    logging: false
  });
  await sequelize.sync();
  await sequelize.authenticate();

  Meter = sequelize.define("Meter", {
    deviceId: {
      type: Sequelize.UUID,
      unique: "compositeIndex",
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
      allowNull: false
    },
    delta: {
      type: Sequelize.INTEGER,
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

  FetchHistory = sequelize.define("FetchHistory", {
    meterType: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    lastFetch: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  Device = sequelize.define("Device", {
    id: {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true
    },
    groupId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    manufacturer: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isColor: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    hasImage: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  });

  Device.hasMany(Meter, { foreignKey: "deviceId" });
  FetchHistory.hasOne(Meter, { foreignKey: "meterType" });

  // force: true will drop the table if it already exists
  await Meter.sync({
    force: RESET_DB
  });
  await FetchHistory.sync({
    force: RESET_DB
  });
  await Device.sync({
    force: RESET_DB
  });
}
