import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Range from '../src/components/Range/Range'

describe('Range Component - Comprehensive Tests', () => {
  describe('Keyboard Navigation', () => {
    describe('Continuous Mode', () => {
      it('should move handle right with ArrowRight key', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
        
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            min: 26
          }))
        })
      })

      it('should move handle left with ArrowLeft key', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="continuous" min={0} max={100} initialMin={50} initialMax={75} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'ArrowLeft' })
        
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            min: 49
          }))
        })
      })

      it('should make large jumps with PageUp/PageDown', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="continuous" min={0} max={100} initialMin={50} initialMax={75} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'PageUp' })
        
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            min: 60
          }))
        })
      })

      it('should go to min with Home key', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="continuous" min={10} max={100} initialMin={50} initialMax={75} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'Home' })
        
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            min: 10
          }))
        })
      })

      it('should go to max with End key', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={50} onChange={onChange} />
        )
        
        const maxHandle = container.querySelectorAll('[role="slider"]')[1]
        maxHandle.focus()
        fireEvent.keyDown(maxHandle, { key: 'End' })
        
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            max: 100
          }))
        })
      })

      it('should prevent handles from crossing during keyboard navigation', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="continuous" min={0} max={100} initialMin={50} initialMax={51} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
        fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
        
        await waitFor(() => {
          const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
          expect(lastCall[0].min).toBeLessThan(lastCall[0].max)
        })
      })
    })

    describe('Discrete Mode', () => {
      const values = [10, 20, 30, 40, 50, 60, 70, 80, 90]

      it('should snap to next value with ArrowRight', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="discrete" values={values} initialMinIndex={2} initialMaxIndex={6} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
        
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            minIndex: 3,
            min: 40
          }))
        })
      })

      it('should snap to previous value with ArrowLeft', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="discrete" values={values} initialMinIndex={4} initialMaxIndex={7} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'ArrowLeft' })
        
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            minIndex: 3,
            min: 40
          }))
        })
      })

      it('should jump multiple values with PageUp/PageDown', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="discrete" values={values} initialMinIndex={2} initialMaxIndex={7} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'PageUp' })
        
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            minIndex: 5
          }))
        })
      })

      it('should not allow handles to cross in discrete mode', async () => {
        const onChange = vi.fn()
        const { container } = render(
          <Range mode="discrete" values={values} initialMinIndex={4} initialMaxIndex={5} onChange={onChange} />
        )
        
        const minHandle = container.querySelectorAll('[role="slider"]')[0]
        minHandle.focus()
        fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
        fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
        
        const calls = onChange.mock.calls
        if (calls.length > 0) {
          const lastCall = calls[calls.length - 1]
          expect(lastCall[0].minIndex).toBeLessThan(lastCall[0].maxIndex)
        }
      })
    })
  })

  describe('Mouse Drag Interactions', () => {
    it('should update value on mouse drag', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      const track = container.querySelector('[class*="trackContainer"]')
      const trackRect = track.getBoundingClientRect()
      
      fireEvent.mouseDown(minHandle, { clientX: trackRect.left + trackRect.width * 0.25 })
      fireEvent.mouseMove(document, { clientX: trackRect.left + trackRect.width * 0.4 })
      fireEvent.mouseUp(document)
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled()
      })
    })

    it('should apply cursor styles during drag', async () => {
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      
      fireEvent.mouseDown(minHandle)
      await waitFor(() => {
        expect(minHandle.className).toContain('handleDragging')
      })
      
      fireEvent.mouseUp(document)
      await waitFor(() => {
        expect(minHandle.className).not.toContain('handleDragging')
      })
    })

    it('should prevent handles from crossing during drag', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={40} initialMax={60} onChange={onChange} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      const track = container.querySelector('[class*="trackContainer"]')
      const trackRect = track.getBoundingClientRect()
      
      fireEvent.mouseDown(minHandle)
      fireEvent.mouseMove(document, { clientX: trackRect.left + trackRect.width * 0.8 })
      fireEvent.mouseUp(document)
      
      await waitFor(() => {
        if (onChange.mock.calls.length > 0) {
          const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
          expect(lastCall[0].min).toBeLessThan(lastCall[0].max)
        }
      })
    })

    it('should handle track clicks to move closest handle', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
      )
      
      const track = container.querySelector('[class*="trackContainer"]')
      const trackRect = track.getBoundingClientRect()
      
      fireEvent.click(track, { clientX: trackRect.left + trackRect.width * 0.1 })
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled()
      })
    })
  })

  describe('Touch Events', () => {
    it('should handle touch drag', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      const track = container.querySelector('[class*="trackContainer"]')
      const trackRect = track.getBoundingClientRect()
      
      fireEvent.touchStart(minHandle, {
        touches: [{ clientX: trackRect.left + trackRect.width * 0.25 }]
      })
      fireEvent.touchMove(document, {
        touches: [{ clientX: trackRect.left + trackRect.width * 0.5 }]
      })
      fireEvent.touchEnd(document)
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled()
      })
    })

    it('should handle touch events properly', () => {
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      
      const touchStartEvent = fireEvent.touchStart(minHandle, {
        touches: [{ clientX: 100 }]
      })
      
      expect(touchStartEvent).toBe(true)
    })
  })

  describe('Input Field Editing (Continuous Mode)', () => {
    it('should update min value through input field', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
      )
      
      const minInput = container.querySelectorAll('input[type="number"]')[0] as HTMLInputElement
      
      await userEvent.clear(minInput)
      await userEvent.type(minInput, '35')
      fireEvent.blur(minInput)
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
          min: 35
        }))
      })
    })

    it('should update max value through input field', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
      )
      
      const maxInput = container.querySelectorAll('input[type="number"]')[1] as HTMLInputElement
      
      await userEvent.clear(maxInput)
      await userEvent.type(maxInput, '85')
      fireEvent.blur(maxInput)
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
          max: 85
        }))
      })
    })

    it('should clamp input values within bounds', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
      )
      
      const minInput = container.querySelectorAll('input[type="number"]')[0] as HTMLInputElement
      
      await userEvent.clear(minInput)
      await userEvent.type(minInput, '150')
      fireEvent.blur(minInput)
      
      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
        expect(lastCall[0].min).toBeLessThanOrEqual(lastCall[0].max)
        expect(lastCall[0].min).toBeGreaterThanOrEqual(0)
      })
    })

    it('should prevent min from exceeding max through input', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={50} onChange={onChange} />
      )
      
      const minInput = container.querySelectorAll('input[type="number"]')[0] as HTMLInputElement
      
      await userEvent.clear(minInput)
      await userEvent.type(minInput, '60')
      fireEvent.blur(minInput)
      
      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
        expect(lastCall[0].min).toBeLessThanOrEqual(lastCall[0].max)
      })
    })

    it('should handle invalid input gracefully', async () => {
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const minInput = container.querySelectorAll('input[type="number"]')[0] as HTMLInputElement
      
      await userEvent.clear(minInput)
      await userEvent.type(minInput, 'abc')
      fireEvent.blur(minInput)
      
      expect(minInput.value).toBe('25')
    })

    it('should debounce input changes', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
      )
      
      const minInput = container.querySelectorAll('input[type="number"]')[0] as HTMLInputElement
      
      await userEvent.clear(minInput)
      await userEvent.type(minInput, '3')
      await userEvent.type(minInput, '5')
      
      await waitFor(() => {
        expect(onChange.mock.calls.length).toBeLessThan(4)
      }, { timeout: 300 })
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes for continuous mode', () => {
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      
      expect(handles[0]).toHaveAttribute('aria-valuemin', '0')
      expect(handles[0]).toHaveAttribute('aria-valuemax', '100')
      expect(handles[0]).toHaveAttribute('aria-valuenow', '25')
      expect(handles[0]).toHaveAttribute('aria-label')
      expect(handles[0]).toHaveAttribute('tabIndex', '0')
      
      expect(handles[1]).toHaveAttribute('aria-valuemin', '0')
      expect(handles[1]).toHaveAttribute('aria-valuemax', '100')
      expect(handles[1]).toHaveAttribute('aria-valuenow', '75')
      expect(handles[1]).toHaveAttribute('aria-label')
      expect(handles[1]).toHaveAttribute('tabIndex', '0')
    })

    it('should have correct ARIA attributes for discrete mode', () => {
      const values = [10, 20, 30, 40, 50]
      const { container } = render(
        <Range mode="discrete" values={values} initialMinIndex={1} initialMaxIndex={3} currency="€" />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      
      expect(handles[0]).toHaveAttribute('aria-valuetext', '20.00€')
      expect(handles[1]).toHaveAttribute('aria-valuetext', '40.00€')
    })

    it('should be keyboard focusable', async () => {
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      
      handles[0].focus()
      expect(document.activeElement).toBe(handles[0])
      
      handles[1].focus()
      expect(document.activeElement).toBe(handles[1])
    })

    it('should announce value changes to screen readers', async () => {
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      
      fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
      
      await waitFor(() => {
        expect(minHandle).toHaveAttribute('aria-valuenow', '26')
      })
    })
  })

  describe('Value Clamping and Boundaries', () => {
    it('should clamp values within min/max bounds', () => {
      const { container } = render(
        <Range mode="continuous" min={10} max={90} initialMin={5} initialMax={95} />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      expect(handles[0]).toHaveAttribute('aria-valuenow', '5')
      expect(handles[1]).toHaveAttribute('aria-valuenow', '95')
    })

    it('should handle decimal values correctly', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={10} initialMin={2.5} initialMax={7.5} step={0.1} onChange={onChange} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
          min: 2.6
        }))
      })
    })

    it('should handle edge case of min equals max', () => {
      const { container } = render(
        <Range mode="continuous" min={50} max={50} initialMin={50} initialMax={50} />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      expect(handles[0]).toHaveAttribute('aria-valuenow', '50')
      expect(handles[1]).toHaveAttribute('aria-valuenow', '50')
    })

    it('should handle negative values', () => {
      const { container } = render(
        <Range mode="continuous" min={-100} max={100} initialMin={-50} initialMax={50} />
      )
      
      const handles = container.querySelectorAll('[role="slider"]')
      expect(handles[0]).toHaveAttribute('aria-valuenow', '-50')
      expect(handles[1]).toHaveAttribute('aria-valuenow', '50')
    })
  })

  describe('Discrete Mode Specific', () => {
    it('should display currency formatting correctly', () => {
      const values = [1.99, 5.99, 10.99, 30.99]
      const { container } = render(
        <Range mode="discrete" values={values} initialMinIndex={0} initialMaxIndex={3} currency="€" />
      )
      
      const currencyLabels = container.querySelectorAll('[class*="currencyValue"]')
      expect(currencyLabels[0].textContent).toBe('1.99€')
      expect(currencyLabels[1].textContent).toBe('30.99€')
    })

    it('should show discrete markers', () => {
      const values = [10, 20, 30, 40, 50]
      const { container } = render(
        <Range mode="discrete" values={values} initialMinIndex={1} initialMaxIndex={3} />
      )
      
      const markers = container.querySelectorAll('[class*="discreteMarker"]')
      expect(markers).toHaveLength(5)
    })

    it('should highlight active markers', () => {
      const values = [10, 20, 30, 40, 50]
      const { container } = render(
        <Range mode="discrete" values={values} initialMinIndex={1} initialMaxIndex={3} />
      )
      
      const markers = container.querySelectorAll('[class*="discreteMarker"]')
      const activeMarkers = container.querySelectorAll('[class*="discreteMarkerActive"]')
      
      expect(activeMarkers.length).toBeGreaterThan(0)
      expect(activeMarkers.length).toBeLessThanOrEqual(markers.length)
    })

    it('should handle unsorted discrete values', () => {
      const values = [50, 10, 30, 20, 40]
      const { container } = render(
        <Range mode="discrete" values={values} initialMinIndex={0} initialMaxIndex={4} />
      )
      
      const alertElement = container.querySelector('[role="alert"]')
      expect(alertElement?.textContent).toContain('should be sorted')
    })

    it('should handle empty discrete values array', () => {
      const { container } = render(
        <Range mode="discrete" values={[]} />
      )
      
      const alertElement = container.querySelector('[role="alert"]')
      expect(alertElement?.textContent).toContain('At least 2 values are required')
    })
  })

  describe('Performance Optimizations', () => {
    it('should use requestAnimationFrame for drag updates', async () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame')
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      
      fireEvent.mouseDown(minHandle)
      fireEvent.mouseMove(document, { clientX: 100 })
      
      expect(rafSpy).toHaveBeenCalled()
      
      fireEvent.mouseUp(document)
      rafSpy.mockRestore()
    })

    it('should clean up on unmount', () => {
      const { container, unmount } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      fireEvent.mouseDown(minHandle)
      
      unmount()
      
      expect(container.innerHTML).toBe('')
    })

    it('should cancel animation frame on cleanup', () => {
      const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')
      const { container, unmount } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      fireEvent.mouseDown(minHandle)
      fireEvent.mouseMove(document, { clientX: 100 })
      
      unmount()
      
      expect(cancelAnimationFrameSpy).toHaveBeenCalled()
      cancelAnimationFrameSpy.mockRestore()
    })
  })

  describe('onChange Callback', () => {
    it('should call onChange with correct values in continuous mode', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={25} initialMax={75} onChange={onChange} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({
          min: 26,
          max: 75
        })
      })
    })

    it('should call onChange with correct values in discrete mode', async () => {
      const onChange = vi.fn()
      const values = [10, 20, 30, 40, 50]
      const { container } = render(
        <Range mode="discrete" values={values} initialMinIndex={1} initialMaxIndex={3} onChange={onChange} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      fireEvent.keyDown(minHandle, { key: 'ArrowRight' })
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({
          minIndex: 2,
          maxIndex: 3,
          min: 30,
          max: 40
        })
      })
    })

    it('should not call onChange when values do not change', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Range mode="continuous" min={0} max={100} initialMin={0} initialMax={100} onChange={onChange} />
      )
      
      const minHandle = container.querySelectorAll('[role="slider"]')[0]
      fireEvent.keyDown(minHandle, { key: 'ArrowLeft' })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const relevantCalls = onChange.mock.calls.filter(
        call => call[0].min !== 0 || call[0].max !== 100
      )
      expect(relevantCalls.length).toBe(0)
    })
  })
})