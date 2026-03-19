import jwt from 'jsonwebtoken';
import axios from 'axios';
import db from '../../database/db.js';
import User from '../models/User.js';

const getIPLocation = async (ip) => {
  try {
    const cleanIP = ip?.replace('::ffff:', '').trim();
    if (!cleanIP || cleanIP === '127.0.0.1' || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(cleanIP)) return null;
    const res = await axios.get(`http://ip-api.com/json/${cleanIP}`, { timeout: 5000 });
    if (res.data?.status === 'success') {
      return { lat: res.data.lat, lng: res.data.lon, city: res.data.city, ip: cleanIP };
    }
    return null;
  } catch { return null; }
};

export const register = async (req, res) => {
  try {
    const { phone: rawPhone, name, city, platform, vehicleType, licenseNumber, publicIP } = req.body;

    const phone = rawPhone.startsWith('+91') ? rawPhone : `+91${rawPhone}`;

    const existing = await User.findByPhone(phone);
    if (existing) {
      return res.status(400).json({ error: 'Phone already registered' });
    }

    // Resolve public IP sent by mobile to get baseline location
    const ipLocation = publicIP ? await getIPLocation(publicIP) : null;
    console.log(`[REGISTER] publicIP=${publicIP} resolved=${JSON.stringify(ipLocation)}`);

    const user = await User.create({ phone, name, city, platform, vehicleType, licenseNumber, baselineIpLocation: ipLocation });

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: 'worker' },
      process.env.JWT_SECRET || 'quickclaim_secret_key',
      { expiresIn: '30d' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { phone: rawPhone, otp } = req.body;
    
    if (!otp || otp.length !== 6) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    const phone = rawPhone.startsWith('+91') ? rawPhone : `+91${rawPhone}`;
    const user = await User.findByPhone(phone);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    await User.updateLastLogin(user.id);

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: 'worker' },
      process.env.JWT_SECRET || 'quickclaim_secret_key',
      { expiresIn: '30d' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { userId: 'admin', role: 'admin' },
      process.env.JWT_SECRET || 'quickclaim_secret_key',
      { expiresIn: '7d' }
    );
    return res.json({ token });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
};
