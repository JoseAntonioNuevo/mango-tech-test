import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import Exercise2Page from '../src/app/exercise2/page'

// Mock the fetch function
global.fetch = vi.fn()

describe('Exercise2 Page', () => {
  const mockValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
  
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ rangeValues: mockValues }),
    })
  })

  it('should fetch and render the discrete range', async () => {
    const page = await Exercise2Page()
    const { container } = render(page)
    
    expect(container.querySelector('[role="slider"]')).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/range/fixed'),
      expect.any(Object)
    )
  })

  it('should display fixed values correctly', async () => {
    const page = await Exercise2Page()
    const { container } = render(page)
    
    const infoText = container.textContent
    mockValues.forEach(value => {
      expect(infoText).toContain(`${value}€`)
    })
  })

  it('should handle fetch errors gracefully', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))
    
    await expect(Exercise2Page()).rejects.toThrow()
  })

  it('should handle HTTP error status', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
    })
    
    await expect(Exercise2Page()).rejects.toThrow('HTTP error! status: 404')
  })

  it('should handle timeout errors', async () => {
    const abortError = new Error('Aborted')
    abortError.name = 'AbortError'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(abortError)
    
    await expect(Exercise2Page()).rejects.toThrow('Request timeout - please try again')
  })

  it('should render navigation links', async () => {
    const page = await Exercise2Page()
    const { container } = render(page)
    
    const exercise1Link = container.querySelector('a[href="/exercise1"]')
    const homeLink = container.querySelector('a[href="/"]')
    
    expect(exercise1Link).toBeInTheDocument()
    expect(homeLink).toBeInTheDocument()
  })

  it('should render features list for discrete mode', async () => {
    const page = await Exercise2Page()
    const { container } = render(page)
    
    const content = container.textContent || ''
    
    expect(content).toContain('Range slider with fixed currency values that snap to nearest points')
    expect(content).toContain('Exercise 2: Discrete Range')
    expect(content).toContain('Interactive Currency Range Slider')
  })

  it('should pass correct props to Range component', async () => {
    const page = await Exercise2Page()
    const { container } = render(page)
    
    const sliders = container.querySelectorAll('[role="slider"]')
    expect(sliders).toHaveLength(2) // Min and max sliders
    
    const labels = container.querySelectorAll('[class*="currencyValue"]')
    expect(labels.length).toBeGreaterThan(0)
  })
})