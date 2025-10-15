import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

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

export default User;