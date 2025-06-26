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
  Settings 
} from 'lucide-react';
import { Sidebar, Menu as ProMenu, MenuItem } from 'react-pro-sidebar';
import SolarSystemBackground from './SolarSystemBackground';
import Footer from './Footer';
import FloatingMenuButton from './FloatingMenuButton';
import APOD from './APOD';
import AsteroidWatch from './AsteroidWatch';

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUTCTime = (date) => {
    return date.toUTCString().slice(17, 25);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'apod', label: 'APOD', icon: Camera },
    { id: 'asteroids', label: 'Asteroid Watch', icon: Target },
    { id: 'events', label: 'Events', icon: Calendar }
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
            {formatUTCTime(currentTime)} UTC
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
          <div style={{ padding: '24px 20px 16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl"></span>
              Cosmic Hub
            </h1>
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
                <div className="flex flex-col items-center pt-20">
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