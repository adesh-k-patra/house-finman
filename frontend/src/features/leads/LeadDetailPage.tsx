
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Phone,
    MessageCircle,
    Edit,
    FileText,
    Upload,
    Plus,
    User,
    Users,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    Briefcase,
    ClipboardCheck,
    Send
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn, formatRelativeTime, getInitials, formatCurrency } from '@/utils'
import { dummyLeads } from './data/dummyLeads'
import { dummyProperties } from '../properties/data/dummyProperties'
import { Lead, leadStatusConfig } from '@/types'
import { EditLeadModal } from './components/EditLeadModal'

type TabType = 'overview' | 'notes' | 'documents' | 'timeline' | 'surveys'

const dummyNotes = [
    { id: 1, author: 'Rohit Sharma', content: 'Client is interested in 3BHK options near Koregaon Park. Budget is flexible up to 3.5 Cr. Wants to close by next month.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    { id: 2, author: 'System', content: 'Lead stage updated to "Qualified" based on income proof verification.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
    { id: 3, author: 'Rohit Sharma', content: 'Scheduled a site visit for Saturday, 12th Jan at 11 AM. Client will be accompanied by spouse.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 4, author: 'Anjali Gupta', content: 'Sent the updated brochure and floor plans for "Skyline Towers" as requested via WhatsApp.', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 5, author: 'Rohit Sharma', content: 'Client raised a query regarding the parking allotment. Clarified that 2 covered slots are included in the price.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: 6, author: 'Amit Patel', content: 'Follow-up call: Client is comparing with another project in Baner. Emphasized our amenities and construction quality.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
]

const dummyDocuments = [
    { id: 1, name: 'PAN Card.pdf', type: 'application/pdf', size: '256 KB', status: 'verified', url: '#' },
    { id: 2, name: 'Aadhar Card.pdf', type: 'application/pdf', size: '512 KB', status: 'verified', url: '#' },
    { id: 3, name: 'Income Tax Return 2023-24.pdf', type: 'application/pdf', size: '1.2 MB', status: 'pending', url: '#' },
    { id: 4, name: 'Salary Slips (Last 3 Months).pdf', type: 'application/pdf', size: '850 KB', status: 'verified', url: '#' },
    { id: 5, name: 'Bank Statement (HDFC).pdf', type: 'application/pdf', size: '2.5 MB', status: 'pending', url: '#' },
    { id: 6, name: 'Form 16 - Part A & B.pdf', type: 'application/pdf', size: '1.8 MB', status: 'pending', url: '#' },
    { id: 7, name: 'Passport Copy.jpg', type: 'image/jpeg', size: '3.1 MB', status: 'rejected', url: '#' },
]

export default function LeadDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [lead, setLead] = useState<Lead | null>(null)
    const [newNote, setNewNote] = useState('')
    const [notes, setNotes] = useState(dummyNotes)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [documents, setDocuments] = useState(dummyDocuments)

    useEffect(() => {
        const foundLead = dummyLeads.find(l => l.id === id)
        setLead(foundLead || null)
    }, [id])

    const handleSaveLead = (updatedLead: Lead) => {
        setLead(updatedLead)
    }

    const handleAddNote = () => {
        if (!newNote.trim()) return
        const note = {
            id: Date.now(),
            content: newNote,
            author: 'You',
            timestamp: new Date().toISOString()
        }
        setNotes([note, ...notes])
        setNewNote('')
    }

    const handleUploadDocument = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.pdf,.jpg,.png'
        input.onchange = (e: any) => {
            const file = e.target.files[0]
            if (file) {
                const newDoc = {
                    id: Date.now(),
                    name: file.name,
                    type: 'other',
                    size: `${(file.size / 1024).toFixed(0)} KB`,
                    uploadedAt: new Date().toISOString(),
                    status: 'pending',
                    url: '#'
                }
                setDocuments([newDoc, ...documents])
            }
        }
        input.click()
    }

    if (!lead) return null

    const tabs: { key: TabType; label: string; icon: any }[] = [
        { key: 'overview', label: 'Overview', icon: User },
        { key: 'notes', label: 'Notes', icon: MessageCircle },
        { key: 'documents', label: 'Documents', icon: FileText },
        { key: 'surveys', label: 'Surveys', icon: ClipboardCheck },
        { key: 'timeline', label: 'Timeline', icon: Clock },
    ]

    return (
        <div className="animate-fade-in pb-12 bg-slate-50 dark:bg-slate-950 relative min-h-screen">
            {/* Background Decoration */}
            <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 -z-20" />
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full -z-10" />

            {/* Header Section - Standardized Card Style */}
            <div className="px-4 pt-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    {/* Top decorative bar */}
                    <div className={cn("h-1 w-full",
                        lead.status === 'new' ? "bg-blue-500" :
                            lead.status === 'contacted' ? "bg-cyan-500" :
                                lead.status === 'sanctioned' ? "bg-indigo-500" :
                                    "bg-slate-400"
                    )} />

                    <div className="p-4">
                        {/* Top Row: Back link & Meta badges */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <button
                                onClick={() => navigate('/leads')}
                                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider group/back"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                                Back to Leads
                            </button>

                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={cn(
                                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ring-1 ring-inset ring-transparent flex items-center gap-1.5",
                                    lead.status === 'new' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        lead.status === 'contacted' ? "bg-cyan-50 text-cyan-700 border-cyan-200" :
                                            lead.status === 'sanctioned' ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                                                "bg-slate-50 text-slate-600 border-slate-200"
                                )}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full inline-block",
                                        lead.status === 'new' ? "bg-blue-500 animate-pulse" : "bg-slate-400"
                                    )} />
                                    {leadStatusConfig[lead.status].label}
                                </span>

                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-slate-200 text-slate-500 bg-slate-50 flex items-center gap-1.5">
                                    <User className="w-3 h-3" /> Agent: {lead.assignedAgent}
                                </span>
                            </div>
                        </div>

                        {/* Main Content Row: Title & Actions */}
                        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                            {/* Title & Description */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-black text-white shadow-sm">
                                        {getInitials(lead.name)}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                                            {lead.name}
                                        </h1>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-4">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-slate-400" /> {lead.city}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span className="flex items-center gap-1.5">
                                                <Briefcase className="w-4 h-4 text-slate-400" /> {lead.source}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span className="font-mono text-slate-400">ID: {lead.id}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Toolbar */}
                            <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 self-start xl:self-end shadow-sm">
                                <Button
                                    variant="outline" size="sm"
                                    className="h-9 gap-2 rounded-none border-slate-300 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all font-bold shadow-sm"
                                    onClick={() => window.open(`https://wa.me/${lead.phone}`, '_blank')}
                                >
                                    <MessageCircle className="w-4 h-4 fill-current" /> WhatsApp
                                </Button>
                                <Button
                                    variant="outline" size="sm"
                                    className="h-9 gap-2 rounded-none border-slate-300 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all font-bold shadow-sm"
                                    onClick={() => alert('Calling...')}
                                >
                                    <Phone className="w-4 h-4 fill-current" /> Call
                                </Button>

                                <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />

                                <Button
                                    variant="ghost" size="sm"
                                    className="h-9 gap-2 rounded-none text-slate-600 hover:text-purple-600 hover:bg-white"
                                    onClick={() => alert('Merge')}
                                >
                                    <Users className="w-4 h-4" /> Merge
                                </Button>
                                <Button
                                    variant="ghost" size="sm"
                                    className="h-9 gap-2 rounded-none text-slate-600 hover:text-primary-600 hover:bg-white"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    <Edit className="w-4 h-4" /> Edit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs - Sharp, Flush */}
            <div className="flex border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-8 sticky top-[73px] z-20 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            'group flex items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all relative border-b-2',
                            activeTab === tab.key
                                ? 'border-primary-600 text-primary-700 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4", activeTab === tab.key ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area - 0 Margin Grid */}
            <div className="bg-slate-100 dark:bg-slate-950 min-h-[600px] border-b border-slate-200 dark:border-white/10">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-12 gap-px bg-slate-200 dark:bg-slate-800">
                        {/* Left Column: Details */}
                        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900">
                            {/* Personal Details Section */}
                            <div className="border-b border-slate-200 dark:border-white/10">
                                <div className="bg-slate-900 dark:bg-slate-950 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary-400" /> Personal Details
                                    </h3>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest border border-slate-700 px-2 py-0.5 rounded-sm">Verified</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="p-6 border-r border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white break-all">{lead.email}</p>
                                    </div>
                                    <div className="p-6 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{lead.phone}</p>
                                    </div>
                                    <div className="p-6 border-r border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Source</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{lead.source}</p>
                                    </div>
                                    <div className="p-6 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current City</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{lead.city}</p>
                                    </div>
                                    <div className="p-6 border-r border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assignee</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px] font-bold border border-indigo-200 dark:border-slate-600">{getInitials(lead.assignedAgent)}</div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{lead.assignedAgent}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Created At</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Deal Requirements Section */}
                            <div>
                                <div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-purple-400" /> Deal Requirements
                                    </h3>
                                </div>
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/2 border-r border-b md:border-b-0 border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-slate-800/20">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Property Interest</p>

                                        {/* Clickable Property Card */}
                                        <div
                                            onClick={() => navigate(`/properties/${dummyProperties[0].id}`)}
                                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer shadow-sm hover:shadow-md overflow-hidden"
                                        >
                                            <div className="flex">
                                                {/* Image */}
                                                <div className="w-24 h-24 shrink-0 relative">
                                                    <img
                                                        src={dummyProperties[0].image}
                                                        alt={dummyProperties[0].title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                                </div>

                                                {/* Content */}
                                                <div className="p-3 flex-1 flex flex-col justify-center min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                                                        {dummyProperties[0].title}
                                                    </h4>
                                                    <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="text-[10px] font-medium truncate">{dummyProperties[0].location}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="text-xs font-black text-slate-900 dark:text-white">
                                                            {formatCurrency(dummyProperties[0].price)}
                                                        </p>
                                                        <span className={cn(
                                                            "text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5",
                                                            dummyProperties[0].status === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'
                                                        )}>
                                                            {dummyProperties[0].status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 bg-slate-50/30 dark:bg-slate-800/20">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Budget Range</p>
                                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹ 2.5 Cr - 3.0 Cr</p>
                                        <div className="mt-4 w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider text-right">Matching: High</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Key Actions & Info */}
                        <div className="col-span-12 lg:col-span-4 bg-slate-50 dark:bg-slate-900/30 flex flex-col">
                            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10">
                                <div className="bg-slate-900 dark:bg-slate-950 p-4">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Actions</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <Button variant="ghost" className="w-full justify-start rounded-none uppercase text-xs font-bold h-12 bg-blue-600/90 hover:bg-blue-500 text-white backdrop-blur-md shadow-lg shadow-blue-900/20 border-0" leftIcon={<Calendar className="w-4 h-4" />}>Schedule Meeting</Button>
                                    <Button variant="ghost" className="w-full justify-start rounded-none uppercase text-xs font-bold h-12 bg-slate-500/90 hover:bg-slate-400 text-white backdrop-blur-md shadow-lg shadow-slate-900/20 border-0" leftIcon={<MessageCircle className="w-4 h-4" />}>Send Email</Button>
                                    <Button variant="ghost" className="w-full justify-start rounded-none uppercase text-xs font-bold h-12 bg-slate-900/90 hover:bg-slate-800 text-white backdrop-blur-md shadow-lg shadow-black/20 border-0" leftIcon={<FileText className="w-4 h-4" />}>Create Proposal</Button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 flex-1">
                                <div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-8 relative border-l border-slate-200 dark:border-slate-700 ml-2 pl-8 py-2">
                                        {[
                                            { title: 'Call Logged: Interest Shown', time: '2 hours ago', icon: Phone, color: 'bg-blue-500 ring-blue-500/30' },
                                            { title: 'Note Added: Budget Discussion', time: 'Yesterday', icon: FileText, color: 'bg-amber-500 ring-amber-500/30' },
                                            { title: 'Status Updated: Qualified', time: '2 days ago', icon: CheckCircle2, color: 'bg-emerald-500 ring-emerald-500/30' },
                                        ].map((activity, i) => (
                                            <div key={i} className="relative">
                                                <div className={cn("absolute -left-[37px] top-1 w-2.5 h-2.5 rounded-full ring-4 bg-current", activity.color)} />
                                                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{activity.title}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{activity.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 text-center">
                                        <Button variant="ghost" size="sm" className="text-xs uppercase font-bold tracking-wide text-primary-600 hover:bg-primary-50">View All Activity</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="grid grid-cols-12 gap-px bg-slate-200 dark:bg-slate-800">
                        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 min-h-[500px]">
                            <div className="bg-slate-900 dark:bg-slate-950 sticky top-0 z-10 shadow-md">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-primary-400" /> Discussion Notes
                                </h3>
                            </div>

                            <div className="space-y-8">
                                {notes.map(note => (
                                    <div key={note.id} className="group relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 hover:border-primary-500 transition-colors">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-primary-500 transition-colors ring-4 ring-white dark:ring-slate-900 shadow-sm" />
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm">{note.author}</span>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{formatRelativeTime(note.timestamp)}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 shadow-sm rounded-sm">
                                            {note.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-4 bg-slate-50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800">
                            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 sticky top-0 md:top-24">
                                <div className="bg-slate-900 dark:bg-slate-950 p-4">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Add New Note</h3>
                                </div>
                                <div className="p-6">
                                    <textarea
                                        placeholder="Type your note here..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="w-full h-40 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 text-sm mb-4 resize-none transition-colors"
                                    />
                                    <Button className="w-full rounded-none font-bold uppercase tracking-wide h-12 shadow-sm" variant="primary" onClick={handleAddNote} disabled={!newNote.trim()}>Add Note</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="bg-white dark:bg-slate-900 min-h-[600px]">
                        <div className="bg-slate-900 dark:bg-slate-950 flex items-center justify-between sticky top-0 z-10 shadow-md">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary-400" /> Documents & Files
                            </h3>
                            <Button variant="outline" size="sm" className="rounded-none border-white/20 text-white hover:bg-white/10 uppercase text-[10px] font-bold tracking-wide h-8" leftIcon={<Upload className="w-3 h-3" />} onClick={handleUploadDocument}>
                                Upload
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {documents.map((doc: any) => (
                                <div key={doc.id} className="group relative aspect-[4/5] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 hover:border-primary-500 transition-all flex flex-col cursor-pointer shadow-sm hover:shadow-md">
                                    <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-800/50">
                                        <div className="w-16 h-16 text-slate-300 group-hover:text-primary-500 transition-colors transform group-hover:scale-110 duration-300">
                                            <FileText className="w-full h-full stroke-1" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={doc.name}>{doc.name}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{doc.size}</p>
                                            {doc.status === 'verified' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] p-4">
                                        <Button size="sm" variant="primary" className="w-full rounded-none text-[10px] h-8 uppercase tracking-wide">Download</Button>
                                        <Button size="sm" variant="outline" className="w-full rounded-none text-[10px] h-8 uppercase tracking-wide text-white border-white/30 hover:bg-white/10 hover:text-red-400 hover:border-red-400/50">Delete</Button>
                                    </div>
                                </div>
                            ))}

                            {/* Dropzone Placeholder */}
                            <div className="aspect-[4/5] border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all flex flex-col items-center justify-center cursor-pointer group gap-3" onClick={handleUploadDocument}>
                                <div className="rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-primary-500 transition-colors" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 group-hover:text-primary-600 uppercase tracking-widest text-center px-4">Upload New Document</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'surveys' && (
                    <div className="bg-white dark:bg-slate-900 min-h-[600px]">
                        <div className="bg-slate-900 dark:bg-slate-950 flex items-center justify-between sticky top-0 z-10 shadow-md">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-emerald-400" /> Survey History
                            </h3>
                            <Button
                                variant="primary"
                                size="sm"
                                className="rounded-none uppercase text-[10px] font-bold tracking-wide h-8"
                                leftIcon={<Send className="w-3 h-3" />}
                                onClick={() => navigate('/surveys/create')}
                            >
                                Send New Survey
                            </Button>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Mock Survey Card 1 */}
                                <div className="group relative bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 hover:border-emerald-500 transition-all p-6 shadow-sm hover:shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Completed</span>
                                        <span className="text-[10px] font-mono text-slate-400">2 days ago</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Buyer Intent Survey</h4>
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">Assessed budget, location preference, and timeline flexibility.</p>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Score</p>
                                            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">85<span className="text-xs font-normal text-slate-400">/100</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Intent</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">High</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full rounded-none uppercase text-[10px] font-bold"
                                        onClick={() => navigate('/surveys/1')}
                                    >
                                        View Survey Details
                                    </Button>
                                </div>

                                {/* Mock Survey Card 2 */}
                                <div className="group relative bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 hover:border-amber-500 transition-all p-6 shadow-sm hover:shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">Pending</span>
                                        <span className="text-[10px] font-mono text-slate-400">Sent Yesterday</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Pre-Visit Questionnaire</h4>
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">Preferences for site visit, family members attending, and specific unit requirements.</p>

                                    <div className="flex items-center justify-center py-2 mb-4 bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Waiting for response</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 rounded-none uppercase text-[10px] font-bold" onClick={() => alert('Resending survey...')}>Resend</Button>
                                        <Button variant="outline" size="sm" className="flex-1 rounded-none uppercase text-[10px] font-bold text-red-500 hover:bg-red-50" onClick={() => alert('Survey cancelled')}>Cancel</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="bg-white dark:bg-slate-900 min-h-[600px] flex flex-col items-center justify-center opacity-50">
                        <Clock className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Coming Soon</h3>
                    </div>
                )}
            </div>

            <EditLeadModal
                lead={lead}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveLead}
            />
        </div>
    )
}
