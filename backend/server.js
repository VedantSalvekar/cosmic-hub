const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const apodRoutes = require('./routes/apod');
const asteroidRoutes = require('./routes/asteroids');
const healthRoutes = require('./routes/health');
const cosmicaiRoutes = require('./routes/cosmicai');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/apod', apodRoutes);
app.use('/api/asteroids', asteroidRoutes);
app.use('/api/cosmicai', cosmicaiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cosmic Awareness Hub - NASA API Backend',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      apod: '/api/apod',
      asteroids: '/api/asteroids',
      cosmicai: '/api/cosmicai'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: ['/api/health', '/api/apod', '/api/asteroids']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cosmic Awareness Hub Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🛰️  NASA API Key: ${process.env.NASA_API_KEY ? (process.env.NASA_API_KEY === 'DEMO_KEY' ? 'DEMO_KEY (limited)' : 'Custom key configured') : 'Not configured'}`);
  console.log(`📡 Server ready to proxy NASA API requests`);
});

module.exports = app; 