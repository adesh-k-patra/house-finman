// ============================================
// LOAN STATUS & STAGE TYPES
// ============================================

export type LoanStatus =
    | 'pending'           // Applied, Underwriting
    | 'under-review'      // Escalated / More Info Requested
    | 'approved'          // 24h Notification Window
    | 'ongoing'           // Active, Servicing
    | 'completed'         // Closed, Paid
    | 'rejected'          // Rejected
    | 'spam'              // Quarantined
    | 'written-off'       // Written off / Bad Debt
    | 'archived';         // Archived after retention period

export type LoanStage = 'Application' | 'Underwriting' | 'Approval' | 'Disbursement' | 'Repayment' | 'Closed' | 'Written-off';

export type ApprovalType = 'instant' | 'scheduled_24h' | 'manual';

export type ClosureType = 'paid' | 'write-off' | 'settlement' | 'transfer' | 'repossession';

export type PaymentType = 'single_emi' | 'full_settlement' | 'partial' | 'prepayment';

export type AllocationPriority = 'penalty_first' | 'interest_first';

// ============================================
// BORROWER & KYC INTERFACES
// ============================================

export interface CoBorrower {
    id: string;
    name: string;
    relation: string;
    panNumber?: string;
    phone?: string;
    email?: string;
    kycStatus: 'verified' | 'pending' | 'rejected';
    creditScore?: number;
    annualIncome?: number;
}

export interface BorrowerProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    altPhone?: string;
    dob?: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
    panNumber?: string; // Masked
    aadhaarNumber?: string; // Masked
    passportNumber?: string;
    kycStatus: 'verified' | 'pending' | 'rejected';
    ckycId?: string;
    address: string;
    mailingAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
    residenceType?: 'Owned' | 'Rented' | 'Family' | 'Company Provided';
    yearsAtAddress?: number;
    employmentType: 'Salaried' | 'Self-Employed' | 'Business' | 'Other';
    employerName?: string;
    designation?: string;
    employerAddress?: string;
    yearsWithEmployer?: number;
    gstNumber?: string; // For business
    annualIncome: number;
    payFrequency?: 'Monthly' | 'Weekly' | 'Annually';
    bankName?: string;
    bankAccountNumber?: string; // Last 4 digits
    ifscCode?: string;
    eMandateStatus?: 'active' | 'inactive' | 'pending' | 'failed';
    creditScore: number;
    creditScoreDate?: string;
    creditBureau?: 'CIBIL' | 'Experian' | 'Equifax' | 'CRIF';
    riskScore: number;
    internalRiskGrade?: 'A' | 'B' | 'C' | 'D' | 'E';
    existingDebtAmount?: number;
    existingEmiAmount?: number;
    totalExistingLoans?: number;
    coBorrowers?: CoBorrower[];
    communicationPreference?: 'email' | 'sms' | 'whatsapp' | 'all';
}

// ============================================
// APPROVAL WINDOW & WORKFLOW
// ============================================

export interface ApprovalEditHistory {
    id: string;
    field: string;
    oldValue: string;
    newValue: string;
    editedBy: string;
    editedAt: string;
    requiresReApproval: boolean;
}

export interface ApprovalWindow {
    approvedBy: string;
    approverRole: string;
    approvalType: ApprovalType;
    approvedAt: string;
    expiresAt: string; // 24h from approval
    scheduledJobId?: string;
    notificationStatus: 'waiting' | 'sent' | 'cancelled';
    notificationSentAt?: string;
    cancellationReason?: string;
    cancelledBy?: string;
    cancelledAt?: string;
    editHistory?: ApprovalEditHistory[];
    escalatedTo?: string;
    escalationReason?: string;
}

// ============================================
// DOCUMENT VERIFICATION
// ============================================

export interface DocumentVerification {
    verifierId: string;
    verifierName: string;
    verifiedAt: string;
    verificationMethod: 'manual' | 'ocr' | 'api' | 'auto';
    verificationNotes?: string;
    confidence?: number; // 0-100 for OCR/API
}

