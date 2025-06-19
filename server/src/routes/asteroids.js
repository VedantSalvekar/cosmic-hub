import express from 'express';
import nasaApi from '../services/nasaApi.js';
import { format, addDays, isValid, parseISO } from 'date-fns';

const router = express.Router();

// Get asteroid feed for today (default) or date range
router.get('/feed', async (req, res) => {
  try {
    let { start_date, end_date } = req.query;
    
    // Default to today if no dates provided
    if (!start_date) {
      start_date = format(new Date(), 'yyyy-MM-dd');
    }
    
    if (!end_date) {
      end_date = format(addDays(parseISO(start_date), 7), 'yyyy-MM-dd');
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

    const asteroidFeed = await nasaApi.getAsteroidFeed(start_date, end_date);
    
    // Process and enrich the data
    const processedData = processAsteroidFeed(asteroidFeed);

    res.json({
      success: true,
      data: processedData,
      meta: {
        start_date,
        end_date,
        total_asteroids: processedData.element_count || 0
      }
    });
  } catch (error) {
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
    const today = format(new Date(), 'yyyy-MM-dd');
    const asteroidFeed = await nasaApi.getAsteroidFeed(today, today);
    
    // Extract today's asteroids with threat assessment
    const todaysAsteroids = processAsteroidFeed(asteroidFeed);
    const asteroidList = Object.values(todaysAsteroids.near_earth_objects || {})[0] || [];
    
    // Add threat level assessment
    const asteroidsWithThreat = asteroidList.map(asteroid => ({
      ...asteroid,
      threat_level: assessThreatLevel(asteroid),
      closest_approach: getClosestApproach(asteroid)
    }));

    res.json({
      success: true,
      data: asteroidsWithThreat,
      count: asteroidsWithThreat.length,
      date: today
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch today\'s asteroids',
      code: error.code || 'ASTEROIDS_TODAY_ERROR'
    });
  }
});

// Browse asteroids with pagination
router.get('/browse/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 20;
    
    if (size > 100) {
      return res.status(400).json({
        success: false,
        error: 'Page size cannot exceed 100',
        code: 'INVALID_PAGE_SIZE'
      });
    }

    const browseData = await nasaApi.browseAsteroids(page, size);
    
    // Add summary statistics
    const processedData = {
      ...browseData,
      asteroids: browseData.near_earth_objects?.map(asteroid => ({
        ...asteroid,
        size_category: getSizeCategory(asteroid),
        hazard_level: asteroid.is_potentially_hazardous_asteroid ? 'HIGH' : 'LOW'
      })) || []
    };

    res.json({
      success: true,
      data: processedData,
      pagination: {
        current_page: page,
        page_size: size,
        total_pages: Math.ceil((browseData.page?.total_elements || 0) / size)
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to browse asteroids',
      code: error.code || 'ASTEROID_BROWSE_ERROR'
    });
  }
});

// Get potentially hazardous asteroids
router.get('/hazardous/list', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = format(new Date(), 'yyyy-MM-dd');
    const endDate = format(addDays(new Date(), days), 'yyyy-MM-dd');
    
    const asteroidFeed = await nasaApi.getAsteroidFeed(startDate, endDate);
    
    // Filter for potentially hazardous asteroids
    const hazardousAsteroids = [];
    const nearEarthObjects = asteroidFeed.near_earth_objects || {};
    
    Object.values(nearEarthObjects).flat().forEach(asteroid => {
      if (asteroid.is_potentially_hazardous_asteroid) {
        hazardousAsteroids.push({
          ...asteroid,
          threat_level: assessThreatLevel(asteroid),
          closest_approach: getClosestApproach(asteroid)
        });
      }
    });

    // Sort by closest approach distance
    hazardousAsteroids.sort((a, b) => 
      parseFloat(a.closest_approach?.distance_km || Infinity) - 
      parseFloat(b.closest_approach?.distance_km || Infinity)
    );

    res.json({
      success: true,
      data: hazardousAsteroids,
      count: hazardousAsteroids.length,
      period: {
        start: startDate,
        end: endDate,
        days
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch hazardous asteroids',
      code: error.code || 'HAZARDOUS_ASTEROIDS_ERROR'
    });
  }
});

