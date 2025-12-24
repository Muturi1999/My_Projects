/**
 * Type-safe environment variable loader for frontend.
 * Provides type-safe access to environment variables.
 */
export type Env = {
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_DOMAIN: string;
  NEXT_PUBLIC_IP?: string;
  NEXT_PUBLIC_API_GATEWAY_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  APP_DEBUG: boolean;
};

// Helper function to build URLs from domain (centralized configuration)
function buildUrl(domain: string, port: string, path: string = ''): string {
  const protocol = domain === 'localhost' ? 'http' : 'https';
  return `${protocol}://${domain}:${port}${path}`;
}

function loadEnv(): Env {
  // Centralized domain configuration - change NEXT_PUBLIC_DOMAIN to switch environments
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
  const frontendPort = process.env.NEXT_PUBLIC_FRONTEND_PORT || '3000';
  
  const env: Env = {
    // Use explicit URLs if provided, otherwise build from domain
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || buildUrl(domain, frontendPort),
    NEXT_PUBLIC_DOMAIN: domain,
    NEXT_PUBLIC_IP: process.env.NEXT_PUBLIC_IP,
    NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8001/api',
    APP_ENV: (process.env.APP_ENV || 'development') as 'development' | 'staging' | 'production',
    APP_DEBUG: process.env.APP_DEBUG === 'true',
  };
  
  return env;
}

export const env = loadEnv();