export interface LoanDocument {
    id: string;
    name: string;
    type: string; // KYC, Income, Property, Agreement, etc.
    category: 'mandatory' | 'optional' | 'supporting';
    status: 'uploaded' | 'verified' | 'review' | 'rejected' | 'expired' | 'resubmission_requested';
    uploadedBy: string;
    uploadedAt: string;
    url: string;
    fileSize?: number; // bytes
    fileType?: string; // pdf, jpg, png
    fileHash?: string; // SHA-256 for integrity
    notes?: string;
    tags?: string[];
    rejectionReason?: string;
    verifierName?: string;
    verifiedAt?: string;
    verification?: DocumentVerification;
    annotationUrl?: string;
    resubmissionRequestedAt?: string;
    resubmissionDeadline?: string;
    expiryDate?: string;
    iseSigned?: boolean;
    eSignTimestamp?: string;
    eSignerName?: string;
    eSignCertificateUrl?: string;
}

// ============================================
// COLLATERAL & GUARANTORS
// ============================================

export interface CollateralValuation {
    id: string;
    valuationDate: string;
    valuationType: 'initial' | 'revaluation' | 'forced_sale';
    valuedBy: string;
    agency?: string;
    amount: number;
    reportUrl?: string;
}

export interface Collateral {
    id?: string;
    type: string; // Apartment, House, Vehicle, etc.
    description: string;
    value: number;
    valuationDate?: string;
    valuationHistory?: CollateralValuation[];
    currency: string;
    address?: string;
    ltvRatio: number;
    isVerified: boolean;
    verificationDate?: string;
    verifiedBy?: string;
    image?: string;
    propertyType?: string;
    configuration?: string;
    name?: string;
    propertyId?: string;
    legalStatus?: 'clear' | 'encumbered' | 'disputed' | 'pending_verification';
    encumbranceDetails?: string;
    insuranceStatus?: 'active' | 'expired' | 'none';
    insurancePolicyNumber?: string;
    registrationNumber?: string; // For vehicles
    chassisNumber?: string;
    engineNumber?: string;
}

export interface Guarantor {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address: string;
    panNumber?: string;
    kycStatus: 'verified' | 'pending' | 'rejected';
    creditScore?: number;
    annualIncome?: number;
    employerName?: string;
    netWorth?: number;
    guaranteeAmount: number;
    documentIds?: string[];
}

// ============================================
// FINANCIAL & PAYMENT
// ============================================

export interface LoanFinancials {
    principalAmount: number;
    requestedAmount?: number;
    sanctionedAmount?: number;
    disbursedAmount?: number;
    outstandingBalance: number;
    interestRate: number;
    effectiveRate?: number;
    interestType: 'fixed' | 'floating';
    baseRate?: string; // e.g., "MCLR", "Repo Rate"
    spread?: number;
    repricingDate?: string;
    termMonths: number;
    tenureRemaining?: number;
    repaymentMethod: 'EMI' | 'Bullet' | 'Custom' | 'Step-up' | 'Step-down';
    repaymentFrequency: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Yearly';
    startDate?: string;
    endDate?: string;
    maturityDate?: string;
    nextDueDate?: string;
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
    gracePeriodDays?: number;
    daysPastDue: number;
    dpdBucket?: 'Current' | '1-30' | '31-60' | '61-90' | '90+';
    emiAmount: number;
    principalPaid?: number;
    interestPaid?: number;
    penaltyOutstanding?: number;
    lateFees?: number;
    processingFeePaid?: number;
    prepaymentCharges?: number;
    margin?: number;
    moratoriumEndDate?: string;
    holidayPeriods?: { start: string; end: string; reason: string }[];
}

export interface PaymentAllocation {
    principalPortion: number;
    interestPortion: number;
    penaltyPortion: number;
    feesPortion: number;
    allocationPriority: AllocationPriority;
}

export interface PaymentTransaction {
    id: string;
    transactionId?: string;

