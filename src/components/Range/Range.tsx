"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Range.module.css";
import type { RangeProps } from "./Range.types";
import {
  clamp,
  valueToPosition,
  positionToValue,
  findNearestValue,
  formatCurrency,
  getPositionFromEvent,
  debounce,
} from "./Range.utils";

export default function Range(props: RangeProps) {
  const { mode, onChange } = props;
  const values = props.mode === "discrete" ? props.values : undefined;
  const trackRef = useRef<HTMLDivElement>(null);
  const minHandleRef = useRef<HTMLDivElement>(null);
  const maxHandleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const activeListenersRef = useRef<{
    mousemove?: (event: MouseEvent) => void;
    mouseup?: () => void;
    touchmove?: (event: TouchEvent) => void;
    touchend?: () => void;
  }>({});

  const validationError = useMemo(() => {
    if (props.mode === "discrete") {
      if (
        !props.values ||
        !Array.isArray(props.values) ||
        props.values.length < 2
      ) {
        return {
          type: "error" as const,
          message: "Invalid discrete values. At least 2 values are required.",
        };
      }

      const isSorted = props.values.every(
        (val, i) => i === 0 || val >= props.values[i - 1]
      );

      if (!isSorted) {
        return {
          type: "warning" as const,
          message: "Discrete values should be sorted in ascending order.",
        };
      }
    }
    return null;
  }, [props]);

  const [minValue, setMinValue] = useState(() => {
    if (props.mode === "continuous") {
      return props.initialMin ?? props.min;
    } else {
      const index = props.initialMinIndex ?? 0;
      return props.values[index];
    }
  });

  const [maxValue, setMaxValue] = useState(() => {
    if (props.mode === "continuous") {
      return props.initialMax ?? props.max;
    } else {
      const index = props.initialMaxIndex ?? props.values.length - 1;
      return props.values[index];
    }
  });

  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const [tempMinInput, setTempMinInput] = useState(String(minValue));
  const [tempMaxInput, setTempMaxInput] = useState(String(maxValue));

  const debouncedSetMin = useMemo(
    () => debounce((value: number) => setMinValue(value), 150),
    []
  );

  const debouncedSetMax = useMemo(
    () => debounce((value: number) => setMaxValue(value), 150),
    []
  );

  const bounds = useMemo(() => {
    if (props.mode === "continuous") {
      return { min: props.min, max: props.max };
    } else {
      return { min: Math.min(...props.values), max: Math.max(...props.values) };
    }
  }, [props]);

  const minPosition = useMemo(
    () => valueToPosition(minValue, bounds.min, bounds.max),
    [minValue, bounds]
  );

  const maxPosition = useMemo(
    () => valueToPosition(maxValue, bounds.min, bounds.max),
    [maxValue, bounds]
  );

  useEffect(() => {
    setTempMinInput(String(minValue));
  }, [minValue]);

  useEffect(() => {
    setTempMaxInput(String(maxValue));
  }, [maxValue]);

  useEffect(() => {
    if (mode === "continuous" && onChange) {
      onChange({ min: minValue, max: maxValue });
    }
  }, [minValue, maxValue, mode, onChange]);

  useEffect(() => {
    if (mode === "discrete" && onChange && values) {
      const minIndex = values.findIndex((v) => v === minValue);
      const maxIndex = values.findIndex((v) => v === maxValue);
      if (minIndex !== -1 && maxIndex !== -1) {
        onChange({
          minIndex,
          maxIndex,
          min: minValue,
          max: maxValue,
        });
      }
    }
  }, [minValue, maxValue, mode, onChange, values]);

  const handleMinInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTempMinInput(value);

      const numValue = parseFloat(value);
      if (!isNaN(numValue) && props.mode === "continuous") {
        const clampedValue = clamp(
          numValue,
          props.min,
          Math.min(maxValue, props.max)
        );
        debouncedSetMin(clampedValue);
      }
    },
    [maxValue, props, debouncedSetMin]
  );

  const handleMaxInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTempMaxInput(value);

      const numValue = parseFloat(value);
      if (!isNaN(numValue) && props.mode === "continuous") {
        const clampedValue = clamp(
          numValue,
          Math.max(minValue, props.min),
          props.max
        );
        debouncedSetMax(clampedValue);
      }
    },
    [minValue, props, debouncedSetMax]
  );

  const handleMinInputBlur = useCallback(() => {
    if (props.mode === "continuous") {
      const numValue = parseFloat(tempMinInput);
      if (isNaN(numValue)) {
        setTempMinInput(String(minValue));
      } else {
        const clampedValue = clamp(
          numValue,
          props.min,
          Math.min(maxValue, props.max)
        );
        setMinValue(clampedValue);
        setTempMinInput(String(clampedValue));
      }
    }
  }, [tempMinInput, minValue, maxValue, props]);

  const handleMaxInputBlur = useCallback(() => {
    if (props.mode === "continuous") {
      const numValue = parseFloat(tempMaxInput);
      if (isNaN(numValue)) {
        setTempMaxInput(String(maxValue));
      } else {
        const clampedValue = clamp(
          numValue,
          Math.max(minValue, props.min),
          props.max
        );
        setMaxValue(clampedValue);
        setTempMaxInput(String(clampedValue));
      }
    }
  }, [tempMaxInput, minValue, maxValue, props]);

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent, isMin: boolean) => {
      if (!trackRef.current) return;

      const position = getPositionFromEvent(event, trackRef.current);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (props.mode === "continuous") {
          const newValue = positionToValue(position, props.min, props.max);

          if (isMin) {
            const clampedValue = clamp(
              newValue,
              props.min,
              maxValue - (props.step || 1)
            );
            setMinValue(clampedValue);
          } else {
            const clampedValue = clamp(
              newValue,
              minValue + (props.step || 1),
              props.max
            );
            setMaxValue(clampedValue);
          }
        } else {
          const rawValue = positionToValue(position, bounds.min, bounds.max);
          const nearestValue = findNearestValue(rawValue, props.values);

          if (isMin) {
            if (nearestValue < maxValue) {
              setMinValue(nearestValue);
            }
          } else {
            if (nearestValue > minValue) {
              setMaxValue(nearestValue);
            }
          }
        }
      });
    },
    [minValue, maxValue, props, bounds]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent, isMin: boolean) => {
      event.preventDefault();
      event.stopPropagation();

      if (isMin) {
        setIsDraggingMin(true);
      } else {
        setIsDraggingMax(true);
      }

      const handleMouseMove = (e: MouseEvent) => {
        handleDrag(e, isMin);
      };

      const handleMouseUp = () => {
        if (isMin) {
          setIsDraggingMin(false);
        } else {
          setIsDraggingMax(false);
        }

        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        activeListenersRef.current.mousemove = undefined;
        activeListenersRef.current.mouseup = undefined;
      };

      activeListenersRef.current.mousemove = handleMouseMove;
      activeListenersRef.current.mouseup = handleMouseUp;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleDrag]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent, isMin: boolean) => {
      event.preventDefault();
      event.stopPropagation();

      if (isMin) {
        setIsDraggingMin(true);
      } else {
        setIsDraggingMax(true);
      }

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        handleDrag(e, isMin);
      };

      const handleTouchEnd = () => {
        if (isMin) {
          setIsDraggingMin(false);
        } else {
          setIsDraggingMax(false);
        }

        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }

        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);

        activeListenersRef.current.touchmove = undefined;
        activeListenersRef.current.touchend = undefined;
      };

      activeListenersRef.current.touchmove = handleTouchMove;
      activeListenersRef.current.touchend = handleTouchEnd;

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [handleDrag]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, isMin: boolean) => {
      let newValue: number | null = null;
      const currentValue = isMin ? minValue : maxValue;

      if (props.mode === "continuous") {
        const step = props.step || 1;
        const largeStep = step * 10;

        switch (event.key) {
          case "ArrowLeft":
          case "ArrowDown":
            newValue = currentValue - step;
            break;
          case "ArrowRight":
          case "ArrowUp":
            newValue = currentValue + step;
            break;
          case "PageDown":
            newValue = currentValue - largeStep;
            break;
          case "PageUp":
            newValue = currentValue + largeStep;
            break;
          case "Home":
            newValue = isMin ? props.min : minValue + step;
            break;
          case "End":
            newValue = isMin ? maxValue - step : props.max;
            break;
        }

        if (newValue !== null) {
          event.preventDefault();
          if (isMin) {
            const clampedValue = clamp(newValue, props.min, maxValue - step);
            setMinValue(clampedValue);
          } else {
            const clampedValue = clamp(newValue, minValue + step, props.max);
            setMaxValue(clampedValue);
          }
        }
      } else {
        const currentIndex = props.values.indexOf(currentValue);
        let newIndex: number | null = null;

        switch (event.key) {
          case "ArrowLeft":
          case "ArrowDown":
            newIndex = currentIndex - 1;
            break;
          case "ArrowRight":
          case "ArrowUp":
            newIndex = currentIndex + 1;
            break;
          case "PageDown":
            newIndex = Math.max(0, currentIndex - 3);
            break;
          case "PageUp":
            newIndex = Math.min(props.values.length - 1, currentIndex + 3);
            break;
          case "Home":
            newIndex = 0;
            break;
          case "End":
            newIndex = props.values.length - 1;
            break;
        }

        if (
          newIndex !== null &&
          newIndex >= 0 &&
          newIndex < props.values.length
        ) {
          event.preventDefault();
          const newValue = props.values[newIndex];

          if (isMin && newValue < maxValue) {
            setMinValue(newValue);
          } else if (!isMin && newValue > minValue) {
            setMaxValue(newValue);
          }
        }
      }
    },
    [minValue, maxValue, props]
  );

  const handleTrackClick = useCallback(
    (event: React.MouseEvent) => {
      if (!trackRef.current) return;

      if ((event.target as HTMLElement).classList.contains(styles.handle)) {
        return;
      }

      const position = getPositionFromEvent(
        event.nativeEvent,
        trackRef.current
      );
      let newValue: number;

      if (props.mode === "continuous") {
        newValue = positionToValue(position, props.min, props.max);
      } else {
        const rawValue = positionToValue(position, bounds.min, bounds.max);
        newValue = findNearestValue(rawValue, props.values);
      }

      const distToMin = Math.abs(newValue - minValue);
      const distToMax = Math.abs(newValue - maxValue);

      if (distToMin < distToMax) {
        if (newValue < maxValue) {
          setMinValue(
            props.mode === "continuous"
              ? newValue
              : newValue
          );
        }
      } else {
        if (newValue > minValue) {
          setMaxValue(
            props.mode === "continuous"
              ? newValue
              : newValue
          );
        }
      }
    },
    [minValue, maxValue, props, bounds]
  );

  const discreteMarkers = useMemo(() => {
    if (props.mode !== "discrete") return null;

    return props.values.map((value) => {
      const position = valueToPosition(value, bounds.min, bounds.max);
      const isActive = value >= minValue && value <= maxValue;

      return (
        <div
          key={value}
          className={`${styles.discreteMarker} ${isActive ? styles.discreteMarkerActive : ""}`}
          style={{ left: `${position * 100}%` }}
        />
      );
    });
  }, [props, minValue, maxValue, bounds]);

  const displayMinValue = useMemo(() => {
    if (props.mode === "discrete") {
      return formatCurrency(minValue, props.currency);
    }
    return minValue;
  }, [minValue, props]);

  const displayMaxValue = useMemo(() => {
    if (props.mode === "discrete") {
      return formatCurrency(maxValue, props.currency);
    }
    return maxValue;
  }, [maxValue, props]);

  useEffect(() => {
    const currentListeners = activeListenersRef.current;

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (currentListeners.mousemove) {
        document.removeEventListener("mousemove", currentListeners.mousemove);
      }
      if (currentListeners.mouseup) {
        document.removeEventListener("mouseup", currentListeners.mouseup);
      }
      if (currentListeners.touchmove) {
        document.removeEventListener("touchmove", currentListeners.touchmove);
      }
      if (currentListeners.touchend) {
        document.removeEventListener("touchend", currentListeners.touchend);
      }

      document.body.style.overflow = "";
    };
  }, []);

  if (validationError) {
    const className =
      validationError.type === "error"
        ? "p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
        : "p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700";

    return (
      <div role="alert" className={className}>
        <strong>
          {validationError.type === "error" ? "Configuration Error" : "Warning"}
          :
        </strong>{" "}
        {validationError.message}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.labelContainer}>
          <div className={styles.labelGroup}>
            <span className={styles.label}>Min:</span>
            {props.mode === "continuous" ? (
              <input
                type="number"
                className={styles.input}
                value={tempMinInput}
                onChange={handleMinInputChange}
                onBlur={handleMinInputBlur}
                min={props.min}
                max={maxValue}
                step={props.step || 1}
                aria-label="Minimum value"
              />
            ) : (
              <span
                className={styles.currencyValue}
                aria-label={`Minimum value: ${displayMinValue}`}
              >
                {displayMinValue}
              </span>
            )}
          </div>

          <div className={styles.labelGroup}>
            <span className={styles.label}>Max:</span>
            {props.mode === "continuous" ? (
              <input
                type="number"
                className={styles.input}
                value={tempMaxInput}
                onChange={handleMaxInputChange}
                onBlur={handleMaxInputBlur}
                min={minValue}
                max={props.max}
                step={props.step || 1}
                aria-label="Maximum value"
              />
            ) : (
              <span
                className={styles.currencyValue}
                aria-label={`Maximum value: ${displayMaxValue}`}
              >
                {displayMaxValue}
              </span>
            )}
          </div>
        </div>

        <div
          ref={trackRef}
          className={styles.trackContainer}
          onClick={handleTrackClick}
        >
          <div className={styles.track}>
            {discreteMarkers}

            <div
              className={styles.trackActive}
              style={{
                left: `${minPosition * 100}%`,
                right: `${(1 - maxPosition) * 100}%`,
              }}
            />

            <div
              ref={minHandleRef}
              className={`${styles.handle} ${styles.handleMin} ${
                isDraggingMin ? styles.handleDragging : ""
              }`}
              style={{ left: `${minPosition * 100}%` }}
              onMouseDown={(e) => handleMouseDown(e, true)}
              onTouchStart={(e) => handleTouchStart(e, true)}
              onKeyDown={(e) => handleKeyDown(e, true)}
              role="slider"
              aria-label="Minimum value slider"
              aria-valuemin={bounds.min}
              aria-valuemax={bounds.max}
              aria-valuenow={minValue}
              aria-valuetext={displayMinValue.toString()}
              tabIndex={0}
            />

            <div
              ref={maxHandleRef}
              className={`${styles.handle} ${styles.handleMax} ${
                isDraggingMax ? styles.handleDragging : ""
              }`}
              style={{ left: `${maxPosition * 100}%` }}
              onMouseDown={(e) => handleMouseDown(e, false)}
              onTouchStart={(e) => handleTouchStart(e, false)}
              onKeyDown={(e) => handleKeyDown(e, false)}
              role="slider"
              aria-label="Maximum value slider"
              aria-valuemin={bounds.min}
              aria-valuemax={bounds.max}
              aria-valuenow={maxValue}
              aria-valuetext={displayMaxValue.toString()}
              tabIndex={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
