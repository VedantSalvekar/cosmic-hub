/* eslint-disable */
const axios = require('axios');
const NodeCache = require('node-cache');

// Create cache instance with TTL from environment
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL || 3600 });

class NASAApiService {
  constructor() {
    this.baseURL = process.env.NASA_BASE_URL || 'https://api.nasa.gov';
    this.apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'User-Agent': 'Cosmic-Hub/1.0.0'
      }
    });
    
    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 NASA API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('🚫 NASA API Request Error:', error);
        return Promise.reject(error);
      }
    );
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ NASA API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('🚫 NASA API Response Error:', error.response?.status, error.response?.statusText);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }
  
  // Handle API errors with proper formatting
  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, statusText, data } = error.response;
      return {
        status,
        message: data?.error?.message || data?.message || statusText || 'API request failed',
        code: data?.error?.code || 'NASA_API_ERROR',
        isNASAError: true
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 503,
        message: 'NASA API is currently unavailable',
        code: 'NASA_API_UNAVAILABLE',
        isNASAError: true
      };
    } else {
      // Something else happened
      return {
        status: 500,
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
        isNASAError: false
      };
    }
  }
  
  // Get data with caching
  async getCachedData(cacheKey, apiCall) {
    try {
      // Check cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log(`📦 Cache hit for key: ${cacheKey}`);
        return cachedData;
      }
      
      // Make API call
      console.log(`🌐 Cache miss, fetching from NASA API: ${cacheKey}`);
      const data = await apiCall();
      
      // Store in cache
      cache.set(cacheKey, data);
      console.log(`💾 Cached data for key: ${cacheKey}`);
      
      return data;
    } catch (error) {
      console.error(`❌ Error in getCachedData for ${cacheKey}:`, error);
      throw error;
    }
  }
  
  // APOD API methods
  async getAPOD(date = null) {
    const dateParam = date ? `&date=${date}` : '';
    const cacheKey = `apod_${date || 'today'}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get(`/planetary/apod?api_key=${this.apiKey}${dateParam}`);
      return response.data;
    });
  }
  
  async getAPODRange(startDate, endDate) {
    const cacheKey = `apod_range_${startDate}_${endDate}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get(`/planetary/apod?api_key=${this.apiKey}&start_date=${startDate}&end_date=${endDate}`);
      return response.data;
    });
  }
  
  async getRandomAPOD(count = 1) {
    const cacheKey = `apod_random_${count}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get(`/planetary/apod?api_key=${this.apiKey}&count=${count}`);
      return response.data;
    });
  }
  
  // NeoWs (Asteroid) API methods
  async getAsteroidFeed(startDate, endDate) {
    const cacheKey = `asteroid_feed_${startDate}_${endDate}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get(`/neo/rest/v1/feed?api_key=${this.apiKey}&start_date=${startDate}&end_date=${endDate}`);
      return response.data;
    });
  }
  
  async getAsteroidById(asteroidId) {
    const cacheKey = `asteroid_${asteroidId}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get(`/neo/rest/v1/neo/${asteroidId}?api_key=${this.apiKey}`);
      return response.data;
    });
  }
  
  async browseAsteroids(page = 0, size = 20) {
    const cacheKey = `asteroid_browse_${page}_${size}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get(`/neo/rest/v1/neo/browse?api_key=${this.apiKey}&page=${page}&size=${size}`);
      return response.data;
    });
  }
  
  // Helper methods
  getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }
  
  getDateRange(days) {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }
  
  // Cache management
  getCacheStats() {
    return {
      keys: cache.keys().length,
      hits: cache.getStats().hits,
      misses: cache.getStats().misses,
      keys_list: cache.keys()
    };
  }
  
  clearCache() {
    cache.flushAll();
    console.log('🗑️ Cache cleared');
  }
}

module.exports = new NASAApiService(); 