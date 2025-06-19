import express from 'express';
import nasaApi from '../services/nasaApi.js';
import { format, addDays, subDays } from 'date-fns';

const router = express.Router();

// Get close approach data
router.get('/close-approach', async (req, res) => {
  try {
    const {
      'date-min': dateMin,
      'date-max': dateMax,
      'dist-max': distMax,
      'h-max': hMax,
      'v-inf-min': vInfMin,
      'v-inf-max': vInfMax,
      'class': objectClass,
      'pha': pha,
      'nea': nea,
      'comet': comet,
      'nea-comet': neaComet,
      'neo': neo,
      'kind': kind,
      'spk': spk,
      'des': des,
      'body': body,
      'sort': sort,
      'limit': limit,
      'limit-from': limitFrom
    } = req.query;

    const params = {
      dateMin: dateMin || format(new Date(), 'yyyy-MM-dd'),
      dateMax: dateMax || format(addDays(new Date(), 60), 'yyyy-MM-dd'),
      distMax: distMax || '0.05',
      sort: sort || 'date'
    };

    // Add optional parameters if provided
    if (hMax) params.hMax = hMax;
    if (vInfMin) params.vInfMin = vInfMin;
    if (vInfMax) params.vInfMax = vInfMax;
    if (objectClass) params.class = objectClass;
    if (pha) params.pha = pha;
    if (nea) params.nea = nea;
    if (comet) params.comet = comet;
    if (neaComet) params.neaComet = neaComet;
    if (neo) params.neo = neo;
    if (kind) params.kind = kind;
    if (spk) params.spk = spk;
    if (des) params.des = des;
    if (body) params.body = body;
    if (limit) params.limit = limit;
    if (limitFrom) params.limitFrom = limitFrom;

    const closeApproachData = await nasaApi.getCloseApproachData(params);
    
    // Process and analyze the data
    const processedData = processCloseApproachData(closeApproachData);

    res.json({
      success: true,
      data: processedData,
      meta: {
        query_params: params,
        total_objects: processedData.count || 0,
        date_range: {
          start: params.dateMin,
          end: params.dateMax
        }
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch close approach data',
      code: error.code || 'CLOSE_APPROACH_ERROR'
    });
  }
});

// Get upcoming close approaches (next 30 days)
router.get('/upcoming', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = format(new Date(), 'yyyy-MM-dd');
    const endDate = format(addDays(new Date(), days), 'yyyy-MM-dd');

    const params = {
      dateMin: startDate,
      dateMax: endDate,
      distMax: '0.1', // 0.1 AU
      sort: 'date'
    };

    const upcomingData = await nasaApi.getCloseApproachData(params);
    const processedData = processCloseApproachData(upcomingData);

    // Add risk assessment for each object
    const dataWithRisk = {
      ...processedData,
      data: processedData.data?.map(approach => ({
        ...approach,
        risk_level: assessApproachRisk(approach),
        distance_comparison: getDistanceComparison(approach[3]) // distance in AU
      }))
    };

    res.json({
      success: true,
      data: dataWithRisk,
      count: processedData.count || 0,
      period: {
        start: startDate,
        end: endDate,
        days
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch upcoming approaches',
      code: error.code || 'UPCOMING_APPROACHES_ERROR'
    });
  }
});

// Get fireball data
router.get('/fireballs', async (req, res) => {
  try {
    const {
      'date-min': dateMin,
      'date-max': dateMax,
      'energy-min': energyMin,
      'energy-max': energyMax,
      'impact-e': impactE,
      'vel-min': velMin,
      'vel-max': velMax,
      'alt-min': altMin,
      'alt-max': altMax,
      'req-loc': reqLoc,
      'req-alt': reqAlt,
      'req-vel': reqVel,
      'req-vel-comp': reqVelComp,
      'vel-comp': velComp,
      'sort': sort,
      'limit': limit,
      'limit-from': limitFrom
    } = req.query;

    const params = {};
    
    // Default to last 30 days if no date range provided
    if (!dateMin && !dateMax) {
      params.dateMin = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      params.dateMax = format(new Date(), 'yyyy-MM-dd');
    } else {
      if (dateMin) params.dateMin = dateMin;
      if (dateMax) params.dateMax = dateMax;
    }

    // Add optional parameters
    if (energyMin) params.energyMin = energyMin;
    if (energyMax) params.energyMax = energyMax;
    if (impactE) params.impactE = impactE;
    if (velMin) params.velMin = velMin;
    if (velMax) params.velMax = velMax;
    if (altMin) params.altMin = altMin;
    if (altMax) params.altMax = altMax;
    if (reqLoc) params.reqLoc = reqLoc;
    if (reqAlt) params.reqAlt = reqAlt;
    if (reqVel) params.reqVel = reqVel;
    if (reqVelComp) params.reqVelComp = reqVelComp;
    if (velComp) params.velComp = velComp;
    if (sort) params.sort = sort;
    if (limit) params.limit = limit;
    if (limitFrom) params.limitFrom = limitFrom;

    const fireballData = await nasaApi.getFireballData(params);
    
    // Process and analyze fireball data
    const processedData = processFireballData(fireballData);

    res.json({
      success: true,
      data: processedData,
      meta: {
        query_params: params,
        total_events: processedData.count || 0
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch fireball data',
      code: error.code || 'FIREBALL_ERROR'
    });
  }
});

// Get recent fireball events (last 7 days)
router.get('/fireballs/recent', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
    const endDate = format(new Date(), 'yyyy-MM-dd');

    const params = {
      dateMin: startDate,
      dateMax: endDate,
      sort: 'date',
      reqLoc: 'true' // Request location data
    };

    const recentFireballs = await nasaApi.getFireballData(params);
    const processedData = processFireballData(recentFireballs);

    // Add impact analysis for each fireball
    const dataWithAnalysis = {
      ...processedData,
      data: processedData.data?.map(fireball => ({
        ...fireball,
        impact_analysis: analyzeFireballImpact(fireball),
        energy_comparison: getEnergyComparison(fireball[8]) // energy in kt
      }))
    };

    res.json({
      success: true,
      data: dataWithAnalysis,
      count: processedData.count || 0,
      period: {
        start: startDate,
        end: endDate,
        days
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch recent fireballs',
      code: error.code || 'RECENT_FIREBALLS_ERROR'
    });
  }
});

