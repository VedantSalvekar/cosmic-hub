import express from 'express';
import nasaApi from '../services/nasaApi.js';
import { format, subDays, isValid, parseISO } from 'date-fns';

const router = express.Router();

// Get today's APOD
router.get('/', async (req, res) => {
  try {
    const apod = await nasaApi.getAPOD();
    res.json({
      success: true,
      data: apod
    });
  } catch (error) {
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
    
    // Validate date format
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
        code: 'INVALID_DATE'
      });
    }

    const apod = await nasaApi.getAPOD(date);
    res.json({
      success: true,
      data: apod
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch APOD for date',
      code: error.code || 'APOD_DATE_ERROR'
    });
  }
});

// Get APOD range
router.get('/range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'Both start_date and end_date are required',
        code: 'MISSING_DATES'
      });
    }

    // Validate dates
    const startDate = parseISO(start_date);
    const endDate = parseISO(end_date);
    
    if (!isValid(startDate) || !isValid(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT'
      });
    }

    const apodRange = await nasaApi.getAPODRange(start_date, end_date);
    res.json({
      success: true,
      data: apodRange,
      count: Array.isArray(apodRange) ? apodRange.length : 1
    });
  } catch (error) {
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

    const randomApods = await nasaApi.getRandomAPOD(count);
    res.json({
      success: true,
      data: randomApods,
      count: Array.isArray(randomApods) ? randomApods.length : 1
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch random APOD',
      code: error.code || 'APOD_RANDOM_ERROR'
    });
  }
});

// Get recent APODs (last 7 days)
router.get('/recent', async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = subDays(today, 7);
    
    const startDate = format(weekAgo, 'yyyy-MM-dd');
    const endDate = format(today, 'yyyy-MM-dd');
    
    const recentApods = await nasaApi.getAPODRange(startDate, endDate);
    res.json({
      success: true,
      data: recentApods,
      count: Array.isArray(recentApods) ? recentApods.length : 1,
      period: {
        start: startDate,
        end: endDate
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch recent APODs',
      code: error.code || 'APOD_RECENT_ERROR'
    });
  }
});

export default router; 