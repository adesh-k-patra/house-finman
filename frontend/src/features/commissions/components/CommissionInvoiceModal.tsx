
import { Printer, Share2, Receipt } from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'
import { formatCurrency } from '@/utils'
// useState removed

interface CommissionInvoiceModalProps {
    isOpen: boolean
    onClose: () => void
    commissionId: string
    amount: number
    partnerName: string
    date: string
}

export function CommissionInvoiceModal({ isOpen, onClose, commissionId, amount, partnerName, date }: CommissionInvoiceModalProps) {
    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Commission Invoice"
            subtitle={`INV-${commissionId.split('-')[1]}`}
            sidebarWidth="w-[300px]"
            currentStep={1}
            steps={[
                { id: 1, label: 'Invoice Preview', description: 'Review details' },
                { id: 2, label: 'Actions', description: 'Print or Share' },
            ]}
            contentTitle="Invoice Preview"
            footer={
                <div className="flex justify-between w-full">
                    <Button variant="secondary" onClick={onClose} leftIcon={<Printer className="w-4 h-4" />}>Print</Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" onClick={() => { alert('Invoice Sent!'); onClose() }} leftIcon={<Share2 className="w-4 h-4" />}>Share Invoice</Button>
                    </div>
                </div>
            }
        >
            <div className="animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 shadow-sm relative overflow-hidden">
                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none opacity-[0.03]">
                    <Receipt className="w-96 h-96 text-slate-900 dark:text-white" />
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold rounded-sm">HF</div>
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">House FinMan</span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest max-w-[150px] leading-relaxed">
                            123, Financial District,
                            Mumbai, MH 400001
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Invoice</h2>
                        <p className="text-sm font-mono text-slate-500">#{commissionId}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-2">{new Date(date).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-8 relative z-10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Bill To</p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{partnerName}</h3>
                    <p className="text-sm text-slate-500">Partner ID: PRT-{commissionId.split('-')[1]}</p>
                </div>

                {/* Line Items */}
                <div className="relative z-10">
                    <div className="flex justify-between py-2 border-b-2 border-slate-900 dark:border-white mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Description</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Amount</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-white/5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Commission Payout</span>
                        <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(amount)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-white/5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">TDS Deduction (10%)</span>
                        <span className="text-sm font-mono font-bold text-red-600">-{formatCurrency(amount * 0.1)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-6 mt-2">
                        <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Total Payable</span>
                        <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">{formatCurrency(amount * 0.9)}</span>
                    </div>
                </div>
            </div>
        </WizardModal>
    )
}
