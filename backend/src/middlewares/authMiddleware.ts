/**
 * Authentication Middleware
 * JWT verification and user extraction
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, decodeToken } from '../services/jwtService.js';
import * as jwtService from '../services/jwtService.js';
import { UnauthorizedError } from '../utils/errors.js';
import { AuthenticatedUser } from '../types/index.js';
import { logSecurityEvent } from '../utils/logger.js';

/**
 * Extract token from request
 * Supports: Authorization header (Bearer), cookies (HttpOnly)
 */
function extractToken(req: Request): string | null {
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    // Check cookies
    if (req.cookies?.accessToken) {
        return req.cookies.accessToken;
    }

    return null;
}

/**
 * Authentication middleware - requires valid token
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = extractToken(req);

        if (!token) {
            throw new UnauthorizedError('No authentication token provided');
        }

        // IdP Token Support Hook
        // If the token is from an external IdP (Auth0/Okta), we would validate against their JWKS here.
        // For now, we assume local tokens but check for the issuer to be future-proof.
        const decoded = jwtService.decodeToken(token);
        if (decoded && decoded.iss && decoded.iss !== 'housefinman-local') {
            // TODO: Implement external IdP validation
            // await verifyRemoteIdPToken(token);
            throw new UnauthorizedError('External IdP tokens not yet supported');
        }

        const payload = verifyAccessToken(token);

        // Session Protection: Verify issuer
        if (payload.iss && payload.iss !== 'housefinman-local') {
            logSecurityEvent('SUSPICIOUS_ISSUER', payload.userId, { issuer: payload.iss, ip: req.ip });
            throw new UnauthorizedError('Token issuer mismatch');
        }

        // Device Binding Hook (Future: Check Fingerprint from X-Device-ID)
        const deviceId = req.headers['x-device-id'];
        if (deviceId && payload.deviceId && deviceId !== payload.deviceId) {
            logSecurityEvent('SESSION_DEVICE_MISMATCH', payload.userId, {
                expected: payload.deviceId,
                actual: deviceId,
                ip: req.ip
            });
            throw new UnauthorizedError('Session device mismatch detected');
        }

        // Attach user to request
        req.user = {
            id: payload.userId,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            tenantId: payload.tenantId,
            permissions: payload.permissions,
        };

        next();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Authentication failed';

        logSecurityEvent('AUTH_FAILED', undefined, {
            reason: message,
            ip: req.ip,
            path: req.path,
            userAgent: req.headers['user-agent']
        });

        next(new UnauthorizedError(message));
    }
}

/**
 * Optional authentication - attaches user if token present, continues otherwise
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = extractToken(req);

        if (token) {
            const payload = verifyAccessToken(token);
            req.user = {
                id: payload.userId,
                email: payload.email,
                name: payload.name,
                role: payload.role,
                tenantId: payload.tenantId,
                permissions: payload.permissions,
            };
        }

        next();
    } catch {
        // Token invalid/expired - continue without user
        next();
    }
}

/**
 * Require specific user (for profile access, etc.)
 */
export function requireSameUser(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const userId = req.params.id || req.params.userId;

    if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
    }

    // Super admins and tenant admins can access any user
    if (req.user.role === 'super_admin' || req.user.role === 'tenant_admin') {
        return next();
    }

    // Regular users can only access themselves
    if (req.user.id !== userId) {
        logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', req.user.id, {
            targetUserId: userId,
            ip: req.ip,
        });
        return next(new UnauthorizedError('Access denied'));
    }

    next();
}
