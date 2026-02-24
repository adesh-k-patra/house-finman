/**
 * Additional Routes for Partners, Vendors, Properties, Tickets, Opportunities, Campaigns
 * Using generic controller pattern for remaining entities
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../models/prisma.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requirePermission, requireOwnership } from '../middlewares/rbacMiddleware.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';
import { generateId, parsePagination, generateTicketNumber, generatePONumber, generateInvoiceNumber } from '../utils/index.js';
import { logAudit } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
import {
    createOpportunitySchema,
    updateOpportunitySchema,
    createPartnerSchema,
    updatePartnerSchema,
    createVendorSchema,
    updateVendorSchema,
    createPropertySchema,
    updatePropertySchema,
    createTicketSchema,
    updateTicketSchema,
    ticketMessageSchema,
    createCampaignSchema,
    updateCampaignSchema,
    idParamSchema,
    paginationSchema,
} from '../schemas/index.js';

// ==========================================
// OPPORTUNITIES ROUTES
// ==========================================

export const opportunitiesRouter = Router();
opportunitiesRouter.use(authenticate);

opportunitiesRouter.get('/', requirePermission('opportunities:read'), validateQuery(paginationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
        if (req.query.stage) where.stage = req.query.stage;

        const [total, data] = await Promise.all([
            prisma.opportunity.count({ where }),
            prisma.opportunity.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    lead: { select: { id: true, firstName: true, lastName: true, phone: true } },
                    property: { select: { id: true, name: true } },
                },
            }),
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

opportunitiesRouter.get('/:id', requirePermission('opportunities:read'), validateParams(idParamSchema), requireOwnership(prisma.opportunity, 'userId'),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.opportunity.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
            include: {
                lead: true,
                property: true,
            },
        });
        if (!item) throw new NotFoundError('Opportunity');
        return sendSuccess(res, item);
    })
);

opportunitiesRouter.post('/', requirePermission('opportunities:create'), validateBody(createOpportunitySchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.opportunity.create({
            data: {
                id: generateId(),
                ...req.body,
                tenantId: req.user!.tenantId,
            },
        });
        logAudit('CREATE', 'Opportunity', item.id, req.user!.id);
        return sendCreated(res, item);
    })
);

opportunitiesRouter.put('/:id', requirePermission('opportunities:update'), validateParams(idParamSchema), validateBody(updateOpportunitySchema), requireOwnership(prisma.opportunity, 'userId'),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.opportunity.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Opportunity');

        const item = await prisma.opportunity.update({
            where: { id: req.params.id },
            data: req.body,
        });
        logAudit('UPDATE', 'Opportunity', item.id, req.user!.id);
        return sendSuccess(res, item);
    })
);

opportunitiesRouter.delete('/:id', requirePermission('opportunities:delete'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.opportunity.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Opportunity');

        await prisma.opportunity.delete({ where: { id: req.params.id } });
        logAudit('DELETE', 'Opportunity', req.params.id, req.user!.id);
        return sendNoContent(res);
    })
);

// ==========================================
// PARTNERS ROUTES
// ==========================================

export const partnersRouter = Router();
partnersRouter.use(authenticate);

partnersRouter.get('/', requirePermission('partners:read'), validateQuery(paginationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
        if (req.query.status) where.status = req.query.status;
        if (req.query.type) where.type = req.query.type;
        if (req.query.search) {
            where.OR = [
                { name: { contains: req.query.search } },
                { email: { contains: req.query.search } },
            ];
        }

        const [total, data] = await Promise.all([
            prisma.partner.count({ where }),
            prisma.partner.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

partnersRouter.get('/:id', requirePermission('partners:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.partner.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
            include: { contracts: true, commissions: { take: 10, orderBy: { createdAt: 'desc' } } },
        });
        if (!item) throw new NotFoundError('Partner');
        return sendSuccess(res, item);
    })
);

partnersRouter.post('/', requirePermission('partners:create'), validateBody(createPartnerSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.partner.create({
            data: { id: generateId(), ...req.body, tenantId: req.user!.tenantId },
        });
        logAudit('CREATE', 'Partner', item.id, req.user!.id);
        return sendCreated(res, item);
    })
);

partnersRouter.put('/:id', requirePermission('partners:update'), validateParams(idParamSchema), validateBody(updatePartnerSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.partner.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Partner');

        const item = await prisma.partner.update({ where: { id: req.params.id }, data: req.body });
        logAudit('UPDATE', 'Partner', item.id, req.user!.id);
        return sendSuccess(res, item);
    })
);

partnersRouter.delete('/:id', requirePermission('partners:delete'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.partner.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Partner');

        await prisma.partner.delete({ where: { id: req.params.id } });
        logAudit('DELETE', 'Partner', req.params.id, req.user!.id);
        return sendNoContent(res);
    })
);

// ==========================================
// VENDORS ROUTES
// ==========================================

export const vendorsRouter = Router();
vendorsRouter.use(authenticate);

vendorsRouter.get('/', requirePermission('vendors:read'), validateQuery(paginationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
        if (req.query.status) where.status = req.query.status;

        const [total, data] = await Promise.all([
            prisma.vendor.count({ where }),
            prisma.vendor.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

vendorsRouter.get('/:id', requirePermission('vendors:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.vendor.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
            include: {
                purchaseOrders: { take: 10, orderBy: { createdAt: 'desc' } },
                invoices: { take: 10, orderBy: { createdAt: 'desc' } },
            },
        });
        if (!item) throw new NotFoundError('Vendor');
        return sendSuccess(res, item);
    })
);

vendorsRouter.post('/', requirePermission('vendors:create'), validateBody(createVendorSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.vendor.create({
            data: { id: generateId(), ...req.body, tenantId: req.user!.tenantId },
        });
        logAudit('CREATE', 'Vendor', item.id, req.user!.id);
        return sendCreated(res, item);
    })
);

vendorsRouter.put('/:id', requirePermission('vendors:update'), validateParams(idParamSchema), validateBody(updateVendorSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.vendor.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Vendor');

        const item = await prisma.vendor.update({ where: { id: req.params.id }, data: req.body });
        logAudit('UPDATE', 'Vendor', item.id, req.user!.id);
        return sendSuccess(res, item);
    })
);

vendorsRouter.delete('/:id', requirePermission('vendors:delete'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.vendor.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Vendor');

        await prisma.vendor.delete({ where: { id: req.params.id } });
        logAudit('DELETE', 'Vendor', req.params.id, req.user!.id);
        return sendNoContent(res);
    })
);

// Purchase Orders
vendorsRouter.get('/:id/purchase-orders', requirePermission('purchase-orders:read'),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const [total, data] = await Promise.all([
            prisma.purchaseOrder.count({ where: { vendorId: req.params.id } }),
            prisma.purchaseOrder.findMany({ where: { vendorId: req.params.id }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

vendorsRouter.post('/:id/purchase-orders', requirePermission('purchase-orders:create'),
    asyncHandler(async (req: Request, res: Response) => {
        const po = await prisma.purchaseOrder.create({
            data: {
                id: generateId(),
                poNumber: generatePONumber(),
                vendorId: req.params.id,
                ...req.body,
            },
        });
        logAudit('CREATE', 'PurchaseOrder', po.id, req.user!.id);
        return sendCreated(res, po);
    })
);

// ==========================================
// PROPERTIES ROUTES
// ==========================================

export const propertiesRouter = Router();
propertiesRouter.use(authenticate);

propertiesRouter.get('/', requirePermission('properties:read'), validateQuery(paginationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
        if (req.query.status) where.status = req.query.status;
        if (req.query.type) where.type = req.query.type;
        if (req.query.city) where.city = req.query.city;

        const [total, data] = await Promise.all([
            prisma.property.count({ where }),
            prisma.property.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

propertiesRouter.get('/:id', requirePermission('properties:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.property.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!item) throw new NotFoundError('Property');
        return sendSuccess(res, item);
    })
);

propertiesRouter.post('/', requirePermission('properties:create'), validateBody(createPropertySchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.property.create({
            data: { id: generateId(), ...req.body, tenantId: req.user!.tenantId },
        });
        logAudit('CREATE', 'Property', item.id, req.user!.id);
        return sendCreated(res, item);
    })
);

propertiesRouter.put('/:id', requirePermission('properties:update'), validateParams(idParamSchema), validateBody(updatePropertySchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.property.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Property');

        const item = await prisma.property.update({ where: { id: req.params.id }, data: req.body });
        logAudit('UPDATE', 'Property', item.id, req.user!.id);
        return sendSuccess(res, item);
    })
);

propertiesRouter.delete('/:id', requirePermission('properties:delete'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.property.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Property');

        await prisma.property.delete({ where: { id: req.params.id } });
        logAudit('DELETE', 'Property', req.params.id, req.user!.id);
        return sendNoContent(res);
    })
);

// ==========================================
// TICKETS ROUTES
// ==========================================

export const ticketsRouter = Router();
ticketsRouter.use(authenticate);

ticketsRouter.get('/', requirePermission('tickets:read'), validateQuery(paginationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
        if (req.query.status) where.status = req.query.status;
        if (req.query.priority) where.priority = req.query.priority;
        if (req.query.assignedToId) where.assignedToId = req.query.assignedToId;

        const [total, data] = await Promise.all([
            prisma.ticket.count({ where }),
            prisma.ticket.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    assignedTo: { select: { id: true, name: true } },
                    createdBy: { select: { id: true, name: true } },
                },
            }),
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

ticketsRouter.get('/:id', requirePermission('tickets:read'), validateParams(idParamSchema), requireOwnership(prisma.ticket, 'assignedToId'),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.ticket.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true, email: true } },
                messages: { orderBy: { createdAt: 'asc' } },
            },
        });
        if (!item) throw new NotFoundError('Ticket');
        return sendSuccess(res, item);
    })
);

ticketsRouter.post('/', requirePermission('tickets:create'), validateBody(createTicketSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.ticket.create({
            data: {
                id: generateId(),
                ticketNumber: generateTicketNumber(),
                ...req.body,
                createdById: req.user!.id,
                tenantId: req.user!.tenantId,
            },
        });
        logAudit('CREATE', 'Ticket', item.id, req.user!.id);
        return sendCreated(res, item);
    })
);

ticketsRouter.put('/:id', requirePermission('tickets:update'), validateParams(idParamSchema), validateBody(updateTicketSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.ticket.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Ticket');

        const updateData: Record<string, unknown> = { ...req.body };
        if (req.body.status === 'resolved') updateData.resolvedAt = new Date();
        if (req.body.status === 'closed') updateData.closedAt = new Date();

        const item = await prisma.ticket.update({ where: { id: req.params.id }, data: updateData });
        logAudit('UPDATE', 'Ticket', item.id, req.user!.id);
        return sendSuccess(res, item);
    })
);

ticketsRouter.post('/:id/messages', requirePermission('tickets:update'), validateParams(idParamSchema), validateBody(ticketMessageSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const ticket = await prisma.ticket.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!ticket) throw new NotFoundError('Ticket');

        const message = await prisma.ticketMessage.create({
            data: {
                id: generateId(),
                ticketId: req.params.id,
                content: req.body.content,
                isInternal: req.body.isInternal || false,
            },
        });
        return sendCreated(res, message);
    })
);

// ==========================================
// CAMPAIGNS ROUTES
// ==========================================

export const campaignsRouter = Router();
campaignsRouter.use(authenticate);

campaignsRouter.get('/', requirePermission('campaigns:read'), validateQuery(paginationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
        if (req.query.status) where.status = req.query.status;
        if (req.query.type) where.type = req.query.type;

        const [total, data] = await Promise.all([
            prisma.campaign.count({ where }),
            prisma.campaign.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

campaignsRouter.get('/:id', requirePermission('campaigns:read'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.campaign.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
            include: { leads: { select: { id: true, firstName: true, lastName: true, status: true } } },
        });
        if (!item) throw new NotFoundError('Campaign');
        return sendSuccess(res, item);
    })
);

campaignsRouter.post('/', requirePermission('campaigns:create'), validateBody(createCampaignSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.campaign.create({
            data: { id: generateId(), ...req.body, tenantId: req.user!.tenantId },
        });
        logAudit('CREATE', 'Campaign', item.id, req.user!.id);
        return sendCreated(res, item);
    })
);

campaignsRouter.put('/:id', requirePermission('campaigns:update'), validateParams(idParamSchema), validateBody(updateCampaignSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.campaign.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Campaign');

        const item = await prisma.campaign.update({ where: { id: req.params.id }, data: req.body });
        logAudit('UPDATE', 'Campaign', item.id, req.user!.id);
        return sendSuccess(res, item);
    })
);

campaignsRouter.delete('/:id', requirePermission('campaigns:delete'), validateParams(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.campaign.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Campaign');

        await prisma.campaign.delete({ where: { id: req.params.id } });
        logAudit('DELETE', 'Campaign', req.params.id, req.user!.id);
        return sendNoContent(res);
    })
);
