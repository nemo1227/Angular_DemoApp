const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/STCP.db", // SQLite file
  logging: false
});

module.exports = sequelize;