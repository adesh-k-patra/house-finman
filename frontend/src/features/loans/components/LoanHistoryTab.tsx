import { Loan } from '../types';
import { cn } from '@/utils';
import { Clock, Wallet, ShieldCheck, AlertTriangle, CheckCircle2, FileText, MapPin } from 'lucide-react';

interface LoanHistoryTabProps {
    loan: Loan;
}

export function LoanHistoryTab({ loan }: LoanHistoryTabProps) {
    // Sort events by date descending
    const sortedEvents = [...loan.auditTrail].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const getIconForAction = (action: string) => {
        const lower = action.toLowerCase();
        if (lower.includes('disbursed')) return { icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-200' };
        if (lower.includes('approved') || lower.includes('sanction')) return { icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' };
        if (lower.includes('rejected')) return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' };
        if (lower.includes('verified')) return { icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-100', border: 'border-teal-200' };
        if (lower.includes('upload') || lower.includes('document')) return { icon: FileText, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' };
        if (lower.includes('field')) return { icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' };
        return { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-100', border: 'border-slate-200' };
    };

    return (
        <div className="flex flex-col">
            <div className="bg-slate-950 px-6 py-3 border-b border-slate-900 mb-8 sticky top-0 z-10 flex justify-between items-center shadow-md">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-400" /> Audit Timeline
                </h3>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">{sortedEvents.length} Events</span>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-12">
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-6 space-y-8">
                    {sortedEvents.map((event) => {
                        const { icon: Icon, color, bg } = getIconForAction(event.action);

                        return (
                            <div key={event.id} className="relative pl-8 md:pl-12">
                                {/* Timeline Node */}
                                <div className={cn(
                                    "absolute -left-[9px] md:-left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-950 z-10",
                                    event.role === 'Borrower' ? 'bg-slate-400' : 'bg-primary-500'
                                )}></div>

                                {/* Event Card */}
                                <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all rounded-sm -mt-1.5">
                                    {/* Icon Badge */}
                                    <div className={cn(
                                        "absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm",
                                        bg, color
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    <div className="flex flex-col gap-1 mb-3">
                                        <div className="flex flex-wrap items-baseline gap-2 justify-between">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                                                {event.action}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 font-mono font-medium">
                                                {new Date(event.timestamp).toLocaleString(undefined, {
                                                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-slate-100 dark:border-slate-800 pl-3 mb-4">
                                        "{event.description}"
                                    </p>

                                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-500">
                                                {event.actorName.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                                {event.actorName}
                                            </span>
                                        </div>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                        <span className={cn(
                                            "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border",
                                            event.role === 'System' || event.role === 'Automated'
                                                ? "bg-slate-100 text-slate-500 border-slate-200"
                                                : "bg-primary-50 text-primary-600 border-primary-100 dark:bg-primary-900/10 dark:border-primary-800"
                                        )}>
                                            {event.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {sortedEvents.length === 0 && (
                        <div className="pl-8 text-slate-400 text-sm italic">No audit history available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