    date: string;
    type: 'principal' | 'interest' | 'penalty' | 'fee' | 'adjustment' | 'emi' | 'prepayment' | 'settlement';
    paymentType?: PaymentType;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'reversed' | 'processing';
    instrument: 'Bank Transfer' | 'UPI' | 'NEFT' | 'RTGS' | 'Cheque' | 'Card' | 'Wallet' | 'Cash' | 'ACH' | 'Adjustment' | 'Internal';
    referenceId?: string;
    bankReferenceId?: string;
    proofUrl?: string;
    notes?: string;
    allocation?: PaymentAllocation;
    postedBy?: string;
    postedAt?: string;
    reversedBy?: string;
    reversedAt?: string;
    reversalReason?: string;
    journalEntryId?: string;
    reconciledAt?: string;
    bankStatementLineId?: string;
}

// ============================================
// RISK ASSESSMENT
// ============================================

export interface RiskAssessment {
    overallRiskScore: number;
    riskGrade: 'Low' | 'Medium' | 'High' | 'Critical';
    dscr?: number; // Debt Service Coverage Ratio
    dtiRatio?: number; // Debt to Income Ratio
    foir?: number; // Fixed Obligations to Income Ratio
    ltvRatio: number;
    npaRisk: 'Low' | 'Medium' | 'High';
    npaProbability?: number;
    portfolioAtRisk?: boolean;
    vintageMonths?: number;
    previousDefaults?: number;
    defaultAmount?: number;
    writeOffHistory?: boolean;
    adverseMediaHits?: number;
    adverseMediaDetails?: string[];
    pepStatus: 'not_pep' | 'pep' | 'pep_related';
    pepDetails?: string;
    sanctionsHits?: number;
    locationRiskTier?: 'Tier1' | 'Tier2' | 'Tier3' | 'Rural';
    industryRisk?: 'Low' | 'Medium' | 'High';
    bureauPullHistory?: {
        date: string;
        bureau: string;
        score: number;
        scoreChange?: number;
    }[];
    fraudIndicators?: string[];
    deviceFingerprint?: {
        deviceId: string;
        riskScore: number;
        previousApplications: number;
        flagged: boolean;
    };
}

// ============================================
// AUDIT & ACTIVITY
// ============================================

export interface AuditLogAttachment {
    id: string;
    name: string;
    url: string;
    type: string;
}

export interface AuditLogChange {
    field: string;
    oldValue: string | number | boolean | null;
    newValue: string | number | boolean | null;
}

export interface AuditLog {
    id: string;
    action: string;
    actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'payment' | 'document' | 'notification' | 'escalation' | 'system';
    actorId?: string;
    actorName: string;
    role: string;
    timestamp: string;
    description: string;
    metadata?: Record<string, any>;
    changes?: AuditLogChange[];
    attachments?: AuditLogAttachment[];
    ipAddress?: string;
    userAgent?: string;
    approvalChain?: { role: string; approvedBy: string; approvedAt: string }[];
    isReversible?: boolean;
    reversedBy?: string;
    reversedAt?: string;
    hash?: string; // For audit immutability
}

// ============================================
// NOTIFICATIONS & COMMUNICATIONS
// ============================================

export interface NotificationLog {
    id: string;
    channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app';
    templateId: string;
    templateName: string;
    recipient: string;
    subject?: string;
    content?: string;
    sentAt?: string;
    scheduledFor?: string;
    status: 'sent' | 'delivered' | 'failed' | 'bounced' | 'opened' | 'clicked' | 'scheduled' | 'cancelled';
    errorMessage?: string;
    triggeredBy: string;
    metadata?: Record<string, any>;
}

// ============================================
// LOAN CLOSURE
// ============================================

export interface LoanClosure {
    closureType: ClosureType;
    closedBy: string;
    closedByRole: string;
    closedAt: string;
    closureReason: string;
    closureNotes?: string;
    // For Paid closure
    finalSettlementAmount?: number;
    settlementBreakdown?: {
        principal: number;
        interest: number;
        penalties: number;
        otherCharges: number;
    };
    paymentMethod?: string;
    transactionId?: string;
    paymentProofUrls?: string[];
    nocGenerated: boolean;
    nocNumber?: string;
    nocGeneratedAt?: string;
    nocSentVia?: ('email' | 'sms' | 'whatsapp' | 'courier')[];
    nocSentAt?: string;
    completionCertificateUrl?: string;
    // For Unpaid closure
    writeOffAmount?: number;
    settlementOffer?: number;
    settlementAcceptedBy?: string;
    transferredTo?: string;
    boardApprovalUrl?: string;
    recoveryAmount?: number;
    repossessionDetails?: string;
    // Retention
    retentionPeriodYears?: number;
    archiveDate?: string;
    purgeDate?: string;
}

