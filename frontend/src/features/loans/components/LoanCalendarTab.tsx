import { useState } from 'react';
import { Loan } from '../types';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { Button } from '@/components/ui/Button';

interface LoanCalendarTabProps {
    loan: Loan;
}

export function LoanCalendarTab({ loan }: LoanCalendarTabProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const nextDueDate = loan.financials.nextDueDate ? new Date(loan.financials.nextDueDate) : null;
    const events = [
        ...(nextDueDate ? [{ date: nextDueDate, type: 'payment-due', title: 'EMI Due', amount: loan.financials.emiAmount }] : []),
        { date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), type: 'review', title: 'Q1 Review' }, // Mock event
    ];

    const getDayEvents = (day: Date) => {
        return events.filter(e => isSameDay(e.date, day));
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="grid grid-cols-12 h-[calc(100vh-200px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 ml-0 mr-0">

            {/* Left: Enhanced List / Upcoming (Span 4) */}
            <div className="col-span-12 xl:col-span-4 border-r border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-500" /> Upcoming Events
                    </h3>
                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold uppercase">Sync</Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Mock Upcoming List */}
                    {nextDueDate && (
                        <div className="bg-white dark:bg-slate-900 border-l-4 border-emerald-500 shadow-sm p-4 relative group hover:shadow-md transition-shadow">
                            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">{format(nextDueDate, 'EEEE, MMM d')}</p>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Next EMI Payment</h4>
                            <p className="text-xs text-slate-500 mt-1">Amount: {loan.financials.emiAmount.toLocaleString()}</p>
                            <div className="absolute top-4 right-4">
                                <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Due Soon</span>
                            </div>
                        </div>
                    )}
                    <div className="bg-white dark:bg-slate-900 border-l-4 border-blue-500 shadow-sm p-4 relative group hover:shadow-md transition-shadow">
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Feb 20, 2024</p>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Property Insurance Renewal</h4>
                        <p className="text-xs text-slate-500 mt-1">Provider: {loan.insurance?.provider || 'HDFC Ergo'}</p>
                    </div>
                </div>
            </div>

            {/* Right: Calendar Grid (Span 8) */}
            <div className="col-span-12 xl:col-span-8 bg-white dark:bg-slate-900 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-sm">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-r border-slate-200 dark:border-white/10"><ChevronLeft className="w-4 h-4" /></button>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs uppercase font-bold" onClick={() => setCurrentDate(new Date())}>Today</Button>
                </div>

                {/* Days Grid */}
                <div className="flex-1 p-6">
                    <div className="grid grid-cols-7 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[10px] font-bold uppercase text-slate-400 tracking-widest">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells for start of month offset (simplified for this iteration, better to use real date-fns logic for padding) */}
                        {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-24 bg-slate-50/50 dark:bg-slate-900/50 rounded-sm"></div>
                        ))}

                        {daysInMonth.map(day => {
                            const dayEvents = getDayEvents(day);
                            const isTodayDate = isToday(day);
                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`h-24 border ${isTodayDate ? 'border-primary-500 bg-primary-50/10' : 'border-slate-100 dark:border-white/10'} rounded-sm p-2 relative hover:border-primary-300 transition-colors group cursor-pointer`}
                                >
                                    <span className={`text-xs font-bold ${isTodayDate ? 'text-primary-600' : 'text-slate-500'}`}>{format(day, 'd')}</span>

                                    <div className="mt-2 space-y-1">
                                        {dayEvents.map((event, idx) => (
                                            <div key={idx} className={`text-[9px] px-1.5 py-0.5 rounded-sm truncate font-bold ${event.type === 'payment-due' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Hover Add Button */}
                                    <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm flex items-center justify-center text-slate-600 hover:bg-primary-500 hover:text-white transition-colors">
                                            <span className="text-xs leading-none mb-0.5">+</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
