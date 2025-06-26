import React, { useState, useEffect } from 'react';
import { Search, Database, ExternalLink, Target, Activity } from 'lucide-react';
import RiskBadge from './components/RiskBadge';

const AsteroidProfiles = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [filteredAsteroids, setFilteredAsteroids] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate asteroid database
  const generateAsteroidDatabase = () => {
    const wellKnownAsteroids = [
      {
        name: '99942 Apophis',
        designation: '2004 MN4',
        type: 'Aten',
        discovery: { date: '2004-06-19', observatory: 'Kitt Peak' },
        physical: { 
          diameter: { min: 340, max: 370 }, 
          mass: 6.1e10, 
          rotationPeriod: 30.56, 
          spectralType: 'Sq',
          composition: 'Rocky silicate'
        },
        orbital: {
          semiMajorAxis: 0.9224,
          period: 323.6,
          lastObserved: '2024-01-15'
        },
        approaches: [
          { date: '2029-04-13', distance: { au: 0.00025, ld: 9.6, km: 37624 }, velocity: 7.42 }
        ],
        isPHO: true,
        riskLevel: 'medium'
      },
      {
        name: '101955 Bennu',
        designation: '1999 RQ36',
        type: 'Apollo',
        discovery: { date: '1999-09-11', observatory: 'LINEAR' },
        physical: { 
          diameter: { min: 490, max: 510 }, 
          mass: 7.8e10, 
          rotationPeriod: 4.297, 
          spectralType: 'B',
          composition: 'Carbonaceous'
        },
        orbital: {
          semiMajorAxis: 1.1264,
          period: 436.6,
          lastObserved: '2023-12-20'
        },
        approaches: [
          { date: '2037-09-25', distance: { au: 0.0048, ld: 186.8, km: 718000 }, velocity: 11.57 }
        ],
        isPHO: true,
        riskLevel: 'low'
      },
      {
        name: '25143 Itokawa',
        designation: '1998 SF36',
        type: 'Apollo',
        discovery: { date: '1998-09-26', observatory: 'LINEAR' },
        physical: { 
          diameter: { min: 330, max: 340 }, 
          mass: 3.58e10, 
          rotationPeriod: 12.132, 
          spectralType: 'S',
          composition: 'Silicate'
        },
        orbital: {
          semiMajorAxis: 1.324,
          period: 556,
          lastObserved: '2023-11-08'
        },
        approaches: [
          { date: '2025-08-14', distance: { au: 0.0156, ld: 607.2, km: 2340000 }, velocity: 8.34 }
        ],
        isPHO: false,
        riskLevel: 'low'
      }
    ];

    return wellKnownAsteroids;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const database = generateAsteroidDatabase();
      setAsteroids(database);
      setFilteredAsteroids(database);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = asteroids.filter(asteroid =>
      asteroid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asteroid.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asteroid.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAsteroids(filtered);
  }, [searchTerm, asteroids]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-white/70">
          <Database className="w-6 h-6 animate-pulse" />
          <span>Loading asteroid database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Asteroid Database</h3>
            <span className="text-sm text-white/60">({asteroids.length} objects)</span>
          </div>
          
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-3 w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Search asteroids by name, designation, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAsteroids.map(asteroid => (
          <div 
            key={asteroid.name}
            className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => setSelectedAsteroid(asteroid)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{asteroid.name}</h3>
                <p className="text-sm text-white/60">{asteroid.designation} • {asteroid.type} Class</p>
              </div>
              <RiskBadge level={asteroid.riskLevel} isPHO={asteroid.isPHO} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-blue-300">Diameter</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {asteroid.physical.diameter.min}-{asteroid.physical.diameter.max}m
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-300">Period</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {asteroid.orbital.period.toFixed(0)} days
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">
                Discovered: {new Date(asteroid.discovery.date).getFullYear()}
              </span>
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Profile Modal */}
      {selectedAsteroid && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white">{selectedAsteroid.name}</h1>
                  <p className="text-white/60 text-lg">{selectedAsteroid.designation} • {selectedAsteroid.type} Class NEA</p>
                </div>
                <button
                  onClick={() => setSelectedAsteroid(null)}
                  className="text-white/60 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Physical Properties
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Diameter:</span>
                      <span className="text-white font-medium">
                        {selectedAsteroid.physical.diameter.min}-{selectedAsteroid.physical.diameter.max}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Mass:</span>
                      <span className="text-white font-medium">
                        {(selectedAsteroid.physical.mass / 1e9).toFixed(1)} × 10⁹ kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Rotation Period:</span>
                      <span className="text-white font-medium">
                        {selectedAsteroid.physical.rotationPeriod.toFixed(2)} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Spectral Type:</span>
                      <span className="text-white font-medium">{selectedAsteroid.physical.spectralType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Composition:</span>
                      <span className="text-white font-medium">{selectedAsteroid.physical.composition}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Orbital Elements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Semi-major Axis:</span>
                      <span className="text-white font-medium">{selectedAsteroid.orbital.semiMajorAxis.toFixed(4)} AU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Orbital Period:</span>
                      <span className="text-white font-medium">{selectedAsteroid.orbital.period.toFixed(1)} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Classification:</span>
                      <span className="text-white font-medium">{selectedAsteroid.type} NEA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Last Observed:</span>
                      <span className="text-white font-medium">
                        {new Date(selectedAsteroid.orbital.lastObserved).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Discovered:</span>
                      <span className="text-white font-medium">
                        {new Date(selectedAsteroid.discovery.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAsteroid.approaches.length > 0 && (
                <div className="mt-6 bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Next Close Approach</h3>
                  <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/30">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-300">
                          {new Date(selectedAsteroid.approaches[0].date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-white/60">Date</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-300">
                          {selectedAsteroid.approaches[0].distance.ld}
                        </div>
                        <div className="text-sm text-white/60">Lunar Distances</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-300">
                          {selectedAsteroid.approaches[0].velocity}
                        </div>
                        <div className="text-sm text-white/60">km/s</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-300">
                          {selectedAsteroid.approaches[0].distance.au}
                        </div>
                        <div className="text-sm text-white/60">AU</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <RiskBadge level={selectedAsteroid.riskLevel} isPHO={selectedAsteroid.isPHO} />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Risk Assessment</h4>
                <p className="text-sm text-white/70">
                  {selectedAsteroid.riskLevel === 'high' && 'This asteroid requires high priority monitoring due to its size and orbital characteristics. Regular tracking is essential for planetary defense.'}
                  {selectedAsteroid.riskLevel === 'medium' && 'This asteroid is classified as moderately hazardous. Continued observation will refine our understanding of its trajectory.'}
                  {selectedAsteroid.riskLevel === 'low' && 'Current orbital calculations indicate this asteroid poses minimal risk to Earth. Routine monitoring continues.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredAsteroids.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">No asteroids found</h3>
          <p className="text-white/50">Try adjusting your search terms or browse all available objects.</p>
        </div>
      )}
    </div>
  );
};

export default AsteroidProfiles; 