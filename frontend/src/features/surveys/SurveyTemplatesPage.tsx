import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search, LayoutTemplate, MapPin, Building2, CreditCard,
    MessageSquare, Zap, Target, Star, Eye, Copy, ArrowRight,
    CheckCircle2, AlertCircle
} from 'lucide-react'
import { Button, Card, WizardModal } from '@/components/ui'
import { cn } from '@/utils'

// ============ MOCK DATA ============

type Category = 'All' | 'Buyer Intent' | 'Loan Process' | 'Property' | 'Feedback'

const categories: Category[] = ['All', 'Buyer Intent', 'Loan Process', 'Property', 'Feedback']

const templates = [
    {
        id: 't1',
        title: 'High-Intent Buyer Qualification',
        category: 'Buyer Intent',
        questions: 8,
        time: '2 min',
        rating: 4.8,
        usage: '2.5k used',
        description: 'Qualify leads based on budget, timeline, and location preference. Includes logic to tag "Hot Leads".',
        tags: ['Lead Gen', 'Qualification'],
        color: 'blue'
    },
    {
        id: 't2',
        title: 'Loan Pre-Qualification Check',
        category: 'Loan Process',
        questions: 12,
        time: '3 min',
        rating: 4.9,
        usage: '5.1k used',
        description: 'Gather income, employment, and existing loan details to estimate eligibility. Bank-ready format.',
        tags: ['Finance', 'Eligibility'],
        color: 'emerald'
    },
    {
        id: 't3',
        title: 'Site Visit Feedback',
        category: 'Property',
        questions: 5,
        time: '1 min',
        rating: 4.7,
        usage: '1.2k used',
        description: 'Post-visit survey to gauge interest and identify concerns immediately after property tour.',
        tags: ['Feedback', 'Site Visit'],
        color: 'amber'
    },
    {
        id: 't4',
        title: 'Post-Disbursement NPS',
        category: 'Feedback',
        questions: 3,
        time: '30 sec',
        rating: 4.6,
        usage: '800 used',
        description: 'Measure customer satisfaction after loan disbursement. Simple NPS + Comment structure.',
        tags: ['NPS', 'CX'],
        color: 'purple'
    },
    {
        id: 't5',
        title: 'Builder Project Interest',
        category: 'Property',
        questions: 6,
        time: '1.5 min',
        rating: 4.5,
        usage: '3.4k used',
        description: 'Gauge interest in specific upcoming projects. Capture unit type preferences.',
        tags: ['Launch', 'Interest'],
        color: 'orange'
    },
    {
        id: 't6',
        title: 'Lost Lead Reactivation',
        category: 'Buyer Intent',
        questions: 4,
        time: '1 min',
        rating: 4.2,
        usage: '900 used',
        description: 'Re-engage cold leads to see if they are still in the market. automated follow-up trigger.',
        tags: ['Re-engagement', 'Cold Leads'],
        color: 'slate'
    }
]

// ============ MAIN COMPONENT ============

