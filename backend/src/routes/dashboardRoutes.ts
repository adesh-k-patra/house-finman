/**
 * Dashboard & Analytics Routes
 */

import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requirePermission } from '../middlewares/rbacMiddleware.js';

const router = Router();

router.use(authenticate);

// Dashboard (all authenticated users)
router.get('/', requirePermission('analytics:read'), dashboardController.getDashboard);
router.get('/kpis', requirePermission('analytics:read'), dashboardController.getExecutiveKPIs);

export default router;

// Analytics routes (separate router)
export const analyticsRouter = Router();

analyticsRouter.use(authenticate);
analyticsRouter.use(requirePermission('analytics:read'));

analyticsRouter.get('/leads', dashboardController.getLeadAnalytics);
analyticsRouter.get('/revenue', dashboardController.getRevenueAnalytics);
analyticsRouter.get('/performance', dashboardController.getPerformanceAnalytics);
