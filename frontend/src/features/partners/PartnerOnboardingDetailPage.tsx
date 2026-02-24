import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Building2,
    Calendar,
    Phone,
    MapPin,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    Shield,
    AlertTriangle,
    MessageSquare
} from 'lucide-react'
import { Button, Card, KPICard, Modal } from '@/components/ui'

// Mock Data - In a real app, fetch based on ID
const applicationChangeLogs = [
    { date: '2026-01-05 10:30 AM', action: 'Application Submitted', user: 'Rajesh Kumar' },
    { date: '2026-01-05 11:00 AM', action: 'Email Verified', user: 'System' },
    { date: '2026-01-05 02:15 PM', action: 'Documents Uploaded', user: 'Rajesh Kumar' },
    { date: '2026-01-06 09:45 AM', action: 'Under Review', user: 'Admin' },
]

const documents = [
    { id: 1, name: 'PAN Card', type: 'Identity', status: 'verified', size: '2 MB' },
    { id: 2, name: 'GST Certificate', type: 'Business', status: 'verified', size: '1.5 MB' },
    { id: 3, name: 'Cancelled Cheque', type: 'Banking', status: 'pending', size: '0.8 MB' },
    { id: 4, name: 'Office Address Proof', type: 'Address', status: 'pending', size: '3 MB' },
    { id: 5, name: 'Partner Agreement', type: 'Legal', status: 'missing', size: '-' },
]

export default function PartnerOnboardingDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')

    const handleApprove = () => {
        setShowApproveModal(false)
        alert('Partner Approved Successfully! Welcome email sent.')
        navigate('/partners')
    }

    const handleReject = () => {
        if (!rejectionReason.trim()) return
        setShowRejectModal(false)
        setRejectionReason('')
        alert('Partner Rejected. Notification sent.')
        navigate('/partners')
    }

    // Mock Application Data
    const app = {
        id,
        name: 'Sunrise Realty',
        contact: 'Rajesh Kumar',
        phone: '+91 9876543210',
        email: 'rajesh@sunriserealty.com',
        city: 'Mumbai',
        address: '1204, Lodha Supremus, Worli Naka, Mumbai - 400018',
        type: 'Channel Partner',
        status: 'Under Review',
        riskScore: 'Low', // Low, Medium, High
        score: 85,
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20 py-4 -mx-6 px-6 border-b border-slate-200 dark:border-slate-800 transition-all shadow-sm">
                <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/partners/onboarding')} className="-ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{app.name}</h1>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 uppercase tracking-wide">
                                    {app.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-mono">#{id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Applied Jan 5, 2026
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="bg-white dark:bg-slate-800 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-900/20 shadow-sm"
                            onClick={() => setShowRejectModal(true)}
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                        <Button
                            variant="primary"
                            className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 shadow-md shadow-emerald-500/20"
                            onClick={() => setShowApproveModal(true)}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Approve Partner
                        </Button>
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            <Modal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                title="Approve Partner Application"
                description="This action will verify the partner and grant them access."
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowApproveModal(false)}>Cancel</Button>
                        <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-none" onClick={handleApprove}>
                            Confirm Approval
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-md flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Ready for Onboarding</h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                                <strong>{app.name}</strong> has passed automated risk checks. Approving will:
                            </p>
                            <ul className="list-disc list-inside text-sm text-emerald-700 dark:text-emerald-400 mt-2 space-y-1">
                                <li>Activate their partner account</li>
                                <li>Send the welcome email kit</li>
                                <li>Assign a Partner Manager</li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                        By approving, you confirm that all submitted documents have been verified.
                    </p>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Reject Application"
                description="Please provide a reason for rejection. This will be sent to the applicant."
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            className="bg-rose-600 hover:bg-rose-700 border-none"
                            disabled={!rejectionReason.trim()}
                            onClick={handleReject}
                        >
                            Confirm Rejection
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Reason for Rejection <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            className="w-full h-32 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none text-sm placeholder:text-slate-400"
                            placeholder="e.g., Documents provided were illegible, Invalid GST number..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-md flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            This action cannot be undone. The applicant will be notified immediately.
                        </p>
                    </div>
                </div>
            </Modal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Stats Grid - Updated Design */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <KPICard
                            title="Risk Score"
                            value={String(app.score)}
                            variant="indigo"
                            icon={<Shield className="w-5 h-5" />}
                            trend={{ value: 'Low Risk', direction: 'neutral', label: 'Profile' }}
                        />
                        <KPICard
                            title="Documents"
                            value="2/5"
                            variant="emerald"
                            icon={<FileText className="w-5 h-5" />}
                            trend={{ value: 'Verified', direction: 'neutral', label: '' }}
                        />
                        <KPICard
                            title="Type"
                            value={app.type}
                            variant="blue"
                            icon={<Building2 className="w-5 h-5" />}
                            trend={{ value: 'Channel', direction: 'neutral', label: 'Partner' }}
                        />
                        <KPICard
                            title="Region"
                            value={app.city}
                            variant="purple"
                            icon={<MapPin className="w-5 h-5" />}
                            trend={{ value: 'Operational', direction: 'neutral', label: 'Area' }}
                        />
                    </div>

                    {/* Timeline */}
                    <Card padding="md" className="rounded-sm border-slate-200 dark:border-slate-800">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white">Application Timeline</h3>
                            <Button size="sm" variant="ghost">View Full Log</Button>
                        </div>
                        <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-8 relative">
                            {applicationChangeLogs.map((log, index) => (
                                <div key={index} className="relative group">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900 group-hover:bg-primary-500 transition-colors" />
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-sm border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{log.action}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 flex justify-between">
                                            <span>{log.date}</span>
                                            <span>by {log.user}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Compliance Checklist - Small Cards */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" /> Compliance
                        </h3>
                        <div className="space-y-2">
                            {documents.map((doc) => (
                                <div key={doc.id} className="p-3 bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{doc.name}</p>
                                        <p className="text-xs text-slate-500">{doc.type}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {doc.status === 'verified' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                        {doc.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                                        {doc.status === 'missing' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm transition-all">
                                            <Eye className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact - Small Cards */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" /> Contact Details
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-xs">Ph</div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Phone</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{app.phone}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 font-bold text-xs">@</div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{app.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-sm shadow-sm relative">
                        <div className="absolute top-3 right-3 text-amber-300">
                            <MessageSquare className="w-12 h-12 opacity-20" />
                        </div>
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider mb-2">Interviewer Notes</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                            "Rajesh seems very eager and has a strong network in South Mumbai. Previous experience with HDFC is a plus."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
