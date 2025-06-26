import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { ExternalLink, Calendar, Camera, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '../../services/api';

const APOD = () => {
  const [apodData, setApodData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchAPOD = async (date = null) => {
    try {
      setIsLoading(true);
      setError(null);
      setImageLoaded(false);
      
      console.log('Fetching APOD from backend API...');
      const dateString = date ? date.toISOString().split('T')[0] : null;
      const data = await apiClient.getAPOD(dateString);
      console.log('APOD Data:', data); // Debug log
      setApodData(data);
    } catch (err) {
      console.error('Error fetching APOD:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAPOD(date);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    console.error('Error details:', e);
    setImageLoaded(false);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-cyan-400" />
          <p className="text-lg">Loading Cosmic Discovery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white text-center p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Unable to Load APOD</h2>
        <p className="text-gray-300 mb-2">We encountered an error while fetching the astronomy picture.</p>
        <p className="text-red-400 text-sm">Error: {error}</p>
        <button 
          onClick={() => fetchAPOD(selectedDate)} 
          className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="relative z-10 px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Astronomy Picture
              </span>
              <br />
              <span className="text-white">of the Day</span>
            </h1>
            
            {/* Date Picker */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl  pl-2 pr-0 py-1 rounded-xl border border-white/20 shadow-xl">
                <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  maxDate={new Date()}
                  minDate={new Date('1995-06-16')}
                  className="bg-transparent text-white text-base cursor-pointer outline-none"
                  style={{ width: '85px' }}
                  calendarClassName="react-datepicker"
                  wrapperClassName="relative z-[99999]"
                  popperClassName="!z-[99999]"
                  popperPlacement="bottom-start"
                  withPortal={true}
                  portalId="date-picker-portal"
                />
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 relative z-10">
            
            {/* Title Only */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">{apodData?.title}</h2>
            </div>

            {/* Media Display */}
            <div className="flex justify-center mb-8">
              {apodData?.media_type === 'image' && apodData?.url ? (
                <div className="relative">
                  <img
                    src={apodData.url}
                    alt={apodData.title || 'NASA APOD'}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className={`max-w-4xl w-full h-auto rounded-2xl shadow-2xl shadow-black/50 hover:shadow-3xl hover:shadow-cyan-400/20 transition-all duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ maxHeight: '70vh', objectFit: 'contain' }}
                  />
                  
                  {/* Loading placeholder */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center min-h-96">
                      <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
                        <p className="text-gray-300">Loading image...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : apodData?.media_type === 'video' && apodData?.url ? (
                <iframe
                  src={apodData.url}
                  title={apodData.title}
                  className="max-w-4xl w-full aspect-video rounded-2xl shadow-2xl shadow-black/50 hover:shadow-3xl hover:shadow-cyan-400/20 transition-all duration-500"
                  allowFullScreen
                />
              ) : (
                <div className="bg-white/10 backdrop-blur-xl p-12 rounded-2xl text-center max-w-2xl shadow-2xl shadow-black/50">
                  <Camera className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Media Not Available</h3>
                  <p className="text-gray-300">This APOD cannot be displayed directly. Please use the links below to view it on NASA's website.</p>
                  <div className="mt-4 text-sm text-gray-400">
                    <p>Media Type: {apodData?.media_type || 'Unknown'}</p>
                    <p>URL Available: {apodData?.url ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation */}
            {apodData?.explanation && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  <span className="text-cyan-400">✨</span> About This Image <span className="text-cyan-400">✨</span>
                </h3>
                <p className="text-gray-200 leading-relaxed text-lg text-justify px-8 max-w-4xl mx-auto">
                  {apodData.explanation}
                </p>
              </div>
            )}

            {/* Links */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">
                <span className="text-purple-400">🔗</span> Related Links <span className="text-purple-400">🔗</span>
              </h3>
              <div className="flex flex-wrap gap-6 justify-center">
                {apodData?.hdurl && (
                  <a 
                    href={apodData.hdurl} 
                    className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-xl border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/30 transform hover:scale-105" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-lg font-semibold">View HD Image</span>
                  </a>
                )}
                <a 
                  href="https://apod.nasa.gov/apod/" 
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl border border-purple-500/30 text-purple-300 hover:text-purple-200 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/30 transform hover:scale-105" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-lg font-semibold">Visit NASA APOD</span>
                </a>
              </div>
            </div>

            {/* Attribution */}
            <div className="text-center text-gray-400 text-sm pt-8 mt-8 border-t border-white/10 space-y-2">
              {apodData?.copyright && (
                <p><strong className="text-white">Copyright:</strong> {apodData.copyright}</p>
              )}
              <p><strong className="text-white">Source:</strong> NASA APOD</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default APOD;
