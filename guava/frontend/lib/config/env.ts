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

function loadEnv(): Env {
  const env = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000/api/v1',
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || 'localhost',
    NEXT_PUBLIC_IP: process.env.NEXT_PUBLIC_IP,
    APP_ENV: (process.env.APP_ENV || 'development') as 'development' | 'staging' | 'production',
    APP_DEBUG: process.env.APP_DEBUG || 'false',
  };
  
  return envSchema.parse(env);
}

export const env = loadEnv();


