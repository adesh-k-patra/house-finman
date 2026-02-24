
import { useState, useMemo } from 'react'
import { useSurvey } from '../builder/contexts/SurveyPageContext'
import {
    Search, Filter, Plus,
    Briefcase, Users, Globe, Layers, Zap, ArrowRight,
    Smartphone, DollarSign, Download, CheckCircle, Mail, Phone, MessageSquare, FileSpreadsheet
} from 'lucide-react'
import { cn } from '@/utils'
import { AddApplicantModal } from './AddApplicantModal'
import { ApplicantDetailDrawer } from './ApplicantDetailDrawer'
import { SurveyTargetingEngine } from './SurveyTargetingEngine'
import { ApplicantsAnalytics } from './ApplicantsAnalytics'
import { ConnectSourceModal } from './ConnectSourceModal'

export function ApplicantsTab() {
    const { applicants, addApplicant } = useSurvey()
    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score')
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [selectedApplicantIds, setSelectedApplicantIds] = useState<Set<string>>(new Set())
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null)
    const [showTargetingEngine, setShowTargetingEngine] = useState(false)

    // Lists Mode
    const [activeListId, setActiveListId] = useState<string>('all')

    // New Advanced Filter State
    const [dateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

    // Derived Data for Filters
    const allTags = useMemo(() => Array.from(new Set(applicants.flatMap(a => a.tags))), [applicants])

    // Mock Integration Data
    const integrations = [
        { id: '1', type: 'google_ads', name: 'Google Ads', status: 'connected', lastSync: '2m ago', audienceSize: 12400, icon: Globe, color: 'text-blue-500' },
        { id: '2', type: 'meta_ads', name: 'Meta Ads', status: 'connected', lastSync: '1h ago', audienceSize: 8200, icon: Layers, color: 'text-blue-600' },
        { id: '3', type: 'linkedin_ads', name: 'LinkedIn Ads', status: 'disconnected', lastSync: 'Never', audienceSize: 0, icon: Users, color: 'text-blue-700' },
        { id: '4', type: 'csv', name: 'CSV Upload', status: 'connected', lastSync: '1d ago', audienceSize: 1500, icon: FileSpreadsheet, color: 'text-emerald-500' },
    ]

    const lists = [
        { id: 'all', name: 'All Applicants', icon: Users, count: applicants.length, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
        { id: 'google', name: 'Google Leads', icon: Globe, count: applicants.filter(a => a.source === 'google_ads').length, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
        { id: 'meta', name: 'Meta Leads', icon: Layers, count: applicants.filter(a => a.source === 'meta_ads').length, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
        { id: 'high_value', name: 'High Value (>₹1Cr)', icon: DollarSign, count: applicants.filter(a => (a.expectedValue || 0) > 10000000).length, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { id: 'whatsapp', name: 'WhatsApp Opt-ins', icon: Smartphone, count: applicants.filter(a => a.contactChannels?.includes('whatsapp')).length, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    ]

    const filteredApplicants = applicants.filter(app => {
        if (filterStatus && app.status !== filterStatus) return false
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            const matches = app.name.toLowerCase().includes(term) ||
                app.email.toLowerCase().includes(term) ||
                app.company?.toLowerCase().includes(term) ||
                app.location.toLowerCase().includes(term)
            if (!matches) return false
        }
        if (selectedTags.length > 0 && !selectedTags.some(t => app.tags.includes(t))) return false
        if (dateRange.start && new Date(app.dateAdded) < dateRange.start) return false
        if (dateRange.end && new Date(app.dateAdded) > dateRange.end) return false

        // List Filters
        if (activeListId === 'google' && app.source !== 'google_ads') return false
        if (activeListId === 'meta' && app.source !== 'meta_ads') return false
        if (activeListId === 'high_value' && (app.expectedValue || 0) <= 10000000) return false
        if (activeListId === 'whatsapp' && !app.contactChannels?.includes('whatsapp')) return false

        return true
    })

    const sortedApplicants = [...filteredApplicants].sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'date') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        return 0
    })



    const toggleSelection = (id: string) => {
        const next = new Set(selectedApplicantIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedApplicantIds(next)
    }

    const statusColors = {
        new: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
        contacted: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
        qualified: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    } as const

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
            {/* 1. Header & Integrations - Sharp Technical Look - SINGLE LINE REDESIGN */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center justify-between">
                    {/* LEFT SIDE: Connect Source & Integrations */}
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setShowConnectModal(true)}
                            className="flex-shrink-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 rounded-none"
                        >
                            <Plus className="w-4 h-4" /> Connect Source
                        </button>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2 flex-shrink-0"></div>

                        <div className="flex items-center gap-3">
                            {integrations.map(integration => (
                                <div key={integration.id} className="group flex-shrink-0 flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                    <integration.icon className={cn("w-3.5 h-3.5", integration.color)} />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase text-slate-700 dark:text-slate-300 leading-none">{integration.name}</span>
                                        <div className="flex items-center gap-1">
                                            <span className={cn("w-1 h-1 rounded-full", integration.status === 'connected' ? "bg-emerald-500" : "bg-slate-300")} />
                                            <span className="text-[8px] font-bold text-slate-400 leading-none uppercase">{integration.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:border-slate-300 transition-all font-bold tracking-wider text-xs uppercase flex items-center gap-2 rounded-none">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-200 transition-all font-bold tracking-wider text-xs uppercase flex items-center gap-2 rounded-none shadow-md">
                            <Plus className="w-4 h-4" /> Add Applicant
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Lists - Technical Dark/Light Mix */}
                <div className="w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
                    <div className="p-5">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layers className="w-3 h-3" /> Smart Lists
                        </h3>
                        <div className="space-y-1">
                            {lists.map(list => {
                                const Icon = list.icon
                                const isActive = activeListId === list.id
                                return (
                                    <button
                                        key={list.id}
                                        onClick={() => setActiveListId(list.id)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 text-xs font-bold flex items-center justify-between group transition-all border-l-2",
                                            isActive
                                                ? "bg-slate-50 border-l-slate-900 text-slate-900"
                                                : "bg-transparent border-l-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                        )}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className={cn("w-4 h-4", isActive ? "text-slate-900" : list.color)} />
                                            {list.name}
                                        </span>
                                        {list.count > 0 && (
                                            <span className={cn(
                                                "text-[10px] font-mono font-bold px-1.5 py-0.5 border",
                                                isActive ? "bg-white border-slate-200 text-slate-900" : "bg-slate-100 border-slate-200 text-slate-500"
                                            )}>
                                                {list.count}
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 relative">
                    {/* Analytics Header */}
                    <div className="px-8 py-6">
                        <ApplicantsAnalytics />
                    </div>

                    {/* Filter Toolbar - Floating */}
                    <div className="px-8 pb-6 flex items-center gap-4 sticky top-0 z-10">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-0 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors group-hover:border-blue-400"></div>
                            <div className="relative flex items-center px-4 h-12">
                                <Search className="w-4 h-4 text-slate-400 mr-3" />
                                <input
                                    type="text"
                                    placeholder="SEARCH APPLICANTS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400 uppercase tracking-wide"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-12">
                            <button
                                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                                className={cn("px-4 h-full flex items-center gap-2 border-r border-slate-100 hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-wider", (isFilterPanelOpen || selectedTags.length > 0) ? "text-blue-600 bg-blue-50/10" : "text-slate-600")}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {(selectedTags.length > 0 || dateRange.start) && <span className="w-1.5 h-1.5 bg-blue-500 rounded-none ml-1" />}
                            </button>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as any)}
                                className="pl-4 pr-8 h-full bg-transparent border-none text-xs font-bold uppercase tracking-wider text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-50"
                            >
                                <option value="score">Sort: Score</option>
                                <option value="name">Sort: Name</option>
                                <option value="date">Sort: Recent</option>
                            </select>
                        </div>
                    </div>

                    {/* Extended Filter Panel - Sharp Tech Look */}
                    {isFilterPanelOpen && (
                        <div className="px-8 pb-6 animate-in slide-in-from-top-2 duration-200">
                            <div className="bg-slate-50 dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 p-6 shadow-inner grid grid-cols-3 gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                        <div className="w-1 h-1 bg-slate-400"></div> Filter by Status
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['new', 'contacted', 'qualified', 'rejected'] as const).map(status => {
                                            const colors = statusColors[status]
                                            const isActive = filterStatus === status
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => setFilterStatus(isActive ? null : status)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all rounded-none",
                                                        isActive
                                                            ? cn(colors.bg, colors.text, colors.border, "ring-1", colors.border)
                                                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400"
                                                    )}
                                                >
                                                    {status}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                        <div className="w-1 h-1 bg-slate-400"></div> Filter by Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                        {allTags.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className={cn(
                                                    "px-2 py-1 text-[10px] uppercase font-bold border transition-colors rounded-none flex items-center gap-2",
                                                    selectedTags.includes(tag)
                                                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                        : "bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                                                )}
                                            >
                                                {selectedTags.includes(tag) && <CheckCircle className="w-3 h-3" />}
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid Content */}
                    <div className="flex-1 overflow-y-auto px-8 pb-20">
                        {sortedApplicants.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50">
                                <Search className="w-8 h-8 text-slate-300 mb-2" />
                                <h3 className="text-slate-900 font-bold uppercase tracking-wide text-sm">No applicants found</h3>
                                <button onClick={() => { setSearchTerm(''); setFilterStatus(null); setSelectedTags([]); setActiveListId('all') }} className="mt-2 text-blue-600 text-xs font-bold uppercase tracking-wide hover:underline">
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedApplicants.map(app => {
                                    const isSelected = selectedApplicantIds.has(app.id)

                                    // Safely handle expectedValue
                                    const val = (app as any).expectedValue || 0
                                    const formattedValue = val >= 10000000
                                        ? `₹${(val / 10000000).toFixed(1)}Cr`
                                        : `₹${(val / 100000).toFixed(0)}L`

                                    const isUrgent = app.score > 85

                                    return (
                                        <div
                                            key={app.id}
                                            onClick={() => setSelectedApplicant(app)}
                                            className={cn(
                                                "group relative cursor-pointer bg-white dark:bg-slate-900 border-2 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl",
                                                isSelected ? "border-blue-500 shadow-lg ring-1 ring-blue-500 z-10" : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                            )}
                                        >
                                            {/* Selection Overlay */}
                                            <div className="absolute top-3 left-3 z-20">
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); toggleSelection(app.id) }}
                                                    className={cn(
                                                        "w-5 h-5 bg-white border-2 transition-all cursor-pointer flex items-center justify-center shadow-sm",
                                                        isSelected ? "border-slate-900 bg-slate-900" : "border-slate-300 hover:border-slate-400 opacity-0 group-hover:opacity-100"
                                                    )}
                                                >
                                                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                            </div>

                                            {/* Status Line */}
                                            <div className={cn("h-1 w-full",
                                                app.status === 'qualified' ? "bg-emerald-500" :
                                                    app.status === 'new' ? "bg-blue-500" :
                                                        app.status === 'rejected' ? "bg-red-500" : "bg-slate-300"
                                            )} />

                                            <div className="p-5 flex-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex flex-col gap-1 w-full mr-2">
                                                        <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                                                            {app.name}
                                                        </h3>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                                                            <Briefcase className="w-3 h-3 text-slate-400" />
                                                            {app.jobTitle || 'Candidate'}
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "flex flex-col items-center justify-center w-10 h-10 border-2 font-black text-sm transition-colors",
                                                        app.score >= 90 ? "border-indigo-100 bg-indigo-50 text-indigo-700" :
                                                            app.score >= 80 ? "border-emerald-100 bg-emerald-50 text-emerald-700" :
                                                                app.score >= 60 ? "border-amber-100 bg-amber-50 text-amber-700" : "border-slate-100 bg-slate-50 text-slate-600"
                                                    )}>
                                                        {app.score}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Value</span>
                                                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">{formattedValue}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center px-2">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Source</span>
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500">
                                                            {app.source === 'google_ads' ? <Globe className="w-3 h-3 text-blue-500" /> : app.source === 'meta_ads' ? <Layers className="w-3 h-3 text-indigo-500" /> : <Users className="w-3 h-3" />}
                                                            {app.source === 'google_ads' ? 'Google' : app.source === 'meta_ads' ? 'Meta' : 'Direct'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Footer - Appears/Highlights on Hover */}
                                            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors">
                                                <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1 hover:text-blue-600 hover:bg-blue-50"><Phone className="w-3 h-3" /></button>
                                                    <button className="p-1 hover:text-blue-600 hover:bg-blue-50"><Mail className="w-3 h-3" /></button>
                                                    <button className="p-1 hover:text-blue-600 hover:bg-blue-50"><MessageSquare className="w-3 h-3" /></button>
                                                </div>
                                                {isUrgent ? (
                                                    <span className="flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-wider">
                                                        <Zap className="w-3 h-3 fill-current" /> Urgent
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-500 flex items-center gap-1">
                                                        Profile <ArrowRight className="w-3 h-3" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddApplicantModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={addApplicant}
            />

            <ApplicantDetailDrawer
                applicant={selectedApplicant}
                onClose={() => setSelectedApplicant(null)}
                onAssign={() => { setShowTargetingEngine(true); setSelectedApplicant(null) }}
                onEmail={() => { console.log('Email feature pending'); setSelectedApplicant(null) }}
            />

            <ConnectSourceModal
                isOpen={showConnectModal}
                onClose={() => setShowConnectModal(false)}
            />

            <SurveyTargetingEngine
                isOpen={showTargetingEngine}
                onClose={() => setShowTargetingEngine(false)}
                recipientCount={selectedApplicantIds.size || (selectedApplicant ? 1 : 0)}
            />

        </div>
    )
}

