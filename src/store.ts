import Sequelize from "sequelize";

export default async function init() {
  const sequelize = new Sequelize("database", "x", "y", {
    dialect: "sqlite",
    storage: "./db.sqlite"
  });
  await sequelize.sync();
  await sequelize.authenticate();

  const PrintRecord = sequelize.define("print_record", {
    deviceId: {
      type: Sequelize.STRING
    },
    count: {
      type: Sequelize.INTEGER
    },
    firstReportedAt: {
      type: Sequelize.DATE
    },
    lastReportedAt: {
      type: Sequelize.INTEGER
    }
  });
  // force: true will drop the table if it already exists
  await PrintRecord.sync({ force: false });

  const KV = sequelize.define("kvstore", {
    k: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    v: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  await KV.sync({ force: false });

  return { PrintRecord, KV };
}
