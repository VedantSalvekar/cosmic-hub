/**
 * Utility functions for formatting data in Cosmic Hub
 */

// Format distance from AU to human-readable format
export const formatDistance = (distanceAU) => {
  const au = parseFloat(distanceAU)
  if (isNaN(au)) return 'Unknown'
  
  if (au < 0.001) return `${(au * 149597870.7).toFixed(0)} km`
  if (au < 1) return `${au.toFixed(4)} AU`
  return `${au.toFixed(2)} AU`
}

// Format asteroid diameter
export const formatDiameter = (minDiameter, maxDiameter) => {
  const min = parseFloat(minDiameter)
  const max = parseFloat(maxDiameter)
  
  if (isNaN(min) || isNaN(max)) return 'Unknown size'
  
  if (min === max) return `${min.toFixed(0)}m`
  return `${min.toFixed(0)}-${max.toFixed(0)}m`
}

// Calculate time until asteroid approach
export const calculateTimeUntil = (approachDate) => {
  const now = new Date()
  const approach = new Date(approachDate)
  const diffMs = approach - now
  
  if (diffMs < 0) return 'Past approach'
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

// Determine asteroid risk level
export const calculateRiskLevel = (isPHO, diameter, distance) => {
  if (!isPHO) return 'low'
  
  const avgDiameter = (parseFloat(diameter.min) + parseFloat(diameter.max)) / 2
  const distanceAU = parseFloat(distance.au)
  
  if (avgDiameter > 1000 && distanceAU < 0.02) return 'high'
  if (avgDiameter > 500 || distanceAU < 0.05) return 'medium'
  return 'low'
}

// Format date for display
export const formatDisplayDate = (dateString) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    time: date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }
} 