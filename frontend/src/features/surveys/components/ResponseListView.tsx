import { useState } from 'react'
import {
    Search, Filter, Flag,
    Download, CheckCircle2, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui'
import { ResponseDetailModal } from './ResponseDetailModal'
import { UniversalSimulator } from '@/features/surveys/builder/components/UniversalSimulator'
import { DUMMY_QUESTIONS } from '@/features/surveys/builder/contexts/SurveyBuilderContext'
import { cn } from '@/utils'

// ============ TYPES ============

export interface ListViewResponse {
    id: string
    respondent: string
    phone: string
    location: string
    agent: string
    date: string
    time: string
    nps: number
    status: 'Complete' | 'Open' | 'Closed' | 'Paused'
    sentiment: 'positive' | 'neutral' | 'negative'
    channel: string
    duration: string
    flagged: boolean
    device: string
    os: string
    source: string
    // New Fields
    issues?: string[]
    tags?: string[]
    medium: 'Email' | 'WhatsApp' | 'SMS' | 'Call' | 'In-App' | 'Web'
    level: 'Critical' | 'High' | 'Medium' | 'Low'
    respondedOn: string // e.g. "17min ago"
}

// ============ MOCK DATA ============

const MOCK_RESPONSES: ListViewResponse[] = [
    {
        id: 'R-001', respondent: 'Ramesh Kumar', phone: '+91 98765 43210', location: 'Mumbai, MH', agent: 'Priya S', date: '2024-01-28', time: '10:45 AM', nps: 9, status: 'Complete', sentiment: 'positive', channel: 'WhatsApp', duration: '2m 15s', flagged: false, device: 'iPhone 14 Pro', os: 'iOS 17.2', source: 'Campaign #442',
        issues: [], tags: ['High Value', 'Loyal'], medium: 'WhatsApp', level: 'Low', respondedOn: '17min ago'
    },
    {
        id: 'R-002', respondent: 'Sunita Devi', phone: '+91 87654 32109', location: 'Ahmedabad, GJ', agent: 'Amit V', date: '2024-01-28', time: '10:32 AM', nps: 3, status: 'Open', sentiment: 'negative', channel: 'SMS', duration: '4m 32s', flagged: true, device: 'Samsung S23', os: 'Android 14', source: 'Direct Link',
        issues: ['Login Error', 'Timeout'], tags: ['Churn Risk'], medium: 'SMS', level: 'Critical', respondedOn: '1 hour ago'
    },
    {
        id: 'R-003', respondent: 'Vikram Singh', phone: '+91 76543 21098', location: 'Delhi NCR', agent: 'Rajesh K', date: '2024-01-28', time: '10:18 AM', nps: 7, status: 'Complete', sentiment: 'neutral', channel: 'Email', duration: '3m 10s', flagged: false, device: 'Desktop', os: 'Windows 11', source: 'Email Blast',
        issues: [], tags: ['New User'], medium: 'Email', level: 'Medium', respondedOn: '3 hours ago'
    },
    {
        id: 'R-004', respondent: 'Priya Sharma', phone: '+91 65432 10987', location: 'Bangalore, KA', agent: 'Sneha G', date: '2024-01-28', time: '09:55 AM', nps: 10, status: 'Closed', sentiment: 'positive', channel: 'In-App', duration: '1m 45s', flagged: false, device: 'iPhone 13', os: 'iOS 16.5', source: 'In-App Prompt',
        issues: [], tags: ['Promoter'], medium: 'In-App', level: 'Low', respondedOn: '1 day ago'
    },
    {
        id: 'R-005', respondent: 'Anonymous', phone: '-', location: 'Chennai, TN', agent: '-', date: '2024-01-28', time: '09:42 AM', nps: 5, status: 'Paused', sentiment: 'negative', channel: 'Web', duration: '5m 20s', flagged: true, device: 'Desktop', os: 'macOS 14', source: 'Website',
        issues: ['UI Glitch'], tags: ['Anonymous'], medium: 'Web', level: 'High', respondedOn: '2 days ago'
    },
].concat(Array(20).fill(null).map((_, i) => ({
    id: `R-0${i + 6}`,
    respondent: `User ${i + 6}`,
    phone: `+91 ${9000000000 + i}`,
    location: 'Mumbai, MH',
    agent: 'System',
    date: '2024-01-27',
    time: '09:00 AM',
    nps: 8,
    status: 'Complete',
    sentiment: 'neutral',
    channel: 'Web',
    duration: '2m 30s',
    flagged: false,
    device: 'Unknown',
    os: 'Unknown',
    source: 'Organic',
    issues: [],
    tags: [],
    medium: 'Web',
    level: 'Low',
    respondedOn: `${i + 3} days ago`
})))

const agents = ['All Agents', 'Priya S', 'Amit V', 'Rajesh K', 'Sneha G', 'Vikram M']
const channels = ['All Channels', 'WhatsApp', 'SMS', 'Email', 'In-App', 'Web']
const statuses = ['All Status', 'Complete', 'Open', 'Closed', 'Paused']

// ============ SHARP COMPONENT TOKENS ============


// Helper to convert list view answers to replay format
const convertAnswersToReplayResponse = (answers: any[]) => {
    const replayAnswers: Record<string, any> = {}
    const timeTaken: Record<string, number> = {}

    answers.forEach(a => {
        // Map ID number to q{id} string if needed, or just use as is. 
        // usage in ResponseListView mock is id: 1. DUMMY_QUESTIONS uses 'q1'.
        const qId = a.qId || `q${a.id}`
        replayAnswers[qId] = a.answer
        // Parse time string "4s" -> 4
        const time = parseInt(a.time.replace('s', ''))
        if (!isNaN(time)) {
            timeTaken[qId] = time
        }
    })

    return { answers: replayAnswers, timeTaken }
}

// ============ MAIN COMPONENT ============

interface ResponseListViewProps {
    data?: ListViewResponse[]
}

export function ResponseListView({ data }: ResponseListViewProps) {
    const responses = data || MOCK_RESPONSES

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedAgent, setSelectedAgent] = useState('All Agents')
    const [selectedChannel, setSelectedChannel] = useState('All Channels')
    const [selectedStatus, setSelectedStatus] = useState('All Status')
    const [selectedResponse, setSelectedResponse] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [isSimulationOpen, setIsSimulationOpen] = useState(false)
    const filteredResponses = responses.filter(r => {
        if (searchQuery && !r.respondent.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.phone.includes(searchQuery)) return false
        if (selectedAgent !== 'All Agents' && r.agent !== selectedAgent) return false
        if (selectedChannel !== 'All Channels' && r.channel !== selectedChannel) return false
        if (selectedStatus !== 'All Status' && r.status !== selectedStatus) return false
        return true
    })

    const currentResponse = responses.find(r => r.id === selectedResponse)

    // Pagination logic (Simplified for now - can add UI later if needed)
    const displayedResponses = filteredResponses.slice(0, 10)

    const handleExport = () => {
        alert("Exporting visible responses to CSV...")
    }

    // Mock Questions Data for the Detail View (Matched to DUMMY_QUESTIONS)
    const detailedAnswers = [
        { id: 1, qId: 'q1', question: 'What type of property are you interested in?', answer: 'Apartment/Flat', type: 'mcq', time: '4s' },
        { id: 2, qId: 'q1-1', question: 'How many bedrooms are you looking for?', answer: '3 BHK', type: 'mcq', time: '3s' },
        { id: 3, qId: 'q2', question: 'What is your budget range?', answer: '₹50L - ₹1 Cr', type: 'mcq', time: '5s' },
        { id: 4, qId: 'q3', question: 'Which area/locality are you interested in?', answer: 'Whitefield', type: 'mcq', time: '2s' },
        { id: 5, qId: 'q5', question: 'When are you planning to make the purchase?', answer: 'Immediately (within 1 month)', type: 'mcq', time: '3s' },
        { id: 6, qId: 'q6', question: 'What is the purpose of this property?', answer: 'Self-use (Primary Home)', type: 'mcq', time: '4s' },
        { id: 7, qId: 'q10', question: 'How likely are you to recommend us?', answer: '9', type: 'nps', time: '2s' }
    ]



    return (
        <div className="flex h-full bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in relative shadow-xl">
            {/* Simulation Modal */}
            <UniversalSimulator
                isOpen={isSimulationOpen}
                onClose={() => {
                    setIsSimulationOpen(false);
                }}
                questions={DUMMY_QUESTIONS}
                mode="replay"
                replayResponse={convertAnswersToReplayResponse(detailedAnswers)}
            />

            {/* Main List */}
            <div className={cn("flex-1 flex flex-col transition-all duration-300", selectedResponse ? "w-1/3 border-r border-slate-200 hidden lg:flex" : "w-full")}>
                {/* Header & Filters */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search responses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                            />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 rounded-none border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <Filter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 rounded-none border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="flex flex-wrap gap-2 pt-2 animate-in slide-in-from-top-1">
                            {/* Filters Content */}
                            <span className="text-[10px] font-bold uppercase text-slate-400 py-1">Filters:</span>
                            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-xs text-slate-700 dark:text-slate-300">
                                {agents.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <select value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-xs text-slate-700 dark:text-slate-300">
                                {channels.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-xs text-slate-700 dark:text-slate-300">
                                {statuses.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Response Table */}
                <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950">
                    <table className="w-full">
                        <thead className="bg-slate-900 dark:bg-slate-950 text-white sticky top-0 z-10 shadow-sm ring-1 ring-slate-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest w-[20%] text-slate-300 border-[0.5px] border-slate-500">Respondent</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-300 border-[0.5px] border-slate-500">Issues</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-300 border-[0.5px] border-slate-500">Tags</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-300 border-[0.5px] border-slate-500">Medium</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-300 border-[0.5px] border-slate-500">Level</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-300 border-[0.5px] border-slate-500">Responded</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-300 border-[0.5px] border-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {displayedResponses.map((r) => (
                                <tr
                                    key={r.id}
                                    onClick={() => setSelectedResponse(r.id)}
                                    className={cn(
                                        "group cursor-pointer transition-all duration-200 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md",
                                        selectedResponse === r.id
                                            ? "bg-white dark:bg-slate-900 border-l-4 border-l-emerald-500 shadow-md z-10"
                                            : "bg-transparent border-l-4 border-l-transparent dark:text-slate-300"
                                    )}
                                >
                                    <td className="px-4 py-3 border-[0.5px] border-slate-400 dark:border-slate-600">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-none flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0",
                                                selectedResponse === r.id ? "bg-emerald-600" : "bg-slate-400 dark:bg-slate-700 group-hover:bg-slate-600 transition-colors"
                                            )}>
                                                {r.respondent.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={cn("font-bold text-sm text-slate-900 dark:text-slate-100 truncate", selectedResponse === r.id && "text-emerald-700 dark:text-emerald-400")}>{r.respondent}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono flex items-center gap-1 truncate">
                                                    {r.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Issues */}
                                    <td className="px-4 py-3 border-[0.5px] border-slate-400 dark:border-slate-600">
                                        <div className="flex flex-col gap-1">
                                            {r.issues && r.issues.length > 0 ? r.issues.map(i => (
                                                <span key={i} className="inline-block px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold tracking-wide rounded-sm truncate" title={i}>{i}</span>
                                            )) : <span className="text-slate-300 text-[10px]">-</span>}
                                        </div>
                                    </td>

                                    {/* Tags */}
                                    <td className="px-4 py-3 border-[0.5px] border-slate-400 dark:border-slate-600">
                                        <div className="flex flex-wrap gap-1">
                                            {r.tags && r.tags.length > 0 ? r.tags.map(t => (
                                                <span key={t} className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold rounded-sm">{t}</span>
                                            )) : <span className="text-slate-300 text-[10px]">-</span>}
                                        </div>
                                    </td>

                                    {/* Medium */}
                                    <td className="px-4 py-3 text-center border-[0.5px] border-slate-400 dark:border-slate-600">
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.medium}</span>
                                    </td>

                                    {/* Level */}
                                    <td className="px-4 py-3 text-center border-[0.5px] border-slate-400 dark:border-slate-600">
                                        <span className={cn(
                                            "inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-sm border",
                                            r.level === 'Critical' ? "bg-red-100 text-red-700 border-red-200" :
                                                r.level === 'High' ? "bg-orange-100 text-orange-700 border-orange-200" :
                                                    r.level === 'Medium' ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                                                        "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        )}>
                                            {r.level}
                                        </span>
                                    </td>

                                    {/* Responded On */}
                                    <td className="px-4 py-3 text-center border-[0.5px] border-slate-400 dark:border-slate-600">
                                        <span className="text-xs font-mono text-slate-500">{r.respondedOn}</span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3 text-center border-[0.5px] border-slate-400 dark:border-slate-600">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-sm text-[10px] font-bold uppercase tracking-wide",
                                            r.status === 'Complete' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                r.status === 'Open' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                    r.status === 'Paused' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                        "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {r.status === 'Complete' && <CheckCircle2 className="w-3 h-3" />}
                                            {r.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Response Detail Modal */}
            <ResponseDetailModal
                isOpen={!!selectedResponse}
                onClose={() => setSelectedResponse(null)}
                response={currentResponse}
                simulatedAnswers={detailedAnswers}
                onRunSimulation={() => {
                    setSelectedResponse(null)
                    setIsSimulationOpen(true)
                }}
                onMarkComplete={(id) => {
                    alert(`Marked response ${id} as complete`)
                    // In a real app, this would update the state/backend
                }}
            />
        </div >
    )
}
