import { useRef, useState } from 'react'
import {
    X, Phone, MapPin, Calendar,
    Zap, Activity, MessageSquare, Play, FileText,
    CheckCircle2, Mail, Globe, List, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'
import { SurveySimulator, Question } from './SurveySimulator'
import { ResponsePDFGenerator } from '../utils/ResponsePDFGenerator'

interface ResponseDetailModalProps {
    isOpen: boolean
    onClose: () => void
    response: any
    simulatedAnswers: any[]
    onRunSimulation?: () => void
    onMarkComplete?: (id: string) => void
    questions?: Question[]
}

const TOKENS = {
    darkPanel: "bg-[#0F172A] border-r border-slate-800 text-white",
    lightPanel: "bg-white text-slate-900",
    label: "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block",
    valueDark: "font-bold text-white text-sm",
    valueLight: "font-bold text-slate-900 text-sm",
    sectionHeader: "flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 mb-4",
    sectionHeaderDark: "flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white mb-4",
    btnAction: "h-11 px-4 rounded-none font-bold uppercase tracking-wider text-[10px] transition-all flex items-center gap-2",
    btnSecondary: "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 shadow-sm",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5",
    btnDanger: "bg-white hover:bg-red-50 text-red-500 hover:text-red-700 border border-slate-200 hover:border-red-200"
}

export function ResponseDetailModal({
    isOpen,
    onClose,
    response,
    simulatedAnswers,
    onMarkComplete,
    onRunSimulation,
    questions = []
}: ResponseDetailModalProps) {
    const [notes, setNotes] = useState<string[]>([])
    const [noteInput, setNoteInput] = useState('')
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    if (!isOpen || !response) return null

    // Convert simulatedAnswers for Simulator
    const answersRecord: Record<string, string> = {}
    simulatedAnswers.forEach(a => {
        answersRecord[a.id] = a.answer
    })

    const handleAddNote = () => {
        if (!noteInput.trim()) return
        setNotes([noteInput, ...notes])
        setNoteInput('')
    }

    const handleExportPDF = () => {
        ResponsePDFGenerator.generateReport(response, simulatedAnswers)
    }

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div ref={contentRef} className="w-full max-w-6xl h-[85vh] flex shadow-2xl animate-in zoom-in-95 duration-200 rounded-none overflow-hidden ring-1 ring-white/10 bg-white">

                    {/* === LEFT SIDEBAR (EXECUTIVE SUMMARY) === */}
                    <div className={cn(TOKENS.darkPanel, "w-96 flex flex-col shrink-0 overflow-y-auto")}>
                        {/* Header Profile - Dark Theme */}
                        <div className="p-8 border-b border-slate-800 relative overflow-hidden bg-[#0F172A]">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center text-2xl font-black rounded-none shadow-lg shadow-blue-900/20">
                                    {response.respondent.charAt(0)}
                                </div>
                                <div className="text-right">
                                    <h2 className="text-xl font-black text-white uppercase leading-none mb-1">{response.respondent}</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Software Engineer</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <span className={TOKENS.label}>Status</span>
                                    <span className="inline-flex items-center px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                        NEW
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className={TOKENS.label}>ID</span>
                                    <span className="text-xs font-mono text-slate-500">#{response.id}</span>
                                </div>
                            </div>

                            {/* Executive Summary Cards */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white border-l-4 border-emerald-500 pl-3">
                                    Executive Summary
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Score Card */}
                                    <div className="p-4 bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-2">Score</span>
                                        <div className="text-4xl font-black text-white mb-2">96</div>
                                        <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold">+12% vs AVG</span>
                                    </div>

                                    {/* Potential Card */}
                                    <div className="p-4 bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Potential</span>
                                        <div className="text-2xl font-black text-white mb-2">₹39.0L</div>
                                        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">HIGH PROB.</span>
                                    </div>

                                    {/* Affinity Card */}
                                    <div className="p-4 bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Affinity</span>
                                        <div className="text-2xl font-black text-white mb-2">High</div>
                                        <div className="flex gap-1 h-3 items-end">
                                            <div className="w-1 h-2 bg-purple-900/50"></div>
                                            <div className="w-1 h-3 bg-purple-700/50"></div>
                                            <div className="w-1 h-full bg-purple-500"></div>
                                            <div className="w-1 h-full bg-purple-500"></div>
                                        </div>
                                    </div>

                                    {/* Intent Card */}
                                    <div className="p-4 bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 block mb-2">Intent</span>
                                        <div className="text-xl font-black text-white mb-2">Verified</div>
                                        <span className="inline-block px-2 py-0.5 bg-orange-500/10 text-orange-400 text-[10px] font-bold">URGENT</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-3 border-t border-slate-800 mt-8 pt-6">
                                <button className="flex flex-col items-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all">
                                        <Phone className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-white">Call</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all">
                                        <Mail className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-white">Email</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all">
                                        <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-white">Chat</span>
                                </button>
                            </div>
                        </div>

                        {/* Contact & Meta */}
                        <div className="p-8 space-y-8 flex-1 bg-[#0F172A]">
                            <div>
                                <span className={TOKENS.sectionHeaderDark}>Identity Profile</span>
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <span className={TOKENS.label}>Full Name</span>
                                        <div className="font-bold text-white">{response.respondent}</div>
                                    </div>
                                    <div>
                                        <span className={TOKENS.label}>Email Address</span>
                                        <div className="font-mono text-sm text-slate-400 font-medium">applicant15@example.com</div>
                                    </div>
                                    <div>
                                        <span className={TOKENS.label}>Phone Number</span>
                                        <div className="font-mono text-sm text-slate-400 font-medium">+91 98765 10014</div>
                                    </div>
                                    <div>
                                        <span className={TOKENS.label}>Location</span>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                            <MapPin className="w-3 h-3 text-slate-500" /> {response.location}
                                        </div>
                                    </div>
                                    <div>
                                        <span className={TOKENS.label}>Company</span>
                                        <div className="text-sm font-bold text-slate-300">Tech Corp</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span className={TOKENS.sectionHeaderDark}>Acquisition Source</span>
                                <div className="bg-slate-900/50 p-4 border border-slate-800 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-800 border border-slate-700 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-white uppercase">Google Ads Campaign</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Search Network • PPC</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                <span className={TOKENS.sectionHeaderDark}>Interest Segments</span>
                                <div className="flex flex-wrap gap-2">
                                    {['High Value', 'Real Estate', 'Luxury', 'Investor'].map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === RIGHT CONTENT (WHITE) === */}
                    <div className={cn(TOKENS.lightPanel, "flex-1 flex flex-col min-w-0")}>
                        {/* Header */}
                        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-slate-50/50">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Source: {response.source}</span>
                                </div>
                                <div className="h-4 w-px bg-slate-300" />
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{response.date} • {response.time}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 transition-colors rounded-none">
                                <X className="w-6 h-6 text-slate-400 hover:text-slate-900" />
                            </button>
                        </div>

                        {/* Main Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-3 gap-8">
                                {/* Center: Activity Timeline (Expanded) */}
                                <div className="col-span-1 space-y-8">
                                    <h3 className={TOKENS.sectionHeader}><Activity className="w-4 h-4" /> Activity Timeline</h3>
                                    <div className="relative border-l border-slate-200 ml-2 space-y-8">
                                        {/* Notes Section */}
                                        {notes.length > 0 && (
                                            <div className="mb-6 space-y-4">
                                                {notes.map((note, idx) => (
                                                    <div key={idx} className="relative pl-6 animate-in slide-in-from-left-2 fade-in duration-300">
                                                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-800 border-2 border-white rounded-none" />
                                                        <p className="text-sm font-bold text-slate-900">Note added by Agent</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">Just now</p>
                                                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-100 text-xs text-slate-700 font-medium italic">
                                                            "{note}"
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Event 1 */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-none" />
                                            <p className="text-sm font-bold text-slate-900">Survey Completed</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Automated Check • 10:45 AM</p>
                                            <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 font-medium">
                                                Score: 92/100 (High Intent)
                                            </div>
                                        </div>
                                        {/* Event 2 */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-none" />
                                            <p className="text-sm font-bold text-slate-900">Email Opened</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Campaign #442 • 10:40 AM</p>
                                        </div>
                                        {/* Event 3 */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-300 border-2 border-white rounded-none" />
                                            <p className="text-sm font-bold text-slate-900">Session Started</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Direct Link • 10:38 AM</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <h3 className={TOKENS.sectionHeader}><MessageSquare className="w-4 h-4" /> Agent Notes</h3>
                                        <textarea
                                            value={noteInput}
                                            onChange={(e) => setNoteInput(e.target.value)}
                                            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-400 rounded-none resize-none"
                                            placeholder="Add a note..."
                                        />
                                        <Button
                                            onClick={handleAddNote}
                                            disabled={!noteInput.trim()}
                                            className="w-full mt-2 rounded-none bg-slate-900 text-white hover:bg-black disabled:opacity-50"
                                        >
                                            Add Note
                                        </Button>
                                    </div>
                                </div>

                                {/* Right: Responses */}
                                <div className="col-span-2 space-y-6">
                                    <h3 className={TOKENS.sectionHeader}><List className="w-4 h-4" /> Response Breakdown</h3>
                                    <div className="grid gap-4">
                                        {simulatedAnswers.map((item, i) => (
                                            <div key={i} className="group border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all bg-white p-5 relative overflow-hidden">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-500 text-[10px] font-bold rounded-none">Q{item.id}</span>
                                                        <h4 className="font-bold text-sm text-slate-700">{item.question}</h4>
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-1">{item.time}</span>
                                                </div>

                                                <div className="pl-9">
                                                    <p className="text-base font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">{item.answer}</p>
                                                    {item.selected && (
                                                        <div className="absolute top-0 right-0 p-2">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                        </div>
                                                    )}
                                                    {item.type === 'text' && (
                                                        <div className="mt-2 flex gap-2">
                                                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-none">Sentiment: Positive</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="h-24 border-t border-slate-200 bg-slate-50 px-8 flex items-center justify-between shrink-0">
                            <div className="flex gap-4">
                                <button className={cn(TOKENS.btnAction, TOKENS.btnDanger)}>
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleExportPDF} className={cn(TOKENS.btnAction, TOKENS.btnSecondary)}>
                                    <FileText className="w-4 h-4" /> Export PDF
                                </button>
                                <button onClick={() => onMarkComplete?.(response.id)} className={cn(TOKENS.btnAction, TOKENS.btnSecondary)}>
                                    <CheckCircle2 className="w-4 h-4" /> Mark Complete
                                </button>
                                <button
                                    onClick={() => onRunSimulation?.()}
                                    className={cn(TOKENS.btnAction, TOKENS.btnPrimary)}
                                >
                                    <Play className="w-4 h-4 fill-current" /> Run Simulation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

