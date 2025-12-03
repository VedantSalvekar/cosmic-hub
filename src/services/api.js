// API Client for Cosmic Hub Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? '' // Use relative URLs for localhost to go through Vite proxy
    : window.location.origin 
);

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got: ${contentType}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  // APOD API methods
  async getAPOD(date = null) {
    const endpoint = date ? `/api/apod/date/${date}` : '/api/apod';
    const response = await this.request(endpoint);
    return response.data;
  }

  // Asteroid API methods
  async getAsteroidFeed(startDate, endDate) {
    const endpoint = `/api/asteroids/feed?start_date=${startDate}&end_date=${endDate}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  // Health check
  async getHealthStatus() {
    const endpoint = '/api/health';
    return await this.request(endpoint);
  }
  // Cosmic AI methods
  async askCosmicAI(question) {
    const endpoint = '/api/cosmicai/ask';
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ question })
    });
    return response.data;
  }
}

export default new ApiClient(); 