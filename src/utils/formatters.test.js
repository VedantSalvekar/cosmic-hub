import { describe, it, expect } from 'vitest'
import { 
  formatDistance, 
  formatDiameter, 
  calculateRiskLevel,
  formatDisplayDate 
} from './formatters'

describe('Utility Functions', () => {
  describe('formatDistance', () => {
    it('formats small distances in kilometers', () => {
      expect(formatDistance('0.0005')).toBe('74799 km')
    })

    it('formats medium distances in AU with 4 decimals', () => {
      expect(formatDistance('0.1')).toBe('0.1000 AU')
    })

    it('formats large distances in AU with 2 decimals', () => {
      expect(formatDistance('1.5')).toBe('1.50 AU')
    })

    it('handles invalid input', () => {
      expect(formatDistance('invalid')).toBe('Unknown')
      expect(formatDistance(null)).toBe('Unknown')
    })
  })

  describe('formatDiameter', () => {
    it('formats diameter range', () => {
      expect(formatDiameter('100', '200')).toBe('100-200m')
    })

    it('formats single diameter when min equals max', () => {
      expect(formatDiameter('150', '150')).toBe('150m')
    })

    it('handles invalid input', () => {
      expect(formatDiameter('invalid', '200')).toBe('Unknown size')
      expect(formatDiameter(null, null)).toBe('Unknown size')
    })
  })

  describe('calculateRiskLevel', () => {
    it('returns low risk for non-PHO asteroids', () => {
      const result = calculateRiskLevel(false, { min: '1000', max: '2000' }, { au: '0.01' })
      expect(result).toBe('low')
    })

    it('returns high risk for large, close PHO asteroids', () => {
      const result = calculateRiskLevel(true, { min: '1000', max: '2000' }, { au: '0.01' })
      expect(result).toBe('high')
    })

    it('returns medium risk for moderately dangerous asteroids', () => {
      const result = calculateRiskLevel(true, { min: '600', max: '800' }, { au: '0.1' })
      expect(result).toBe('medium')
    })

    it('returns low risk for small distant PHO asteroids', () => {
      const result = calculateRiskLevel(true, { min: '50', max: '100' }, { au: '0.2' })
      expect(result).toBe('low')
    })
  })

  describe('formatDisplayDate', () => {
    it('formats date and time correctly', () => {
      const result = formatDisplayDate('2024-01-15T14:30:00.000Z')
      expect(result.date).toBe('Jan 15, 2024')
      expect(result.time).toBe('14:30')
    })

    it('handles different date formats', () => {
      const result = formatDisplayDate('2024-12-25T09:15:30.000Z')
      expect(result.date).toBe('Dec 25, 2024')
      expect(result.time).toBe('09:15')
    })
  })
}) 