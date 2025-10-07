const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.NODE_ENV === "production") {
  // Use Postgres in production (Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,              // Render enforces SSL
        rejectUnauthorized: false   // Disable cert verification
      }
    }
  });
} 
else 
{
  // Use SQLite in local dev
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/STCP.db", 
    logging: false
  });
}

module.exports = sequelize;