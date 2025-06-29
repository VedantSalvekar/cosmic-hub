import React, { useState, useEffect, useCallback } from 'react';
import { 
  Target, 
  Filter, 
  Eye, 
  Calendar, 
  Zap, 
  Globe,
  Activity,
  AlertCircle,
  Clock,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import AsteroidCard from './components/AsteroidCard';
import AsteroidTable from './components/AsteroidTable';
import apiClient from '../../../services/api';

const AsteroidTracker = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table'
  const [filters, setFilters] = useState({
    dateRange: 60, // days
    sizeCategory: 'all', // 'small', 'medium', 'large', 'all'
    distance: 0.2, // AU
    showOnlyPHO: false // Potentially Hazardous Objects only
  });
  const [refreshing, setRefreshing] = useState(false);

  // Transform NASA NeoWs API data to our format
  const transformNeoWsData = (neoWsData) => {
    if (!neoWsData || !neoWsData.near_earth_objects) return [];
    
    const allAsteroids = [];
    
    // NeoWs organizes data by date, so we need to iterate through each date
    Object.keys(neoWsData.near_earth_objects).forEach(date => {
      const asteroidsForDate = neoWsData.near_earth_objects[date];
      
             asteroidsForDate.forEach((asteroid) => {
        // Find the closest approach for this asteroid
        const closeApproach = asteroid.close_approach_data[0]; // Usually sorted by date
        
        if (!closeApproach) return;
        
        const distance_au = parseFloat(closeApproach.miss_distance.astronomical);
        const distance_ld = parseFloat(closeApproach.miss_distance.lunar);
        const distance_km = parseFloat(closeApproach.miss_distance.kilometers);
        const velocity_kms = parseFloat(closeApproach.relative_velocity.kilometers_per_second);
        const velocity_kmh = parseFloat(closeApproach.relative_velocity.kilometers_per_hour);
        
        // Get diameter estimates
        const diameter_min = parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_min);
        const diameter_max = parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_max);
        
        const approachDate = new Date(closeApproach.close_approach_date_full);
        const now = new Date();
        const timeDiff = approachDate - now;
        const isApproachingNow = timeDiff > 0 && timeDiff < 7 * 24 * 60 * 60 * 1000; // Within 7 days
        
        // NASA provides PHO status directly
        const isPotentiallyHazardous = asteroid.is_potentially_hazardous_asteroid;
        
        // Determine risk level
        const avgDiameter = (diameter_min + diameter_max) / 2;
        let riskLevel = 'low';
        if (isPotentiallyHazardous) {
          if (avgDiameter > 1000 && distance_au < 0.02) riskLevel = 'high';
          else if (avgDiameter > 500 || distance_au < 0.05) riskLevel = 'medium';
        }
        
        allAsteroids.push({
          id: `neows_${asteroid.id}`,
          name: asteroid.name.replace(/[()]/g, ''), // Clean up name
          fullName: asteroid.name,
          approachDate: closeApproach.close_approach_date_full,
          distance: {
            au: distance_au.toFixed(6),
            ld: distance_ld.toFixed(2),
            km: distance_km.toFixed(0)
          },
          velocity: {
            kmh: velocity_kmh.toFixed(0),
            kms: velocity_kms.toFixed(2)
          },
          diameter: {
            min: diameter_min.toFixed(0),
            max: diameter_max.toFixed(0),
            unit: 'meters'
          },
          magnitude: asteroid.absolute_magnitude_h,
          isPotentiallyHazardous,
          isApproachingNow,
          riskLevel,
          threatLevel: riskLevel, // For backward compatibility
          lastUpdated: new Date().toISOString(),
          nasaJplUrl: asteroid.nasa_jpl_url,
          orbitingBody: closeApproach.orbiting_body
        });
      });
    });
    
    // Sort by approach date
    return allAsteroids.sort((a, b) => new Date(a.approachDate) - new Date(b.approachDate));
  };

  const fetchAsteroidData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching asteroid data from backend API...');
      
      // Calculate date range (backend handles the 7-day limit)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + Math.min(filters.dateRange, 7));
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Use backend API instead of direct NASA API call
      const data = await apiClient.getAsteroidFeed(startDateStr, endDateStr);
      console.log('Backend API Response:', data);
      
      if (!data || !data.near_earth_objects) {
        throw new Error('Invalid response format from backend API');
      }
      
      // Transform NASA NeoWs data to our format
      const transformedData = transformNeoWsData(data);
      
      // Apply client-side filtering
      const filteredData = transformedData.filter(asteroid => {
        // Distance filter (convert from AU to match our filter)
        const distanceAU = parseFloat(asteroid.distance.au);
        if (distanceAU > filters.distance) return false;

        // PHO filter
        if (filters.showOnlyPHO && !asteroid.isPotentiallyHazardous) return false;

        // Size filter
        const avgDiameter = (parseFloat(asteroid.diameter.min) + parseFloat(asteroid.diameter.max)) / 2;
        if (filters.sizeCategory !== 'all') {
          if (filters.sizeCategory === 'small' && avgDiameter >= 100) return false;
          if (filters.sizeCategory === 'medium' && (avgDiameter < 100 || avgDiameter >= 1000)) return false;
          if (filters.sizeCategory === 'large' && avgDiameter < 1000) return false;
        }

        return true;
      });
      
      setAsteroids(filteredData);
      setError(null);

    } catch (fetchError) {
      console.error('NASA NeoWs API fetch failed:', fetchError);
      setError(`Failed to fetch real asteroid data: ${fetchError.message}`);
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

  useEffect(() => {
    fetchAsteroidData();
  }, [filters]); // Refetch when filters change

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAsteroidData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAsteroidData]);

  const filteredAsteroids = asteroids.filter(asteroid => {
    // Date filter
    const approachDate = new Date(asteroid.approachDate);
    const now = new Date();
    const daysDiff = (approachDate - now) / (1000 * 60 * 60 * 24);
    if (daysDiff > filters.dateRange) return false;

    // Size filter
    const diameter = parseInt(asteroid.diameter.max);
    if (filters.sizeCategory !== 'all') {
      if (filters.sizeCategory === 'small' && diameter >= 100) return false;
      if (filters.sizeCategory === 'medium' && (diameter < 100 || diameter >= 1000)) return false;
      if (filters.sizeCategory === 'large' && diameter < 1000) return false;
    }

    // Distance filter
    if (parseFloat(asteroid.distance.au) > filters.distance) return false;

    // PHO filter
    if (filters.showOnlyPHO && !asteroid.isPotentiallyHazardous) return false;

    return true;
  });

  const renderViewModeContent = () => {
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

    switch (viewMode) {
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAsteroids.map(asteroid => (
              <AsteroidCard key={asteroid.id} asteroid={asteroid} />
            ))}
          </div>
        );
      case 'table':
        return <AsteroidTable asteroids={filteredAsteroids} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAsteroids.map(asteroid => (
              <AsteroidCard key={asteroid.id} asteroid={asteroid} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-300">{filteredAsteroids.length}</div>
              <div className="text-sm text-blue-200/70">Tracked Objects</div>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-green-900/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-300">
                {filteredAsteroids.filter(a => a.isApproachingNow).length}
              </div>
              <div className="text-sm text-green-200/70">Approaching Now</div>
            </div>
            <Activity className="w-8 h-8 text-green-400 animate-pulse" />
          </div>
        </div>

        <div className="bg-yellow-900/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-300">
                {filteredAsteroids.filter(a => a.isPotentiallyHazardous).length}
              </div>
              <div className="text-sm text-yellow-200/70">Potentially Hazardous</div>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-purple-900/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-300">
                {Math.min(...filteredAsteroids.map(a => parseFloat(a.distance.ld))).toFixed(1)}
              </div>
              <div className="text-sm text-purple-200/70">Closest (LD)</div>
            </div>
            <Globe className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* View Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70 font-medium">View:</span>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              {[
                { id: 'cards', label: 'Cards', icon: Target },
                { id: 'table', label: 'Table', icon: Filter }
              ].map(view => {
                const IconComponent = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setViewMode(view.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md transition-all
                      ${viewMode === view.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{view.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: parseInt(e.target.value) }))}
                className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
                data-theme="dark"
                style={{ 
                  colorScheme: 'dark',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white'
                }}
              >
                <option value={7} style={{ backgroundColor: '#1f2937', color: 'white' }}>Next 7 days</option>
                <option value={30} style={{ backgroundColor: '#1f2937', color: 'white' }}>Next 30 days</option>
                <option value={60} style={{ backgroundColor: '#1f2937', color: 'white' }}>Next 60 days</option>
                <option value={90} style={{ backgroundColor: '#1f2937', color: 'white' }}>Next 90 days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/60" />
              <select
                value={filters.sizeCategory}
                onChange={(e) => setFilters(prev => ({ ...prev, sizeCategory: e.target.value }))}
                className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
                data-theme="dark"
                style={{ 
                  colorScheme: 'dark',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white'
                }}
              >
                <option value="all" style={{ backgroundColor: '#1f2937', color: 'white' }}>All Sizes</option>
                <option value="small" style={{ backgroundColor: '#1f2937', color: 'white' }}>Small (&lt;100m)</option>
                <option value="medium" style={{ backgroundColor: '#1f2937', color: 'white' }}>Medium (100m-1km)</option>
                <option value="large" style={{ backgroundColor: '#1f2937', color: 'white' }}>Large (&gt;1km)</option>
              </select>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.showOnlyPHO}
                onChange={(e) => setFilters(prev => ({ ...prev, showOnlyPHO: e.target.checked }))}
                className="rounded border-white/20"
              />
              <span className="text-sm text-white/70">PHO Only</span>
            </label>

            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {renderViewModeContent()}
      </div>

      {filteredAsteroids.length === 0 && !loading && (
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