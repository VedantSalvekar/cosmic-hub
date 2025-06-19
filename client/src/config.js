/**
 * Configuration File
 * 
 * Contains all application configuration constants:
 * - API endpoints
 * - Environment variables
 * - Feature flags
 * - Default values
 * 
 * This centralized configuration makes it easy to manage
 * different environments (development, staging, production)
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// NASA API Configuration
export const NASA_CONFIG = {
  // Rate limiting - NASA allows 1000 requests per hour with API key
  RATE_LIMIT: 1000,
  RATE_WINDOW: 3600000, // 1 hour in milliseconds
  
  // Default image sizes for APOD
  IMAGE_SIZES: {
    THUMBNAIL: 300,
    MEDIUM: 800,
    LARGE: 1200
  },
  
  // Asteroid threat thresholds (in Astronomical Units)
  THREAT_THRESHOLDS: {
    CRITICAL: 0.01,  // < 0.01 AU
    HIGH: 0.02,      // < 0.02 AU  
    MODERATE: 0.05,  // < 0.05 AU
    LOW: 0.1         // < 0.1 AU
  },
  
  // Fireball energy thresholds (in kilotons TNT equivalent)
  FIREBALL_THRESHOLDS: {
    MAJOR: 1.0,        // >= 1 kt
    SIGNIFICANT: 0.1,  // >= 0.1 kt
    MODERATE: 0.01,    // >= 0.01 kt
    MINOR: 0.001       // >= 0.001 kt
  }
};

// Dashboard Configuration
export const DASHBOARD_CONFIG = {
  // Auto-refresh intervals (in milliseconds)
  REFRESH_INTERVALS: {
    FAST: 30000,   // 30 seconds - for live activity
    NORMAL: 300000, // 5 minutes - for main data
    SLOW: 900000   // 15 minutes - for background data
  },
  
  // Animation durations (in seconds)
  ANIMATION_DURATIONS: {
    FAST: 0.3,
    NORMAL: 0.6,
    SLOW: 1.2
  },
  
  // Data limits
  DATA_LIMITS: {
    MAX_ASTEROIDS_DISPLAY: 20,
    MAX_FIREBALLS_DISPLAY: 10,
    MAX_ACTIVITIES_DISPLAY: 8,
    MAX_APOD_HISTORY: 30
  }
};

// 3D Solar System Configuration
export const SOLAR_SYSTEM_CONFIG = {
  // Planet orbital speeds (relative to Earth = 1.0)
  ORBITAL_SPEEDS: {
    MERCURY: 4.15,
    VENUS: 1.62,
    EARTH: 1.0,
    MARS: 0.53,
    JUPITER: 0.084,
    SATURN: 0.034,
    URANUS: 0.012,
    NEPTUNE: 0.006
  },
  
  // Planet sizes (relative to Earth = 1.0)
  PLANET_SIZES: {
    MERCURY: 0.38,
    VENUS: 0.95,
    EARTH: 1.0,
    MARS: 0.53,
    JUPITER: 11.2,
    SATURN: 9.4,
    URANUS: 4.0,
    NEPTUNE: 3.9
  },
  
  // Orbital distances (in AU)
  ORBITAL_DISTANCES: {
    MERCURY: 0.39,
    VENUS: 0.72,
    EARTH: 1.0,
    MARS: 1.52,
    JUPITER: 5.20,
    SATURN: 9.54,
    URANUS: 19.19,
    NEPTUNE: 30.07
  }
};

// UI Theme Configuration
export const THEME_CONFIG = {
  // Glass morphism settings
  GLASS: {
    BACKGROUND: 'rgba(255, 255, 255, 0.05)',
    BORDER: 'rgba(255, 255, 255, 0.1)',
    BACKDROP_BLUR: '12px'
  },
  
  // Color scheme
  COLORS: {
    COSMIC_DARK: '#0a0e1a',
    SPACE_BLUE: '#1e40af',
    STELLAR_PURPLE: '#7c3aed',
    NEBULA_PINK: '#ec4899',
    ASTEROID_ORANGE: '#f97316',
    EARTH_GREEN: '#22c55e',
    WARNING_YELLOW: '#eab308',
    DANGER_RED: '#ef4444'
  },
  
  // Gradients
  GRADIENTS: {
    COSMIC: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #ec4899 100%)',
    SPACE: 'linear-gradient(180deg, #0a0e1a 0%, #1e293b 100%)',
    NEBULA: 'radial-gradient(circle, #7c3aed 0%, #1e40af 100%)'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to NASA services. Please check your internet connection.',
  API_ERROR: 'NASA API temporarily unavailable. Please try again later.',
  DATA_ERROR: 'Invalid data received from NASA services.',
  TIMEOUT_ERROR: 'Request timed out. NASA servers may be busy.',
  RATE_LIMIT_ERROR: 'API rate limit exceeded. Please wait before making more requests.',
  GENERIC_ERROR: 'An unexpected error occurred. Please refresh and try again.'
};

// Feature Flags
export const FEATURES = {
  ENABLE_3D_BACKGROUND: true,
  ENABLE_SOUND_EFFECTS: false,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_DEBUG_MODE: import.meta.env.MODE === 'development'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITE_APODS: 'cosmic_hub_favorite_apods',
  USER_PREFERENCES: 'cosmic_hub_user_preferences',
  CACHE_TIMESTAMP: 'cosmic_hub_cache_timestamp',
  VIEWED_ASTEROIDS: 'cosmic_hub_viewed_asteroids'
};

// Default Values
export const DEFAULTS = {
  MISSION_START_DATE: '2010-01-01', // When tracking began
  FALLBACK_APOD_IMAGE: '/images/default-space.jpg',
  FALLBACK_ASTEROID_COUNT: 0,
  FALLBACK_FIREBALL_COUNT: 0
};
