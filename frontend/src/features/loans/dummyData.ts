import { Loan, LoanDocument, AuditLog, PaymentTransaction, LoanNote, Guarantor, LoanInsurance } from './types';

// Helper to generate dates relative to now
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();
const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 3600000).toISOString();


// ============================================
// PENDING LOAN - Full Underwriting Demo
// ============================================

const pendingLoanDocuments: LoanDocument[] = [
    {
        id: 'd1', name: 'PAN Card.pdf', type: 'KYC', category: 'mandatory', status: 'verified',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 245000, fileType: 'pdf', fileHash: 'sha256-abc123...',
        verifierName: 'System', verifiedAt: daysAgo(2),
        verification: { verifierId: 'SYS', verifierName: 'CKYC System', verifiedAt: daysAgo(2), verificationMethod: 'api', confidence: 99 }
    },
    {
        id: 'd2', name: 'Aadhaar Card.pdf', type: 'KYC', category: 'mandatory', status: 'verified',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 312000, fileType: 'pdf', verifierName: 'System', verifiedAt: daysAgo(2)
    },
    {
        id: 'd3', name: 'Salary Slips (3 months).pdf', type: 'Income', category: 'mandatory', status: 'review',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 892000, fileType: 'pdf', notes: 'Salary figures need cross-verification with bank statements'
    },
    {
        id: 'd4', name: 'Bank Statement (6 months).pdf', type: 'Income', category: 'mandatory', status: 'uploaded',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 1540000, fileType: 'pdf'
    },
    {
        id: 'd5', name: 'Form 16 (Current Year).pdf', type: 'Income', category: 'mandatory', status: 'verified',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 456000, fileType: 'pdf', verifierName: 'Rahul Verma', verifiedAt: daysAgo(1)
    },
    {
        id: 'd6', name: 'ITR (Last 2 years).pdf', type: 'Income', category: 'mandatory', status: 'verified',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 1234000, fileType: 'pdf', verifierName: 'Rahul Verma', verifiedAt: daysAgo(1)
    },
    {
        id: 'd7', name: 'Property Sale Agreement.pdf', type: 'Property', category: 'mandatory', status: 'verified',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(1), url: '#',
        fileSize: 2340000, fileType: 'pdf', verifierName: 'Legal Team', verifiedAt: daysAgo(1),
        iseSigned: true, eSignTimestamp: daysAgo(1), eSignerName: 'Vikram Malhotra'
    },
    {
        id: 'd8', name: 'Property Valuation Report.pdf', type: 'Property', category: 'mandatory', status: 'verified',
        uploadedBy: 'ABC Valuers', uploadedAt: daysAgo(1), url: '#',
        fileSize: 3200000, fileType: 'pdf', verifierName: 'Property Team', verifiedAt: hoursAgo(12)
    },
    {
        id: 'd9', name: 'Title Search Report.pdf', type: 'Legal', category: 'mandatory', status: 'review',
        uploadedBy: 'Legal Team', uploadedAt: hoursAgo(8), url: '#',
        fileSize: 890000, fileType: 'pdf', notes: 'Minor encumbrance found - pending clearance certificate'
    },
    {
        id: 'd10', name: 'Employment Letter.pdf', type: 'Employment', category: 'optional', status: 'verified',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 234000, fileType: 'pdf', verifierName: 'System', verifiedAt: daysAgo(2)
    },
    {
        id: 'd11', name: 'Address Proof (Utility Bill).pdf', type: 'KYC', category: 'optional', status: 'verified',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 180000, fileType: 'pdf', verifierName: 'System', verifiedAt: daysAgo(2)
    },
    {
        id: 'd12', name: 'Passport Photo.jpg', type: 'KYC', category: 'mandatory', status: 'verified',
        uploadedBy: 'Vikram Malhotra', uploadedAt: daysAgo(2), url: '#',
        fileSize: 120000, fileType: 'jpg', verifierName: 'System', verifiedAt: daysAgo(2)
    }
];

