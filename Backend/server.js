const express = require("express");
const cors = require("cors");
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
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Express server is running ");
});

const PORT = process.env.PORT || 8080;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
