/**
 * Authentication Service
 * Business logic for authentication operations
 */

import { prisma } from '../models/prisma.js';
import { generateTokenPair, verifyRefreshToken, getTokenExpiry } from './jwtService.js';
import { hashPassword, comparePassword, generateId } from '../utils/index.js';
import { logSecurityEvent, logAudit } from '../utils/logger.js';
import {
    UnauthorizedError,
    BadRequestError,
    ConflictError,
    NotFoundError,
} from '../utils/errors.js';
import { config } from '../config/index.js';
import { AuthTokens, SafeUser, UserRole } from '../types/index.js';

interface LoginResult {
    user: SafeUser;
    tokens: AuthTokens;
}

interface RegisterResult {
    user: SafeUser;
    tokens: AuthTokens;
}

/**
 * Login user with email and password
 */
export async function loginUser(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string,
    deviceId?: string
): Promise<LoginResult> {
    // Find user
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { tenant: true },
    });

    if (!user) {
        logSecurityEvent('LOGIN_FAILED', undefined, { email, reason: 'User not found', ip: ipAddress });
        throw new UnauthorizedError('Invalid email or password');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
        logSecurityEvent('LOGIN_BLOCKED', user.id, { reason: 'Account locked', ip: ipAddress });
        throw new UnauthorizedError('Account is temporarily locked. Please try again later.');
    }

    // Check if user is active
    if (!user.isActive) {
        logSecurityEvent('LOGIN_FAILED', user.id, { reason: 'Account inactive', ip: ipAddress });
        throw new UnauthorizedError('Account is inactive. Please contact support.');
    }

    // Verify password
    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
        // Increment failed attempts
        const failedAttempts = user.failedLoginAttempts + 1;
        const lockAccount = failedAttempts >= 5;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: failedAttempts,
                lockedUntil: lockAccount ? new Date(Date.now() + 15 * 60 * 1000) : null, // Lock for 15 min
            },
        });

        logSecurityEvent('LOGIN_FAILED', user.id, {
            reason: 'Invalid password',
            failedAttempts,
            accountLocked: lockAccount,
            ip: ipAddress,
        });

        throw new UnauthorizedError('Invalid email or password');
    }

    // Parse permissions
    const permissions = user.permissions && typeof user.permissions === 'string'
        ? JSON.parse(user.permissions) as string[]
        : [];

    // Generate tokens
    const { tokens, refreshTokenId } = generateTokenPair(
        user.id,
        user.email,
        user.name,
        user.role as UserRole,
        user.tenantId,
        permissions
    );

    // Store refresh token
    const refreshExpiry = getTokenExpiry(config.jwtRefreshExpiry);
    await prisma.refreshToken.create({
        data: {
            id: refreshTokenId,
            token: tokens.refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + refreshExpiry * 1000),
            ipAddress,
            userAgent,
        },
    });

    // Reset failed attempts and update last login
    await prisma.user.update({
        where: { id: user.id },
        data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
        },
    });

    // Audit log
    logAudit('LOGIN', 'User', user.id, user.id, { ip: ipAddress });
    logSecurityEvent('LOGIN_SUCCESS', user.id, { ip: ipAddress });

    // Return safe user (without password)
    const { passwordHash: _, mfaSecret: __, ...safeUser } = user;

    return {
        user: safeUser as SafeUser,
        tokens,
    };
}

/**
 * Register new user
 */
