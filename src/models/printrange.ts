import sequelize = require("sequelize");

export default (sequelize: sequelize.Sequelize, type: sequelize.SequelizeStatic) => {
  return sequelize.define("print", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: type.STRING
  })
};