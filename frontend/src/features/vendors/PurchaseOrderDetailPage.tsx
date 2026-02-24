
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    FileText,
    Building2,
    User,
    CheckCircle2,
    Clock,
    Download,
    Mail,
    Printer,
    MoreVertical
} from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { cn, formatCurrency, formatRelativeTime } from '@/utils'
import { dummyPOs } from './data/dummyPOs'

export default function PurchaseOrderDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    // In a real app, fetch from API. Here we find by PO Number or ID
    const po = dummyPOs.find(p => p.id === id || p.poNumber === id)

    if (!po) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <FileText className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Purchase Order Not Found</h2>
                <p className="text-slate-500 mt-2 mb-6">The purchase order you are looking for does not exist or has been deleted.</p>
                <Button variant="secondary" onClick={() => navigate('/vendors/purchase-orders')}>
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-slate-50 dark:bg-slate-900 z-10 py-4 -mx-6 px-6 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => navigate('/vendors/purchase-orders')}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{po.poNumber}</h1>
                            <span className={cn(
                                'px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide rounded-sm border',
                                po.status === 'draft' && 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                                po.status === 'pending_approval' && 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
                                po.status === 'approved' && 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
                                po.status === 'completed' && 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
                                po.status === 'cancelled' && 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                            )}>
                                {po.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {po.vendorName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {po.createdBy}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" leftIcon={<Printer className="w-4 h-4" />}>Print</Button>
                    <Button variant="secondary" leftIcon={<Mail className="w-4 h-4" />}>Email</Button>
                    <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Download PDF</Button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm text-slate-500 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Stats Grid - Updated with Sharp Edges & Solid Glassmorphism */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="rounded-none bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 shadow-[0_8px_32px_rgba(99,102,241,0.1)] group hover:bg-indigo-500/20 transition-all duration-300">
                            <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Total</span>
                            </div>
                            <p className="text-xl font-black text-white truncate group-hover:scale-105 transition-transform origin-left pt-2">{formatCurrency(po.amount * 1.18)}</p>
                        </div>
                        <div className="rounded-none bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 shadow-[0_8px_32px_rgba(16,185,129,0.1)] group hover:bg-emerald-500/20 transition-all duration-300">
                            <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Items</span>
                            </div>
                            <p className="text-xl font-black text-white group-hover:scale-110 transition-transform origin-left pt-2">{po.items}</p>
                        </div>
                        <div className="rounded-none bg-amber-500/10 backdrop-blur-md border border-amber-500/20 shadow-[0_8px_32px_rgba(245,158,11,0.1)] group hover:bg-amber-500/20 transition-all duration-300">
                            <div className="flex items-center gap-2 text-amber-400 mb-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Due Date</span>
                            </div>
                            <p className="text-sm font-black text-white truncate pt-2">{new Date(po.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="rounded-none bg-purple-500/10 backdrop-blur-md border border-purple-500/20 shadow-[0_8px_32px_rgba(168,85,247,0.1)] group hover:bg-purple-500/20 transition-all duration-300">
                            <div className="flex items-center gap-2 text-purple-400 mb-2">
                                <Building2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Category</span>
                            </div>
                            <p className="text-sm font-black text-white truncate pt-2">{po.category}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <Card padding="none" className="rounded-sm overflow-hidden border-slate-200 dark:border-slate-800">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Line Items</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Description</th>
                                        <th className="px-6 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider text-xs">Qty</th>
                                        <th className="px-6 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider text-xs">Unit Price</th>
                                        <th className="px-6 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider text-xs">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {po.lineItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{item.description}</td>
                                            <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{formatCurrency(item.unitPrice)}</td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Subtotal</td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(po.amount)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-6 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Tax (18%)</td>
                                        <td className="px-6 py-2 text-right text-xs font-medium text-slate-500">{formatCurrency(po.amount * 0.18)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-right text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">Grand Total</td>
                                        <td className="px-6 py-4 text-right text-lg font-bold text-primary-600">{formatCurrency(po.amount * 1.18)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </Card>

                    {/* Timeline */}
                    <Card padding="md" className="rounded-sm border-slate-200 dark:border-slate-800">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white">Audit Trail</h3>
                            <Button size="sm" variant="ghost">View Full Log</Button>
                        </div>
                        <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-8 relative">
                            {po.timeline.map((event, index) => (
                                <div key={index} className="relative group">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900 group-hover:bg-primary-500 transition-colors" />
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-sm border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{event.action}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 flex justify-between">
                                            <span>{formatRelativeTime(event.date)}</span>
                                            <span>by {event.user}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" /> Actions
                            </h3>
                        </div>
                        <div className="p-4">
                            {po.status === 'pending_approval' ? (
                                <div className="space-y-4">
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-3 rounded-sm text-center">
                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">Approval Required</p>
                                        <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">Pending Ops Head Review</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 w-full justify-center">Approve</Button>
                                        <Button size="sm" variant="secondary" className="border-red-200 text-red-600 hover:bg-red-50 w-full justify-center">Reject</Button>
                                    </div>
                                </div>
                            ) : po.status === 'approved' ? (
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        <span className="font-bold text-emerald-800 dark:text-emerald-400">Approved</span>
                                    </div>
                                    <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
                                        Approved by {po.approvedBy} on {new Date(po.approvedAt || '').toLocaleDateString()}.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-2">No pending actions.</p>
                            )}
                        </div>
                    </div>

                    {/* Vendor Contact - Small Cards */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" /> Vendor Details
                        </h3>
                        <div className="space-y-2">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                                    {po.vendorName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Vendor</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{po.vendorName}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-xs">Ph</div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Contact</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 font-bold text-xs">@</div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">contact@vendor.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {po.notes && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-sm shadow-sm relative">
                            <div className="absolute top-3 right-3 text-amber-300">
                                <FileText className="w-12 h-12 opacity-20" />
                            </div>
                            <p className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider mb-2">Internal Notes</p>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                                "{po.notes}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
