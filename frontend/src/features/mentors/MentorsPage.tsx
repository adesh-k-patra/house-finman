import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Star, MapPin, Video, MessageCircle, Award, Users, Clock } from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn, formatCurrency } from '@/utils'
import { BookSessionModal } from './components/BookSessionModal'
import { dummyMentors, Mentor, statusConfig, expertiseConfig } from './data/dummyMentors'

function MentorCard({ mentor, onBook, onView }: { mentor: Mentor; onBook: (mentor: Mentor) => void; onView: (mentor: Mentor) => void }) {
    const status = statusConfig[mentor.status]

    return (
        <div
            onClick={() => onView(mentor)}
            className={cn('p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-primary-500 cursor-pointer group')}
        >
            <div className="flex items-start gap-4">
                <div className="relative">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xl border border-slate-200 dark:border-slate-700">
                        {mentor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className={cn('absolute -bottom-1 -right-1 w-3 h-3 border border-white dark:border-slate-900', status.color)} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors uppercase tracking-tight">{mentor.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{mentor.city}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-none" />
                                <span className="flex items-center gap-1"><Award className="w-3 h-3" />{mentor.experience} yrs</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 border border-slate-100 dark:border-slate-700">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{mentor.rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 line-clamp-2 leading-relaxed h-10">{mentor.bio}</p>

            <div className="flex flex-wrap gap-1.5 mt-4">
                {mentor.expertise.map(exp => (
                    <span key={exp} className={cn('px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border', expertiseConfig[exp].color.replace('bg-', 'border-').replace('text-', 'text-'))}>
                        {expertiseConfig[exp].label}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sessions</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{mentor.totalSessions}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rate/hr</p>
                    <p className="text-sm font-bold text-primary-600 mt-0.5">{formatCurrency(mentor.hourlyRate)}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Video className="w-3 h-3" />}
                    className="flex-1 rounded-none h-9 uppercase tracking-wide text-xs font-bold"
                    disabled={mentor.status !== 'available'}
                    onClick={(e) => {
                        e.stopPropagation();
                        onBook(mentor);
                    }}
                >
                    Book Session
                </Button>
                <button className="h-9 w-9 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <MessageCircle className="w-4 h-4 text-slate-400 hover:text-primary-500" />
                </button>
            </div>
        </div>
    )
}

import { AddMentorModal } from './components/AddMentorModal'

export default function MentorsPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null)
    const [isAddMentorOpen, setIsAddMentorOpen] = useState(false)

    const filteredMentors = dummyMentors.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.city.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleBookSession = () => {
        // Mock success
        setBookingMentor(null)
        alert('Session booked successfully! You will receive an email confirmation.')
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mentor Directory</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{dummyMentors.length} mentors • {dummyMentors.filter(m => m.status === 'available').length} available now</p>
                </div>
                <Button variant="primary" className="rounded-none px-4" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddMentorOpen(true)}>Add Mentor</Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <KPICard
                    title="Total Mentors"
                    value={dummyMentors.length}
                    variant="slate"
                    icon={<Users className="w-5 h-5" />}
                />
                <KPICard
                    title="Available Now"
                    value={dummyMentors.filter(m => m.status === 'available').length}
                    variant="emerald"
                    icon={<Video className="w-5 h-5" />}
                />
                <KPICard
                    title="Total Sessions"
                    value={dummyMentors.reduce((s, m) => s + m.totalSessions, 0)}
                    variant="blue"
                    icon={<MessageCircle className="w-5 h-5" />}
                />
                <KPICard
                    title="Avg Rating"
                    value={(dummyMentors.reduce((s, m) => s + m.rating, 0) / dummyMentors.length).toFixed(1)}
                    variant="amber"
                    icon={<Star className="w-5 h-5" />}
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search mentors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10 rounded-none w-full" />
                </div>
                <Button variant="secondary" className="rounded-none" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMentors.map(mentor => (
                    <MentorCard
                        key={mentor.id}
                        mentor={mentor}
                        onBook={setBookingMentor}
                        onView={() => navigate(`/mentors/${mentor.id}`)}
                    />
                ))}
            </div>

            <BookSessionModal
                isOpen={!!bookingMentor}
                onClose={() => setBookingMentor(null)}
                mentorName={bookingMentor?.name || ''}
                hourlyRate={bookingMentor?.hourlyRate || 0}
                onBook={handleBookSession}
            />

            <AddMentorModal
                isOpen={isAddMentorOpen}
                onClose={() => setIsAddMentorOpen(false)}
            />
        </div>
    )
}
