import { Router, Request, Response } from 'express';
import { prisma } from '../models/prisma.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requirePermission, requireOwnership } from '../middlewares/rbacMiddleware.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';
import { generateId, parsePagination } from '../utils/index.js';
import { logAudit } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
import {
    createLoanSchema,
    updateLoanSchema,
    createCollateralSchema,
    createRepaymentSchema,
    idParamSchema,
    paginationSchema,
} from '../schemas/index.js';

export const loanRoutes = Router();
loanRoutes.use(authenticate);

// ==========================================
// LOAN ROUTES
// ==========================================

loanRoutes.get('/', requirePermission('loans:read'), validateQuery(paginationSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
        const where: Record<string, unknown> = { tenantId: req.user!.tenantId };

        if (req.query.status) where.status = req.query.status;
        if (req.query.type) where.type = req.query.type;
        if (req.query.search) {
            where.OR = [
                { loanNumber: { contains: req.query.search as string } },
                { lead: { firstName: { contains: req.query.search as string } } },
                { lead: { lastName: { contains: req.query.search as string } } },
            ];
        }

        const [total, data] = await Promise.all([
            prisma.loan.count({ where }),
            prisma.loan.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    lead: { select: { id: true, firstName: true, lastName: true, phone: true } },
                    customer: { select: { id: true, name: true, email: true } },
                },
            }),
        ]);
        return sendPaginated(res, data, page, limit, total);
    })
);

loanRoutes.get('/:id', requirePermission('loans:read'), validateParams(idParamSchema), requireOwnership(prisma.loan, 'managerId'),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.loan.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
            include: {
                lead: true,
                customer: true,
                collateral: true,
                documents: true,
                repayments: { take: 10, orderBy: { dueDate: 'desc' } },
                auditTrail: { take: 20, orderBy: { timestamp: 'desc' } },
            },
        });
        if (!item) throw new NotFoundError('Loan');
        return sendSuccess(res, item);
    })
);

loanRoutes.post('/', requirePermission('loans:create'), validateBody(createLoanSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const item = await prisma.loan.create({
            data: {
                id: generateId(),
                ...req.body,
                tenantId: req.user!.tenantId,
            },
        });
        logAudit('CREATE', 'Loan', item.id, req.user!.id);
        return sendCreated(res, item);
    })
);

loanRoutes.put('/:id', requirePermission('loans:update'), validateParams(idParamSchema), validateBody(updateLoanSchema), requireOwnership(prisma.loan, 'managerId'),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.loan.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Loan');

        const item = await prisma.loan.update({
            where: { id: req.params.id },
            data: req.body,
        });
        logAudit('UPDATE', 'Loan', item.id, req.user!.id);
        return sendSuccess(res, item);
    })
);

loanRoutes.delete('/:id', requirePermission('loans:delete'), validateParams(idParamSchema), requireOwnership(prisma.loan, 'managerId'),
    asyncHandler(async (req: Request, res: Response) => {
        const existing = await prisma.loan.findFirst({
            where: { id: req.params.id, tenantId: req.user!.tenantId },
        });
        if (!existing) throw new NotFoundError('Loan');

        await prisma.loan.delete({ where: { id: req.params.id } });
        logAudit('DELETE', 'Loan', req.params.id, req.user!.id);
        return sendNoContent(res);
    })
);

// ==========================================
// SUB-RESOURCES
// ==========================================

loanRoutes.post('/:id/collateral', requirePermission('loans:update'), validateParams(idParamSchema), validateBody(createCollateralSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const loan = await prisma.loan.findFirst({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
        if (!loan) throw new NotFoundError('Loan');

        const item = await prisma.collateral.create({
            data: {
                id: generateId(),
                loanId: loan.id,
                ...req.body,
            },
        });
        logAudit('ADD_COLLATERAL', 'Loan', loan.id, req.user!.id);
        return sendCreated(res, item);
    })
);

loanRoutes.post('/:id/repayments', requirePermission('loans:update'), validateParams(idParamSchema), validateBody(createRepaymentSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const loan = await prisma.loan.findFirst({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
        if (!loan) throw new NotFoundError('Loan');

        const item = await prisma.loanRepayment.create({
            data: {
                id: generateId(),
                loanId: loan.id,
                ...req.body,
            },
        });
        logAudit('ADD_REPAYMENT', 'Loan', loan.id, req.user!.id);
        return sendCreated(res, item);
    })
);
