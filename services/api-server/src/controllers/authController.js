import jwt from 'jsonwebtoken';
import Worker from '../models/Worker.js';

export const login = async (req, res) => {
  const { phone, otp } = req.body;
  
  if (otp !== '1234') {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  let worker = await Worker.findOne({ phone });
  
  if (!worker) {
    return res.status(404).json({ error: 'Worker not found. Please register first.' });
  }

  const token = jwt.sign(
    { userId: worker._id, role: 'worker' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, worker });
};

export const register = async (req, res) => {
  const { phone, name, city, platform } = req.body;

  const existing = await Worker.findOne({ phone });
  if (existing) {
    return res.status(400).json({ error: 'Phone already registered' });
  }

  const worker = await Worker.create({ phone, name, city, platform });

  const token = jwt.sign(
    { userId: worker._id, role: 'worker' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({ token, worker });
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { userId: 'admin', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ token });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
};
