/**
 * Rate Limiting Middleware
 * Configurable rate limits for different endpoints
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { RateLimitError } from '../utils/errors.js';
import { logSecurityEvent } from '../utils/logger.js';

/**
 * Default rate limiter
 */
export const defaultLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.nodeEnv === 'development',
    handler: (req, res, next) => {
        logSecurityEvent('RATE_LIMIT_EXCEEDED', req.user?.id, {
            ip: req.ip,
            path: req.path,
            method: req.method,
        });
        next(new RateLimitError('Too many requests, please try again later'));
    },
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.authRateLimitMax,
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.nodeEnv === 'development',
    skipSuccessfulRequests: false,
    handler: (req, res, next) => {
        logSecurityEvent('AUTH_RATE_LIMIT_EXCEEDED', undefined, {
            ip: req.ip,
            email: req.body?.email,
        });
        next(new RateLimitError('Too many authentication attempts. Please try again in 15 minutes.'));
    },
});

/**
 * Password reset limiter
 */
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many password reset attempts',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        logSecurityEvent('PASSWORD_RESET_RATE_LIMIT', undefined, {
            ip: req.ip,
            email: req.body?.email,
        });
        next(new RateLimitError('Too many password reset attempts. Please try again in an hour.'));
    },
});

/**
 * API rate limiter (per user/IP)
 */
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    keyGenerator: (req) => req.user?.id || req.ip || 'anonymous',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        logSecurityEvent('API_RATE_LIMIT_EXCEEDED', req.user?.id, {
            ip: req.ip,
            path: req.path,
        });
        next(new RateLimitError('API rate limit exceeded. Please slow down.'));
    },
});

/**
 * Sensitive operation limiter
 */
export const sensitiveOpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    keyGenerator: (req) => req.user?.id || req.ip || 'anonymous',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        logSecurityEvent('SENSITIVE_OP_RATE_LIMIT', req.user?.id, {
            ip: req.ip,
            path: req.path,
        });
        next(new RateLimitError('Too many sensitive operations. Please try again later.'));
    },
});
