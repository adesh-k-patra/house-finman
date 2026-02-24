/**
 * Authentication Routes
 */

import { Router } from 'express';
import {
    login,
    register,
    refresh,
    logout,
    getMe,
    changePasswordHandler,
} from '../controllers/authController.js';
import { authenticate, optionalAuth } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimitMiddleware.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import {
    loginSchema,
    registerSchema,
    changePasswordSchema,
} from '../schemas/index.js';

const router = Router();

// Public routes (with rate limiting)
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/refresh', optionalAuth, refresh);

// Protected routes
router.post('/logout', optionalAuth, logout);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, validateBody(changePasswordSchema), changePasswordHandler);

export default router;
