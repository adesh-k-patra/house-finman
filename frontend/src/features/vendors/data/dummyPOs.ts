export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'completed' | 'cancelled'

export interface PurchaseOrder {
    id: string
    poNumber: string
    vendorName: string
    vendorId: string
    category: string
    amount: number
    status: POStatus
    createdAt: string
    dueDate: string
    items: number
    createdBy: string
    approvedBy?: string
    approvedAt?: string
    notes?: string
    lineItems: {
        id: string
        description: string
        quantity: number
        unitPrice: number
        total: number
    }[]
    timeline: {
        date: string
        action: string
        user: string
    }[]
}

export const dummyPOs: PurchaseOrder[] = [
    {
        id: '1',
        poNumber: 'PO-2026-001',
        vendorName: 'Legal Associates LLP',
        vendorId: 'VEN-001',
        category: 'Legal',
        amount: 45000,
        status: 'approved',
        createdAt: '2026-01-03T10:00:00',
        dueDate: '2026-01-10',
        items: 3,
        createdBy: 'Rahul Sharma',
        approvedBy: 'Amit Kumar',
        approvedAt: '2026-01-04T09:00:00',
        notes: 'Monthly retainer fee for legal consultation.',
        lineItems: [
            { id: 'LI-1', description: 'Legal Retainer Fee - Jan 2026', quantity: 1, unitPrice: 40000, total: 40000 },
            { id: 'LI-2', description: 'Document Review Charges', quantity: 2, unitPrice: 2500, total: 5000 }
        ],
        timeline: [
            { date: '2026-01-03T10:00:00', action: 'Created', user: 'Rahul Sharma' },
            { date: '2026-01-03T10:05:00', action: 'Submitted for Approval', user: 'Rahul Sharma' },
            { date: '2026-01-04T09:00:00', action: 'Approved', user: 'Amit Kumar' }
        ]
    },
    {
        id: '2',
        poNumber: 'PO-2026-002',
        vendorName: 'TechVal Inspections',
        vendorId: 'VEN-002',
        category: 'Technical',
        amount: 28000,
        status: 'pending_approval',
        createdAt: '2026-01-04T11:30:00',
        dueDate: '2026-01-12',
        items: 2,
        createdBy: 'Priya Patel',
        notes: 'Urgent inspection for Project Alpha.',
        lineItems: [
            { id: 'LI-3', description: 'Site Inspection - Tower A', quantity: 1, unitPrice: 15000, total: 15000 },
            { id: 'LI-4', description: 'Structural Audit Report', quantity: 1, unitPrice: 13000, total: 13000 }
        ],
        timeline: [
            { date: '2026-01-04T11:30:00', action: 'Created', user: 'Priya Patel' },
            { date: '2026-01-04T11:35:00', action: 'Submitted for Approval', user: 'Priya Patel' }
        ]
    },
    {
        id: '3',
        poNumber: 'PO-2026-003',
        vendorName: 'PropertyValue Pro',
        vendorId: 'VEN-003',
        category: 'Valuation',
        amount: 15000,
        status: 'completed',
        createdAt: '2026-01-01T09:00:00',
        dueDate: '2026-01-05',
        items: 1,
        createdBy: 'Amit Kumar',
        approvedBy: 'Amit Kumar',
        approvedAt: '2026-01-01T09:05:00',
        lineItems: [
            { id: 'LI-5', description: 'Property Valuation - 123 Main St', quantity: 1, unitPrice: 15000, total: 15000 }
        ],
        timeline: [
            { date: '2026-01-01T09:00:00', action: 'Created', user: 'Amit Kumar' },
            { date: '2026-01-01T09:05:00', action: 'Approved', user: 'Amit Kumar' },
            { date: '2026-01-05T14:00:00', action: 'Payment Processed', user: 'Finance Team' }
        ]
    },
    {
        id: '4',
        poNumber: 'PO-2026-004',
        vendorName: 'SafeHome Insurance',
        vendorId: 'VEN-004',
        category: 'Insurance',
        amount: 85000,
        status: 'approved',
        createdAt: '2026-01-02T14:00:00',
        dueDate: '2026-01-15',
        items: 5,
        createdBy: 'Rahul Sharma',
        approvedBy: 'Amit Kumar',
        approvedAt: '2026-01-03T10:00:00',
        lineItems: [
            { id: 'LI-6', description: 'Property Insurance Premium', quantity: 5, unitPrice: 17000, total: 85000 }
        ],
        timeline: [
            { date: '2026-01-02T14:00:00', action: 'Created', user: 'Rahul Sharma' },
            { date: '2026-01-03T10:00:00', action: 'Approved', user: 'Amit Kumar' }
        ]
    },
    {
        id: '5',
        poNumber: 'PO-2026-005',
        vendorName: 'Metro Legal Services',
        vendorId: 'VEN-005',
        category: 'Legal',
        amount: 32000,
        status: 'draft',
        createdAt: '2026-01-05T08:00:00',
        dueDate: '2026-01-20',
        items: 2,
        createdBy: 'Sneha Reddy',
        lineItems: [
            { id: 'LI-7', description: 'Title Search', quantity: 2, unitPrice: 16000, total: 32000 }
        ],
        timeline: [
            { date: '2026-01-05T08:00:00', action: 'Draft Created', user: 'Sneha Reddy' }
        ]
    },
    {
        id: '6',
        poNumber: 'PO-2026-006',
        vendorName: 'QuickCheck Technical',
        vendorId: 'VEN-006',
        category: 'Technical',
        amount: 18000,
        status: 'cancelled',
        createdAt: '2025-12-28T10:00:00',
        dueDate: '2026-01-05',
        items: 1,
        createdBy: 'Vikram Singh',
        notes: 'Vendor unavailable',
        lineItems: [
            { id: 'LI-8', description: 'Pre-purchase Inspection', quantity: 1, unitPrice: 18000, total: 18000 }
        ],
        timeline: [
            { date: '2025-12-28T10:00:00', action: 'Created', user: 'Vikram Singh' },
            { date: '2025-12-29T09:00:00', action: 'Cancelled', user: 'Vikram Singh' }
        ]
    },
    {
        id: '7',
        poNumber: 'PO-2026-007',
        vendorName: 'Office Supplies Co',
        vendorId: 'VEN-007',
        category: 'Office',
        amount: 5000,
        status: 'pending_approval',
        createdAt: '2026-01-06T09:00:00',
        dueDate: '2026-01-13',
        items: 10,
        createdBy: 'Admin User',
        lineItems: [
            { id: 'LI-9', description: 'A4 Paper Ream', quantity: 50, unitPrice: 100, total: 5000 }
        ],
        timeline: [
            { date: '2026-01-06T09:00:00', action: 'Created', user: 'Admin User' }
        ]
    },
    {
        id: '8',
        poNumber: 'PO-2026-008',
        vendorName: 'Cloud Services Inc',
        vendorId: 'VEN-008',
        category: 'IT',
        amount: 120000,
        status: 'approved',
        createdAt: '2026-01-02T10:00:00',
        dueDate: '2026-01-30',
        items: 1,
        createdBy: 'IT Manager',
        approvedBy: 'CTO',
        approvedAt: '2026-01-03T11:00:00',
        lineItems: [
            { id: 'LI-10', description: 'AWS Yearly Subscription', quantity: 1, unitPrice: 120000, total: 120000 }
        ],
        timeline: [
            { date: '2026-01-02T10:00:00', action: 'Created', user: 'IT Manager' },
            { date: '2026-01-03T11:00:00', action: 'Approved', user: 'CTO' }
        ]
    },
    {
        id: '9',
        poNumber: 'PO-2026-009',
        vendorName: 'Marketing Gmbh',
        vendorId: 'VEN-009',
        category: 'Marketing',
        amount: 250000,
        status: 'pending_approval',
        createdAt: '2026-01-06T10:30:00',
        dueDate: '2026-02-01',
        items: 3,
        createdBy: 'Marketing Lead',
        lineItems: [
            { id: 'LI-11', description: 'Campaign Management', quantity: 1, unitPrice: 100000, total: 100000 },
            { id: 'LI-12', description: 'Ad Spend', quantity: 1, unitPrice: 150000, total: 150000 }
        ],
        timeline: [
            { date: '2026-01-06T10:30:00', action: 'Created', user: 'Marketing Lead' }
        ]
    },
    {
        id: '10',
        poNumber: 'PO-2026-010',
        vendorName: 'Security Bros',
        vendorId: 'VEN-010',
        category: 'Security',
        amount: 12000,
        status: 'completed',
        createdAt: '2025-12-20T08:00:00',
        dueDate: '2025-12-27',
        items: 1,
        createdBy: 'Facility Manager',
        approvedBy: 'Ops Head',
        approvedAt: '2025-12-21T09:00:00',
        lineItems: [
            { id: 'LI-13', description: 'Monthly Security Audit', quantity: 1, unitPrice: 12000, total: 12000 }
        ],
        timeline: [
            { date: '2025-12-20T08:00:00', action: 'Created', user: 'Facility Manager' },
            { date: '2025-12-21T09:00:00', action: 'Approved', user: 'Ops Head' },
            { date: '2025-12-28T10:00:00', action: 'Completed', user: 'System' }
        ]
    },
    {
        id: '11',
        poNumber: 'PO-2026-011',
        vendorName: 'CleanCo Services',
        vendorId: 'VEN-011',
        category: 'Facility',
        amount: 8000,
        status: 'approved',
        createdAt: '2026-01-05T14:00:00',
        dueDate: '2026-01-12',
        items: 1,
        createdBy: 'Facility Manager',
        approvedBy: 'Ops Head',
        approvedAt: '2026-01-06T09:00:00',
        lineItems: [
            { id: 'LI-14', description: 'Deep Cleaning Service', quantity: 1, unitPrice: 8000, total: 8000 }
        ],
        timeline: [
            { date: '2026-01-05T14:00:00', action: 'Created', user: 'Facility Manager' },
            { date: '2026-01-06T09:00:00', action: 'Approved', user: 'Ops Head' }
        ]
    },
    {
        id: '12',
        poNumber: 'PO-2026-012',
        vendorName: 'Event planners',
        vendorId: 'VEN-012',
        category: 'HR',
        amount: 75000,
        status: 'draft',
        createdAt: '2026-01-06T11:00:00',
        dueDate: '2026-02-15',
        items: 5,
        createdBy: 'HR Manager',
        lineItems: [
            { id: 'LI-15', description: 'Venue Booking', quantity: 1, unitPrice: 50000, total: 50000 }
        ],
        timeline: [
            { date: '2026-01-06T11:00:00', action: 'Draft Created', user: 'HR Manager' }
        ]
    },
    {
        id: '13',
        poNumber: 'PO-2026-013',
        vendorName: 'Laptop World',
        vendorId: 'VEN-013',
        category: 'IT',
        amount: 450000,
        status: 'pending_approval',
        createdAt: '2026-01-06T09:30:00',
        dueDate: '2026-01-20',
        items: 5,
        createdBy: 'IT Manager',
        lineItems: [
            { id: 'LI-16', description: 'MacBook Pro M3', quantity: 5, unitPrice: 90000, total: 450000 }
        ],
        timeline: [
            { date: '2026-01-06T09:30:00', action: 'Created', user: 'IT Manager' }
        ]
    },
    {
        id: '14',
        poNumber: 'PO-2026-014',
        vendorName: 'Print Masters',
        vendorId: 'VEN-014',
        category: 'Marketing',
        amount: 15000,
        status: 'completed',
        createdAt: '2025-12-15T10:00:00',
        dueDate: '2025-12-25',
        items: 1,
        createdBy: 'Marketing Lead',
        approvedBy: 'Marketing Lead',
        approvedAt: '2025-12-15T11:00:00',
        lineItems: [
            { id: 'LI-17', description: 'Brochure Printing', quantity: 1000, unitPrice: 15, total: 15000 }
        ],
        timeline: [
            { date: '2025-12-15T10:00:00', action: 'Created', user: 'Marketing Lead' },
            { date: '2025-12-15T11:00:00', action: 'Approved', user: 'Marketing Lead' },
            { date: '2025-12-26T10:00:00', action: 'Completed', user: 'System' }
        ]
    },
    {
        id: '15',
        poNumber: 'PO-2026-015',
        vendorName: 'Catering Delights',
        vendorId: 'VEN-015',
        category: 'HR',
        amount: 5000,
        status: 'cancelled',
        createdAt: '2026-01-02T09:00:00',
        dueDate: '2026-01-05',
        items: 1,
        createdBy: 'HR Executive',
        notes: 'Lunch meeting cancelled',
        lineItems: [
            { id: 'LI-18', description: 'Team Lunch', quantity: 1, unitPrice: 5000, total: 5000 }
        ],
        timeline: [
            { date: '2026-01-02T09:00:00', action: 'Created', user: 'HR Executive' },
            { date: '2026-01-04T10:00:00', action: 'Cancelled', user: 'HR Executive' }
        ]
    }
]
