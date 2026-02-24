
import { useState } from 'react'
import { CreateArticleModal } from './components/CreateArticleModal'
import {
    Book,
    FileText,
    Video,
    Download,
    Search,
    Plus,
    Folder,
    Eye,
    Network,
    List,
    Edit,
    Trash,
    User,
    Clock,
    Tag
} from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'
import { cn, formatRelativeTime } from '@/utils'

// Mock Data for Graph (simplified for UI logic)

const categories = [
    { id: 'products', name: 'Products & Services', icon: Folder, count: 12, color: 'text-blue-500', bg: 'bg-blue-100', fill: '#3b82f6' },
    { id: 'processes', name: 'Processes & SOPs', icon: Folder, count: 24, color: 'text-purple-500', bg: 'bg-purple-100', fill: '#a855f7' },
    { id: 'training', name: 'Training Materials', icon: Video, count: 8, color: 'text-emerald-500', bg: 'bg-emerald-100', fill: '#10b981' },
    { id: 'templates', name: 'Templates & Forms', icon: FileText, count: 15, color: 'text-amber-500', bg: 'bg-amber-100', fill: '#f59e0b' },
    { id: 'compliance', name: 'Compliance & Legal', icon: Book, count: 6, color: 'text-red-500', bg: 'bg-red-100', fill: '#ef4444' },
    { id: 'faqs', name: 'FAQs', icon: Book, count: 45, color: 'text-cyan-500', bg: 'bg-cyan-100', fill: '#06b6d4' },
]

const initialArticles = [
    { id: '1', title: 'Home Loan Eligibility Criteria', category: 'products', views: 1245, lastUpdated: '2026-01-03T10:00:00', type: 'article' },
    { id: '2', title: 'KYC Document Checklist', category: 'processes', views: 982, lastUpdated: '2026-01-02T14:30:00', type: 'checklist' },
    { id: '3', title: 'PMAY Subsidy Calculator Guide', category: 'products', views: 856, lastUpdated: '2026-01-04T09:00:00', type: 'article' },
    { id: '4', title: 'Partner Onboarding Training', category: 'training', views: 654, lastUpdated: '2025-12-28T11:00:00', type: 'video' },
    { id: '5', title: 'Loan Application Form Template', category: 'templates', views: 543, lastUpdated: '2025-12-25T16:00:00', type: 'template' },
    { id: '6', title: 'Credit Assessment Guidelines', category: 'processes', views: 432, lastUpdated: '2026-01-01T10:30:00', type: 'article' },
]

const typeIcons: Record<string, any> = {
    article: FileText,
    video: Video,
    template: Download,
    checklist: FileText,
}

