# Deployment Guide - Cosmic Hub

## Vercel Deployment Fix

The "Unexpected token 'T'" error occurs because the frontend is receiving HTML instead of JSON from the API. This happens when the API routes aren't properly configured as serverless functions.

## Prerequisites

1. **Environment Variables** - Set these in your Vercel dashboard:
   ```
   NASA_API_KEY=your_nasa_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here (optional)
   NODE_ENV=production
   ```

## Deployment Steps

### 1. Verify Configuration Files

Ensure these files are properly configured:

**vercel.json** (already configured):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/server.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["api/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Deploy to Vercel

1. **Connect Repository:**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the framework

2. **Set Environment Variables:**

   ```bash
   NASA_API_KEY=your_actual_nasa_api_key
   OPENAI_API_KEY=your_openai_key (optional)
   NODE_ENV=production
   ```

3. **Deploy:**
   - Click "Deploy"
   - Vercel will build both frontend and API

### 3. Verify Deployment

After deployment, test these endpoints:

1. **Health Check:**

   ```
   https://your-app.vercel.app/api/health
   ```

   Should return JSON with status information.

2. **APOD Endpoint:**

   ```
   https://your-app.vercel.app/api/apod
   ```

   Should return today's Astronomy Picture of the Day.

3. **Frontend:**
   ```
   https://your-app.vercel.app
   ```
   Should load the React application.

## Troubleshooting

### Issue: "Unexpected token 'T'" Error

**Cause:** Frontend receiving HTML instead of JSON from API.

**Solutions:**

1. **Check Environment Variables:**

   - Ensure `NASA_API_KEY` is set in Vercel dashboard
   - Verify the key is valid at [api.nasa.gov](https://api.nasa.gov)

2. **Check API Routes:**

   - Visit `/api/health` directly in browser
   - Should return JSON, not HTML error page

3. **Check Build Logs:**
   - Go to Vercel dashboard → Deployments → View Function Logs
   - Look for any errors in the API functions

### Issue: API Routes Return 404

**Cause:** Serverless functions not properly configured.

**Solution:**

- Ensure `api/server.js` exports the Express app: `module.exports = app;`
- Verify `vercel.json` routes configuration

### Issue: CORS Errors

**Cause:** CORS not properly configured for production domain.

**Solution:**

- The server is already configured with `origin: true` which should work
- If issues persist, update CORS origin to your specific domain

## Local Development vs Production

### Local Development:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Uses Vite proxy for API calls

### Production (Vercel):

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.vercel.app/api/*`
- Uses serverless functions for API

## API Client Configuration

The API client automatically detects the environment:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? window.location.origin
    : "http://localhost:3001");
```

- **Local:** Uses `http://localhost:3001`
- **Production:** Uses same origin (Vercel domain)

## Quick Fix Checklist

If you're seeing the JSON parsing error:

1. **Environment Variables Set** - Check Vercel dashboard
2. **API Health Check** - Visit `/api/health` directly
3. **Build Logs** - Check for serverless function errors
4. **NASA API Key** - Verify key is valid
5. **CORS** - Check browser network tab for CORS errors

## Support

If issues persist:

1. Check Vercel function logs in dashboard
2. Test API endpoints directly in browser
3. Verify environment variables are set correctly
4. Ensure NASA API key has proper permissions
