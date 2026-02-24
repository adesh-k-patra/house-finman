
import { useState } from 'react'
import { Eye, Download, Edit, RefreshCw, Check, ChevronRight, FileText, Sparkles } from 'lucide-react'
import { Button, SideDrawer } from '@/components/ui'
import { cn } from '@/utils'

interface Contract {
    id: string
    partner: {
        name: string
        initials: string
        color: string
    }
    type: string
    commission: string
    validity: string
    status: 'Active' | 'Expiring Soon' | 'Expired'
}

const dummyContracts: Contract[] = [
    {
        id: 'CTR-2026-001',
        partner: { name: 'HomeLoan Direct', initials: 'HD', color: 'bg-indigo-500' },
        type: 'Standard Agreement',
        commission: '1.5%',
        validity: '1/1/2025 - 12/31/2026',
        status: 'Active'
    },
    {
        id: 'CTR-2025-089',
        partner: { name: 'PropertyPro Agents', initials: 'PA', color: 'bg-purple-500' },
        type: 'Premium Agreement',
        commission: '2%',
        validity: '3/1/2025 - 2/28/2026',
        status: 'Expiring Soon'
    },
    {
        id: 'CTR-2025-076',
        partner: { name: 'Housing Finance Hub', initials: 'HF', color: 'bg-blue-500' },
        type: 'Standard Agreement',
        commission: '1.5%',
        validity: '6/1/2024 - 12/31/2025',
        status: 'Expired'
    },
    {
        id: 'CTR-2026-002',
        partner: { name: 'Metro Realty Services', initials: 'MR', color: 'bg-violet-500' },
        type: 'Premium Agreement',
        commission: '2%',
        validity: '1/1/2026 - 12/31/2027',
        status: 'Active'
    },
    {
        id: 'CTR-2025-092',
        partner: { name: 'Affordable Homes Network', initials: 'AH', color: 'bg-fuchsia-500' },
        type: 'Standard Agreement',
        commission: '1.5%',
        validity: '2/1/2025 - 1/31/2026',
        status: 'Expiring Soon'
    },
    {
        id: 'CTR-2025-088',
        partner: { name: 'Dream Home Advisors', initials: 'DH', color: 'bg-purple-600' },
        type: 'Platinum Agreement',
        commission: '2.5%',
        validity: '4/1/2025 - 3/31/2027',
        status: 'Active'
    },
]

const statusStyles = {
    'Active': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    'Expiring Soon': 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    'Expired': 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
}

// Wizard Steps Component
const WizardSteps = ({ currentStep }: { currentStep: number }) => {
    const steps = [
        { id: 1, label: 'Select Partner' },
        { id: 2, label: 'Define Terms' },
        { id: 3, label: 'Review & Sign' }
    ]

    return (
        <div className="flex items-center justify-between mb-8 px-4">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all duration-300",
                        currentStep >= step.id
                            ? "bg-primary-600 border-primary-600 text-white"
                            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500"
                    )}>
                        {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <span className={cn(
                        "ml-3 text-sm font-medium hidden sm:block",
                        currentStep >= step.id ? "text-primary-600 dark:text-primary-400" : "text-slate-500"
                    )}>
                        {step.label}
                    </span>
                    {index < steps.length - 1 && (
                        <div className={cn(
                            "h-0.5 flex-1 mx-4 transition-all duration-300",
                            currentStep > step.id ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-700"
                        )} />
                    )}
                </div>
            ))}
        </div>
    )
}

