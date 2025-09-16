export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function valueToPosition(
  value: number,
  min: number,
  max: number
): number {
  return (value - min) / (max - min);
}

export function positionToValue(
  position: number,
  min: number,
  max: number
): number {
  return position * (max - min) + min;
}

export function findNearestValue(value: number, values: number[]): number {
  return values.reduce((nearest, current) => {
    return Math.abs(current - value) < Math.abs(nearest - value)
      ? current
      : nearest;
  });
}

export function getValueIndex(value: number, values: number[]): number {
  return values.indexOf(value);
}

export function formatCurrency(value: number, currency = "EUR"): string {
  if (currency === "€" || currency === "$" || currency === "£") {
    return `${value}${currency}`;
  }
  
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(value);
}

export function getPositionFromEvent(
  event: MouseEvent | TouchEvent,
  element: HTMLElement
): number {
  const rect = element.getBoundingClientRect();
  const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
  const position = (clientX - rect.left) / rect.width;
  return clamp(position, 0, 1);
}


export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
): (...args: T) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
