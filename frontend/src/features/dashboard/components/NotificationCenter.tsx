import { useState } from 'react'
import { Bell, Check, X, MessageSquare, AlertTriangle, Info, Clock } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { cn } from '@/utils'

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'alerts'>('all')

    const notifications = [
        { id: 1, type: 'mention', title: 'Sarah tagged you in Survey #124', message: '@John please review this question logic.', time: '2m ago', read: false },
        { id: 2, type: 'alert', title: 'High Intent Lead Detected', message: 'Rajesh Kumar matched "Luxury Villa" criteria.', time: '15m ago', read: false },
        { id: 3, type: 'info', title: 'Export Completed', message: 'Your Q1 Report is ready to download.', time: '1h ago', read: true },
        { id: 4, type: 'alert', title: 'Survey Paused', message: 'NPS Survey stopped due to schedule end.', time: '2h ago', read: true },
        { id: 5, type: 'mention', title: 'Comment on Response', message: 'New comment on Response #552', time: '1d ago', read: true },
    ]

    const unreadCount = notifications.filter(n => !n.read).length

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
            </button>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(false)}
                className="relative p-2 text-slate-900 dark:text-white"
            >
                <Bell className="w-5 h-5" />
            </button>

            {/* Dropdown Panel */}
            <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 origin-top-right rounded-none">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider">Notifications</h3>
                    <div className="flex gap-2">
                        <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase">Mark all read</button>
                        <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                    {['all', 'mentions', 'alerts'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "flex-1 py-3 text-[10px] uppercase font-bold tracking-wider text-center border-b-2 transition-colors",
                                activeTab === tab
                                    ? "border-purple-600 text-purple-600 bg-white dark:bg-slate-900"
                                    : "border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications
                        .filter(n => activeTab === 'all' || (activeTab === 'mentions' && n.type === 'mention') || (activeTab === 'alerts' && n.type === 'alert'))
                        .map(n => (
                            <div
                                key={n.id}
                                className={cn(
                                    "p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative",
                                    !n.read && "bg-blue-50/50 dark:bg-blue-900/10"
                                )}
                            >
                                <div className="flex gap-3">
                                    <div className={cn(
                                        "mt-1 w-8 h-8 flex items-center justify-center border",
                                        n.type === 'mention' ? "border-blue-200 bg-blue-100 text-blue-600" :
                                            n.type === 'alert' ? "border-red-200 bg-red-100 text-red-600" :
                                                "border-slate-200 bg-slate-100 text-slate-600"
                                    )}>
                                        {n.type === 'mention' && <MessageSquare className="w-4 h-4" />}
                                        {n.type === 'alert' && <AlertTriangle className="w-4 h-4" />}
                                        {n.type === 'info' && <Info className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={cn("text-xs font-bold leading-tight", !n.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                                                {n.title}
                                            </p>
                                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 block shrink-0" />}
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{n.message}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase">
                                            <Clock className="w-3 h-3" /> {n.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Footer */}
                <div className="p-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        View All History
                    </button>
                </div>
            </div>
        </div>
    )
}
