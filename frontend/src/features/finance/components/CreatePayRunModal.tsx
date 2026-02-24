
import { useState } from 'react'
import { Calendar, Users, DollarSign, ArrowRight, Check, AlertCircle, Plus, Minus } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { cn, formatCurrency } from '@/utils'

interface CreatePayRunModalProps {
    isOpen: boolean
    onClose: () => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Pay Period', description: 'Dates and type.' },
    { id: 2, label: 'Employees', description: 'Selection & Adjustments.' },
    { id: 3, label: 'Review', description: 'Summary & confirmation.' }
]

const DUMMY_EMPLOYEES = [
    { id: 1, name: 'Alice Smith', role: 'Sales Manager', salary: 85000 },
    { id: 2, name: 'Bob Johnson', role: 'Developer', salary: 92000 },
    { id: 3, name: 'Charlie Brown', role: 'Designer', salary: 78000 },
    { id: 4, name: 'Diana Prince', role: 'HR', salary: 75000 },
    { id: 5, name: 'Evan Wright', role: 'Support', salary: 45000 },
]

export function CreatePayRunModal({ isOpen, onClose }: CreatePayRunModalProps) {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
    const [adjustments, setAdjustments] = useState<Record<number, number>>({}) // employeeId -> adjustment amount
    const [dates, setDates] = useState({
        start: '',
        end: '',
        paymentDate: ''
    })

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        handleClose()
    }

    const totalPayout = DUMMY_EMPLOYEES
        .filter(emp => selectedEmployees.includes(emp.id))
        .reduce((sum, emp) => sum + emp.salary + (adjustments[emp.id] || 0), 0)

    const toggleEmployee = (id: number) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(e => e !== id))
        } else {
            setSelectedEmployees([...selectedEmployees, id])
        }
    }

    const toggleAll = () => {
        if (selectedEmployees.length === DUMMY_EMPLOYEES.length) {
            setSelectedEmployees([])
        } else {
            setSelectedEmployees(DUMMY_EMPLOYEES.map(e => e.id))
        }
    }

    const handleAdjustment = (id: number, amount: number) => {
        setAdjustments(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + amount
        }))
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pay Period Start</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            value={dates.start}
                            onChange={e => setDates({ ...dates, start: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pay Period End</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            value={dates.end}
                            onChange={e => setDates({ ...dates, end: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Date</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        value={dates.paymentDate}
                        onChange={e => setDates({ ...dates, paymentDate: e.target.value })}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Ideally 1-2 days after period end.
                </p>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Select & Adjust</h4>
                <Button variant="ghost" size="sm" onClick={toggleAll} className="rounded-none">
                    {selectedEmployees.length === DUMMY_EMPLOYEES.length ? 'Deselect All' : 'Select All'}
                </Button>
            </div>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                {DUMMY_EMPLOYEES.map(emp => {
                    const isSelected = selectedEmployees.includes(emp.id)
                    const adj = adjustments[emp.id] || 0
                    return (
                        <div
                            key={emp.id}
                            className={cn(
                                "flex flex-col gap-2 p-4 rounded-none border transition-all",
                                isSelected
                                    ? "bg-primary-50 dark:bg-primary-900/10 border-primary-500 dark:border-primary-500/50"
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            )}
                        >
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleEmployee(emp.id)}>
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-5 h-5 rounded-none border flex items-center justify-center transition-colors",
                                        isSelected ? "bg-primary-600 border-primary-600" : "border-slate-300 bg-white"
                                    )}>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</p>
                                        <p className="text-xs text-slate-500">{emp.role}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {formatCurrency(emp.salary)}
                                </p>
                            </div>

                            {isSelected && (
                                <div className="flex items-center justify-end gap-4 mt-2 pt-2 border-t border-dashed border-primary-200 dark:border-primary-800/30">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Adjustments:</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleAdjustment(emp.id, -1000)} className="p-1 hover:bg-red-100 text-red-600 rounded-none border border-transparent hover:border-red-200 transition-colors"><Minus className="w-3 h-3" /></button>
                                        <span className={cn("text-xs font-mono font-bold w-16 text-center", adj > 0 ? "text-emerald-600" : adj < 0 ? "text-red-600" : "text-slate-400")}>
                                            {adj > 0 ? '+' : ''}{adj}
                                        </span>
                                        <button onClick={() => handleAdjustment(emp.id, 1000)} className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-none border border-transparent hover:border-emerald-200 transition-colors"><Plus className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-none flex justify-between items-center shadow-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Payroll Total</span>
                <span className="font-bold font-mono text-lg">{formatCurrency(totalPayout)}</span>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-none p-8 text-white text-center shadow-xl border border-slate-700">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Net Payable</p>
                <h2 className="text-5xl font-black tracking-tight">{formatCurrency(totalPayout * 0.9)}</h2>
                <div className="mt-6 flex items-center justify-center gap-6 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary-500" /> {selectedEmployees.length} Employees</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500" /> {dates.paymentDate || 'Pending Date'}</span>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-2">Breakdown</h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Gross Salaries</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(totalPayout)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Tax Deductions (Est. 10%)</span>
                        <span className="font-bold text-red-600 font-mono">-{formatCurrency(totalPayout * 0.1)}</span>
                    </div>
                    <div className="border-t-2 border-slate-900 dark:border-white my-2 pt-2 flex justify-between text-base font-black uppercase tracking-wide">
                        <span className="text-slate-900 dark:text-white">Net Total</span>
                        <span className="text-primary-600">{formatCurrency(totalPayout * 0.9)}</span>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create Pay Run"
            subtitle="Payroll Processing"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={step === 1 ? 'Period Details' : step === 2 ? 'Employee Selection' : 'Review & Submit'}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step < 3 ? (
                        <div className="flex gap-2 w-full justify-end">
                            {step > 1 && <Button variant="secondary" className="rounded-none border-slate-300" onClick={() => setStep(step - 1)}>Back</Button>}
                            <Button variant="primary" className="rounded-none" onClick={() => setStep(step + 1)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                                Next Step
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="secondary" className="rounded-none border-slate-300" onClick={() => setStep(2)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none" isLoading={isLoading} onClick={handleSubmit} leftIcon={<Check className="w-4 h-4" />}>
                                Process Payroll
                            </Button>
                        </div>
                    )}
                </>
            }
        >
            {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
        </WizardModal>
    )
}
