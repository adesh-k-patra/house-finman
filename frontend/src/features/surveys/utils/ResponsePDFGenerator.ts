
export class ResponsePDFGenerator {
    private static getPrintWindow(title: string): Window | null {
        const win = window.open('', '_blank', 'height=800,width=800,scrollbars=yes,status=yes');
        if (win) {
            win.document.open();
            win.document.write(`<html><head><title>${title}</title>`);
            win.document.write(`
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                    
                    body { margin: 0; padding: 0; background: #f1f5f9; font-family: 'Outfit', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    
                    /* A4 Page Layout */
                    .page { 
                        width: 210mm; min-height: 297mm; 
                        margin: 0 auto; 
                        background: white; 
                        box-sizing: border-box;
                        padding: 40px;
                        display: flex;
                        flex-direction: column;
                        position: relative;
                    }
                    @media print {
                        .page { margin: 0; width: 100%; height: 100%; page-break-after: always; }
                        body { background: white; }
                    }
                    
                    /* Header */
                    .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px; }
                    .brand { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
                    .brand span { color: #2563eb; }
                    .meta { text-align: right; }
                    .meta-title { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; }
                    .meta-val { font-size: 12px; font-weight: 600; color: #334155; }

                    /* Sections */
                    .section-title { 
                        font-size: 14px; font-weight: 800; color: #0f172a; uppercase; letter-spacing: 0.05em; 
                        border-left: 4px solid #2563eb; padding-left: 10px; margin: 30px 0 20px 0;
                    }
                    
                    /* Grid & Cards */
                    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
                    .card-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 5px; }
                    .card-value { font-size: 16px; font-weight: 700; color: #0f172a; }
                    
                    /* QA List */
                    .qa-item { margin-bottom: 15px; page-break-inside: avoid; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
                    .question { font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 5px; }
                    .answer { font-size: 13px; font-weight: 500; color: #0f172a; }
                    .answer-meta { font-size: 9px; color: #94a3b8; margin-top: 4px; display: flex; gap: 10px; }
                    
                    /* Badges */
                    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
                    .badge-blue { background: #eff6ff; color: #1d4ed8; }
                    .badge-green { background: #f0fdf4; color: #15803d; }
                    
                    /* Footer */
                    .footer { margin-top: auto; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 9px; }
                </style>
            </head><body>`);
            return win;
        }
        return null;
    }

    static generateReport(response: any, answers: any[]) {
        const win = this.getPrintWindow(`Response_${response.id}`);
        if (!win) return;

        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        win.document.write(`
            <div class="page">
                <div class="header">
                    <div class="brand">Kilonova<span>Surveys</span></div>
                    <div class="meta">
                        <div class="meta-title">Response Report</div>
                        <div class="meta-val">ID: ${response.id}</div>
                    </div>
                </div>

                <!-- Executive Summary -->
                <div class="grid-2">
                    <div>
                        <div class="card-label">Respondent</div>
                        <div style="font-size: 24px; font-weight: 800; color: #0f172a;">${response.respondent}</div>
                        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Software Engineer • Tech Corp</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="card-label">Submission Date</div>
                        <div class="card-value">${response.date}</div>
                        <div style="font-size: 11px; color: #64748b;">${response.time}</div>
                    </div>
                </div>

                <div class="grid-2" style="margin-top: 20px;">
                    <div class="card">
                        <div class="card-label">Key Metrics</div>
                        <div style="display: flex; gap: 20px; margin-top: 10px;">
                            <div>
                                <div style="font-size: 24px; font-weight: 800; color: #2563eb;">96</div>
                                <div style="font-size: 9px; font-weight: 700; color: #94a3b8;">SCORE</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 800; color: #10b981;">High</div>
                                <div style="font-size: 9px; font-weight: 700; color: #94a3b8;">INTENT</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                         <div class="card-label">Acquisition</div>
                         <div style="font-size: 13px; font-weight: 600;">Google Ads Campaign</div>
                         <div style="font-size: 10px; color: #64748b;">Search Network • PPC</div>
                    </div>
                </div>

                <!-- Response Detail -->
                <div class="section-title">Detailed Responses</div>
                <div style="flex: 1;">
                    ${answers.map((a, i) => `
                        <div class="qa-item">
                            <div class="question">Q${i + 1}. ${a.question}</div>
                            <div class="answer">${a.answer}</div>
                            <div class="answer-meta">
                                <span>Time: ${a.time || '12s'}</span>
                                ${a.sentiment ? `<span>Sentiment: ${a.sentiment}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="footer">
                    Generated on ${dateStr} • Confidential Report
                </div>
            </div>
            <script>
                window.onload = () => { setTimeout(() => window.print(), 500); }
            </script>
        `);

        win.document.write('</body></html>');
        win.document.close();
    }
}