// ============================================
// INSURANCE
// ============================================

export interface LoanInsurance {
    id: string;
    provider: string;
    policyNumber: string;
    type: 'life' | 'property' | 'credit' | 'comprehensive';
    coverageAmount: number;
    premiumAmount: number;
    premiumFrequency: 'lumpsum' | 'monthly' | 'yearly';
    startDate: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'claimed' | 'cancelled';
    claimHistory?: {
        claimId: string;
        claimDate: string;
        claimAmount: number;
        status: 'pending' | 'approved' | 'rejected' | 'paid';
        reason: string;
    }[];
    nomineeDetails?: {
        name: string;
        relationship: string;
        sharePercent: number;
    }[];
}

// ============================================
// E-MANDATE
// ============================================

export interface EMandateStatus {
    status: 'active' | 'inactive' | 'pending' | 'failed' | 'cancelled';
    provider: string;
    umrn?: string; // Unique Mandate Reference Number
    registeredAt?: string;
    bankAccountLast4: string;
    bankName: string;
    maxAmount: number;
    frequency: 'monthly' | 'as_and_when';
    validUntil?: string;
    lastDebitDate?: string;
    lastDebitAmount?: number;
    lastDebitStatus?: 'success' | 'failed' | 'pending';
    nachReturns?: {
        date: string;
        amount: number;
        returnReason: string;
        returnCode: string;
    }[];
    debitHistory?: {
        date: string;
        amount: number;
        status: 'success' | 'failed';
        referenceId: string;
    }[];
}

// ============================================
// NOTES & COMMENTS
// ============================================

export type LoanNoteCategory = 'underwriter' | 'collection' | 'compliance' | 'general' | 'legal' | 'internal';
export type LoanNoteVisibility = 'public' | 'private' | 'team';

export interface LoanNote {
    id: string;
    content: string;
    category: LoanNoteCategory;
    visibility: LoanNoteVisibility;
    createdBy: string;
    createdByRole: string;
    createdAt: string;
    updatedAt?: string;
    parentId?: string; // For threaded replies
    mentions?: string[];
    attachments?: { id: string; name: string; url: string }[];
    pinned?: boolean;
    reactions?: { emoji: string; userId: string }[];
}

// ============================================
// UNDERWRITING CHECKLIST
// ============================================

export interface UnderwritingChecklistItem {
    id: string;
    name: string;
    category: 'kyc' | 'income' | 'collateral' | 'credit' | 'compliance' | 'other';
    required: boolean;
    status: 'pending' | 'passed' | 'failed' | 'waived';
    verifiedBy?: string;
    verifiedAt?: string;
    notes?: string;
    blockingApproval: boolean;
    waiverReason?: string;
    waivedBy?: string;
}

export interface UnderwritingChecklist {
    kycVerified: boolean;
    incomeVerified: boolean;
    collateralVerified: boolean;
    cibilCheck: boolean;
    amlPassed: boolean;
    fraudCheckPassed: boolean;
    creditScoreAboveThreshold: boolean;
    dtiWithinLimits: boolean;
    allMandatoryDocsVerified: boolean;
    fieldVerificationDone?: boolean;
    legalVerificationDone?: boolean;
    valuationDone?: boolean;
    items?: UnderwritingChecklistItem[];
}

// ============================================
// MAIN LOAN INTERFACE
// ============================================

export interface LoanAgreement {
    id: string;
    name: string;
    type: string;
    signedAt?: string;
    signedBy?: string;
    eSignStatus: 'pending' | 'signed' | 'rejected' | 'expired';
    documentUrl: string;
    certificateUrl?: string;
    pages?: number;
    version?: string;
}

