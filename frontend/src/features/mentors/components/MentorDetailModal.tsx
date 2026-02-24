import { useState } from 'react'
import { Award, MapPin, DollarSign, Star, Phone, Video, MessageCircle, Calendar, Clock, Globe } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { cn, formatCurrency } from '@/utils'

type Expertise = 'home_loans' | 'documentation' | 'legal' | 'investment' | 'tax'

interface Mentor {
    id: string
    name: string
    expertise: Expertise[]
    city: string
    status: 'available' | 'busy' | 'offline'
    rating: number
    totalSessions: number
    hourlyRate: number
    languages: string[]
    experience: number
    bio: string
}

interface MentorDetailModalProps {
    isOpen: boolean
    onClose: () => void
    mentor: Mentor | null
    onBookSession?: (mentor: Mentor) => void
}

const statusConfig = {
    available: { label: 'Available', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    busy: { label: 'In Session', color: 'bg-amber-500', textColor: 'text-amber-600' },
    offline: { label: 'Offline', color: 'bg-slate-400', textColor: 'text-slate-500' },
}

const expertiseConfig: Record<Expertise, { label: string; color: string }> = {
    home_loans: { label: 'Home Loans', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800' },
    documentation: { label: 'Documentation', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 border-purple-200 dark:border-purple-800' },
    legal: { label: 'Legal', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-800' },
    investment: { label: 'Investment', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800' },
    tax: { label: 'Tax Planning', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 border-pink-200 dark:border-pink-800' },
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Profile', description: 'Mentor details.' },
    { id: 2, label: 'Stats & Sessions', description: 'Performance data.' }
]

export function MentorDetailModal({ isOpen, onClose, mentor, onBookSession }: MentorDetailModalProps) {
    if (!mentor) return null

    const status = statusConfig[mentor.status]

    const renderProfileTab = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Profile Header */}
            <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                        {mentor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className={cn('absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white dark:border-slate-900', status.color)} />
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {mentor.name}
                        </h2>
                        <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', status.textColor, 'bg-opacity-20')}>
                            {status.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{mentor.city}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1"><Award className="w-4 h-4" />{mentor.experience} years exp.</span>
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 border border-amber-200 dark:border-amber-800">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{mentor.rating}</span>
                        </div>
                        <span className="text-xs text-slate-400">from {mentor.totalSessions} sessions</span>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About</label>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-700">
                    {mentor.bio}
                </p>
            </div>

            {/* Expertise */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Expertise & Domains</label>
                <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map(exp => (
                        <span
                            key={exp}
                            className={cn('px-3 py-1.5 text-xs font-bold uppercase tracking-wide border', expertiseConfig[exp].color)}
                        >
                            {expertiseConfig[exp].label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Languages */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Languages</label>
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{mentor.languages.join(', ')}</span>
                </div>
            </div>

            {/* Contact Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                    variant="secondary"
                    className="rounded-none h-10"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                >
                    Send Message
                </Button>
                <Button
                    variant="secondary"
                    className="rounded-none h-10"
                    leftIcon={<Phone className="w-4 h-4" />}
                >
                    Call Mentor
                </Button>
            </div>
        </div>
    )

    const renderStatsTab = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{mentor.totalSessions}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Total Sessions</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-3xl font-black text-amber-600">{mentor.rating}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Avg Rating</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-3xl font-black text-emerald-600">{mentor.experience}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Years Exp</p>
                </div>
            </div>

            {/* Hourly Rate */}
            <div className="p-5 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Hourly Rate</p>
                        <p className="text-3xl font-black mt-1">{formatCurrency(mentor.hourlyRate)}</p>
                    </div>
                    <DollarSign className="w-10 h-10 opacity-30" />
                </div>
            </div>

            {/* Recent Sessions Placeholder */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Sessions</label>
                <div className="space-y-2">
                    {[
                        { client: 'Sneha Kapoor', date: '2 days ago', duration: '45 mins', rating: 5 },
                        { client: 'Vikram Mehta', date: '5 days ago', duration: '60 mins', rating: 5 },
                        { client: 'Priya Sharma', date: '1 week ago', duration: '30 mins', rating: 4 },
                    ].map((session, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {session.client.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{session.client}</p>
                                    <p className="text-[10px] text-slate-500">{session.date} • {session.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: session.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-amber-500 fill-current" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Availability</label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Mon - Fri</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">10 AM - 6 PM</span>
                    </div>
                </div>
            </div>
        </div>
    )

    const [activeStep, setActiveStep] = useState(1)

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title={mentor.name}
            subtitle="Mentor Profile"
            steps={STEPS}
            currentStep={activeStep}
            onStepClick={(id) => setActiveStep(Number(id))}
            contentTitle={STEPS.find(s => s.id === activeStep)?.label || ''}
            showBackButton={false}
            footer={
                <div className="flex gap-3 w-full">
                    <Button
                        variant="secondary"
                        className="rounded-none flex-1"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        className="rounded-none flex-1"
                        leftIcon={<Video className="w-4 h-4" />}
                        disabled={mentor.status !== 'available'}
                        onClick={() => onBookSession?.(mentor)}
                    >
                        Book Session
                    </Button>
                </div>
            }
        >
            {activeStep === 1 && renderProfileTab()}
            {activeStep === 2 && renderStatsTab()}
        </WizardModal>
    )
}