export default function SurveyTemplatesPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<Category>('All')
    const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null)

    const filteredTemplates = templates.filter(t => {
        if (activeCategory !== 'All' && t.category !== activeCategory) return false
        if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    return (
        <div className="animate-fade-in pb-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="w-full mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Survey Templates</h1>
                            <p className="text-slate-500 text-sm max-w-xl">
                                Start with a battle-tested template designed for Real Estate & Lending workflows.
                                Optimized for high completion rates.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="rounded-none border-slate-300 dark:border-slate-700 h-11 px-4 font-bold uppercase tracking-wide text-xs"
                                onClick={() => navigate('/surveys')}
                            >
                                My Surveys
                            </Button>
                            <Button
                                variant="primary"
                                className="rounded-none h-11 px-4 font-bold uppercase tracking-wide text-xs shadow-lg shadow-blue-500/20"
                                leftIcon={<LayoutTemplate className="w-4 h-4" />}
                                onClick={() => navigate('/surveys/create')}
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Create Blank
                            </Button>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all whitespace-nowrap border",
                                        activeCategory === cat
                                            ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="w-full mx-auto px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map(template => (
                        <div
                            key={template.id}
                            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col"
                        >
                            {/* Color Strip */}
                            <div className={cn("h-1.5 w-full",
                                template.color === 'blue' && "bg-blue-500",
                                template.color === 'emerald' && "bg-emerald-500",
                                template.color === 'amber' && "bg-amber-500",
                                template.color === 'purple' && "bg-purple-500",
                                template.color === 'orange' && "bg-orange-500",
                                template.color === 'slate' && "bg-slate-500",
                            )} />

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        "w-10 h-10 flex items-center justify-center text-white font-bold rounded-none shadow-sm",
                                        template.color === 'blue' && "bg-blue-500",
                                        template.color === 'emerald' && "bg-emerald-500",
                                        template.color === 'amber' && "bg-amber-500",
                                        template.color === 'purple' && "bg-purple-500",
                                        template.color === 'orange' && "bg-orange-500",
                                        template.color === 'slate' && "bg-slate-500",
                                    )}>
                                        {template.id === 't1' && <Target className="w-5 h-5" />}
                                        {template.id === 't2' && <CreditCard className="w-5 h-5" />}
                                        {template.id === 't3' && <Building2 className="w-5 h-5" />}
                                        {template.id === 't4' && <MessageSquare className="w-5 h-5" />}
                                        {template.id === 't5' && <Building2 className="w-5 h-5" />}
                                        {template.id === 't6' && <Zap className="w-5 h-5" />}
                                    </div>
                                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-none border border-amber-100 dark:border-amber-900/20">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-bold text-amber-700 dark:text-amber-500">{template.rating}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                                    {template.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                                    {template.description}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider mb-6">
                                        <span className="flex items-center gap-1.5">
                                            <LayoutTemplate className="w-3 h-3" /> {template.questions} Qs
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Share2 className="w-3 h-3" /> {template.usage}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 opacity-100 md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-none uppercase text-[10px] font-bold tracking-wide h-9 hover:bg-slate-50 border-slate-300"
                                            onClick={() => setSelectedTemplate(template)}
                                            leftIcon={<Eye className="w-3 h-3" />}
                                        >
                                            Preview
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="rounded-none uppercase text-[10px] font-bold tracking-wide h-9 shadow-md"
                                            onClick={() => navigate(`/surveys/create?template=${template.id}`)}
                                            leftIcon={<Copy className="w-3 h-3" />}
                                        >
                                            Use Template
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Template Preview Modal */}
            {selectedTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-scale-in border border-slate-200 dark:border-slate-700">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedTemplate.title}</h2>
                                <p className="text-sm text-slate-500 mt-1">{selectedTemplate.description}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)} className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                                <span className="text-xl font-bold">×</span>
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-auto p-0 flex flex-col md:flex-row h-[500px]">
                            {/* Sidebar Info */}
                            <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-950 p-6 border-r border-slate-200 dark:border-slate-800 space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Template Stats</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedTemplate.questions}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Questions</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedTemplate.time}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Est. Time</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Best For</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTemplate.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">Pro Tip</p>
                                            <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1 leading-relaxed">
                                                This template has a 20% higher conversion rate when sent via WhatsApp.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Content */}
                            <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 flex flex-col items-center overflow-auto">
                                <div className="w-full max-w-md space-y-4 pointer-events-none select-none opacity-90 scale-95 origin-top">
                                    <Card className="p-6 rounded-none shadow-sm border-l-4 border-l-blue-500">
                                        <p className="text-xs font-bold uppercase text-slate-400 mb-2">Question 1 of {selectedTemplate.questions}</p>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                            {selectedTemplate.id === 't1' ? 'When are you planning to buy a property?' : 'How satisfied are you with our service?'}
                                        </h3>
                                        <div className="space-y-2">
                                            {['Immediately (0-3 months)', 'Within 6 months', 'Considering next year'].map((opt, i) => (
                                                <div key={i} className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                    <div className="flex justify-between items-center px-2">
                                        <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="w-1/3 h-full bg-blue-500" />
                                        </div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Powered by HouseFin AI</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="rounded-none font-bold uppercase tracking-wide px-4">Cancel</Button>
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/surveys/create?template=${selectedTemplate.id}`)}
                                className="rounded-none font-bold uppercase tracking-wide px-8 shadow-lg shadow-blue-500/30"
                                leftIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Use This Template
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}

function Share2({ className }: { className?: string }) { // Temp fix for missing import
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
}
