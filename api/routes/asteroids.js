const express = require('express');
const nasaApi = require('../services/nasaApi');

const router = express.Router();

// Get asteroid feed for date range
router.get('/feed', async (req, res) => {
  try {
    let { start_date, end_date } = req.query;
    
    // Default to today if no dates provided
    if (!start_date || !end_date) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      start_date = today.toISOString().split('T')[0];
      end_date = tomorrow.toISOString().split('T')[0];
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
    
    // NASA API limits date range to 7 days
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const daysDiff = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 7) {
      return res.status(400).json({
        success: false,
        error: 'Date range cannot exceed 7 days (NASA API limitation)',
        code: 'DATE_RANGE_TOO_LARGE'
      });
    }
    
    const data = await nasaApi.getAsteroidFeed(start_date, end_date);
    
    // Transform data to include useful metadata
    let totalCount = 0;
    let hazardousCount = 0;
    
    if (data.near_earth_objects) {
      Object.keys(data.near_earth_objects).forEach(date => {
        const asteroids = data.near_earth_objects[date];
        totalCount += asteroids.length;
        hazardousCount += asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
      });
    }
    
    res.json({
      success: true,
      data,
      metadata: {
        date_range: {
          start: start_date,
          end: end_date,
          days: daysDiff
        },
        statistics: {
          total_asteroids: totalCount,
          potentially_hazardous: hazardousCount,
          safe_asteroids: totalCount - hazardousCount
        }
      }
    });
  } catch (error) {
    console.error('Asteroid feed error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch asteroid feed',
      code: error.code || 'ASTEROID_FEED_ERROR'
    });
  }
});

// Get today's approaching asteroids
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await nasaApi.getAsteroidFeed(today, today);
    
    const todayAsteroids = data.near_earth_objects[today] || [];
    
    res.json({
      success: true,
      data: todayAsteroids,
      count: todayAsteroids.length,
      date: today,
      potentially_hazardous: todayAsteroids.filter(a => a.is_potentially_hazardous_asteroid).length
    });
  } catch (error) {
    console.error('Today asteroids error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch today\'s asteroids',
      code: error.code || 'TODAY_ASTEROIDS_ERROR'
    });
  }
});

// Get specific asteroid by ID
router.get('/:asteroidId', async (req, res) => {
  try {
    const { asteroidId } = req.params;
    
    if (!asteroidId || asteroidId.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Invalid asteroid ID',
        code: 'INVALID_ASTEROID_ID'
      });
    }
    
    const data = await nasaApi.getAsteroidById(asteroidId);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Asteroid by ID error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch asteroid details',
      code: error.code || 'ASTEROID_DETAILS_ERROR'
    });
  }
});

// Browse all asteroids with pagination
router.get('/browse/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 20;
    
    if (page < 0) {
      return res.status(400).json({
        success: false,
        error: 'Page number must be 0 or greater',
        code: 'INVALID_PAGE'
      });
    }
    
    if (size < 1 || size > 100) {
      return res.status(400).json({
        success: false,
        error: 'Size must be between 1 and 100',
        code: 'INVALID_SIZE'
      });
    }
    
    const data = await nasaApi.browseAsteroids(page, size);
    res.json({
      success: true,
      data,
      pagination: {
        page,
        size,
        total_pages: Math.ceil(data.page.total_elements / size),
        total_elements: data.page.total_elements
      }
    });
  } catch (error) {
    console.error('Browse asteroids error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to browse asteroids',
      code: error.code || 'BROWSE_ASTEROIDS_ERROR'
    });
  }
});

// Get potentially hazardous asteroids for next N days
router.get('/hazardous/list', async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 7); // Limit to 7 days due to NASA API constraints
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const data = await nasaApi.getAsteroidFeed(startDateStr, endDateStr);
    
    // Filter for potentially hazardous asteroids
    const hazardousAsteroids = [];
    
    if (data.near_earth_objects) {
      Object.keys(data.near_earth_objects).forEach(date => {
        const asteroids = data.near_earth_objects[date];
        const hazardous = asteroids.filter(a => a.is_potentially_hazardous_asteroid);
        hazardousAsteroids.push(...hazardous.map(a => ({...a, approach_date: date})));
      });
    }
    
    // Sort by closest approach
    hazardousAsteroids.sort((a, b) => {
      const distanceA = parseFloat(a.close_approach_data[0]?.miss_distance?.astronomical || 999);
      const distanceB = parseFloat(b.close_approach_data[0]?.miss_distance?.astronomical || 999);
      return distanceA - distanceB;
    });
    
    res.json({
      success: true,
      data: hazardousAsteroids,
      count: hazardousAsteroids.length,
      date_range: {
        start: startDateStr,
        end: endDateStr,
        days
      }
    });
  } catch (error) {
    console.error('Hazardous asteroids error:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch hazardous asteroids',
      code: error.code || 'HAZARDOUS_ASTEROIDS_ERROR'
    });
  }
});

module.exports = router; 