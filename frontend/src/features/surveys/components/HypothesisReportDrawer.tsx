import { useState, useEffect, useRef } from 'react'
import {
    Download, Bot, User, Target, TrendingUp, Users, BarChart2,
    Lightbulb, Cpu, BrainCircuit, Activity, ArrowRight, Layers,
    CheckCircle, AlertTriangle, FileText
} from 'lucide-react'
import { Button, SideDrawer, KPICard } from '@/components/ui'
import { cn } from '@/utils'

// ============ TYPES ============

interface HypothesisReport {
    meta: {
        title: string
        id: string
        product: string
        team: string
        date: string
        status: 'validated' | 'invalidated' | 'inconclusive'
    }
    background: {
        problem: string
        importance: string
        currentState: string
        evidence: string
    }
    objective: string
    hypothesis: {
        statement: string
        reasoning: string
    }
    assumptions: {
        user: string
        technical: string
        business: string
    }
    segment: {
        persona: string
        demographics: string
        intent: string
    }
    method: {
        type: string
        design: string
        sampleSize: string
        duration: string
    }
    metrics: {
        primary: string
        secondary: string
        guardrail: string
    }
    dataCollection: {
        tools: string
        tracking: string
        sources: string
    }
    results: {
        quantitative: string
        qualitative: string
        significance: string
    }
    analysis: {
        worked: string
        didntWork: string
        unexpected: string
        comparison: string
    }
    outcome: {
        result: 'Validated' | 'Invalidated' | 'Inconclusive'
        reasoning: string
    }
    learnings: {
        userLearnings: string
        productLearnings: string
        understandingChange: string
    }
    decision: {
        action: string
        followUp: string
        uxChanges: string
    }
    risks: {
        limitations: string
        bias: string
        externalFactors: string
    }
    impact: {
        business: string
        confidence: string
        scalability: string
    }
}

interface ChatMessage {
    id: number
    text: string
    isUser: boolean
    time: string
}

// ============ MOCK GENERATOR ============

