import express, { json } from 'express';
import cors from 'cors';
require('dotenv').config();

const app = express();
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(json());

app.get("/", (req, res) => {
  res.send("Express server is running ");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});