# Cosmic Awareness Hub

> Your Personal Mission Control for Earth's Cosmic Neighborhood

A full-stack React and Node.js application that integrates with NASA's APIs to provide real-time space data visualization, asteroid tracking, and daily astronomy content.

## Features

- **Real-time Asteroid Tracking** - Monitor near-Earth objects with threat assessment
- **Daily Space Content** - Astronomy Picture of the Day (APOD) showcase
- **3D Solar System Visualization** - Interactive Three.js solar system
- **AI Assistant** - OpenAI-powered space exploration helper
- **Responsive Design** - Modern UI with Tailwind CSS

## Tech Stack

**Frontend:**

- React 18 + Vite
- Three.js for 3D visualizations
- Tailwind CSS + Framer Motion
- React Router + Recharts

**Backend:**

- Node.js + Express.js
- NASA API integration with caching
- OpenAI API integration
- CORS, Helmet, Morgan middleware

## Quick Start

### Prerequisites

- Node.js 18+
- NASA API key from [api.nasa.gov](https://api.nasa.gov/)
- OpenAI API key (optional, for AI assistant)

### Installation

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd cosmic-awareness-hub
npm install
cd api && npm install && cd ..
```

2. **Environment Setup:**

Create `api/.env`:

```env
NASA_API_KEY=your_nasa_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

3. **Start Development:**

```bash
# Terminal 1 - Start backend
cd api && npm run dev

# Terminal 2 - Start frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
cosmic-awareness-hub/
├── src/                    # Frontend React app
│   ├── components/
│   │   └── Dashboard/      # Main dashboard components
│   ├── services/           # API client services
│   ├── App.jsx
│   └── main.jsx
├── api/                    # Backend Express server
│   ├── routes/             # API route handlers
│   │   ├── apod.js         # APOD endpoints
│   │   ├── asteroids.js    # Asteroid endpoints
│   │   ├── cosmicai.js     # AI assistant endpoints
│   │   └── health.js       # Health check
│   ├── services/
│   │   └── nasaApi.js      # NASA API client with caching
│   ├── server.js           # Express server
│   └── package.json
├── public/                 # Static assets
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite config with API proxy
└── tailwind.config.js
```

## API Endpoints

### APOD (Astronomy Picture of the Day)

- `GET /api/apod` - Today's APOD
- `GET /api/apod/date/:date` - Specific date
- `GET /api/apod/random?count=5` - Random APODs

### Asteroids (Near Earth Objects)

- `GET /api/asteroids/today` - Today's approaching asteroids
- `GET /api/asteroids/feed` - Asteroid feed with date range
- `GET /api/asteroids/:id` - Specific asteroid details

### AI Assistant

- `POST /api/cosmicai/ask` - Ask space-related questions

### System

- `GET /api/health` - API health check

## Development Scripts

```bash
# Frontend
npm run dev              # Start frontend dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Backend
cd api
npm run dev              # Start backend with nodemon
npm start                # Start backend in production

# Both
npm run install:all      # Install all dependencies
```

## Environment Variables

### Required

- `NASA_API_KEY` - Your NASA API key

### Optional

- `OPENAI_API_KEY` - For AI assistant functionality
- `PORT` - Backend port (default: 3001)
- `NODE_ENV` - Environment mode

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

The `vercel.json` configuration handles both frontend and serverless API deployment.

## License

ISC License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- NASA for providing open APIs
- OpenAI for AI integration
- React, Node.js, and Three.js communities
