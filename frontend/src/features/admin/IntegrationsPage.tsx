
/**
 * Integrations Page for House FinMan
 * World-class design with premium aesthetics and rich interactivity.
 */

import { useState } from 'react'
import {
    Database,
    Plus,
    Search,
    Activity,
    Eye,
    Bug,
    Server,
    Flame,
    Shield,
    Lightbulb,
    BarChart3,
    ScrollText,
    Zap,
    ArrowUpRight,
    Signal,
    LayoutGrid,
    List,
    Globe,
    TrendingUp
} from 'lucide-react'
import { Button, WizardModal, KPICard } from '@/components/ui'
import { cn } from '@/utils'
import { ConnectIntegrationModal } from './components/ConnectIntegrationModal'
import { ConfigureIntegrationModal } from './components/ConfigureIntegrationModal'

const initialIntegrations = [
    {
        id: 'ga4',
        name: 'Google Analytics 4',
        description: 'Next generation property views and user behavior tracking.',
        category: 'Analytics',
        status: 'connected',
        lastSync: '2026-01-08T10:30:00',
        icon: BarChart3,
        color: 'bg-orange-600',
        gradient: 'from-orange-500 to-orange-700',
        popular: true,
        health: 'Healthy',
        latency: '24ms',
        uptime: '99.99%'
    },
    {
        id: 'clarity',
        name: 'Microsoft Clarity',
        description: 'Heatmaps and session recordings to understand user intent.',
        category: 'Analytics',
        status: 'connected',
        lastSync: '2026-01-08T10:25:00',
        icon: Eye,
        color: 'bg-blue-600',
        gradient: 'from-blue-500 to-blue-700',
        popular: true,
        health: 'Healthy',
        latency: '45ms',
        uptime: '99.95%'
    },
    {
        id: 'sentry',
        name: 'Sentry',
        description: 'Real-time error tracking and performance monitoring.',
        category: 'DevTools',
        status: 'connected',
        lastSync: '2026-01-08T10:00:00',
        icon: Bug,
        color: 'bg-slate-800',
        gradient: 'from-slate-700 to-slate-900',
        popular: true,
        health: 'Healthy',
        latency: '12ms',
        uptime: '100%'
    },
    {
        id: 'uptimerobot',
        name: 'UptimeRobot',
        description: 'Instant downtime alerts and status pages.',
        category: 'DevTools',
        status: 'connected',
        lastSync: '2026-01-08T09:45:00',
        icon: Server,
        color: 'bg-emerald-600',
        gradient: 'from-emerald-500 to-emerald-700',
        popular: true,
        health: 'Healthy',
        latency: '18ms',
        uptime: '99.98%'
    },
    {
        id: 'betterstack',
        name: 'BetterStack',
        description: 'Log aggregation and infrastructure monitoring.',
        category: 'DevTools',
        status: 'disconnected',
        icon: Database,
        color: 'bg-yellow-600',
        gradient: 'from-yellow-500 to-yellow-700',
        popular: false,
        health: '-',
        latency: '-',
        uptime: '-'
    },
    {
        id: 'hotjar',
        name: 'Hotjar',
        description: 'Feedback polls and behavior analytics.',
        category: 'Analytics',
        status: 'connected',
        lastSync: '2026-01-08T08:00:00',
        icon: Flame,
        color: 'bg-rose-600',
        gradient: 'from-rose-500 to-rose-700',
        popular: true,
        health: 'Healthy',
        latency: '32ms',
        uptime: '99.9%'
    },
    {
        id: 'webvitals',
        name: 'Web Vitals',
        description: 'Core Web Vitals tracking for SEO performance.',
        category: 'Performance',
        status: 'connected',
        lastSync: '2026-01-08T16:00:00',
        icon: Zap,
        color: 'bg-cyan-600',
        gradient: 'from-cyan-500 to-cyan-700',
        popular: false,
        health: 'Healthy',
        latency: '8ms',
        uptime: '100%'
    },
    {
        id: 'plausible',
        name: 'Plausible',
        description: 'Privacy-friendly lightweight analytics alternative.',
        category: 'Analytics',
        status: 'disconnected',
        icon: Shield,
        color: 'bg-indigo-600',
        gradient: 'from-indigo-500 to-indigo-700',
        popular: false,
        health: '-',
        latency: '-',
        uptime: '-'
    },
    {
        id: 'canny',
        name: 'Canny',
        description: 'Feature requests and product roadmap management.',
        category: 'Product',
        status: 'disconnected',
        icon: Lightbulb,
        color: 'bg-purple-600',
        gradient: 'from-purple-500 to-purple-700',
        popular: false,
        health: '-',
        latency: '-',
        uptime: '-'
    },
    {
        id: 'posthog',
        name: 'PostHog',
        description: 'Product analytics, feature flags, and session replay.',
        category: 'Product',
        status: 'disconnected',
        icon: ScrollText,
        color: 'bg-black',
        gradient: 'from-gray-800 to-black',
        popular: false,
        health: '-',
        latency: '-',
        uptime: '-'
    }
]

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState(initialIntegrations)
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [connectingId, setConnectingId] = useState<string | null>(null)
    const [configuringId, setConfiguringId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const categories = ['all', ...new Set(integrations.map(i => i.category))]

    const filteredIntegrations = integrations.filter(i => {
        const matchesCategory = categoryFilter === 'all' || i.category === categoryFilter
        const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const connectedCount = integrations.filter(i => i.status === 'connected').length
    const healthyCount = integrations.filter(i => i.status === 'connected' && i.health === 'Healthy').length

    const handleConnect = () => {
        if (connectingId) {
            const isHealthy = Math.random() > 0.02
            const latency = Math.floor(Math.random() * 45 + 10)
            const uptime = (99.5 + Math.random() * 0.5).toFixed(2)

            setIntegrations(prev => prev.map(i =>
                i.id === connectingId
                    ? {
                        ...i,
                        status: 'connected',
                        lastSync: new Date().toISOString(),
                        health: isHealthy ? 'Healthy' : 'Degraded',
                        latency: `${latency}ms`,
                        uptime: `${uptime}%`
                    }
                    : i
            ))
            setConnectingId(null)
        }
    }

    const handleDisconnect = () => {
        if (configuringId) {
            setIntegrations(prev => prev.map(i =>
                i.id === configuringId
                    ? {
                        ...i,
                        status: 'disconnected',
                        health: '-',
                        latency: '-',
                        uptime: '-'
                    }
                    : i
            ))
            setConfiguringId(null)
        }
    }

    const connectingIntegration = connectingId ? integrations.find(i => i.id === connectingId) : null
    const configuringIntegration = configuringId ? integrations.find(i => i.id === configuringId) : null

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white tracking-tight">Integrations Marketplace</h1>
                    <p className="text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                        Supercharge your House FinMan workflow. Connect tools, sync data in real-time, and automate your entire financial ecosystem.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                        leftIcon={<ScrollText className="w-4 h-4" />}
                        onClick={() => window.open('https://docs.housefinman.com/integrations', '_blank')}
                    >
                        Documentation
                    </Button>
                    <Button
                        variant="primary"
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="px-4 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                        onClick={() => setIsRequestModalOpen(true)}
                    >
                        Request Integration
                    </Button>
                </div>
            </div>

            {/* Dashboard Stats Hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPICard
                    title="Active Connections"
                    value={`${connectedCount} / ${integrations.length}`}
                    trend={{ value: 8.5, direction: 'up' }}
                    icon={<Globe className="w-5 h-5 text-blue-500" />}
                    variant="blue"
                />
                <KPICard
                    title="System Health"
                    value={healthyCount === connectedCount ? '100%' : '90%'}
                    subtitle="All systems operational"
                    icon={<Activity className="w-5 h-5 text-emerald-500" />}
                    variant="emerald"
                />
                <KPICard
                    title="Marketplace Growth"
                    value="+12.5%"
                    icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
                    variant="orange"
                />
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Visual Toolbar */}
                <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-sm shadow-sm flex flex-col md:flex-row items-center p-2 gap-2 transition-all">

                    {/* Search Field */}
                    <div className="relative flex-1 w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find an integration..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                        />
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block" />

                    {/* Categories */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={cn(
                                    'px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm transition-all whitespace-nowrap',
                                    categoryFilter === cat
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block" />

                    {/* View Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-sm shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn("p-1.5 rounded-sm transition-all", viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600")}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("p-1.5 rounded-sm transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600")}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Grid View */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredIntegrations.map((integration, idx) => (
                            <div
                                key={integration.id}
                                className={cn(
                                    "group relative flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-1",
                                )}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {integration.status === 'connected' && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                                )}

                                {integration.popular && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest rounded-sm shadow-sm">Popular</span>
                                    </div>
                                )}

                                <div className="flex items-start gap-4 mb-5 relative z-10">
                                    <div className={cn(
                                        'w-14 h-14 flex items-center justify-center rounded-xl shadow-lg shrink-0 text-white bg-gradient-to-br',
                                        integration.gradient
                                    )}>
                                        <integration.icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{integration.name}</h3>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border border-slate-100 dark:border-white/10 px-1.5 py-0.5 rounded-sm bg-slate-50 dark:bg-white/5">{integration.category}</span>
                                            {integration.status === 'connected' && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider animate-pulse">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Live
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
                                    {integration.description}
                                </p>

                                {/* Metrics Section */}
                                <div className="mt-auto space-y-5 bg-slate-50/50 dark:bg-white/5 -mx-4 -mb-6 border-t border-slate-100 dark:border-white/5">
                                    {integration.status === 'connected' ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Latency</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '35%' }} />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{integration.latency}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Uptime</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '99%' }} />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{integration.uptime}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => setConfiguringId(integration.id)}
                                                    className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-600 transition-all rounded-sm shadow-sm"
                                                >
                                                    Configure
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        alert('Syncing ' + integration.name + '...');
                                                        setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, lastSync: new Date().toISOString() } : i));
                                                    }}
                                                    className="px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-sm transition-colors border border-transparent hover:border-emerald-200"
                                                    title="Sync Now"
                                                >
                                                    <Zap className="w-4 h-4 fill-current" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConnectingId(integration.id)}
                                            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-50 transition-all rounded-sm shadow-lg shadow-blue-900/10 hover:shadow-blue-600/20 active:scale-[0.98]"
                                        >
                                            Connect Integration
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConnectIntegrationModal
                isOpen={!!connectingId}
                onClose={() => setConnectingId(null)}
                integrationName={connectingIntegration?.name || ''}
                icon={connectingIntegration?.icon}
                onConnect={handleConnect}
            />

            <ConfigureIntegrationModal
                isOpen={!!configuringId}
                onClose={() => setConfiguringId(null)}
                integrationName={configuringIntegration?.name || ''}
                onSave={() => alert('Configuration saved!')}
                onDisconnect={handleDisconnect}
            />

            <WizardModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                title="Request Integration"
                subtitle="Suggest a new tool"
                sidebarWidth="w-[300px]"
                currentStep={1}
                steps={[
                    { id: 1, label: 'Tool Details', description: 'Name & Website' },
                    { id: 2, label: 'Use Case', description: 'Why do you need it?' },
                    { id: 3, label: 'Priority', description: 'Urgency Level' }
                ]}
                contentTitle="Suggest a New Integration"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="secondary" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => {
                            alert('Request submitted! We will notify you once it is available.')
                            setIsRequestModalOpen(false)
                        }}>Submit Request</Button>
                    </div>
                }
            >
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-sm text-sm border border-blue-100 dark:border-blue-900/30">
                        <p className="font-bold mb-1">Missing a favorite tool?</p>
                        <p>Let us know which tool you'd like to see integrated. Our team reviews requests weekly.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tool Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Slack, Trello, Zoom"
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                            <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm">
                                <option>CRM</option>
                                <option>Communication</option>
                                <option>Marketing</option>
                                <option>Productivity</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description / URL</label>
                            <textarea
                                rows={3}
                                placeholder="Tell us more or paste a link..."
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm resize-none"
                            />
                        </div>
                    </div>
                </div>
            </WizardModal>
        </div>
    )
}
