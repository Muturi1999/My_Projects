/**
 * API client configuration using Axios.
 * Centralized HTTP client for all API calls.
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/lib/config/env';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_GATEWAY_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (future)
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors - create a new error object to avoid modifying read-only properties
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Extract error message from response
      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.detail) {
        errorMessage = data.detail;
      } else if (typeof data === 'string') {
        errorMessage = data;
      } else if (data?.error) {
        errorMessage = data.error;
      }
      
      switch (status) {
        case 401:
          // Unauthorized - handle auth (future)
          errorMessage = errorMessage || 'Unauthorized';
          break;
        case 403:
          // Forbidden
          errorMessage = errorMessage || 'Forbidden';
          break;
        case 404:
          // Not found
          errorMessage = errorMessage || 'Resource not found';
          break;
        case 500:
          // Server error
          errorMessage = errorMessage || 'Server error';
          console.error('Server error:', data);
          break;
        default:
          console.error('API error:', data);
      }
    } else if (error.request) {
      // Request made but no response - backend is likely not running
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to backend. Please ensure:\n1. API Gateway is running (port 8000)\n2. Required services are running (Products, Catalog, CMS)\n3. See START_BACKEND.md for setup instructions';
      } else {
        errorMessage = error.message || 'Network error: No response from server';
      }
      console.error('Network error:', errorMessage);
      console.error('API Gateway URL:', env.NEXT_PUBLIC_API_GATEWAY_URL);
      console.error('Check if backend services are running. See START_BACKEND.md for help.');
    } else {
      // Error setting up request
      errorMessage = error.message || 'Request setup error';
      console.error('Request error:', errorMessage);
    }
    
    // Create a new error object with the message
    const apiError = new Error(errorMessage);
    // Preserve original error for debugging
    (apiError as any).originalError = error;
    (apiError as any).status = error.response?.status;
    (apiError as any).data = error.response?.data;
    
    return Promise.reject(apiError);
  }
);

export default apiClient;


