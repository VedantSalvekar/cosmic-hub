import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Camera, AlertCircle, Loader2, Star, Sparkles } from 'lucide-react';

/**
 * APOD Standalone Page Component
 * 
 * Displays NASA's Astronomy Picture of the Day as a dedicated page
 * Features:
 * - Dark cosmic gradient background
 * - Centered content with glassmorphic design
 * - Image/video display with proper scaling
 * - Title, date, explanation, and copyright info
 * - Loading and error states
 * - Responsive design
 */
const APOD = () => {
  const [apodData, setApodData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  /**
   * Fetch APOD data from NASA API
   */
  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=v3BAw2DPetlkUyzpVtQuDMuaurMNwSl4QKdyCzgW');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setApodData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching APOD:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAPOD();
  }, []);

  /**
   * Handle image load success
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  /**
   * Format the date for display
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
   * Loading State
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen p-6">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto" />
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Loading Cosmic Discovery</h2>
              <p className="text-white/70">Fetching today's astronomy picture...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen p-6">
          <motion.div
            className="text-center space-y-6 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Unable to Load APOD</h2>
              <p className="text-white/70">
                We encountered an error while fetching today's astronomy picture. Please try again later.
              </p>
              <p className="text-red-400 text-sm">Error: {error}</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /**
   * Main APOD Display
   */
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle starry background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-40 left-1/4 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-60 right-10 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '1.8s'}}></div>
      </div>
      <div className="relative z-10 py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto space-y-12">
          
                     {/* Main Page Title */}
           <motion.div
             className="text-center"
             initial={{ opacity: 0, y: -30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
           >
             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
               <span className="text-cyan-400">Astronomy Picture </span>
               <span className="text-white">of the Day</span>
             </h1>
             <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-6"></div>
           </motion.div>

          {/* Image Name and Date */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
              {apodData?.title}
            </h2>
            
                         <div className="inline-flex items-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
               <Calendar className="w-5 h-5 text-cyan-400" />
               <span className="text-lg text-white/90 font-medium">
                 {formatDate(apodData?.date)}
               </span>
             </div>
          </motion.div>

          {/* Image Preview Section */}
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <h3 className="text-xl font-semibold text-white"></h3>
            </div>
            
            <div className="flex justify-center">
              {apodData?.media_type === 'video' ? (
                // Video Content
                <div className="max-w-2xl w-full aspect-video bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-2xl">
                  <div className="text-center space-y-6">
                    <Camera className="w-20 h-20 text-cyan-400 mx-auto" />
                    <div className="space-y-4">
                      <h4 className="text-2xl font-semibold text-white">Video Content</h4>
                      <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                        This APOD features a video. Click the link below to view it on NASA's website.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Image Content
                <div className="relative">
                  <motion.img
                    src={apodData?.url}
                    alt={apodData?.title}
                    className={`w-96 h-auto rounded-xl shadow-2xl transition-opacity duration-700 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={handleImageLoad}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imageLoaded ? 1 : 0 }}
                    transition={{ duration: 0.7 }}
                  />
                  
                  {/* Loading placeholder for image */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-white/5 rounded-xl flex items-center justify-center min-h-96 w-96">
                      <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
                        <p className="text-gray-300">Loading image...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* About This Image Section */}
          <motion.div
            className="mx-auto max-w-3xl px-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  
                  <h2 className="text-2xl font-bold text-white">About This Image</h2>
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg text-center px-4 line-height-7">
                {apodData?.explanation}
              </p>
            </div>
          </motion.div>

          {/* Related Links Section */}
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="flex items-center justify-center space-x-3">
             
              <h3 className="text-xl font-semibold text-white">Related Links</h3>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center">
              {apodData?.hdurl && (
                <a
                  href={apodData.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-xl border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/40"
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-lg font-semibold">View HD Quality</span>
                </a>
              )}
              
              <a
                href="https://apod.nasa.gov/apod/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl border border-purple-500/30 text-purple-300 hover:text-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40"
              >
                <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-lg font-semibold">Visit NASA APOD</span>
              </a>
            </div>

            {/* Copyright and Source */}
            <div className="space-y-3 pt-8 border-t border-white/10">
              {apodData?.copyright && (
                <p className="text-gray-300 text-base">
                  <span className="text-white font-medium">Copyright:</span> {apodData.copyright}
                </p>
              )}
              <p className="text-gray-300 text-base">
                <span className="text-white font-medium">Source:</span> NASA APOD
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default APOD; 