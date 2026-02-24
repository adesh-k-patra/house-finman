import { Circle, CheckCircle, MessageSquare, Mail, Phone, Calendar } from 'lucide-react'

interface TimelineEvent {
    id: string
    type: 'survey_start' | 'survey_complete' | 'email_sent' | 'call_logged' | 'note'
    title: string
    subtitle?: string
    timestamp: string
    user?: string
}

export function ResponseTimeline({ events }: { events: TimelineEvent[] }) {
    return (
        <div className="relative pl-6 border-l border-dashed border-slate-300 dark:border-slate-700 space-y-8 py-2">
            {events.map((event) => {
                const Icon =
                    event.type.includes('survey') ? CheckCircle :
                        event.type.includes('email') ? Mail :
                            event.type.includes('call') ? Phone :
                                MessageSquare

                return (
                    <div key={event.id} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-[35px] top-0 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-1.5 rounded-none group-hover:border-slate-900 dark:group-hover:border-white transition-colors">
                            <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white" />
                        </div>

                        {/* Content */}
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{event.timestamp}</span>
                                {event.user && <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1">{event.user}</span>}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{event.title}</h4>
                            {event.subtitle && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{event.subtitle}</p>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
