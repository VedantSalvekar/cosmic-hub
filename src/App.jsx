import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';

/**
 * Main App Component
 * 
 * Entry point for the Cosmic Hub application
 * Renders the main dashboard with 3D solar system background
 * and glass morphism UI components
 */
function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
