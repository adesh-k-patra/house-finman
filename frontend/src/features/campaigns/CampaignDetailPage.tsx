/**
 * Campaign Detail Page for House FinMan
 * 
 * Features:
 * - Detailed analytics (Line charts, conversions)
 * - Audience list with status
 * - Campaign configuration view
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Calendar,
    Users,
    Target,
    TrendingUp,
    DollarSign,
    Mail,
    Smartphone,
    MessageCircle,
    Bell,
    Pause,
    Edit,
    Download,
} from 'lucide-react'
import { Button, Card, KPICard, CustomChartTooltip } from '@/components/ui'
import { cn, formatNumber, formatPercentage } from '@/utils'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from 'recharts'
import { CampaignAnalytics } from './components/CampaignAnalytics'
import { EditCampaignModal } from './components/EditCampaignModal'
import { dummyCampaigns, Campaign } from './data/dummyCampaigns'

const dailyPerformance = [
    { date: 'Jan 1', sent: 2000, opened: 800, clicked: 200, converted: 20 },
    { date: 'Jan 2', sent: 2500, opened: 1000, clicked: 250, converted: 25 },
    { date: 'Jan 3', sent: 3000, opened: 1200, clicked: 300, converted: 30 },
    { date: 'Jan 4', sent: 3500, opened: 1400, clicked: 350, converted: 35 },
    { date: 'Jan 5', sent: 3200, opened: 1280, clicked: 320, converted: 32 },
]

export default function CampaignDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'audience' | 'configuration'>('overview')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [campaign, setCampaign] = useState<Campaign | null>(null)

    useEffect(() => {
        if (id) {
            const found = dummyCampaigns.find(c => c.id === id)
            if (found) {
                setCampaign(found)
            } else {
                setCampaign(dummyCampaigns[0])
            }
        }
    }, [id])

    const handleSaveCampaign = (updatedCampaign: any) => {
        setCampaign(updatedCampaign)
        // In real app, make API call here
    }

    if (!campaign) return null

    const TypeIcon = {
        email: Mail,
        sms: Smartphone,
        whatsapp: MessageCircle,
        push: Bell,
    }[campaign.type] as React.ElementType

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/campaigns')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {campaign.name}
                            <span className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-full border",
                                campaign.status === 'active' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800" :
                                    campaign.status === 'paused' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-800" :
                                        "bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                            )}>
                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </span>
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 capitalize">
                                {TypeIcon && <TypeIcon className="w-4 h-4" />}
                                {campaign.type} Campaign
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" leftIcon={<Pause className="w-4 h-4" />}>Pause</Button>
                    <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />} onClick={() => setIsEditModalOpen(true)}>Edit</Button>
                    <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-white/10">
                <div className="flex gap-6">
                    {['overview', 'analytics', 'audience', 'configuration'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                'pb-3 text-sm font-medium capitalize transition-colors relative',
                                activeTab === tab
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* KPIs */}
                    <div className="grid grid-cols-4 gap-4">
                        <KPICard title="Sent" value={formatNumber(campaign.sent)} variant="blue" icon={<Users className="w-5 h-5" />} />
                        <KPICard title="Open Rate" value={formatPercentage(campaign.opened / campaign.sent * 100)} variant="purple" icon={<Target className="w-5 h-5" />} />
                        <KPICard title="Click Rate" value={formatPercentage(campaign.clicked / campaign.opened * 100)} variant="orange" icon={<TrendingUp className="w-5 h-5" />} />
                        <KPICard title="Conversion Rate" value={formatPercentage(campaign.converted / campaign.clicked * 100)} variant="green" icon={<DollarSign className="w-5 h-5" />} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Card title="Performance Trends">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dailyPerformance}>
                                        <defs>
                                            <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip content={<CustomChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                        <Area type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" name="Sent" />
                                        <Area type="monotone" dataKey="opened" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorOpened)" name="Opened" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card title="Conversions vs Clicks">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                        <Bar dataKey="clicked" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Clicks" />
                                        <Bar dataKey="converted" fill="#10b981" radius={[4, 4, 0, 0]} name="Conversions" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <CampaignAnalytics campaign={campaign} />
            )}

            {activeTab === 'audience' && (
                <Card title="Target Audience" subtitle={`${formatNumber(campaign.audience)} recipients targeted`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900 text-white rounded-lg overflow-hidden">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">Customer {i}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">+91 98765 4321{i}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 text-xs font-medium rounded-sm bg-blue-100 text-blue-600 dark:bg-blue-900/30">Delivered</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500">2 hours ago</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {activeTab === 'configuration' && (
                <div className="space-y-6">
                    <Card title="Campaign Details">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Campaign Name</label>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{campaign.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Subject / Title</label>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {(campaign as any).subject || "No Subject"}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-slate-500 block mb-1">Content / Message</label>
                                <div className="rounded-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 text-sm">
                                    {(campaign as any).content || "No content available."}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-slate-500 block mb-1">Target Audience Criteria</label>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {(campaign as any).targetAudience || "All Users"}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <EditCampaignModal
                campaign={campaign}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveCampaign}
            />
        </div>
    )
}
