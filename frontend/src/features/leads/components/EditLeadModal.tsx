import { useState, useMemo, useEffect } from 'react'
import { WizardModal, WizardStep, Button } from '@/components/ui'
import { Lead } from '@/types'
import {
    User,
    Building,
    MapPin,
    CheckCircle2,
    Search,
    Briefcase,
    Wallet,
    FileText,
    ArrowRight,
    CreditCard,
    ShieldCheck,
    Plus,
    Trash2,
    Home,
    AlertCircle,
    Zap,
    Layout,
    PaintBucket,
    Lightbulb,
    Wifi,
    Grid,
    Check,
    Eye
} from 'lucide-react'
import { cn, formatCurrency } from '@/utils'
import { dummyProperties } from '../../properties/data/dummyProperties'
import { DocumentValidationModal } from './DocumentValidationModal'

interface EditLeadModalProps {
    lead: Lead | null
    isOpen: boolean
    onClose: () => void
    onSave: (updatedLead: Lead) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Lead Profile', description: 'Contact & Buyer Info' },
    { id: 2, label: 'Property Config', description: 'Selection & Add-ons' },
    { id: 3, label: 'Readiness', description: 'Financial & KYC' }
]

// Mock Data for Dropdowns & Configs
const UNIT_CONFIGS = [
    { id: '2bhk-a', label: '2BHK - Layout A', area: '1150 sqft', basePriceMod: 0 },
    { id: '2bhk-b', label: '2BHK - Layout B', area: '1250 sqft', basePriceMod: 500000 },
    { id: '3bhk-a', label: '3BHK - Grand', area: '1600 sqft', basePriceMod: 2500000 },
    { id: '3bhk-b', label: '3BHK - Premium', area: '1850 sqft', basePriceMod: 4000000 },
]

const ADD_ONS = [
    { id: 'modular-kitchen', label: 'Modular Kitchen', price: 150000, icon: Layout },
    { id: 'extra-electrical', label: 'Extra Electrical', price: 45000, icon: Lightbulb },
    { id: 'premium-paint', label: 'Premium Paint', price: 85000, icon: PaintBucket },
    { id: 'false-ceiling', label: 'False Ceiling', price: 120000, icon: Grid },
    { id: 'smart-home', label: 'Smart Home', price: 250000, icon: Wifi },
    { id: 'flooring-upgrade', label: 'Italian Marble', price: 350000, icon: Zap },
]

interface SelectedPropertyState {
    propertyId: string
    unitConfigId: string
    floorPreference: string
    facing: string
    parkingCount: number
    selectedAddOns: string[]
    customAddOns: { id: number; name: string; price: number }[]
}

const InputCell = ({
    label,
    children,
    className,
    required = false,
    icon: Icon
}: {
    label: string,
    children: React.ReactNode,
    className?: string,
    required?: boolean,
    icon?: any
}) => (
    <div className={cn("relative group bg-white dark:bg-slate-900 p-3 lg:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus-within:bg-blue-50/10 focus-within:ring-[1px] focus-within:ring-inset focus-within:ring-blue-500 z-0 focus-within:z-10", className)}>
        <div className="flex items-center gap-1.5 mb-2">
            {Icon && <Icon className="w-3 h-3 text-slate-400" />}
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label} {required && <span className="text-red-500">*</span>}</span>
        </div>
        <div className="relative">
            {children}
        </div>
    </div>
)

