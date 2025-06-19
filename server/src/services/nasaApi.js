import axios from 'axios';
import NodeCache from 'node-cache';
import { format, parseISO } from 'date-fns';

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

class NASAApiService {
  constructor() {
    this.baseURL = process.env.NASA_BASE_URL || 'https://api.nasa.gov';
    this.apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      params: {
        api_key: this.apiKey
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 NASA API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('🚨 NASA API Error:', error.response?.data || error.message);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        status: error.response.status,
        message: error.response.data?.error?.message || error.response.statusText,
        code: error.response.data?.error?.code || 'API_ERROR'
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 503,
        message: 'NASA API is currently unavailable',
        code: 'SERVICE_UNAVAILABLE'
      };
    } else {
      // Something else happened
      return {
        status: 500,
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  async getCachedData(cacheKey, fetchFunction) {
    try {
      // Check cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log(`💾 Cache hit for: ${cacheKey}`);
        return cachedData;
      }

      // Fetch fresh data
      console.log(`🌐 Fetching fresh data for: ${cacheKey}`);
      const freshData = await fetchFunction();
      
      // Store in cache
      cache.set(cacheKey, freshData);
      return freshData;
    } catch (error) {
      throw error;
    }
  }

  // APOD Methods
  async getAPOD(date = null) {
    const cacheKey = `apod_${date || 'today'}`;
    
    return this.getCachedData(cacheKey, async () => {
      const params = {};
      if (date) params.date = date;
      
      const response = await this.client.get('/planetary/apod', { params });
      return response.data;
    });
  }

  async getAPODRange(startDate, endDate) {
    const cacheKey = `apod_range_${startDate}_${endDate}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get('/planetary/apod', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    });
  }

  async getRandomAPOD(count = 1) {
    const cacheKey = `apod_random_${count}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get('/planetary/apod', {
        params: { count }
      });
      return response.data;
    });
  }

  // Asteroid Methods
  async getAsteroidFeed(startDate, endDate) {
    const cacheKey = `asteroid_feed_${startDate}_${endDate}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get('/neo/rest/v1/feed', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    });
  }

  async getAsteroidById(asteroidId) {
    const cacheKey = `asteroid_${asteroidId}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get(`/neo/rest/v1/neo/${asteroidId}`);
      return response.data;
    });
  }

  async browseAsteroids(page = 0, size = 20) {
    const cacheKey = `asteroid_browse_${page}_${size}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await this.client.get('/neo/rest/v1/neo/browse', {
        params: { page, size }
      });
      return response.data;
    });
  }

  // SSD/CNEOS Methods
  async getCloseApproachData(params = {}) {
    const cacheKey = `cad_${JSON.stringify(params)}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await axios.get('https://ssd-api.jpl.nasa.gov/cad.api', {
        params: {
          'date-min': params.dateMin || format(new Date(), 'yyyy-MM-dd'),
          'date-max': params.dateMax,
          'dist-max': params.distMax || '0.05',
          'sort': params.sort || 'date',
          ...params
        }
      });
      return response.data;
    });
  }

  async getFireballData(params = {}) {
    const cacheKey = `fireball_${JSON.stringify(params)}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await axios.get('https://ssd-api.jpl.nasa.gov/fireball.api', {
        params: {
          'date-min': params.dateMin,
          'date-max': params.dateMax,
          'energy-min': params.energyMin,
          'energy-max': params.energyMax,
          'impact-e': params.impactE,
          'sort': params.sort || 'date',
          ...params
        }
      });
      return response.data;
    });
  }

  // Utility methods
  clearCache(pattern = null) {
    if (pattern) {
      const keys = cache.keys().filter(key => key.includes(pattern));
      cache.del(keys);
      console.log(`🗑️ Cleared ${keys.length} cache entries matching: ${pattern}`);
    } else {
      cache.flushAll();
      console.log('🗑️ Cleared entire cache');
    }
  }

  getCacheStats() {
    return {
      keys: cache.keys().length,
      stats: cache.getStats()
    };
  }
}

export default new NASAApiService(); 