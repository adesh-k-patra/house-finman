export type LogStatus = 'success' | 'warning' | 'error'

export interface AuditLog {
    id: string
    action: string
    user: string
    ip: string
    timestamp: string
    status: LogStatus
    details: any
}

export const dummyLogs: AuditLog[] = [
    { id: '1', action: 'Login Success', user: 'Admin User', ip: '192.168.1.1', timestamp: 'Jan 6, 10:45 AM', status: 'success', details: { browser: 'Chrome 120.0', os: 'Windows 11', location: 'Mumbai, India' } },
    { id: '2', action: 'Lead Deleted', user: 'Sales Manager', ip: '192.168.1.1', timestamp: 'Jan 6, 10:30 AM', status: 'warning', details: { leadId: 'LD-2025-089', reason: 'Duplicate Entry', deletedBy: 'sales_mgr_01' } },
    { id: '3', action: 'Create Partner', user: 'Admin User', ip: '192.168.1.1', timestamp: 'Jan 6, 09:15 AM', status: 'success', details: { partnerId: 'PTR-2026-003', name: 'Elite Realty', type: 'Agency' } },
    { id: '4', action: 'Failed Login', user: 'Unknown', ip: '203.0.113.45', timestamp: 'Jan 5, 11:20 PM', status: 'error', details: { attempts: 3, reason: 'Invalid Password', location: 'Unknown Proxy' } },
    { id: '5', action: 'Config Updated', user: 'System Admin', ip: '192.168.1.1', timestamp: 'Jan 5, 04:30 PM', status: 'success', details: { configKey: 'max_loan_limit', oldValue: '50000000', newValue: '75000000' } },
    { id: '6', action: 'User Deactivated', user: 'Super Admin', ip: '192.168.1.10', timestamp: 'Jan 5, 02:15 PM', status: 'warning', details: { userId: 'USR-005', reason: 'Policy Violation' } },
    { id: '7', action: 'Password Reset', user: 'Priya Singh', ip: '10.0.0.12', timestamp: 'Jan 5, 01:00 PM', status: 'success', details: { method: 'Email Link' } },
    { id: '8', action: 'Export Report', user: 'Finance User', ip: '192.168.1.5', timestamp: 'Jan 5, 11:45 AM', status: 'success', details: { reportType: 'Monthly Revenue', format: 'PDF' } },
    { id: '9', action: 'API Error', user: 'System', ip: 'localhost', timestamp: 'Jan 5, 10:30 AM', status: 'error', details: { endpoint: '/api/v1/sync', error: 'Timeout 5000ms' } },
    { id: '10', action: 'New Lead Added', user: 'Rahul Verma', ip: '192.168.1.8', timestamp: 'Jan 5, 09:15 AM', status: 'success', details: { leadId: 'LD-2024-001', source: 'Manual Entry' } },
    { id: '11', action: 'Ticket Resolved', user: 'Suresh Kumar', ip: '192.168.1.4', timestamp: 'Jan 4, 05:45 PM', status: 'success', details: { ticketId: 'TKT-2026-005', resolutionTime: '24h' } },
    { id: '12', action: 'Document Upload', user: 'Customer Portal', ip: '110.22.33.44', timestamp: 'Jan 4, 03:20 PM', status: 'success', details: { docType: 'Aadhaar', size: '2MB' } },
    { id: '13', action: 'Suspicious Activity', user: 'Unknown', ip: '45.12.34.89', timestamp: 'Jan 4, 02:00 AM', status: 'error', details: { event: 'Multiple failed logins', alertLevel: 'High' } },
    { id: '14', action: 'Vendor Approved', user: 'Ops Manager', ip: '192.168.1.15', timestamp: 'Jan 3, 04:00 PM', status: 'success', details: { vendorId: 'VN-2024-001' } },
    { id: '15', action: 'Payment Processed', user: 'Finance System', ip: 'System', timestamp: 'Jan 3, 02:30 PM', status: 'success', details: { amount: 25000, txnId: 'TXN-998877' } },
    { id: '16', action: 'SLA Breach Update', user: 'System', ip: 'System', timestamp: 'Jan 3, 10:00 AM', status: 'warning', details: { ticketId: 'TKT-2026-004', breachTime: '2h' } },
    { id: '17', action: 'Integration Sync', user: 'Job Scheduler', ip: 'System', timestamp: 'Jan 3, 06:00 AM', status: 'success', details: { integration: 'Salesforce', recordsSynced: 150 } },
    { id: '18', action: 'Role Modified', user: 'Super Admin', ip: '192.168.1.10', timestamp: 'Jan 2, 05:15 PM', status: 'warning', details: { role: 'Sales Agent', permission: 'View All Leads', action: 'Added' } },
    { id: '19', action: 'Backup Completed', user: 'System', ip: 'System', timestamp: 'Jan 2, 01:00 AM', status: 'success', details: { size: '4.5GB', location: 'AWS S3' } },
    { id: '20', action: 'Property Listed', user: 'Rohit Sharma', ip: '192.168.1.7', timestamp: 'Jan 1, 11:30 AM', status: 'success', details: { propId: 'PROP-2024-001', type: 'Apartment' } },
    { id: '21', action: 'Email Campagin Sent', user: 'Marketing User', ip: '192.168.1.9', timestamp: 'Jan 1, 10:00 AM', status: 'success', details: { campaign: 'New Year Offer', recipients: 5000 } },
    { id: '22', action: 'System Update', user: 'DevOps', ip: '10.0.0.5', timestamp: 'Dec 31, 11:59 PM', status: 'success', details: { version: 'v2.4.0', status: 'Deployed' } },
    { id: '23', action: 'Bulk Import', user: 'Admin User', ip: '192.168.1.1', timestamp: 'Dec 31, 04:00 PM', status: 'success', details: { entity: 'Leads', count: 50 } },
    { id: '24', action: 'Database Connection Error', user: 'System', ip: 'System', timestamp: 'Dec 31, 09:00 AM', status: 'error', details: { db: 'replica-primary', error: 'Connection Refused' } },
    { id: '25', action: 'Contract Generated', user: 'Legal Team', ip: '192.168.1.20', timestamp: 'Dec 30, 03:45 PM', status: 'success', details: { partner: 'Elite Realty', type: 'Exclusive' } },
    { id: '26', action: 'Login Success', user: 'Amit Kumar', ip: '192.168.1.8', timestamp: 'Dec 30, 09:00 AM', status: 'success', details: { device: 'Mobile' } },
    { id: '27', action: 'Settings Changed', user: 'Admin', ip: '192.168.1.1', timestamp: 'Dec 29, 05:30 PM', status: 'warning', details: { setting: 'Session Timeout', value: '30m' } },
    { id: '28', action: 'Logout', user: 'Amit Kumar', ip: '192.168.1.8', timestamp: 'Dec 29, 06:00 PM', status: 'success', details: { duration: '8h 15m' } },
    { id: '29', action: 'Security Scan', user: 'System', ip: 'System', timestamp: 'Dec 29, 01:00 AM', status: 'success', details: { vulnsFound: 0 } },
    { id: '30', action: 'File Downloaded', user: 'Priya Singh', ip: '192.168.1.12', timestamp: 'Dec 28, 02:20 PM', status: 'success', details: { file: 'Q4_Report.pdf' } },
    { id: '31', action: 'Login Failed', user: 'guest', ip: '185.34.22.11', timestamp: 'Dec 28, 11:00 AM', status: 'error', details: { reason: 'User not found' } },
    { id: '32', action: 'New User Created', user: 'HR Admin', ip: '192.168.1.25', timestamp: 'Dec 28, 10:00 AM', status: 'success', details: { username: 'intern_01', role: 'Intern' } },
    { id: '33', action: 'Cache Cleared', user: 'System', ip: 'System', timestamp: 'Dec 28, 06:00 AM', status: 'success', details: { type: 'Redis' } },
    { id: '34', action: 'Invoice Generated', user: 'Finance Bot', ip: 'System', timestamp: 'Dec 27, 03:00 PM', status: 'success', details: { invId: 'INV-2024-999', amount: 1500 } },
    { id: '35', action: 'Payment Failed', user: 'Customer', ip: 'Mobile App', timestamp: 'Dec 27, 01:15 PM', status: 'error', details: { reason: 'Insufficient Funds' } },
    { id: '36', action: 'Ticket Created', user: 'Customer', ip: 'Web Portal', timestamp: 'Dec 27, 11:30 AM', status: 'success', details: { ticketId: 'TKT-2026-001' } },
    { id: '37', action: 'Lead Assigned', user: 'Sales Head', ip: '192.168.1.2', timestamp: 'Dec 27, 09:45 AM', status: 'success', details: { lead: 'LD-2024-100', to: 'Rahul Verma' } },
    { id: '38', action: 'Call Logged', user: 'Rahul Verma', ip: 'Mobile', timestamp: 'Dec 26, 04:30 PM', status: 'success', details: { duration: '5m', outcome: 'Interested' } },
    { id: '39', action: 'Meeting Scheduled', user: 'Priya Singh', ip: '192.168.1.12', timestamp: 'Dec 26, 02:00 PM', status: 'success', details: { with: 'Client X', time: 'Tomorrow 10 AM' } },
    { id: '40', action: 'Note Added', user: 'Amit Kumar', ip: '192.168.1.8', timestamp: 'Dec 26, 11:15 AM', status: 'success', details: { entity: 'Lead', id: '123' } },
    { id: '41', action: 'Profile Updated', user: 'User 007', ip: '192.168.1.50', timestamp: 'Dec 25, 08:00 PM', status: 'success', details: { field: 'Phone Number' } },
    { id: '42', action: 'Server Restart', user: 'System', ip: 'System', timestamp: 'Dec 25, 03:00 AM', status: 'warning', details: { reason: 'Scheduled Maintenance' } },
    { id: '43', action: 'License Expiring', user: 'System', ip: 'System', timestamp: 'Dec 24, 09:00 AM', status: 'warning', details: { software: 'Zoom', daysLeft: 7 } },
    { id: '44', action: 'Knowledge Base Article Added', user: 'Content Team', ip: '192.168.1.30', timestamp: 'Dec 23, 04:00 PM', status: 'success', details: { title: 'How to file Taxes' } },
    { id: '45', action: 'Feedback Received', user: 'Customer', ip: 'Web', timestamp: 'Dec 23, 02:00 PM', status: 'success', details: { rating: 5, comment: 'Great service' } },
    { id: '46', action: 'Integration Disconnected', user: 'Admin', ip: '192.168.1.1', timestamp: 'Dec 23, 10:00 AM', status: 'error', details: { integration: 'Slack' } },
    { id: '47', action: 'API Rate Limit', user: 'External App', ip: '203.0.113.10', timestamp: 'Dec 22, 11:45 PM', status: 'warning', details: { endpoint: '/api/leads', count: 1000 } },
    { id: '48', action: 'Webhook Triggered', user: 'Stripe', ip: '54.54.54.54', timestamp: 'Dec 22, 06:30 PM', status: 'success', details: { event: 'payment_intent.succeeded' } },
    { id: '49', action: 'Notification Sent', user: 'System', ip: 'System', timestamp: 'Dec 22, 09:15 AM', status: 'success', details: { type: 'Push', recipients: 100 } },
    { id: '50', action: 'Disk Space Low', user: 'System', ip: 'System', timestamp: 'Dec 21, 05:00 AM', status: 'error', details: { usage: '95%', volume: '/data' } },
    { id: '51', action: 'New Feature Deployed', user: 'DevOps', ip: '10.0.0.12', timestamp: 'Dec 21, 04:00 AM', status: 'success', details: { feature: 'Dark Mode', version: 'v2.5.0' } },
    { id: '52', action: 'User Permissions Updated', user: 'Admin', ip: '192.168.1.1', timestamp: 'Dec 21, 02:30 PM', status: 'warning', details: { user: 'intern_01', permission: 'read-only' } },
    { id: '53', action: 'Large Transaction', user: 'System', ip: 'System', timestamp: 'Dec 20, 11:00 AM', status: 'warning', details: { amount: 10000000, account: 'ACC-888' } },
    { id: '54', action: 'Partner Onboarded', user: 'Sales Head', ip: '192.168.1.5', timestamp: 'Dec 20, 10:15 AM', status: 'success', details: { partner: 'MagicBricks Connect' } },
    { id: '55', action: 'Failed SSO Login', user: 'Employee', ip: '203.0.113.55', timestamp: 'Dec 19, 09:00 AM', status: 'error', details: { reason: 'Token Invalid' } },
    { id: '56', action: 'Report Generated', user: 'Finance', ip: '192.168.1.4', timestamp: 'Dec 19, 05:45 PM', status: 'success', details: { report: 'Tax Summary', format: 'XLSX' } },
    { id: '57', action: 'Vendor Blacklisted', user: 'Ops Manager', ip: '192.168.1.15', timestamp: 'Dec 18, 11:30 AM', status: 'success', details: { vendor: 'VN-2024-006', reason: 'Fraud' } },
    { id: '58', action: 'API Key Rotated', user: 'System Admin', ip: '192.168.1.1', timestamp: 'Dec 18, 08:00 AM', status: 'success', details: { service: 'SMS Gateway' } },
    { id: '59', action: 'Database Indexing', user: 'System', ip: 'System', timestamp: 'Dec 18, 02:00 AM', status: 'success', details: { duration: '45m' } },
    { id: '60', action: 'Customer Feedback', user: 'Customer', ip: 'Mobile', timestamp: 'Dec 17, 04:20 PM', status: 'warning', details: { rating: 2, comment: 'Buggy app' } },
    { id: '61', action: 'Email Bounce', user: 'System', ip: 'System', timestamp: 'Dec 17, 10:00 AM', status: 'error', details: { campaign: 'Newsletter', count: 120 } },
    { id: '62', action: 'Lead Converted', user: 'Rahul Verma', ip: 'Mobile', timestamp: 'Dec 16, 03:30 PM', status: 'success', details: { lead: 'LD-2024-007' } },
    { id: '63', action: 'Property Price Updated', user: 'Amit Kumar', ip: '192.168.1.8', timestamp: 'Dec 16, 11:00 AM', status: 'success', details: { prop: 'PROP-2024-002', old: 30000000, new: 32000000 } },
    { id: '64', action: 'Loan Disbursed', user: 'Finance System', ip: 'System', timestamp: 'Dec 15, 02:00 PM', status: 'success', details: { loanId: 'LN-2024-88', amount: 5000000 } },
    { id: '65', action: 'Policy Updated', user: 'HR', ip: '192.168.1.25', timestamp: 'Dec 15, 09:00 AM', status: 'success', details: { policy: 'Leave Policy' } }
]
