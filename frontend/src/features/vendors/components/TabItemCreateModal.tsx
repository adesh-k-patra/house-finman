
// useState removed
import { useMemo } from 'react'
import {
    ArrowRight,
    Package,
    FileText,
    DollarSign,
    Box,
    Truck
} from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
// cn removed

interface TabItemCreateModalProps {
    isOpen: boolean
    onClose: () => void
    tabType: string
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Details', description: 'Enter information.' }
]

export default function TabItemCreateModal({ isOpen, onClose, tabType }: TabItemCreateModalProps) {
    // Determine title based on tabType
    const getTitle = () => {
        switch (tabType) {
            case 'products': return 'Add Product'
            case 'documents': return 'Upload Document'
            case 'invoices': return 'Create Invoice'
            case 'orders': return 'Create Order'
            default: return 'Add Item'
        }
    }

    // Determine icon based on tabType
    const getIcon = () => {
        switch (tabType) {
            case 'products': return Package
            case 'documents': return FileText
            case 'invoices': return DollarSign
            case 'orders': return Truck
            default: return Box
        }
    }

    const Icon = useMemo(() => getIcon(), [tabType])

    const handleCreate = () => {
        console.log(`Creating item for ${tabType}...`)
        onClose()
    }

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title={getTitle()}
            subtitle={`Add to ${tabType}`}
            steps={STEPS}
            currentStep={1}
            contentTitle="Item Details"
            showBackButton={false}
            footer={
                <>
                    <Button variant="secondary" className="rounded-none mr-2" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="rounded-none" onClick={handleCreate} rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Save Item
                    </Button>
                </>
            }
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mb-6">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-none">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">New {tabType} Entry</h4>
                        <p className="text-xs text-slate-500">Enter the details below to add a new record.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Name / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter item name"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400 font-medium"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Type / Category
                        </label>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-emerald-500 transition-colors font-medium">
                            <option>Standard</option>
                            <option>Premium</option>
                            <option>Service</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Status
                        </label>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-emerald-500 transition-colors font-medium">
                            <option>Active</option>
                            <option>Draft</option>
                            <option>Review</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Notes
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Additional details..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-emerald-500 resize-none transition-colors placeholder:text-slate-400 font-medium"
                    />
                </div>
            </div>
        </WizardModal>
    )
}
