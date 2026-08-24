import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// Global Request Logger Middleware (res.on('finish'))
app.use(requestLogger);

// Base API Info & Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'FitZone Gym & Class Booking System',
    studentId: '24CE038',
    batch: 'B',
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mounting (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Catch 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[FitZone Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[FitZone Server] API Base: http://localhost:${PORT}/api/v1`);
});

export default app;
