import { z } from 'zod';

export const createLoanSchema = z.object({
    loanNumber: z.string().min(1, 'Loan number is required'),
    leadId: z.string().uuid().optional().nullable(),
    customerId: z.string().uuid().optional().nullable(),
    managerId: z.string().uuid().optional().nullable(),
    type: z.string().min(1, 'Loan type is required'),
    status: z.enum(['draft', 'applied', 'processing', 'approved', 'disbursed', 'active', 'closed', 'rejected']).default('draft'),
    amount: z.number().positive('Amount must be positive'),
    interestRate: z.number().min(0, 'Interest rate cannot be negative'),
    tenureMonths: z.number().int().positive('Tenure must be positive'),
    emiAmount: z.number().positive().optional().nullable(),
    purpose: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
});

export const updateLoanSchema = z.object({
    status: z.enum(['draft', 'applied', 'processing', 'approved', 'disbursed', 'active', 'closed', 'rejected']).optional(),
    amount: z.number().positive().optional(),
    interestRate: z.number().min(0).optional(),
    tenureMonths: z.number().int().positive().optional(),
    emiAmount: z.number().positive().optional().nullable(),
    purpose: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    approvalDate: z.string().datetime().optional().nullable(),
    disbursalDate: z.string().datetime().optional().nullable(),
});

export const createCollateralSchema = z.object({
    type: z.string().min(1, 'Type is required'),
    value: z.number().positive('Value must be positive'),
    description: z.string().optional().nullable(),
    ownerName: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    documents: z.array(z.string()).optional().default([]),
});

export const createRepaymentSchema = z.object({
    paymentMethod: z.enum(['ACH', 'NEFT', 'Cheque', 'UPI', 'Cash']),
    amount: z.number().positive('Amount must be positive'),
    type: z.string().min(1, 'Type is required'),
    status: z.enum(['pending', 'success', 'failed', 'overdue']).default('pending'),
    dueDate: z.string().datetime(),
    paidDate: z.string().datetime().optional().nullable(),
    transactionId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});
