import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import APOD from './APOD'

// Mock the API client
vi.mock('../../services/api', () => ({
  default: {
    getAPOD: vi.fn().mockResolvedValue({
      title: 'Test APOD',
      explanation: 'Test explanation',
      url: 'https://example.com/image.jpg',
      media_type: 'image',
      date: '2024-01-15'
    })
  }
}))

describe('APOD Component', () => {
  it('renders without crashing', () => {
    render(<APOD />)
    expect(screen.getByText('Loading Cosmic Discovery...')).toBeInTheDocument()
  })
}) 