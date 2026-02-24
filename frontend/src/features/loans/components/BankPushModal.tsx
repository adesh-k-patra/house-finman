import { useState } from 'react'
import { Building, Send, CheckCircle, AlertTriangle, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

interface BankOption {
    id: string
    name: string
    logo_color: string
    match_score: number
    features: string[]
}

export function BankPushModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [selectedBanks, setSelectedBanks] = useState<string[]>([])
    const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select')

    const banks: BankOption[] = [
        { id: 'hdfc', name: 'HDFC Bank', logo_color: 'bg-blue-600', match_score: 98, features: ['Lowest Rate', 'Instant Approval'] },
        { id: 'sbi', name: 'SBI', logo_color: 'bg-blue-400', match_score: 95, features: ['Govt Backed', 'High Tenure'] },
        { id: 'icici', name: 'ICICI Bank', logo_color: 'bg-orange-600', match_score: 88, features: ['Digital Process'] },
        { id: 'kotak', name: 'Kotak', logo_color: 'bg-red-600', match_score: 82, features: ['Quick Disbursal'] },
    ]

    const toggleBank = (id: string) => {
        setSelectedBanks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="w-[600px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Building className="w-6 h-6 text-emerald-600" />
                            Send to Bank
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Push pre-qualified leads to partner lenders</p>
                    </div>
                    {step === 'select' && (
                        <div className="text-right">
                            <span className="block text-2xl font-bold text-slate-900 dark:text-white">₹ 2.5 Cr</span>
                            <span className="text-xs uppercase font-bold text-slate-400">Loan Amount</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 min-h-[300px]">
                    {step === 'select' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm">
                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                <span>Based on credit score (750+) and income, we recommend these 4 lenders.</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {banks.map(bank => (
                                    <div
                                        key={bank.id}
                                        onClick={() => toggleBank(bank.id)}
                                        className={`
                                            flex items-center justify-between p-4 border cursor-pointer transition-all group
                                            ${selectedBanks.includes(bank.id)
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 ${bank.logo_color} flex items-center justify-center text-white font-bold rounded-none`}>
                                                {bank.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white">{bank.name}</h3>
                                                <div className="flex gap-2 mt-1">
                                                    {bank.features.map(f => (
                                                        <span key={f} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-slate-500 uppercase font-bold">
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold mb-1">
                                                <span className="text-lg">{bank.match_score}%</span> Match
                                            </div>
                                            {selectedBanks.includes(bank.id) && (
                                                <div className="flex items-center justify-end gap-1 text-xs text-emerald-600 font-bold uppercase">
                                                    <CheckCircle className="w-3 h-3" /> Selected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="text-center py-8">
                            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirm Data Sharing</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-6">
                                You are about to share PII (Personally Identifiable Information) and Financial Documents of <span className="font-bold text-slate-900">Rahul Varma</span> with <span className="font-bold text-slate-900">{selectedBanks.length} banks</span>.
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 max-w-sm mx-auto text-left space-y-2 border border-slate-200 dark:border-slate-700">
                                <p className="text-xs flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-500" /> PAN Card & Aadhaar
                                </p>
                                <p className="text-xs flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-500" /> ITR & Salary Slips (Last 3 Years)
                                </p>
                                <p className="text-xs flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Credit Report Summary
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-none flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <Send className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Applications Sent!</h3>
                            <p className="text-slate-500">Reference ID: <span className="font-mono bg-slate-100 px-2 py-0.5">REQ-2024-8821</span></p>
                            <p className="text-sm text-slate-400 mt-4">Banks typically respond within 24-48 hours.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    {step !== 'success' && (
                        <Button variant="ghost" className="rounded-none hover:bg-slate-200 dark:hover:bg-slate-800" onClick={onClose}>
                            Cancel
                        </Button>
                    )}

                    {step === 'select' && (
                        <Button
                            className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-none gap-2 px-8"
                            disabled={selectedBanks.length === 0}
                            onClick={() => setStep('confirm')}
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    )}

                    {step === 'confirm' && (
                        <Button
                            className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-none gap-2 px-8"
                            onClick={() => setStep('success')}
                        >
                            Confirm & Send <Send className="w-4 h-4" />
                        </Button>
                    )}

                    {step === 'success' && (
                        <Button
                            className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-none"
                            onClick={onClose}
                        >
                            Done
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
