const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

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
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://cosmic-hub.vercel.app', 'https://cosmic-hub-git-main-vedantsalvekar.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const healthRoutes = require('./routes/health');
const apodRoutes = require('./routes/apod');
const asteroidsRoutes = require('./routes/asteroids');
const cosmicaiRoutes = require('./routes/cosmicai');

// Use routes
app.use('/api/health', healthRoutes);
app.use('/api/apod', apodRoutes);
app.use('/api/asteroids', asteroidsRoutes);
app.use('/api/cosmicai', cosmicaiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cosmic Hub API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      apod: '/api/apod',
      asteroids: '/api/asteroids',
      cosmicai: '/api/cosmicai'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Cosmic Hub API Server running on port ${port}`);
    console.log(`📡 Health check: http://localhost:${port}/api/health`);
    console.log(`🌌 APOD endpoint: http://localhost:${port}/api/apod`);
    console.log(`☄️  Asteroids endpoint: http://localhost:${port}/api/asteroids`);
    console.log(`🤖 Cosmic AI endpoint: http://localhost:${port}/api/cosmicai`);
  });
}

module.exports = app; 