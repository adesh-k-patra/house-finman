/**
 * Dashboard Controller
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import * as analyticsService from '../services/analyticsService.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/v1/dashboard
 */
export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const stats = await analyticsService.getDashboardStats(req.user!.tenantId);
    return sendSuccess(res, stats);
});

/**
 * GET /api/v1/analytics/leads
 */
export const getLeadAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const data = await analyticsService.getLeadAnalytics(req.user!.tenantId, days);
    return sendSuccess(res, data);
});

/**
 * GET /api/v1/analytics/revenue
 */
export const getRevenueAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getRevenueAnalytics(req.user!.tenantId);
    return sendSuccess(res, data);
});

/**
 * GET /api/v1/analytics/performance
 */
export const getPerformanceAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getPerformanceAnalytics(req.user!.tenantId);
    return sendSuccess(res, data);
});

/**
 * GET /api/v1/dashboard/kpis
 */
export const getExecutiveKPIs = asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getExecutiveKPIs(req.user!.tenantId);
    return sendSuccess(res, data);
});
