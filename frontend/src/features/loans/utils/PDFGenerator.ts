import { Loan } from '../types';

export class PDFGenerator {
    private static getPrintWindow(title: string): Window | null {
        const win = window.open('', '_blank', 'height=800,width=800,scrollbars=yes,status=yes');
        if (win) {
            win.document.open();
            win.document.write(`<html><head><title>${title}</title>`);
            win.document.write(`
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 40px; color: #334155; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                    .brand { font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.05em; }
                    .brand span { color: #059669; }
                    .doc-title { text-align: right; }
                    .doc-title h1 { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; color: #1e293b; }
                    .doc-title p { margin: 4px 0 0; font-size: 11px; color: #64748b; font-weight: 500; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
                    .section { margin-bottom: 24px; }
                    .label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #94a3b8; margin-bottom: 4px; letter-spacing: 0.05em; }
                    .value { font-size: 14px; font-weight: 600; color: #1e293b; }
                    table { w-full; border-collapse: collapse; width: 100%; font-size: 12px; }
                    th { text-align: left; padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; }
                    td { padding: 12px 8px; border-bottom: 1px solid #f1f5f9; color: #334155; }
                    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; }
                    .amount { font-family: 'Courier New', monospace; font-weight: 700; }
                    .tag { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; }
                    .success { background: #d1fae5; color: #047857; }
                </style>
            </head><body>`);
            return win;
        }
        return null;
    }

