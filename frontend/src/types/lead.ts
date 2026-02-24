/**
 * Lead Types for House FinMan
 * 
 * Purpose: Type definitions for lead management
 */

export type LeadStatus = 'new' | 'contacted' | 'kyc_pending' | 'kyc_done' | 'credit_assessment' | 'sanctioned' | 'disbursed' | 'rejected'
export type IncomeType = 'salaried' | 'self_employed' | 'business'
export type LeadSource = 'web' | 'partner' | 'referral' | 'whatsapp' | 'api'

export interface Lead {
    id: string
    name: string
    phone: string
    email: string
    city: string
    state: string
    status: LeadStatus
    incomeType: IncomeType
    source: LeadSource
    estimatedLoan: number
    score: number
    assignedAgent: string
    assignedAgentId: string
    partner?: string
    partnerId?: string
    createdAt: string
    updatedAt: string
    lastActivity: string
    tags: string[]
    documents: number
    hasConsent: boolean
    interestedProperties?: string[]
    budgetRange?: string
    propertyDetails?: string
}

export const leadStatusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
    new: { label: 'New', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    contacted: { label: 'Contacted', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
    kyc_pending: { label: 'KYC Pending', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    kyc_done: { label: 'KYC Done', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    credit_assessment: { label: 'Credit Assessment', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    sanctioned: { label: 'Sanctioned', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
    disbursed: { label: 'Disbursed', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}

export const incomeTypeConfig: Record<IncomeType, { label: string }> = {
    salaried: { label: 'Salaried' },
    self_employed: { label: 'Self Employed' },
    business: { label: 'Business' },
}

export const sourceConfig: Record<LeadSource, { label: string; color: string }> = {
    web: { label: 'Website', color: 'text-blue-500' },
    partner: { label: 'Partner', color: 'text-purple-500' },
    referral: { label: 'Referral', color: 'text-green-500' },
    whatsapp: { label: 'WhatsApp', color: 'text-emerald-500' },
    api: { label: 'API', color: 'text-orange-500' },
}
