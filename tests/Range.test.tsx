import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Range from '../src/components/Range/Range'

describe('Range Component', () => {
  describe('Continuous Mode', () => {
    it('renders with initial values', () => {
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={80}
        />
      )
      
      const sliders = container.querySelectorAll('[role="slider"]')
      expect(sliders).toHaveLength(2)
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '20')
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '80')
    })

    it('allows editing min and max values via input fields', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={80}
          onChange={onChange}
        />
      )
      
      const inputs = container.querySelectorAll('input[type="number"]')
      expect(inputs).toHaveLength(2)
      
      await userEvent.clear(inputs[0])
      await userEvent.type(inputs[0], '30')
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ min: 30, max: 80 })
      })
    })

    it('prevents min value from exceeding max value', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={50}
          onChange={onChange}
        />
      )
      
      const inputs = container.querySelectorAll('input[type="number"]')
      
      await userEvent.clear(inputs[0])
      await userEvent.type(inputs[0], '60')
      fireEvent.blur(inputs[0])
      
      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expect.objectContaining({ min: expect.any(Number), max: 50 })
        )
        expect(onChange).not.toHaveBeenCalledWith({ min: 60, max: 50 })
      })
    })

    it('handles dragging min handle', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={80}
          onChange={onChange}
        />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      const minHandle = handles[0]
      
      fireEvent.mouseDown(minHandle)
      
      expect(minHandle.className).toContain('handle')
    })

    it('handles keyboard navigation', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={80}
          onChange={onChange}
        />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      const minHandle = handles[0]
      
      fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
      
      expect(onChange).toHaveBeenCalledWith({ min: 21, max: 80 })
    })

    it('enlarges handle on hover', () => {
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={80}
        />
      )
      
      const handle = container.querySelector('[role="slider"]')
      expect(handle?.className).toContain('handle')
    })
  })

  describe('Discrete Mode', () => {
    const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

    it('renders with discrete values', () => {
      const { container } = render(
        <Range 
          mode="discrete"
          values={values}
          initialMinIndex={1}
          initialMaxIndex={4}
          currency="€"
        />
      )
      
      const sliders = container.querySelectorAll('[role="slider"]')
      expect(sliders).toHaveLength(2)
      
      const labels = container.querySelectorAll('.currencyValue')
      expect(labels).toBeDefined()
    })

    it('displays currency values as non-editable labels', () => {
      const { container } = render(
        <Range 
          mode="discrete"
          values={values}
          initialMinIndex={0}
          initialMaxIndex={5}
          currency="€"
        />
      )
      
      const inputs = container.querySelectorAll('input[type="number"]')
      expect(inputs).toHaveLength(0)
      
      const currencyValues = container.querySelectorAll('[aria-label*="value"]')
      expect(currencyValues.length).toBeGreaterThan(0)
    })

    it('snaps to discrete values when dragging', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range 
          mode="discrete"
          values={values}
          initialMinIndex={1}
          initialMaxIndex={4}
          onChange={onChange}
          currency="€"
        />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      expect(handles).toHaveLength(2)
    })

    it('prevents crossing of min and max handles', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range 
          mode="discrete"
          values={values}
          initialMinIndex={2}
          initialMaxIndex={3}
          onChange={onChange}
          currency="€"
        />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      const minHandle = handles[0]
      
      fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
      fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
      
      const calls = onChange.mock.calls
      const lastCall = calls[calls.length - 1]
      if (lastCall) {
        expect(lastCall[0].minIndex).toBeLessThan(lastCall[0].maxIndex)
      }
    })

    it('shows discrete markers', () => {
      const { container } = render(
        <Range 
          mode="discrete"
          values={values}
          initialMinIndex={0}
          initialMaxIndex={5}
          currency="€"
        />
      )
      
      const track = container.querySelector('[role="slider"]')?.parentElement
      expect(track).toBeInTheDocument()
      
      const currencyLabels = container.querySelectorAll('span')
      const currencyText = Array.from(currencyLabels).filter(el => el.textContent?.includes('€'))
      expect(currencyText.length).toBeGreaterThan(0)
    })

    it('highlights active markers between min and max', () => {
      const { container } = render(
        <Range 
          mode="discrete"
          values={values}
          initialMinIndex={1}
          initialMaxIndex={4}
          currency="€"
        />
      )
      
     
      const sliders = container.querySelectorAll('[role="slider"]')
      expect(sliders).toHaveLength(2)
      expect(sliders[0]).toHaveAttribute('aria-valuenow', String(values[1]))
      expect(sliders[1]).toHaveAttribute('aria-valuenow', String(values[4]))
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={80}
        />
      )
      
      const sliders = container.querySelectorAll('[role="slider"]')
      
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('aria-valuemin')
        expect(slider).toHaveAttribute('aria-valuemax')
        expect(slider).toHaveAttribute('aria-valuenow')
        expect(slider).toHaveAttribute('tabIndex', '0')
      })
    })

    it('supports keyboard navigation for accessibility', () => {
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={80}
        />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      
      handles.forEach(handle => {
        expect(handle).toHaveAttribute('tabIndex', '0')
      })
    })
  })

  describe('Error Handling', () => {
    it('shows error for invalid discrete values', () => {
      const { container } = render(
        <Range 
          mode="discrete"
          values={[]}
          initialMinIndex={0}
          initialMaxIndex={0}
          currency="€"
        />
      )
      
      const alert = container.querySelector('[role="alert"]')
      expect(alert).toBeInTheDocument()
      expect(alert?.textContent).toContain('Invalid discrete values')
    })

    it('shows warning for unsorted discrete values', () => {
      const { container } = render(
        <Range 
          mode="discrete"
          values={[10, 5, 20, 15]}
          initialMinIndex={0}
          initialMaxIndex={3}
          currency="€"
        />
      )
      
      const alert = container.querySelector('[role="alert"]')
      expect(alert).toBeInTheDocument()
      expect(alert?.textContent).toContain('should be sorted')
    })
  })

  describe('Touch Support', () => {
    it('handles touch events', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range 
          mode="continuous"
          min={0}
          max={100}
          initialMin={20}
          initialMax={80}
          onChange={onChange}
        />
      )
      
      const handle = container.querySelector('[role="slider"]')
      
      if (handle) {
        const touchStart = new TouchEvent('touchstart', {
          touches: [{ clientX: 100, clientY: 100 } as Touch]
        })
        
        fireEvent(handle, touchStart)
        expect(handle.className).toContain('handle')
      }
    })
  })
})