// Get fireball statistics
router.get('/fireballs/stats', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 365;
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
    const endDate = format(new Date(), 'yyyy-MM-dd');

    const params = {
      dateMin: startDate,
      dateMax: endDate,
      reqLoc: 'true',
      energyMin: '0.1' // Filter out very small events
    };

    const fireballData = await nasaApi.getFireballData(params);
    const stats = generateFireballStatistics(fireballData);

    res.json({
      success: true,
      data: stats,
      period: {
        start: startDate,
        end: endDate,
        days
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to generate fireball statistics',
      code: error.code || 'FIREBALL_STATS_ERROR'
    });
  }
});

// Helper functions
function processCloseApproachData(data) {
  if (!data || !data.data) {
    return { count: 0, data: [], fields: [] };
  }

  return {
    count: data.count,
    fields: data.fields,
    data: data.data,
    signature: data.signature
  };
}

function processFireballData(data) {
  if (!data || !data.data) {
    return { count: 0, data: [], fields: [] };
  }

  return {
    count: data.count,
    fields: data.fields,
    data: data.data,
    signature: data.signature
  };
}

function assessApproachRisk(approach) {
  if (!approach || approach.length < 4) return 'UNKNOWN';
  
  const distance = parseFloat(approach[3]); // Distance in AU
  const velocity = parseFloat(approach[6]); // Velocity in km/s
  const diameter = parseFloat(approach[9]); // Diameter in km (if available)

  if (distance < 0.01 && diameter > 1) {
    return 'CRITICAL';
  } else if (distance < 0.02 && velocity > 20) {
    return 'HIGH';
  } else if (distance < 0.05) {
    return 'MODERATE';
  } else {
    return 'LOW';
  }
}

function getDistanceComparison(distanceAU) {
  const distance = parseFloat(distanceAU);
  const lunarDistance = 0.00257; // Earth-Moon distance in AU
  
  if (distance < lunarDistance) {
    return `${(distance / lunarDistance).toFixed(2)} times closer than the Moon`;
  } else {
    return `${(distance / lunarDistance).toFixed(2)} times farther than the Moon`;
  }
}

function analyzeFireballImpact(fireball) {
  if (!fireball || fireball.length < 9) return null;
  
  const energy = parseFloat(fireball[8]); // Energy in kt
  const altitude = parseFloat(fireball[13]); // Peak brightness altitude
  
  let impactType = 'Atmospheric burst';
  let description = 'Object disintegrated in atmosphere';
  
  if (energy > 100) {
    impactType = 'Major atmospheric event';
    description = 'Significant atmospheric explosion';
  } else if (energy > 10) {
    impactType = 'Notable fireball';
    description = 'Visible bright fireball event';
  }
  
  return {
    impact_type: impactType,
    description,
    energy_kt: energy,
    altitude_km: altitude
  };
}

function getEnergyComparison(energyKt) {
  const energy = parseFloat(energyKt);
  
  if (energy >= 1000) return 'Nuclear weapon scale';
  if (energy >= 100) return 'Large bomb scale';
  if (energy >= 10) return 'Small bomb scale';
  if (energy >= 1) return 'Artillery shell scale';
  return 'Small explosion scale';
}

function generateFireballStatistics(data) {
  if (!data || !data.data || !Array.isArray(data.data)) {
    return {
      total_events: 0,
      energy_stats: {},
      location_stats: {},
      monthly_distribution: {}
    };
  }

  const events = data.data;
  const energies = [];
  const countries = {};
  const months = {};

  events.forEach(event => {
    // Energy analysis (index 8)
    if (event[8]) {
      energies.push(parseFloat(event[8]));
    }
    
    // Location analysis (would need parsing lat/lon for countries)
    // Monthly distribution (index 0 for date)
    if (event[0]) {
      const date = new Date(event[0]);
      const month = date.getMonth();
      months[month] = (months[month] || 0) + 1;
    }
  });

  const energyStats = energies.length > 0 ? {
    min: Math.min(...energies),
    max: Math.max(...energies),
    average: energies.reduce((a, b) => a + b, 0) / energies.length,
    total_count: energies.length
  } : {};

  return {
    total_events: events.length,
    energy_stats: energyStats,
    monthly_distribution: months,
    time_period: {
      earliest: events.length > 0 ? events[events.length - 1][0] : null,
      latest: events.length > 0 ? events[0][0] : null
    }
  };
}

export default router; 