export function EditLeadModal({ lead, isOpen, onClose, onSave }: EditLeadModalProps) {
    const [step, setStep] = useState(1)

    // --- Form States ---
    // Tab 1: Lead Details
    const [leadDetails, setLeadDetails] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        altPhone: '',
        email: '',
        contactMethod: 'Call', // Call, WhatsApp, Email
        source: 'Website',
        assignee: 'Rohit Sharma',
        city: '',
        buyerType: 'End User', // End User, Investor
        employmentType: 'Salaried',
        companyName: '',
        annualIncome: '',
        purchaseTimeline: '3-6 months',
        budgetMin: '',
        budgetMax: '',
        notes: '',
        internalNotes: ''
    })

    // Tab 2: Properties
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProperties, setSelectedProperties] = useState<SelectedPropertyState[]>([])

    // Tab 3: Readiness
    const [readiness, setReadiness] = useState({
        kycPan: false,
        kycAadhaar: false,
        kycIncome: false,
        kycBank: false,
        cibilRange: '750+',
        existingLoans: false,
        existingEmi: '',
        coApplicant: false,
        employmentStability: '', // Years
        residencyType: 'Owned', // Owned, Rented
        preferredBank: 'HDFC',
        loanType: 'Home Loan'
    })

    // Validation Modal State
    const [showValidation, setShowValidation] = useState(false)
    const [validatingDoc, setValidatingDoc] = useState('PAN Card')

    // Initialize
    useEffect(() => {
        if (lead && isOpen) {
            const nameParts = lead.name.split(' ')
            setLeadDetails(prev => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                phone: lead.phone || '',
                email: lead.email || '',
                city: lead.city || '',
                source: lead.source as string || 'Website',
                annualIncome: '', // Not in Lead type
                employmentType: lead.incomeType === 'salaried' ? 'Salaried' : lead.incomeType === 'self_employed' ? 'Self-Employed' : 'Business Owner',
            }))
            // Reset others if needed or load deeper mock data
        }
    }, [lead, isOpen])

    // --- Helpers ---
    const filteredProperties = useMemo(() => {
        if (!searchQuery) return dummyProperties.slice(0, 5)
        return dummyProperties.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery])

    const handleSelectProperty = (propertyId: string) => {
        if (selectedProperties.find(p => p.propertyId === propertyId)) return
        setSelectedProperties([...selectedProperties, {
            propertyId,
            unitConfigId: '2bhk-a',
            floorPreference: 'Middle',
            facing: 'East',
            parkingCount: 1,
            selectedAddOns: [],
            customAddOns: []
        }])
    }

    const handleRemoveProperty = (propertyId: string) => {
        setSelectedProperties(prev => prev.filter(p => p.propertyId !== propertyId))
    }

    const updatePropertyConfig = (id: string, updates: Partial<SelectedPropertyState>) => {
        setSelectedProperties(prev => prev.map(p => p.propertyId === id ? { ...p, ...updates } : p))
    }

    const calculatePropertyTotal = (propState: SelectedPropertyState, basePrice: number) => {
        const configPrice = UNIT_CONFIGS.find(c => c.id === propState.unitConfigId)?.basePriceMod || 0
        const addOnsPrice = propState.selectedAddOns.reduce((sum, id) => {
            return sum + (ADD_ONS.find(a => a.id === id)?.price || 0)
        }, 0)
        const customAddOnsPrice = propState.customAddOns.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

        return basePrice + configPrice + addOnsPrice + customAddOnsPrice
    }

    const handleSave = () => {
        if (!lead) return
        onSave({
            ...lead,
            name: `${leadDetails.firstName} ${leadDetails.lastName}`,
            phone: leadDetails.phone,
            email: leadDetails.email,
            city: leadDetails.city,
            source: leadDetails.source as any,
            // In real app, all readiness/property data would be saved too
        })
        onClose()
    }

    const handleValidationApprove = () => {
        // Mock approval logic
        if (validatingDoc === 'PAN Card') setReadiness(prev => ({ ...prev, kycPan: true }))
        // Add more mapping for real implementation
        setShowValidation(false)
    }

    // --- Tab Renders ---

    const renderTab1 = () => (
        <div className="animate-fade-in custom-scrollbar h-[65vh] overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8 pb-8">

                {/* Section: Personal Info */}
                <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 bg-blue-500 rounded-full"></span>
                        Contact Information
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-white/10 gap-[1px]">
                        <InputCell label="First Name" required className="col-span-1 lg:col-span-2">
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.firstName}
                                onChange={e => setLeadDetails({ ...leadDetails, firstName: e.target.value })}
                                placeholder="Enter first name"
                            />
                        </InputCell>
                        <InputCell label="Last Name" className="col-span-1 lg:col-span-2">
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.lastName}
                                onChange={e => setLeadDetails({ ...leadDetails, lastName: e.target.value })}
                                placeholder="Enter last name"
                            />
                        </InputCell>
                        <InputCell label="Primary Mobile" required icon={User}>
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.phone}
                                onChange={e => setLeadDetails({ ...leadDetails, phone: e.target.value })}
                                placeholder="+91 XXXXX"
                            />
                        </InputCell>
                        <InputCell label="Alt Mobile">
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.altPhone}
                                onChange={e => setLeadDetails({ ...leadDetails, altPhone: e.target.value })}
                                placeholder="Optional"
                            />
                        </InputCell>
                        <InputCell label="Email ID" className="col-span-2">
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.email}
                                onChange={e => setLeadDetails({ ...leadDetails, email: e.target.value })}
                                placeholder="name@domain.com"
                            />
                        </InputCell>
                        <InputCell label="City / Location" className="col-span-2 bg-slate-50/50">
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.city}
                                onChange={e => setLeadDetails({ ...leadDetails, city: e.target.value })}
                                placeholder="Current City"
                            />
                        </InputCell>
                        <InputCell label="Preferred Method">
                            <select className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer" value={leadDetails.contactMethod} onChange={e => setLeadDetails({ ...leadDetails, contactMethod: e.target.value })}>
                                <option>Call</option>
                                <option>WhatsApp</option>
                                <option>Email</option>
                            </select>
                        </InputCell>
                        <InputCell label="Source">
                            <select className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer" value={leadDetails.source} onChange={e => setLeadDetails({ ...leadDetails, source: e.target.value })}>
                                <option>Website</option>
                                <option>Walk-in</option>
                                <option>Referral</option>
                            </select>
                        </InputCell>
                    </div>
                </div>

                {/* Section: Buyer Profile */}
                <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                        Buyer Profile
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-white/10 gap-[1px]">
                        <InputCell label="Buyer Type" icon={Briefcase}>
                            <select className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer" value={leadDetails.buyerType} onChange={e => setLeadDetails({ ...leadDetails, buyerType: e.target.value })}>
                                <option>End User</option>
                                <option>Investor</option>
                            </select>
                        </InputCell>
                        <InputCell label="Employment">
                            <select className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer" value={leadDetails.employmentType} onChange={e => setLeadDetails({ ...leadDetails, employmentType: e.target.value })}>
                                <option>Salaried</option>
                                <option>Self-Employed</option>
                                <option>Business</option>
                            </select>
                        </InputCell>
                        <InputCell label="Company Name" className="col-span-2">
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.companyName}
                                onChange={e => setLeadDetails({ ...leadDetails, companyName: e.target.value })}
                                placeholder="Organization Name"
                            />
                        </InputCell>
                        <InputCell label="Annual Income" icon={Wallet}>
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.annualIncome}
                                onChange={e => setLeadDetails({ ...leadDetails, annualIncome: e.target.value })}
                                placeholder="e.g. 15 LPA"
                            />
                        </InputCell>
                        <InputCell label="Purchase Timeline">
                            <select className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer" value={leadDetails.purchaseTimeline} onChange={e => setLeadDetails({ ...leadDetails, purchaseTimeline: e.target.value })}>
                                <option>Immediate</option>
                                <option>3-6 Months</option>
                                <option>6-12 Months</option>
                            </select>
                        </InputCell>
                        <InputCell label="Budget Min">
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.budgetMin}
                                onChange={e => setLeadDetails({ ...leadDetails, budgetMin: e.target.value })}
                                placeholder="Min Cr/L"
                            />
                        </InputCell>
                        <InputCell label="Budget Max">
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={leadDetails.budgetMax}
                                onChange={e => setLeadDetails({ ...leadDetails, budgetMax: e.target.value })}
                                placeholder="Max Cr/L"
                            />
                        </InputCell>
                    </div>
                </div>

                {/* Section: Notes */}
                <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 bg-purple-500 rounded-full"></span>
                        Notes
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-white/10 gap-[1px]">
                        <InputCell label="Internal Notes (Team Visible)" icon={FileText} className="h-32">
                            <textarea className="w-full h-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-300 resize-none leading-relaxed"
                                value={leadDetails.internalNotes}
                                onChange={e => setLeadDetails({ ...leadDetails, internalNotes: e.target.value })}
                                placeholder="Add private notes for the team..."
                            />
                        </InputCell>
                        <InputCell label="Customer Requirements" className="h-32">
                            <textarea className="w-full h-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-300 resize-none leading-relaxed"
                                value={leadDetails.notes}
                                onChange={e => setLeadDetails({ ...leadDetails, notes: e.target.value })}
                                placeholder="Specific property requirements..."
                            />
                        </InputCell>
                    </div>
                </div>

            </div>
        </div>
    )

    const renderTab2 = () => (
        <div className="flex flex-col h-[65vh] animate-fade-in text-slate-900 dark:text-white">
            {/* Dynamic Search Header */}
            <div className="mb-6 relative z-30 w-full max-w-4xl mx-auto">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl shadow-lg shadow-slate-200/20 dark:shadow-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold transition-all"
                        placeholder="Search properties by name, location..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {/* Autocomplete Dropdown */}
                    {searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl overflow-hidden z-50">
                            {filteredProperties.map(prop => (
                                <div key={prop.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center justify-between group/item" onClick={() => { handleSelectProperty(prop.id); setSearchQuery('') }}>
                                    <div className="flex items-center gap-4">
                                        <img src={prop.image} className="w-12 h-12 object-cover rounded-lg bg-slate-200" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{prop.title}</p>
                                            <p className="text-xs text-slate-500">{prop.location}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all transform scale-75 group-hover/item:scale-100">
                                        <Plus className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 space-y-8 max-w-5xl mx-auto w-full px-1">
                {selectedProperties.length === 0 ? (
                    <div className="h-64 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-6 hover:bg-slate-50/50 transition-colors">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Building className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">No Properties Selected</h4>
                        <p className="text-xs text-slate-400 max-w-xs">Search and select a property above to configure unit details, add-ons, and view financial estimates.</p>
                    </div>
                ) : (
                    selectedProperties.map((propState) => {
                        const baseProp = dummyProperties.find(p => p.id === propState.propertyId)
                        if (!baseProp) return null
                        const totalCost = calculatePropertyTotal(propState, baseProp.price)
                        const loanMax = totalCost * 0.85
                        const downPayment = totalCost * 0.20

                        return (
                            <div key={propState.propertyId} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden animate-slide-up-fade">
                                {/* Product Header */}
                                <div className="relative h-32 md:h-40 overflow-hidden">
                                    <img src={baseProp.image} className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-6">
                                        <div className="w-full flex justify-between items-end">
                                            <div>
                                                <div className="flex gap-2 mb-2">
                                                    <span className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-100 text-[10px] font-bold uppercase tracking-wider rounded-md">Verified</span>
                                                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">{baseProp.status || 'Pre-Launch'}</span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold text-white mb-0.5">{baseProp.title}</h3>
                                                <p className="text-slate-300 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {baseProp.location}</p>
                                            </div>
                                            <div className="text-right hidden md:block">
                                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Base Price</p>
                                                <p className="text-2xl font-mono font-bold text-white">{formatCurrency(baseProp.price)}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveProperty(propState.propertyId)}
                                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-red-500 hover:text-white text-white backdrop-blur-md rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Deep Configuration Deck */}
                                <div className="p-6 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Layout className="w-3 h-3" /> Unit Configuration</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Unit Type</label>
                                            <select className="w-full bg-white dark:bg-slate-800 border-none rounded-lg shadow-sm text-xs font-bold py-2.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500" value={propState.unitConfigId} onChange={(e) => updatePropertyConfig(propState.propertyId, { unitConfigId: e.target.value })}>
                                                {UNIT_CONFIGS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Floor</label>
                                            <select className="w-full bg-white dark:bg-slate-800 border-none rounded-lg shadow-sm text-xs font-bold py-2.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500" value={propState.floorPreference} onChange={(e) => updatePropertyConfig(propState.propertyId, { floorPreference: e.target.value })}>
                                                <option>Higher (15+)</option>
                                                <option>Middle (5-15)</option>
                                                <option>Lower (1-5)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Facing</label>
                                            <select className="w-full bg-white dark:bg-slate-800 border-none rounded-lg shadow-sm text-xs font-bold py-2.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500" value={propState.facing} onChange={(e) => updatePropertyConfig(propState.propertyId, { facing: e.target.value })}>
                                                <option>East</option>
                                                <option>West</option>
                                                <option>North</option>
                                                <option>South</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Parking</label>
                                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm">
                                                <button className="w-8 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-xs font-bold transition-colors" onClick={() => updatePropertyConfig(propState.propertyId, { parkingCount: Math.max(0, propState.parkingCount - 1) })}>-</button>
                                                <span className="flex-1 text-center text-xs font-bold">{propState.parkingCount}</span>
                                                <button className="w-8 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-xs font-bold transition-colors" onClick={() => updatePropertyConfig(propState.propertyId, { parkingCount: propState.parkingCount + 1 })}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Split Section: Add-ons & Cost Sheet */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/5">
                                    {/* Left: Enhancements (Cards) */}
                                    <div className="lg:col-span-7 p-6">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-3 h-3" /> Enhancements</h5>
                                        <div className="grid grid-cols-2 gap-3">
                                            {ADD_ONS.map(addon => {
                                                const isSelected = propState.selectedAddOns.includes(addon.id)
                                                return (
                                                    <div
                                                        key={addon.id}
                                                        onClick={() => {
                                                            const newAddons = isSelected
                                                                ? propState.selectedAddOns.filter(id => id !== addon.id)
                                                                : [...propState.selectedAddOns, addon.id]
                                                            updatePropertyConfig(propState.propertyId, { selectedAddOns: newAddons })
                                                        }}
                                                        className={cn(
                                                            "relative p-3 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 select-none",
                                                            isSelected
                                                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm"
                                                                : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                                                        )}
                                                    >
                                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors", isSelected ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400")}>
                                                            <addon.icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={cn("text-xs font-bold truncate", isSelected ? "text-blue-900 dark:text-blue-100" : "text-slate-700 dark:text-slate-300")}>{addon.label}</p>
                                                            <p className="text-[10px] font-mono text-slate-500">+{formatCurrency(addon.price)}</p>
                                                        </div>
                                                        {isSelected && <div className="absolute top-2 right-2 text-blue-500"><CheckCircle2 className="w-3.5 h-3.5" /></div>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Right: Deal Sheet (Vertical) */}
                                    <div className="lg:col-span-5 bg-slate-50/50 dark:bg-white/[0.02] p-6 flex flex-col justify-between">
                                        <div>
                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Wallet className="w-3 h-3" /> Deal Sheet</h5>
                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Base Cost</span>
                                                    <span className="font-mono font-medium text-slate-900 dark:text-white">{formatCurrency(baseProp.price)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Config & Add-ons</span>
                                                    <span className="font-mono font-medium text-emerald-600">+{formatCurrency(totalCost - baseProp.price)}</span>
                                                </div>
                                                {/* Divider */}
                                                <div className="h-px bg-slate-200 dark:bg-white/10 my-2 w-full"></div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Total Purchase Price</span>
                                                    <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(totalCost)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/5 flex flex-col gap-1 shadow-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">Min. Down Payment (20%)</span>
                                                    <span className="text-xs font-mono font-bold text-emerald-600">{formatCurrency(downPayment)}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-500 w-[20%] h-full rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/5 flex flex-col gap-1 shadow-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">Est. Loan Amount</span>
                                                    <span className="text-xs font-mono font-bold text-blue-600">{formatCurrency(loanMax)}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Home className="w-3 h-3" /> HDFC @ 8.5%</span>
                                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">~ {formatCurrency(loanMax / 100 / 12)}/mo</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )

    const renderTab3 = () => (
        <div className="animate-fade-in custom-scrollbar h-[65vh] overflow-y-auto max-w-4xl mx-auto">
            <div className="space-y-8">
                {/* KYC */}
                <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                        KYC Checklist
                    </h3>
                    <div className="border border-slate-200 dark:border-white/10 rounded-sm overflow-hidden">
                        {[
                            { id: 'kycPan', label: 'PAN Card Available', sub: 'Mandatory for all applicants' },
                            { id: 'kycAadhaar', label: 'Aadhaar Card', sub: 'Address proof verification' },
                            { id: 'kycIncome', label: 'Income Proof', sub: 'ITR / Salary Slips (Last 2 Years)' },
                            { id: 'kycBank', label: 'Bank Statements', sub: 'Last 6 months operating account' }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border transition-all", readiness[item.id as keyof typeof readiness] ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 dark:border-white/20 text-slate-300")}>
                                        {readiness[item.id as keyof typeof readiness] ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                                            <button
                                                className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => { e.stopPropagation(); setValidatingDoc(item.label.split(' ')[0] || 'Document'); setShowValidation(true); }}
                                            >
                                                <Eye className="w-3 h-3" /> View/Validate
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500">{item.sub}</p>
                                    </div>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-sm">
                                    <button onClick={() => setReadiness({ ...readiness, [item.id]: true })} className={cn("px-4 py-1 text-xs font-bold rounded-sm transition-all", readiness[item.id as keyof typeof readiness] ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600")}>YES</button>
                                    <button onClick={() => setReadiness({ ...readiness, [item.id]: false })} className={cn("px-4 py-1 text-xs font-bold rounded-sm transition-all", !readiness[item.id as keyof typeof readiness] ? "bg-white dark:bg-slate-700 shadow-sm text-slate-700" : "text-slate-400 hover:text-slate-600")}>NO</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Eligibility */}
                <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 bg-pink-500 rounded-full"></span>
                        Eligibility Check
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-white/10 gap-[1px]">
                        <InputCell label="CIBIL Score" icon={ShieldCheck}>
                            <select className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer" value={readiness.cibilRange} onChange={e => setReadiness({ ...readiness, cibilRange: e.target.value })}>
                                <option>750+ (Excellent)</option>
                                <option>700-750 (Good)</option>
                                <option>Below 700</option>
                            </select>
                        </InputCell>
                        <InputCell label="Stability (Yrs)">
                            <select className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer" value={readiness.employmentStability} onChange={e => setReadiness({ ...readiness, employmentStability: e.target.value })}>
                                <option>5+ Years</option>
                                <option>2-5 Years</option>
                                <option>&#60; 2 Years</option>
                            </select>
                        </InputCell>
                        <InputCell label="Current EMI" icon={CreditCard}>
                            <input className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-300"
                                value={readiness.existingEmi}
                                onChange={e => setReadiness({ ...readiness, existingEmi: e.target.value })}
                                placeholder="0"
                            />
                        </InputCell>
                        <InputCell label="Residency Status">
                            <select className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer" value={readiness.residencyType} onChange={e => setReadiness({ ...readiness, residencyType: e.target.value })}>
                                <option>Owned</option>
                                <option>Rented</option>
                                <option>Company</option>
                            </select>
                        </InputCell>
                    </div>

                    <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-500/20 rounded-sm flex gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold text-orange-800 dark:text-orange-200 mb-1">Eligibility Warning</h4>
                            <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">Based on the declared income of {leadDetails.annualIncome || '0 LPA'} and existing obligations, the maximum eligible loan amount is approximately <span className="font-bold">₹85L</span>. The selected property requires <span className="font-bold">₹1.2Cr</span> loan.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

    return (
        <>
            <WizardModal
                isOpen={isOpen}
                onClose={onClose}
                title={lead?.name || 'Quick Create'}
                subtitle={`Lead ID: ${lead?.id}`}
                steps={STEPS}
                currentStep={step}
                contentTitle=""
                showBackButton={step > 1}
                onBack={() => setStep(prev => prev - 1)}
                footer={
                    <div className="flex gap-3 w-full">
                        {step < 3 ? (
                            <>
                                <Button variant="secondary" className="rounded-none mr-auto px-6" onClick={onClose}>Cancel</Button>
                                <Button variant="primary" className="rounded-none shadow-lg shadow-blue-500/20 px-8" onClick={() => setStep(prev => prev + 1)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                                    Continue
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="secondary" className="rounded-none mr-auto px-6" onClick={() => setStep(prev => prev - 1)}>Back</Button>
                                <Button variant="primary" className="rounded-none shadow-lg shadow-blue-500/20 px-8" onClick={handleSave} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                                    Update Lead
                                </Button>
                            </>
                        )}
                    </div>
                }
            >
                {step === 1 && renderTab1()}
                {step === 2 && renderTab2()}
                {step === 3 && renderTab3()}
            </WizardModal>

            {/* Document Validation Modal Overhead */}
            <DocumentValidationModal
                isOpen={showValidation}
                onClose={() => setShowValidation(false)}
                documentName={`${validatingDoc} - ${lead?.name || 'Applicant'}.pdf`}
                onApprove={handleValidationApprove}
                onReject={() => setShowValidation(false)}
            />
        </>
    )
}
