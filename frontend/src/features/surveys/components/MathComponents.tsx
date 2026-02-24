import { useState } from 'react'
import { Calculator, DollarSign, Percent, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'

// B.70 Financial Validators & Calculators
export function EMICalculator({ loanAmount, rate, tenure }: any) {
    const [amount, setAmount] = useState(loanAmount || 5000000)
    const [roi, setRoi] = useState(rate || 8.5)
    const [years, setYears] = useState(tenure || 20)

    const calculateEMI = () => {
        const r = roi / 12 / 100
        const n = years * 12
        const emi = amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
        return Math.round(emi)
    }

    const emi = calculateEMI()

    return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Calculator className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold uppercase text-xs tracking-wider text-slate-900 dark:text-white">Quick EMI Check</h3>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Loan Amount</label>
                    <div className="relative">
                        <DollarSign className="w-3 h-3 absolute left-2 top-2.5 text-slate-400" />
                        <input
                            type="number"
                            className="w-full pl-6 pr-2 py-1.5 text-sm font-bold border border-slate-200 bg-white"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500">Rate (%)</label>
                        <div className="relative">
                            <Percent className="w-3 h-3 absolute left-2 top-2.5 text-slate-400" />
                            <input
                                type="number"
                                className="w-full pl-6 pr-2 py-1.5 text-sm font-bold border border-slate-200 bg-white"
                                value={roi}
                                onChange={(e) => setRoi(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500">Tenure (Yrs)</label>
                        <input
                            type="number"
                            className="w-full px-2 py-1.5 text-sm font-bold border border-slate-200 bg-white"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="bg-purple-600 text-white p-3 text-center mt-2 shadow-sm">
                    <span className="text-[10px] uppercase font-bold opacity-80 block">Estimated EMI</span>
                    <span className="text-xl font-black">₹ {emi.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    )
}

// B.71 Score Weight Editor
export function ScoreWeightEditor({ questions, onUpdate }: any) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold uppercase text-xs tracking-wider text-slate-900 dark:text-white">Scoring Model</h3>
                <span className="text-[10px] font-mono text-slate-400">Total: 100%</span>
            </div>

            <div className="space-y-2">
                {questions.map((q: any) => (
                    <div key={q.id} className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 group">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{q.text}</p>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={q.weight}
                            className="w-24 h-1 bg-slate-200 rounded-none appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="w-12 text-right">
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{q.weight}%</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 p-2 bg-amber-50 border-l-2 border-amber-500 text-[10px] text-amber-700 font-medium">
                <AlertCircle className="w-3 h-3" />
                Weights must add up to exactly 100% to enable scoring.
            </div>
        </div>
    )
}
