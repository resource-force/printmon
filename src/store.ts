import Sequelize from "sequelize";

export default async function init() {
  const sequelize = new Sequelize("database", "x", "y", {
    dialect: "sqlite",
    storage: "./db.sqlite"
  });
  sequelize.sync();
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err);
    });

  const PrintRecord = sequelize.define("print_record", {
    time: {
      type: Sequelize.DATE
    },
    sinceLastSeconds: {
      type: Sequelize.INTEGER
    },
    id: {
      type: Sequelize.STRING
    },
    
  });

  // force: true will drop the table if it already exists
  await PrintRecord.sync({ force: false });
  return { PrintRecord };
}
