/**
 * API Response Helpers
 * Consistent response format for all endpoints
 */

import { Response } from 'express';

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        errorId: string;
        details?: unknown;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

/**
 * Send success response
 */
export function sendSuccess<T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    meta?: ApiResponse['meta']
): Response {
    const response: ApiResponse<T> = {
        success: true,
        data,
    };

    if (meta) {
        response.meta = meta;
    }

    return res.status(statusCode).json(response);
}

/**
 * Send error response
 */
export function sendError(
    res: Response,
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    errorId?: string,
    details?: unknown
): Response {
    const response: ApiResponse = {
        success: false,
        error: {
            code,
            message,
            errorId: errorId || 'err_unknown',
            details: process.env.NODE_ENV === 'development' ? details : undefined,
        },
    };

    return res.status(statusCode).json(response);
}

/**
 * Send paginated response
 */
export function sendPaginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number
): Response {
    return sendSuccess(res, data, 200, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}

/**
 * Send created response (201)
 */
export function sendCreated<T>(res: Response, data: T): Response {
    return sendSuccess(res, data, 201);
}

/**
 * Send no content response (204)
 */
export function sendNoContent(res: Response): Response {
    return res.status(204).send();
}
