/**
 * TypeScript Type Definitions
 */

import { User } from '@prisma/client';

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
            requestId?: string;
        }
    }
}

// Authenticated user (from JWT)
export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId: string;
    permissions: string[];
    deviceId?: string;
}

// User roles
export type UserRole =
    | 'super_admin'
    | 'tenant_admin'
    | 'viewer'
    | 'partner_admin'
    | 'agent'
    | 'vendor_manager'
    | 'finance'
    | 'cx'
    | 'mentor';

// JWT Payloads
export interface AccessTokenPayload {
    userId: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId: string;
    permissions: string[];
    deviceId?: string;
    type: 'access';
    iss?: string;
    aud?: string;
    sub?: string;
}

export interface RefreshTokenPayload {
    userId: string;
    tokenId: string;
    type: 'refresh';
    iss?: string;
    aud?: string;
    sub?: string;
}

// Auth DTOs
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    tenantId?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

// Pagination
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Common filter/sort params
export interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
}

// Safe user (without password)
export type SafeUser = Omit<User, 'passwordHash' | 'mfaSecret'>;
