# 🌌 Cosmic Awareness Hub

> Your Personal Mission Control for Earth's Cosmic Neighborhood

A modern React and Node.js application that transforms NASA's open APIs into an immersive space exploration experience. Track asteroids, explore daily cosmic discoveries, and monitor Earth's relationship with near-Earth objects through beautiful visualizations and real-time data.

## ✨ Features

### 📊 **Mission Control Dashboard**

- Real-time asteroid tracking with threat assessment
- Daily Astronomy Picture of the Day (APOD) showcase
- Live fireball event monitoring
- Comprehensive space data visualization

### 🛡️ **Asteroid Watch Center**

- Today's approaching asteroids with risk analysis
- Potentially hazardous asteroid alerts
- Historical close approach data
- Interactive 3D solar system visualization

### 🔥 **Impact Events Monitor**

- Recent fireball atmospheric entries
- Energy analysis and impact comparisons
- Global fireball activity mapping
- Statistical trend analysis

### 🎓 **Educational Features**

- AI-powered content recommendations
- Interactive learning paths
- Cosmic event calendar
- Personal discovery tracking

## 🛠️ Tech Stack

### Frontend

- **React 18** with modern hooks
- **Vite** for lightning-fast development
- **Tailwind CSS** for styling
- **Three.js** for 3D visualizations
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **React Router** for navigation

### Backend

- **Node.js** with **Express.js**
- **Axios** for NASA API integration
- **Node-cache** for performance optimization
- **Helmet** for security
- **Morgan** for logging
- **CORS** for cross-origin requests

### NASA APIs

- **APOD** - Astronomy Picture of the Day
- **NeoWs** - Near Earth Object Web Service
- **SSD/CNEOS** - Solar System Dynamics & Close Approach Data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- NASA API key (get from https://api.nasa.gov/)

### Installation

1. **Clone and install dependencies:**

```bash
cd cosmic-awareness-hub
npm run install:all
```

2. **Set up environment variables:**
   Create `server/.env` file:

```env
# NASA API Configuration
NASA_API_KEY=your_nasa_api_key_here
NASA_BASE_URL=https://api.nasa.gov

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Cache Configuration
CACHE_TTL=3600
```

3. **Start development servers:**

```bash
npm run dev
```

This will start:

- Frontend at `http://localhost:5173`
- Backend API at `http://localhost:5000`

## 📁 Project Structure

```
cosmic-awareness-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Context providers
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS styles
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # NASA API services
│   │   └── index.js        # Server entry point
│   └── package.json
├── docs/                   # Documentation
├── shared/                 # Shared utilities
└── README.md
```

## 🔌 API Endpoints

### APOD (Astronomy Picture of the Day)

- `GET /api/apod` - Today's APOD
- `GET /api/apod/date/:date` - APOD for specific date
- `GET /api/apod/range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Date range
- `GET /api/apod/random?count=5` - Random APODs
- `GET /api/apod/recent` - Last 7 days

### Asteroids (Near Earth Objects)

- `GET /api/asteroids/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Asteroid feed
- `GET /api/asteroids/today` - Today's approaching asteroids
- `GET /api/asteroids/:asteroidId` - Specific asteroid details
- `GET /api/asteroids/browse/all?page=0&size=20` - Browse all asteroids
- `GET /api/asteroids/hazardous/list?days=30` - Potentially hazardous asteroids

### SSD/CNEOS (Solar System Dynamics)

- `GET /api/ssd/close-approach` - Close approach data
- `GET /api/ssd/upcoming?days=30` - Upcoming close approaches
- `GET /api/ssd/fireballs` - Fireball events
- `GET /api/ssd/fireballs/recent?days=7` - Recent fireballs
- `GET /api/ssd/fireballs/stats?days=365` - Fireball statistics

### System

- `GET /api/health` - API health check

## 🎨 Key Components

### Frontend Components

- **Dashboard** - Mission control interface
- **APODViewer** - Daily space imagery showcase
- **AsteroidTracker** - Real-time asteroid monitoring
- **SolarSystemViewer** - 3D interactive solar system
- **FireballMonitor** - Atmospheric impact events
- **Calendar** - Cosmic events timeline

### Backend Services

- **nasaApi.js** - NASA API integration with caching
- **apod.js** - APOD route handlers
- **asteroids.js** - Asteroid data processing
- **ssd.js** - Close approach and fireball data

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start both client and server
npm run client:dev       # Start only client
npm run server:dev       # Start only server

# Production
npm run client:build     # Build client for production
npm run server:start     # Start production server

# Setup
npm run install:all      # Install all dependencies
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`
4. Deploy automatically on push

### Backend (Render/Railway)

1. Connect your GitHub repository
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables in dashboard

## 🔒 Environment Variables

### Required

- `NASA_API_KEY` - Your NASA API key
- `NASA_BASE_URL` - NASA API base URL
- `CLIENT_URL` - Frontend URL for CORS

### Optional

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CACHE_TTL` - Cache duration in seconds (default: 3600)

## 🧪 API Usage Examples

### Get Today's APOD

```javascript
const response = await fetch("/api/apod");
const apod = await response.json();
console.log(apod.data.title, apod.data.url);
```

### Get Today's Asteroids

```javascript
const response = await fetch("/api/asteroids/today");
const asteroids = await response.json();
console.log(`${asteroids.count} asteroids approaching today`);
```

### Get Recent Fireballs

```javascript
const response = await fetch("/api/ssd/fireballs/recent");
const fireballs = await response.json();
console.log(`${fireballs.count} recent fireball events`);
```

## 🎯 Features Roadmap

### Phase 1 (Current)

- ✅ Basic dashboard with APOD
- ✅ Asteroid tracking system
- ✅ Fireball monitoring
- ✅ REST API with caching

### Phase 2 (Next)

- 🔄 3D solar system visualization
- 🔄 Interactive calendar
- 🔄 Mobile responsive design
- 🔄 Real-time notifications

### Phase 3 (Future)

- 📋 AI-powered recommendations
- 📋 User accounts and favorites
- 📋 Social sharing features
- 📋 Advanced data analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** for providing amazing open APIs
- **React** and **Node.js** communities
- **Three.js** for 3D visualization capabilities
- **Tailwind CSS** for beautiful styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [API documentation](#-api-endpoints)
2. Review common issues in [troubleshooting](#troubleshooting)
3. Open an issue on GitHub

---

**Built with ❤️ for space enthusiasts and developers**

_Explore the cosmos from your browser_ 🚀
