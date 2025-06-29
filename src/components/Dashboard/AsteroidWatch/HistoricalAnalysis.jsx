import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  TrendingUp, 
  Calendar, 
  Target,
  BarChart3,
  GitBranch,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import apiClient from '../../../services/api';

const HistoricalAnalysis = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1); // Default to last year since current year data might be incomplete
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'chart', 'list'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch real historical data from NASA NeoWs API
  const fetchHistoricalData = async () => {
    setLoading(true);
    
    try {
      console.log(`Fetching historical asteroid data for ${selectedYear}...`);
      
      // Optimize API calls: Instead of 12 monthly calls, use fewer calls with larger date ranges
      // NASA API allows up to 7 days per call, so we'll use 7-day chunks throughout the year
      const dateRanges = [];
      
      // Create 7-day date ranges throughout the year (sample every ~2 weeks)
      for (let month = 0; month < 12; month += 2) { // Every 2 months
        const startDate = new Date(selectedYear, month, 1);
        const endDate = new Date(selectedYear, month, 7);
        
        dateRanges.push({
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        });
      }
      
      console.log(`Making ${dateRanges.length} API calls instead of 12...`);
      
      // Use Promise.all to make concurrent API calls instead of sequential
      const apiPromises = dateRanges.map(async (range) => {
        try {
          console.log(`Fetching data for range ${range.start} to ${range.end}`);
          
          // Use the proper API client instead of hardcoded localhost
          const data = await apiClient.getAsteroidFeed(range.start, range.end);
          
          if (data && data.near_earth_objects) {
            const rangeEvents = [];
            
            // Process each date's data
            Object.keys(data.near_earth_objects).forEach(date => {
              const asteroidsForDate = data.near_earth_objects[date];
              
              asteroidsForDate.forEach((asteroid) => {
                const closeApproach = asteroid.close_approach_data[0];
                if (!closeApproach) return;
                
                const distance_au = parseFloat(closeApproach.miss_distance.astronomical);
                const distance_ld = parseFloat(closeApproach.miss_distance.lunar);
                const distance_km = parseFloat(closeApproach.miss_distance.kilometers);
                const velocity_kms = parseFloat(closeApproach.relative_velocity.kilometers_per_second);
                
                const diameter_min = parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_min);
                const diameter_max = parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_max);
                const avgDiameter = (diameter_min + diameter_max) / 2;
                
                // Determine significance based on distance and size
                let significance = 'low';
                if (asteroid.is_potentially_hazardous_asteroid) {
                  if (distance_au < 0.02 && avgDiameter > 1000) significance = 'high';
                  else if (distance_au < 0.05 || avgDiameter > 500) significance = 'medium';
                } else if (distance_au < 0.1 && avgDiameter > 100) {
                  significance = 'medium';
                }
                
                rangeEvents.push({
                  id: `nasa_${asteroid.id}_${date}`,
                  name: asteroid.name.replace(/[()]/g, ''),
                  fullName: asteroid.name,
                  date: closeApproach.close_approach_date_full,
                  year: selectedYear,
                  distance: {
                    au: distance_au.toFixed(6),
                    ld: distance_ld.toFixed(2),
                    km: distance_km.toFixed(0)
                  },
                  diameter: Math.round(avgDiameter),
                  velocity: velocity_kms.toFixed(2),
                  magnitude: asteroid.absolute_magnitude_h.toFixed(1),
                  significance,
                  isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
                  nasaJplUrl: asteroid.nasa_jpl_url,
                  orbitingBody: closeApproach.orbiting_body
                });
              });
            });
            
            return rangeEvents;
          }
          
          return [];
        } catch (rangeError) {
          console.warn(`Failed to fetch data for range ${range.start} to ${range.end}:`, rangeError);
          return [];
        }
      });
      
      // Wait for all API calls to complete concurrently
      const results = await Promise.all(apiPromises);
      
      // Flatten all events from all ranges
      const allEvents = results.flat();
      
      // Sort events by date (most recent first)
      const sortedEvents = allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      console.log(`Fetched ${sortedEvents.length} historical events for ${selectedYear}`);
      setHistoricalData(sortedEvents);
      
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [selectedYear]);

  const getYearlyStats = () => {
    const yearlyData = {};
    
    historicalData.forEach(event => {
      if (!yearlyData[event.year]) {
        yearlyData[event.year] = {
          total: 0,
          significant: 0,
          closest: Number.MAX_SAFE_INTEGER,
          largest: 0
        };
      }
      
      yearlyData[event.year].total++;
      if (event.significance === 'high') yearlyData[event.year].significant++;
      if (parseFloat(event.distance.au) < yearlyData[event.year].closest) {
        yearlyData[event.year].closest = parseFloat(event.distance.au);
      }
      if (event.diameter > yearlyData[event.year].largest) {
        yearlyData[event.year].largest = event.diameter;
      }
    });

    return yearlyData;
  };

  const yearlyStats = getYearlyStats();

  const EventCard = ({ event }) => {
    const getSignificanceColor = (significance) => {
      switch (significance) {
        case 'high': return 'border-red-500/50 bg-red-900/20';
        case 'medium': return 'border-yellow-500/50 bg-yellow-900/20';
        case 'low': return 'border-green-500/50 bg-green-900/20';
        default: return 'border-gray-500/50 bg-gray-900/20';
      }
    };

    return (
      <div 
        className={`p-4 rounded-xl border backdrop-blur-lg hover:scale-105 transition-all duration-300 cursor-pointer ${getSignificanceColor(event.significance)}`}
        onClick={() => setSelectedEvent(event)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{event.name}</h3>
            <p className="text-sm text-white/60">
              {new Date(event.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            event.significance === 'high' ? 'bg-red-500/20 text-red-300' :
            event.significance === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-green-500/20 text-green-300'
          }`}>
            {event.significance.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-white/60">Distance:</span>
            <div className="text-white font-medium">{event.distance.ld} LD</div>
          </div>
          <div>
            <span className="text-white/60">Size:</span>
            <div className="text-white font-medium">{event.diameter}m</div>
          </div>
          <div>
            <span className="text-white/60">Velocity:</span>
            <div className="text-white font-medium">{event.velocity} km/s</div>
          </div>
          <div>
            <span className="text-white/60">Magnitude:</span>
            <div className="text-white font-medium">{event.magnitude}</div>
          </div>
        </div>
      </div>
    );
  };

  const TimelineView = () => (
    <div className="space-y-6">
      {Object.entries(yearlyStats).map(([year, stats]) => (
        <div key={year} className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-white">{year}</h3>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-300">{stats.total}</div>
                <div className="text-white/60">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-300">{stats.significant}</div>
                <div className="text-white/60">Significant</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-300">{stats.closest.toFixed(3)}</div>
                <div className="text-white/60">Closest (AU)</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historicalData
              .filter(event => event.year === parseInt(year))
              .slice(0, 6)
              .map(event => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  const ChartView = () => {
    const years = Object.keys(yearlyStats).sort();
    const maxEvents = Math.max(...Object.values(yearlyStats).map(s => s.total));

    return (
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Annual Close Approach Statistics
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Events Per Year</h4>
            <div className="space-y-3">
              {years.map(year => (
                <div key={year} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-white/70">{year}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 relative">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                      style={{ width: `${(yearlyStats[year].total / maxEvents) * 100}%` }}
                    >
                      {yearlyStats[year].total > 0 && yearlyStats[year].total}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Analysis */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Trend Analysis</h4>
            <div className="space-y-4">
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Detection Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {(historicalData.length / years.length).toFixed(1)}
                </div>
                <div className="text-sm text-white/60">Average per year</div>
              </div>

              <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">Closest Approach</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.min(...Object.values(yearlyStats).map(s => s.closest)).toFixed(3)}
                </div>
                <div className="text-sm text-white/60">AU (Historical minimum)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-white/70">
          <Clock className="w-6 h-6 animate-spin" />
          <span>Loading historical data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Historical Analysis</h3>
            <span className="text-sm text-white/60">({historicalData.length} recorded events)</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Year Navigator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedYear(prev => Math.max(2015, prev - 1))}
                disabled={selectedYear <= 2015}
                className="p-1 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-lg font-semibold text-white px-3">
                {selectedYear}
              </span>
              <button
                onClick={() => setSelectedYear(prev => Math.min(new Date().getFullYear(), prev + 1))}
                disabled={selectedYear >= new Date().getFullYear()}
                className="p-1 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              {[
                { id: 'timeline', label: 'Timeline', icon: GitBranch },
                { id: 'chart', label: 'Charts', icon: BarChart3 },
                { id: 'list', label: 'List', icon: Filter }
              ].map(mode => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm
                      ${viewMode === mode.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'timeline' && <TimelineView />}
      {viewMode === 'chart' && <ChartView />}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historicalData.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Selected Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedEvent.name}</h2>
                <p className="text-white/60">
                  Close Approach: {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white/60 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Physical Characteristics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Estimated Diameter:</span>
                      <span className="text-white font-medium">{selectedEvent.diameter}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Absolute Magnitude:</span>
                      <span className="text-white font-medium">{selectedEvent.magnitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Relative Velocity:</span>
                      <span className="text-white font-medium">{selectedEvent.velocity} km/s</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">NASA Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Potentially Hazardous:</span>
                      <span className={`font-medium ${selectedEvent.isPotentiallyHazardous ? 'text-red-300' : 'text-green-300'}`}>
                        {selectedEvent.isPotentiallyHazardous ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Orbiting Body:</span>
                      <span className="text-white font-medium">{selectedEvent.orbitingBody || 'Earth'}</span>
                    </div>
                    {selectedEvent.nasaJplUrl && (
                      <div className="pt-2">
                        <a 
                          href={selectedEvent.nasaJplUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          View NASA JPL Details →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Approach Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Distance (AU):</span>
                      <span className="text-white font-medium">{selectedEvent.distance.au}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Distance (LD):</span>
                      <span className="text-white font-medium">{selectedEvent.distance.ld}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Distance (km):</span>
                      <span className="text-white font-medium">{selectedEvent.distance.km.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${
                  selectedEvent.significance === 'high' ? 'bg-red-900/20 border border-red-500/30' :
                  selectedEvent.significance === 'medium' ? 'bg-yellow-900/20 border border-yellow-500/30' :
                  'bg-green-900/20 border border-green-500/30'
                }`}>
                  <h3 className="text-lg font-semibold text-white mb-2">Significance Level</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedEvent.significance === 'high' ? 'bg-red-500/20 text-red-300' :
                    selectedEvent.significance === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {selectedEvent.significance.toUpperCase()} SIGNIFICANCE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalAnalysis; 