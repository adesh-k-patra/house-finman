/**
 * Property Detail Page for House FinMan
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    MapPin,
    Building2,
    Heart,
    Share2,
    Phone,
    CheckCircle2,
    FileText,
    Users,
    BarChart3,
    Pencil,
    Trash2,
    Plus,
    Calendar,
    TrendingUp,
    Eye,
    Video,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Home,
    PieChart,
    Activity,
    LayoutGrid,
    MoreVertical,
} from 'lucide-react'
import { Button, Card, CustomChartTooltip, KPICard } from '@/components/ui'
import { cn, formatCurrency, getInitials } from '@/utils'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'

import { ChartDefs } from '@/components/ui/ChartDefs'
import PropertyWizardModal from './components/PropertyWizardModal'
import TabItemWizard from './components/TabItemWizard'

const dummyProperty = {
    id: 'prop_001',
    name: 'Green Valley Apartments',
    type: 'apartment',
    builder: 'Prestige Group',
    location: 'Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    price: 4500000,
    area: 1250,
    bedrooms: 2,
    bathrooms: 2,
    status: 'available',
    pmayEligible: true,
    reraNumber: 'PRM/KA/RERA/1251/308/PR/171015/000000',
    completionDate: '2026-06-30',
    addedAt: '2025-11-15',
    views: 245,
    inquiries: 18,
    images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    ],
    amenities: ['Swimming Pool', 'Gym', 'Club House', 'Children Play Area', '24x7 Security', 'Power Backup', 'Car Parking', 'Landscaped Gardens'],
    nearbyPlaces: [
        { name: 'ITPL', distance: '2 km', type: 'workplace' },
        { name: 'Phoenix Marketcity', distance: '4 km', type: 'shopping' },
        { name: 'Columbia Asia Hospital', distance: '3 km', type: 'hospital' },
        { name: 'DPS School', distance: '1.5 km', type: 'school' },
    ],
    priceHistory: [
        { month: 'Aug', price: 4200000 },
        { month: 'Sep', price: 4250000 },
        { month: 'Oct', price: 4300000 },
        { month: 'Nov', price: 4400000 },
        { month: 'Dec', price: 4450000 },
        { month: 'Jan', price: 4500000 },
    ],
    analytics: {
        totalViews: 1245,
        monthlyViews: [
            { name: 'Mon', views: 24 },
            { name: 'Tue', views: 45 },
            { name: 'Wed', views: 38 },
            { name: 'Thu', views: 52 },
            { name: 'Fri', views: 65 },
            { name: 'Sat', views: 85 },
            { name: 'Sun', views: 70 },
        ],
        engagementRate: 12.5,
        avgTimeOnPage: '2m 15s'
    }
}

const interestedLeads = [
    { id: '1', name: 'Rahul Sharma', phone: '+91 9876543210', status: 'site_visit_scheduled', date: '2026-01-06' },
    { id: '2', name: 'Priya Patel', phone: '+91 9876543211', status: 'interested', date: '2026-01-05' },
    { id: '3', name: 'Amit Kumar', phone: '+91 9876543212', status: 'negotiating', date: '2026-01-04' },
]

type TabType = 'overview' | 'tour360' | 'amenities' | 'leads' | 'documents' | 'analytics'

export default function PropertyDetailPage() {
    const navigate = useNavigate()
    // const { id } = useParams() - Unused removed
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [tourScene, setTourScene] = useState<string>('living_room')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isTabWizardOpen, setIsTabWizardOpen] = useState(false)
    const [lastAction, setLastAction] = useState<string | null>(null) // For debugging actions
    const property = dummyProperty

    const tabs: { key: TabType; label: string; icon: any }[] = [
        { key: 'overview', label: 'Overview', icon: Building2 },
        { key: 'tour360', label: 'Tour 360°', icon: Video },
        { key: 'amenities', label: 'Amenities', icon: CheckCircle2 },
        { key: 'leads', label: 'Leads', icon: Users },
        { key: 'documents', label: 'Documents', icon: FileText },
        { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    ]

    const tourScenes = {
        living_room: { label: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80' },
        master_bedroom: { label: 'Master Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-40891a909d99?w=1200&q=80' },
        kitchen: { label: 'Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80' },
        balcony: { label: 'Balcony View', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80' }
    }

    const handleEditSave = (data: any) => {
        setLastAction('Property Updated: ' + data.name)
        // In a real app, update state/backend here
    }

    const handleTabItemSave = (data: any) => {
        setLastAction(`Added to ${activeTab}: ` + JSON.stringify(data))
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Top Navigation & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/properties')}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Properties
                </button>
                <div className="flex items-center gap-2">
                    {/* Debug message just to show button clicks */}
                    {lastAction && <span className="text-xs text-emerald-500 mr-2 md:hidden">{lastAction}</span>}

                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-none"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                                window.alert('Property deleted successfully (Mock Action)')
                                navigate('/properties')
                            }
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Pencil className="w-4 h-4" />}
                        className="rounded-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Property
                    </Button>
                </div>
            </div>

            {/* Hero Section - Sharp */}
            <div className="relative h-[400px] rounded-none overflow-hidden group shadow-lg">
                {/* Main Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${property.images[0]})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-3 py-1 text-[10px] font-bold rounded-none bg-emerald-500/90 text-white backdrop-blur-md shadow-sm uppercase tracking-widest border border-emerald-400/30">
                        Available
                    </span>
                    {property.pmayEligible && (
                        <span className="px-3 py-1 text-[10px] font-bold rounded-none bg-blue-500/90 text-white backdrop-blur-md shadow-sm uppercase tracking-widest border border-blue-400/30">
                            PMAY Eligible
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-6 right-6 flex gap-2">
                    <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-none text-white transition-all shadow-sm border border-white/10">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-none text-white transition-all shadow-sm border border-white/10">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm tracking-tight">{property.name}</h1>
                            <div className="flex items-center gap-2 text-slate-300">
                                <MapPin className="w-4 h-4" />
                                <span className="text-lg font-light tracking-wide">{property.location}, {property.city}</span>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-4xl font-bold text-white mb-1 shadow-sm tracking-tight">{formatCurrency(property.price)}</p>
                            <p className="text-sm text-slate-300 font-medium tracking-wide">{formatCurrency(Math.round(property.price / property.area))}/sq.ft</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row - Sharp Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <KPICard title="Sq.ft" value="3,200" icon={<LayoutGrid className="w-3.5 h-3.5" />} variant="blue" compact />
                <KPICard title="Bedrooms" value="4" icon={<Home className="w-3.5 h-3.5" />} variant="emerald" compact />
                <KPICard title="Bathrooms" value="4.5" icon={<Activity className="w-3.5 h-3.5" />} variant="purple" compact />
                <KPICard title="Views" value="1,240" icon={<TrendingUp className="w-3.5 h-3.5" />} variant="orange" compact />
                <KPICard title="Leads" value="12" icon={<Users className="w-3.5 h-3.5" />} variant="pink" compact />
                <KPICard title="ROI" value="8.5%" icon={<DollarSign className="w-3.5 h-3.5" />} variant="royal" compact />
                <KPICard title="Occupancy" value="95%" icon={<CheckCircle2 className="w-3.5 h-3.5" />} variant="violet" compact />
                <KPICard title="Yield" value="6.2%" icon={<PieChart className="w-3.5 h-3.5" />} variant="cyan" compact />
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-wider transition-all relative whitespace-nowrap',
                                activeTab === tab.key ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", activeTab === tab.key && "fill-current opacity-20")} />
                            {tab.label}
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" /> /* Removed rounded-t-full for sharpness */
                            )}
                        </button>
                    ))}
                </div>
                {/* Universal Add Item Button for Tabs - Requested by User */}
                <div className="hidden sm:block pb-2">
                    <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Plus className="w-3 h-3" />}
                        className="rounded-none text-xs"
                        onClick={() => setIsTabWizardOpen(true)}
                    >
                        Add Item
                    </Button>
                </div>
            </div>

            {/* Mobile Add Item Button */}
            <div className="sm:hidden flex justify-end mb-4">
                <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Plus className="w-3 h-3" />}
                    className="rounded-none w-full"
                    onClick={() => setIsTabWizardOpen(true)}
                >
                    Add {activeTab === 'tour360' ? 'Scene' : activeTab.slice(0, -1)}
                </Button>
            </div>


            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
                        <Card title="Property Details" className="h-full border-t-2 border-t-blue-500 rounded-none">
                            <div className="space-y-4">
                                {[
                                    { label: 'Type', value: property.type, capitalize: true },
                                    { label: 'Builder', value: property.builder },
                                    { label: 'Configuration', value: `${property.bedrooms} BHK` },
                                    { label: 'Possession', value: 'Ready to Move' },
                                    { label: 'Furnishing', value: 'Semi-Furnished' },
                                    { label: 'Age of Building', value: 'New Construction' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{item.label}</span>
                                        <span className={cn("text-sm font-medium text-slate-900 dark:text-white", item.capitalize && "capitalize")}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Location Details" className="h-full border-t-2 border-t-emerald-500 rounded-none">
                            <div className="space-y-4">
                                {[
                                    { label: 'Address', value: property.location },
                                    { label: 'City', value: property.city },
                                    { label: 'State', value: property.state },
                                    { label: 'Pincode', value: property.pincode },
                                    { label: 'Landmark', value: 'Near Metro Station' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{item.label}</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white text-right">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Compliance & Legal" className="h-full border-t-2 border-t-purple-500 rounded-none">
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-none border border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">RERA Number</p>
                                    <p className="text-sm font-mono font-medium text-primary-600 break-all">{property.reraNumber}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">PMAY Eligible</span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-none">YES</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Occupancy Certificate</span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-none">RECEIVED</span>
                                </div>
                            </div>
                        </Card>

                        <Card title="Nearby Places" className="col-span-1 md:col-span-3 border-t-2 border-t-amber-500 rounded-none">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {property.nearbyPlaces.map((place, i) => (
                                    <div key={i} className="flex items-start gap-3 rounded-none bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 transition-colors">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-none shadow-sm text-primary-500">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{place.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{place.type} • <span className="text-slate-700 dark:text-slate-400 font-medium">{place.distance}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Tour 360 Tab */}
                {activeTab === 'tour360' && (
                    <div className="animate-fade-in-up md:grid md:grid-cols-4 gap-4 h-[600px]">
                        <div className="md:col-span-3 bg-black rounded-none overflow-hidden relative group">
                            {/* ... (Keep Tour Viewer Logic mostly same, just check rounded classes) ... */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                                style={{ backgroundImage: `url(${tourScenes[tourScene as keyof typeof tourScenes].image})` }}
                            />
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                            <div className="absolute top-4 left-4 pointer-events-auto">
                                <h3 className="text-xl font-bold text-white drop-shadow-md">{tourScenes[tourScene as keyof typeof tourScenes].label}</h3>
                            </div>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
                                <button className="p-3 rounded-none bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-all transform hover:scale-110">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="px-4 py-2 rounded-none bg-white/20 backdrop-blur-md text-white text-sm font-medium">
                                    Drag to rotate
                                </div>
                                <button className="p-3 rounded-none bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-all transform hover:scale-110">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                            {/* ... */}
                        </div>

                        <div className="md:col-span-1 space-y-4 mt-4 md:mt-0">
                            <Card title="Scene Selector" className="h-full rounded-none">
                                <div className="space-y-3">
                                    {Object.entries(tourScenes).map(([key, scene]) => (
                                        <button
                                            key={key}
                                            onClick={() => setTourScene(key)}
                                            className={cn(
                                                "w-full text-left p-2 rounded-none transition-all flex items-center gap-3 border",
                                                tourScene === key
                                                    ? "bg-primary-50 border-primary-500 ring-1 ring-primary-500"
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent hover:border-slate-200"
                                            )}
                                        >
                                            <div className="w-16 h-10 rounded-none bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${scene.image})` }} />
                                            <div>
                                                <p className={cn("text-xs font-bold uppercase", tourScene === key ? "text-primary-700" : "text-slate-700 dark:text-slate-300")}>{scene.label}</p>
                                                <p className="text-[10px] text-slate-500">360° View</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'amenities' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <Card padding="none" className="overflow-hidden rounded-none">
                            <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                                {property.amenities.map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-none bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <Card padding="none" className="overflow-hidden rounded-none">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {interestedLeads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-none bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                                {getInitials(lead.name)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{lead.name}</p>
                                                <p className="text-xs text-slate-500">{lead.phone} • Added on {new Date(lead.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn('px-3 py-1 text-[10px] font-bold uppercase rounded-none tracking-wide',
                                                lead.status === 'site_visit_scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                                    lead.status === 'negotiating' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                            )}>
                                                {lead.status.replace(/_/g, ' ')}
                                            </span>
                                            <Button size="sm" variant="ghost" leftIcon={<Phone className="w-4 h-4" />}>Call</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <Card padding="none" className="overflow-hidden rounded-none">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {['Brochure.pdf', 'Floor Plan - Tower A.pdf', 'Standard Price List.pdf', 'RERA Certificate.pdf'].map((doc, i) => (
                                    <div key={i} className="flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group bg-white dark:bg-slate-900">
                                        <div className="w-12 h-12 rounded-none bg-red-50 dark:bg-red-900/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FileText className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{doc}</p>
                                            <p className="text-xs text-slate-500 mt-1">PDF • 2.4 MB • Uploaded 2 days ago</p>
                                        </div>
                                        <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-none">Download</Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <KPICard
                                title="Total Views"
                                value={property.analytics.totalViews}
                                icon={<Eye className="w-5 h-5" />}
                                variant="blue"
                            />
                            <KPICard
                                title="Engagement"
                                value={`${property.analytics.engagementRate}%`}
                                icon={<TrendingUp className="w-5 h-5" />}
                                variant="emerald"
                            />
                            <KPICard
                                title="Avg Time"
                                value={property.analytics.avgTimeOnPage}
                                icon={<Calendar className="w-5 h-5" />}
                                variant="amber"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card title="Price Trends (6 Months)" className="min-h-[300px] rounded-none">
                                <div className="h-[250px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={property.priceHistory}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `${value / 100000}L`} />
                                            <Tooltip content={<CustomChartTooltip currency />} />
                                            <Area type="linear" dataKey="price" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#glass-indigo)" filter="url(#shadow)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card title="Weekly Visitor Activity" className="min-h-[300px] rounded-none">
                                <div className="h-[250px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={property.analytics.monthlyViews}>
                                            <ChartDefs />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                            <Tooltip content={<CustomChartTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.5 }} />
                                            <Bar dataKey="views" fill="url(#glass-teal)" radius={[0, 0, 0, 0]} barSize={40} filter="url(#shadow)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Wizards */}
            <PropertyWizardModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={property}
                onSave={handleEditSave}
            />
            <TabItemWizard
                isOpen={isTabWizardOpen}
                onClose={() => setIsTabWizardOpen(false)}
                tabType={activeTab}
                onSave={handleTabItemSave}
            />
        </div>
    )
}
