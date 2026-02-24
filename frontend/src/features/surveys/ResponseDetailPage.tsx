import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    User, Calendar, ArrowLeft, MessageSquare,
    Paperclip, ChevronDown, ChevronRight, Reply,
    CheckCircle, Activity, Play,
    FileText, Download
} from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { ResponseTimeline } from '@/features/surveys/components/ResponseTimeline'
import { FollowUpComposer } from '@/features/surveys/components/FollowUpComposer'
import { UniversalSimulator } from '@/features/surveys/builder/components/UniversalSimulator'
import { DUMMY_QUESTIONS } from '@/features/surveys/builder/contexts/SurveyBuilderContext'
import { cn } from '@/utils'

// ============ SHARP COMPONENT TOKENS ============
const TOKENS = {
    section: "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-4 transition-all hover:shadow-md rounded-none",
    header: "px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer",
    headerTitle: "font-bold text-slate-800 dark:text-white uppercase tracking-wide text-xs flex items-center gap-2",
    content: "p-4 animate-in slide-in-from-top-2 duration-200 rounded-none",
    label: "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block",
    value: "font-medium text-slate-900 dark:text-white text-sm",
    btn: "rounded-none font-bold uppercase tracking-wide text-xs transition-all active:scale-95"
}

// ============ COLLAPSIBLE SECTION ============
function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true, extra }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean, extra?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    return (
        <div className={TOKENS.section}>
            <div className={TOKENS.header} onClick={() => setIsOpen(!isOpen)}>
                <div className={TOKENS.headerTitle}>
                    <Icon className="w-4 h-4 text-slate-500" />
                    {title}
                </div>
                <div className="flex items-center gap-3">
                    {extra}
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
            </div>
            {isOpen && <div className={TOKENS.content}>{children}</div>}
        </div>
    )
}