export async function registerUser(
    email: string,
    password: string,
    name: string,
    tenantId?: string,
    phone?: string,
    deviceId?: string
): Promise<RegisterResult> {
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existing) {
        throw new ConflictError('User with this email already exists');
    }

    // Get or create default tenant
    let tenant = await prisma.tenant.findFirst({
        where: tenantId ? { id: tenantId } : { slug: 'default' },
    });

    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                id: generateId(),
                name: 'Default Tenant',
                slug: 'default',
            },
        });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
        data: {
            id: generateId(),
            email: normalizedEmail,
            passwordHash,
            name,
            phone,
            role: 'viewer', // Default role
            tenantId: tenant.id,
            permissions: "[]",
        },
        include: { tenant: true },
    });

    // Generate tokens
    const { tokens, refreshTokenId } = generateTokenPair(
        user.id,
        user.email,
        user.name,
        user.role as UserRole,
        user.tenantId,
        [],
        deviceId
    );

    // Store refresh token
    const refreshExpiry = getTokenExpiry(config.jwtRefreshExpiry);
    await prisma.refreshToken.create({
        data: {
            id: refreshTokenId,
            token: tokens.refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + refreshExpiry * 1000),
            deviceId: deviceId as any,
        } as any,
    });

    // Audit log
    logAudit('REGISTER', 'User', user.id, user.id, { email: normalizedEmail });

    const { passwordHash: _, mfaSecret: __, ...safeUser } = user;

    return {
        user: safeUser as SafeUser,
        tokens,
    };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
    deviceId?: string
): Promise<AuthTokens> {
    // Verify token
    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        throw new UnauthorizedError('Invalid refresh token');
    }

    // Find stored token
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });

    if (!storedToken) {
        logSecurityEvent('REFRESH_TOKEN_NOT_FOUND', payload.userId, { ip: ipAddress });
        throw new UnauthorizedError('Refresh token not found');
    }

    if (storedToken.revokedAt) {
        logSecurityEvent('REFRESH_TOKEN_REUSE_ATTEMPT', payload.userId, { ip: ipAddress });
        // Potential token theft - revoke all tokens for this user
        await prisma.refreshToken.updateMany({
            where: { userId: storedToken.userId },
            data: { revokedAt: new Date() },
        });
        throw new UnauthorizedError('Refresh token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedError('Refresh token has expired');
    }

    if (!storedToken.user.isActive) {
        throw new UnauthorizedError('Account is inactive');
    }

    const user = storedToken.user;

    // Session Protection: Verify Device ID if it was bound
    if ((storedToken as any).deviceId && deviceId && (storedToken as any).deviceId !== deviceId) {
        logSecurityEvent('REFRESH_DEVICE_MISMATCH', user.id, {
            expected: (storedToken as any).deviceId,
            actual: deviceId,
            ip: ipAddress
        });
        throw new UnauthorizedError('Device mismatch on token refresh');
    }

    const permissions = user.permissions && typeof user.permissions === 'string'
        ? JSON.parse(user.permissions) as string[]
        : [];

    // Rotate refresh token (revoke old, create new)
    await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const { tokens, refreshTokenId } = generateTokenPair(
        user.id,
        user.email,
        user.name,
        user.role as UserRole,
        user.tenantId,
        permissions,
        deviceId
    );

    // Store new refresh token
    const refreshExpiry = getTokenExpiry(config.jwtRefreshExpiry);
    await prisma.refreshToken.create({
        data: {
            id: refreshTokenId,
            token: tokens.refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + refreshExpiry * 1000),
            ipAddress,
            userAgent,
            deviceId: deviceId as any,
        } as any,
    });

    logSecurityEvent('TOKEN_REFRESHED', user.id, { ip: ipAddress });

    return tokens;
}

/**
 * Logout user - revoke refresh token
 */
export async function logoutUser(
    userId: string,
    refreshToken?: string,
    logoutAll: boolean = false
): Promise<void> {
    if (logoutAll) {
        // Revoke all refresh tokens for user
        await prisma.refreshToken.updateMany({
            where: { userId },
            data: { revokedAt: new Date() },
        });
        logSecurityEvent('LOGOUT_ALL', userId);
    } else if (refreshToken) {
        // Revoke specific token
        await prisma.refreshToken.updateMany({
            where: { token: refreshToken },
            data: { revokedAt: new Date() },
        });
        logSecurityEvent('LOGOUT', userId);
    }

    logAudit('LOGOUT', 'User', userId, userId);
}



/**
 * Update user password
 */
export async function changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new NotFoundError('User');
    }

    // Verify current password
    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
        throw new BadRequestError('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
    });

    // Revoke all refresh tokens (force re-login)
    await prisma.refreshToken.updateMany({
        where: { userId },
        data: { revokedAt: new Date() },
    });

    logAudit('PASSWORD_CHANGE', 'User', userId, userId);
    logSecurityEvent('PASSWORD_CHANGED', userId);
}
