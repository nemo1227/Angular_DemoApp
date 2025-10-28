import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
//import nodemailer from "nodemailer";
import { Op } from "sequelize";
import User from "../models/User.js";
import { redisClient } from "../db/redis.js";
import { Resend } from 'resend';
const { sign } = jwt;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function register(req, res) {
  try 
  {
    const { username, password, email } = req.body;

    const existing = await User.findOne({ where: { email } });
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

export async function forgotPassword (req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }
    // Generate a fake reset token (you can improve this later)
    const resetToken = Math.random().toString(36).substring(2, 15);
    // Create email transporter
    // const transporter = nodemailer.createTransport({
    //       host: 'smtp.zoho.in',       // for Zoho India users
    //       port: 465,                  // SSL port
    //       secure: true,               // use SSL
    //       auth: {
    //         user: process.env.EMAIL_USER, // your Zoho email address
    //         pass: process.env.EMAIL_PASS  // your Zoho App Password #5SREQrZQNS3C
    //       } 
    // });
     // Email message
    const mailOptions = await resend.emails.send({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h3>Password Reset</h3>
        <p>Hello ${user.username},</p>
        <p>You requested a password reset. Use the token below to reset your password:</p>
        <h2>${resetToken}</h2>
        <p>If you didn’t request this, ignore this email.</p>
      `
    });
    // Send email
    //await transporter.sendMail(mailOptions);
    console.log(`Reset token for ${email}: ${resetToken}`);
    console.log('Email sent:', mailOptions);
    res.status(200).json({ message: 'Reset email sent successfully!' });
  }
  catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message ?? err
    });
  }
}