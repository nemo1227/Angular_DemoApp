const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try 
  {
    const { username, password, email } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, email });

    res.json({ message: "User registered!", userId: user.id });
  } 
  catch (err) 
  {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try 
  {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, "secretKey", { expiresIn: "1h" });

    res.json({ message: "Login successful!", token });
  } 
  catch (err) 
  {
    res.status(500).json({ error: "Login failed" });
  }
};