const pendingLoanAuditTrail: AuditLog[] = [
    { id: 'a1', action: 'Application Created', actionType: 'create', actorName: 'Vikram Malhotra', role: 'Borrower', timestamp: daysAgo(2), description: 'Loan application submitted via Web Portal' },
    { id: 'a2', action: 'Documents Uploaded', actionType: 'document', actorName: 'Vikram Malhotra', role: 'Borrower', timestamp: daysAgo(2), description: '12 documents uploaded' },
    { id: 'a3', action: 'KYC Auto-Verified', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: daysAgo(2), description: 'CKYC Registry Match Found - PAN verified' },
    { id: 'a4', action: 'Aadhaar Verified', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: daysAgo(2), description: 'Aadhaar e-KYC completed successfully' },
    { id: 'a5', action: 'Credit Bureau Pull', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: daysAgo(2), description: 'CIBIL Score: 785 (Excellent)' },
    { id: 'a6', action: 'AML Screening Passed', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: daysAgo(2), description: 'No sanctions or watchlist matches found' },
    { id: 'a7', action: 'Fraud Check Passed', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: daysAgo(2), description: 'Device fingerprint clean, no prior fraud flags' },
    { id: 'a8', action: 'Officer Assigned', actionType: 'update', actorName: 'System', role: 'Bot', timestamp: daysAgo(2), description: 'Assigned to Rahul Verma (Credit Officer)' },
    { id: 'a9', action: 'Document Verified', actionType: 'document', actorName: 'Rahul Verma', role: 'Credit Officer', timestamp: daysAgo(1), description: 'Form 16 verified - matches declared income' },
    { id: 'a10', action: 'Document Verified', actionType: 'document', actorName: 'Rahul Verma', role: 'Credit Officer', timestamp: daysAgo(1), description: 'ITR verified for 2 years' },
    { id: 'a11', action: 'Property Valuation Ordered', actionType: 'create', actorName: 'Rahul Verma', role: 'Credit Officer', timestamp: daysAgo(1), description: 'Valuation request sent to ABC Valuers' },
    { id: 'a12', action: 'Property Valuation Received', actionType: 'document', actorName: 'ABC Valuers', role: 'External', timestamp: daysAgo(1), description: 'Market Value: ₹1.6Cr, Forced Sale: ₹1.4Cr' },
    { id: 'a13', action: 'Legal Verification Initiated', actionType: 'create', actorName: 'Rahul Verma', role: 'Credit Officer', timestamp: daysAgo(1), description: 'Title search and encumbrance check initiated' },
    { id: 'a14', action: 'Title Report Uploaded', actionType: 'document', actorName: 'Legal Team', role: 'Legal', timestamp: hoursAgo(8), description: 'Minor encumbrance found - municipal tax pending' },
    { id: 'a15', action: 'Note Added', actionType: 'update', actorName: 'Rahul Verma', role: 'Credit Officer', timestamp: hoursAgo(6), description: 'Requested encumbrance clearance certificate from borrower' },
    { id: 'a16', action: 'Salary Slip Flagged', actionType: 'update', actorName: 'Rahul Verma', role: 'Credit Officer', timestamp: hoursAgo(4), description: 'Salary figures slightly higher than bank credits - needs verification' },
    { id: 'a17', action: 'Bank Statement Review', actionType: 'update', actorName: 'Rahul Verma', role: 'Credit Officer', timestamp: hoursAgo(2), description: 'Bank statement review in progress' },
    { id: 'a18', action: 'Employment Verification Call', actionType: 'update', actorName: 'Rahul Verma', role: 'Credit Officer', timestamp: hoursAgo(1), description: 'Employment confirmed with Google India HR' },
];

const pendingLoanNotes: LoanNote[] = [
    {
        id: 'n1', content: 'Applicant has strong credit history (785 CIBIL). First-time home buyer. Property is in prime location with good appreciation potential.',
        category: 'underwriter', visibility: 'team', createdBy: 'Rahul Verma', createdByRole: 'Credit Officer', createdAt: daysAgo(1), pinned: true
    },
    {
        id: 'n2', content: 'Salary slip shows ₹3.75L monthly but bank credits average ₹3.5L. Difference may be due to timing. Need to verify with HR.',
        category: 'underwriter', visibility: 'team', createdBy: 'Rahul Verma', createdByRole: 'Credit Officer', createdAt: hoursAgo(4)
    },
    {
        id: 'n3', content: 'Borrower called requesting expedited processing. Property deal needs to close by month-end.',
        category: 'general', visibility: 'public', createdBy: 'Customer Service', createdByRole: 'Support', createdAt: hoursAgo(3)
    }
];

// ============================================
// APPROVED LOAN - 24h Notification Window
// ============================================

const approvedLoanAuditTrail: AuditLog[] = [
    { id: 'a1', action: 'Application Created', actionType: 'create', actorName: 'Anjali Gupta', role: 'Borrower', timestamp: daysAgo(5), description: 'Personal loan application submitted' },
    { id: 'a2', action: 'Documents Uploaded', actionType: 'document', actorName: 'Anjali Gupta', role: 'Borrower', timestamp: daysAgo(5), description: '6 documents uploaded' },
    { id: 'a3', action: 'KYC Verified', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: daysAgo(5), description: 'Video KYC completed successfully' },
    { id: 'a4', action: 'Credit Check', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: daysAgo(5), description: 'CIBIL Score: 740 (Good)' },
    { id: 'a5', action: 'AML Passed', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: daysAgo(5), description: 'Clean AML check' },
    { id: 'a6', action: 'Officer Assigned', actionType: 'update', actorName: 'System', role: 'Bot', timestamp: daysAgo(5), description: 'Assigned to Sarah Jenkins' },
    { id: 'a7', action: 'Income Verified', actionType: 'document', actorName: 'Sarah Jenkins', role: 'Credit Manager', timestamp: daysAgo(4), description: 'ITR and bank statements verified' },
    { id: 'a8', action: 'Underwriting Complete', actionType: 'update', actorName: 'Sarah Jenkins', role: 'Credit Manager', timestamp: daysAgo(3), description: 'All checks passed, ready for approval' },
    { id: 'a9', action: 'Terms Finalized', actionType: 'update', actorName: 'Sarah Jenkins', role: 'Credit Manager', timestamp: daysAgo(1), description: 'Interest rate: 11.5%, Tenure: 24 months' },
    {
        id: 'a10', action: 'Loan Approved', actionType: 'approve', actorName: 'Sarah Jenkins', role: 'Credit Manager', timestamp: hoursAgo(2), description: 'Approved with standard terms. 24h notification window started.',
        metadata: { approvalType: 'scheduled_24h', windowExpiry: hoursFromNow(22) }
    },
];

// ============================================
// ACTIVE LOAN - Ongoing Servicing
// ============================================

