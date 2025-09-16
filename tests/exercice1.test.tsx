import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import Exercise1Page from '../src/app/exercise1/page'

// Mock the fetch function
global.fetch = vi.fn()

describe('Exercise1 Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ min: 1, max: 100 }),
    })
  })

  it('should fetch and render the continuous range', async () => {
    const page = await Exercise1Page()
    const { container } = render(page)
    
    expect(container.querySelector('[role="slider"]')).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/range/normal'),
      expect.any(Object)
    )
  })

  it('should display correct API data information', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ min: 10, max: 200 }),
    })
    
    const page = await Exercise1Page()
    const { container } = render(page)
    
    const infoText = container.textContent
    expect(infoText).toContain('Minimum Value10')
    expect(infoText).toContain('Maximum Value200')
  })

  it('should handle fetch errors gracefully', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))
    
    await expect(Exercise1Page()).rejects.toThrow()
  })

  it('should handle HTTP error status', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    })
    
    await expect(Exercise1Page()).rejects.toThrow('HTTP error! status: 500')
  })

  it('should handle timeout errors', async () => {
    const abortError = new Error('Aborted')
    abortError.name = 'AbortError'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(abortError)
    
    await expect(Exercise1Page()).rejects.toThrow('Request timeout - please try again')
  })

  it('should render navigation links', async () => {
    const page = await Exercise1Page()
    const { container } = render(page)
    
    const homeLink = container.querySelector('a[href="/"]')
    const exercise2Link = container.querySelector('a[href="/exercise2"]')
    
    expect(homeLink).toBeInTheDocument()
    expect(exercise2Link).toBeInTheDocument()
  })

  it('should render features list', async () => {
    const page = await Exercise1Page()
    const { container } = render(page)
    
    const content = container.textContent || ''
    
    expect(content).toContain('Interactive range slider with editable min/max values')
    expect(content).toContain('Exercise 1: Continuous Range')
    expect(content).toContain('Interactive Range Slider')
  })
})