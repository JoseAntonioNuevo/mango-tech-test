class ApiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiConfigError';
  }
}

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    const productionUrl = 
      process.env.URL ||
      process.env.VERCEL_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      process.env.RAILWAY_STATIC_URL ||
      process.env.DEPLOY_URL;

    if (productionUrl) {
      return productionUrl.startsWith('http') 
        ? productionUrl 
        : `https://${productionUrl}`;
    }

    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  return process.env.NEXT_PUBLIC_API_URL || '';
}

export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiConfigError(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`API Error [${endpoint}]:`, error);
    }
    
    throw error;
  }
}

export const API_ENDPOINTS = {
  RANGE_NORMAL: '/api/range/normal',
  RANGE_FIXED: '/api/range/fixed',
} as const;

export interface RangeNormalResponse {
  min: number;
  max: number;
}

export interface RangeFixedResponse {
  rangeValues: number[];
}