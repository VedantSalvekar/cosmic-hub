import React, { useState, useEffect, useCallback } from 'react';
import { 
  Target, 
  Calendar, 
  Activity,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import AsteroidCard from './components/AsteroidCard';
import apiClient from '../../../services/api';

const AsteroidTracker = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 7, // days
    showOnlyPHO: false // Potentially Hazardous Objects only
  });
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Transform NASA NeoWs API data to our simplified format
   * NASA API groups asteroids by date, we flatten and enhance the data
   */
  const transformNeoWsData = (neoWsData) => {
    if (!neoWsData || !neoWsData.near_earth_objects) return [];
    
    const allAsteroids = [];
    
    // NASA organizes data by date: { "2024-01-01": [...asteroids], "2024-01-02": [...asteroids] }
    Object.keys(neoWsData.near_earth_objects).forEach(date => {
      const asteroidsForDate = neoWsData.near_earth_objects[date];
      
      asteroidsForDate.forEach((asteroid) => {
        // Each asteroid has close_approach_data array, we use the first (nearest) approach
        const closeApproach = asteroid.close_approach_data[0];
        if (!closeApproach) return; // Skip if no approach data
        
        // Extract distance data (NASA provides AU, Lunar Distance, and Kilometers)
        const distance_au = parseFloat(closeApproach.miss_distance.astronomical);
        const distance_ld = parseFloat(closeApproach.miss_distance.lunar);
        const distance_km = parseFloat(closeApproach.miss_distance.kilometers);
        
        // Extract velocity data (relative to Earth)
        const velocity_kms = parseFloat(closeApproach.relative_velocity.kilometers_per_second);
        const velocity_kmh = parseFloat(closeApproach.relative_velocity.kilometers_per_hour);
        
        // Extract diameter estimates (NASA provides min/max range in meters)
        const diameter_min = parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_min);
        const diameter_max = parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_max);
        
        // Calculate if asteroid is approaching soon (within 7 days)
        const approachDate = new Date(closeApproach.close_approach_date_full);
        const now = new Date();
        const timeDiff = approachDate - now;
        const isApproachingNow = timeDiff > 0 && timeDiff < 7 * 24 * 60 * 60 * 1000;
        
        // NASA marks PHO (Potentially Hazardous Objects) based on size and distance
        const isPotentiallyHazardous = asteroid.is_potentially_hazardous_asteroid;
        
        // Calculate custom risk level based on size and distance
        const avgDiameter = (diameter_min + diameter_max) / 2;
        let riskLevel = 'low';
        if (isPotentiallyHazardous) {
          // High risk: Large (>1km) and very close (<0.02 AU)
          if (avgDiameter > 1000 && distance_au < 0.02) riskLevel = 'high';
          // Medium risk: Medium size (>500m) or close (<0.05 AU)
          else if (avgDiameter > 500 || distance_au < 0.05) riskLevel = 'medium';
        }
        
        // Create our simplified asteroid object
        allAsteroids.push({
          id: `neows_${asteroid.id}`,
          name: asteroid.name.replace(/[()]/g, ''), // Remove parentheses for cleaner display
          fullName: asteroid.name,
          approachDate: closeApproach.close_approach_date_full,
          distance: {
            au: distance_au.toFixed(6),  // Astronomical Units
            ld: distance_ld.toFixed(2),   // Lunar Distances (Earth-Moon distance)
            km: distance_km.toFixed(0)    // Kilometers
          },
          velocity: {
            kmh: velocity_kmh.toFixed(0), // km/hour
            kms: velocity_kms.toFixed(2)  // km/second
          },
          diameter: {
            min: diameter_min.toFixed(0),
            max: diameter_max.toFixed(0),
            unit: 'meters'
          },
          magnitude: asteroid.absolute_magnitude_h, // Brightness
          isPotentiallyHazardous,
          isApproachingNow,
          riskLevel,
          threatLevel: riskLevel, // Alias for compatibility
          lastUpdated: new Date().toISOString(),
          nasaJplUrl: asteroid.nasa_jpl_url,
          orbitingBody: closeApproach.orbiting_body
        });
      });
    });
    
    // Sort asteroids by approach date (soonest first)
    return allAsteroids.sort((a, b) => new Date(a.approachDate) - new Date(b.approachDate));
  };

  const fetchAsteroidData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate date range (NASA API limits to 7 days max)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + Math.min(filters.dateRange, 7));
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Fetch data from our backend API (which calls NASA API)
      const data = await apiClient.getAsteroidFeed(startDateStr, endDateStr);
      
      if (!data || !data.near_earth_objects) {
        throw new Error('Invalid response format from backend API');
      }
      
      // Transform NASA data to our simplified format
      const transformedData = transformNeoWsData(data);
      
      // Apply PHO filter if enabled
      const filteredData = transformedData.filter(asteroid => {
        if (filters.showOnlyPHO && !asteroid.isPotentiallyHazardous) return false;
        return true;
      });
      
      setAsteroids(filteredData);
      setError(null);

    } catch (fetchError) {
      console.error('Failed to fetch asteroid data:', fetchError);
      setError(`Failed to fetch asteroid data: ${fetchError.message}`);
      setAsteroids([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAsteroidData();
    setRefreshing(false);
  };

  // Fetch data on mount, when filters change, and auto-refresh every 15 minutes
  useEffect(() => {
    fetchAsteroidData(); // Initial fetch
    
    // Auto-refresh every 15 minutes to avoid hitting NASA API rate limits
    const interval = setInterval(fetchAsteroidData, 15 * 60 * 1000);
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchAsteroidData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-white/70">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Loading asteroid data...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-300 mb-2">Data Loading Issue</h3>
          <p className="text-red-200/70 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {asteroids.map(asteroid => (
          <AsteroidCard key={asteroid.id} asteroid={asteroid} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-300">{asteroids.length}</div>
              <div className="text-sm text-blue-200/70">Tracked Objects</div>
            </div>
            <Target className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="bg-yellow-900/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-300">
                {asteroids.filter(a => a.isPotentiallyHazardous).length}
              </div>
              <div className="text-sm text-yellow-200/70">Potentially Hazardous</div>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Controls - Simplified */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: parseInt(e.target.value) }))}
                className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
                style={{ 
                  colorScheme: 'dark',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white'
                }}
              >
                <option value={7} style={{ backgroundColor: '#1f2937', color: 'white' }}>Next 7 days</option>
                <option value={30} style={{ backgroundColor: '#1f2937', color: 'white' }}>Next 30 days</option>
                <option value={60} style={{ backgroundColor: '#1f2937', color: 'white' }}>Next 60 days</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showOnlyPHO}
                onChange={(e) => setFilters(prev => ({ ...prev, showOnlyPHO: e.target.checked }))}
                className="rounded border-white/20"
              />
              <span className="text-sm text-white/70">Show only Potentially Hazardous</span>
            </label>
          </div>

          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      {asteroids.length === 0 && !loading && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">No asteroids match your filters</h3>
          <p className="text-white/50">Try adjusting your filter settings to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default AsteroidTracker; 