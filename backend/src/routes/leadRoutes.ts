/**
 * Lead Routes
 */

import { Router } from 'express';
import * as leadController from '../controllers/leadController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requirePermission, requireOwnership } from '../middlewares/rbacMiddleware.js';
import { prisma } from '../models/prisma.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateMiddleware.js';
import {
    createLeadSchema,
    updateLeadSchema,
    leadNoteSchema,
    idParamSchema,
    paginationSchema,
} from '../schemas/index.js';
import { importService } from '../services/importService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// List leads
router.get(
    '/',
    requirePermission('leads:read'),
    validateQuery(paginationSchema),
    leadController.getLeads
);

// Get single lead
router.get(
    '/:id',
    requirePermission('leads:read'),
    validateParams(idParamSchema),
    requireOwnership(prisma.lead, 'assignedToId'),
    leadController.getLeadById
);

// Create lead
router.post(
    '/',
    requirePermission('leads:create'),
    validateBody(createLeadSchema),
    leadController.createLead
);

// Update lead
router.put(
    '/:id',
    requirePermission('leads:update'),
    validateParams(idParamSchema),
    validateBody(updateLeadSchema),
    requireOwnership(prisma.lead, 'assignedToId'),
    leadController.updateLead
);

// Delete lead
router.delete(
    '/:id',
    requirePermission('leads:delete'),
    validateParams(idParamSchema),
    requireOwnership(prisma.lead, 'assignedToId'),
    leadController.deleteLead
);

// Add note to lead
router.post(
    '/:id/notes',
    requirePermission('leads:update'),
    validateParams(idParamSchema),
    validateBody(leadNoteSchema),
    requireOwnership(prisma.lead, 'assignedToId'),
    leadController.addNote
);

// Convert lead to opportunity
router.post(
    '/:id/convert',
    requirePermission('leads:update'),
    validateParams(idParamSchema),
    requireOwnership(prisma.lead, 'assignedToId'),
    leadController.convertLead
);

// Import leads from CSV
router.post(
    '/import',
    requirePermission('imports:create'),
    asyncHandler(async (req, res) => {
        const { csvData } = req.body;
        if (!csvData) {
            return res.status(400).json({ success: false, error: 'csvData is required' });
        }
        const results = await importService.importLeads(csvData, req.user);
        return sendSuccess(res, results);
    })
);

export default router;