// Helper functions
function processAsteroidFeed(feed) {
  return {
    ...feed,
    element_count: feed.element_count || 0,
    summary: generateFeedSummary(feed)
  };
}

function assessThreatLevel(asteroid) {
  if (!asteroid.close_approach_data || !asteroid.close_approach_data.length) {
    return 'UNKNOWN';
  }

  const approach = asteroid.close_approach_data[0];
  const distance = parseFloat(approach.miss_distance?.kilometers || Infinity);
  const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
  const isHazardous = asteroid.is_potentially_hazardous_asteroid;

  if (isHazardous && distance < 7500000 && diameter > 1) {
    return 'CRITICAL';
  } else if (isHazardous || distance < 10000000) {
    return 'HIGH';
  } else if (distance < 50000000) {
    return 'MODERATE';
  } else {
    return 'LOW';
  }
}

function getClosestApproach(asteroid) {
  if (!asteroid.close_approach_data || !asteroid.close_approach_data.length) {
    return null;
  }

  const approach = asteroid.close_approach_data[0];
  return {
    date: approach.close_approach_date,
    date_full: approach.close_approach_date_full,
    distance_km: approach.miss_distance?.kilometers,
    distance_miles: approach.miss_distance?.miles,
    velocity_kmh: approach.relative_velocity?.kilometers_per_hour,
    velocity_mph: approach.relative_velocity?.miles_per_hour
  };
}

function getSizeComparison(asteroid) {
  const diameter = asteroid.estimated_diameter?.meters?.estimated_diameter_max || 0;
  
  if (diameter >= 1000) return 'Skyscraper sized';
  if (diameter >= 100) return 'Football field sized';
  if (diameter >= 50) return 'House sized';
  if (diameter >= 10) return 'Car sized';
  return 'Small object';
}

function getSizeCategory(asteroid) {
  const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
  
  if (diameter >= 1) return 'LARGE';
  if (diameter >= 0.1) return 'MEDIUM';
  return 'SMALL';
}

function getUpcomingApproaches(asteroid, limit = 5) {
  if (!asteroid.close_approach_data) return [];
  
  return asteroid.close_approach_data
    .slice(0, limit)
    .map(approach => ({
      date: approach.close_approach_date,
      distance_km: approach.miss_distance?.kilometers,
      velocity_kmh: approach.relative_velocity?.kilometers_per_hour
    }));
}

function generateFeedSummary(feed) {
  const nearEarthObjects = feed.near_earth_objects || {};
  let totalAsteroids = 0;
  let hazardousCount = 0;
  let avgSize = 0;
  let totalSize = 0;

  Object.values(nearEarthObjects).flat().forEach(asteroid => {
    totalAsteroids++;
    if (asteroid.is_potentially_hazardous_asteroid) {
      hazardousCount++;
    }
    totalSize += asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
  });

  avgSize = totalAsteroids > 0 ? totalSize / totalAsteroids : 0;

  return {
    total_asteroids: totalAsteroids,
    hazardous_count: hazardousCount,
    average_size_km: avgSize.toFixed(3),
    hazardous_percentage: totalAsteroids > 0 ? ((hazardousCount / totalAsteroids) * 100).toFixed(1) : 0
  };
}

// Get specific asteroid by ID (must be last to avoid conflicts)
router.get('/:asteroidId', async (req, res) => {
  try {
    const { asteroidId } = req.params;
    
    if (!asteroidId || asteroidId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Asteroid ID is required',
        code: 'MISSING_ASTEROID_ID'
      });
    }

    const asteroid = await nasaApi.getAsteroidById(asteroidId);
    
    // Enrich asteroid data with additional analysis
    const enrichedAsteroid = {
      ...asteroid,
      threat_assessment: assessThreatLevel(asteroid),
      size_comparison: getSizeComparison(asteroid),
      next_approaches: getUpcomingApproaches(asteroid, 5)
    };

    res.json({
      success: true,
      data: enrichedAsteroid
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch asteroid details',
      code: error.code || 'ASTEROID_DETAIL_ERROR'
    });
  }
});

export default router; 