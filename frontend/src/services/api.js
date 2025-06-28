// API Client for Cosmic Awareness Hub Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log(`✅ API Response: ${response.status} ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${error.message}`);
      throw error;
    }
  }

  // APOD API methods
  async getAPOD(date = null) {
    const endpoint = date ? `/api/apod/date/${date}` : '/api/apod';
    const response = await this.request(endpoint);
    return response.data;
  }

  async getAPODRange(startDate, endDate) {
    const endpoint = `/api/apod/range?start_date=${startDate}&end_date=${endDate}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async getRandomAPOD(count = 1) {
    const endpoint = `/api/apod/random?count=${count}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async getRecentAPOD(days = 7) {
    const endpoint = `/api/apod/recent?days=${days}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  // Asteroid API methods
  async getAsteroidFeed(startDate, endDate) {
    const endpoint = `/api/asteroids/feed?start_date=${startDate}&end_date=${endDate}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async getTodayAsteroids() {
    const endpoint = '/api/asteroids/today';
    const response = await this.request(endpoint);
    return response.data;
  }

  async getAsteroidById(asteroidId) {
    const endpoint = `/api/asteroids/${asteroidId}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async browseAsteroids(page = 0, size = 20) {
    const endpoint = `/api/asteroids/browse/all?page=${page}&size=${size}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async getHazardousAsteroids(days = 7) {
    const endpoint = `/api/asteroids/hazardous/list?days=${days}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  // Health check
  async getHealthStatus() {
    const endpoint = '/api/health';
    return await this.request(endpoint);
  }

  async getDeepHealthStatus() {
    const endpoint = '/api/health/deep';
    return await this.request(endpoint);
  }
  async askCosmicAI(question){
    const endpoint = '/api/cosmicai/ask';
    const response = await this.request(endpoint,{
      method: 'POST',
      body: JSON.stringify({question})
    });
    return response.data;
  }
  async getCosmicAIHealth(){
    const endpoint = '/api/cosmicai/health';
    return await this.request(endpoint);
  }
}

export default new ApiClient(); 