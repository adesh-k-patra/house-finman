import { useState, useEffect } from 'react'
import { Calendar, FileText, Users, CheckCircle2, AlertCircle, Wallet, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { WizardModal } from '@/components/ui/WizardModal'
import { formatCurrency, cn } from '@/utils'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns'

interface CreatePayRunModalProps {
    isOpen: boolean
    onClose: () => void
    pendingAmount: number
    pendingCount: number
    onProcess: () => void
}

export function CreatePayRunModal({ isOpen, onClose, pendingAmount, pendingCount, onProcess }: CreatePayRunModalProps) {
    const [step, setStep] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)

    // Date Picker State
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [viewDate, setViewDate] = useState(new Date())

    useEffect(() => {
        if (isOpen) {
            setStep(1)
            setIsProcessing(false)
            setDatePickerOpen(false)
            setSelectedDate(new Date())
            setViewDate(new Date())
        }
    }, [isOpen])

    // Simulated Calculations
    const processingFee = 500
    const totalPayout = pendingAmount + processingFee

    const handleProcess = () => {
        setIsProcessing(true)
        setTimeout(() => {
            onProcess()
            onClose()
            setIsProcessing(false)
        }, 1500)
    }

    const steps = [
        { id: 1, label: 'Pay Run Details', description: 'Configure payment settings' },
        { id: 2, label: 'Beneficiaries', description: 'Review recipients' },
        { id: 3, label: 'Confirmation', description: 'Finalize and process' },
    ]

    const renderDatePicker = () => {
        const daysInMonth = eachDayOfInterval({
            start: startOfWeek(startOfMonth(viewDate)),
            end: endOfWeek(endOfMonth(viewDate))
        })

        return (
            <div className="absolute top-[110%] left-0 w-[300px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/10 rounded-sm z-50 animate-in fade-in zoom-in-95 duration-200 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors"><ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" /></button>
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide">{format(viewDate, 'MMMM yyyy')}</span>
                    <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors"><ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" /></button>
                </div>
                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((day, i) => {
                        const isSelected = isSameDay(day, selectedDate)
                        const isCurrentMonth = isSameMonth(day, viewDate)
                        const isTodayDate = isToday(day)

                        return (
                            <button
                                key={i}
                                onClick={() => { setSelectedDate(day); setDatePickerOpen(false); }}
                                className={cn(
                                    "h-8 w-8 text-xs flex items-center justify-center rounded-sm transition-all relative group",
                                    !isCurrentMonth && "text-slate-300 dark:text-slate-700",
                                    isSelected
                                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                                    isTodayDate && !isSelected && "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/10 ring-1 ring-blue-200 dark:ring-blue-800"
                                )}
                            >
                                {format(day, 'd')}
                            </button>
                        )
                    })}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <button onClick={() => {
                        const today = new Date()
                        setSelectedDate(today)
                        setViewDate(today)
                        setDatePickerOpen(false)
                    }} className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Today</button>
                    <button onClick={() => setDatePickerOpen(false)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Close</button>
                </div>
            </div>
        )
    }

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Source Account</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Wallet className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-sm font-medium text-slate-900 dark:text-white appearance-none cursor-pointer">
                            <option>HDFC Bank - Current Account (**** 8892)</option>
                            <option>ICICI Bank - Operations (**** 4451)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Schedule Date</label>
                        <div className="relative">
                            {datePickerOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setDatePickerOpen(false)} />}
                            <button
                                type="button"
                                onClick={() => setDatePickerOpen(!datePickerOpen)}
                                className={cn(
                                    "w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border rounded-none text-left transition-all text-sm font-medium group flex items-center",
                                    datePickerOpen
                                        ? "border-blue-500 ring-1 ring-blue-500/20 text-blue-600 dark:text-blue-400"
                                        : "border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-700"
                                )}
                            >
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className={cn("h-4 w-4 transition-colors", datePickerOpen ? "text-blue-500" : "text-slate-400 group-hover:text-blue-400")} />
                                </div>
                                {format(selectedDate, 'PPP')}
                            </button>
                            {datePickerOpen && renderDatePicker()}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Payment Reference</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FileText className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-sm font-medium text-slate-900 dark:text-white"
                                placeholder="REF-MAR-2024-001"
                                defaultValue={`PAY-${new Date().getFullYear()}-${new Date().getMonth() + 1}-001`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-none flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Secure Processing</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                        All payments are processed via secure encrypted channels. Standard processing times apply (Wait time: ~20 mins).
                    </p>
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900 text-white p-6 rounded-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors duration-500"></div>
                <div className="relative z-10">
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Total Pending Commissions</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-bold font-mono tracking-tight">{formatCurrency(pendingAmount)}</h3>
                        <span className="text-sm text-slate-400">INR</span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="px-3 py-1 bg-white/10 rounded-full flex items-center gap-2 border border-white/5">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-medium">{pendingCount} Partners</span>
                        </div>
                        <div className="px-3 py-1 bg-white/10 rounded-full flex items-center gap-2 border border-white/5">
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-medium">{pendingCount} Invoices</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Beneficiary Breakdown</h4>
                <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {[...Array(Math.min(5, pendingCount))].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-colors group cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    P{i + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Partner Name {i + 1}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">HDFC Bank • **** {1000 + i}</p>
                                </div>
                            </div>
                            <span className="text-sm font-mono font-medium text-slate-600 dark:text-slate-400">{formatCurrency(pendingAmount / pendingCount)}</span>
                        </div>
                    ))}
                    {pendingCount > 5 && (
                        <p className="text-center text-xs text-slate-400 py-2">And {pendingCount - 5} more...</p>
                    )}
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="p-1 rounded-sm bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80">
                <div className="bg-white dark:bg-slate-900 p-5">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Payout Amount</span>
                        <Wallet className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-center py-4">
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">{formatCurrency(totalPayout)}</h2>
                        <p className="text-sm text-slate-500 mt-2">Scheduled for Today via HDFC Bank</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 space-y-3 border border-slate-200 dark:border-white/5">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Commission Subtotal ({pendingCount})</span>
                    <span className="font-medium text-slate-900 dark:text-white font-mono">{formatCurrency(pendingAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Platform Processing Fee</span>
                    <span className="font-medium text-slate-900 dark:text-white font-mono">{formatCurrency(processingFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Taxes (GST 18%)</span>
                    <span className="font-medium text-slate-900 dark:text-white font-mono">{formatCurrency(0)}</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                <div className="flex justify-between text-base font-bold">
                    <span className="text-slate-900 dark:text-white">Net Debit Amount</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono">{formatCurrency(totalPayout)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-xs text-amber-700 dark:text-amber-500">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>By clicking Process, you authorize the transfer of funds. This action cannot be reversed.</p>
            </div>
        </div>
    )

    const footer = (
        <div className="flex items-center justify-between w-full">
            <Button
                variant="ghost"
                onClick={() => step === 1 ? onClose() : setStep(s => s - 1)}
                disabled={isProcessing}
            >
                {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button
                variant="primary"
                onClick={() => {
                    if (step < 3) setStep(s => s + 1)
                    else handleProcess()
                }}
                isLoading={isProcessing}
                rightIcon={step < 3 ? <ArrowRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            >
                {step === 3 ? (isProcessing ? 'Processing...' : 'Process Payment') : 'Next Step'}
            </Button>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Pay Run"
            subtitle="Process bulk commission payments"
            currentStep={step}
            steps={steps}
            contentTitle={steps[step - 1].label}
            footer={footer}
            sidebarWidth="w-64"
        >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </WizardModal>
    )
}
