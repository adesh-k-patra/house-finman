/**
 * Mentor Sessions Page for House FinMan
 */

import { useState } from 'react'
import {
    Calendar,
    Clock,
    Video,
    Phone,
    MessageCircle,
    Star,
    CheckCircle2,
    Plus,
} from 'lucide-react'
import { Button, Card, KPICard } from '@/components/ui'
import { cn, getInitials } from '@/utils'

const sessions = [
    { id: 'sess_001', mentee: 'Ramesh Patel', menteePhone: '+91 9876543210', mentor: 'Vikram Sharma', topic: 'Credit Assessment Process', date: '2026-01-06', time: '10:00 AM', duration: 60, mode: 'video', status: 'scheduled', notes: '' },
    { id: 'sess_002', mentee: 'Priya Gupta', menteePhone: '+91 9876543211', mentor: 'Anjali Iyer', topic: 'Partner Acquisition Strategy', date: '2026-01-06', time: '2:00 PM', duration: 45, mode: 'phone', status: 'scheduled', notes: '' },
    { id: 'sess_003', mentee: 'Amit Kumar', menteePhone: '+91 9876543212', mentor: 'Deepak Menon', topic: 'Sales Pipeline Optimization', date: '2026-01-05', time: '11:00 AM', duration: 60, mode: 'video', status: 'completed', notes: 'Covered lead scoring and conversion tactics' },
    { id: 'sess_004', mentee: 'Sneha Reddy', menteePhone: '+91 9876543213', mentor: 'Vikram Sharma', topic: 'Documentation Best Practices', date: '2026-01-05', time: '4:00 PM', duration: 30, mode: 'chat', status: 'completed', notes: 'Shared checklist templates' },
    { id: 'sess_005', mentee: 'Karthik Nair', menteePhone: '+91 9876543214', mentor: 'Priya Patel', topic: 'Customer Objection Handling', date: '2026-01-04', time: '3:00 PM', duration: 45, mode: 'video', status: 'cancelled', notes: 'Mentee no-show' },
    { id: 'sess_006', mentee: 'Divya Sharma', menteePhone: '+91 9876543215', mentor: 'Anjali Iyer', topic: 'PMAY Eligibility Criteria', date: '2026-01-07', time: '11:00 AM', duration: 60, mode: 'video', status: 'scheduled', notes: '' },
]

const statusConfig = {
    scheduled: { label: 'Scheduled', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    completed: { label: 'Completed', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    ongoing: { label: 'Ongoing', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
}

const modeIcons = {
    video: Video,
    phone: Phone,
    chat: MessageCircle,
}

export default function MentorSessionsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredSessions = sessions.filter(s => statusFilter === 'all' || s.status === statusFilter)

    const upcomingCount = sessions.filter(s => s.status === 'scheduled').length
    const completedCount = sessions.filter(s => s.status === 'completed').length
    const totalHours = sessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.duration, 0) / 60

    return (
        <div className="space-y-4 animate-fade-in max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Mentor Sessions</h1>
                </div>
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-3 h-3" />}>Schedule</Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KPICard title="Upcoming" value={upcomingCount.toString()} variant="blue" icon={<Calendar className="w-4 h-4" />} className="p-3" />
                <KPICard title="Completed" value={completedCount.toString()} variant="green" icon={<CheckCircle2 className="w-4 h-4" />} className="p-3" />
                <KPICard title="Hours" value={totalHours.toFixed(1)} variant="purple" icon={<Clock className="w-4 h-4" />} className="p-3" />
                <KPICard title="Rating" value="4.8" variant="orange" icon={<Star className="w-4 h-4" />} className="p-3" />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input text-sm w-40 py-1.5 px-3">
                    <option value="all">All Sessions</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Sessions List */}
            <div className="space-y-2">
                {filteredSessions.map(session => {
                    const status = statusConfig[session.status as keyof typeof statusConfig]
                    const ModeIcon = modeIcons[session.mode as keyof typeof modeIcons]
                    return (
                        <Card key={session.id} className="hover:shadow-md transition-shadow p-3 border border-slate-200 dark:border-white/5 rounded-none" padding="none">
                            <div className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-none bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium text-sm">
                                        {getInitials(session.mentee)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{session.topic}</h3>
                                            <span className={cn('px-1.5 py-0.5 text-[10px] font-medium rounded-none uppercase', status.bgColor, status.color)}>{status.label}</span>
                                        </div>
                                        <p className="text-xs text-slate-500">{session.mentee} • {session.menteePhone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-900 dark:text-white">{new Date(session.date).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-slate-500">{session.time} • {session.duration}m</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={cn('p-1.5 rounded-none', session.mode === 'video' ? 'bg-blue-100 dark:bg-blue-900/30' : session.mode === 'phone' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-purple-100 dark:bg-purple-900/30')}>
                                            <ModeIcon className={cn('w-4 h-4', session.mode === 'video' ? 'text-blue-600' : session.mode === 'phone' ? 'text-emerald-600' : 'text-purple-600')} />
                                        </div>
                                        {session.status === 'scheduled' && (
                                            <Button size="xs" variant="primary" className="rounded-none">Join</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