const activeLoanDocuments: LoanDocument[] = [
    { id: 'd1', name: 'Loan Agreement.pdf', type: 'Agreement', category: 'mandatory', status: 'verified', uploadedBy: 'System', uploadedAt: '2024-02-01', url: '#', iseSigned: true, eSignTimestamp: '2024-02-01T10:00:00Z', eSignerName: 'Michael Chen' },
    { id: 'd2', name: 'Property Sale Deed.pdf', type: 'Property', category: 'mandatory', status: 'verified', uploadedBy: 'Legal Team', uploadedAt: '2024-01-25', url: '#' },
    { id: 'd3', name: 'Property Valuation Report.pdf', type: 'Property', category: 'mandatory', status: 'verified', uploadedBy: 'ABC Valuers', uploadedAt: '2024-01-20', url: '#' },
    { id: 'd4', name: 'Title Clearance Certificate.pdf', type: 'Legal', category: 'mandatory', status: 'verified', uploadedBy: 'Legal Team', uploadedAt: '2024-01-22', url: '#' },
    { id: 'd5', name: 'Insurance Policy.pdf', type: 'Insurance', category: 'mandatory', status: 'verified', uploadedBy: 'HDFC Ergo', uploadedAt: '2024-02-01', url: '#' },
    { id: 'd6', name: 'E-Mandate Registration.pdf', type: 'Agreement', category: 'mandatory', status: 'verified', uploadedBy: 'System', uploadedAt: '2024-02-01', url: '#' },
    { id: 'd7', name: 'Disbursement Slip.pdf', type: 'Disbursement', category: 'mandatory', status: 'verified', uploadedBy: 'Finance Team', uploadedAt: '2024-02-01', url: '#' },
    { id: 'd8', name: 'KYC Documents Bundle.pdf', type: 'KYC', category: 'mandatory', status: 'verified', uploadedBy: 'Michael Chen', uploadedAt: '2024-01-10', url: '#' },
];

