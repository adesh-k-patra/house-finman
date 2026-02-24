/**
 * Partner Onboarding Page for House FinMan
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    UserPlus,
    CheckCircle2,
    Clock,
    FileText,
    ChevronRight,
    Filter,
    Search,
    Plus,
    Eye,
} from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn, formatRelativeTime, getInitials } from '@/utils'
import { InvitePartnerModal } from './components/InvitePartnerModal'

const onboardingStages = [
    { id: 'application', label: 'Application', count: 12 },
    { id: 'documents', label: 'Documents', count: 8 },
    { id: 'verification', label: 'Verification', count: 5 },
    { id: 'training', label: 'Training', count: 3 },
    { id: 'approved', label: 'Approved', count: 2 },
]

const pendingApplications = [
    { id: '1', name: 'Sunrise Realty', contact: 'Rajesh Kumar', phone: '+91 9876543210', email: 'rajesh@sunriserealty.com', city: 'Mumbai', stage: 'application', submittedAt: '2026-01-05T10:00:00', documentsUploaded: 2, documentsRequired: 5 },
    { id: '2', name: 'HomeFirst Advisors', contact: 'Priya Sharma', phone: '+91 9876543211', email: 'priya@homefirst.com', city: 'Bangalore', stage: 'documents', submittedAt: '2026-01-04T14:30:00', documentsUploaded: 4, documentsRequired: 5 },
    { id: '3', name: 'PropertyMax India', contact: 'Amit Patel', phone: '+91 9876543212', email: 'amit@propertymax.com', city: 'Pune', stage: 'verification', submittedAt: '2026-01-03T09:15:00', documentsUploaded: 5, documentsRequired: 5 },
    { id: '4', name: 'LoanConnect Pro', contact: 'Sneha Reddy', phone: '+91 9876543213', email: 'sneha@loanconnect.com', city: 'Hyderabad', stage: 'training', submittedAt: '2026-01-02T16:45:00', documentsUploaded: 5, documentsRequired: 5 },
    { id: '5', name: 'CredEase Partners', contact: 'Vikram Singh', phone: '+91 9876543214', email: 'vikram@credease.com', city: 'Delhi', stage: 'verification', submittedAt: '2026-01-02T11:20:00', documentsUploaded: 5, documentsRequired: 5 },
    { id: '6', name: 'Golden Gate Realty', contact: 'Meera Iyer', phone: '+91 9876543215', email: 'meera@goldengate.com', city: 'Chennai', stage: 'documents', submittedAt: '2026-01-04T08:00:00', documentsUploaded: 3, documentsRequired: 5 },
]

const stageColors: Record<string, { bg: string; text: string }> = {
    application: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600' },
    documents: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600' },
    verification: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600' },
    training: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600' },
    approved: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600' },
}

export default function PartnerOnboardingPage() {
    const navigate = useNavigate()
    const [activeStage, setActiveStage] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

    const handleInvite = (data: any) => {
        console.log('Inviting partner:', data)
        // In a real app, this would make an API call
        setIsInviteModalOpen(false)
    }

    const filteredApplications = pendingApplications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.contact.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStage = activeStage ? app.stage === activeStage : true
        return matchesSearch && matchesStage
    })

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Partner Onboarding</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage partner applications and onboarding workflow</p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsInviteModalOpen(true)}>Invite Partner</Button>
            </div>

            <InvitePartnerModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
            />

            {/* KPIs */}
            <div className="grid grid-cols-5 gap-4">
                <KPICard title="Total Applications" value="30" variant="blue" icon={<UserPlus className="w-5 h-5" />} trend={{ value: 12, direction: 'up', label: 'this month' }} />
                <KPICard title="Pending Verification" value="13" variant="orange" icon={<Clock className="w-5 h-5" />} />
                <KPICard title="In Training" value="3" variant="purple" icon={<FileText className="w-5 h-5" />} />
                <KPICard title="Approved" value="2" variant="emerald" icon={<CheckCircle2 className="w-5 h-5" />} trend={{ value: 100, direction: 'up', label: '' }} />
                <KPICard title="Avg Time" value="5 days" variant="cyan" icon={<Clock className="w-5 h-5" />} trend={{ value: 15, direction: 'down', label: 'faster' }} />
            </div>

            {/* Stage Pipeline */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 rounded-sm border border-slate-200 dark:border-white/10">
                {onboardingStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center flex-1">
                        <button
                            onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                            className={cn(
                                'flex-1 p-3 rounded-sm text-center transition-all',
                                activeStage === stage.id ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500' : 'bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stage.count}</p>
                            <p className="text-xs text-slate-500 mt-1">{stage.label}</p>
                        </button>
                        {index < onboardingStages.length - 1 && <ChevronRight className="w-5 h-5 text-slate-300 mx-2" />}
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search applications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
                </div>
                <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
            </div>

            {/* Applications Table */}
            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Partner</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Contact</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Location</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Stage</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Documents</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Submitted</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredApplications.map(app => {
                            const stage = stageColors[app.stage]
                            return (
                                <tr
                                    key={app.id}
                                    className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                    onClick={() => navigate(`/partners/onboarding/${app.id}`)}
                                >
                                    <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
                                                {getInitials(app.name)}
                                            </div>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white underline decoration-dotted underline-offset-4">{app.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <p className="text-sm text-slate-900 dark:text-white">{app.contact}</p>
                                        <p className="text-xs text-slate-500">{app.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">{app.city}</td>
                                    <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700 text-center">
                                        <span className={cn('px-2 py-0.5 text-xs font-medium rounded-sm inline-block', stage.bg, stage.text)}>{app.stage}</span>
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(app.documentsUploaded / app.documentsRequired) * 100}%` }} />
                                            </div>
                                            <span className="text-xs text-slate-500">{app.documentsUploaded}/{app.documentsRequired}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 border-r border-slate-300 dark:border-slate-700 text-center">{formatRelativeTime(app.submittedAt)}</td>
                                    <td className="px-6 py-4 border-slate-300 dark:border-slate-700 text-center">
                                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Button size="sm" variant="secondary" leftIcon={<Eye className="w-4 h-4" />} onClick={() => navigate(`/partners/onboarding/${app.id}`)}>Review</Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
