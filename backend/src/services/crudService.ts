/**
 * Generic CRUD Service Factory
 * Reduces boilerplate for similar entity services
 */

import { prisma } from '../models/prisma.js';
import { generateId } from '../utils/index.js';
import { logAudit } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
import { PaginatedResult, PaginationParams } from '../types/index.js';

interface CrudOptions {
    model: string;
    include?: Record<string, unknown>;
    searchFields?: string[];
}

export function createCrudService<T, CreateInput, UpdateInput>(options: CrudOptions) {
    const { model, include, searchFields = [] } = options;
    const prismaModel = (prisma as any)[model] as {
        count: (args: unknown) => Promise<number>;
        findMany: (args: unknown) => Promise<T[]>;
        findFirst: (args: unknown) => Promise<T | null>;
        create: (args: unknown) => Promise<T>;
        update: (args: unknown) => Promise<T>;
        delete: (args: unknown) => Promise<T>;
    };

    return {
        async getAll(
            tenantId: string,
            pagination: PaginationParams,
            filters: Record<string, unknown> = {}
        ): Promise<PaginatedResult<T>> {
            const where: Record<string, unknown> = { tenantId };

            // Apply filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '' && key !== 'search') {
                    where[key] = value;
                }
            });

            // Search
            if (filters.search && searchFields.length > 0) {
                where.OR = searchFields.map(field => ({
                    [field]: { contains: filters.search },
                }));
            }

            const [total, data] = await Promise.all([
                prismaModel.count({ where }),
                prismaModel.findMany({
                    where,
                    skip: pagination.skip,
                    take: pagination.limit,
                    orderBy: { createdAt: 'desc' },
                    include,
                }),
            ]);

            return {
                data,
                meta: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total,
                    totalPages: Math.ceil(total / pagination.limit),
                },
            };
        },

        async getById(id: string, tenantId: string): Promise<T> {
            const item = await prismaModel.findFirst({
                where: { id, tenantId },
                include,
            });

            if (!item) {
                throw new NotFoundError(model);
            }

            return item;
        },

        async create(data: CreateInput, tenantId: string, userId: string): Promise<T> {
            const item = await prismaModel.create({
                data: {
                    id: generateId(),
                    ...data,
                    tenantId,
                } as Record<string, unknown>,
                include,
            });

            logAudit('CREATE', model, (item as Record<string, string>).id, userId);
            return item;
        },

        async update(id: string, tenantId: string, data: UpdateInput, userId: string): Promise<T> {
            const existing = await prismaModel.findFirst({
                where: { id, tenantId },
            });

            if (!existing) {
                throw new NotFoundError(model);
            }

            const item = await prismaModel.update({
                where: { id },
                data: data as Record<string, unknown>,
                include,
            });

            logAudit('UPDATE', model, id, userId, { changes: data });
            return item;
        },

        async delete(id: string, tenantId: string, userId: string): Promise<void> {
            const existing = await prismaModel.findFirst({
                where: { id, tenantId },
            });

            if (!existing) {
                throw new NotFoundError(model);
            }

            await prismaModel.delete({ where: { id } });
            logAudit('DELETE', model, id, userId);
        },
    };
}
