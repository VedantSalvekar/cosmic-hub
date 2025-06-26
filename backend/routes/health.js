const express = require('express');
const nasaApi = require('../services/nasaApi');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      nasa_api: {
        base_url: process.env.NASA_BASE_URL || 'https://api.nasa.gov',
        api_key_configured: !!process.env.NASA_API_KEY,
        api_key_type: process.env.NASA_API_KEY === 'DEMO_KEY' ? 'demo' : 'custom'
      },
      cache: nasaApi.getCacheStats(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        unit: 'MB'
      }
    };
    
    res.json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Deep health check with NASA API test
router.get('/deep', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test NASA API connectivity
    let nasaApiTest = null;
    try {
      await nasaApi.getAPOD();
      nasaApiTest = { status: 'connected', response_time: Date.now() - startTime };
    } catch (error) {
      nasaApiTest = { 
        status: 'error', 
        error: error.message,
        response_time: Date.now() - startTime 
      };
    }
    
    const healthData = {
      status: nasaApiTest.status === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      tests: {
        nasa_api: nasaApiTest
      },
      cache: nasaApi.getCacheStats(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        unit: 'MB'
      }
    };
    
    res.json(healthData);
  } catch (error) {
    console.error('Deep health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router; 