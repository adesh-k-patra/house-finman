/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent responses
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { logError, logSecurityEvent } from '../utils/logger.js';
import { config } from '../config/index.js';
import { generateId } from '../utils/index.js';
import { ZodError } from 'zod';

/**
 * Global error handler - must be the last middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
): Response {
    // Generate unique error ID for tracking
    const errorId = `err_${generateId().slice(0, 12)}`;

    // Log error with context
    logError(`Error ${errorId}`, err, {
        errorId,
        path: req.path,
        method: req.method,
        userId: req.user?.id,
        requestId: req.requestId,
        ip: req.ip,
    });

    // Handle known operational errors
    if (err instanceof AppError) {
        // Log security events for auth/permission errors
        if (err.statusCode === 401 || err.statusCode === 403) {
            logSecurityEvent(
                err.statusCode === 401 ? 'AUTH_ERROR' : 'PERMISSION_ERROR',
                req.user?.id,
                { errorId, path: req.path }
            );
        }

        return sendError(
            res,
            err.message,
            err.statusCode,
            err.code,
            errorId,
            err.details
        );
    }

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const formattedErrors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));

        return sendError(
            res,
            'Validation failed',
            422,
            'VALIDATION_ERROR',
            errorId,
            formattedErrors
        );
    }

    // Handle Malformed JSON (SyntaxError from body-parser)
    if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
        return sendError(
            res,
            'Malformed JSON payload',
            400,
            'BAD_REQUEST',
            errorId
        );
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid token', 401, 'INVALID_TOKEN', errorId);
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token expired', 401, 'TOKEN_EXPIRED', errorId);
    }

    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err as Error & { code: string };

        if (prismaError.code === 'P2002') {
            return sendError(
                res,
                'A record with this value already exists',
                409,
                'DUPLICATE_ENTRY',
                errorId
            );
        }

        if (prismaError.code === 'P2025') {
            return sendError(
                res,
                'Record not found',
                404,
                'NOT_FOUND',
                errorId
            );
        }
    }

    // Handle unknown/unexpected errors
    // NEVER expose internal error details in production
    const message = config.nodeEnv === 'development'
        ? err.message
        : 'An unexpected error occurred';

    return sendError(
        res,
        message,
        500,
        'INTERNAL_ERROR',
        errorId,
        config.nodeEnv === 'development' ? { stack: err.stack } : undefined
    );
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): Response {
    // 404s doesn't necessarily need a unique ID, but we can generate one if strict tracking is required
    return sendError(
        res,
        `Route ${req.method} ${req.path} not found`,
        404,
        'ROUTE_NOT_FOUND',
        `err_404_${generateId().slice(0, 8)}`
    );
}

/**
 * Async handler wrapper - catches async errors
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
