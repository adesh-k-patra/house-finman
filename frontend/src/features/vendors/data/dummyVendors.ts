export type VendorCategory = 'legal' | 'technical' | 'valuation' | 'insurance' | 'other'
export type VendorStatus = 'active' | 'pending' | 'blocked'

export interface Vendor {
    id: string
    name: string
    category: VendorCategory
    contactPerson: string
    email: string
    phone: string
    address: string
    city: string
    status: VendorStatus
    rating: number
    totalPOs: number
    pendingInvoices: number
    slaCompliance: number
    avgLeadTime: number
}

export const dummyVendors: Vendor[] = [
    {
        id: 'VN-2024-001',
        name: 'LexCorp Legal Services',
        category: 'legal',
        contactPerson: 'Adv. Sharma',
        email: 'contact@lexcorp.com',
        phone: '+91 98765 11111',
        address: '101, Law Chambers, High Court Road',
        city: 'Mumbai',
        status: 'active',
        rating: 4.9,
        totalPOs: 120,
        pendingInvoices: 25000,
        slaCompliance: 98,
        avgLeadTime: 2
    },
    {
        id: 'VN-2024-002',
        name: 'TechFlow Systems',
        category: 'technical',
        contactPerson: 'Rajesh Kumar',
        email: 'support@techflow.com',
        phone: '+91 99887 22222',
        address: '22, IT Park, Whitefield',
        city: 'Bangalore',
        status: 'active',
        rating: 4.5,
        totalPOs: 45,
        pendingInvoices: 120000,
        slaCompliance: 92,
        avgLeadTime: 5
    },
    {
        id: 'VN-2024-003',
        name: 'ValuePro Appraisers',
        category: 'valuation',
        contactPerson: 'Suresh Patil',
        email: 'info@valuepro.com',
        phone: '+91 91234 33333',
        address: '45, Market Yard',
        city: 'Pune',
        status: 'active',
        rating: 4.7,
        totalPOs: 85,
        pendingInvoices: 15000,
        slaCompliance: 95,
        avgLeadTime: 3
    },
    {
        id: 'VN-2024-004',
        name: 'SecureLife Insurance',
        category: 'insurance',
        contactPerson: 'Priya Singh',
        email: 'claims@securelife.com',
        phone: '+91 98765 44444',
        address: '12, Financial District',
        city: 'Hyderabad',
        status: 'active',
        rating: 4.8,
        totalPOs: 60,
        pendingInvoices: 0,
        slaCompliance: 99,
        avgLeadTime: 24
    },
    {
        id: 'VN-2024-005',
        name: 'CleanSweep Services',
        category: 'other',
        contactPerson: 'Manish Gupta',
        email: 'ops@cleansweep.com',
        phone: '+91 99887 55555',
        address: '78, Industrial Area',
        city: 'Delhi',
        status: 'pending',
        rating: 0,
        totalPOs: 0,
        pendingInvoices: 0,
        slaCompliance: 0,
        avgLeadTime: 0
    },
    {
        id: 'VN-2024-006',
        name: 'BuildRight Construction',
        category: 'technical',
        contactPerson: 'Amitabh Bachchan',
        email: 'projects@buildright.com',
        phone: '+91 91234 66666',
        address: '56, Civil Lines',
        city: 'Jaipur',
        status: 'blocked',
        rating: 2.5,
        totalPOs: 10,
        pendingInvoices: 500000,
        slaCompliance: 60,
        avgLeadTime: 15
    },
    {
        id: 'VN-2024-007',
        name: 'GreenField Land Surveyors',
        category: 'valuation',
        contactPerson: 'Rohan Mehra',
        email: 'survey@greenfield.com',
        phone: '+91 98765 77777',
        address: '90, MG Road',
        city: 'Chennai',
        status: 'active',
        rating: 4.6,
        totalPOs: 55,
        pendingInvoices: 18000,
        slaCompliance: 94,
        avgLeadTime: 4
    },
    {
        id: 'VN-2024-008',
        name: 'SafeGuard Security',
        category: 'other',
        contactPerson: 'Vikemp Officer',
        email: 'guard@safeguard.com',
        phone: '+91 99887 88888',
        address: '34, Sector 17',
        city: 'Chandigarh',
        status: 'active',
        rating: 4.4,
        totalPOs: 30,
        pendingInvoices: 45000,
        slaCompliance: 90,
        avgLeadTime: 1
    },
    {
        id: 'VN-2024-009',
        name: 'Ace Legal Partners',
        category: 'legal',
        contactPerson: 'Kapil Sibal',
        email: 'partners@acelegal.com',
        phone: '+91 91234 99999',
        address: 'Supreme Court Lane',
        city: 'Delhi',
        status: 'active',
        rating: 5.0,
        totalPOs: 150,
        pendingInvoices: 50000,
        slaCompliance: 100,
        avgLeadTime: 1
    },
    {
        id: 'VN-2024-010',
        name: 'FastTrack Logistics',
        category: 'other',
        contactPerson: 'John Doe',
        email: 'dispatch@fasttrack.com',
        phone: '+91 98765 00000',
        address: 'Kochi Port',
        city: 'Kochi',
        status: 'active',
        rating: 4.3,
        totalPOs: 75,
        pendingInvoices: 60000,
        slaCompliance: 88,
        avgLeadTime: 3
    },
    {
        id: 'VN-2024-011',
        name: 'VeriCheck Background',
        category: 'other',
        contactPerson: 'Anita Roy',
        email: 'verify@vericheck.com',
        phone: '+91 91234 12345',
        address: 'Sector 5, Salt Lake',
        city: 'Kolkata',
        status: 'active',
        rating: 4.6,
        totalPOs: 40,
        pendingInvoices: 10000,
        slaCompliance: 96,
        avgLeadTime: 2
    },
    {
        id: 'VN-2024-012',
        name: 'StructEng Designs',
        category: 'technical',
        contactPerson: 'Er. Civil',
        email: 'designs@structeng.com',
        phone: '+91 98765 67890',
        address: 'Jubilee Hills',
        city: 'Hyderabad',
        status: 'active',
        rating: 4.8,
        totalPOs: 25,
        pendingInvoices: 35000,
        slaCompliance: 93,
        avgLeadTime: 6
    },
    {
        id: 'VN-2024-013',
        name: 'HomeSure Insurance',
        category: 'insurance',
        contactPerson: 'Rahul Dravid',
        email: 'policy@homesure.com',
        phone: '+91 99887 77777',
        address: 'Indiranagar',
        city: 'Bangalore',
        status: 'active',
        rating: 4.7,
        totalPOs: 55,
        pendingInvoices: 5000,
        slaCompliance: 98,
        avgLeadTime: 24
    },
    {
        id: 'VN-2024-014',
        name: 'City Valuers',
        category: 'valuation',
        contactPerson: 'Vinod Kambli',
        email: 'value@cityvaluers.com',
        phone: '+91 91234 55555',
        address: 'Dadar West',
        city: 'Mumbai',
        status: 'pending',
        rating: 0,
        totalPOs: 0,
        pendingInvoices: 0,
        slaCompliance: 0,
        avgLeadTime: 0
    },
    {
        id: 'VN-2024-015',
        name: 'LegalMind Associates',
        category: 'legal',
        contactPerson: 'Harish Salve',
        email: 'legal@legalmind.com',
        phone: '+91 98765 99900',
        address: 'Connaught Place',
        city: 'Delhi',
        status: 'active',
        rating: 4.9,
        totalPOs: 90,
        pendingInvoices: 40000,
        slaCompliance: 97,
        avgLeadTime: 2
    }
]
