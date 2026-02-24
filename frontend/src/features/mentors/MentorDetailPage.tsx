
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    MapPin,
    Award,
    Calendar,
    Briefcase,
    Star,
    Linkedin,
    Clock,
    Video,
    Edit,
    Trash2
} from 'lucide-react'
import { Button, Card, KPICard } from '@/components/ui'
import { cn, getInitials } from '@/utils'
import { Mentor, dummyMentors } from './data/dummyMentors'
import { EditMentorModal } from './components/EditMentorModal'

// Dummy Data


const upcomingSessions = [
    { id: 1, student: 'Rahul Sharma', topic: 'Deal Structure Review', date: '2026-01-08T10:00:00', duration: '1h', status: 'confirmed' },
    { id: 2, student: 'Priya Patel', topic: 'Client Negotiation Prep', date: '2026-01-10T14:30:00', duration: '45m', status: 'pending' },
]

const recentHistory = [
    { id: 101, student: 'Amit Kumar', topic: 'Market Analysis', date: '2026-01-02T11:00:00', rating: 5, feedback: 'Excellent insights!' },
    { id: 102, student: 'Sneha Reddy', topic: 'Career Guidance', date: '2025-12-28T15:00:00', rating: 5, feedback: 'Very helpful session.' },
]

type TabType = 'overview' | 'sessions' | 'reviews'

export default function MentorDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [mentor, setMentor] = useState<Mentor>(dummyMentors[0])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        const found = dummyMentors.find(m => m.id === id)
        if (found) setMentor(found)
    }, [id])

    const handleDeleteMentor = () => {
        if (window.confirm('Are you sure you want to delete this mentor?')) {
            navigate('/mentors')
        }
    }

    const handleSaveMentor = (updated: Mentor) => {
        setMentor(updated)
        setIsEditModalOpen(false)
    }

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <button
                onClick={() => navigate('/mentors')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Mentors
            </button>

            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-rose-600/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative p-6 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white dark:ring-slate-900">
                            {getInitials(mentor.name)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{mentor.name}</h1>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-sm font-semibold">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{mentor.rating}</span>
                                </div>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium mb-3">{mentor.title}</p>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" />{mentor.experience} Exp</span>
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{mentor.location}</span>
                                <span className="flex items-center gap-2 font-medium text-slate-900 dark:text-white"><Award className="w-4 h-4" />{mentor.specialization}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/10 backdrop-blur-md" leftIcon={<Edit className="w-4 h-4" />} onClick={() => setIsEditModalOpen(true)}>Edit</Button>
                        <Button variant="secondary" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border-red-500/10 backdrop-blur-md" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDeleteMentor}>Delete</Button>
                        <Button variant="secondary" leftIcon={<Linkedin className="w-4 h-4" />}>Profile</Button>
                        <Button variant="primary" leftIcon={<Calendar className="w-4 h-4" />}>Book Session</Button>
                    </div>
                </div>

                <div className="px-4 sm:px-8 pb-0">
                    <div className="flex items-center gap-4 border-t border-slate-100 dark:border-white/5 pt-1">
                        {[
                            { key: 'overview', label: 'Overview', icon: Briefcase },
                            { key: 'sessions', label: 'Start Session', icon: Video },
                            { key: 'reviews', label: 'Reviews', icon: Star },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as TabType)}
                                className={cn(
                                    'flex items-center gap-2 py-4 text-sm font-medium transition-all relative',
                                    activeTab === tab.key ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.key && "fill-current opacity-20")} />
                                {tab.label}
                                {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 dark:bg-rose-400 rounded-t-full" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up">
                        <div className="col-span-1 lg:col-span-2 space-y-6">
                            <Card title="About Mentor">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{mentor.bio}</p>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">#{tag}</span>
                                    ))}
                                </div>
                            </Card>
                            <Card title="Upcoming Sessions">
                                <div className="space-y-4">
                                    {upcomingSessions.map(session => (
                                        <div key={session.id} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-700 flex flex-col items-center justify-center text-center shadow-sm">
                                                    <span className="text-xs text-rose-600 font-bold uppercase">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-xl font-bold text-slate-900 dark:text-white">{new Date(session.date).getDate()}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{session.topic}</p>
                                                    <p className="text-sm text-slate-500">with {session.student} • {session.duration}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">Reschedule</Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <KPICard title="Total Sessions" value={mentor.sessionsConducted} variant="blue" icon={<Video className="w-5 h-5" />} />
                                <KPICard title="Mentees" value={mentor.studentsMentored} variant="purple" icon={<Award className="w-5 h-5" />} />
                            </div>
                            <Card title="Availability">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Available Slots</span>
                                    </div>
                                    <p className="text-sm text-emerald-800 dark:text-emerald-300">{mentor.availability}</p>
                                    <Button size="sm" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">Check Calendar</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'sessions' && (
                    <div className="text-center py-12 animate-fade-in-up">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Active Session</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">You don't have any scheduled sessions with this mentor right now. Check back 10 minutes before your scheduled time.</p>
                        <Button variant="primary">View Schedule</Button>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="animate-fade-in-up space-y-4">
                        {recentHistory.map(history => (
                            <div key={history.id} className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-900 dark:text-white">{history.student}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-sm text-slate-500">{history.topic}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{new Date(history.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className={cn("w-4 h-4", star <= history.rating ? "text-amber-400 fill-current" : "text-slate-300")} />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{history.feedback}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <EditMentorModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mentor={mentor}
                onSave={handleSaveMentor}
            />
        </div>
    )
}
