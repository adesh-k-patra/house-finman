/**
 * SurveysPage - Real Estate CFM Survey Management
 * 
 * Purpose: Main surveys list with sharp card design matching leads/loans
 * Features:
 * - Border-l-4 KPI cards
 * - Dark table headers
 * - Real estate specific survey types
 * - API Integration
 */

import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plus, Search, Filter, MoreVertical, FileText, Download, Upload,
  CheckCircle, MessageSquare, Sparkles, Home, CreditCard,
  MapPin, ClipboardCheck, Star, Target, Building2,
  Edit, Trash2, Copy, Pause, Play, X, Eye, Loader2, Clock, LayoutDashboard
} from 'lucide-react'
import { Button, Card, KPICard } from '@/components/ui'
import { cn } from '@/utils'
import { surveyService } from '@/services/surveyService'
import { Survey, SurveyStatus, SurveyType } from '@/types'
import { SurveyFilterDrawer } from './components/SurveyFilterDrawer'
import { SurveyAIChatDrawer } from './components/SurveyAIChatDrawer'

// ============ SURVEY TYPE CONFIG ============

const surveyTypeConfig: Record<SurveyType, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  buyer_intent: { label: 'Buyer Intent', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  loan_prequal: { label: 'Loan Pre-Qual', icon: CreditCard, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  property_match: { label: 'Property Match', icon: Building2, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  site_visit: { label: 'Site Visit', icon: MapPin, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  loan_experience: { label: 'Loan Experience', icon: ClipboardCheck, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  post_possession: { label: 'Post Possession', icon: Home, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  nps: { label: 'NPS', icon: Star, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  csat: { label: 'CSAT', icon: CheckCircle, color: 'text-teal-600', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  // Fallbacks for generic types
  ces: { label: 'CES', icon: Star, color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-900/30' },
  product_research: { label: 'Research', icon: Search, color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  onboarding: { label: 'Onboarding', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  churn: { label: 'Churn', icon: X, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  custom: { label: 'Custom', icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
}

// ============ MOCK DATA ============

const MOCK_SURVEYS: Survey[] = [
  {
    id: '1', title: 'Post-Disbursement Feedback', type: 'loan_experience', status: 'active',
    totalResponses: 1245, completionRate: 85, channel: ['WhatsApp'], questions: new Array(8).fill({}),
    campaign: { id: 'c1', name: 'Q1 Disbursement' }, createdAt: '2024-01-15', updatedAt: '2024-01-20',
    tenantId: 't1', createdById: 'u1', isAnonymous: false, allowMultiple: false
  },
  {
    id: '2', title: 'Buyer Intent - South Mumbai', type: 'buyer_intent', status: 'active',
    totalResponses: 3890, completionRate: 72, channel: ['Web', 'Email'], questions: new Array(12).fill({}),
    campaign: { id: 'c2', name: 'SoBo Luxury' }, createdAt: '2024-01-20', updatedAt: '2024-01-22',
    tenantId: 't1', createdById: 'u1', isAnonymous: false, allowMultiple: true
  },
  {
    id: '3', title: 'Site Visit Experience', type: 'site_visit', status: 'draft',
    totalResponses: 0, completionRate: 0, channel: ['Email'], questions: new Array(5).fill({}),
    campaign: { id: 'c3', name: 'Site Visit Follow-up' }, createdAt: '2024-02-01', updatedAt: '2024-02-01',
    tenantId: 't1', createdById: 'u1', isAnonymous: false, allowMultiple: false
  },
  {
    id: '4', title: 'Loan Pre-Qualification', type: 'loan_prequal', status: 'active',
    totalResponses: 850, completionRate: 65, channel: ['SMS', 'WhatsApp'], questions: new Array(15).fill({}),
    createdAt: '2024-01-10', updatedAt: '2024-01-12',
    tenantId: 't1', createdById: 'u1', isAnonymous: true, allowMultiple: false
  },
  {
    id: '5', title: 'NPS Survey Q4', type: 'nps', status: 'ended',
    totalResponses: 5600, completionRate: 92, channel: ['SMS'], questions: new Array(2).fill({}),
    createdAt: '2023-10-01', updatedAt: '2023-12-01',
    tenantId: 't1', createdById: 'u1', isAnonymous: false, allowMultiple: false
  },
  {
    id: '6', title: 'Property Preferences', type: 'property_match', status: 'paused',
    totalResponses: 420, completionRate: 55, channel: ['App'], questions: new Array(10).fill({}),
    createdAt: '2024-01-05', updatedAt: '2024-01-15',
    tenantId: 't1', createdById: 'u1', isAnonymous: false, allowMultiple: false
  },
  {
    id: '7', title: 'Churn Feedback', type: 'churn', status: 'active',
    totalResponses: 120, completionRate: 45, channel: ['Email'], questions: new Array(6).fill({}),
    createdAt: '2024-01-25', updatedAt: '2024-01-28',
    tenantId: 't1', createdById: 'u1', isAnonymous: true, allowMultiple: false
  },
  {
    id: '8', title: 'New Project Launch Intent', type: 'buyer_intent', status: 'draft',
    totalResponses: 0, completionRate: 0, channel: ['WhatsApp'], questions: new Array(8).fill({}),
    createdAt: '2024-02-02', updatedAt: '2024-02-02',
    tenantId: 't1', createdById: 'u1', isAnonymous: false, allowMultiple: false
  },
  {
    id: '9', title: 'Agent CSAT Feedback', type: 'csat', status: 'active',
    totalResponses: 2100, completionRate: 88, channel: ['SMS'], questions: new Array(3).fill({}),
    createdAt: '2024-01-18', updatedAt: '2024-01-19',
    tenantId: 't1', createdById: 'u1', isAnonymous: true, allowMultiple: false
  },
  {
    id: '10', title: 'Documents Upload Helper', type: 'onboarding', status: 'active',
    totalResponses: 340, completionRate: 60, channel: ['Web'], questions: new Array(4).fill({}),
    createdAt: '2024-01-22', updatedAt: '2024-01-25',
    tenantId: 't1', createdById: 'u1', isAnonymous: false, allowMultiple: false
  }
]

// ============ MAIN COMPONENT ============

export function SurveysPage() {
  const navigate = useNavigate()
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = (searchParams.get('status') as SurveyStatus | 'all') || 'all'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([])
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Data State
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch Data
  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    setIsLoading(true)
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800))
      setSurveys(MOCK_SURVEYS as any)
    } catch (err) {
      setError('An error occurred while fetching surveys')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter(survey => {
      const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab = currentTab === 'all' || survey.status === currentTab
      return matchesSearch && matchesTab
    })
  }, [surveys, searchQuery, currentTab])

  // Stats (Calculated from real data)
  const stats = useMemo(() => {
    const active = surveys.filter(s => s.status === 'active').length
    const totalResponses = surveys.reduce((sum, s) => sum + (s.totalResponses || 0), 0)
    const surveysWithResponses = surveys.filter(s => (s.totalResponses || 0) > 0)
    const avgCompletion = surveysWithResponses.length > 0
      ? Math.round(surveysWithResponses.reduce((sum, s) => sum + (s.completionRate || 0), 0) / surveysWithResponses.length)
      : 0

    // Derived dummy logic for complex stats not yet in backend
    const highIntentLeads = Math.round(totalResponses * 0.15)
    const prequalifiedLeads = Math.round(totalResponses * 0.12)
    const pending = surveys.filter(s => s.status === 'draft').length // Draft as pending launch
    const siteVisits = surveys.filter(s => s.type === 'site_visit').reduce((sum, s) => sum + Math.round((s.totalResponses || 0) * 0.15), 0)
    const loanApps = surveys.filter(s => s.type === 'loan_prequal').reduce((sum, s) => sum + Math.round((s.totalResponses || 0) * 0.22), 0)

    return { active, totalResponses, avgCompletion, highIntentLeads, prequalifiedLeads, pending, siteVisits, loanApps }
  }, [surveys])

  const handleTabChange = (tab: string) => {
    setSearchParams(tab === 'all' ? {} : { status: tab })
  }

  const toggleSelectAll = () => {
    if (selectedSurveys.length === filteredSurveys.length) {
      setSelectedSurveys([])
    } else {
      setSelectedSurveys(filteredSurveys.map(s => s.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedSurveys(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      await surveyService.deleteSurvey(id)
      setSurveys(prev => prev.filter(s => s.id !== id))
    }
  }

  const handleDuplicate = async (id: string) => {
    const survey = surveys.find(s => s.id === id)
    if (survey) {
      const newSurvey = { ...survey, id: `${Date.now()}`, title: `${survey.title} (Copy)`, status: 'draft' as SurveyStatus, totalResponses: 0 }
      setSurveys(prev => [newSurvey, ...prev])
      setShowActionMenu(null)
    }
  }

  const handleStatusChange = async (id: string, newStatus: SurveyStatus) => {
    setSurveys(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    setShowActionMenu(null)
  }

  const handleEdit = (_id: string) => {
    navigate('/surveys/create') // In real app, parameterize this
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header */}
      {/* Header Section - Premium List Style matching Detail Page */}
      <div className="mx-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group rounded-lg">
        {/* Top decorative bar - using a neutral or brand color since it's a list */}
        <div className="h-1 w-full bg-primary-500" />

        <div className="p-4">
          {/* Top Row: Meta info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <LayoutDashboard className="w-4 h-4" />
              <span>Survey Management</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> {surveys.length} Surveys
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" /> {stats.totalResponses.toLocaleString()} Responses
              </span>
            </div>
          </div>

          {/* Main Content Row: Title & Actions */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            {/* Title & Description */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  All Surveys
                </h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-4">
                Capture feedback from home buyers, loan applicants & property owners
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 self-start xl:self-end shadow-sm">
              <Button variant="outline" size="sm" className="h-9 gap-2 rounded-none border-slate-300 bg-white hover:bg-slate-50 font-bold shadow-sm">
                <Download className="w-4 h-4" /> Export
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2 rounded-none border-slate-300 bg-white hover:bg-slate-50 font-bold shadow-sm">
                <Upload className="w-4 h-4" /> Import
              </Button>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
              <Button variant="outline" size="sm" className="h-9 gap-2 rounded-none border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/20 font-bold shadow-sm" onClick={() => setIsAIInsightsOpen(true)}>
                <Sparkles className="w-4 h-4" /> AI Insights
              </Button>
              <Button size="sm" className="h-9 gap-2 rounded-none font-bold shadow-sm bg-primary-600 hover:bg-primary-700 text-white" onClick={() => navigate('/surveys/create')}>
                <Plus className="w-4 h-4" /> Create Survey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        <KPICard
          title="Active Surveys"
          value={stats.active}
          icon={<FileText />}
          trend={{ value: "+2 this week", direction: "up" }}
          variant="blue"
        />
        <KPICard
          title="Total Responses"
          value={`${(stats.totalResponses / 1000).toFixed(1)}k`}
          icon={<MessageSquare />}
          trend={{ value: "+15% MTD", direction: "up" }}
          variant="purple"
        />
        <KPICard
          title="High-Intent Leads"
          value={stats.highIntentLeads.toLocaleString()}
          icon={<Target />}
          trend={{ value: "from surveys", direction: "neutral" }}
          variant="emerald"
        />
        <KPICard
          title="Pre-Qualified Loans"
          value={stats.prequalifiedLeads.toLocaleString()}
          icon={<CreditCard />}
          trend={{ value: "eligible", direction: "neutral" }}
          variant="orange"
        />
        <KPICard
          title="Avg Completion"
          value={`${stats.avgCompletion}%`}
          icon={<Star />}
          variant="royal"
        />
        <KPICard
          title="Site Visits Booked"
          value={stats.siteVisits}
          icon={<MapPin />}
          variant="magenta"
        />
        <KPICard
          title="Loan Applications"
          value={stats.loanApps}
          icon={<Building2 />}
          variant="violet"
        />
        <KPICard
          title="Pending Launch"
          value={stats.pending}
          icon={<Clock />}
          variant="slate"
        />
      </div>



      {/* Main Content */}
      <div className="space-y-4">
        {/* Tab Bar & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center border-b border-slate-200 dark:border-slate-700 pb-1 gap-4 px-4">
          <nav className="flex space-x-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Surveys', color: 'blue' },
              { id: 'active', label: 'Active', color: 'emerald' },
              { id: 'draft', label: 'Drafts', color: 'purple' },
              { id: 'ended', label: 'Ended', color: 'slate' },
              { id: 'paused', label: 'Paused', color: 'amber' },
            ].map(tab => {
              const isActive = currentTab === tab.id
              const count = tab.id === 'all' ? surveys.length : surveys.filter(s => s.status === tab.id).length
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm transition-all",
                    isActive
                      ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400`
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "ml-2 py-0.5 px-2 rounded-full text-[10px]",
                    isActive ? `bg-${tab.color}-100 text-${tab.color}-600 dark:bg-${tab.color}-900/30` : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                  )}>
                    {count}
                  </span>
                </button>
              )
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <Button
              variant={showFilters ? "primary" : "ghost"}
              size="sm"
              className="rounded-none gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>
        {/* Survey Filter Drawer */}
        <SurveyFilterDrawer
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={(filters) => console.log('Filters applied', filters)}
          currentFilters={{}}
        />

        {/* Bulk Actions Bar */}
        {selectedSurveys.length > 0 && (
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between animate-fade-in shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold pl-2">{selectedSurveys.length} surveys selected</span>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8 gap-2 rounded-none" onClick={() => alert('Duplicating selected...')}>
                  <Copy className="w-4 h-4" /> Duplicate
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8 gap-2 rounded-none" onClick={() => alert('Pausing selected...')}>
                  <Pause className="w-4 h-4" /> Pause
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8 gap-2 rounded-none" onClick={() => alert('Exporting selected...')}>
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-red-300 hover:text-red-100 hover:bg-red-900/30 h-8 gap-2 rounded-none" onClick={() => { if (confirm('Delete selected?')) setSelectedSurveys([]) }}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        )}



        {/* Table */}
        <Card padding="none" className="p-0 overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 rounded-none">
          {filteredSurveys.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No surveys found</p>
              <Button variant="ghost" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-0 h-auto font-normal underline" onClick={() => navigate('/surveys/create')}>Create one now</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 dark:bg-slate-950 text-white">
                  <tr>
                    <th className="w-12 px-4 py-4 text-center border-b border-white/10">
                      <input
                        type="checkbox"
                        className="rounded-none border-slate-500 bg-slate-800"
                        checked={selectedSurveys.length === filteredSurveys.length && filteredSurveys.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Survey Name</th>
                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Type</th>
                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Status</th>
                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Responses</th>
                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Completion</th>
                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 border-r border-white/10">Channels</th>
                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredSurveys.map(survey => {
                    const typeConfig = surveyTypeConfig[survey.type as SurveyType] || surveyTypeConfig['custom']
                    const TypeIcon = typeConfig.icon
                    const isSelected = selectedSurveys.includes(survey.id)

                    return (
                      <tr
                        key={survey.id}
                        className={cn(
                          "group transition-all cursor-pointer",
                          isSelected ? "bg-primary-50 dark:bg-primary-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                        onClick={() => navigate(`/surveys/${survey.id}`)}
                      >
                        <td className="w-12 px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="rounded-none border-slate-300"
                            checked={isSelected}
                            onChange={() => toggleSelect(survey.id)}
                          />
                        </td>
                        <td className="px-4 py-4 border-r border-slate-100 dark:border-white/5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                              {survey.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400">{survey.questions?.length || 0} questions</span>
                              {survey.campaign && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-[10px] text-slate-400">{survey.campaign.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 border-r border-slate-100 dark:border-white/5">
                          <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-none text-xs font-bold", typeConfig.bgColor, typeConfig.color)}>
                            <TypeIcon className="w-3 h-3" />
                            {typeConfig.label}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                          <span className={cn(
                            "px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-none",
                            survey.status === 'active' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20" :
                              survey.status === 'paused' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20" :
                                survey.status === 'ended' ? "bg-slate-100 text-slate-700 dark:bg-slate-700" :
                                  "bg-purple-100 text-purple-700 dark:bg-purple-500/20"
                          )}>
                            {survey.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                          <span className="font-bold text-slate-900 dark:text-white">{(survey.totalResponses || 0).toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  (survey.completionRate || 0) >= 80 ? "bg-emerald-500" :
                                    (survey.completionRate || 0) >= 60 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ width: `${survey.completionRate || 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{survey.completionRate || 0}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-white/5">
                          <div className="flex items-center justify-center gap-1">
                            {survey.channel.map(c => (
                              <span key={c} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] uppercase font-bold text-slate-500 rounded-none">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center relative" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-none text-slate-400 hover:text-primary-600"
                              onClick={() => navigate(`/surveys/${survey.id}`)}
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-none text-slate-400 hover:text-slate-600"
                              onClick={() => setShowActionMenu(showActionMenu === survey.id ? null : survey.id)}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Action Menu */}
                          {showActionMenu === survey.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                              <div className="absolute right-4 top-12 w-40 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1 rounded-none animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  onClick={() => handleEdit(survey.id)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button
                                  onClick={() => handleDuplicate(survey.id)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  <Copy className="w-4 h-4" /> Duplicate
                                </button>
                                <button
                                  onClick={() => handleStatusChange(survey.id, survey.status === 'active' ? 'paused' : 'active')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  {survey.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                  {survey.status === 'active' ? 'Pause' : 'Resume'}
                                </button>
                                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                                <button
                                  onClick={() => handleDelete(survey.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div >

      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 text-red-600 px-4 py-3 rounded shadow-lg border border-red-200 animate-slide-up z-50">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      <SurveyAIChatDrawer
        isOpen={isAIInsightsOpen}
        onClose={() => setIsAIInsightsOpen(false)}
      />
    </div>
  )
}
