import React from 'react';
import SolarSystemBackground from './SolarSystemBackground';

/**
 * Immersive Space Dashboard
 * Focus: Pure 3D Solar System Experience with Scrollable Modules
 */
const Dashboard = () => {
  // Data will be fetched when we add modules later

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">
      {/* 3D Solar System Background - Fixed and Immersive */}
      <SolarSystemBackground />
      
      {/* Scrollable Content Sections */}
      <div className="relative z-10 w-full">
        
        {/* Section 1: Pure Solar System View */}
        <div className="w-full h-screen flex items-center justify-center">
          {/* This section is purely for viewing the solar system */}
        </div>

        {/* Section 2: APOD Module */}
        <div className="w-full h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            {/* APOD content will go here */}
          </div>
        </div>

        {/* Section 3: Asteroid Tracking Module */}
        <div className="w-full h-screen flex items-center justify-center p-8">
          <div className="max-w-6xl w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            {/* Asteroid tracking content will go here */}
          </div>
        </div>

        {/* Section 4: Mission Control Module */}
        <div className="w-full h-screen flex items-center justify-center p-8">
          <div className="max-w-5xl w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            {/* Mission control content will go here */}
          </div>
        </div>

        {/* Section 5: Data Analytics Module */}
        <div className="w-full h-screen flex items-center justify-center p-8">
          <div className="max-w-7xl w-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            {/* Data analytics content will go here */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard; 