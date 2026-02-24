import { useState } from 'react'
import { SideDrawer } from '@/components/ui/SideDrawer'
import { Applicant } from '../builder/contexts/SurveyPageContext'
import {
    User, Activity, Mail, Phone, MapPin,
    Trash2, MessageCircle,
    Briefcase, Star, DollarSign, TrendingUp,
    Zap, Target, CheckCircle2, LayoutDashboard
} from 'lucide-react'
import { cn } from '@/utils'

interface ApplicantDetailDrawerProps {
    applicant: Applicant | null
    onClose: () => void
    onAssign: () => void
    onEmail: () => void
}

export function ApplicantDetailDrawer({ applicant, onClose, onAssign, onEmail }: ApplicantDetailDrawerProps) {
    const [activeTab, setActiveTab] = useState<'overview'>('overview')
    const [notes, setNotes] = useState<string[]>(applicant?.notes || [])

    // Sync notes if opened fresh
    if (applicant && notes !== applicant.notes && notes.length === 0 && applicant.notes.length > 0) {
        setNotes(applicant.notes)
    }

    const handleConnect = (type: 'whatsapp' | 'email' | 'call') => {
        if (!applicant) return
        if (type === 'whatsapp') {
            const num = applicant.phone?.replace(/[^0-9]/g, '') || ''
            window.open(`https://wa.me/${num}`, '_blank')
        }
        if (type === 'email') onEmail()
        if (type === 'call') window.location.href = `tel:${applicant.phone}`
    }

    if (!applicant) return null

    // Safe Data Access & Formatting
    const val = (applicant as any).expectedValue || 0
    const formattedValue = val >= 10000000
        ? `₹${(val / 10000000).toFixed(1)}Cr`
        : `₹${(val / 100000).toFixed(1)}L`

    return (
        <SideDrawer
            isOpen={!!applicant}
            onClose={onClose}
            title={null}
            size="xl"
            headerClassName="hidden"
            className="p-0 bg-white dark:bg-slate-950 flex flex-col overflow-hidden w-full max-w-4xl border-l-0 rounded-none shadow-2xl font-sans"
            footer={
                <div className="flex justify-between w-full items-center bg-white border-t border-slate-100 p-0 h-16">
                    <button className="h-full px-8 text-red-500 hover:text-white hover:bg-red-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all border-r border-slate-100 rounded-none">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    <div className="flex h-full">
                        <button onClick={onClose} className="h-full px-8 border-l border-slate-100 hover:bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest transition-all rounded-none">
                            Cancel
                        </button>
                        <button onClick={onAssign} className="h-full px-10 bg-slate-900 text-white hover:bg-black font-bold uppercase text-[10px] tracking-widest transition-all shadow-none flex items-center gap-2 rounded-none">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes
                        </button>
                    </div>
                </div>
            }
        >
            <div className="flex h-full">
                {/* =================================================================================
                    LEFT SIDEBAR (Fixed Width) - White Theme (Sharp)
                ================================================================================= */}
                <div className="w-[300px] bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 z-20 relative">

                    {/* Profile Header */}
                    <div className="p-8 pb-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-none flex items-center justify-center font-bold text-sm border border-slate-300">
                                {applicant.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-base font-black text-slate-900 leading-tight tracking-tight mb-1">{applicant.name}</h2>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{applicant.jobTitle || 'Candidate'}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between group">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</span>
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none border",
                                    applicant.status === 'contacted' ? "bg-slate-100 text-slate-600 border-slate-200" :
                                        applicant.status === 'qualified' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                            "bg-blue-50 text-blue-600 border-blue-200"
                                )}>
                                    {applicant.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">ID</span>
                                <span className="font-mono text-[10px] text-slate-400">#APP-{applicant.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="grid grid-cols-3 border-y border-slate-200 bg-white">
                        <button onClick={() => handleConnect('call')} className="aspect-square flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors border-r border-slate-200 group rounded-none">
                            <Phone className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Call</span>
                        </button>
                        <button onClick={() => handleConnect('email')} className="aspect-square flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors border-r border-slate-200 group rounded-none">
                            <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Email</span>
                        </button>
                        <button onClick={() => handleConnect('whatsapp')} className="aspect-square flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors group rounded-none">
                            <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Chat</span>
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-8 px-0">
                        <div className="px-8 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Views</div>
                        <button
                            onClick={() => setActiveTab('overview')}
                            className="w-full flex items-center gap-4 px-8 py-3 text-xs font-bold transition-all border-l-2 border-slate-900 bg-white text-slate-900 rounded-none shadow-sm"
                        >
                            <LayoutDashboard className="w-4 h-4 text-slate-900" />
                            Overview
                        </button>
                    </div>

                    {/* Footer - Last Active */}
                    <div className="p-6 mt-auto border-t border-slate-200 bg-slate-50">
                        <div className="bg-white p-4 border border-slate-200 rounded-none shadow-sm">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Activity className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Active</span>
                            </div>
                            <div className="text-xs font-mono text-slate-900">24 mins ago</div>
                        </div>
                    </div>
                </div>

                {/* =================================================================================
                    RIGHT MAIN CONTENT - White / Clean
                ================================================================================= */}
                <div className="flex-1 bg-white overflow-y-auto relative">

                    {/* Header */}
                    <div className="px-10 py-8 pb-0">
                        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Executive Summary</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-none"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Sync Active</span>
                        </div>
                    </div>

                    <div className="p-10 space-y-10">

                        {/* KPI Cards */}
                        <div className="grid grid-cols-4 gap-6">
                            {/* Score */}
                            <div className="p-6 bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all group rounded-none">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score</span>
                                    <Target className="w-4 h-4 text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-5xl font-black text-slate-900 tracking-tighter mb-3">{applicant.score}</div>
                                <div className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded-none border border-blue-100">
                                    +12% vs Avg
                                </div>
                            </div>

                            {/* Potential */}
                            <div className="p-6 bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all group rounded-none">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Potential</span>
                                    <DollarSign className="w-4 h-4 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-4xl font-black text-slate-900 tracking-tighter mb-3">{formattedValue}</div>
                                <div className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide rounded-none border border-emerald-100">
                                    High Prob.
                                </div>
                            </div>

                            {/* Affinity */}
                            <div className="p-6 bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all group rounded-none">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Affinity</span>
                                    <Star className="w-4 h-4 text-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-4xl font-black text-slate-900 tracking-tighter mb-3">High</div>
                                <div className="h-4 flex items-end gap-1 opacity-30">
                                    {[4, 7, 5, 9, 6].map((h, i) => (
                                        <div key={i} className="w-1.5 bg-purple-600 rounded-t-sm" style={{ height: `${h * 10}%` }}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Intent */}
                            <div className="p-6 bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all group rounded-none">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Intent</span>
                                    <Zap className="w-4 h-4 text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Verified</div>
                                <div className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wide rounded-none border border-orange-100">
                                    Urgent
                                </div>
                            </div>
                        </div>

                        {/* Split Section: Identity & Intelligence */}
                        <div className="grid grid-cols-2 gap-12">

                            {/* Identity Profile */}
                            <div>
                                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Identity Profile</span>
                                    <User className="w-4 h-4 text-slate-300" />
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</div>
                                        <div className="font-bold text-slate-900 text-sm">{applicant.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</div>
                                        <div className="font-bold text-slate-900 text-sm font-mono">{applicant.email}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</div>
                                        <div className="font-bold text-slate-900 text-sm font-mono">+91 {applicant.phone || '98765 10002'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</div>
                                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            {applicant.location || 'Bangalore'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company</div>
                                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                            {applicant.company || 'Tech Corp'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Intelligence */}
                            <div>
                                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Intelligence</span>
                                    <Target className="w-4 h-4 text-slate-300" />
                                </div>

                                <div className="space-y-8">
                                    {/* Acquisition Source - Light/Sharp Card */}
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Acquisition Source</div>
                                        <div className="bg-slate-50 border border-slate-200 p-5 flex items-center justify-between shadow-sm rounded-none">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center rounded-none shadow-sm">
                                                    <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                                                </div>
                                                <div>
                                                    <div className="text-slate-900 font-bold text-sm">Google Ads Campaign</div>
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Search Network</div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-none uppercase">PPC</div>
                                        </div>
                                    </div>

                                    {/* Segments */}
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Interest Segments</div>
                                        <div className="flex flex-wrap gap-2">
                                            {['High Value', 'Real Estate', 'Luxury', 'Investor'].map(tag => (
                                                <span key={tag} className="px-4 py-2 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:border-slate-400 transition-colors cursor-default bg-white shadow-sm rounded-none">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </SideDrawer>
    )
}
