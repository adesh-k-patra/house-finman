/**
 * User Routes
 */

import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { adminOnly, requirePermission } from '../middlewares/rbacMiddleware.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateMiddleware.js';
import {
    createUserSchema,
    updateUserSchema,
    updateProfileSchema,
    idParamSchema,
    paginationSchema,
} from '../schemas/index.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes (any authenticated user)
router.get('/profile', userController.getProfile);
router.put('/profile', validateBody(updateProfileSchema), userController.updateProfile);

// Admin routes
router.get(
    '/',
    adminOnly,
    validateQuery(paginationSchema),
    userController.getUsers
);

router.get(
    '/:id',
    adminOnly,
    validateParams(idParamSchema),
    userController.getUserById
);

router.post(
    '/',
    adminOnly,
    validateBody(createUserSchema),
    userController.createUser
);

router.put(
    '/:id',
    adminOnly,
    validateParams(idParamSchema),
    validateBody(updateUserSchema),
    userController.updateUser
);

router.delete(
    '/:id',
    adminOnly,
    validateParams(idParamSchema),
    userController.deleteUser
);

export default router;
