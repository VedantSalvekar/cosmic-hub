import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Calendar, Camera } from 'lucide-react';

/**
 * APOD Hero Component
 * 
 * Displays NASA's Astronomy Picture of the Day as the hero section
 * Features:
 * - Large featured image or video
 * - Glass morphism overlay with title and description
 * - Favorite functionality
 * - External link to full resolution
 * - Loading and error states
 * - Responsive design
 * 
 * This component is the visual centerpiece of the dashboard
 */
const APODHero = ({ apod, isLoading }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Handle image load success
   * Shows the image with smooth transition
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  /**
   * Handle image load error
   * Shows fallback content
   */
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  /**
   * Toggle favorite status
   * In a real app, this would save to user preferences
   */
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  /**
   * Format the date for display
   * Converts YYYY-MM-DD to readable format
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Truncate description for preview
   * Shows first 200 characters with ellipsis
   */
  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Show loading skeleton while fetching data
  if (isLoading || !apod) {
    return (
      <div className="cosmic-card h-96 flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-300">
            Loading today's cosmic discovery...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="cosmic-card overflow-hidden group cursor-pointer h-96 relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background Image or Video */}
      <div className="absolute inset-0">
        {apod.media_type === 'video' ? (
          // Handle video content
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Camera className="w-16 h-16 text-blue-400 mx-auto" />
              <div className="text-white">
                <h3 className="text-xl font-semibold mb-2">Video Content</h3>
                <p className="text-gray-300 text-sm">
                  Click to view on NASA's website
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Handle image content
          <>
            {!imageError ? (
              <img
                src={apod.url}
                alt={apod.title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              // Error fallback
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Camera className="w-16 h-16 text-gray-500 mx-auto" />
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">Image Unavailable</h3>
                    <p className="text-gray-400 text-sm">
                      Unable to load today's image
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        
        {/* Top Section - Date and Actions */}
        <div className="flex justify-between items-start">
          <motion.div
            className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">
              {formatDate(apod.date)}
            </span>
          </motion.div>

          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite();
              }}
              className="p-2 bg-black/40 backdrop-blur-sm rounded-lg hover:bg-black/60 transition-colors"
            >
              <Heart 
                className={`w-5 h-5 ${
                  isFavorited 
                    ? 'text-red-500 fill-current' 
                    : 'text-white'
                }`} 
              />
            </button>

            {/* External Link */}
            <a
              href={apod.hdurl || apod.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-black/40 backdrop-blur-sm rounded-lg hover:bg-black/60 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          </motion.div>
        </div>

        {/* Bottom Section - Title and Description */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
            {apod.title}
          </h2>
          
          <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
            {truncateText(apod.explanation)}
          </p>

          {/* Copyright info if available */}
          {apod.copyright && (
            <div className="text-xs text-gray-400">
              © {apod.copyright.trim()}
            </div>
          )}

          {/* Expand button hint */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-blue-300 opacity-75">
              Click to explore full details
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span>NASA APOD</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>{apod.media_type === 'video' ? 'Video' : 'Image'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-xl transition-colors duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default APODHero; 