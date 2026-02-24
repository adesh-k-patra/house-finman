import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

/**
 * API Gateway Middleware
 * Acts as the single entry point for all API requests.
 * Enforces:
 * 1. Request Correlation ID (X-Request-ID)
 * 2. Strict Content-Type checks for mutation requests
 * 3. strict Method Validation (Block TRACE/TRACK)
 * 4. Request Context initialization (IP, User-Agent)
 */
export function gatewayHandler(req: Request, res: Response, next: NextFunction) {
    // 1. Assign Correlation ID
    const correlationId = req.headers['x-request-id'] as string || uuidv4();
    req.headers['x-request-id'] = correlationId;
    res.setHeader('X-Request-ID', correlationId);

    // 2. Strict Method Validation
    const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
    if (!allowedMethods.includes(req.method)) {
        logger.warn(`[Gateway] Blocked Method: ${req.method}`, { correlationId });
        return res.status(405).json({
            error: 'Method Not Allowed',
            message: `Method ${req.method} is not allowed per security policy`,
            errorId: `err_${uuidv4().slice(0, 8)}`
        });
    }

    // 3. Strict Content-Type Check for Mutations
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'];
        // Allow no content-type for empty bodies if content-length is 0, but usually APIs send JSON
        if ((!contentType || !contentType.includes('application/json'))) {
            // Allow multipart for file uploads if needed (strict check)
            if (!contentType?.includes('multipart/form-data')) {
                logger.warn(`[Gateway] Invalid Content-Type: ${contentType}`, { correlationId });
                return res.status(415).json({
                    error: 'Unsupported Media Type',
                    message: 'Content-Type must be application/json',
                    errorId: `err_${uuidv4().slice(0, 8)}`
                });
            }
        }
    }

    // 4. Request Context & Logging
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Log Request Entry (lighter verification log)
    logger.debug(`[Gateway] Incoming ${req.method} ${req.path}`, {
        correlationId,
        ip,
        userAgent
    });

    next();
}
