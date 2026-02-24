/**
 * Authentication Controller
 * HTTP request handlers for auth endpoints
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
    loginUser,
    registerUser,
    refreshAccessToken,
    logoutUser,
    changePassword,
} from '../services/authService.js';
import { sendSuccess, sendNoContent } from '../utils/response.js';
import { config } from '../config/index.js';
import { getTokenExpiry } from '../services/jwtService.js';

/**
 * Cookie configuration for tokens
 */
const getCookieOptions = (maxAge: number) => ({
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite as 'strict' | 'lax' | 'none',
    domain: config.nodeEnv === 'production' ? config.cookieDomain : undefined,
    maxAge,
    path: '/',
});

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;

    const { user, tokens } = await loginUser(
        email,
        password,
        req.ip,
        req.get('user-agent'),
        req.header('x-device-id')
    );

    // Set cookies
    const accessExpiry = getTokenExpiry(config.jwtAccessExpiry) * 1000;
    const refreshExpiry = rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days if remember me
        : getTokenExpiry(config.jwtRefreshExpiry) * 1000;

    res.cookie('accessToken', tokens.accessToken, getCookieOptions(accessExpiry));
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(refreshExpiry));

    return sendSuccess(res, {
        user,
        accessToken: tokens.accessToken,
        expiresIn: accessExpiry / 1000,
    });
});

/**
 * POST /api/v1/auth/register
 * Register new user
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body;

    const { user, tokens } = await registerUser(
        email,
        password,
        name,
        undefined, // Default tenant
        phone,
        req.header('x-device-id')
    );

    // Set cookies
    const accessExpiry = getTokenExpiry(config.jwtAccessExpiry) * 1000;
    const refreshExpiry = getTokenExpiry(config.jwtRefreshExpiry) * 1000;

    res.cookie('accessToken', tokens.accessToken, getCookieOptions(accessExpiry));
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(refreshExpiry));

    return sendSuccess(res, {
        user,
        accessToken: tokens.accessToken,
        expiresIn: accessExpiry / 1000,
    }, 201);
});

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
        return sendSuccess(res, null, 401);
    }

    const tokens = await refreshAccessToken(
        refreshToken,
        req.ip,
        req.get('user-agent'),
        req.header('x-device-id')
    );

    // Set new cookies
    const accessExpiry = getTokenExpiry(config.jwtAccessExpiry) * 1000;
    const refreshExpiry = getTokenExpiry(config.jwtRefreshExpiry) * 1000;

    res.cookie('accessToken', tokens.accessToken, getCookieOptions(accessExpiry));
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(refreshExpiry));

    return sendSuccess(res, {
        accessToken: tokens.accessToken,
        expiresIn: accessExpiry / 1000,
    });
});

/**
 * POST /api/v1/auth/logout
 * Logout user (revoke refresh token)
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const logoutAll = req.body?.logoutAll === true;

    if (req.user) {
        await logoutUser(req.user.id, refreshToken, logoutAll);
    }

    // Clear cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    return sendNoContent(res);
});

/**
 * GET /api/v1/auth/me
 * Get current user profile
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    return sendSuccess(res, {
        user: req.user,
    });
});

/**
 * POST /api/v1/auth/change-password
 * Change user password
 */
export const changePasswordHandler = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    await changePassword(req.user!.id, currentPassword, newPassword);

    // Clear cookies (force re-login)
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    return sendSuccess(res, { message: 'Password changed successfully. Please login again.' });
});
