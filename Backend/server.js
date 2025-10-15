import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize  from "./db/sequelize.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();
const { json } = bodyParser;
const app = express();
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Serve Angular static files
app.use(express.static(join(__dirname, "public")));
app.use(json());
app.use("/api/users", userRoutes);
// Catch-all -> serve Angular index.html
app.get('/*public', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});
const PORT = process.env.PORT || 8080;
/*
1. sequelize.sync() looks at all defined models (eg: User.js).
2. It creates the corresponding table in the connected database if it doesn’t exist.
3. Example:
   # Model: User
   # Sequelize generates a table Users (pluralized by default)
*/ 
await sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
});
