import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/User.js";
import { redisClient } from "../db/redis.js";
const { sign } = jwt;
export async function register(req, res) {
  try 
  {
    const { username, password, email } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, email });

    res.json({ message: "User registered!", userId: user.id });
  } 
  catch (err) 
  {
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req, res) {
  try 
  {
    const { identifier, password } = req.body;
    const cacheKey = `user:${identifier}`;
    // 1️⃣ Check cache first
    const cachedUser = await redisClient.get(cacheKey);
    let user;
    if (cachedUser)
    {
      user = JSON.parse(cachedUser);
      console.log(`⚡ Cache hit for ${identifier}`);
    }
    else
    {
      console.log(`🐢 Cache miss — querying DB`);
      // Find by username OR email
      user = await User.findOne({
        where: {
          [Op.or]: [
            { username: identifier },
            { email: identifier }
          ]
        }
      });
      if (user) 
      {
        // Convert Sequelize instance to plain object
        const plainUser = user.get({ plain: true });

        // Cache for 5 minutes (300 seconds)
        await redisClient.setEx(cacheKey, 300, JSON.stringify(plainUser));
      }
    }
    
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = sign({ id: user.id }, "secretKey", { expiresIn: "1h" });

    res.json({ message: "Login successful!", token });
  } 
  catch (err) 
  {
    res.status(500).json({ error: "Login failed" });
  }
}