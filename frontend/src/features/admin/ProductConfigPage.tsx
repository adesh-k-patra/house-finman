
/**
 * Product Config Page for House FinMan
 */

import { useState } from 'react'
import {
    Save,
    RefreshCw,
    DollarSign,
    Percent,
    FileText,
    Users,
    Building2,
    Bell,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

const loanProducts = [
    { id: 'home_loan', name: 'Home Loan', minAmount: 500000, maxAmount: 10000000, minTenure: 60, maxTenure: 360, baseRate: 8.5, maxLTV: 80, processingFee: 0.5 },
    { id: 'lap', name: 'Loan Against Property', minAmount: 1000000, maxAmount: 50000000, minTenure: 60, maxTenure: 180, baseRate: 9.5, maxLTV: 60, processingFee: 0.75 },
    { id: 'construction', name: 'Construction Loan', minAmount: 1000000, maxAmount: 20000000, minTenure: 60, maxTenure: 240, baseRate: 9.0, maxLTV: 75, processingFee: 0.5 },
]

const configSections = [
    { id: 'loan', label: 'Loan Products', icon: DollarSign },
    { id: 'commission', label: 'Commission Rules', icon: Percent },
    { id: 'documents', label: 'Document Checklist', icon: FileText },
    { id: 'workflows', label: 'Approval Workflows', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
]

import { AddProductModal } from './components/AddProductModal'

export default function ProductConfigPage() {
    const [activeSection, setActiveSection] = useState('loan')
    const [products, setProducts] = useState(loanProducts)
    const [isAddProductOpen, setIsAddProductOpen] = useState(false)

    const handleProductChange = (productId: string, field: string, value: number) => {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, [field]: value } : p))
    }

    return (
        <div className="space-y-0 animate-fade-in relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 min-h-[600px]">
            <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />

            {/* Header - Sharp */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">Product Configuration</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">/admin/config/products</p>
                </div>
                <div className="flex items-center gap-0 border border-slate-200 dark:border-white/10">
                    <Button variant="ghost" className="rounded-none border-r border-slate-200 dark:border-white/10 px-4 h-9" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => { if (confirm('Reset all changes?')) window.location.reload() }}>Reset</Button>
                    <Button variant="primary" className="rounded-none px-4 h-9" leftIcon={<Save className="w-3.5 h-3.5" />} onClick={() => alert('Configuration Saved Successfully!')}>Save Changes</Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-0 min-h-[500px]">
                {/* Vertical Tabs - Sharp & Bordered */}
                <div className="col-span-3 border-r border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900">
                    <nav className="flex flex-col">
                        {configSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-wider transition-all border-l-2',
                                    activeSection === section.id
                                        ? 'bg-white dark:bg-slate-800 border-l-primary-500 text-primary-600 dark:text-white shadow-sm'
                                        : 'border-l-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                )}
                            >
                                <section.icon className={cn("w-4 h-4", activeSection === section.id ? "text-primary-500" : "text-slate-400")} />
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area - Sharp */}
                <div className="col-span-9 bg-white dark:bg-slate-900">
                    {activeSection === 'loan' && (
                        <div className="animate-fade-in">
                            <div className="border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" /> Active Loan Products
                                </h3>
                                <Button size="sm" variant="outline" className="rounded-none h-8 text-xs bg-white dark:bg-slate-800" leftIcon={<Plus className="w-3 h-3" />} onClick={() => setIsAddProductOpen(true)}>Add Product</Button>
                            </div>

                            <div className="space-y-6">
                                {products.map(product => (
                                    <div key={product.id} className="border border-slate-200 dark:border-white/10 relative group hover:border-primary-500/50 transition-colors">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 dark:bg-slate-800 group-hover:bg-primary-500 transition-colors md:block hidden"></div>

                                        {/* Header */}
                                        <div className="flex items-center gap-4 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-md dark:bg-slate-800 pl-6">
                                            <div className="p-2 bg-slate-800 border border-slate-700 shadow-sm text-primary-400">
                                                <Building2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white leading-none">{product.name}</h3>
                                                <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">ID: {product.id.toUpperCase()}</p>
                                            </div>
                                            <span className="ml-auto px-2 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold uppercase tracking-wider">Active</span>
                                        </div>

                                        {/* Inputs Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-900">
                                            <div className="pl-6">
                                                <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-3">Amount Limits</label>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between group/input">
                                                        <span className="text-xs text-slate-600 dark:text-slate-400">Min</span>
                                                        <input
                                                            type="number"
                                                            value={product.minAmount}
                                                            onChange={(e) => handleProductChange(product.id, 'minAmount', Number(e.target.value))}
                                                            className="w-24 text-right bg-transparent border-b border-dotted border-slate-300 dark:border-slate-600 font-mono text-sm focus:outline-none focus:border-primary-500 focus:border-b-solid"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between group/input">
                                                        <span className="text-xs text-slate-600 dark:text-slate-400">Max</span>
                                                        <input
                                                            type="number"
                                                            value={product.maxAmount}
                                                            onChange={(e) => handleProductChange(product.id, 'maxAmount', Number(e.target.value))}
                                                            className="w-24 text-right bg-transparent border-b border-dotted border-slate-300 dark:border-slate-600 font-mono text-sm focus:outline-none focus:border-primary-500 focus:border-b-solid"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-3">Tenure (Mos)</label>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between group/input">
                                                        <span className="text-xs text-slate-600 dark:text-slate-400">Min</span>
                                                        <input
                                                            type="number"
                                                            value={product.minTenure}
                                                            onChange={(e) => handleProductChange(product.id, 'minTenure', Number(e.target.value))}
                                                            className="w-20 text-right bg-transparent border-b border-dotted border-slate-300 dark:border-slate-600 font-mono text-sm focus:outline-none focus:border-primary-500 focus:border-b-solid"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between group/input">
                                                        <span className="text-xs text-slate-600 dark:text-slate-400">Max</span>
                                                        <input
                                                            type="number"
                                                            value={product.maxTenure}
                                                            onChange={(e) => handleProductChange(product.id, 'maxTenure', Number(e.target.value))}
                                                            className="w-20 text-right bg-transparent border-b border-dotted border-slate-300 dark:border-slate-600 font-mono text-sm focus:outline-none focus:border-primary-500 focus:border-b-solid"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-3">Fees & Rates</label>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-600 dark:text-slate-400">Base Rate</span>
                                                        <div className="flex items-center gap-1">
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                value={product.baseRate}
                                                                onChange={(e) => handleProductChange(product.id, 'baseRate', Number(e.target.value))}
                                                                className="w-12 text-right bg-transparent border-b border-dotted border-slate-300 dark:border-slate-600 font-bold text-sm focus:outline-none focus:border-primary-500 focus:border-b-solid text-slate-900 dark:text-white"
                                                            />
                                                            <span className="text-xs text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-600 dark:text-slate-400">Max LTV</span>
                                                        <div className="flex items-center gap-1">
                                                            <input
                                                                type="number"
                                                                value={product.maxLTV}
                                                                onChange={(e) => handleProductChange(product.id, 'maxLTV', Number(e.target.value))}
                                                                className="w-12 text-right bg-transparent border-b border-dotted border-slate-300 dark:border-slate-600 font-bold text-sm focus:outline-none focus:border-primary-500 focus:border-b-solid text-slate-900 dark:text-white"
                                                            />
                                                            <span className="text-xs text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'commission' && (
                        <div className="animate-fade-in">
                            {/* Header */}
                            <div className="border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                                    <Percent className="w-4 h-4 text-slate-400" /> Commission Rules Engine
                                </h3>
                                <Button size="sm" variant="primary" className="rounded-none h-8 text-xs" leftIcon={<Plus className="w-3 h-3" />}>New Rule</Button>
                            </div>

                            <div className="space-y-4">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Total Payouts</p>
                                        <p className="text-2xl font-black mt-1">₹ 12.4L</p>
                                        <p className="text-[10px] opacity-60 mt-1">This Month</p>
                                    </div>
                                    <div className="bg-slate-900 text-white">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Rules</p>
                                        <p className="text-2xl font-black mt-1">8</p>
                                        <p className="text-[10px] text-slate-500 mt-1">2 Tiered</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg. Rate</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1.4%</p>
                                        <p className="text-[10px] text-slate-400 mt-1">Per Disbursement</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Claims</p>
                                        <p className="text-2xl font-black text-amber-600 mt-1">23</p>
                                        <p className="text-[10px] text-slate-400 mt-1">₹ 2.1L Value</p>
                                    </div>
                                </div>

                                {/* Commission Rules Table */}
                                <div className="border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-0 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                                        <div className="col-span-3 p-3 border-r border-slate-800">Role / Tier</div>
                                        <div className="col-span-2 p-3 border-r border-slate-800 text-center">Type</div>
                                        <div className="col-span-2 p-3 border-r border-slate-800 text-center">Rate</div>
                                        <div className="col-span-2 p-3 border-r border-slate-800 text-center">Cap Limit</div>
                                        <div className="col-span-2 p-3 border-r border-slate-800 text-center">Status</div>
                                        <div className="col-span-1 p-3 text-center">Actions</div>
                                    </div>

                                    {/* Table Rows */}
                                    {[
                                        { role: 'Agent', tier: 'Standard', type: 'Flat', rate: '1.2%', cap: '₹ 50,000', status: 'active', color: 'blue' },
                                        { role: 'Agent', tier: 'Premium (>50L)', type: 'Tiered', rate: '1.5% - 2.0%', cap: 'No Cap', status: 'active', color: 'blue' },
                                        { role: 'Super Agent', tier: 'All Loans', type: 'Tiered', rate: '1.8% - 2.5%', cap: 'No Cap', status: 'active', color: 'purple' },
                                        { role: 'Partner', tier: 'Standard', type: 'Flat', rate: '0.8%', cap: '₹ 25,000', status: 'active', color: 'emerald' },
                                        { role: 'Partner', tier: 'Exclusive', type: 'Flat', rate: '1.0%', cap: '₹ 75,000', status: 'draft', color: 'emerald' },
                                        { role: 'Referrer', tier: 'One-time', type: 'Flat', rate: '0.3%', cap: '₹ 10,000', status: 'active', color: 'amber' },
                                    ].map((rule, i) => (
                                        <div key={i} className={cn(
                                            'grid grid-cols-12 gap-0 border-t border-slate-100 dark:border-slate-800',
                                            'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
                                        )}>
                                            <div className="col-span-3 p-3 border-r border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                                <div className={cn('w-8 h-8 flex items-center justify-center text-white text-xs font-bold',
                                                    rule.color === 'blue' && 'bg-blue-600',
                                                    rule.color === 'purple' && 'bg-purple-600',
                                                    rule.color === 'emerald' && 'bg-emerald-600',
                                                    rule.color === 'amber' && 'bg-amber-600',
                                                )}>
                                                    {rule.role[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{rule.role}</p>
                                                    <p className="text-[10px] text-slate-500">{rule.tier}</p>
                                                </div>
                                            </div>
                                            <div className="col-span-2 p-3 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                                <span className={cn('px-2 py-1 text-[10px] font-bold uppercase',
                                                    rule.type === 'Flat' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                                                )}>{rule.type}</span>
                                            </div>
                                            <div className="col-span-2 p-3 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                                <span className="font-mono font-bold text-emerald-600 text-sm">{rule.rate}</span>
                                            </div>
                                            <div className="col-span-2 p-3 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                                <span className="font-mono text-sm text-slate-700 dark:text-slate-300">{rule.cap}</span>
                                            </div>
                                            <div className="col-span-2 p-3 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                                <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                                    rule.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                                )}>{rule.status}</span>
                                            </div>
                                            <div className="col-span-1 p-3 flex items-center justify-center">
                                                <button className="text-slate-400 hover:text-slate-600 text-xs font-bold">Edit</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'documents' && (
                        <div className="animate-fade-in">
                            {/* Header */}
                            <div className="border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-400" /> Document Checklist Manager
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" className="rounded-none h-8 text-xs">Import Template</Button>
                                    <Button size="sm" variant="primary" className="rounded-none h-8 text-xs" leftIcon={<Plus className="w-3 h-3" />}>Add Document</Button>
                                </div>
                            </div>

                            <div className="p-4">
                                {/* Document Categories */}
                                {[
                                    {
                                        category: 'Identity & KYC',
                                        color: 'blue',
                                        documents: [
                                            { name: 'Aadhar Card', required: true, verified: true },
                                            { name: 'PAN Card', required: true, verified: true },
                                            { name: 'Passport / Voter ID', required: false, verified: false },
                                        ]
                                    },
                                    {
                                        category: 'Income Proof',
                                        color: 'emerald',
                                        documents: [
                                            { name: 'Salary Slips (Last 3 Months)', required: true, verified: true },
                                            { name: 'Bank Statement (6 Months)', required: true, verified: true },
                                            { name: 'Form 16 / Form 16A', required: true, verified: false },
                                            { name: 'ITR (Last 2 Years)', required: true, verified: false },
                                            { name: 'Employment Letter', required: false, verified: false },
                                        ]
                                    },
                                    {
                                        category: 'Property Documents',
                                        color: 'purple',
                                        documents: [
                                            { name: 'Sale Agreement / Allotment Letter', required: true, verified: false },
                                            { name: 'Property Chain Documents', required: true, verified: false },
                                            { name: 'Encumbrance Certificate', required: true, verified: false },
                                            { name: 'NOC from Society/Builder', required: false, verified: false },
                                        ]
                                    },
                                ].map((cat, catIdx) => (
                                    <div key={catIdx} className="mb-6">
                                        <div className={cn('flex items-center gap-3 mb-3 pb-2 border-b',
                                            cat.color === 'blue' && 'border-blue-200 dark:border-blue-900/30',
                                            cat.color === 'emerald' && 'border-emerald-200 dark:border-emerald-900/30',
                                            cat.color === 'purple' && 'border-purple-200 dark:border-purple-900/30',
                                        )}>
                                            <div className={cn('w-6 h-6 flex items-center justify-center text-white text-xs font-bold',
                                                cat.color === 'blue' && 'bg-blue-600',
                                                cat.color === 'emerald' && 'bg-emerald-600',
                                                cat.color === 'purple' && 'bg-purple-600',
                                            )}>
                                                {catIdx + 1}
                                            </div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{cat.category}</h4>
                                            <span className="ml-auto text-[10px] text-slate-500">{cat.documents.filter(d => d.required).length} Required</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {cat.documents.map((doc, docIdx) => (
                                                <div key={docIdx} className={cn(
                                                    'flex items-center gap-4 p-3 border transition-all',
                                                    doc.verified
                                                        ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                                )}>
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={doc.required}
                                                        className="w-4 h-4 accent-primary-600"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                                                    </div>
                                                    {doc.required && (
                                                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-red-100 dark:bg-red-900/30 text-red-600 tracking-wide">Required</span>
                                                    )}
                                                    {doc.verified && (
                                                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 tracking-wide">Verified</span>
                                                    )}
                                                    <button className="text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase">Config</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'workflows' && (
                        <div className="animate-fade-in">
                            {/* Header */}
                            <div className="border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" /> Approval Workflow Designer
                                </h3>
                                <Button size="sm" variant="primary" className="rounded-none h-8 text-xs" leftIcon={<Plus className="w-3 h-3" />}>Add Stage</Button>
                            </div>

                            <div className="p-4">
                                {/* Workflow Timeline */}
                                <div className="flex items-stretch gap-0 overflow-x-auto pb-4">
                                    {[
                                        {
                                            stage: 1,
                                            title: 'Lead Capture',
                                            role: 'Sales Executive',
                                            actions: ['Initial KYC', 'Data Collection', 'Document Upload'],
                                            time: '< 2 hrs',
                                            color: 'blue'
                                        },
                                        {
                                            stage: 2,
                                            title: 'Credit Appraisal',
                                            role: 'Credit Manager',
                                            actions: ['CIBIL Check', 'Income Verification', 'Property Valuation'],
                                            time: '24-48 hrs',
                                            color: 'purple'
                                        },
                                        {
                                            stage: 3,
                                            title: 'Sanction',
                                            role: 'Regional Head',
                                            actions: ['Final Approval', 'Sanction Letter', 'T&C Review'],
                                            condition: '> ₹50 Lakhs',
                                            time: '4-8 hrs',
                                            color: 'amber'
                                        },
                                        {
                                            stage: 4,
                                            title: 'Disbursement',
                                            role: 'Finance Team',
                                            actions: ['Fund Transfer', 'Partner Commission', 'Closure Docs'],
                                            time: '24 hrs',
                                            color: 'emerald'
                                        },
                                    ].map((step, idx, arr) => (
                                        <div key={idx} className="flex items-stretch">
                                            {/* Stage Card */}
                                            <div className={cn(
                                                'w-56 shrink-0 border flex flex-col',
                                                step.color === 'blue' && 'border-blue-200 dark:border-blue-800/30',
                                                step.color === 'purple' && 'border-purple-200 dark:border-purple-800/30',
                                                step.color === 'amber' && 'border-amber-200 dark:border-amber-800/30',
                                                step.color === 'emerald' && 'border-emerald-200 dark:border-emerald-800/30',
                                            )}>
                                                {/* Stage Header */}
                                                <div className={cn(
                                                    'p-3 text-white',
                                                    step.color === 'blue' && 'bg-gradient-to-r from-blue-600 to-blue-700',
                                                    step.color === 'purple' && 'bg-gradient-to-r from-purple-600 to-purple-700',
                                                    step.color === 'amber' && 'bg-gradient-to-r from-amber-600 to-amber-700',
                                                    step.color === 'emerald' && 'bg-gradient-to-r from-emerald-600 to-emerald-700',
                                                )}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Stage {step.stage}</span>
                                                        <span className="text-[10px] font-mono opacity-70">{step.time}</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold">{step.title}</h4>
                                                </div>

                                                {/* Stage Body */}
                                                <div className="p-3 bg-white dark:bg-slate-900 flex-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Assigned To</p>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{step.role}</p>

                                                    {step.condition && (
                                                        <div className="mb-3 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                                                            Condition: {step.condition}
                                                        </div>
                                                    )}

                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Actions</p>
                                                    <ul className="space-y-1">
                                                        {step.actions.map((action, aIdx) => (
                                                            <li key={aIdx} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                                                                {action}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Stage Footer */}
                                                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-center">
                                                    <button className="text-[10px] text-slate-500 hover:text-slate-700 font-bold uppercase tracking-wide">Configure</button>
                                                </div>
                                            </div>

                                            {/* Arrow Connector */}
                                            {idx < arr.length - 1 && (
                                                <div className="w-8 flex items-center justify-center">
                                                    <div className="w-6 h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-slate-300 dark:border-l-slate-700" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Workflow Stats */}
                                <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">4</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Stages</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-emerald-600">3-5 days</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Avg. TAT</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Actions</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-amber-600">1</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Conditional</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="animate-fade-in p-4">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                                <Bell className="w-4 h-4 text-slate-400" /> System Alerts
                            </h3>
                            <div className="space-y-0 divide-y divide-slate-100 dark:divide-white/5 border border-slate-200 dark:border-white/10">
                                {['New Lead Assigned', 'Loan Application Submitted', 'Credit Check Failed', 'Sanction Letter Generated', 'Disbursement Completed', 'Partner Commission Due'].map((alert, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-900">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{alert}</span>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                                                <input type="checkbox" defaultChecked className="accent-primary-600" /> Email
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                                                <input type="checkbox" defaultChecked={i % 2 === 0} className="accent-primary-600" /> SMS
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                                                <input type="checkbox" defaultChecked={i % 3 === 0} className="accent-primary-600" /> Push
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
