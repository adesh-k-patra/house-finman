/**
 * User Controller
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import * as userService from '../services/userService.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';
import { parsePagination } from '../utils/index.js';

/**
 * GET /api/v1/users
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query.page as string, req.query.limit as string);
    const filters = {
        role: req.query.role as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        search: req.query.search as string,
    };

    const isSuperAdmin = req.user!.role === 'super_admin';
    const result = await userService.getUsers(
        req.user!.tenantId,
        pagination,
        filters,
        isSuperAdmin
    );

    return sendPaginated(res, result.data, result.meta.page, result.meta.limit, result.meta.total);
});

/**
 * GET /api/v1/users/:id
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user!.role === 'super_admin' ? undefined : req.user!.tenantId;
    const user = await userService.getUserById(req.params.id, tenantId);
    return sendSuccess(res, user);
});

/**
 * POST /api/v1/users
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser(
        req.body,
        req.user!.id,
        req.user!.tenantId
    );
    return sendCreated(res, user);
});

/**
 * PUT /api/v1/users/:id
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user!.role === 'super_admin' ? undefined : req.user!.tenantId;
    const user = await userService.updateUser(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role,
        tenantId
    );
    return sendSuccess(res, user);
});

/**
 * DELETE /api/v1/users/:id
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user!.role === 'super_admin' ? undefined : req.user!.tenantId;
    await userService.deleteUser(req.params.id, req.user!.id, tenantId);
    return sendNoContent(res);
});

/**
 * GET /api/v1/users/profile
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.user!.id);
    return sendSuccess(res, user);
});

/**
 * PUT /api/v1/users/profile
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.id, req.body);
    return sendSuccess(res, user);
});
