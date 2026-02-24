/**
 * Winston Logger Configuration
 * Structured logging with request correlation
 */

import winston from 'winston';
import { config } from '../config/index.js';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for pretty printing in development
const prettyFormat = printf(({ level, message, timestamp, requestId, ...metadata }) => {
    let msg = `${timestamp} [${level}]`;
    if (requestId) msg += ` [${requestId}]`;
    msg += `: ${message}`;

    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }

    return msg;
});

// Create logger instance
export const logger = winston.createLogger({
    level: config.logLevel,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        config.logFormat === 'pretty'
            ? combine(colorize(), prettyFormat)
            : json()
    ),
    defaultMeta: { service: 'house-finman-api' },
    transports: [
        new winston.transports.Console(),
    ],
});

// Helper functions for structured logging
export const logInfo = (message: string, meta?: Record<string, unknown>) => {
    logger.info(message, meta);
};

export const logError = (message: string, error?: Error, meta?: Record<string, unknown>) => {
    logger.error(message, {
        ...meta,
        error: error ? {
            name: error.name,
            message: error.message,
            stack: config.nodeEnv === 'development' ? error.stack : undefined,
        } : undefined,
    });
};

export const logWarn = (message: string, meta?: Record<string, unknown>) => {
    logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, unknown>) => {
    logger.debug(message, meta);
};

// Security event logging
export const logSecurityEvent = (
    event: string,
    userId?: string,
    meta?: Record<string, unknown>
) => {
    logger.info(`[SECURITY] ${event}`, {
        ...meta,
        userId,
        eventType: 'security',
    });
};

// Audit logging
export const logAudit = (
    action: string,
    resource: string,
    resourceId: string | undefined,
    userId: string | undefined,
    meta?: Record<string, unknown>
) => {
    logger.info(`[AUDIT] ${action} on ${resource}`, {
        ...meta,
        action,
        resource,
        resourceId,
        userId,
        eventType: 'audit',
    });
};
