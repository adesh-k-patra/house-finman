
/**
 * Survey Routes
 * Handles survey creation, updates, and response submission
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../models/prisma.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requirePermission } from '../middlewares/rbacMiddleware.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';
import { generateId, parsePagination } from '../utils/index.js';
import { logAudit } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
import {
    createSurveySchema,
    updateSurveySchema,
    surveyResponseSchema,
    idParamSchema,
    paginationSchema,
} from '../schemas/index.js';
import { surveyService } from '../services/surveyService.js';
import { templateService } from '../services/templateService.js';
import { followUpService } from '../services/followUpService.js';
import { insightService } from '../services/insightService.js';

export const surveyRoutes = Router();

// ==========================================
// PUBLIC / RESPONDENT ROUTES (No Auth if anonymous)
// ==========================================
// Note: In a real app, you might use a separate Signed URL or simplified auth for respondents
// For now, we allow submission to /:id/responses if survey is active

surveyRoutes.post('/:id/responses', validateParams(idParamSchema), validateBody(surveyResponseSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const response = await surveyService.processResponse(req.params.id, req.body, {
            email: req.body.respondentEmail,
            phone: req.body.respondentPhone,
            ip: req.ip
        });

        return sendCreated(res, { id: response.id, message: 'Response submitted successfully' });
    })
);


// ==========================================
// ADMIN / USER ROUTES (Authenticated)
// ==========================================

surveyRoutes.use(authenticate);

surveyRoutes.get('/', requirePermission('surveys:read'), validateQuery(paginationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const where: Record<string, unknown> = { tenantId: req.user!.tenantId };

        if (req.query.status) where.status = req.query.status;
        if (req.query.type) where.type = req.query.type;
        if (req.query.search) {
            where.title = { contains: req.query.search as string };
        }

        const [total, data] = await Promise.all([
            prisma.survey.count({ where }),
            prisma.survey.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    campaign: { select: { id: true, name: true } }
                }
            })
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

surveyRoutes.get('/:id', requirePermission('surveys:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.survey.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
            include: {
                questions: { orderBy: { order: 'asc' } },
                campaign: { select: { id: true, name: true } },
                responses: {
                    take: 5,
                    orderBy: { startedAt: 'desc' },
                    include: { answers: true }
                }
            }
        });
        if (!item) throw new NotFoundError('Survey');
        return sendSuccess(res, item);
    })
);

surveyRoutes.post('/', requirePermission('surveys:create'), validateBody(createSurveySchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { questions, ...surveyData } = req.body;
        const surveyId = generateId();

        const item = await prisma.survey.create({
            data: {
                id: surveyId,
                ...surveyData,
                tenantId: req.user!.tenantId,
                createdById: req.user!.id,
                questions: {
                    create: questions.map((q: any) => ({
                        id: generateId(),
                        ...q,
                        // Basic Input Sanitization against Stored XSS
                        text: q.text.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").replace(/javascript:/gim, ""),
                        options: Array.isArray(q.options)
                            ? q.options.map((opt: string) => opt.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").replace(/javascript:/gim, ""))
                            : q.options
                    }))
                }
            },
            include: { questions: true }
        });

        logAudit('CREATE', 'Survey', item.id, req.user!.id);
        return sendCreated(res, item);
    })
);

surveyRoutes.put('/:id', requirePermission('surveys:update'), validateParams(idParamSchema), validateBody(updateSurveySchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { questions, ...surveyData } = req.body;

        const existing = await prisma.survey.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId }
        });
        if (!existing) throw new NotFoundError('Survey');

        // Transaction to handle updates + question changes
        const item = await prisma.$transaction(async (tx) => {
            // Update basic details
            const updated = await tx.survey.update({
                where: { id: req.params.id },
                data: surveyData
            });

            // Handle questions if provided
            if (questions) {
                // Determine which to create vs update
                for (const q of questions) {
                    if (q.id) {
                        await tx.surveyQuestion.update({
                            where: { id: q.id },
                            data: {
                                text: q.text,
                                type: q.type,
                                order: q.order,
                                isRequired: q.isRequired,
                                options: q.options,
                                logic: q.logic
                            }
                        });
                    } else {
                        await tx.surveyQuestion.create({
                            data: {
                                id: generateId(),
                                surveyId: req.params.id,
                                text: q.text,
                                type: q.type,
                                order: q.order,
                                isRequired: q.isRequired || true,
                                options: q.options || "[]",
                                logic: q.logic || "{}"
                            }
                        });
                    }
                }
            }

            return updated;
        });

        logAudit('UPDATE', 'Survey', item.id, req.user!.id);
        return sendSuccess(res, item);
    })
);

surveyRoutes.delete('/:id', requirePermission('surveys:delete'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.survey.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId }
        });
        if (!existing) throw new NotFoundError('Survey');

        await prisma.survey.delete({ where: { id: req.params.id } });
        logAudit('DELETE', 'Survey', req.params.id, req.user!.id);
        return sendNoContent(res);
    })
);

// Analytics Endpoint
surveyRoutes.get('/:id/stats', requirePermission('surveys:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.survey.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId }
        });
        if (!existing) throw new NotFoundError('Survey');

        const [totalResponses, completedResponses] = await Promise.all([
            prisma.surveyResponse.count({ where: { surveyId: req.params.id } }),
            prisma.surveyResponse.count({ where: { surveyId: req.params.id, status: 'completed' } })
        ]);

        return sendSuccess(res, {
            totalResponses,
            completedResponses,
            completionRate: totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0
        });
    })
);

// ==========================================
// TEMPLATE ROUTES
// ==========================================

surveyRoutes.get('/templates/list', requirePermission('surveys:read'),
    asyncHandler(async (req: Request, res: Response) => {
        const templates = await templateService.findAll(req.user);
        return sendSuccess(res, templates);
    })
);

surveyRoutes.post('/templates', requirePermission('surveys:create'),
    asyncHandler(async (req: Request, res: Response) => {
        const template = await templateService.create(req.body, req.user);
        return sendCreated(res, template);
    })
);

surveyRoutes.post('/:id/template', requirePermission('surveys:create'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const template = await templateService.saveSurveyAsTemplate(req.params.id, req.body, req.user);
        return sendCreated(res, template);
    })
);

surveyRoutes.post('/:id/apply-template', requirePermission('surveys:update'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { templateId } = req.body;
        const result = await templateService.applyTemplate(req.params.id, templateId);
        return sendSuccess(res, result);
    })
);

// ==========================================
// FOLLOW-UP ROUTES
// ==========================================

surveyRoutes.get('/:id/follow-up', requirePermission('surveys:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const sequence = await followUpService.getSequence(req.params.id);
        return sendSuccess(res, sequence);
    })
);

surveyRoutes.put('/:id/follow-up', requirePermission('surveys:update'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { isActive, steps } = req.body;
        const sequence = await followUpService.upsertSequence(req.params.id, isActive, steps);
        return sendSuccess(res, sequence);
    })
);

// ==========================================
// UTILITY ROUTES (Duplicate, Export)
// ==========================================

surveyRoutes.post('/:id/duplicate', requirePermission('surveys:create'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const newItem = await surveyService.duplicateSurvey(req.params.id, req.user!.id);
        return sendCreated(res, newItem);
    })
);

surveyRoutes.get('/:id/export', requirePermission('surveys:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const format = req.query.format === 'json' ? 'json' : 'csv';
        const data = await surveyService.exportResponses(req.params.id, format as any);

        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=survey-${req.params.id}.csv`);
            return res.send(data);
        }

        return sendSuccess(res, data);
    })
);

surveyRoutes.get('/:id/insights', requirePermission('surveys:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const insights = await insightService.generateInsights(req.params.id);
        return sendSuccess(res, insights);
    })
);

export default surveyRoutes;
