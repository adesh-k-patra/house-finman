/**
 * JWT Service
 * Token generation and verification
 */

import * as jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AccessTokenPayload, RefreshTokenPayload, AuthTokens, UserRole } from '../types/index.js';
import { generateId } from '../utils/index.js';

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
    return jwt.sign(
        { ...payload, type: 'access' },
        config.jwtAccessSecret as any,
        { expiresIn: config.jwtAccessExpiry as any, issuer: 'housefinman-local' }
    );
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(userId: string): { token: string; tokenId: string } {
    const tokenId = generateId();
    const token = jwt.sign(
        { userId, tokenId, type: 'refresh' } as RefreshTokenPayload,
        config.jwtRefreshSecret as any,
        { expiresIn: config.jwtRefreshExpiry as any, issuer: 'housefinman-local' }
    );
    return { token, tokenId };
}

/**
 * Generate both tokens
 */
export function generateTokenPair(
    userId: string,
    email: string,
    name: string,
    role: UserRole,
    tenantId: string,
    permissions: string[],
    deviceId?: string
): { tokens: AuthTokens; refreshTokenId: string } {
    const accessToken = generateAccessToken({
        userId,
        email,
        name,
        role,
        tenantId,
        permissions,
        deviceId,
    });

    const { token: refreshToken, tokenId: refreshTokenId } = generateRefreshToken(userId);

    return {
        tokens: { accessToken, refreshToken },
        refreshTokenId,
    };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
    const payload = jwt.verify(token, config.jwtAccessSecret) as AccessTokenPayload;

    if (payload.type !== 'access') {
        throw new Error('Invalid token type');
    }

    return payload;
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
    const payload = jwt.verify(token, config.jwtRefreshSecret) as RefreshTokenPayload;

    if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
    }

    return payload;
}

/**
 * Decode token without verification (for expired token handling)
 */
export function decodeToken(token: string): AccessTokenPayload | RefreshTokenPayload | null {
    return jwt.decode(token) as AccessTokenPayload | RefreshTokenPayload | null;
}

/**
 * Get token expiry time in seconds
 */
export function getTokenExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // Default 15 minutes

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 60 * 60 * 24;
        default: return 900;
    }
}
