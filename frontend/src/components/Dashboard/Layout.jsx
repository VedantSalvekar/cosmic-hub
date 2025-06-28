import React, { useState } from 'react';
import { 
  Home, 
  Camera, 
  Zap, 
  Target, 
  Rocket, 
  Radio, 
  Calendar, 
  Telescope, 
  Globe, 
  Settings,
  Lightbulb 
} from 'lucide-react';
import { Sidebar, Menu as ProMenu, MenuItem } from 'react-pro-sidebar';
import SolarSystemBackground from './SolarSystemBackground';
import Footer from './Footer';
import FloatingMenuButton from './FloatingMenuButton';
import APOD from './APOD';
import AsteroidWatch from './AsteroidWatch';
import FloatingAIButton from './FloatingAIButton';
import CosmicAIAssistant from './CosmicAIAssistant';

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentFact, setCurrentFact] = useState('');

  // Array of space fun facts
  const spaceFacts = [
    "🌟 One day on Venus is longer than one year on Venus! It takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
    "🕳️ If you fell into a black hole, time would slow down for you relative to the outside universe due to gravitational time dilation.",
    "🌙 The Moon is gradually moving away from Earth at about 3.8 cm per year - roughly the same rate your fingernails grow!",
    "☄️ Halley's Comet won't be visible from Earth again until 2061. It last appeared in 1986 and has an orbital period of 75-76 years.",
    "🌌 There are more stars in the observable universe than grains of sand on all the beaches on Earth - estimated at over 10^24 stars!"
  ];

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set random fact on component mount
  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    setCurrentFact(spaceFacts[randomIndex]);
  }, []);

  // const formatUTCTime = (date) => {
  //   return date.toUTCString().slice(17, 25);
  // };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'apod', label: 'APOD', icon: Camera },
    { id: 'asteroids', label: 'Asteroid Watch', icon: Target },
    // { id: 'events', label: 'Events', icon: Calendar }
  ];

  return (
    <div className="flex h-screen">
      {/* Time & Location - Top Right - Hide when on Asteroid Watch or APOD */}
      {activeSection !== 'asteroids' && activeSection !== 'apod' && (
        <div 
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] text-right text-white/90 pointer-events-none"
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 9999,
            textAlign: 'right'
          }}
        >
          <div className="text-sm font-semibold tracking-wide">
            {currentTime.toLocaleTimeString()} UTC
          </div>
          <div className="text-xs text-white/60 italic">
            Dublin, Ireland
          </div>
        </div>
      )}

      {/* Professional Sidebar */}
      <div
        onMouseLeave={() => setSidebarOpen(false)}
        className="relative"
      >
        <Sidebar
          collapsed={!sidebarOpen}
          onBackdropClick={() => setSidebarOpen(false)}
          toggled={sidebarOpen}
          breakPoint="always"
          backgroundColor="rgba(0, 0, 0, 0.2)"
          backdropColor="rgba(0, 0, 0, 0.5)"
          width="280px"
          collapsedWidth="0px"
          style={{
            height: '100vh',
            backdropFilter: 'blur(12px)',
            border: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          rootStyles={{
            '.ps-sidebar-container': {
              backgroundColor: 'rgba(0, 0, 0, 0.15) !important',
              backdropFilter: 'blur(12px)',
              border: 'none',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)'
            },
            '.ps-sidebar-root': {
              height: '100vh'
            }
          }}
        >
          {/* Sidebar Header */}
          <div style={{ padding: '24px 20px 20px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="flex flex-col items-center text-center space-y-3">
              <img 
                src="/images/cosmic_hub_logo.png" 
                alt="Cosmic Hub Logo" 
                className="w-32 h-32 object-contain"
              />
              <h1 className="text-xl font-bold text-white">
                Cosmic Hub
              </h1>
            </div>
          </div>

          <div style={{ padding: '20px 0' }}>
            <ProMenu
              menuItemStyles={{
                button: {
                  padding: '12px 24px',
                  margin: '6px 12px',
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.025em',
                  '&:hover': {
                    backgroundColor: 'rgba(6, 182, 212, 0.08)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(6, 182, 212, 0.15)',
                    backdropFilter: 'blur(12px)',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.1)'
                  },
                  '&.ps-active': {
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderLeft: '4px solid #3b82f6',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
                  }
                },
                root: {
                  fontSize: '14px'
                },
                icon: {
                  marginRight: '12px',
                  minWidth: '20px'
                },
                label: {
                  fontWeight: '500'
                }
              }}
            >
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <MenuItem
                    key={item.id}
                    icon={<IconComponent size={20} />}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    active={activeSection === item.id}
                  >
                    {item.label}
                  </MenuItem>
                );
              })}
            </ProMenu>
          </div>

          {/* Fun Facts Section */}
          <div style={{ padding: '0 20px 20px 20px', marginTop: 'auto' }}>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-semibold text-white/90">Fun Facts</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-white/80 leading-relaxed">
                  {currentFact}
                </p>
              </div>
            </div>
          </div>
        </Sidebar>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 relative bg-black">
        {/* 3D Solar System Background - Show with blur effect for APOD and Asteroid Watch */}
        <SolarSystemBackground isBlurred={activeSection === 'asteroids' || activeSection === 'apod'} />
        
        {/* Floating Menu Button */}
        <FloatingMenuButton 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          isOpen={sidebarOpen}
        />
              
        {/* Main Content Area */}
        <div className="min-h-screen flex flex-col relative z-10">
          {activeSection === 'apod' ? (
            // APOD page takes full screen without padding
            <APOD />
          ) : activeSection === 'asteroids' ? (
            // Asteroid Watch page with padding
            <main className="flex-1 p-6 relative z-10">
              <AsteroidWatch />
            </main>
          ) : (
            <main className="flex-1 p-0 relative z-10">
              {children || (
                <div className="flex flex-col items-center pt-10">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Welcome to Cosmic Hub
                  </h1>
                  <p className="text-white/70 text-lg text-center max-w-2xl">
                    Your mission control center for exploring the cosmos. Use the menu button 
                    to navigate through different sections and discover the wonders of space.
                  </p>
                </div>
              )}
            </main>
          )}
          {/* Floating AI Button */}
          <FloatingAIButton onClick={() => setIsAIAssistantOpen(true)} />

          {/* Cosmic AI Assistant */}
          <CosmicAIAssistant 
            isOpen={isAIAssistantOpen}
            onClose={() => setIsAIAssistantOpen(false)}
          />
          
          {/* Footer with higher z-index */}
          <div className="relative z-20">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 