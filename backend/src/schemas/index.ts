/**
 * Zod Validation Schemas
 * Centralized request validation schemas
 */

import { z } from 'zod';
export * from './loanSchemas.js';

// ===========================================
// Auth Schemas
// ===========================================

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional().default(false),
    // Security fields
    deviceFingerprint: z.string().optional(),
    location: z.object({
        lat: z.number().optional().nullable(),
        lng: z.number().optional().nullable(),
        city: z.string().optional().nullable(),
        country: z.string().optional().nullable()
    }).optional()
});

export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    phone: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().optional(), // Can come from cookie
});

// ===========================================
// User Schemas
// ===========================================

export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2).max(100),
    phone: z.string().optional(),
    role: z.enum([
        'super_admin',
        'tenant_admin',
        'viewer',
        'partner_admin',
        'agent',
        'vendor_manager',
        'finance',
        'cx',
        'mentor',
    ]).default('viewer'),
    tenantId: z.string().uuid().optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional().nullable(),
    role: z.enum([
        'super_admin',
        'tenant_admin',
        'viewer',
        'partner_admin',
        'agent',
        'vendor_manager',
        'finance',
        'cx',
        'mentor',
    ]).optional(),
    isActive: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional().nullable(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

// ===========================================
// Lead Schemas
// ===========================================

export const createLeadSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email().optional().nullable(),
    phone: z.string().min(10, 'Valid phone number required'),
    alternatePhone: z.string().optional().nullable(),
    source: z.enum(['website', 'referral', 'partner', 'campaign', 'cold_call', 'walk_in']),
    sourceDetails: z.string().optional().nullable(),
    campaignId: z.string().uuid().optional().nullable(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    interestedIn: z.string().optional().nullable(),
    budget: z.number().positive().optional().nullable(),
    location: z.string().optional().nullable(),
    assignedToId: z.string().uuid().optional().nullable(),
});

export const updateLeadSchema = z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().email().optional().nullable(),
    phone: z.string().min(10).optional(),
    alternatePhone: z.string().optional().nullable(),
    source: z.enum(['website', 'referral', 'partner', 'campaign', 'cold_call', 'walk_in']).optional(),
    sourceDetails: z.string().optional().nullable(),
    status: z.enum(['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    score: z.number().min(0).max(100).optional(),
    interestedIn: z.string().optional().nullable(),
    budget: z.number().positive().optional().nullable(),
    location: z.string().optional().nullable(),
    assignedToId: z.string().uuid().optional().nullable(),
});

export const leadNoteSchema = z.object({
    content: z.string().min(1, 'Note content is required').max(5000),
});

// ===========================================
// Opportunity Schemas
// ===========================================

export const createOpportunitySchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    value: z.number().positive('Value must be positive'),
    probability: z.number().min(0).max(100).default(50),
    stage: z.enum(['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).default('qualification'),
    leadId: z.string().uuid().optional().nullable(),
    propertyId: z.string().uuid().optional().nullable(),
    expectedCloseDate: z.string().datetime().optional().nullable(),
    notes: z.string().optional().nullable(),
});

export const updateOpportunitySchema = z.object({
    name: z.string().min(1).max(200).optional(),
    value: z.number().positive().optional(),
    probability: z.number().min(0).max(100).optional(),
    stage: z.enum(['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).optional(),
    propertyId: z.string().uuid().optional().nullable(),
    expectedCloseDate: z.string().datetime().optional().nullable(),
    notes: z.string().optional().nullable(),
});

// ===========================================
// Partner Schemas
// ===========================================

export const createPartnerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    type: z.enum(['individual', 'company', 'channel_partner']),
    email: z.string().email(),
    phone: z.string().min(10),
    companyName: z.string().optional().nullable(),
    gstin: z.string().optional().nullable(),
    pan: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    pincode: z.string().optional().nullable(),
    commissionRate: z.number().min(0).max(100).default(0),
});

export const updatePartnerSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    type: z.enum(['individual', 'company', 'channel_partner']).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    companyName: z.string().optional().nullable(),
    gstin: z.string().optional().nullable(),
    pan: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    pincode: z.string().optional().nullable(),
    status: z.enum(['pending', 'approved', 'active', 'inactive', 'suspended']).optional(),
    onboardingStatus: z.enum(['pending', 'documents_pending', 'under_review', 'approved', 'rejected']).optional(),
    commissionRate: z.number().min(0).max(100).optional(),
});

// ===========================================
// Vendor Schemas
// ===========================================

export const createVendorSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    type: z.enum(['supplier', 'contractor', 'service_provider']),
    email: z.string().email(),
    phone: z.string().min(10),
    companyName: z.string().optional().nullable(),
    gstin: z.string().optional().nullable(),
    pan: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    pincode: z.string().optional().nullable(),
    bankName: z.string().optional().nullable(),
    bankAccount: z.string().optional().nullable(),
    bankIfsc: z.string().optional().nullable(),
});

export const updateVendorSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    type: z.enum(['supplier', 'contractor', 'service_provider']).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    companyName: z.string().optional().nullable(),
    gstin: z.string().optional().nullable(),
    pan: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    pincode: z.string().optional().nullable(),
    status: z.enum(['active', 'inactive', 'blacklisted']).optional(),
    bankName: z.string().optional().nullable(),
    bankAccount: z.string().optional().nullable(),
    bankIfsc: z.string().optional().nullable(),
});

// ===========================================
// Property Schemas
// ===========================================

