require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const { generalLimiter } = require('./src/middleware/rateLimiter');
const disruptionMonitor = require('./src/jobs/disruptionMonitor');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
app.use('/api/', generalLimiter);

// Logging & parsing
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',    require('./src/routes/auth'));
app.use('/api/worker',  require('./src/routes/worker'));
app.use('/api/policy',  require('./src/routes/policy'));
app.use('/api/claims',  require('./src/routes/claims'));
app.use('/api/admin',   require('./src/routes/admin'));
app.use('/api/disruptions', require('./src/routes/disruptions'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// Global error handler
app.use(errorHandler);

// Start disruption monitoring job
disruptionMonitor.start();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`[SERVER] DevTrails API running on port ${PORT} [${process.env.NODE_ENV}]`)
);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
