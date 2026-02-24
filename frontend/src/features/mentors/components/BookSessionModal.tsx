
import { useState } from 'react'
import { X, Calendar, Clock, MessageCircle, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatCurrency } from '@/utils'

interface BookSessionModalProps {
    isOpen: boolean
    onClose: () => void
    mentorName: string
    hourlyRate: number
    onBook: () => void
}

export function BookSessionModal({ isOpen, onClose, mentorName, hourlyRate, onBook }: BookSessionModalProps) {
    if (!isOpen) return null

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [duration, setDuration] = useState('1')

    const totalCost = hourlyRate * Number(duration)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here we would typically make an API call
        onBook()
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-sm shadow-xl z-50 animate-fade-in border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Book Session</h2>
                        <p className="text-xs text-slate-500">with {mentorName}</p>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                required
                                type="date"
                                className="input pl-10"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required
                                    type="time"
                                    className="input pl-10"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Hrs)</label>
                            <select
                                className="input"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                            >
                                <option value="1">1 Hour</option>
                                <option value="2">2 Hours</option>
                                <option value="3">3 Hours</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic / Message</label>
                        <div className="relative">
                            <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <textarea
                                className="input pl-10 h-20 resize-none py-2"
                                placeholder="What would you like to discuss?"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-sm border border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total to Pay</span>
                        </div>
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatCurrency(totalCost)}</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Proceed to Pay</Button>
                    </div>
                </form>
            </div>
        </>
    )
}
