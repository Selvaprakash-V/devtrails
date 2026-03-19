import dotenv from 'dotenv';
import app from './src/app.js';
import db from './database/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
