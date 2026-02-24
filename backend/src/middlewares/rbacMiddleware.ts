/**
 * Role-Based Access Control (RBAC) Middleware
 * Server-side authorization enforcement
 */

import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { UserRole } from '../types/index.js';
import { logSecurityEvent } from '../utils/logger.js';

/**
 * Role hierarchy - higher roles inherit lower role permissions
 */
const roleHierarchy: Record<UserRole, number> = {
    super_admin: 100,
    tenant_admin: 90,
    finance: 50,
    vendor_manager: 50,
    partner_admin: 50,
    cx: 40,
    agent: 30,
    mentor: 30,
    viewer: 10,
};

/**
 * Resource permissions by role
 */
const rolePermissions: Record<UserRole, string[]> = {
    super_admin: ['*'], // All permissions

    tenant_admin: [
        'users:read', 'users:create', 'users:update',
        'leads:*', 'opportunities:*', 'partners:*', 'vendors:*',
        'properties:*', 'tickets:*', 'campaigns:*',
        'surveys:*', 'templates:*', 'imports:*', // Detailed permissions for new features
        'analytics:read', 'settings:read', 'settings:update',
    ],

    finance: [
        'leads:read', 'opportunities:read',
        'partners:read', 'commissions:*',
        'vendors:*', 'invoices:*', 'payments:*',
        'finance:*', 'analytics:read',
    ],

    vendor_manager: [
        'vendors:*', 'purchase-orders:*', 'invoices:*',
        'leads:read', 'properties:read',
    ],

    partner_admin: [
        'partners:read', 'partners:update',
        'leads:read', 'leads:create',
        'commissions:read',
    ],

    cx: [
        'tickets:*', 'knowledge-base:*',
        'leads:read', 'partners:read',
        'users:read',
    ],

    agent: [
        'leads:*', 'opportunities:*',
        'properties:read',
        'partners:read',
        'campaigns:read',
        'surveys:read', 'surveys:create', 'surveys:update', // Agents can manage their surveys
        'templates:read',
    ],

    mentor: [
        'mentors:*', 'sessions:*',
        'partners:read',
        'leads:read',
    ],

    viewer: [
        'leads:read', 'opportunities:read',
        'partners:read', 'properties:read',
        'analytics:read',
        'surveys:read', 'templates:read', // Viewers can see surveys
    ],
};

/**
 * Check if role has permission
 */
function hasPermission(role: UserRole, permission: string): boolean {
    const permissions = rolePermissions[role];

    // Check for wildcard
    if (permissions.includes('*')) {
        return true;
    }

    // Check for exact match
    if (permissions.includes(permission)) {
        return true;
    }

    // Check for resource wildcard (e.g., 'leads:*' matches 'leads:create')
    const [resource] = permission.split(':');
    if (permissions.includes(`${resource}:*`)) {
        return true;
    }

    return false;
}

/**
 * Require specific roles
 */
export function requireRoles(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        const userRole = req.user.role;

        // Super admin always has access
        if (userRole === 'super_admin') {
            return next();
        }

        // Check if user's role is in allowed list
        if (!allowedRoles.includes(userRole)) {
            logSecurityEvent('RBAC_DENIED', req.user.id, {
                required: allowedRoles,
                actual: userRole,
                path: req.path,
                method: req.method,
            });

            return next(new ForbiddenError('Insufficient permissions'));
        }

        next();
    };
}

/**
 * Require minimum role level
 */
export function requireMinRole(minRole: UserRole) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        const userRoleLevel = roleHierarchy[req.user.role];
        const requiredLevel = roleHierarchy[minRole];

        if (userRoleLevel < requiredLevel) {
            logSecurityEvent('RBAC_LEVEL_DENIED', req.user.id, {
                requiredLevel: minRole,
                actualLevel: req.user.role,
                path: req.path,
            });

            return next(new ForbiddenError('Insufficient role level'));
        }

        next();
    };
}

/**
 * Require specific permission
 */
export function requirePermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        if (!hasPermission(req.user.role, permission)) {
            logSecurityEvent('PERMISSION_DENIED', req.user.id, {
                required: permission,
                role: req.user.role,
                path: req.path,
            });

            return next(new ForbiddenError(`Permission '${permission}' required`));
        }

        next();
    };
}

/**
 * Require any of the specified permissions
 */
export function requireAnyPermission(...permissions: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        const hasAny = permissions.some(p => hasPermission(req.user!.role, p));

        if (!hasAny) {
            logSecurityEvent('PERMISSION_DENIED', req.user.id, {
                required: permissions,
                role: req.user.role,
                path: req.path,
            });

            return next(new ForbiddenError('Insufficient permissions'));
        }

        next();
    };
}

/**
 * Require tenant match (multi-tenancy enforcement)
 */
export function requireTenantMatch(tenantIdParam: string = 'tenantId') {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        // Super admin can access any tenant
        if (req.user.role === 'super_admin') {
            return next();
        }

        const requestedTenantId = req.params[tenantIdParam] || req.body?.[tenantIdParam] || req.query[tenantIdParam];

        if (requestedTenantId && requestedTenantId !== req.user.tenantId) {
            logSecurityEvent('TENANT_MISMATCH', req.user.id, {
                userTenant: req.user.tenantId,
                requestedTenant: requestedTenantId,
                path: req.path,
            });

            return next(new ForbiddenError('Access denied to this tenant'));
        }

        next();
    };
}

/**
 * Admin only middleware
 */
export const adminOnly = requireRoles('super_admin', 'tenant_admin');

/**
 * Super admin only middleware
 */
export const superAdminOnly = requireRoles('super_admin');

/**
 * Require Ownership
 * Ensures the requesting user owns the resource or has overrides
 */
export function requireOwnership(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resourceModel: any,
    ownerField: string = 'userId',
    resourceIdParam: string = 'id'
) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        // Super admin override
        if (req.user.role === 'super_admin') {
            return next();
        }

        const resourceId = req.params[resourceIdParam];
        if (!resourceId) {
            // If ID is missing from params, scan body/query
            return next(new ForbiddenError('Missing resource ID'));
        }

        try {
            // Dynamic Prisma lookup
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const resource = await resourceModel.findUnique({
                where: { id: resourceId },
                select: { [ownerField]: true, tenantId: true }
            });

            if (!resource) {
                // Return 404 to avoid leaking existence
                return next(new ForbiddenError('Resource not found or access denied'));
            }

            // Check Tenant Match
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (resource.tenantId && resource.tenantId !== req.user.tenantId) {
                logSecurityEvent('TENANT_MISMATCH_OWNERSHIP', req.user.id, {
                    resourceId,
                    userTenant: req.user.tenantId
                });
                return next(new ForbiddenError('Access denied'));
            }

            // Check Ownership
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (resource[ownerField] !== req.user.id) {
                // Allow Tenant Admins to view all resources in their tenant
                if (req.user.role === 'tenant_admin') {
                    return next();
                }

                logSecurityEvent('OWNERSHIP_DENIED', req.user.id, {
                    resourceId,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    owner: resource[ownerField]
                });
                return next(new ForbiddenError('You do not have permission to access this resource'));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
