const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  indexes: [
    {
      unique: true,
      fields: ["username"]
    },
    {
      unique: true,
      fields: ["email"]
    }
  ]
});

module.exports = User;