const generateReport = (hypothesisTitle: string, result: boolean): HypothesisReport => {
    const isWin = result

    return {
        meta: {
            title: hypothesisTitle,
            id: `HYP-${Math.floor(Math.random() * 10000)}`,
            product: 'HouseFin Man Core',
            team: 'Growth & Acquisition',
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            status: isWin ? 'validated' : 'inconclusive'
        },
        background: {
            problem: "Users are dropping off at the documentation stage due to perceived complexity and lack of immediate guidance.",
            importance: "This drop-off reduces our lead-to-loan conversion rate by an estimated 15%, impacting monthly revenue.",
            currentState: "Currently, 25% of qualified leads abandon the form on page 3. CSAT for this section is 2.8/5.",
            evidence: "Heatmaps show rage clicks on file uploaders. User sessions reveal long pauses before abandonment."
        },
        objective: "To increase the completion rate of the documentation upload step by simplifying the UI and adding AI guidance.",
        hypothesis: {
            statement: `We believe that ${hypothesisTitle.toLowerCase()} for first-time home buyers will result in a 10% increase in form completion because it reduces cognitive load and anxiety.`,
            reasoning: "Providing instant feedback and simplifying the visual hierarchy will make the task feel less daunting."
        },
        assumptions: {
            user: "Users have the documents ready but are unsure of the format requirements.",
            technical: "The new file uploader component handles larger files without latency.",
            business: "Higher completion rates will translate directly to approved loans without quality degradation."
        },
        segment: {
            persona: "First-time Borrower (Urban)",
            demographics: "Ages 25-35, Tech-savvy, High intent",
            intent: "Seeking quick pre-approval for property booking."
        },
        method: {
            type: "A/B Test",
            design: "50% Control (Old Flow) vs 50% Variant (New Flow)",
            sampleSize: "2,500 Users per variant",
            duration: "14 Days"
        },
        metrics: {
            primary: "Documentation Step Completion Rate",
            secondary: "Time on Page",
            guardrail: "Support Ticket Volume (Should not increase)"
        },
        dataCollection: {
            tools: "Mixpanel, PostHog, Hotjar",
            tracking: "upload_start, upload_error, upload_success, step_complete",
            sources: "Web App Events & Backend Logs"
        },
        results: {
            quantitative: isWin ? "Variant showed a 14.2% increase in completion rate (Confidence: 98%)." : "Variant showed a 1.2% increase, which is within the margin of error.",
            qualitative: "Users described the new flow as 'breezy' and 'helpful'. The AI tips were cited as a key delighter.",
            significance: isWin ? "p < 0.01 (Statistically Significant)" : "p = 0.34 (Not Significant)"
        },
        analysis: {
            worked: "The 'Smart Scan' feature reduced manual entry errors by 40%.",
            didntWork: "The progress bar animation caused minor performance jitters on low-end devices.",
            unexpected: "A significant uptake in mobile uploads, previously thought to be desktop-heavy.",
            comparison: "Actual lift exceeded the conservative 10% estimate."
        },
        outcome: {
            result: isWin ? 'Validated' : 'Inconclusive',
            reasoning: isWin ? "Data strongly rejects the null hypothesis. The change works." : "We cannot confidently say this change drives impact."
        },
        learnings: {
            userLearnings: "Users trust the platform more when guided by 'Smart' features.",
            productLearnings: "Mobile-first documentation flows are viable for this segment.",
            understandingChange: "Cognitive load was a bigger barrier than technical friction."
        },
        decision: {
            action: isWin ? "Ship to 100% of traffic immediately." : "Iterate on the design and re-test.",
            followUp: "Monitor support tickets for the next 48 hours post-rollout.",
            uxChanges: "Adopt the 'Smart Scan' pattern for other document heavy forms (e.g., KYC)."
        },
        risks: {
            limitations: "Test was run during a festive offer period, which might have inflated motivation.",
            bias: "Sample skewed slightly towards Android users.",
            externalFactors: "Competitor launched a similar feature midway, potentially setting expectations."
        },
        impact: {
            business: "Projected annual revenue uplift of ₹2.4 Crores based on conversion volume.",
            confidence: "High (90%)",
            scalability: "Scalable to all loan products with minimal engineering effort."
        }
    }
}

// ============ PDF GENERATOR ============