export default function KnowledgeBasePage() {
    const [viewMode, setViewMode] = useState<'list' | 'graph'>('list')
    const [currentStep, setCurrentStep] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null)
    const [articles, setArticles] = useState(initialArticles)
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    // Using simplified graph logic for display
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory ? article.category === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (window.confirm('Are you sure you want to delete this article?')) {
            setArticles(articles.filter(a => a.id !== id))
        }
    }

    const handleQuickAdd = (e: React.MouseEvent, categoryId: string) => {
        e.stopPropagation()
        setSelectedCategory(categoryId)
        setIsCreateOpen(true)
    }

    return (
        <div className="space-y-6 animate-fade-in relative min-h-screen pb-20">
            {/* Header Hero */}
            <div className="relative bg-[#0F172A] -mx-4 -mt-6 px-10 py-16 text-white border-b border-white/10 overflow-hidden">
                <div className="relative z-10 max-w-4xl">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Knowledge Base</h1>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                        Access product guides, training videos, compliance docs, and templates. The central brain of House FinMan.
                    </p>

                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ask a question or search for docs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-none text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-xl"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono text-slate-400 border border-white/10">CMD + K</span>
                        </div>
                    </div>
                </div>

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-200 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 -mx-4">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        className={cn(
                            "group relative p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer",
                            selectedCategory === cat.id && "bg-slate-50 dark:bg-slate-800/80"
                        )}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <cat.icon className={cn("w-6 h-6 transition-colors", cat.color)} />
                            <button
                                onClick={(e) => handleQuickAdd(e, cat.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-md transform hover:scale-110"
                                title="Add Article"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{cat.count} articles</p>

                        {selectedCategory === cat.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                        )}
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-12 gap-4 pt-4">
                {/* Popular / Recent */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Popular Resources'}
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsCreateOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-none w-9 h-9 p-0 flex items-center justify-center shadow-sm"
                                title="Create New Article"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center" />
                            <Button variant="ghost" size="sm" onClick={() => setViewMode('list')} className={cn("rounded-none", viewMode === 'list' && "bg-slate-100 dark:bg-slate-800")}>
                                <List className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setViewMode('graph')} className={cn("rounded-none", viewMode === 'graph' && "bg-slate-100 dark:bg-slate-800")}>
                                <Network className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className={cn(
                        "grid gap-4",
                        viewMode === 'list' ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                    )}>
                        {filteredArticles.map((article) => {
                            const Icon = typeIcons[article.type] || FileText
                            return (
                                <div
                                    key={article.id}
                                    onClick={() => { setSelectedArticle(article); setCurrentStep(1); }}
                                    className={cn(
                                        "group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer shadow-sm hover:shadow-md",
                                        viewMode === 'list' ? "flex items-start gap-4 p-4" : "p-4 flex flex-col h-full"
                                    )}
                                >
                                    <div className={cn(
                                        "flex-shrink-0 flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors",
                                        viewMode === 'list' ? "w-10 h-10 bg-slate-100 dark:bg-slate-800" : "w-12 h-12 bg-slate-100 dark:bg-slate-800 mb-4 rounded-sm"
                                    )}>
                                        <Icon className={cn("w-5 h-5", viewMode === 'graph' && "w-6 h-6")} />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className={cn("flex justify-between", viewMode === 'list' ? "items-center mb-1" : "flex-col gap-2 mb-3")}>
                                            <h3 className={cn("font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors", viewMode === 'graph' && "text-lg line-clamp-2")}>
                                                {article.title}
                                            </h3>

                                            {viewMode === 'list' ? (
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); alert(`Edit ${article.title}`); }}
                                                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors shadow-sm"
                                                        title="Edit Article"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(e, article.id)}
                                                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-sm transition-colors shadow-sm"
                                                        title="Delete Article"
                                                    >
                                                        <Trash className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 opacity-100 mt-2 border-t border-slate-100 dark:border-white/5 pt-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); alert(`Edit ${article.title}`); }}
                                                        className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                                                        title="Edit Article"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(e, article.id)}
                                                        className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-sm transition-colors shadow-sm flex items-center justify-center"
                                                        title="Delete Article"
                                                    >
                                                        <Trash className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className={cn("flex text-xs text-slate-500", viewMode === 'list' ? "items-center gap-4" : "flex-col gap-2")}>
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-none font-medium text-slate-700 dark:text-slate-300">{article.type}</span>
                                                {viewMode === 'list' && <span>Updated {formatRelativeTime(article.lastUpdated)}</span>}
                                            </div>
                                            {viewMode === 'graph' && <span>Updated {formatRelativeTime(article.lastUpdated)}</span>}
                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {filteredArticles.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <p>No articles found in this category.</p>
                                <Button variant="ghost" onClick={() => setIsCreateOpen(true)} className="mt-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50">Create one now</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Pinned & Upload */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Contribute</h3>
                            <p className="text-sm text-slate-400 mb-6">Share your expertise. Upload new SOPs or create a guide.</p>
                            <Button
                                variant="primary"
                                className="w-full rounded-none"
                                leftIcon={<Plus className="w-4 h-4" />}
                                onClick={() => setIsCreateOpen(true)}
                            >
                                Create New Article
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-[50px] pointer-events-none" />
                    </div>

                    <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Book className="w-4 h-4 text-slate-400" /> Handbooks
                        </h3>
                        <div className="space-y-3">
                            {['Employee Handbook 2026', 'Sales Playbook v2', 'Brand Guidelines'].map((item, i) => (
                                <button key={i} className="flex items-center justify-between w-full text-left text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 group py-1">
                                    <span>{item}</span>
                                    <Download className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Detail Modal */}
            <WizardModal
                isOpen={!!selectedArticle}
                onClose={() => setSelectedArticle(null)}
                title="Knowledge Base"
                subtitle={selectedArticle?.category}
                sidebarWidth="w-[300px]"
                currentStep={currentStep}
                onStepClick={(id) => setCurrentStep(Number(id))}
                steps={[
                    { id: 1, label: 'Content', description: 'Article Body' },
                    { id: 2, label: 'Attachments', description: 'Files & Media' },
                    { id: 3, label: 'Discussion', description: 'Comments & Q&A' }
                ]}
                contentTitle={
                    currentStep === 1 ? (selectedArticle?.title || 'Article') :
                        currentStep === 2 ? 'Attachments & Resources' :
                            'Community Discussion'
                }
                footer={
                    <div className="flex justify-between w-full">
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setSelectedArticle(null)}>Close</Button>
                        </div>
                        <div className="flex gap-2">
                            {currentStep === 2 && <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />}>Upload File</Button>}
                            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Download PDF</Button>
                            <Button variant="primary" leftIcon={<Eye className="w-4 h-4" />} onClick={() => alert('Marked as read')}>Mark as Read</Button>
                        </div>
                    </div>
                }
            >
                {selectedArticle && (
                    <div className="space-y-6 animate-fade-in pb-10">
                        {currentStep === 1 && (
                            <>
                                {/* Header Stats */}
                                <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-100 dark:border-white/5">
                                    <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-sm text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                                        <Clock className="w-4 h-4" /> Updated {formatRelativeTime(selectedArticle.lastUpdated)}
                                    </div>
                                    <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-sm text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                                        <Eye className="w-4 h-4" /> {selectedArticle.views} Views
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <p className="lead">
                                                This is a comprehensive guide on <strong>{selectedArticle.title}</strong>. It covers all the essential aspects you need to know to effectively manage this process.
                                            </p>
                                            <h4>Key Takeaways</h4>
                                            <ul>
                                                <li>Understand the core eligibility criteria.</li>
                                                <li>Gather all necessary documentation beforehand.</li>
                                                <li>Follow the step-by-step application process.</li>
                                            </ul>
                                            <p>
                                                Detailed instructions and policy guidelines are provided below. Please review specific sections relevant to your case.
                                            </p>
                                            <div className="bg-slate-100 dark:bg-slate-800 rounded-sm border-l-4 border-primary-500 my-4">
                                                <p className="m-0 font-medium italic">Note: Compliance with these guidelines is mandatory for all active partners and agents.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Info */}
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 rounded-sm">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><User className="w-3 h-3" /> Author</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                                                    SA
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">System Admin</p>
                                                    <p className="text-xs text-slate-500">Content Manager</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 rounded-sm">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Tag className="w-3 h-3" /> Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['Policy', 'Guide', '2026'].map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 rounded-sm">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-sm group hover:border-primary-500/50 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">Documentation_v{i}.pdf</h4>
                                            <p className="text-xs text-slate-500 mt-1">2.4 MB • Uploaded 2 days ago</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100"><Download className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-sm flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">QA</div>
                                    <div>
                                        <p className="text-sm text-slate-900 dark:text-white font-medium">Have a question?</p>
                                        <p className="text-xs text-slate-500 mt-1">Ask the author or community experts.</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">U{i}</div>
                                            <div className="flex-1 space-y-2">
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-sm border border-slate-100 dark:border-white/5">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-slate-900 dark:text-white">User {i}</span>
                                                        <span className="text-[10px] text-slate-400">2 hours ago</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300">Is this updated for the latest FY guidelines?</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </WizardModal>

            <CreateArticleModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSave={(article) => {
                    setArticles([article, ...articles])
                    setIsCreateOpen(false)
                }}
            />
        </div>
    )
}
