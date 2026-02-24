/**
 * Configuration Module
 * Centralized configuration with validation and type safety
 */

import { z } from "zod"

const configSchema = z.object({
  // Server
  nodeEnv: z.enum(["development", "test", "production"]).default("development"),
  port: z.coerce.number().default(5007),
  apiPrefix: z.string().default("/api/v1"),

  // Database
  databaseUrl: z.string(),

  // JWT
  jwtAccessSecret: z.string().min(32),
  jwtRefreshSecret: z.string().min(32),
  jwtAccessExpiry: z.string().default("15m"),
  jwtRefreshExpiry: z.string().default("7d"),

  // Security
  corsOrigin: z.string().default("http://localhost:5173"),
  rateLimitWindowMs: z.coerce.number().default(900000), // 15 minutes
  rateLimitMaxRequests: z.coerce.number().default(100),
  authRateLimitMax: z.coerce.number().default(10),

  // Cookies
  cookieDomain: z.string().default("localhost"),
  cookieSecure: z.coerce.boolean().default(true),
  cookieSameSite: z.enum(["strict", "lax", "none"]).default("strict"),

  // Logging
  logLevel: z.enum(["error", "warn", "info", "debug"]).default("info"),
  logFormat: z.enum(["json", "pretty"]).default("json"),

  // MFA
  mfaEnabled: z.coerce.boolean().default(false),
  mfaIssuer: z.string().default("HouseFinMan"),
})

function loadConfig() {
  const result = configSchema.safeParse({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    apiPrefix: process.env.API_PREFIX,

    databaseUrl: process.env.DATABASE_URL,

    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY,
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY,

    corsOrigin: process.env.CORS_ORIGIN,
    rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
    authRateLimitMax: process.env.AUTH_RATE_LIMIT_MAX,

    cookieDomain: process.env.COOKIE_DOMAIN,
    cookieSecure:
      process.env.NODE_ENV === "production" ? true : process.env.COOKIE_SECURE,
    cookieSameSite: process.env.COOKIE_SAME_SITE,

    logLevel: process.env.LOG_LEVEL,
    logFormat: process.env.LOG_FORMAT,

    mfaEnabled: process.env.MFA_ENABLED,
    mfaIssuer: process.env.MFA_ISSUER,
  })

  if (!result.success) {
    console.error("❌ Configuration validation failed:")
    console.error(result.error.format())
    process.exit(1)
  }

  return result.data
}

export const config = loadConfig()
export type Config = z.infer<typeof configSchema>