const generatePDF = (report: HypothesisReport) => {
    const win = window.open('', '_blank', 'height=800,width=1200')
    if (!win) return

    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${report.meta.id} - ${report.meta.title}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                
                body { margin: 0; padding: 0; background: #0f172a; font-family: 'Outfit', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                
                .page {
                    width: 1280px; height: 720px;
                    margin: 0 auto;
                    page-break-after: always;
                    position: relative;
                    background: white;
                    overflow: hidden;
                    box-sizing: border-box;
                    display: flex; flex-direction: column;
                }

                /* COVER PAGE */
                .cover { background: #0b0f19; color: white; padding: 60px; justify-content: space-between; position: relative; }
                .cover::before { content: ''; position: absolute; top: -50%; right: -20%; width: 800px; height: 800px; background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; }
                .cover::after { content: ''; position: absolute; bottom: -30%; left: -10%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; }
                
                .brand { display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; z-index: 10; }
                .brand span { color: #8b5cf6; }
                
                .report-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 40px; z-index: 10; }
                .meta-item label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; display: block; margin-bottom: 8px; }
                .meta-item div { font-size: 16px; font-weight: 600; }
                
                .title-hero { font-size: 64px; font-weight: 800; line-height: 1.1; margin-top: auto; margin-bottom: 60px; z-index: 10; text-transform: capitalize; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .status-badge { 
                    padding: 8px 16px; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; display: inline-flex; align-items: center; gap: 8px;
                    border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05);
                }
                .status-badge.validated { color: #34d399; border-color: rgba(52, 211, 153, 0.3); background: rgba(52, 211, 153, 0.1); }
                .status-badge.inconclusive { color: #fbbf24; border-color: rgba(251, 191, 36, 0.3); background: rgba(251, 191, 36, 0.1); }

                /* CONTENT PAGES */
                .content-page { padding: 40px 60px; background: #f8fafc; }
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
                .page-title { font-size: 20px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 12px; }
                .page-subtitle { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: 100%; }
                .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
                .col-span-2 { grid-column: span 2; }
                
                .card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; height: fit-content; position: relative; overflow: hidden; }
                .card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #e2e8f0; }
                .card.work::before { background: #10b981; }
                .card.risk::before { background: #f43f5e; }
                .card.metric::before { background: #8b5cf6; }

                .card-header { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
                
                .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
                .stat-item label { font-size: 10px; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 4px; }
                .stat-item div { font-size: 18px; font-weight: 700; color: #0f172a; }
                .stat-item div.green { color: #10b981; }
                
                .text-block { font-size: 14px; line-height: 1.6; color: #334155; }
                .text-block p { margin-top: 0; }
                
                .highlight-box { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 0 8px 8px 0; font-size: 14px; color: #0c4a6e; font-style: italic; }
                
                .data-pill { display: inline-block; padding: 4px 10px; background: #f1f5f9; border-radius: 4px; font-size: 11px; font-weight: 600; color: #475569; margin-right: 6px; border: 1px solid #e2e8f0; }

                .list-check li { padding-left: 20px; position: relative; margin-bottom: 8px; }
                .list-check li::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
                
                .footer { margin-top: auto; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
            </style>
        </head>
        <body>
            <!-- COVER -->
            <div class="page cover">
                <div class="brand">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="text-purple-500"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    ANTIGRAVITY<span>AI</span>
                </div>
                
                <div>
                     <div class="report-meta" style="border:none; padding:0; display:block;">
                        <div style="font-size:12px; color:#94a3b8; margin-bottom:4px;">Reference No.</div>
                        <div style="font-size:24px; font-weight:700;">${report.meta.id}</div>
                    </div>
                </div>

                <div class="title-hero">
                    ${report.meta.title}
                </div>
                
                <div class="report-meta">
                     <div class="meta-item">
                        <label>Status</label>
                        <div style="${report.meta.status === 'validated' ? 'color:#34d399' : 'color:#fbbf24'}">${report.meta.status === 'validated' ? 'Validated' : 'Inconclusive'}</div>
                    </div>
                    <div class="meta-item">
                        <label>Product Owner</label>
                        <div>${report.meta.team}</div>
                    </div>
                    <div class="meta-item">
                        <label>Generated On</label>
                        <div>${report.meta.date}</div>
                    </div>
                </div>
            </div>

            <!-- PAGE 1: STRATEGY & DESIGN -->
            <div class="page content-page">
                <div class="page-header">
                    <div class="page-title">01. Strategy & Experiment Design</div>
                    <div class="page-subtitle">${report.meta.id}</div>
                </div>

                <div class="grid-2">
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div class="card">
                            <div class="card-header">2. Background & 3. Objective</div>
                            <div class="text-block" style="margin-bottom: 12px;"><strong>Context:</strong> ${report.background.problem}</div>
                            <div class="text-block"><strong>Objective:</strong> ${report.objective}</div>
                        </div>
                        <div class="card" style="flex: 1;">
                            <div class="card-header">4. Hypothesis Statement</div>
                            <div class="highlight-box">"${report.hypothesis.statement}"</div>
                            <div style="margin-top: 12px;">
                                <div class="card-header" style="margin-bottom:6px;">5. Key Assumptions</div>
                                <div class="text-block font-size:12px;">${report.assumptions.user}</div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                         <div class="card metric">
                            <div class="card-header">6. Target Segment</div>
                            <div class="text-block">
                                <div style="font-weight: 700; margin-bottom: 4px; font-size:16px;">${report.segment.persona}</div>
                                <div style="color: #64748b; font-size: 13px; margin-bottom: 12px;">${report.segment.demographics}</div>
                            </div>
                        </div>
                        <div class="card" style="flex: 1;">
                            <div class="card-header">7. Methodology & 8. Metrics</div>
                            <div class="stat-grid">
                                <div class="stat-item">
                                    <label>Method</label>
                                    <div>${report.method.type}</div>
                                </div>
                                <div class="stat-item">
                                    <label>Sample</label>
                                    <div>${report.method.sampleSize}</div>
                                </div>
                                <div class="stat-item">
                                    <label>Metric</label>
                                    <div style="font-size:14px; line-height:1.2;">${report.metrics.primary}</div>
                                </div>
                            </div>
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
                                <div class="card-header" style="margin-bottom: 8px;">9. Data Collection</div>
                                <div class="text-block" style="font-size:12px;">${report.dataCollection.tools} - ${report.dataCollection.tracking}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div>1. Title / ${report.meta.id}</div>
                    <div>Page 2</div>
                </div>
            </div>

            <!-- PAGE 2: RESULTS & IMPACT -->
            <div class="page content-page">
                 <div class="page-header">
                    <div class="page-title">02. Results & Impact</div>
                    <div class="page-subtitle">CONFIDENTIAL</div>
                </div>

                <div class="grid-2">
                     <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div class="card metric">
                            <div class="card-header">10. Results & Findings</div>
                            <div class="val-huge" style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
                                ${report.results.quantitative}
                            </div>
                            <div class="data-pill" style="background: #ecfdf5; color: #059669; border-color: #a7f3d0;">${report.results.significance}</div>
                        </div>
                        <div class="card work">
                            <div class="card-header">11. Analysis & Insights</div>
                             <div style="display: grid; gap: 12px;">
                                <div><strong style="color:#10b981;">Worked:</strong> ${report.analysis.worked}</div>
                                <div><strong style="color:#ef4444;">Friction:</strong> ${report.analysis.didntWork}</div>
                             </div>
                        </div>
                         <div class="card">
                            <div class="card-header">12. Hypothesis Outcome</div>
                             <div style="font-size: 18px; font-weight: 700; color: #334155;">
                                ${report.outcome.result}
                             </div>
                             <div class="text-block" style="margin-top: 8px; font-size:13px;">${report.outcome.reasoning}</div>
                        </div>
                     </div>
                     <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div class="card" style="background: #0f172a; color: white; border: none;">
                            <div class="card-header" style="color: #94a3b8;">14. Decision & Next Steps</div>
                            <div style="font-size: 20px; font-weight: 700; margin-bottom: 20px; line-height: 1.4;">
                                ${report.decision.action}
                            </div>
                            <ul class="list-check" style="list-style: none; padding: 0; color: #cbd5e1; font-size: 14px;">
                                <li>${report.decision.followUp}</li>
                            </ul>
                        </div>
                         <div class="card" style="flex: 1;">
                            <div class="card-header">13. Learnings & 16. Impact</div>
                            <div class="text-block" style="margin-bottom: 16px;">
                                <strong>Learnings:</strong> ${report.learnings.userLearnings}
                            </div>
                             <div class="stat-grid" style="border-top:1px solid #f1f5f9; padding-top:16px;">
                                <div class="stat-item">
                                    <label>Business Impact</label>
                                    <div class="green">${report.impact.business}</div>
                                </div>
                            </div>
                             <div style="margin-top: 24px; padding: 12px; background: #fff1f2; border-radius: 6px; border: 1px solid #fecdd3; font-size: 12px; color: #be123c;">
                                <strong>15. Risks:</strong> ${report.risks.limitations}
                            </div>
                        </div>
                     </div>
                </div>

                <div class="footer">
                    <div>AI Generated Hypothesis Report</div>
                    <div>Page 3</div>
                </div>
            </div>
        </body>
        </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => {
        win.print()
        win.close()
    }, 1000)
}


// ============ COMPONENT ============

interface HypothesisReportDrawerProps {
    isOpen: boolean
    onClose: () => void
    hypothesis: { hypothesis: string, result: boolean, pValue: number, effect: string } | null
}

export function HypothesisReportDrawer({ isOpen, onClose, hypothesis }: HypothesisReportDrawerProps) {
    const [report, setReport] = useState<HypothesisReport | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedTab, setSelectedTab] = useState('report')
    const [chatInput, setChatInput] = useState('')
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [isRegenerating, setIsRegenerating] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Initial msg
    useEffect(() => {
        if (isOpen && hypothesis && chatHistory.length === 0) {
            setChatHistory([
                { id: 1, text: `I've generated a comprehensive 16-point analysis for "${hypothesis.hypothesis}". You can ask me to refine specific sections or simulate different outcome scenarios.`, isUser: false, time: 'Just now' }
            ])
        }
    }, [isOpen, hypothesis])

    // Scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatHistory])

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!chatInput.trim() || !report) return

        const userMsg = chatInput
        setChatInput('')
        setChatHistory(prev => [...prev, {
            id: Date.now(),
            text: userMsg,
            isUser: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
        setIsRegenerating(true)

        // Simulate AI "Processing" and "Thinking"
        setTimeout(() => {
            let aiText = "I've analyzed your feedback. While I didn't find a specific section to update, I've noted this for the next iteration of the experiment design."

            // Simple keyword matching to simulate "modifying" the report
            if (userMsg.toLowerCase().includes('risk') || userMsg.toLowerCase().includes('limitation')) {
                setReport(prev => prev ? ({
                    ...prev,
                    risks: { ...prev.risks, limitations: "Updated based on user feedback: Added consideration for seasonal variances." }
                }) : null)
                aiText = "I've updated the Risks & Limitations section to include your point about seasonal variances."
            } else if (userMsg.toLowerCase().includes('metric') || userMsg.toLowerCase().includes('kpi')) {
                setReport(prev => prev ? ({
                    ...prev,
                    metrics: { ...prev.metrics, secondary: "Updated: Customer Lifetime Value (LTV)" }
                }) : null)
                aiText = "I've adjusted the Secondary Metrics to prioritize LTV as requested."
            }

            setChatHistory(prev => [...prev, {
                id: Date.now() + 1,
                text: aiText,
                isUser: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
            setIsRegenerating(false)
        }, 1500)
    }

    if (!hypothesis) return null

    return (
        <SideDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">AI Hypothesis Engine</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">16-Point Analysis Report</span>
                </div>
            }
            size="2xl"
            className="md:max-w-7xl"
            noContentPadding
        >
            <div className="flex h-full bg-slate-50 dark:bg-slate-950">
                {/* LEFT: The Report Content (Scrollable) */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-slate-800">
                    {/* Toolbar */}
                    <div className="h-14 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                            {isLoading ? (
                                <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Cpu className="w-3 h-3 animate-spin" /> Generating...
                                </span>
                            ) : (
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                                    report?.outcome.result === 'Validated'
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                )}>
                                    {report?.outcome.result}
                                </span>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-none border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900 dark:text-purple-400 dark:hover:bg-purple-900/20"
                            onClick={() => report && generatePDF(report)}
                            disabled={isLoading}
                        >
                            <Download className="w-4 h-4" /> Download Report
                        </Button>
                    </div>

                    {/* Report Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-black/20">
                        {isLoading || !report ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                                <Bot className="w-12 h-12 animate-bounce text-slate-300" />
                                <div className="text-sm font-medium animate-pulse">Constructing 16-point analysis...</div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                                {/* 1. HEADER section */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none" />

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <Label icon={FileText}>1. Title & ID</Label>
                                            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">{report.meta.title}</h1>
                                            <div className="flex gap-4 text-xs text-slate-500 font-medium ml-1">
                                                <span className="flex items-center gap-1"><BrainCircuit className="w-3 h-3" /> {report.meta.id}</span>
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {report.meta.team}</span>
                                                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {report.meta.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <StatBox label="Confidence" value={report.impact.confidence} icon={Target} />
                                        <StatBox label="Sample Size" value={report.method.sampleSize} icon={Users} />
                                        <StatBox label="Est. Impact" value={report.impact.business} icon={TrendingUp} highlight />
                                    </div>
                                </div>

                                {/* 2-5: CONTEXT & HYPOTHESIS */}
                                <SectionContainer icon={Layers} title="Context & Strategy">
                                    <div className="grid gap-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <DataField label="2. Background & Context" value={report.background.problem} subValue={report.background.evidence} />
                                            <DataField label="3. Objective" value={report.objective} />
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-lg border border-purple-100 dark:border-purple-800/30">
                                            <Label icon={Lightbulb}>4. Hypothesis Statement</Label>
                                            <p className="text-lg font-medium text-purple-900 dark:text-purple-100 italic mb-2">"{report.hypothesis.statement}"</p>
                                            <p className="text-xs text-purple-700 dark:text-purple-300"><strong>Because:</strong> {report.hypothesis.reasoning}</p>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <DataField label="5. Assumptions" value={report.assumptions.user} small />
                                            <DataField label="Assumptions (Tech)" value={report.assumptions.technical} small />
                                            <DataField label="Assumptions (Biz)" value={report.assumptions.business} small />
                                        </div>
                                    </div>
                                </SectionContainer>

                                {/* 6-9: EXPERIMENT */}
                                <SectionContainer icon={Cpu} title="Experiment Design">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <DataField label="6. User Segment" value={report.segment.persona} subValue={report.segment.demographics} />
                                            <DataField label="7. Experiment Method" value={report.method.type} subValue={report.method.design} />
                                        </div>
                                        <div className="space-y-4">
                                            <DataField label="8. Success Metrics" value={report.metrics.primary} subValue={`Guardrail: ${report.metrics.guardrail}`} />
                                            <DataField label="9. Data Collection Plan" value={report.dataCollection.tools} subValue={report.dataCollection.tracking} />
                                        </div>
                                    </div>
                                </SectionContainer>

                                {/* 10-12: RESULTS */}
                                <SectionContainer icon={BarChart2} title="Results & Analysis" highlight>
                                    {/* Key Metrics - KPI Style */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <KPICard
                                            title="Potential Impact"
                                            value={hypothesis.effect}
                                            icon={<TrendingUp />}
                                            variant="emerald"
                                            trend={{ value: "High", direction: "up" }}
                                            compact
                                        />
                                        <KPICard
                                            title="Confidence Score"
                                            value={`${hypothesis.result ? '98' : '65'}%`}
                                            icon={<Target />}
                                            variant={hypothesis.result ? "blue" : "orange"}
                                            compact
                                        />
                                    </div>

                                    <div className="space-y-8 relative">
                                        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800" />
                                        <div className="p-4 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label>10. Results & Findings</Label>
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{report.results.significance}</span>
                                            </div>
                                            <p className="text-slate-800 dark:text-slate-200 font-medium text-lg">{report.results.quantitative}</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <DataField label="11. Analysis & Insights" value={report.analysis.worked} />
                                            <DataField label="Friction Points" value={report.analysis.didntWork} />
                                        </div>

                                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800/50">
                                            <Label>12. Hypothesis Outcome</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                {report.outcome.result === 'Validated' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                                <span className="font-bold text-lg text-slate-900 dark:text-white">{report.outcome.result}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">{report.outcome.reasoning}</p>
                                        </div>
                                    </div>
                                </SectionContainer>

                                {/* 13-16: CONCLUSION */}
                                <SectionContainer icon={Target} title="Decision & Impact">
                                    <div className="grid gap-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded border-l-4 border-slate-500">
                                                <Label>13. Learnings</Label>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">Users: {report.learnings.userLearnings}</p>
                                            </div>
                                            <div className="bg-slate-900 text-white p-4 rounded">
                                                <Label>14. Decision & Next Steps</Label>
                                                <p className="font-bold text-lg mb-1">{report.decision.action}</p>
                                                <p className="text-xs text-slate-400">{report.decision.followUp}</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <DataField label="15. Risks & Limitations" value={report.risks.limitations} subValue={report.risks.externalFactors} />
                                            <DataField label="16. Impact Estimate" value={report.impact.business} subValue={`Scalability: ${report.impact.scalability}`} />
                                        </div>
                                    </div>
                                </SectionContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Chat Interface (Fixed width) */}
                <div className="w-[350px] flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl z-10">
                    <div className="h-14 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <Bot className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Analysis Assistant</span>
                    </div>

                    {/* Chat Messages - CXMessenger Style */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
                        {chatHistory.map(msg => (
                            <div key={msg.id} className={cn("flex group", msg.isUser ? "justify-end" : "justify-start")}>
                                <div className={cn("flex flex-col max-w-[85%]", msg.isUser ? "items-end" : "items-start")}>
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {msg.isUser ? 'You' : 'Assistant'}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-300">• {msg.time}</span>
                                    </div>

                                    <div className={cn(
                                        "px-4 py-3 border shadow-sm relative",
                                        msg.isUser
                                            ? "bg-slate-900 text-white border-slate-900 rounded-tr-none rounded-bl-sm rounded-tl-sm rounded-br-sm"
                                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700 rounded-tl-none rounded-tr-sm rounded-br-sm rounded-bl-sm"
                                    )}>
                                        {/* Tick for chat bubble */}
                                        <div className={cn(
                                            "absolute top-0 w-2.5 h-2.5 border-t bg-inherit border-inherit",
                                            msg.isUser
                                                ? "-right-1.5 skew-x-[45deg] border-r"
                                                : "-left-1.5 skew-x-[-45deg] border-l"
                                        )} />
                                        <p className="text-sm leading-relaxed relative z-10 whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input - Fixed Bottom */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg z-20">
                        <div className="flex items-start gap-0 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                            <textarea
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Refine report (e.g., 'Add a risk about data privacy')..."
                                className="flex-1 px-4 py-3 bg-transparent border-none text-sm resize-none focus:outline-none min-h-[50px] max-h-[100px]"
                                rows={2}
                                disabled={isRegenerating || isLoading}
                            />
                            <div className="p-2 self-end">
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!chatInput.trim() || isRegenerating || isLoading}
                                    className="h-9 w-9 p-0 rounded-none bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-[10px] text-slate-400 font-medium">AI can modify any section of the report</span>
                            <span className="text-[10px] text-slate-300 font-mono">Markdown supported</span>
                        </div>
                    </div>
                </div>
            </div>
        </SideDrawer>
    )
}

// ============ SUB-COMPONENTS ============

function SectionContainer({ title, icon: Icon, children, highlight }: { title: string, icon: any, children: React.ReactNode, highlight?: boolean }) {
    return (
        <div className={cn(
            "p-6 rounded-xl border transition-all hover:shadow-md",
            highlight
                ? "bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-900/50 shadow-sm"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        )}>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            </div>
            {children}
        </div>
    )
}

function DataField({ label, value, subValue, small }: { label: string, value: string, subValue?: string, small?: boolean }) {
    return (
        <div>
            <Label>{label}</Label>
            <p className={cn("font-medium text-slate-800 dark:text-slate-200", small ? "text-xs" : "text-sm leading-relaxed")}>{value}</p>
            {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
        </div>
    )
}

function Label({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) {
    return (
        <div className="flex items-center gap-1.5 mb-1.5">
            {Icon && <Icon className="w-3 h-3 text-slate-400" />}
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{children}</span>
        </div>
    )
}

function StatBox({ label, value, icon: Icon, highlight }: { label: string, value: string, icon: any, highlight?: boolean }) {
    return (
        <div className={cn(
            "p-3 rounded border",
            highlight ? "bg-emerald-50/50 border-emerald-100 dark:border-emerald-900/30" : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700"
        )}>
            <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">{label}</span>
            </div>
            <div className={cn("text-lg font-bold", highlight ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white")}>{value}</div>
        </div>
    )
}
