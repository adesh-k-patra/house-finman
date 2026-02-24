/**
 * Lead Controller
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import * as leadService from '../services/leadService.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';
import { parsePagination } from '../utils/index.js';

/**
 * GET /api/v1/leads
 */
export const getLeads = asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query.page as string, req.query.limit as string);
    const filters = {
        status: req.query.status as string,
        source: req.query.source as string,
        assignedToId: req.query.assignedToId as string,
        search: req.query.search as string,
    };

    const result = await leadService.getLeads(req.user!.tenantId, pagination, filters);

    return sendPaginated(res, result.data, result.meta.page, result.meta.limit, result.meta.total);
});

/**
 * GET /api/v1/leads/:id
 */
export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadService.getLeadById(req.params.id, req.user!.tenantId);
    return sendSuccess(res, lead);
});

/**
 * POST /api/v1/leads
 */
export const createLead = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadService.createLead(req.body, req.user!.tenantId, req.user!.id);
    return sendCreated(res, lead);
});

/**
 * PUT /api/v1/leads/:id
 */
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadService.updateLead(
        req.params.id,
        req.user!.tenantId,
        req.body,
        req.user!.id
    );
    return sendSuccess(res, lead);
});

/**
 * DELETE /api/v1/leads/:id
 */
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
    await leadService.deleteLead(req.params.id, req.user!.tenantId, req.user!.id);
    return sendNoContent(res);
});

/**
 * POST /api/v1/leads/:id/notes
 */
export const addNote = asyncHandler(async (req: Request, res: Response) => {
    await leadService.addLeadNote(req.params.id, req.body.content, req.user!.tenantId);
    return sendSuccess(res, { message: 'Note added' });
});

/**
 * POST /api/v1/leads/:id/convert
 */
export const convertLead = asyncHandler(async (req: Request, res: Response) => {
    await leadService.convertLead(
        req.params.id,
        req.user!.tenantId,
        req.body,
        req.user!.id
    );
    return sendSuccess(res, { message: 'Lead converted to opportunity' });
});
