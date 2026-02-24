/**
 * Purchase Orders Page for House FinMan
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, FileText, CheckCircle2, XCircle, Eye, Download, Clock } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn, formatCurrency, formatRelativeTime } from '@/utils'
import { dummyPOs, POStatus } from './data/dummyPOs'
import { CreatePOModal } from './components/CreatePOModal'

const statusConfig: Record<POStatus, { label: string; icon: typeof Clock; color: string; bgColor: string }> = {
    draft: { label: 'Draft', icon: FileText, color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-700/50' },
    pending_approval: { label: 'Pending Approval', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    approved: { label: 'Approved', icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    completed: { label: 'Completed', icon: CheckCircle2, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}

export default function PurchaseOrdersPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<POStatus | 'all'>('all')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [localPOs, setLocalPOs] = useState(dummyPOs)

    const filteredPOs = localPOs.filter(po => {
        const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || po.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || po.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleCreatePO = (data: any) => {
        const newPO: any = {
            id: `new-${Date.now()}`,
            poNumber: `PO-${new Date().getFullYear()}-${String(localPOs.length + 1).padStart(3, '0')}`,
            vendorName: data.vendorName,
            category: data.category,
            amount: parseFloat(data.amount),
            status: 'draft',
            createdAt: new Date().toISOString(),
            dueDate: data.dueDate,
            items: 0,
            createdBy: 'Current User',
            lineItems: [],
            timeline: [{ date: new Date().toISOString(), action: 'Draft Created', user: 'Current User' }]
        }
        setLocalPOs([newPO, ...localPOs])
        alert('Purchase Order created successfully!')
    }

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Purchase Orders</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{localPOs.length} orders • {localPOs.filter(p => p.status === 'pending_approval').length} pending approval</p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>Create PO</Button>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {(['draft', 'pending_approval', 'approved', 'completed', 'cancelled'] as POStatus[]).map(status => {
                    const config = statusConfig[status]
                    const count = localPOs.filter(p => p.status === status).length
                    const Icon = config.icon
                    return (
                        <div key={status} className={cn('p-3 rounded-sm border border-slate-200 dark:border-white/10', 'bg-white dark:bg-slate-800/50')}>
                            <div className="flex items-center gap-2">
                                <Icon className={cn('w-4 h-4', config.color)} />
                                <span className="text-xs text-slate-500">{config.label}</span>
                            </div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{count}</p>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search POs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as POStatus | 'all')} className="input w-auto rounded-sm">
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
            </div>

            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">PO Number</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Vendor</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Category</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Amount</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Due Date</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Created</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredPOs.map(po => {
                            const config = statusConfig[po.status]
                            const Icon = config.icon
                            return (
                                <tr
                                    key={po.id}
                                    className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                    onClick={() => navigate(`/vendors/purchase-orders/${po.id}`)}
                                >
                                    <td className="px-6 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <span className="text-sm font-bold text-primary-600 underline decoration-dotted underline-offset-4 group-hover:text-primary-700 transition-colors">{po.poNumber}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white border-r border-slate-300 dark:border-slate-700">{po.vendorName}</td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">{po.category}</td>
                                    <td className="px-6 py-4 text-center text-sm font-black text-slate-900 dark:text-white border-r border-slate-300 dark:border-slate-700 font-mono tracking-tight">{formatCurrency(po.amount)}</td>
                                    <td className="px-6 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                        <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm', config.bgColor, config.color)}>
                                            <Icon className="w-3 h-3" />{config.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs text-slate-500 border-r border-slate-300 dark:border-slate-700">{new Date(po.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center text-xs text-slate-400 border-r border-slate-300 dark:border-slate-700">{formatRelativeTime(po.createdAt)}</td>
                                    <td className="px-6 py-4 text-center border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm text-slate-400 hover:text-primary-600 transition-colors"
                                                onClick={() => navigate(`/vendors/purchase-orders/${po.id}`)}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm text-slate-400 hover:text-primary-600 transition-colors">
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <CreatePOModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePO}
            />
        </div>
    )
}
