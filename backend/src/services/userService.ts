/**
 * User Service
 * Business logic for user management (admin operations)
 */

import { prisma } from '../models/prisma.js';
import { generateId, hashPassword, omit } from '../utils/index.js';
import { logAudit } from '../utils/logger.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors.js';
import { PaginatedResult, PaginationParams, SafeUser, UserRole } from '../types/index.js';
import { User } from '@prisma/client';

interface UserFilters {
    role?: string;
    isActive?: boolean;
    search?: string;
}

/**
 * Get all users with pagination
 */
export async function getUsers(
    tenantId: string,
    pagination: PaginationParams,
    filters: UserFilters = {},
    isSuperAdmin: boolean = false
): Promise<PaginatedResult<SafeUser>> {
    const where: Record<string, unknown> = isSuperAdmin ? {} : { tenantId };

    if (filters.role) {
        where.role = filters.role;
    }
    if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
    }
    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search } },
            { email: { contains: filters.search } },
        ];
    }

    const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where,
            skip: pagination.skip,
            take: pagination.limit,
            orderBy: { createdAt: 'desc' },
            include: { tenant: { select: { id: true, name: true } } },
        }),
    ]);

    const safeUsers = users.map(u => omit(u, ['passwordHash', 'mfaSecret'])) as SafeUser[];

    return {
        data: safeUsers,
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPages: Math.ceil(total / pagination.limit),
        },
    };
}

/**
 * Get user by ID
 */
export async function getUserById(id: string, tenantId?: string): Promise<SafeUser> {
    const where: Record<string, unknown> = { id };
    if (tenantId) {
        where.tenantId = tenantId;
    }

    const user = await prisma.user.findFirst({
        where,
        include: { tenant: { select: { id: true, name: true } } },
    });

    if (!user) {
        throw new NotFoundError('User');
    }

    return omit(user, ['passwordHash', 'mfaSecret']) as SafeUser;
}

/**
 * Create new user (admin)
 */
export async function createUser(
    data: {
        email: string;
        password: string;
        name: string;
        role?: UserRole;
        phone?: string;
        tenantId?: string;
    },
    creatingUserId: string,
    defaultTenantId: string
): Promise<SafeUser> {
    const normalizedEmail = data.email.toLowerCase();

    // Check if exists
    const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existing) {
        throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            id: generateId(),
            email: normalizedEmail,
            passwordHash,
            name: data.name,
            phone: data.phone,
            role: data.role || 'viewer',
            tenantId: data.tenantId || defaultTenantId,
            permissions: "[]",
        },
        include: { tenant: { select: { id: true, name: true } } },
    });

    logAudit('CREATE', 'User', user.id, creatingUserId, { email: normalizedEmail, role: user.role });

    return omit(user, ['passwordHash', 'mfaSecret']) as SafeUser;
}

/**
 * Update user
 */
export async function updateUser(
    id: string,
    data: {
        name?: string;
        phone?: string;
        avatar?: string | null;
        role?: UserRole;
        isActive?: boolean;
    },
    updatingUserId: string,
    updaterRole: string,
    tenantId?: string
): Promise<SafeUser> {
    const where: Record<string, unknown> = { id };
    if (tenantId) {
        where.tenantId = tenantId;
    }

    const existing = await prisma.user.findFirst({ where });

    if (!existing) {
        throw new NotFoundError('User');
    }


    // Privilege Escalation Check: Only super_admin can grant super_admin role
    if (data.role === 'super_admin' && updaterRole !== 'super_admin') {
        throw new ForbiddenError('Only Super Admins can promote users to Super Admin');
    }

    const user = await prisma.user.update({
        where: { id },
        data,
        include: { tenant: { select: { id: true, name: true } } },
    });

    logAudit('UPDATE', 'User', id, updatingUserId, { changes: data });

    return omit(user, ['passwordHash', 'mfaSecret']) as SafeUser;
}

/**
 * Delete user
 */
export async function deleteUser(
    id: string,
    deletingUserId: string,
    tenantId?: string
): Promise<void> {
    const where: Record<string, unknown> = { id };
    if (tenantId) {
        where.tenantId = tenantId;
    }

    const user = await prisma.user.findFirst({ where });

    if (!user) {
        throw new NotFoundError('User');
    }

    // Soft delete - deactivate instead of hard delete
    await prisma.user.update({
        where: { id },
        data: { isActive: false },
    });

    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
        where: { userId: id },
        data: { revokedAt: new Date() },
    });

    logAudit('DELETE', 'User', id, deletingUserId);
}

/**
 * Update user profile (self)
 */
export async function updateProfile(
    userId: string,
    data: {
        name?: string;
        phone?: string;
        avatar?: string | null;
    }
): Promise<SafeUser> {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
        include: { tenant: { select: { id: true, name: true } } },
    });

    logAudit('UPDATE_PROFILE', 'User', userId, userId);

    return omit(user, ['passwordHash', 'mfaSecret']) as SafeUser;
}
