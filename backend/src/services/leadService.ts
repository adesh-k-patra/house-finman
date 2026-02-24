/**
 * Lead Service
 * Business logic for lead management
 */

import { prisma } from '../models/prisma.js';
import { generateId } from '../utils/index.js';
import { logAudit } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateLeadInput, UpdateLeadInput } from '../schemas/index.js';
import { PaginatedResult, PaginationParams } from '../types/index.js';
import { Lead } from '@prisma/client';

interface LeadFilters {
    status?: string;
    source?: string;
    assignedToId?: string;
    search?: string;
}

/**
 * Get all leads with pagination and filtering
 */
export async function getLeads(
    tenantId: string,
    pagination: PaginationParams,
    filters: LeadFilters = {}
): Promise<PaginatedResult<Lead>> {
    const where: Record<string, unknown> = { tenantId };

    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.source) {
        where.source = filters.source;
    }
    if (filters.assignedToId) {
        where.assignedToId = filters.assignedToId;
    }
    if (filters.search) {
        where.OR = [
            { firstName: { contains: filters.search } },
            { lastName: { contains: filters.search } },
            { email: { contains: filters.search } },
            { phone: { contains: filters.search } },
        ];
    }

    const [total, data] = await Promise.all([
        prisma.lead.count({ where }),
        prisma.lead.findMany({
            where,
            skip: pagination.skip,
            take: pagination.limit,
            orderBy: { createdAt: 'desc' },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                campaign: { select: { id: true, name: true } },
            },
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
}

/**
 * Get lead by ID
 */
export async function getLeadById(id: string, tenantId: string): Promise<Lead> {
    const lead = await prisma.lead.findFirst({
        where: { id, tenantId },
        include: {
            assignedTo: { select: { id: true, name: true, email: true } },
            createdBy: { select: { id: true, name: true, email: true } },
            campaign: { select: { id: true, name: true } },
            notes: { orderBy: { createdAt: 'desc' } },
            activities: { orderBy: { createdAt: 'desc' }, take: 20 },
            opportunity: true,
        },
    });

    if (!lead) {
        throw new NotFoundError('Lead');
    }

    return lead;
}

/**
 * Create new lead
 */
export async function createLead(
    data: CreateLeadInput,
    tenantId: string,
    createdById: string
): Promise<Lead> {
    const lead = await prisma.lead.create({
        data: {
            id: generateId(),
            ...data,
            tenantId,
            createdById,
        },
        include: {
            assignedTo: { select: { id: true, name: true, email: true } },
        },
    });

    // Log activity
    await prisma.leadActivity.create({
        data: {
            id: generateId(),
            leadId: lead.id,
            type: 'status_change',
            description: 'Lead created',
            metadata: JSON.stringify({ status: 'new' }),
        },
    });

    logAudit('CREATE', 'Lead', lead.id, createdById);

    return lead;
}

/**
 * Update lead
 */
export async function updateLead(
    id: string,
    tenantId: string,
    data: UpdateLeadInput,
    userId: string
): Promise<Lead> {
    const existing = await prisma.lead.findFirst({
        where: { id, tenantId },
    });

    if (!existing) {
        throw new NotFoundError('Lead');
    }

    // Track status change
    const statusChanged = data.status && data.status !== existing.status;

    const lead = await prisma.lead.update({
        where: { id },
        data: {
            ...data,
            lastContactedAt: new Date(),
        },
        include: {
            assignedTo: { select: { id: true, name: true, email: true } },
        },
    });

    if (statusChanged) {
        await prisma.leadActivity.create({
            data: {
                id: generateId(),
                leadId: lead.id,
                type: 'status_change',
                description: `Status changed from ${existing.status} to ${data.status}`,
                metadata: JSON.stringify({ oldStatus: existing.status, newStatus: data.status }),
            },
        });
    }

    logAudit('UPDATE', 'Lead', id, userId, { changes: data });

    return lead;
}

/**
 * Delete lead
 */
export async function deleteLead(
    id: string,
    tenantId: string,
    userId: string
): Promise<void> {
    const lead = await prisma.lead.findFirst({
        where: { id, tenantId },
    });

    if (!lead) {
        throw new NotFoundError('Lead');
    }

    await prisma.lead.delete({ where: { id } });

    logAudit('DELETE', 'Lead', id, userId);
}

/**
 * Add note to lead
 */
export async function addLeadNote(
    leadId: string,
    content: string,
    tenantId: string
): Promise<void> {
    // Verify lead exists
    const lead = await prisma.lead.findFirst({
        where: { id: leadId, tenantId },
    });

    if (!lead) {
        throw new NotFoundError('Lead');
    }

    await prisma.leadNote.create({
        data: {
            id: generateId(),
            leadId,
            content,
        },
    });

    await prisma.leadActivity.create({
        data: {
            id: generateId(),
            leadId,
            type: 'note',
            description: 'Note added',
        },
    });
}

/**
 * Convert lead to opportunity
 */
export async function convertLead(
    leadId: string,
    tenantId: string,
    opportunityData: { name: string; value: number; propertyId?: string },
    userId: string
): Promise<void> {
    const lead = await prisma.lead.findFirst({
        where: { id: leadId, tenantId },
    });

    if (!lead) {
        throw new NotFoundError('Lead');
    }

    if (lead.status === 'won') {
        throw new Error('Lead already converted');
    }

    // Create opportunity
    await prisma.opportunity.create({
        data: {
            id: generateId(),
            name: opportunityData.name,
            value: opportunityData.value,
            propertyId: opportunityData.propertyId,
            leadId,
            tenantId,
        },
    });

    // Update lead status
    await prisma.lead.update({
        where: { id: leadId },
        data: {
            status: 'won',
            convertedAt: new Date(),
        },
    });

    await prisma.leadActivity.create({
        data: {
            id: generateId(),
            leadId,
            type: 'status_change',
            description: 'Lead converted to opportunity',
        },
    });

    logAudit('CONVERT', 'Lead', leadId, userId);
}
