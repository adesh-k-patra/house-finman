/**
 * Request Validation Middleware
 * Zod schema validation for request body, params, and query
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';
import { sanitizeData } from '../utils/sanitizer.js';

interface ValidationSchemas {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}

/**
 * Validate request against Zod schemas
 */
export function validateRequest(schemas: ValidationSchemas) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Sanitize all incoming data first
            if (req.body) req.body = sanitizeData(req.body);
            if (req.params) req.params = sanitizeData(req.params);
            if (req.query) req.query = sanitizeData(req.query);

            // Validate body
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }

            // Validate params
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }

            // Validate query
            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                }));

                return next(new ValidationError('Validation failed', formattedErrors));
            }

            next(error);
        }
    };
}

/**
 * Validate only body
 */
export function validateBody(schema: ZodSchema) {
    return validateRequest({ body: schema });
}

/**
 * Validate only params
 */
export function validateParams(schema: ZodSchema) {
    return validateRequest({ params: schema });
}

/**
 * Validate only query
 */
export function validateQuery(schema: ZodSchema) {
    return validateRequest({ query: schema });
}