    static generateStatement(loan: Loan, _startDate?: string, _endDate?: string) {
        const win = this.getPrintWindow(`SOA_${loan.referenceId}`);
        if (!win) return;

        win.document.write(`
            <div class="header">
                <div class="brand">Kilonova<span>Fin</span></div>
                <div class="doc-title">
                    <h1>Statement of Account</h1>
                    <p>Ref: ${loan.referenceId}</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div class="grid">
                <div>
                    <div class="section">
                        <div class="label">Customer Details</div>
                        <div class="value">${loan.borrower.name}</div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                            ${loan.borrower.address}<br>
                            ${loan.borrower.phone} | ${loan.borrower.email}
                        </div>
                    </div>
                </div>
                <div>
                    <div class="section">
                        <div class="label">Loan Summary</div>
                        <div class="value">Sanctioned: ₹${loan.financials.principalAmount.toLocaleString()}</div>
                        <div class="value">Current Outstanding: ₹${loan.financials.outstandingBalance.toLocaleString()}</div>
                        <div class="value" style="color: #ef4444;">Overdue: ₹${loan.financials.emiAmount.toLocaleString()}</div>
                    </div>
                    <div class="section">
                        <div class="label">Product</div>
                        <div class="value">${loan.type} Loan (${loan.financials.interestRate}%)</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="label" style="border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Transaction History</div>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Ref ID</th>
                            <th style="text-align: right;">Debit</th>
                            <th style="text-align: right;">Credit</th>
                            <th style="text-align: right;">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${/* Mock Data */ ''}
                        <tr>
                            <td>${new Date(loan.createdAt || Date.now()).toLocaleDateString()}</td>
                            <td>Loan Disbursed</td>
                            <td>SYS-INIT-001</td>
                            <td class="amount" style="text-align: right;">${loan.financials.principalAmount.toLocaleString()}</td>
                            <td class="amount" style="text-align: right;">0.00</td>
                            <td class="amount" style="text-align: right;">${loan.financials.principalAmount.toLocaleString()}</td>
                        </tr>
                        ${loan.paymentHistory?.map(p => `
                        <tr>
                            <td>${new Date(p.date).toLocaleDateString()}</td>
                            <td>Repayment (${p.instrument})</td>
                            <td>${p.transactionId || 'N/A'}</td>
                            <td class="amount" style="text-align: right;">0.00</td>
                            <td class="amount" style="text-align: right;">${p.amount.toLocaleString()}</td>
                            <td class="amount" style="text-align: right;">${(loan.financials.principalAmount - p.amount).toLocaleString()}</td> 
                        </tr>`).join('') || ''}
                    </tbody>
                </table>
            </div>

            <div class="footer">
                <p>This is a computer-generated document and does not require a physical signature.</p>
                <p>Registered Office: 12, Financial District, Cyberabad, Hyderabad, Telangana - 500032</p>
                <p>Report Generated by: System Admin on ${new Date().toLocaleString()}</p>
            </div>
        `);

        win.document.write('</body></html>');
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 500);
    }

    static generateNOC(loan: Loan) {
        const win = this.getPrintWindow(`NOC_${loan.referenceId}`);
        if (!win) return;

        win.document.write(`
            <div class="header">
                <div class="brand">Kilonova<span>Fin</span></div>
                <div class="doc-title">
                    <h1 style="color: #059669;">No Objection Certificate</h1>
                    <p>Cert No: NOC-${Math.floor(Math.random() * 100000)}</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div style="padding: 20px 0; line-height: 1.8; font-size: 14px;">
                <p><strong>To Whom It May Concern,</strong></p>
                
                <p style="margin-top: 20px;">
                    This is to certify that we, <strong>Kilonova Financial Services Ltd.</strong>, have no objection to the closure/release of the loan account details mentioned below, as the full and final settlement has been received by us.
                </p>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; margin: 24px 0; border-radius: 4px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <div class="label">Customer Name</div>
                            <div class="value">${loan.borrower.name}</div>
                        </div>
                         <div>
                            <div class="label">Loan Account Number</div>
                            <div class="value">${loan.referenceId}</div>
                        </div>
                         <div>
                            <div class="label">Product</div>
                            <div class="value">${loan.type} Loan</div>
                        </div>
                        <div>
                            <div class="label">Closure Date</div>
                            <div class="value">${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                <p>
                    The loan account stands fully closed in our books. There are no outstanding dues against this loan account as of date.
                </p>
                <p>
                    Any hypothecation/lien on the asset financed under this loan is hereby released.
                </p>

                <div style="margin-top: 60px; display: flex; justify-content: space-between;">
                    <div>
                        <div style="height: 50px; width: 150px; background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png'); background-size: contain; background-repeat: no-repeat; opacity: 0.6;"></div>
                        <div class="value">Authorized Signatory</div>
                        <div style="font-size: 11px; color: #64748b;">Loan Operations Head</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="border: 2px solid #059669; color: #059669; display: inline-block; padding: 8px 16px; font-weight: 800; text-transform: uppercase; border-radius: 4px; transform: rotate(-5deg);">
                            LOAN CLOSED
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>Kilonova Financial Services Ltd.</p>
            </div>
        `);

        win.document.write('</body></html>');
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 500);
    }
    static generateLoanDetails(loan: Loan) {
        const win = this.getPrintWindow(`LoanReport_${loan.referenceId}`);
        if (!win) return;

        // Helper to format currency
        const cur = (val: number) => val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

        win.document.write(`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
                
                body { margin: 0; padding: 0; background: #f1f5f9; font-family: 'Outfit', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                
                /* 16:9 Landscape Layout (1280px x 720px) */
                .page { 
                    width: 1280px; height: 720px; 
                    margin: 0 auto; 
                    page-break-after: always; 
                    position: relative; 
                    background: white; 
                    overflow: hidden;
                    box-sizing: border-box;
                    padding: 40px 60px;
                    display: flex;
                    flex-direction: column;
                }
                .page:last-child { page-break-after: auto; }
                
                /* Brand & Header */
                .page-header { 
                    display: flex; justify-content: space-between; align-items: flex-end; 
                    padding-bottom: 20px; border-bottom: 2px solid #f1f5f9; margin-bottom: 30px;
                }
                .brand-logo { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; display: flex; align-items: center; gap: 8px; }
                .brand-logo span { color: #2563eb; }
                .header-meta { text-align: right; }
                .header-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; }
                .header-ref { font-size: 14px; font-weight: 600; color: #334155; margin-top: 2px; }

                /* Dashboard Grid System */
                .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
                .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
                .grid-1-2 { display: grid; grid-template-columns: 1fr 2fr; gap: 24px; }
                .col-span-2 { grid-column: span 2; }
                
                /* Cards */
                .card { background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; height: 100%; box-sizing: border-box; }
                .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 12px; letter-spacing: 0.05em; display: flex; justify-content: space-between; align-items: center; }
                
                /* Typography & Data */
                .val-huge { font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1; }
                .val-large { font-size: 24px; font-weight: 700; color: #0f172a; }
                .val-med { font-size: 18px; font-weight: 600; color: #0f172a; }
                
                .label { font-size: 10px; color: #64748b; font-weight: 500; margin-bottom: 4px; }
                .sub-text { font-size: 11px; color: #64748b; margin-top: 4px; font-weight: 500; }
                
                /* Badges & Status */
                .badge { padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; }
                .badge-success { background: #dcfce7; color: #166534; }
                .badge-warning { background: #fef9c3; color: #854d0e; }
                .badge-error { background: #fee2e2; color: #991b1b; }
                .badge-blue { background: #dbeafe; color: #1e40af; }
                .badge-neutral { background: #f1f5f9; color: #475569; }

                .progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-top: 12px; }
                .progress-fill { height: 100%; background: #2563eb; border-radius: 3px; }

                /* Cover Page Specifics */
                .cover-page { 
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
                    color: white;
                    justify-content: center;
                    padding: 0;
                }
                .cover-content { padding: 80px 100px; position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
                .cover-bg-accent { position: absolute; top: 0; right: 0; width: 40%; height: 100%; background: #2563eb; clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%); opacity: 0.1; }
                .cover-line { width: 80px; height: 8px; background: #2563eb; margin-bottom: 30px; }
                .cover-title { font-size: 64px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; letter-spacing: -0.02em; }
                .cover-subtitle { font-size: 24px; font-weight: 300; opacity: 0.8; }
                
                /* Footer */
                .footer { 
                    margin-top: auto; padding-top: 20px; border-top: 1px solid #f1f5f9; 
                    display: flex; justify-content: space-between; color: #94a3b8; font-size: 10px;
                }
                
                /* Legacy Grid for inner pages (optional support) */
                .data-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; row-gap: 32px; }
                .data-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 6px; }
                .data-value { font-size: 14px; font-weight: 500; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
                .data-value.highlight { font-size: 16px; font-weight: 600; color: #2563eb; border-bottom: none; }
                
                table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 16px; }
                th { text-align: left; padding: 12px 16px; background: #f8fafc; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 9px; }
                td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; font-weight: 500; }
                tr:last-child td { border-bottom: none; }
                .amount { font-family: 'Courier New', monospace; font-weight: 600; }
                
                .section-title { 
                    font-size: 16px; font-weight: 700; color: #0f172a; 
                    padding-left: 12px; border-left: 4px solid #2563eb; 
                    margin: 40px 0 24px 0; line-height: 1;
                }
            </style>

            <!-- PAGE 1: COVER -->
            <div class="page cover-page">
                <div class="cover-bg-accent"></div>
                <div class="cover-content">
                    <div>
                        <div style="font-size: 24px; font-weight: 800; margin-bottom: 80px; display: flex; align-items: center; gap: 10px;">
                            <div style="width: 30px; height: 30px; background: #2563eb; border-radius: 6px;"></div>
                            Home FinMan
                        </div>
                        <div class="cover-line"></div>
                        <div class="cover-title">Comprehensive<br>Loan Report</div>
                        <div class="cover-subtitle">Prepared for ${loan.borrower.name}</div>
                    </div>
                    
                    <div class="grid-3" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 40px;">
                        <div>
                            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; margin-bottom: 8px;">Reference ID</div>
                            <div style="font-size: 18px; font-weight: 600; font-family: monospace;">${loan.referenceId}</div>
                        </div>
                         <div>
                            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; margin-bottom: 8px;">Generated On</div>
                            <div style="font-size: 18px; font-weight: 600;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                         <div>
                            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; margin-bottom: 8px;">Confidentiality</div>
                            <div style="font-size: 18px; font-weight: 600;">Strictly Private</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PAGE 2: EXECUTIVE SUMMARY -->
            <div class="page">
                <div class="page-header">
                    <div class="brand-logo">Home <span>FinMan</span></div>
                    <div class="header-meta">
                        <div class="header-title">Executive Dashboard</div>
                        <div class="header-ref">REF: ${loan.referenceId}</div>
                    </div>
                </div>

                <div class="grid-4" style="height: 100%;">
                    <!-- KPI 1 -->
                    <div class="card">
                        <div class="card-title">Sanctioned Amount</div>
                        <div class="val-huge" style="color: #2563eb;">${cur(loan.financials.principalAmount)}</div>
                        <div class="sub-text">Approved on ${new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}</div>
                    </div>
                    
                    <!-- KPI 2 -->
                    <div class="card">
                        <div class="card-title">Outstanding Balance</div>
                        <div class="val-huge">${cur(loan.financials.outstandingBalance)}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(loan.financials.outstandingBalance / loan.financials.principalAmount) * 100}%"></div>
                        </div>
                        <div class="sub-text" style="text-align: right; margin-top: 4px;">${Math.round((loan.financials.outstandingBalance / loan.financials.principalAmount) * 100)}% Remaining</div>
                    </div>

                    <!-- KPI 3 -->
                    <div class="card">
                        <div class="card-title">Interest Rate</div>
                        <div class="val-huge">${loan.financials.interestRate}%</div>
                        <div class="badge badge-blue" style="margin-top: 10px;">FIXED RATE</div>
                    </div>

                    <!-- KPI 4 -->
                    <div class="card">
                        <div class="card-title">Loan Status</div>
                        <div style="font-size: 28px; font-weight: 800; margin-bottom: 8px; text-transform: uppercase; color: ${loan.status === 'ongoing' ? '#166534' : '#854d0e'}">
                            ${loan.status}
                        </div>
                         <div class="sub-text">Next Review: 15 Days</div>
                    </div>
                    <!-- Row 2: Charts & Deep Data -->
                    <div class="card col-span-2">
                        <div class="card-title">Repayment Velocity</div>
                        <div style="height: 200px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 8px; border: 1px dashed #cbd5e1; color: #94a3b8; font-size: 11px;">
                            [ VELOCITY CHART VISUALIZATION ]
                        </div>
                    </div>
                
                    <div class="card col-span-2">
                        <div class="card-title">Financial Health Score</div>
                         <div class="grid-2">
                             <div style="text-align: center; padding: 20px; background: white; border-radius: 8px;">
                                <div style="font-size: 42px; font-weight: 800; color: #166534; margin-bottom: 4px;">98</div>
                                <div class="label">REPAYMENT SCORE</div>
                             </div>
                             <div>
                                <div style="margin-bottom: 16px;">
                                    <div class="label">EMI Coverage Ratio</div>
                                    <div class="val-med">2.4x</div>
                                </div>
                                <div>
                                    <div class="label">LTV Ratio</div>
                                    <div class="val-med">65%</div>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>

                <div class="footer">
                    <div>Home FinMan Confidential Report</div>
                    <div>Page 2 of 8</div>
                </div>




            </div>

            <!-- PAGE 3: BORROWER PROFILE -->
            <div class="page">
                 <div class="page-header">
                    <div class="brand-logo">Home <span>FinMan</span></div>
                     <div class="header-meta">
                        <div class="header-title">Borrower Profile</div>
                        <div class="header-ref">REF: ${loan.referenceId}</div>
                    </div>
                </div>

                <div class="section-title">Personal Information</div>
                <div class="data-grid">
                    <div class="data-group">
                        <div class="data-label">Full Name</div>
                        <div class="data-value">${loan.borrower.name}</div>
                    </div>
                    <div class="data-group">
                        <div class="data-label">Customer ID</div>
                        <div class="data-value">CUST-${loan.borrower.phone.slice(-4)}</div>
                    </div>
                    <div class="data-group">
                        <div class="data-label">Mobile Number</div>
                        <div class="data-value">${loan.borrower.phone}</div>
                    </div>
                    <div class="data-group">
                         <div class="data-label">Email Address</div>
                        <div class="data-value" style="text-transform: lowercase;">${loan.borrower.email}</div>
                    </div>
                </div>

                <div class="section-title" style="margin-top: 60px;">Employment & Income</div>
                 <div class="data-grid">
                    <div class="data-group">
                        <div class="data-label">Employer Name</div>
                        <div class="data-value">${loan.borrower.employerName}</div>
                    </div>
                    <div class="data-group">
                         <div class="data-label">Employment Type</div>
                        <div class="data-value">${loan.borrower.employmentType}</div>
                    </div>
                    <div class="data-group">
                        <div class="data-label">Reported Annual Income</div>
                        <div class="data-value">${cur(loan.borrower.annualIncome)}</div>
                    </div>
                    <div class="data-group">
                         <div class="data-label">Credit Profile</div>
                        <div class="data-value" style="border:none;"><span class="badge ${loan.borrower.creditScore > 750 ? 'badge-success' : 'badge-warning'}">SCORE: ${loan.borrower.creditScore}</span></div>
                    </div>
                </div>

                 <div class="section-title" style="margin-top: 60px;">Registered Addresses</div>
                 <div style="margin-bottom: 32px;">
                    <div class="data-label">Permanent Residence</div>
                    <div class="data-value" style="line-height: 1.5;">${loan.borrower.address}</div>
                 </div>
                 <div>
                    <div class="data-label">Office Address</div>
                    <div class="data-value" style="line-height: 1.5;">Level 4, Tech Park, Outer Ring Road, Bangalore - 560103</div>
                 </div>

                 <div class="page-footer">
                    <div>Page 3 of 8</div>
                    <div>${loan.referenceId}</div>
                </div>
            </div>

            <!-- PAGE 4: LENDER & DISBURSAL DETAILS -->
            <div class="page">
                 <div class="page-header">
                    <div class="brand-logo">Home <span>FinMan</span></div>
                     <div class="header-meta">
                        <div class="header-title">Lender Details</div>
                        <div class="header-ref">REF: ${loan.referenceId}</div>
                    </div>
                </div>

                <div class="section-title">Lending Entity</div>
                <div class="data-grid">
                     <div class="data-group">
                        <div class="data-label">Institution</div>
                        <div class="data-value">Home FinMan Ltd.</div>
                    </div>
                    <div class="data-group">
                        <div class="data-label">Home Branch</div>
                        <div class="data-value">Indiranagar, Bangalore</div>
                    </div>
                     <div class="data-group">
                        <div class="data-label">Relationship Manager</div>
                        <div class="data-value">Vikram Singh <span style="font-size: 10px; color: #64748b;">(EMP-4421)</span></div>
                    </div>
                </div>

                <div class="section-title" style="margin-top: 60px;">Disbursal Statement</div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 50%;">Description</th>
                            <th style="text-align: right;">Amount</th>
                            <th style="text-align: right;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Gross Sanctioned Amount</strong>
                                <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Principal loan amount approved</div>
                            </td>
                            <td class="amount" style="text-align: right;">${cur(loan.financials.principalAmount)}</td>
                            <td style="text-align: right;"><span class="badge badge-success">APPROVED</span></td>
                        </tr>
                         <tr>
                            <td>
                                <strong>Processing Fees</strong>
                                <div style="font-size: 9px; color: #64748b; margin-top: 2px;">1.00% of Sanctioned Amount + GST</div>
                            </td>
                            <td class="amount" style="text-align: right; color: #b91c1c;">- ${cur(loan.financials.principalAmount * 0.01)}</td>
                            <td style="text-align: right;"><span class="badge badge-neutral">DEDUCTED</span></td>
                        </tr>
                         <tr>
                            <td>
                                <strong>Insurance Premium</strong>
                                <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Loan Protection Plan (LPP)</div>
                            </td>
                            <td class="amount" style="text-align: right; color: #b91c1c;">- ${cur(15000)}</td>
                            <td style="text-align: right;"><span class="badge badge-neutral">DEDUCTED</span></td>
                        </tr>
                         <tr style="background: #f1f5f9;">
                            <td style="padding-top: 20px; padding-bottom: 20px;"><strong>NET DISBURSED AMOUNT</strong></td>
                            <td class="amount" style="text-align: right; font-size: 14px; color: #0f172a; padding-top: 20px; padding-bottom: 20px;">${cur(loan.financials.principalAmount * 0.99 - 15000)}</td>
                            <td style="text-align: right; padding-top: 20px; padding-bottom: 20px;"><span class="badge badge-success">CREDITED</span></td>
                        </tr>
                    </tbody>
                </table>

                 <div class="page-footer">
                    <div>Page 4 of 8</div>
                    <div>${loan.referenceId}</div>
                </div>
            </div>

            <!-- PAGE 5: REPAYMENT SCHEDULE -->
             <div class="page">
                 <div class="page-header">
                    <div class="brand-logo">Home <span>FinMan</span></div>
                     <div class="header-meta">
                        <div class="header-title">Repayment Schedule</div>
                        <div class="header-ref">REF: ${loan.referenceId}</div>
                    </div>
                </div>

                <div class="section-title">Amortization Table (First 24 Months)</div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 50px;">#</th>
                            <th>Due Date</th>
                            <th style="text-align: right;">Opening Balance</th>
                            <th style="text-align: right;">Principal</th>
                            <th style="text-align: right;">Interest</th>
                            <th style="text-align: right;">Total EMI</th>
                            <th style="text-align: right;">Closing Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Array.from({ length: 24 }).map((_, i) => {
            const opening = loan.financials.principalAmount - (i * 15000);
            const principal = 15000;
            const interest = 8000;
            const emi = 23000;
            return `
                                <tr style="${i % 2 === 0 ? '' : 'background-color: #fcfcfc;'}">
                                    <td>${i + 1}</td>
                                    <td>${new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                                    <td class="amount" style="text-align: right;">${cur(opening)}</td>
                                    <td class="amount" style="text-align: right;">${cur(principal)}</td>
                                    <td class="amount" style="text-align: right;">${cur(interest)}</td>
                                    <td class="amount" style="text-align: right; font-weight: 700;">${cur(emi)}</td>
                                    <td class="amount" style="text-align: right;">${cur(opening - principal)}</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
                <div style="text-align: center; margin-top: 32px; padding: 16px; background: #f8fafc; border-radius: 4px; font-size: 11px; color: #64748b;">
                    Full repayment schedule encompasses 240 installments. This is a truncated view for the report.
                </div>

                 <div class="page-footer">
                    <div>Page 5 of 8</div>
                    <div>${loan.referenceId}</div>
                </div>
            </div>

            <!-- PAGE 6: PAYMENT HISTORY ANALYTICS -->
            <div class="page">
                 <div class="page-header">
                    <div class="brand-logo">Home <span>FinMan</span></div>
                     <div class="header-meta">
                        <div class="header-title">Payment Analytics</div>
                        <div class="header-ref">REF: ${loan.referenceId}</div>
                    </div>
                </div>

                <div class="section-title">Repayment Consistency</div>
                <div style="height: 200px; background: #fafafa; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px; margin-bottom: 40px;">
                    [ VISUALIZATION: ON-TIME vs DELAYED PAYMENTS ]
                </div>

                <div class="section-title">Recent Ledger Entries</div>
                 <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Transaction Ref</th>
                            <th>Payment Mode</th>
                            <th style="text-align: right;">Amount</th>
                             <th style="text-align: right;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                         ${loan.paymentHistory?.map(p => `
                        <tr>
                            <td>${new Date(p.date).toLocaleDateString()}</td>
                            <td style="font-family: monospace;">${p.transactionId || 'N/A'}</td>
                            <td>${p.instrument}</td>
                            <td class="amount" style="text-align: right;">${cur(p.amount)}</td>
                             <td style="text-align: right;"><span class="badge badge-success">CLEARED</span></td>
                        </tr>`).join('') || '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #94a3b8;">No recent transactions recorded</td></tr>'}
                    </tbody>
                </table>

                 <div class="page-footer">
                    <div>Page 6 of 8</div>
                    <div>${loan.referenceId}</div>
                </div>
            </div>
            
             <!-- PAGE 7: COLLATERAL & DOCUMENTS -->
            <div class="page">
                 <div class="page-header">
                    <div class="brand-logo">Home <span>FinMan</span></div>
                     <div class="header-meta">
                        <div class="header-title">Collateral & Legal</div>
                        <div class="header-ref">REF: ${loan.referenceId}</div>
                    </div>
                </div>
                
                 <div class="section-title">Collateral Details</div>
                  <div class="data-grid">
                    <div class="data-group">
                        <div class="data-label">Asset Classification</div>
                        <div class="data-value">${loan.collateral?.type || 'Residential Property'}</div>
                    </div>
                    <div class="data-group">
                         <div class="data-label">Market Valuation</div>
                        <div class="data-value highlight">${cur(loan.collateral?.value || loan.financials.principalAmount * 1.5)}</div>
                    </div>
                     <div class="data-group" style="grid-column: span 2;">
                        <div class="data-label">Asset Location / Description</div>
                        <div class="data-value" style="line-height: 1.5;">${loan.collateral?.description || '123, Green Park Avenue, Plot 45, Survey No 12/2, Telangana.'}</div>
                    </div>
                </div>

                <div class="section-title" style="margin-top: 60px;">Document Checklist</div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    ${loan.documents.map(d => `
                    <div style="padding: 16px; border: 1px solid #f1f5f9; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; background: #fff;">
                        <div>
                            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">${d.name}</div>
                            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${d.type.toUpperCase()} • Verified in System</div>
                        </div>
                        <span class="badge badge-success">VERIFIED</span>
                    </div>
                    `).join('')}
                </div>

                 <div class="page-footer">
                    <div>Page 7 of 8</div>
                    <div>${loan.referenceId}</div>
                </div>
            </div>

            <!-- PAGE 8: TERMS & DECLARATION -->
            <div class="page">
                 <div class="page-header">
                    <div class="brand-logo">Home <span>FinMan</span></div>
                     <div class="header-meta">
                        <div class="header-title">Terms & Declaration</div>
                        <div class="header-ref">REF: ${loan.referenceId}</div>
                    </div>
                </div>
                
                <div class="section-title">Terms of Agreement</div>
                <div style="font-size: 11px; line-height: 1.8; color: #334155; text-align: justify; column-count: 2; column-gap: 40px;">
                    <p style="margin-bottom: 12px;"><strong>1. INTEREST & REPAYMENT:</strong> The Borrower agrees to repay the Principal amount along with Interest as per the schedule attached. Any delay in payment will attract a penal interest of 2% per month calculated on the overdue amount. The lender reserves the right to adjust interest rates based on changes in the base rate.</p>
                    <p style="margin-bottom: 12px;"><strong>2. PREPAYMENT:</strong> The Borrower may prepay the loan in part or full at any time. Foreclosure charges may apply as per company policy at the time of closure, typically calculated at 2% of the principal outstanding.</p>
                    <p style="margin-bottom: 12px;"><strong>3. SECURITY:</strong> The loan is secured by the collateral mentioned in the report. The Lender reserves the right to enforce security in case of default, utilizing all legal means necessary for recovery under the SARFAESI Act.</p>
                    <p style="margin-bottom: 12px;"><strong>4. INSURANCE:</strong> The borrower is required to maintain valid insurance on the collateral for the entire tenor of the loan, assigning the lender as the beneficiary.</p>
                    <p style="margin-bottom: 12px;"><strong>5. DEFAULT:</strong> Non-payment of three consecutive installments shall constitute an event of default, entitling the lender to recall the entire loan amount immediately.</p>
                    <p style="margin-bottom: 12px;"><strong>6. DECLARATION:</strong> I/We declare that the information provided is true and correct. I/We acknowledge receipt of this loan report and agree to the terms herein.</p>
                </div>

                <div style="margin-top: 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px;">
                    <div>
                        <div style="height: 60px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 12px;">
                             <div style="font-family: 'Dancing Script', cursive; font-size: 24px; color: #2563eb;">Authorized Signatory</div>
                        </div>
                        <div style="border-top: 1px solid #0f172a; padding-top: 8px;">
                            <div class="data-label">Signed for and on behalf of</div>
                            <div class="data-value" style="border: none; padding: 0;">Home FinMan Ltd.</div>
                        </div>
                    </div>
                     <div>
                        <div style="height: 60px; margin-bottom: 12px;"></div>
                        <div style="border-top: 1px solid #0f172a; padding-top: 8px;">
                            <div class="data-label">Borrower Signature</div>
                            <div class="data-value" style="border: none; padding: 0;">${loan.borrower.name}</div>
                        </div>
                    </div>
                </div>

                <div class="page-footer">
                    <div>Page 8 of 8</div>
                    <div>Generated via Home FinMan Core Banking System | Version 2.4.1</div>
                </div>
            </div>
        `);

        win.document.write('</body></html>');
        win.document.close();

        // Wait for styles/images to load then print
        win.focus();
        setTimeout(() => win.print(), 800);
    }
}