export const createPropertySchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    type: z.enum(['apartment', 'villa', 'plot', 'commercial']),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(6, 'Valid pincode required'),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    carpet: z.number().positive().optional().nullable(),
    builtUp: z.number().positive().optional().nullable(),
    superBuiltUp: z.number().positive().optional().nullable(),
    bedrooms: z.number().int().min(0).optional().nullable(),
    bathrooms: z.number().int().min(0).optional().nullable(),
    floor: z.number().int().min(0).optional().nullable(),
    totalFloors: z.number().int().min(1).optional().nullable(),
    basePrice: z.number().positive('Base price is required'),
    currentPrice: z.number().positive('Current price is required'),
    pricePerSqft: z.number().positive().optional().nullable(),
    amenities: z.array(z.string()).optional().default([]),
    specifications: z.record(z.unknown()).optional().default({}),
});

export const updatePropertySchema = z.object({
    name: z.string().min(1).max(200).optional(),
    type: z.enum(['apartment', 'villa', 'plot', 'commercial']).optional(),
    status: z.enum(['available', 'reserved', 'sold', 'under_construction']).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().min(6).optional(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    carpet: z.number().positive().optional().nullable(),
    builtUp: z.number().positive().optional().nullable(),
    superBuiltUp: z.number().positive().optional().nullable(),
    bedrooms: z.number().int().min(0).optional().nullable(),
    bathrooms: z.number().int().min(0).optional().nullable(),
    floor: z.number().int().min(0).optional().nullable(),
    totalFloors: z.number().int().min(1).optional().nullable(),
    basePrice: z.number().positive().optional(),
    currentPrice: z.number().positive().optional(),
    pricePerSqft: z.number().positive().optional().nullable(),
    amenities: z.array(z.string()).optional(),
    specifications: z.record(z.unknown()).optional(),
    approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
});

// ===========================================
// Ticket Schemas
// ===========================================

export const createTicketSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(200),
    description: z.string().min(1, 'Description is required').max(5000),
    category: z.enum(['billing', 'technical', 'sales', 'general']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const updateTicketSchema = z.object({
    subject: z.string().min(1).max(200).optional(),
    description: z.string().min(1).max(5000).optional(),
    category: z.enum(['billing', 'technical', 'sales', 'general']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    status: z.enum(['open', 'in_progress', 'waiting', 'resolved', 'closed']).optional(),
    assignedToId: z.string().uuid().optional().nullable(),
});

export const ticketMessageSchema = z.object({
    content: z.string().min(1, 'Message is required').max(10000),
    isInternal: z.boolean().optional().default(false),
});

// ===========================================
// Campaign Schemas
// ===========================================

export const createCampaignSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    type: z.enum(['email', 'sms', 'whatsapp', 'social', 'event']),
    description: z.string().optional().nullable(),
    budget: z.number().positive().optional().nullable(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    targetAudience: z.record(z.unknown()).optional().default({}),
    content: z.record(z.unknown()).optional().default({}),
});

export const updateCampaignSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    type: z.enum(['email', 'sms', 'whatsapp', 'social', 'event']).optional(),
    status: z.enum(['draft', 'scheduled', 'running', 'paused', 'completed']).optional(),
    description: z.string().optional().nullable(),
    budget: z.number().positive().optional().nullable(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    targetAudience: z.record(z.unknown()).optional(),
    content: z.record(z.unknown()).optional(),
});

// ===========================================
// Common Schemas
// ===========================================

export const idParamSchema = z.object({
    id: z.string().uuid('Invalid ID format'),
});

export const paginationSchema = z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('20'),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    status: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;

// ===========================================
// Survey Schemas
// ===========================================

export const createSurveySchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    type: z.enum(['nps', 'csat', 'ces', 'product_research', 'onboarding', 'churn', 'custom']),
    channel: z.enum(['email', 'sms', 'whatsapp', 'web', 'link', 'qr', 'in_app']),
    description: z.string().optional().nullable(),
    isAnonymous: z.boolean().optional().default(false),
    allowMultiple: z.boolean().optional().default(false),
    campaignId: z.string().uuid().optional().nullable(),
    questions: z.array(z.object({
        text: z.string().min(1),
        type: z.enum(['rating', 'nps', 'text', 'choice', 'multi_choice', 'boolean', 'date']),
        order: z.number().int(),
        isRequired: z.boolean().default(true),
        options: z.array(z.string()).optional(),
        logic: z.record(z.unknown()).optional(),
    })).optional().default([]),
});

export const updateSurveySchema = z.object({
    title: z.string().min(1).max(200).optional(),
    type: z.enum(['nps', 'csat', 'ces', 'product_research', 'onboarding', 'churn', 'custom']).optional(),
    status: z.enum(['draft', 'active', 'paused', 'ended', 'archived']).optional(),
    description: z.string().optional().nullable(),
    campaignId: z.string().uuid().optional().nullable(),
    questions: z.array(z.object({
        id: z.string().optional(), // For updates
        text: z.string().min(1),
        type: z.enum(['rating', 'nps', 'text', 'choice', 'multi_choice', 'boolean', 'date']),
        order: z.number().int(),
        isRequired: z.boolean().default(true),
        options: z.array(z.string()).optional(),
        logic: z.record(z.unknown()).optional(),
    })).optional(),
});

export const surveyResponseSchema = z.object({
    status: z.enum(['partial', 'completed']).default('completed'),
    answers: z.array(z.object({
        questionId: z.string().uuid(),
        value: z.string(),
        timeSpent: z.number().int().optional(),
    })),
    respondentEmail: z.string().email().optional().nullable(),
    respondentPhone: z.string().optional().nullable(),
});
