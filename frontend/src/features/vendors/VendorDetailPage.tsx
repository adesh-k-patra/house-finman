
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Building2,
    MapPin,
    Phone,
    Mail,
    FileText,
    DollarSign,
    Package,
    Star,
    Award,
    BarChart3,
    Plus,
    Trash2,
    Clock,
    CheckCircle2,
    AlertCircle,
    Download,
    Edit
} from 'lucide-react'
import { Button, KPICard, SideDrawer } from '@/components/ui'
import { cn, formatCurrency } from '@/utils'
import TabItemCreateModal from './components/TabItemCreateModal'
import { EditVendorModal } from './components/EditVendorModal'

// Dummy Data
import { DeleteVendorModal } from './components/DeleteVendorModal'
import { CreatePOModal } from './components/CreatePOModal'
import { useToast } from '@/components/ui/Toast'

// Dummy Data
const dummyVendor = {
    id: 'VND-001',
    name: 'BuildRight Constructions',
    contactPerson: 'Rahul Verma',
    email: 'rahul.v@buildright.com',
    phone: '+91 98765 43210',
    address: 'Sector 62, Noida, UP',
    category: 'technical' as const,
    status: 'active' as const,
    rating: 4.8,
    totalOrders: 145,
    totalSpend: 4500000,
    outstanding: 120000,
    performance: {
        onTimeDelivery: 95, // percentage
        qualityScore: 4.8, // out of 5
        pricingCompetitive: 90, // score
        lastAudit: '2025-12-15'
    },
    city: 'Noida',
    totalPOs: 145,
    pendingInvoices: 120000,
    slaCompliance: 95,
    avgLeadTime: 3
}

type TabType = 'overview' | 'orders' | 'invoices' | 'performance' | 'products' | 'documents'

