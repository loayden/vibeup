/**
 * Simple in-memory rate limiter for API endpoints
 * Tracks requests per IP address
 */

type RateLimitData = {
  count: number;
  resetTime: number;
};

// Store: { ip -> { count, resetTime } }
const store = new Map<string, RateLimitData>();

// Cleanup old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of store.entries()) {
    if (now > data.resetTime) {
      store.delete(ip);
    }
  }
}, 60000);

/**
 * Check if request should be allowed
 * @param ip - Client IP address
 * @param maxRequests - Max requests in window (default 5)
 * @param windowSeconds - Time window in seconds (default 60)
 * @returns true if request is allowed, false if rate limited
 */
export function rateLimit(
  ip: string,
  options: { maxRequests?: number; windowSeconds?: number } = {}
): boolean {
  const { maxRequests = 5, windowSeconds = 60 } = options;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let data = store.get(ip);

  // Reset if window expired
  if (!data || now > data.resetTime) {
    data = { count: 0, resetTime: now + windowMs };
    store.set(ip, data);
  }

  // Increment counter
  data.count++;

  // Check if over limit
  return data.count <= maxRequests;
}

/**
 * Get rate limit status for an IP
 */
export function getRateLimitStatus(
  ip: string,
  maxRequests: number = 5
): {
  remaining: number;
  reset: number;
} {
  const data = store.get(ip);
  if (!data) {
    return { remaining: maxRequests, reset: 0 };
  }

  const now = Date.now();
  const resetSeconds = Math.ceil((data.resetTime - now) / 1000);

  return {
    remaining: Math.max(0, maxRequests - data.count),
    reset: Math.max(0, resetSeconds),
  };
}
