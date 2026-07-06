import { getEnv } from '../config/env.js';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private requestsPerWindow: number;
  private windowMs: number;

  constructor() {
    const env = getEnv();
    this.requestsPerWindow = env.RATE_LIMIT_REQUESTS;
    this.windowMs = env.RATE_LIMIT_WINDOW_MS;
  }

  checkLimit(clientId: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(clientId);

    if (!bucket) {
      bucket = { tokens: this.requestsPerWindow, lastRefill: now };
      this.buckets.set(clientId, bucket);
    }

    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = (timePassed / this.windowMs) * this.requestsPerWindow;
    bucket.tokens = Math.min(this.requestsPerWindow, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    return false;
  }
}
