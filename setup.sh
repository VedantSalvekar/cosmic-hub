#!/bin/bash

echo "🌌 Setting up Cosmic Awareness Hub..."

# Create server .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server/.env file..."
    cat > server/.env << EOL
# NASA API Configuration
NASA_API_KEY=DEMO_KEY
NASA_BASE_URL=https://api.nasa.gov

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Cache Configuration
CACHE_TTL=3600
EOL
    echo "✅ server/.env created with default values"
    echo "⚠️  Please update NASA_API_KEY with your actual API key from https://api.nasa.gov/"
else
    echo "✅ server/.env already exists"
fi

# Install all dependencies
echo "📦 Installing dependencies..."
npm run install:all

echo "🚀 Setup complete! You can now run:"
echo "   npm run dev"
echo ""
echo "🔑 Don't forget to update your NASA API key in server/.env" 