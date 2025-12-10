/**
 * Type-safe environment variable loader for frontend.
 * Validates and provides type-safe access to environment variables.
 */
import { z } from 'zod';

const envSchema = z.object({
  // Public variables (exposed to browser)
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8000/api/v1'),
  NEXT_PUBLIC_API_GATEWAY_URL: z.string().url().default('http://localhost:8000/api/v1'),
  NEXT_PUBLIC_DOMAIN: z.string().default('localhost'),
  NEXT_PUBLIC_IP: z.string().ip().optional(),
  
  // Server-only variables (not exposed)
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  APP_DEBUG: z.string().transform(val => val === 'true').default('false'),
});

export type Env = z.infer<typeof envSchema>;

// Helper function to build URLs from domain (centralized configuration)
function buildUrl(domain: string, port: string, path: string = ''): string {
  const protocol = domain === 'localhost' ? 'http' : 'https';
  return `${protocol}://${domain}:${port}${path}`;
}

function loadEnv(): Env {
  // Centralized domain configuration - change NEXT_PUBLIC_DOMAIN to switch environments
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
  const apiPort = process.env.NEXT_PUBLIC_API_GATEWAY_PORT || '8000';
  const frontendPort = process.env.NEXT_PUBLIC_FRONTEND_PORT || '3000';
  
  const env = {
    // Use explicit URLs if provided, otherwise build from domain
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || buildUrl(domain, frontendPort),
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || buildUrl(domain, apiPort, '/api/v1'),
    NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || buildUrl(domain, apiPort, '/api/v1'),
    NEXT_PUBLIC_DOMAIN: domain,
    NEXT_PUBLIC_IP: process.env.NEXT_PUBLIC_IP,
    APP_ENV: (process.env.APP_ENV || 'development') as 'development' | 'staging' | 'production',
    APP_DEBUG: process.env.APP_DEBUG || 'false',
  };
  
  return envSchema.parse(env);
}

export const env = loadEnv();