export interface Loan {
    id: string;
    referenceId: string;
    applicationId?: string;
    status: LoanStatus;
    stage: LoanStage;
    type: 'Housing' | 'Auto' | 'Personal' | 'Business' | 'Education' | 'Gold' | 'LAP';
    subType?: string;
    productCode?: string;
    housingTier?: 'High' | 'Medium' | 'Low' | 'Ultra';
    purpose?: string;
    purposeTags?: string[];

    // Dates
    createdAt?: string;
    requestDate: string;
    submittedAt?: string;
    approvedAt?: string;
    disbursedAt?: string;
    activatedAt?: string;
    closedAt?: string;
    archivedAt?: string;

    // Assignment
    assignedOfficer: string;
    assignedOfficerId?: string;
    assignmentHistory?: { officerId: string; officerName: string; assignedAt: string; assignedBy: string }[];
    branchCode?: string;
    branchName?: string;
    region?: string;

    // Core Data Groups
    borrower: BorrowerProfile;
    financials: LoanFinancials;
    collateral: Collateral;
    collaterals?: Collateral[];
    guarantors?: Guarantor[];

    // Verification & Risk
    riskTags: string[];
    riskAssessment?: RiskAssessment;
    amlStatus?: 'pass' | 'warn' | 'fail';
    amlScreeningDate?: string;
    fraudCheck?: 'pass' | 'warn' | 'fail';
    fraudCheckDate?: string;
    underwritingChecklist?: UnderwritingChecklist;

    // Docs & History
    documents: LoanDocument[];
    auditTrail: AuditLog[];
    paymentHistory: PaymentTransaction[];
    notes: string;
    loanNotes?: LoanNote[];
    notificationLog?: NotificationLog[];

    // Features / Metadata
    nextAction?: string;
    nextActionDueDate?: string;
    slaDeadline?: string;
    slaBreach?: boolean;

    // Approval Window Data
    approvalWindow?: ApprovalWindow;

    // Closure Data
    closure?: LoanClosure;

    // Insurance
    insurance?: LoanInsurance;
    insurances?: LoanInsurance[];

    // E-Mandate
    eMandateStatus?: EMandateStatus;

    // Agreements
    agreements?: LoanAgreement[];

    // Disbursement
    disbursements?: {
        id: string;
        trancheNumber: number;
        amount: number;
        disbursedAt: string;
        bankAccountNumber: string;
        transactionId: string;
        status: 'completed' | 'pending' | 'failed';
    }[];

    // Localization
    currency?: string;
    timezone?: string;
    language?: string;

    // Legal
    legalHold?: boolean;
    legalHoldReason?: string;

    // Cross-sell
    crossSellOffers?: {
        offerId: string;
        productType: string;
        offerAmount: number;
        status: 'offered' | 'accepted' | 'rejected' | 'expired';
    }[];
}

// ============================================
// EXPORT UTILITY TYPES
// ============================================

export type LoanListItem = Pick<Loan, 'id' | 'referenceId' | 'status' | 'stage' | 'type' | 'borrower' | 'financials' | 'requestDate' | 'assignedOfficer' | 'riskTags'>;

export type LoanAction =
    | 'approve_instant'
    | 'approve_schedule'
    | 'reject'
    | 'spam'
    | 'under_review'
    | 'request_info'
    | 'assign_officer'
    | 'escalate'
    | 'create_task'
    | 'cancel_approval'
    | 'edit_terms'
    | 'escalate_senior'
    | 'add_payment'
    | 'close_loan'
    | 'restructure'
    | 'emi_holiday'
    | 'prepayment'
    | 'reverse_payment'
    | 'generate_statement'
    | 'send_reminder'
    | 'initiate_legal'
    | 'write_off'
    | 'assign_collections'
    | 'edit_details'
    | 'download_noc'
    | 'final_statement'
    | 'reopen';

export interface LoanActionPayload {
    action: LoanAction;
    loanId: string;
    data?: Record<string, any>;
    notes?: string;
    attachments?: string[];
}