export default function VendorDetailPage() {
    const { id: _id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [vendor, setVendor] = useState(dummyVendor)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isPOModalOpen, setIsPOModalOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
    const { addToast } = useToast()

    const handleDeleteVendor = () => {
        // API call simulation
        addToast({
            title: 'Vendor Deleted',
            message: `Vendor ${vendor.name} has been successfully removed.`,
            type: 'success'
        })
        setIsDeleteModalOpen(false)
        navigate('/vendors')
    }

    const handleSaveVendor = (updated: any) => {
        setVendor({ ...vendor, ...updated })
        setIsEditModalOpen(false)
    }

    // Calculate Grade
    const calculateGrade = () => {
        const score = (vendor.performance.onTimeDelivery + (vendor.performance.qualityScore * 20) + vendor.performance.pricingCompetitive) / 3
        if (score >= 90) return 'A+'
        if (score >= 80) return 'A'
        if (score >= 70) return 'B'
        return 'C'
    }
    const grade = calculateGrade()

    // Helper for Tab Actions Header
    const TabActionHeader = ({ title, showAdd = true, showDelete = true }: { title: string, showAdd?: boolean, showDelete?: boolean }) => (
        <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{title}</h3>
            <div className="flex items-center gap-2">
                {showDelete && (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-none bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 backdrop-blur-md"
                        leftIcon={<Trash2 className="w-3 h-3" />}
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete
                    </Button>
                )}
                {showAdd && (
                    <Button
                        size="sm"
                        variant="primary"
                        className="rounded-none bg-blue-600 hover:bg-blue-500 border-none"
                        leftIcon={<Plus className="w-3 h-3" />}
                        onClick={() => {
                            if (activeTab === 'orders') setIsPOModalOpen(true)
                            else setIsAddModalOpen(true)
                        }}
                    >
                        {activeTab === 'orders' ? 'Create Order' : 'Add Item'}
                    </Button>
                )}
            </div>
        </div>
    )

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <TabItemCreateModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                tabType={activeTab}
            />
            <EditVendorModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                vendor={vendor}
                onSave={handleSaveVendor}
            />
            <DeleteVendorModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteVendor}
                vendorName={vendor.name}
            />
            <CreatePOModal
                isOpen={isPOModalOpen}
                onClose={() => setIsPOModalOpen(false)}
                vendorName={vendor.name}
                vendorId={vendor.id}
            />

            <button
                onClick={() => navigate('/vendors')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Vendors
            </button>

            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-none bg-slate-900 text-white shadow-xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/50" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight text-white">{vendor.name}</h1>
                                <span className={cn('px-2 py-0.5 text-xs font-bold uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30')}>
                                    {vendor.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" />{vendor.address}</span>
                                <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" />{vendor.phone}</span>
                                <span className="flex items-center gap-2 font-medium text-white"><Package className="w-4 h-4 text-blue-500" />{vendor.category}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 self-start md:self-center">
                        <div className="text-right mr-4 hidden md:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance Grade</p>
                            <p className="text-4xl font-black text-blue-400">{grade}</p>
                        </div>
                        <Button variant="outline" className="rounded-none border-white/20 text-white hover:bg-white/10" leftIcon={<Mail className="w-4 h-4" />}>Email</Button>
                        <Button variant="secondary" className="rounded-none bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 border border-blue-500/30" leftIcon={<Edit className="w-4 h-4" />} onClick={() => setIsEditModalOpen(true)}>Edit</Button>
                        <Button variant="secondary" className="rounded-none bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-500/30" leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
                        <Button variant="primary" className="rounded-none bg-blue-600 hover:bg-blue-500 border-none" leftIcon={<Plus className="w-4 h-4" />}>Create PO</Button>
                    </div>
                </div>

                <div className="px-8 flex items-center gap-1 bg-black/20 backdrop-blur-md border-t border-white/10">
                    {[
                        { key: 'overview', label: 'Overview', icon: FileText },
                        { key: 'products', label: 'Products', icon: Package },
                        { key: 'orders', label: 'PO History', icon: Package },
                        { key: 'invoices', label: 'Invoices', icon: DollarSign },
                        { key: 'documents', label: 'Documents', icon: FileText },
                        { key: 'performance', label: 'Scorecard', icon: BarChart3 },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as TabType)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-wider transition-all relative outline-none",
                                activeTab === tab.key
                                    ? "text-white bg-white/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.key ? "text-blue-400" : "text-slate-400")} />
                            {tab.label}
                            {activeTab === tab.key && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up">
                        <div className="col-span-1 lg:col-span-2 space-y-6">
                            <div className="border border-slate-200 dark:border-white/10 rounded-none shadow-sm overflow-hidden">
                                <TabActionHeader title="Company Details" />
                                <div className="p-6 bg-white dark:bg-slate-900">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Person</p>
                                            <p className="text-base font-semibold text-slate-900 dark:text-white">{vendor.contactPerson}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                                            <p className="text-base font-semibold text-slate-900 dark:text-white">{vendor.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-semibold text-slate-900 dark:text-white">{vendor.totalOrders}</span>
                                                <span className="text-xs text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-none font-bold">+12%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Outstanding Balance</p>
                                            <p className="text-base font-bold text-red-600 font-mono">{formatCurrency(vendor.outstanding)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tax ID / GSTIN</p>
                                            <p className="text-base font-semibold text-slate-900 dark:text-white font-mono">09AAACB1234F1Z5</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Terms</p>
                                            <p className="text-base font-semibold text-slate-900 dark:text-white">Net 45 Days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Details Section */}
                            <div className="border border-slate-200 dark:border-white/10 rounded-none shadow-sm overflow-hidden">
                                <TabActionHeader title="Bank Information" />
                                <div className="p-6 bg-white dark:bg-slate-900">
                                    <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Holder</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">BuildRight Constructions Pvt Ltd</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bank Name</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">HDFC Bank</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">•••• •••• 5678</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">IFSC Code</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">HDFC0001234</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-none shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Quick Actions</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <Button variant="secondary" className="w-full justify-center rounded-none h-12">Log Call</Button>
                                    <Button variant="secondary" className="w-full justify-center rounded-none h-12">Schedule Meeting</Button>
                                    <Button variant="secondary" className="w-full justify-center rounded-none h-12">Verify Docs</Button>
                                    <Button variant="secondary" className="w-full justify-center rounded-none h-12 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30">Report Issue</Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <KPICard title="Total Spend YTD" value={formatCurrency(vendor.totalSpend)} variant="blue" icon={<DollarSign className="w-5 h-5" />} />
                            <KPICard title="Quality Rating" value={vendor.rating.toString()} variant="purple" icon={<Star className="w-5 h-5" />} />

                            {/* Small Map Placeholder */}
                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 w-full relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    <MapPin className="w-4 h-4 mr-2" /> View on Map
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="border border-slate-200 dark:border-white/10 rounded-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                            <TabActionHeader title="Performance Scorecard" />
                            {/* Scorecard Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <KPICard
                                        title="Overall Grade"
                                        value={grade}
                                        subtitle="Based on delivery, quality & price"
                                        variant="emerald"
                                        icon={<Award className="w-5 h-5" />}
                                        trend={{ value: 0, direction: 'neutral', label: 'Consistent' }}
                                    />
                                    <KPICard
                                        title="On-Time Delivery"
                                        value={`${vendor.performance.onTimeDelivery}%`}
                                        variant="blue"
                                        icon={<Clock className="w-5 h-5" />}
                                        trend={{ value: 2.5, direction: 'up', label: 'vs last month' }}
                                    />
                                    <KPICard
                                        title="Quality Score"
                                        value={vendor.performance.qualityScore.toString()}
                                        variant="purple"
                                        icon={<Star className="w-5 h-5" />}
                                        subtitle="Out of 5.0"
                                        trend={{ value: 0.1, direction: 'up', label: 'points' }}
                                    />
                                    <KPICard
                                        title="Pricing"
                                        value={vendor.performance.pricingCompetitive.toString()}
                                        variant="orange"
                                        icon={<DollarSign className="w-5 h-5" />}
                                        subtitle="Competitiveness Score"
                                        trend={{ value: 1.2, direction: 'down', label: 'slightly higher' }}
                                    />
                                </div>

                                {/* Recent Audits Table */}
                                <div>
                                    <div className="px-4 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Performance History</h3>
                                    </div>
                                    <table className="w-full">
                                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Period</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Delivery</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Quality</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Overall</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">Dec 2025</td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">98%</td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">4.9/5</td>
                                                <td className="px-4 py-4 text-sm font-bold text-emerald-600">A+</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">Nov 2025</td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">92%</td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">4.7/5</td>
                                                <td className="px-4 py-4 text-sm font-bold text-emerald-600">A</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">Oct 2025</td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">85%</td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">4.2/5</td>
                                                <td className="px-4 py-4 text-sm font-bold text-amber-600">B</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="animate-fade-in-up">
                        <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                            <TabActionHeader title="Catalog Items" />
                            <table className="w-full">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Item Name</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">SKU</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Unit Price</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Stock Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {['Cement (Grade A)', 'Steel Bars (TMT)', 'Red Bricks (Std)', 'River Sand (Ton)', 'Vitrified Tiles (Box)', 'Copper Wiring (Roll)', 'PVC Pipes (6m)'].map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">{item}</td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">SKU-{1000 + i}</td>
                                            <td className="px-4 py-4 text-sm text-slate-900 dark:text-white font-mono">{formatCurrency(500 + (i * 150))}</td>
                                            <td className="px-4 py-4"><span className="px-2 py-0.5 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 rounded-none">In Stock</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="border border-slate-200 dark:border-white/10 rounded-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                            <TabActionHeader title="Vendor Documents" />
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {['Vendor Agreement 2025.pdf', 'GST Registration.pdf', 'PAN Card.pdf', 'Cancelled Cheque.pdf'].map((doc, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-none flex items-center gap-4 hover:border-blue-500 transition-colors cursor-pointer group">
                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 rounded-none">
                                                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{doc}</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">PDF • 1.2 MB</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(activeTab === 'orders') && (
                    <div className="animate-fade-in-up">
                        <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                            <TabActionHeader title="Purchase Order History" />
                            <table className="w-full">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">PO Number</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Date</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Items</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Amount</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Status</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Delivery</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {[
                                        { id: 'PO-2024-089', date: '2026-01-10', items: '500 Bags Cement', amount: 250000, status: 'Active', delivery: '2026-01-15' },
                                        { id: 'PO-2024-085', date: '2026-01-05', items: '2 Tons Steel', amount: 180000, status: 'Completed', delivery: '2026-01-08' },
                                        { id: 'PO-2024-082', date: '2025-12-28', items: '1000 Red Bricks', amount: 120000, status: 'Completed', delivery: '2025-12-30' },
                                        { id: 'PO-2024-078', date: '2025-12-15', items: 'Sand Truck Load', amount: 45000, status: 'Completed', delivery: '2025-12-16' },
                                        { id: 'PO-2024-075', date: '2025-12-10', items: 'Painting Supplies', amount: 85000, status: 'Cancelled', delivery: '-' },
                                        { id: 'PO-2024-070', date: '2025-11-25', items: 'Plumbing Fixtures', amount: 320000, status: 'Completed', delivery: '2025-11-28' },
                                        { id: 'PO-2024-065', date: '2025-11-15', items: 'Electrical Wiring', amount: 210000, status: 'Completed', delivery: '2025-11-18' },
                                    ].map((po, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate(`/vendors/purchase-orders/${po.id}`)}>
                                            <td className="px-4 py-4 text-xs font-mono font-bold text-indigo-600">{po.id}</td>
                                            <td className="px-4 py-4 text-sm text-slate-900 dark:text-white">{po.date}</td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{po.items}</td>
                                            <td className="px-4 py-4 text-sm font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(po.amount)}</td>
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none",
                                                    po.status === 'Completed' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                        po.status === 'Active' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                )}>
                                                    {po.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-500">{po.delivery}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {(activeTab === 'invoices') && (
                    <div className="animate-fade-in-up">
                        <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                            <TabActionHeader title="Invoice History" />
                            <table className="w-full">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Invoice #</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">PO Ref</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Date</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Amount</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Status</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {[
                                        { id: 'INV-2024-001', po: 'PO-2024-085', date: '2026-01-08', amount: 180000, status: 'Paid', due: '2026-02-08' },
                                        { id: 'INV-2024-002', po: 'PO-2024-082', date: '2025-12-30', amount: 120000, status: 'Paid', due: '2026-01-30' },
                                        { id: 'INV-2024-003', po: 'PO-2024-078', date: '2025-12-16', amount: 45000, status: 'Overdue', due: '2026-01-16' },
                                        { id: 'INV-2024-004', po: 'PO-2024-070', date: '2025-11-28', amount: 320000, status: 'Pending', due: '2026-01-28' },
                                        { id: 'INV-2024-005', po: 'PO-2024-065', date: '2025-11-18', amount: 210000, status: 'Paid', due: '2025-12-18' },
                                    ].map((inv, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                                            <td className="px-4 py-4 text-xs font-mono font-bold text-slate-900 dark:text-white">{inv.id}</td>
                                            <td className="px-4 py-4 text-xs font-mono text-indigo-500">{inv.po}</td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{inv.date}</td>
                                            <td className="px-4 py-4 text-sm font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(inv.amount)}</td>
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none",
                                                    inv.status === 'Paid' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                        inv.status === 'Pending' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                )}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-500">{inv.due}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Invoice Side Drawer - SD_T1 Design */}
            <SideDrawer
                isOpen={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                title="Invoice Details"
                subtitle={`Ref: ${selectedInvoice?.id}`}
                size="lg"
                variant="SD_T1"
                icon={<FileText className="w-6 h-6 text-blue-600" />}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setSelectedInvoice(null)}>Close</Button>
                        <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Download PDF</Button>
                    </>
                }
            >
                {selectedInvoice && (
                    <div className="space-y-6 pb-4">
                        {/* Status Card - Black */}
                        <div className="relative overflow-hidden rounded-sm p-6 border border-white/10 shadow-lg group bg-slate-950">
                            <div className={cn(
                                "absolute inset-0 opacity-20 transition-opacity duration-300",
                                selectedInvoice.status === 'Paid' ? 'bg-gradient-to-br from-emerald-500 to-teal-900' :
                                    selectedInvoice.status === 'Pending' ? 'bg-gradient-to-br from-amber-500 to-orange-900' :
                                        'bg-gradient-to-br from-rose-500 to-red-900'
                            )} />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Invoice Status</p>
                                    <h3 className={cn(
                                        "text-2xl font-black uppercase tracking-tight",
                                        selectedInvoice.status === 'Paid' ? 'text-emerald-400' :
                                            selectedInvoice.status === 'Pending' ? 'text-amber-400' :
                                                'text-rose-400'
                                    )}>{selectedInvoice.status}</h3>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-full border-2 backdrop-blur-md",
                                    selectedInvoice.status === 'Paid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                        selectedInvoice.status === 'Pending' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                                            'border-rose-500/30 bg-rose-500/10 text-rose-400'
                                )}>
                                    {selectedInvoice.status === 'Paid' ? <CheckCircle2 className="w-6 h-6" /> :
                                        selectedInvoice.status === 'Pending' ? <Clock className="w-6 h-6" /> :
                                            <AlertCircle className="w-6 h-6" />}
                                </div>
                            </div>
                        </div>

                        {/* Financials Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-sm border border-emerald-400/20 bg-emerald-600 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <DollarSign className="w-12 h-12 text-emerald-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />
                                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-2">Total Amount</p>
                                <p className="text-2xl font-mono font-black relative z-10">{formatCurrency(selectedInvoice.amount)}</p>
                            </div>
                            <div className="rounded-sm border border-violet-400/20 bg-violet-600 relative overflow-hidden group shadow-lg text-white">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <Package className="w-12 h-12 text-violet-100" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-400/20 rounded-full blur-xl" />
                                <p className="text-violet-100 text-[10px] font-bold uppercase tracking-widest mb-2">PO Reference</p>
                                <p className="text-xl font-mono font-black relative z-10 truncate">{selectedInvoice.po}</p>
                            </div>
                        </div>

                        {/* Vendor Info */}
                        <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Vendor Details</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        {/* Simple initial for Vendor Name */}
                                        {vendor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">{vendor.name}</p>
                                        <p className="text-xs text-slate-500">ID: {vendor.id}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                                    <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Contact</p>
                                    <p>{vendor.contactPerson} ({vendor.email})</p>
                                    <p>{vendor.phone}</p>
                                    <p className="text-slate-400">{vendor.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Breakdown */}
                        <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Invoice Details</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Invoice Date</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{selectedInvoice.date}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Due Date</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{selectedInvoice.due}</span>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-500">Subtotal</span>
                                        <span className="text-xs font-mono font-bold">{formatCurrency(selectedInvoice.amount * 0.82)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-500">Tax (18%)</span>
                                        <span className="text-xs font-mono font-bold">{formatCurrency(selectedInvoice.amount * 0.18)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Total Payable</span>
                                        <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedInvoice.amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SideDrawer>
        </div>
    )
}