export function ResponseDetailPage() {
    const { id } = useParams()
    const [isFollowUpOpen, setIsFollowUpOpen] = useState(false)
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
    const [assignedAgent] = useState('Priya Sharma')

    // Mock Data
    const response = {
        id: 'R-77821',
        lead: 'Anjali Gupta',
        email: 'anjali.g@example.com',
        phone: '+91 98765 00000',
        status: 'verified',
        score: 65,
        submittedAt: '2026-01-30T10:30:00',
        source: 'Mobile App',
        location: 'Mumbai, MH',
        answers: [
            { id: 1, question: 'What is your monthly household income?', answer: '₹ 1.5L - 2.5L', type: 'mcq', selected: true },
            { id: 2, question: 'Are you looking for a ready-to-move property?', answer: 'No, Under Construction', type: 'boolean', selected: true },
            { id: 3, question: 'Preferred location?', answer: 'Pune West (Baner, Wakad)', type: 'mcq', selected: true },
            { id: 4, question: 'Primary reason for buying?', answer: 'Investment', type: 'mcq', selected: true },
        ],
        files: [
            { name: 'salary_slip_jan.pdf', size: '1.2 MB', type: 'pdf' },
            { name: 'pan_card.jpg', size: '0.8 MB', type: 'image' }
        ],
        aiAnalysis: {
            sentiment: 'Positive',
            intent: 'High',
            risk: 'Low',
            summary: 'User shows strong intent for investment properties. Financials appear stable.'
        }
    }

    return (
        <div className="w-full w-full mx-auto p-6 md:p-4 h-screen flex flex-col bg-slate-50/50 dark:bg-black/20">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <Button variant="ghost" className="pl-0 hover:bg-transparent text-slate-500 hover:text-slate-900 mb-2 gap-2 h-auto p-0 rounded-none">
                        <ArrowLeft className="w-4 h-4" /> Back to Responses
                    </Button>
                    <div className="flex items-center gap-4 mt-2">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{response.lead}</h1>
                        <Badge variant="secondary" className="rounded-none uppercase text-[10px] font-bold tracking-widest bg-emerald-100 text-emerald-700 border-emerald-200 flex items-center gap-1 py-1">
                            <CheckCircle className="w-3 h-3" /> {response.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mt-3 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> ID: {response.id}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Submitted on {new Date(response.submittedAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> via {response.source}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button className={cn(TOKENS.btn, "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-9")}>
                        <Download className="w-3.5 h-3.5 mr-2" /> Export
                    </Button>
                    <Button
                        className={cn(TOKENS.btn, "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 text-xs h-9")}
                        onClick={() => setIsSimulatorOpen(true)}
                    >
                        <Play className="w-3.5 h-3.5 mr-2 fill-current" /> Run Simulation
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">
                {/* Left: Response Data */}
                <div className="col-span-12 lg:col-span-8 overflow-y-auto pr-2 space-y-1">
                    {/* AI Summary Section */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-sm">
                            <span className={TOKENS.label}>Intent Score</span>
                            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
                                {response.score}/100
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-none">HIGH</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-sm">
                            <span className={TOKENS.label}>Sentiment</span>
                            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
                                {response.aiAnalysis.sentiment}
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-none">AI</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-sm">
                            <span className={TOKENS.label}>Risk Profile</span>
                            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
                                {response.aiAnalysis.risk}
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-none">SAFE</span>
                            </div>
                        </div>
                    </div>

                    <CollapsibleSection title="Survey Metrics" icon={Activity}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div><span className={TOKENS.label}>Email</span><span className={TOKENS.value}>{response.email}</span></div>
                            <div><span className={TOKENS.label}>Phone</span><span className={TOKENS.value}>{response.phone}</span></div>
                            <div><span className={TOKENS.label}>Location</span><span className={TOKENS.value}>{response.location}</span></div>
                            <div><span className={TOKENS.label}>Time Taken</span><span className={TOKENS.value}>4m 32s</span></div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Detailed Answers" icon={FileText} defaultOpen={true}>
                        <div className="space-y-4">
                            {response.answers.map((item, i) => (
                                <div key={i} className="group">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                        <span className="w-5 h-5 bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] rounded-none">Q{item.id}</span>
                                        {item.question}
                                    </p>
                                    <div className={cn(
                                        "p-4 border text-sm font-medium transition-all relative overflow-hidden",
                                        "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
                                    )}>
                                        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                                        <div className="flex items-center justify-between relative z-10">
                                            {item.answer}
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Attachments" icon={Paperclip}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {response.files.map((file, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-400 transition-colors cursor-pointer group rounded-none">
                                    <div className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors rounded-none">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono uppercase">{file.size} • {file.type}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 rounded-none h-8 w-8 p-0">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>
                </div>

                {/* Right: Activity & Notes */}
                <div className="col-span-12 lg:col-span-4 flex flex-col h-full overflow-hidden border-l border-slate-200 dark:border-slate-800 pl-6 bg-white dark:bg-slate-950/50">
                    <div className="mb-6">
                        <h3 className={TOKENS.headerTitle}>Assigned Agent</h3>
                        <div className="mt-3 p-3 border border-slate-200 bg-slate-50 flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-all rounded-none">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-black rounded-none">PS</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{assignedAgent}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Senior Manager</p>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2">
                        <h3 className={cn(TOKENS.headerTitle, "mb-4")}>Activity Log</h3>
                        <ResponseTimeline events={[
                            { id: '1', type: 'note', title: 'Agent Note', subtitle: 'Tried calling, no answer. Left voicemail.', timestamp: '1 hour ago', user: 'Priya S.' },
                            { id: '2', type: 'survey_complete', title: 'Verification Complete', subtitle: 'Documents approved automatically', timestamp: 'Yesterday' },
                            { id: '3', type: 'email_sent', title: 'Welcome Email Sent', timestamp: 'Yesterday' },
                        ]} />
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <Button className="w-full rounded-none bg-slate-900 text-white hover:bg-slate-800" onClick={() => setIsFollowUpOpen(true)}>
                            <Reply className="w-4 h-4 mr-2" /> Content Follow-up
                        </Button>
                    </div>
                </div>
            </div>


            <FollowUpComposer isOpen={isFollowUpOpen} onClose={() => setIsFollowUpOpen(false)} />

            <UniversalSimulator
                isOpen={isSimulatorOpen}
                onClose={() => setIsSimulatorOpen(false)}
                questions={DUMMY_QUESTIONS}
                mode="replay"
                replayResponse={{
                    answers: {
                        'q1': 'Apartment/Flat',
                        'q2': '₹50L - ₹1 Cr',
                        'q3': 'Whitefield',
                        'q4': 'Yes',
                        'q5': '1-3 months',
                        'q6': 'Investment',
                        'q7': 'Swimming Pool & Gym'
                    },
                    timeTaken: {
                        'q1': 4,
                        'q2': 12,
                        'q3': 3,
                        'q4': 8,
                        'q5': 5
                    }
                }}
            />
        </div>
    )
}



