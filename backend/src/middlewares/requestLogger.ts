/**
 * Request Logger Middleware
 * Logs all incoming requests with correlation IDs
 */

import { Request, Response, NextFunction } from 'express';
import { generateId } from '../utils/index.js';
import { logger } from '../utils/logger.js';

/**
 * Add request ID and log request
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    // Generate unique request ID
    const requestId = req.headers['x-request-id'] as string || `req_${generateId().slice(0, 12)}`;
    req.requestId = requestId;

    // Add to response headers
    res.setHeader('X-Request-ID', requestId);

    // Log request start
    const start = Date.now();

    // Log on response finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, path, query } = req;
        const { statusCode } = res;

        const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

        logger.log(logLevel, `${method} ${path}`, {
            requestId,
            method,
            path,
            query: Object.keys(query).length > 0 ? query : undefined,
            statusCode,
            duration: `${duration}ms`,
            userId: req.user?.id,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        });
    });

    next();
}

/**
 * Sanitize request body for logging (remove sensitive fields)
 */
export function sanitizeForLogging(body: Record<string, unknown>): Record<string, unknown> {
    const sensitiveFields = ['password', 'passwordHash', 'token', 'refreshToken', 'secret', 'apiKey'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
        if (field in sanitized) {
            sanitized[field] = '[REDACTED]';
        }
    }

    return sanitized;
}