export default function ContractsPage() {
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
    const [isWizardOpen, setIsWizardOpen] = useState(false)
    const [wizardStep, setWizardStep] = useState(1)

    // Wizard Form State
    const [wizardData, setWizardData] = useState({
        partnerName: '',
        contractType: 'Standard',
        commissionRate: '1.5',
        validityYears: '1'
    })

    const handleNextStep = () => {
        if (wizardStep < 3) setWizardStep(prev => prev + 1)
        else {
            // Finish
            setIsWizardOpen(false)
            setWizardStep(1)
            // In a real app, you'd save the contract here
        }
    }

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Partner Contracts</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage agreement terms and renewals</p>
                </div>
                <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />} onClick={() => setIsWizardOpen(true)}>Smart Contract Generator</Button>
            </div>

            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest w-48 border-b border-slate-600 border-r border-slate-600">Contract ID</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Partner</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Type</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Commission</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Validity</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {dummyContracts.map((contract) => (
                            <tr
                                key={contract.id}
                                className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                onClick={() => setSelectedContract(contract)}
                            >
                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                    <span className="text-sm font-bold text-primary-600 group-hover:underline decoration-2 underline-offset-4">{contract.id}</span>
                                </td>
                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold text-white shadow-sm", contract.partner.color)}>
                                            {contract.partner.initials}
                                        </div>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                                            {contract.partner.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 text-center">{contract.type}</td>
                                <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{contract.commission}</span>
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-500 border-r border-slate-300 dark:border-slate-700 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {contract.validity}
                                    </div>
                                </td>
                                <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700 text-center">
                                    <span className={cn('inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm min-w-[80px] justify-center', statusStyles[contract.status])}>
                                        {contract.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 border-slate-300 dark:border-slate-700 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-1 text-slate-400 hover:text-primary-600 transition-colors" title="View Details">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors" onClick={(e) => e.stopPropagation()} title="Download PDF">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors" onClick={(e) => e.stopPropagation()} title="Edit">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Smart Contract Generator Wizard Modal (using absolute positioning to simulate modal for now) */}
            {isWizardOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary-600" />
                                    Smart Contract Generator
                                </h2>
                                <button onClick={() => setIsWizardOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <WizardSteps currentStep={wizardStep} />

                            <div className="mt-8 min-h-[200px]">
                                {wizardStep === 1 && (
                                    <div className="space-y-4 animate-fade-in">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Partner Name</span>
                                            <input
                                                type="text"
                                                className="input mt-1 w-full"
                                                placeholder="Search or enter partner name..."
                                                value={wizardData.partnerName}
                                                onChange={(e) => setWizardData({ ...wizardData, partnerName: e.target.value })}
                                            />
                                        </label>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-sm text-sm">
                                            <p>💡 Tip: Generating a contract for a new partner? Make sure their compliance documents are verified first.</p>
                                        </div>
                                    </div>
                                )}

                                {wizardStep === 2 && (
                                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Contract Type</span>
                                            <select className="input mt-1 w-full" value={wizardData.contractType} onChange={(e) => setWizardData({ ...wizardData, contractType: e.target.value })}>
                                                <option>Standard</option>
                                                <option>Premium</option>
                                                <option>Platinum</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Commission Rate (%)</span>
                                            <input type="text" className="input mt-1 w-full" value={wizardData.commissionRate} onChange={(e) => setWizardData({ ...wizardData, commissionRate: e.target.value })} />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Validity (Years)</span>
                                            <select className="input mt-1 w-full" value={wizardData.validityYears} onChange={(e) => setWizardData({ ...wizardData, validityYears: e.target.value })}>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                            </select>
                                        </label>
                                    </div>
                                )}

                                {wizardStep === 3 && (
                                    <div className="space-y-4 animate-fade-in text-center">
                                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready to Generate</h3>
                                        <p className="text-slate-500">Review the details below before generating the official contract.</p>

                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-sm text-left max-w-sm mx-auto text-sm space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Partner:</span>
                                                <span className="font-medium">{wizardData.partnerName || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Type:</span>
                                                <span className="font-medium">{wizardData.contractType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Commission:</span>
                                                <span className="font-medium">{wizardData.commissionRate}%</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between bg-slate-50 dark:bg-slate-800/20">
                            <Button variant="secondary" onClick={() => wizardStep > 1 ? setWizardStep(prev => prev - 1) : setIsWizardOpen(false)}>
                                {wizardStep === 1 ? 'Cancel' : 'Back'}
                            </Button>
                            <Button variant="primary" onClick={handleNextStep} rightIcon={wizardStep < 3 ? <ChevronRight className="w-4 h-4" /> : <Check className="w-4 h-4" />}>
                                {wizardStep === 3 ? 'Generate Contract' : 'Next Step'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contract Detail Drawer */}
            <SideDrawer
                isOpen={!!selectedContract}
                onClose={() => setSelectedContract(null)}
                title={selectedContract?.id || ''}
                subtitle={`Contract Details for ${selectedContract?.partner.name}`}
                size="lg"
                variant="SD_T1"
                icon={<FileText className="w-6 h-6 text-blue-600" />}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setSelectedContract(null)}>Close</Button>
                        <Button variant="primary" leftIcon={<Edit className="w-4 h-4" />}>Edit Contract</Button>
                    </>
                }
            >
                {selectedContract && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Status Banner */}
                        <div className={cn('p-4 rounded-sm border flex items-center justify-between',
                            selectedContract.status === 'Active' ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30' :
                                selectedContract.status === 'Expired' ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30' :
                                    'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30'
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center',
                                    selectedContract.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                                        selectedContract.status === 'Expired' ? 'bg-rose-100 text-rose-600' :
                                            'bg-amber-100 text-amber-600'
                                )}>
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn('text-sm font-bold',
                                        selectedContract.status === 'Active' ? 'text-emerald-800' :
                                            selectedContract.status === 'Expired' ? 'text-rose-800' :
                                                'text-amber-800'
                                    )}>{selectedContract.status === 'Active' ? 'Contract is Active' : selectedContract.status}</h3>
                                    <p className="text-xs opacity-80">Validity period: {selectedContract.validity}</p>
                                </div>
                            </div>
                            {(selectedContract.status === 'Expired' || selectedContract.status === 'Expiring Soon') && (
                                <Button size="sm" variant="primary">Renew Now</Button>
                            )}
                        </div>

                        {/* Partner Details */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Partner Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-sm">
                                    <p className="text-xs text-slate-500 mb-1">Partner Name</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{selectedContract.partner.name}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-sm">
                                    <p className="text-xs text-slate-500 mb-1">Agreement Type</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-900 dark:text-white">{selectedContract.type}</span>
                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">VERIFIED</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Terms */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Financial Terms</h4>
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-sm overflow-hidden">
                                <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-white/10">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 mb-1">Commission Rate</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedContract.commission}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 mb-1">Payout Cycle</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">Net 30</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 mb-1">TDS Rate</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">10%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Recent Activity</h4>
                            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6 pl-6 py-2">
                                <div className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Contract Viewed</p>
                                    <p className="text-xs text-slate-500">Just now • by You</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Commission Payout Processed</p>
                                    <p className="text-xs text-slate-500">2 days ago • System</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Contract Renewed</p>
                                    <p className="text-xs text-slate-500">Jan 1, 2025 • by Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SideDrawer>
        </div>
    )
}
