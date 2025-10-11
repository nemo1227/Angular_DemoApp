const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./db/sequelize");
const userRoutes = require("./routes/userRoutes");
require('dotenv').config();

const app = express();
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// Serve Angular static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
// Catch-all -> serve Angular index.html
app.get('/*public', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const PORT = process.env.PORT || 8080;
/*
1. sequelize.sync() looks at all defined models (eg: User.js).
2. It creates the corresponding table in the connected database if it doesn’t exist.
3. Example:
   # Model: User
   # Sequelize generates a table Users (pluralized by default)
*/ 
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
});
