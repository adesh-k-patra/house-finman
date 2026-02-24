
import { useState } from 'react'
import { Plus, Trash2, Calendar, FileText, DollarSign, ArrowRight, Check } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'

interface CreatePOModalProps {
    isOpen: boolean
    onClose: () => void
    vendorName: string
    vendorId: string
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Order Details', description: 'Title & Dates' },
    { id: 2, label: 'Line Items', description: 'Products & Services' },
    { id: 3, label: 'Review', description: 'Summary & Terms' }
]

export function CreatePOModal({ isOpen, onClose, vendorName, vendorId }: CreatePOModalProps) {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        items: [{ id: 1, description: '', quantity: 1, rate: 0, amount: 0 }],
        notes: '',
        terms: ''
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
        alert('Purchase Order Created Successfully!')
    }

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }]
        })
    }

    const removeItem = (id: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter(item => item.id !== id)
        })
    }

    const updateItem = (id: number, field: string, value: any) => {
        setFormData({
            ...formData,
            items: formData.items.map(item => {
                if (item.id === id) {
                    const updated = { ...item, [field]: value }
                    if (field === 'quantity' || field === 'rate') {
                        updated.amount = Number(updated.quantity) * Number(updated.rate)
                    }
                    return updated
                }
                return item
            })
        })
    }

    const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0)

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-white/10 rounded-sm mb-4">
                <p className="text-sm text-slate-500">Vendor</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{vendorName} <span className="text-slate-400 text-sm font-normal">({vendorId})</span></p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PO Title <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="e.g. Q1 Office Supplies Restock"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            autoFocus={step === 1}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Order Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm focus:outline-none focus:border-primary-500 font-medium"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Delivery</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm focus:outline-none focus:border-primary-500 font-medium"
                                value={formData.deliveryDate}
                                onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                {formData.items.map((item, index) => (
                    <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-sm group relative">
                        <button
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeItem(item.id)}
                            disabled={formData.items.length === 1}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Description</label>
                                <input
                                    type="text"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-sm rounded-sm"
                                    placeholder="Item name..."
                                    value={item.description}
                                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                                    autoFocus={index === formData.items.length - 1}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Qty</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-sm rounded-sm text-center"
                                    value={item.quantity}
                                    onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rate</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-sm rounded-sm text-right"
                                    value={item.rate}
                                    onChange={e => updateItem(item.id, 'rate', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount</label>
                                <div className="p-2 text-sm font-bold text-slate-900 dark:text-white text-right">
                                    ${item.amount.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button variant="outline" className="w-full border-dashed" onClick={addItem} leftIcon={<Plus className="w-4 h-4" />}>
                Add Another Item
            </Button>

            <div className="flex justify-end border-t border-slate-200 dark:border-white/10 pt-4">
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold">Total Estimated Cost</p>
                    <p className="text-2xl font-bold text-primary-600">${totalAmount.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-white/10 rounded-sm text-center">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{formData.title}</h3>
                <p className="text-slate-500 mb-6">Vendor: {vendorName} • {formData.items.length} Items</p>

                <div className="max-w-xs mx-auto bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-sm text-slate-500">Total Order Value</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalAmount.toLocaleString()}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Terms & Conditions</label>
                    <textarea
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 text-sm rounded-sm min-h-[80px]"
                        placeholder="e.g. Net 30 payment terms..."
                        value={formData.terms}
                        onChange={e => setFormData({ ...formData, terms: e.target.value })}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create Purchase Order"
            subtitle="Procurement"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={step === 1 ? 'Order Details' : step === 2 ? 'Line Items' : 'Review & Propose'}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}

            footer={
                <>
                    {step < 3 ? (
                        <Button variant="primary" className="rounded-none" onClick={() => setStep(step + 1)} rightIcon={<ArrowRight className="w-4 h-4" />} disabled={!formData.title}>
                            Next Step
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="secondary" className="rounded-none" onClick={() => setStep(step - 1)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none" isLoading={isLoading} onClick={handleSubmit} leftIcon={<Check className="w-4 h-4" />}>
                                Create Order
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
