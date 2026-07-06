import { z } from 'zod';
import * as dotenv from 'dotenv';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  LOG_LEVEL: z.string().default('info'),
  PORT: z.coerce.number().default(3000),
  ZILLOW_API_KEY: z.string(),
  REDFIN_API_KEY: z.string(),
  MAPBOX_TOKEN: z.string(),
  CENSUS_API_KEY: z.string(),
  REDIS_URL: z.string().optional(),
  ENABLE_CACHING: z.string().default('true'),
  RATE_LIMIT_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
});

export type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | null = null;

export function loadEnv(): Env {
  if (cachedEnv) return cachedEnv;
  dotenv.config();
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Environment validation failed');
    process.exit(1);
  }
  cachedEnv = result.data;
  return cachedEnv;
}

export function getEnv(): Env {
  if (!cachedEnv) return loadEnv();
  return cachedEnv;
}
