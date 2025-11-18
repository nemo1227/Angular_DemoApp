import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
//import nodemailer from "nodemailer";
import { Op } from "sequelize";
import User from "../models/User.js";
import { redisClient } from "../db/redis.js";
import { Resend } from 'resend';
import {randomBytes} from 'crypto';

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

    const resetToken = randomBytes(25).toString("hex");
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = resetToken;
    user.resetOTP = resetOTP;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await user.save(); 

    const resetLink = `http://localhost:8080/reset-password?token=${resetToken}`;
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background-color: #4a90e2; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Password Reset Request</h2>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px; color: #333333;">
            <p>Hi <strong>${user.username}</strong>,</p>
            <p>We received a request to reset your password for your account associated with this email address.</p>
            <p>Please click the button below to reset your password. This link will be valid for the next <strong>15 minutes</strong>.</p>
            <p>Use the OTP below to reset your password:</p>
            <div style="font-size:30px;font-weight:bold;letter-spacing:5px;">${resetOTP}</div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #4a90e2; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p>If the button doesn’t work, copy and paste the following link in your browser:</p>
            <p style="word-break: break-all; color: #4a90e2;">${resetLink}</p>
            
            <p>If you didn’t request this, you can safely ignore this email.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f0f2f5; color: #666666; text-align: center; padding: 15px; font-size: 13px;">
            <p>© ${new Date().getFullYear()} Forgebit App. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
    // Email message draft and send
    await resend.emails.send({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent
    });
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

export async function resetPassword(req, res) {
  try {
    const { token, otp, newPassword } = req.body;
    const user = await User.findOne({ where: { resetToken: token } });
    if (!user) return res.status(400).json({ message: "Invalid reset token" });
    if (user.resetOTP !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > user.resetTokenExpiry)
      return res.status(400).json({ message: "Token expired" });

    user.password = await hash(newPassword, 10);
    user.resetToken = null;
    user.resetOTP = null;
    user.resetTokenExpiry = null;

    await user.save();
    return res.json({ message: "Password updated successfully" });
  }
  catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message ?? err
    });
  }
}