const activeLoanPayments: PaymentTransaction[] = [
    { id: 'TX-1', date: '2024-03-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-03-001', allocation: { principalPortion: 91130, interestPortion: 39056, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-2', date: '2024-04-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-04-001', allocation: { principalPortion: 91780, interestPortion: 38406, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-3', date: '2024-05-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-05-001', allocation: { principalPortion: 92435, interestPortion: 37751, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-4', date: '2024-06-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-06-001', allocation: { principalPortion: 93095, interestPortion: 37091, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-5', date: '2024-07-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-07-001', allocation: { principalPortion: 93760, interestPortion: 36426, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-6', date: '2024-08-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-08-001', allocation: { principalPortion: 94430, interestPortion: 35756, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-7', date: '2024-09-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-09-001', allocation: { principalPortion: 95104, interestPortion: 35082, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-8', date: '2024-10-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-10-001', allocation: { principalPortion: 95783, interestPortion: 34403, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-9', date: '2024-11-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-11-001', allocation: { principalPortion: 96467, interestPortion: 33719, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
    { id: 'TX-10', date: '2024-12-01', type: 'emi', amount: 130186, status: 'completed', instrument: 'ACH', referenceId: 'ACH-2024-12-001', allocation: { principalPortion: 97155, interestPortion: 33031, penaltyPortion: 0, feesPortion: 0, allocationPriority: 'interest_first' } },
];

const activeLoanAuditTrail: AuditLog[] = [
    { id: 'a1', action: 'Application Created', actionType: 'create', actorName: 'Michael Chen', role: 'Borrower', timestamp: '2024-01-05T10:00:00Z', description: 'Housing loan application submitted' },
    { id: 'a2', action: 'Documents Uploaded', actionType: 'document', actorName: 'Michael Chen', role: 'Borrower', timestamp: '2024-01-05T11:00:00Z', description: '15 documents uploaded' },
    { id: 'a3', action: 'KYC Verified', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: '2024-01-05T12:00:00Z', description: 'All KYC documents verified' },
    { id: 'a4', action: 'Credit Bureau Pull', actionType: 'system', actorName: 'System', role: 'Bot', timestamp: '2024-01-05T12:30:00Z', description: 'CIBIL Score: 780 (Excellent)' },
    { id: 'a5', action: 'Property Valuation', actionType: 'document', actorName: 'ABC Valuers', role: 'External', timestamp: '2024-01-15T14:00:00Z', description: 'Property valued at ₹2Cr' },
    { id: 'a6', action: 'Legal Verification', actionType: 'document', actorName: 'Legal Team', role: 'Legal', timestamp: '2024-01-20T10:00:00Z', description: 'Title clear, no encumbrances' },
    { id: 'a7', action: 'Loan Approved', actionType: 'approve', actorName: 'Senior Credit Manager', role: 'Approver', timestamp: '2024-01-25T16:00:00Z', description: 'Loan sanctioned for ₹1.5Cr' },
    { id: 'a8', action: 'Agreement Signed', actionType: 'document', actorName: 'Michael Chen', role: 'Borrower', timestamp: '2024-02-01T09:00:00Z', description: 'Loan agreement e-signed' },
    { id: 'a9', action: 'Insurance Activated', actionType: 'create', actorName: 'HDFC Ergo', role: 'External', timestamp: '2024-02-01T09:30:00Z', description: 'Property insurance activated' },
    { id: 'a10', action: 'E-Mandate Registered', actionType: 'create', actorName: 'System', role: 'Bot', timestamp: '2024-02-01T10:00:00Z', description: 'NACH mandate registered with HDFC Bank' },
    { id: 'a11', action: 'Loan Disbursed', actionType: 'payment', actorName: 'Finance Team', role: 'Admin', timestamp: '2024-02-01T11:00:00Z', description: 'Disbursement of ₹1.5Cr to builder account' },
    { id: 'a12', action: 'EMI Payment', actionType: 'payment', actorName: 'System', role: 'Bot', timestamp: '2024-03-01T06:00:00Z', description: 'March EMI auto-debited successfully' },
    { id: 'a13', action: 'EMI Payment', actionType: 'payment', actorName: 'System', role: 'Bot', timestamp: '2024-04-01T06:00:00Z', description: 'April EMI auto-debited successfully' },
    { id: 'a14', action: 'EMI Payment', actionType: 'payment', actorName: 'System', role: 'Bot', timestamp: '2024-05-01T06:00:00Z', description: 'May EMI auto-debited successfully' },
    {
        id: 'a15', action: 'Interest Rate Repriced', actionType: 'update', actorName: 'System', role: 'Bot', timestamp: '2024-06-15T00:00:00Z', description: 'Rate changed from 8.5% to 8.4% (MCLR revision)',
        changes: [{ field: 'interestRate', oldValue: 8.5, newValue: 8.4 }]
    },
    { id: 'a16', action: 'EMI Payment', actionType: 'payment', actorName: 'System', role: 'Bot', timestamp: '2024-06-01T06:00:00Z', description: 'June EMI auto-debited successfully' },
    { id: 'a17', action: 'EMI Payment', actionType: 'payment', actorName: 'System', role: 'Bot', timestamp: '2024-07-01T06:00:00Z', description: 'July EMI auto-debited successfully' },
    { id: 'a18', action: 'Insurance Renewal Reminder', actionType: 'notification', actorName: 'System', role: 'Bot', timestamp: '2024-12-01T10:00:00Z', description: 'Insurance renewal due in 60 days' },
    { id: 'a19', action: 'Statement Generated', actionType: 'document', actorName: 'Michael Chen', role: 'Borrower', timestamp: '2024-12-15T14:00:00Z', description: 'Annual statement downloaded' },
    { id: 'a20', action: 'EMI Payment', actionType: 'payment', actorName: 'System', role: 'Bot', timestamp: '2025-01-01T06:00:00Z', description: 'January EMI auto-debited successfully' },
];

const activeLoanInsurance: LoanInsurance = {
    id: 'INS-001',
    provider: 'HDFC Ergo',
    policyNumber: 'HIP-88392-2024',
    type: 'property',
    coverageAmount: 15000000,
    premiumAmount: 25000,
    premiumFrequency: 'yearly',
    startDate: '2024-02-01',
    expiryDate: '2025-02-01',
    status: 'active',
    nomineeDetails: [{ name: 'Priya Chen', relationship: 'Spouse', sharePercent: 100 }]
};

const activeLoanGuarantors: Guarantor[] = [];

// ============================================
// COMPLETED LOAN - Full Closure Details
// ============================================

const completedLoanAuditTrail: AuditLog[] = [
    { id: 'a1', action: 'Application Created', actionType: 'create', actorName: 'Karan Mehra', role: 'Borrower', timestamp: '2020-05-10T10:00:00Z', description: 'Auto loan application submitted' },
    { id: 'a2', action: 'Loan Approved', actionType: 'approve', actorName: 'Auto Finance Manager', role: 'Approver', timestamp: '2020-05-15T14:00:00Z', description: 'Loan approved for ₹40L' },
    { id: 'a3', action: 'Loan Disbursed', actionType: 'payment', actorName: 'Finance Team', role: 'Admin', timestamp: '2020-06-01T10:00:00Z', description: 'Disbursement to BMW dealer' },
    { id: 'a4', action: 'Vehicle Hypothecated', actionType: 'document', actorName: 'RTO', role: 'External', timestamp: '2020-06-05T10:00:00Z', description: 'Hypothecation registered with RTO' },
    { id: 'a5', action: 'EMI Started', actionType: 'payment', actorName: 'System', role: 'Bot', timestamp: '2020-07-01T06:00:00Z', description: 'First EMI debited successfully' },
    {
        id: 'a6', action: 'Partial Prepayment', actionType: 'payment', actorName: 'Karan Mehra', role: 'Borrower', timestamp: '2022-01-15T14:00:00Z', description: 'Prepayment of ₹10L received',
        metadata: { amount: 1000000, newOutstanding: 2800000 }
    },
    {
        id: 'a7', action: 'Tenure Reduced', actionType: 'update', actorName: 'System', role: 'Bot', timestamp: '2022-01-15T14:30:00Z', description: 'Tenure reduced from 60 to 48 months remaining',
        changes: [{ field: 'termMonths', oldValue: 60, newValue: 48 }]
    },
    { id: 'a8', action: 'Full Settlement Request', actionType: 'update', actorName: 'Karan Mehra', role: 'Borrower', timestamp: '2024-01-10T10:00:00Z', description: 'Borrower requested full settlement quote' },
    { id: 'a9', action: 'Settlement Quote Generated', actionType: 'document', actorName: 'System', role: 'Bot', timestamp: '2024-01-10T10:30:00Z', description: 'Settlement amount: ₹12,45,000 (Principal + Interest to date)' },
    { id: 'a10', action: 'Settlement Payment Received', actionType: 'payment', actorName: 'Karan Mehra', role: 'Borrower', timestamp: '2024-01-15T11:00:00Z', description: 'Full settlement payment of ₹12,45,000 received via NEFT' },
    { id: 'a11', action: 'Loan Closed', actionType: 'update', actorName: 'Admin', role: 'Super Admin', timestamp: '2024-01-15T14:00:00Z', description: 'Loan marked as closed - paid in full' },
    { id: 'a12', action: 'NOC Generated', actionType: 'document', actorName: 'System', role: 'Bot', timestamp: '2024-01-15T14:15:00Z', description: 'No Objection Certificate generated' },
    { id: 'a13', action: 'NOC Sent', actionType: 'notification', actorName: 'System', role: 'Bot', timestamp: '2024-01-15T14:30:00Z', description: 'NOC sent via Email and WhatsApp' },
    { id: 'a14', action: 'Hypothecation Removal Initiated', actionType: 'document', actorName: 'Legal Team', role: 'Legal', timestamp: '2024-01-16T10:00:00Z', description: 'Form 35 submitted to RTO for hypothecation removal' },
    { id: 'a15', action: 'RC Updated', actionType: 'document', actorName: 'RTO', role: 'External', timestamp: '2024-01-25T14:00:00Z', description: 'RC book updated - hypothecation removed' },
];

// ============================================
// EXPORT MOCK LOANS
// ============================================

export const mockLoans: Loan[] = [
    // 1. PENDING LOAN - Full Underwriting Demo
    {
        id: 'LN-PEND-001',
        referenceId: 'APP-2024-8821',
        applicationId: 'APPL-2024-88210001',
        status: 'pending',
        stage: 'Underwriting',
        type: 'Housing',
        subType: 'New Purchase',
        productCode: 'HL-PREM-001',
        purpose: 'Purchase of 3BHK apartment in Sobha Dream Acres for self-occupation',
        purposeTags: ['Self-Occupation', 'First Home', 'Urban'],
        createdAt: daysAgo(2),
        requestDate: daysAgo(2),
        submittedAt: daysAgo(2),
        assignedOfficer: 'Rahul Verma',
        assignedOfficerId: 'EMP-RV-001',
        branchCode: 'BLR-001',
        branchName: 'Bangalore - Indiranagar',
        region: 'South',
        nextAction: 'Verify Income Documents & Clear Title Encumbrance',
        nextActionDueDate: hoursFromNow(24),
        slaDeadline: daysAgo(-3), // 3 days from now
        riskTags: ['First Time Borrower'],
        notes: 'Applicant requested urgent processing for property deal closure. Strong credit profile.',
        borrower: {
            id: 'BR-101',
            name: 'Vikram Malhotra',
            email: 'vikram.m@example.com',
            phone: '+91 98765 11223',
            altPhone: '+91 98765 44556',
            dob: '1988-05-15',
            age: 36,
            gender: 'Male',
            panNumber: 'ABCDE1234F',
            aadhaarNumber: 'XXXX-XXXX-5678',
            kycStatus: 'verified',
            ckycId: 'CKYC-1234567890',
            address: 'Flat 402, Oakwood Residency, Indiranagar, Bangalore - 560038',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560038',
            residenceType: 'Rented',
            yearsAtAddress: 3,
            employmentType: 'Salaried',
            employerName: 'Google India Pvt Ltd',
            designation: 'Senior Software Engineer',
            employerAddress: 'Google India, Bagmane Tech Park, Bangalore',
            yearsWithEmployer: 5,
            annualIncome: 4500000,
            payFrequency: 'Monthly',
            bankName: 'HDFC Bank',
            bankAccountNumber: '9988',
            ifscCode: 'HDFC0001234',
            eMandateStatus: 'pending',
            creditScore: 785,
            creditScoreDate: daysAgo(2),
            creditBureau: 'CIBIL',
            riskScore: 92,
            internalRiskGrade: 'A',
            existingDebtAmount: 0,
            existingEmiAmount: 0,
            totalExistingLoans: 0,
            coBorrowers: [],
            communicationPreference: 'all'
        },
        financials: {
            principalAmount: 12000000,
            requestedAmount: 12500000,
            sanctionedAmount: 12000000,
            outstandingBalance: 0,
            interestRate: 8.4,
            effectiveRate: 8.4,
            interestType: 'floating',
            baseRate: 'MCLR',
            spread: 0.25,
            termMonths: 240,
            repaymentMethod: 'EMI',
            repaymentFrequency: 'Monthly',
            gracePeriodDays: 7,
            daysPastDue: 0,
            dpdBucket: 'Current',
            emiAmount: 103500
        },
        collateral: {
            id: 'COL-001',
            type: 'Apartment',
            description: '3BHK Luxury Apartment in Sobha Dream Acres',
            value: 16000000,
            valuationDate: daysAgo(1),
            valuationHistory: [
                { id: 'VAL-1', valuationDate: daysAgo(1), valuationType: 'initial', valuedBy: 'ABC Valuers', agency: 'ABC Property Valuers', amount: 16000000, reportUrl: '#' }
            ],
            currency: 'INR',
            address: 'Unit 1205, Tower A, Sobha Dream Acres, Panathur Road, Bangalore - 560103',
            ltvRatio: 75,
            isVerified: true,
            verificationDate: daysAgo(1),
            verifiedBy: 'Property Verification Team',
            propertyType: 'Flat',
            configuration: '3BHK',
            name: 'Sobha Dream Acres',
            legalStatus: 'pending_verification',
            encumbranceDetails: 'Minor municipal tax pending - clearance in progress',
            insuranceStatus: 'none'
        },
        amlStatus: 'pass',
        amlScreeningDate: daysAgo(2),
        fraudCheck: 'pass',
        fraudCheckDate: daysAgo(2),
        riskAssessment: {
            overallRiskScore: 85,
            riskGrade: 'Low',
            dscr: 2.8,
            foir: 0.35,
            ltvRatio: 75,
            npaRisk: 'Low',
            npaProbability: 5,
            pepStatus: 'not_pep',
            locationRiskTier: 'Tier1',
            industryRisk: 'Low',
            bureauPullHistory: [
                { date: daysAgo(2), bureau: 'CIBIL', score: 785 }
            ]
        },
        underwritingChecklist: {
            kycVerified: true,
            incomeVerified: false,
            collateralVerified: true,
            cibilCheck: true,
            amlPassed: true,
            fraudCheckPassed: true,
            creditScoreAboveThreshold: true,
            dtiWithinLimits: true,
            allMandatoryDocsVerified: false,
            fieldVerificationDone: false,
            legalVerificationDone: false,
            valuationDone: true
        },
        documents: pendingLoanDocuments,
        auditTrail: pendingLoanAuditTrail,
        loanNotes: pendingLoanNotes,
        paymentHistory: [],
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        language: 'en'
    },

    // 2. APPROVED LOAN - 24h Notification Window
    {
        id: 'LN-APPR-002',
        referenceId: 'APP-2024-7710',
        applicationId: 'APPL-2024-77100001',
        status: 'approved',
        stage: 'Approval',
        type: 'Personal',
        subType: 'Unsecured',
        productCode: 'PL-STD-001',
        purpose: 'Home renovation and interior decoration',
        purposeTags: ['Home Improvement', 'Interior'],
        createdAt: daysAgo(5),
        requestDate: daysAgo(5),
        approvedAt: hoursAgo(2),
        assignedOfficer: 'Sarah Jenkins',
        assignedOfficerId: 'EMP-SJ-001',
        branchCode: 'JAI-001',
        branchName: 'Jaipur - Civil Lines',
        region: 'North',
        nextAction: 'Awaiting Notification to Borrower',
        riskTags: [],
        notes: 'Approved with standard terms. Good credit history.',
        borrower: {
            id: 'BR-102',
            name: 'Anjali Gupta',
            email: 'anjali.g@example.com',
            phone: '+91 99887 77665',
            dob: '1990-03-22',
            age: 34,
            gender: 'Female',
            panNumber: 'DEFGH5678I',
            kycStatus: 'verified',
            address: '12, Civil Lines, Jaipur - 302006',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302006',
            residenceType: 'Owned',
            yearsAtAddress: 8,
            employmentType: 'Self-Employed',
            employerName: 'Gupta Interior Solutions',
            designation: 'Proprietor',
            gstNumber: '08AABCU9603R1ZP',
            annualIncome: 1200000,
            bankName: 'ICICI Bank',
            bankAccountNumber: '5566',
            creditScore: 740,
            creditScoreDate: daysAgo(5),
            creditBureau: 'CIBIL',
            riskScore: 85,
            internalRiskGrade: 'B'
        },
        financials: {
            principalAmount: 500000,
            sanctionedAmount: 500000,
            outstandingBalance: 0,
            interestRate: 11.5,
            interestType: 'fixed',
            termMonths: 24,
            repaymentMethod: 'EMI',
            repaymentFrequency: 'Monthly',
            daysPastDue: 0,
            emiAmount: 23400
        },
        collateral: {
            type: 'Unsecured',
            description: 'N/A',
            value: 0,
            currency: 'INR',
            ltvRatio: 0,
            isVerified: true
        },
        approvalWindow: {
            approvedBy: 'Sarah Jenkins',
            approverRole: 'Credit Manager',
            approvalType: 'scheduled_24h',
            approvedAt: hoursAgo(2),
            expiresAt: hoursFromNow(22),
            scheduledJobId: 'JOB-NOTIFY-7710',
            notificationStatus: 'waiting'
        },
        documents: [
            { id: 'd1', name: 'KYC Bundle.pdf', type: 'KYC', category: 'mandatory', status: 'verified', uploadedBy: 'Anjali Gupta', uploadedAt: daysAgo(5), url: '#' },
            { id: 'd2', name: 'GST Returns (12 months).pdf', type: 'Income', category: 'mandatory', status: 'verified', uploadedBy: 'Anjali Gupta', uploadedAt: daysAgo(5), url: '#' },
            { id: 'd3', name: 'Bank Statement.pdf', type: 'Income', category: 'mandatory', status: 'verified', uploadedBy: 'Anjali Gupta', uploadedAt: daysAgo(5), url: '#' }
        ],
        auditTrail: approvedLoanAuditTrail,
        paymentHistory: [],
        currency: 'INR'
    },

    // 3. ACTIVE/ONGOING LOAN - Full Servicing
    {
        id: 'LN-2024-0016',
        referenceId: 'LN-2024-0016',
        applicationId: 'APPL-2024-00160001',
        status: 'ongoing',
        stage: 'Repayment',
        type: 'Housing',
        subType: 'New Purchase',
        productCode: 'HL-PREM-001',
        housingTier: 'High',
        purpose: 'Purchase of 3BHK luxury apartment in Sky Towers, Baner',
        purposeTags: ['Self-Occupation', 'Luxury', 'Urban'],
        createdAt: '2024-01-05T10:00:00Z',
        requestDate: '2024-01-05T10:00:00Z',
        approvedAt: '2024-01-25T16:00:00Z',
        disbursedAt: '2024-02-01T11:00:00Z',
        activatedAt: '2024-02-01T11:00:00Z',
        assignedOfficer: 'Rahul Verma',
        assignedOfficerId: 'EMP-RV-001',
        branchCode: 'PUN-001',
        branchName: 'Pune - Baner',
        region: 'West',
        nextAction: 'Monitor - All EMIs Current',
        riskTags: ['High Value'],
        notes: 'Borrower is a high-net-worth individual. Excellent payment track record. Target for cross-sell.',
        borrower: {
            id: 'BR-001',
            name: 'Michael Chen',
            email: 'michael.chen@example.com',
            phone: '+91 98765 43210',
            altPhone: '+91 98765 67890',
            dob: '1982-08-10',
            age: 42,
            gender: 'Male',
            panNumber: 'GHIJK9012L',
            aadhaarNumber: 'XXXX-XXXX-1234',
            kycStatus: 'verified',
            ckycId: 'CKYC-9876543210',
            address: '45, Green Park Society, Baner, Pune - 411045',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411045',
            residenceType: 'Owned',
            yearsAtAddress: 5,
            employmentType: 'Salaried',
            employerName: 'Tech Solutions Pvt Ltd',
            designation: 'Vice President - Engineering',
            yearsWithEmployer: 8,
            annualIncome: 3500000,
            payFrequency: 'Monthly',
            bankName: 'HDFC Bank',
            bankAccountNumber: '4321',
            ifscCode: 'HDFC0002345',
            eMandateStatus: 'active',
            creditScore: 780,
            creditScoreDate: '2024-01-05',
            creditBureau: 'CIBIL',
            riskScore: 95,
            internalRiskGrade: 'A',
            existingDebtAmount: 0,
            existingEmiAmount: 0,
            totalExistingLoans: 0,
            coBorrowers: [],
            communicationPreference: 'email'
        },
        financials: {
            principalAmount: 15000000,
            sanctionedAmount: 15000000,
            disbursedAmount: 15000000,
            outstandingBalance: 14058861,
            interestRate: 8.4,
            effectiveRate: 8.4,
            interestType: 'floating',
            baseRate: 'MCLR',
            spread: 0.25,
            repricingDate: '2025-06-15',
            termMonths: 240,
            tenureRemaining: 230,
            repaymentMethod: 'EMI',
            repaymentFrequency: 'Monthly',
            startDate: '2024-02-01',
            endDate: '2044-01-31',
            maturityDate: '2044-01-31',
            nextDueDate: '2025-02-01',
            lastPaymentDate: '2025-01-01',
            lastPaymentAmount: 130186,
            gracePeriodDays: 7,
            daysPastDue: 0,
            dpdBucket: 'Current',
            emiAmount: 130186,
            principalPaid: 941139,
            interestPaid: 360721
        },
        collateral: {
            id: 'COL-002',
            type: 'Apartment',
            description: '3BHK Luxury Apartment, Sky Towers',
            value: 20000000,
            valuationDate: '2024-01-20',
            valuationHistory: [
                { id: 'VAL-1', valuationDate: '2024-01-20', valuationType: 'initial', valuedBy: 'XYZ Valuers', agency: 'XYZ Property Valuers', amount: 20000000, reportUrl: '#' }
            ],
            currency: 'INR',
            ltvRatio: 75,
            isVerified: true,
            verificationDate: '2024-01-22',
            image: 'https://images.unsplash.com/photo-1600596542815-60c37c6525fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            name: 'Sky Towers',
            propertyType: 'Flat',
            configuration: '3BHK',
            address: 'Flat 1201, Sky Towers, Baner Road, Pune - 411045',
            propertyId: 'PROP-SKY-1201',
            legalStatus: 'clear',
            insuranceStatus: 'active',
            insurancePolicyNumber: 'HIP-88392-2024'
        },
        guarantors: activeLoanGuarantors,
        riskAssessment: {
            overallRiskScore: 95,
            riskGrade: 'Low',
            dscr: 3.2,
            foir: 0.30,
            ltvRatio: 70,
            npaRisk: 'Low',
            npaProbability: 2,
            pepStatus: 'not_pep',
            locationRiskTier: 'Tier1',
            industryRisk: 'Low',
            bureauPullHistory: [
                { date: '2024-01-05', bureau: 'CIBIL', score: 780 },
                { date: '2024-07-01', bureau: 'CIBIL', score: 782, scoreChange: 2 }
            ]
        },
        documents: activeLoanDocuments,
        auditTrail: activeLoanAuditTrail,
        paymentHistory: activeLoanPayments,
        insurance: activeLoanInsurance,
        eMandateStatus: {
            status: 'active',
            provider: 'NPCI',
            umrn: 'UMRN-HDFC-98765432',
            registeredAt: '2024-02-01T10:00:00Z',
            bankAccountLast4: '4321',
            bankName: 'HDFC Bank',
            maxAmount: 200000,
            frequency: 'monthly',
            validUntil: '2044-01-31',
            lastDebitDate: '2025-01-01',
            lastDebitAmount: 130186,
            lastDebitStatus: 'success',
            nachReturns: [],
            debitHistory: [
                { date: '2024-03-01', amount: 130186, status: 'success', referenceId: 'ACH-2024-03-001' },
                { date: '2024-04-01', amount: 130186, status: 'success', referenceId: 'ACH-2024-04-001' }
            ]
        },
        disbursements: [
            { id: 'DIS-001', trancheNumber: 1, amount: 15000000, disbursedAt: '2024-02-01T11:00:00Z', bankAccountNumber: 'Builder Account - XXXX1234', transactionId: 'NEFT-2024-DIS-001', status: 'completed' }
        ],
        agreements: [
            { id: 'AGR-001', name: 'Home Loan Agreement', type: 'Loan Agreement', signedAt: '2024-02-01T09:00:00Z', signedBy: 'Michael Chen', eSignStatus: 'signed', documentUrl: '#', certificateUrl: '#' },
            { id: 'AGR-002', name: 'Property Mortgage Deed', type: 'Mortgage', signedAt: '2024-02-01T09:30:00Z', signedBy: 'Michael Chen', eSignStatus: 'signed', documentUrl: '#' }
        ],
        currency: 'INR',
        timezone: 'Asia/Kolkata'
    },

    // 4. COMPLETED LOAN - Full Closure Details
    {
        id: 'LN-COMP-003',
        referenceId: 'LN-2020-5592',
        applicationId: 'APPL-2020-55920001',
        status: 'completed',
        stage: 'Closed',
        type: 'Auto',
        subType: 'New Vehicle',
        productCode: 'AL-PREM-001',
        purpose: 'Purchase of BMW X1 for personal use',
        purposeTags: ['Personal Vehicle', 'Premium'],
        createdAt: '2020-05-10T10:00:00Z',
        requestDate: '2020-05-10T10:00:00Z',
        approvedAt: '2020-05-15T14:00:00Z',
        disbursedAt: '2020-06-01T10:00:00Z',
        closedAt: '2024-01-15T14:00:00Z',
        assignedOfficer: 'Auto Loans Team',
        assignedOfficerId: 'TEAM-AUTO',
        branchCode: 'DEL-001',
        branchName: 'Delhi - Connaught Place',
        region: 'North',
        notes: 'Loan closed early via prepayment. Excellent payment history throughout tenure.',
        riskTags: [],
        borrower: {
            id: 'BR-99',
            name: 'Karan Mehra',
            email: 'karan.m@example.com',
            phone: '+91 99880 00000',
            dob: '1985-11-20',
            age: 39,
            gender: 'Male',
            panNumber: 'LMNOP3456Q',
            kycStatus: 'verified',
            address: '88, Defence Colony, New Delhi - 110024',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110024',
            residenceType: 'Owned',
            employmentType: 'Business',
            employerName: 'Mehra Exports Pvt Ltd',
            designation: 'Managing Director',
            gstNumber: '07AABCM1234R1ZX',
            annualIncome: 5000000,
            bankName: 'Axis Bank',
            bankAccountNumber: '7788',
            creditScore: 800,
            riskScore: 98,
            internalRiskGrade: 'A'
        },
        financials: {
            principalAmount: 4000000,
            disbursedAmount: 4000000,
            outstandingBalance: 0,
            interestRate: 9.0,
            interestType: 'fixed',
            termMonths: 60,
            repaymentMethod: 'EMI',
            repaymentFrequency: 'Monthly',
            startDate: '2020-06-01',
            endDate: '2025-06-01',
            daysPastDue: 0,
            emiAmount: 83030,
            principalPaid: 4000000,
            interestPaid: 845000
        },
        collateral: {
            id: 'COL-003',
            type: 'Vehicle',
            description: 'BMW X1 sDrive20d xLine',
            value: 4500000,
            valuationDate: '2020-05-20',
            currency: 'INR',
            ltvRatio: 88,
            isVerified: true,
            legalStatus: 'clear',
            registrationNumber: 'DL-01-CQ-1234',
            chassisNumber: 'WBAXXXXXXXX12345',
            engineNumber: 'N47DXXXXXXX'
        },
        closure: {
            closureType: 'paid',
            closedBy: 'Admin',
            closedByRole: 'Super Admin',
            closedAt: '2024-01-15T14:00:00Z',
            closureReason: 'Borrower prepaid full outstanding amount',
            closureNotes: 'Early closure via full settlement. No dues pending.',
            finalSettlementAmount: 1245000,
            settlementBreakdown: { principal: 1200000, interest: 45000, penalties: 0, otherCharges: 0 },
            paymentMethod: 'NEFT',
            transactionId: 'NEFT-2024-0115-SETTLE',
            paymentProofUrls: ['#settlement-receipt'],
            nocGenerated: true,
            nocNumber: 'NOC-2024-5592',
            nocGeneratedAt: '2024-01-15T14:15:00Z',
            nocSentVia: ['email', 'whatsapp'],
            nocSentAt: '2024-01-15T14:30:00Z',
            completionCertificateUrl: '#noc-certificate',
            retentionPeriodYears: 7,
            archiveDate: '2031-01-15',
            purgeDate: '2031-01-15'
        },
        documents: [
            { id: 'd1', name: 'NOC Certificate.pdf', type: 'Closure', category: 'mandatory', status: 'verified', uploadedBy: 'System', uploadedAt: '2024-01-15', url: '#' },
            { id: 'd2', name: 'Final Settlement Statement.pdf', type: 'Closure', category: 'mandatory', status: 'verified', uploadedBy: 'System', uploadedAt: '2024-01-15', url: '#' },
            { id: 'd3', name: 'Form 35 (Hypothecation Removal).pdf', type: 'Legal', category: 'mandatory', status: 'verified', uploadedBy: 'Legal Team', uploadedAt: '2024-01-16', url: '#' },
            { id: 'd4', name: 'Updated RC Book.pdf', type: 'Legal', category: 'mandatory', status: 'verified', uploadedBy: 'System', uploadedAt: '2024-01-25', url: '#' }
        ],
        auditTrail: completedLoanAuditTrail,
        paymentHistory: [
            { id: 'TX-SETTLE', date: '2024-01-15', type: 'settlement', paymentType: 'full_settlement', amount: 1245000, status: 'completed', instrument: 'NEFT', referenceId: 'NEFT-2024-0115-SETTLE', notes: 'Full settlement payment' }
        ],
        currency: 'INR'
    }
];

// Export loan by ID finder helper
export const getLoanById = (id: string): Loan | undefined => {
    return mockLoans.find(l => l.id === id || l.referenceId === id);
};

// Export loans by status helper
export const getLoansByStatus = (status: Loan['status']): Loan[] => {
    return mockLoans.filter(l => l.status === status);
};
