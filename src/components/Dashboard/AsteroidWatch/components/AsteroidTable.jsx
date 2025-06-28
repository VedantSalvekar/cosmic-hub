import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  AlertTriangle, 
  Clock,
  Target,
  Activity
} from 'lucide-react';
import RiskBadge from './RiskBadge';

const AsteroidTable = ({ asteroids }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'approachDate', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredAsteroids = useMemo(() => {
    let filtered = asteroids.filter(asteroid =>
      asteroid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asteroid.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === 'distance') {
          aValue = parseFloat(a.distance.au);
          bValue = parseFloat(b.distance.au);
        } else if (sortConfig.key === 'velocity') {
          aValue = parseFloat(a.velocity?.kms || a.velocity);
          bValue = parseFloat(b.velocity?.kms || b.velocity);
        } else if (sortConfig.key === 'diameter') {
          aValue = parseInt(a.diameter.max);
          bValue = parseInt(b.diameter.max);
        } else if (sortConfig.key === 'approachDate') {
          aValue = new Date(a.approachDate);
          bValue = new Date(b.approachDate);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [asteroids, sortConfig, searchTerm]);

  const SortableHeader = ({ label, sortKey, children }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        <span>{label}</span>
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'asc' 
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getRowClass = (asteroid) => {
    const now = new Date();
    const approach = new Date(asteroid.approachDate);
    const hoursUntil = (approach - now) / (1000 * 60 * 60);
    
    if (hoursUntil < 24) return 'bg-red-900/20 border-red-500/30';
    if (hoursUntil < 168) return 'bg-yellow-900/20 border-yellow-500/30'; // 7 days
    return 'bg-white/5 border-white/10';
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3 bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <Search className="w-5 h-5 text-white/60" />
        <input
          type="text"
          placeholder="Search asteroids by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
        />
        <div className="text-sm text-white/60">
          {sortedAndFilteredAsteroids.length} of {asteroids.length} objects
        </div>
      </div>

      {/* Table */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-black/30">
              <tr>
                <SortableHeader label="Name" sortKey="name">
                  <Target className="w-4 h-4 text-blue-400" />
                </SortableHeader>
                <SortableHeader label="Approach Date" sortKey="approachDate">
                  <Clock className="w-4 h-4 text-green-400" />
                </SortableHeader>
                <SortableHeader label="Distance" sortKey="distance">
                  <Activity className="w-4 h-4 text-purple-400" />
                </SortableHeader>
                <SortableHeader label="Velocity" sortKey="velocity">
                  <Activity className="w-4 h-4 text-yellow-400" />
                </SortableHeader>
                <SortableHeader label="Size" sortKey="diameter">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </SortableHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sortedAndFilteredAsteroids.map((asteroid) => {
                const { date, time } = formatDate(asteroid.approachDate);
                
                return (
                  <tr 
                    key={asteroid.id}
                    className={`
                      hover:bg-white/5 transition-colors cursor-pointer border-l-2
                      ${getRowClass(asteroid)}
                    `}
                  >
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {asteroid.name}
                        </div>
                        <div className="text-xs text-white/60">
                          {asteroid.fullName}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {date}
                        </div>
                        <div className="text-xs text-white/60">
                          {time} UTC
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {asteroid.distance.ld} LD
                        </div>
                        <div className="text-xs text-white/60">
                          {asteroid.distance.au} AU
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-white">
                        {asteroid.velocity?.kms || asteroid.velocity} km/s
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {asteroid.diameter.min}-{asteroid.diameter.max}m
                        </div>
                        <div className="text-xs text-white/60">
                          Est. diameter
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <RiskBadge 
                        level={asteroid.threatLevel} 
                        isPHO={asteroid.isPotentiallyHazardous} 
                      />
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {asteroid.isApproachingNow && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-red-300 font-medium">
                              APPROACHING
                            </span>
                          </div>
                        )}
                        {asteroid.isPotentiallyHazardous && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-orange-900/30 rounded text-xs">
                            <AlertTriangle className="w-3 h-3 text-orange-400" />
                            <span className="text-orange-300">PHO</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {sortedAndFilteredAsteroids.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">No results found</h3>
          <p className="text-white/50">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
};

export default AsteroidTable; 