const express = require('express');
const nasaApi = require('../services/nasaApi');

const router = express.Router();

// Get today's APOD
router.get('/', async (req, res) => {
  try {
    const data = await nasaApi.getAPOD();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('APOD error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch APOD',
      code: error.code || 'APOD_ERROR'
    });
  }
});

// Get APOD for specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT'
      });
    }
    
    const data = await nasaApi.getAPOD(date);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('APOD date error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch APOD for date',
      code: error.code || 'APOD_DATE_ERROR'
    });
  }
});

// Get APOD for date range
router.get('/range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'Both start_date and end_date query parameters are required',
        code: 'MISSING_DATE_PARAMS'
      });
    }
    
    // Validate date formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT'
      });
    }
    
    const data = await nasaApi.getAPODRange(start_date, end_date);
    res.json({
      success: true,
      data,
      count: Array.isArray(data) ? data.length : 1
    });
  } catch (error) {
    console.error('APOD range error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch APOD range',
      code: error.code || 'APOD_RANGE_ERROR'
    });
  }
});

// Get random APOD(s)
router.get('/random', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 1;
    
    if (count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Count must be between 1 and 100',
        code: 'INVALID_COUNT'
      });
    }
    
    const data = await nasaApi.getRandomAPOD(count);
    res.json({
      success: true,
      data,
      count: Array.isArray(data) ? data.length : 1
    });
  } catch (error) {
    console.error('APOD random error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch random APOD',
      code: error.code || 'APOD_RANDOM_ERROR'
    });
  }
});

// Get recent APOD (last 7 days)
router.get('/recent', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const data = await nasaApi.getAPODRange(startDateStr, endDateStr);
    res.json({
      success: true,
      data,
      count: Array.isArray(data) ? data.length : 1,
      date_range: {
        start: startDateStr,
        end: endDateStr,
        days
      }
    });
  } catch (error) {
    console.error('APOD recent error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch recent APOD',
      code: error.code || 'APOD_RECENT_ERROR'
    });
  }
});

module.exports = router; 