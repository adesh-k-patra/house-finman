
import {
    ArrowRight,
    MapPin,
    DollarSign,
    Home
} from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'

interface PartnerPropertyCreateModalProps {
    isOpen: boolean
    onClose: () => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Property Details', description: 'Basic information.' }
]

export default function PartnerPropertyCreateModal({ isOpen, onClose }: PartnerPropertyCreateModalProps) {

    const handleCreate = () => {
        console.log(`Creating new property...`)
        onClose()
    }

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Property"
            subtitle="List a new property for this partner"
            steps={STEPS}
            currentStep={1}
            contentTitle="Property Details"
            showBackButton={false}
            footer={
                <>
                    <Button variant="secondary" className="rounded-none mr-2" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="rounded-none" onClick={handleCreate} rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Save Property
                    </Button>
                </>
            }
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mb-6">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-none">
                        <Home className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">New Property Listing</h4>
                        <p className="text-xs text-slate-500">Enter the property details to add a new listing.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Property Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. 3BHK Luxury Apartment in Indiranagar"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400 font-medium"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Property Type
                        </label>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-500 transition-colors font-medium">
                            <option>Apartment</option>
                            <option>Villa</option>
                            <option>Plot</option>
                            <option>Commercial</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Status
                        </label>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-500 transition-colors font-medium">
                            <option value="listed">Listed</option>
                            <option value="sold">Sold</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Price (₹)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400 font-medium"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Area (Sq. Ft)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g. 1200"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Address
                    </label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                            <MapPin className="w-4 h-4 text-slate-400" />
                        </div>
                        <textarea
                            rows={2}
                            placeholder="Detailed property address..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-indigo-500 resize-none transition-colors placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </div>
            </div>
        </WizardModal>
    )
}
