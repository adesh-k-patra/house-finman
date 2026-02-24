/**
 * CreateSurveyWizard - 4-Step Wizard for Creating Real Estate Surveys
 * 
 * Steps:
 * 1. Survey Type Selection (6 real estate types)
 * 2. Template Selection with previews
 * 3. Survey Customization (questions, logic)
 * 4. Distribution Settings (channels, schedule)
 */

import { useState } from 'react'
import {
    Target, CreditCard, Building2, MapPin, ClipboardCheck, Home,
    Star, FileText, ArrowRight, ArrowLeft, X, Check, Sparkles,
    Globe, Mail, Smartphone, MessageCircle, Calendar, Clock,
    Users, ChevronRight, Eye, Plus
} from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { cn } from '@/utils'

interface CreateSurveyWizardProps {
    isOpen: boolean
    onClose: () => void
}

type SurveyType = 'buyer_intent' | 'loan_prequal' | 'property_match' | 'site_visit' | 'loan_experience' | 'post_possession'

interface Template {
    id: string
    name: string
    description: string
    questions: number
    avgTime: string
    tags: string[]
    popular?: boolean
    recommended?: boolean
}

// ============ STEPS ============

const STEPS: WizardStep[] = [
    { id: 1, label: 'Survey Type', description: 'Select survey category' },
    { id: 2, label: 'Template', description: 'Choose a template' },
    { id: 3, label: 'Customize', description: 'Add questions' },
    { id: 4, label: 'Distribution', description: 'Set channels & schedule' },
]

// ============ SURVEY TYPES ============

const surveyTypes = [
    { id: 'buyer_intent', label: 'Buyer Intent', icon: Target, color: 'bg-blue-600', description: 'Identify high-intent home buyers and their preferences', questions: '8-12' },
    { id: 'loan_prequal', label: 'Loan Pre-Qualification', icon: CreditCard, color: 'bg-emerald-600', description: 'Pre-qualify buyers for home loan eligibility before bank contact', questions: '10-15' },
    { id: 'property_match', label: 'Property Discovery', icon: Building2, color: 'bg-purple-600', description: 'Match buyers with right flats, villas, or projects', questions: '8-12' },
    { id: 'site_visit', label: 'Site Visit Feedback', icon: MapPin, color: 'bg-orange-600', description: 'Capture feedback after property site visits', questions: '6-10' },
    { id: 'loan_experience', label: 'Loan Experience', icon: ClipboardCheck, color: 'bg-indigo-600', description: 'Track home loan application and processing experience', questions: '8-12' },
    { id: 'post_possession', label: 'Post-Possession', icon: Home, color: 'bg-pink-600', description: 'Capture post-handover experience and quality feedback', questions: '10-15' },
]

// ============ TEMPLATES BY TYPE ============

const templates: Record<SurveyType, Template[]> = {
    buyer_intent: [
        { id: 'bi1', name: 'Quick Buyer Intent', description: 'Fast 5-question survey to gauge buying readiness', questions: 5, avgTime: '2 min', tags: ['Quick', 'Essential'], recommended: true },
        { id: 'bi2', name: 'Detailed Buyer Profile', description: 'Comprehensive survey with budget, location, and timeline', questions: 12, avgTime: '5 min', tags: ['Complete'], popular: true },
        { id: 'bi3', name: 'Luxury Buyer Survey', description: 'Specialized for high-net-worth buyers (₹1Cr+)', questions: 10, avgTime: '4 min', tags: ['Premium'] },
        { id: 'bi4', name: 'First-Time Buyer Survey', description: 'Tailored questions for first-time home buyers', questions: 8, avgTime: '3 min', tags: ['Beginner'] },
    ],
    loan_prequal: [
        { id: 'lp1', name: 'Basic Eligibility Check', description: 'Quick income and credit check', questions: 6, avgTime: '2 min', tags: ['Quick'], recommended: true },
        { id: 'lp2', name: 'Full Financial Assessment', description: 'Detailed income, EMI, and credit evaluation', questions: 15, avgTime: '6 min', tags: ['Complete'], popular: true },
        { id: 'lp3', name: 'Self-Employed Assessment', description: 'For business owners and freelancers', questions: 12, avgTime: '5 min', tags: ['Business'] },
        { id: 'lp4', name: 'Salaried Pre-Qualification', description: 'Streamlined for salaried employees', questions: 8, avgTime: '3 min', tags: ['Salaried'] },
    ],
    property_match: [
        { id: 'pm1', name: 'Quick Property Matcher', description: 'BHK, budget, and location preferences', questions: 6, avgTime: '2 min', tags: ['Quick'], recommended: true },
        { id: 'pm2', name: 'Detailed Requirements', description: 'Includes amenities, floor, and builder preference', questions: 12, avgTime: '5 min', tags: ['Complete'], popular: true },
        { id: 'pm3', name: 'Investment Property', description: 'For buyers looking at rental yield and ROI', questions: 8, avgTime: '3 min', tags: ['Investment'] },
    ],
    site_visit: [
        { id: 'sv1', name: 'Quick Visit Feedback', description: 'Rate project, sales team, and overall experience', questions: 5, avgTime: '2 min', tags: ['Quick'], recommended: true },
        { id: 'sv2', name: 'Detailed Visit Assessment', description: 'Comprehensive feedback on all aspects', questions: 10, avgTime: '4 min', tags: ['Complete'], popular: true },
        { id: 'sv3', name: 'Sales Team Rating', description: 'Focus on sales executive performance', questions: 6, avgTime: '2 min', tags: ['Agent'] },
    ],
    loan_experience: [
        { id: 'le1', name: 'NPS + Quick Feedback', description: 'Simple NPS with 3 follow-up questions', questions: 4, avgTime: '1 min', tags: ['Quick'], recommended: true },
        { id: 'le2', name: 'Full Process Evaluation', description: 'Rate documentation, processing, and support', questions: 10, avgTime: '4 min', tags: ['Complete'], popular: true },
        { id: 'le3', name: 'Bank Comparison', description: 'Compare loan experience across banks', questions: 8, avgTime: '3 min', tags: ['Compare'] },
    ],
    post_possession: [
        { id: 'pp1', name: 'Handover Satisfaction', description: 'Rate handover process and initial quality', questions: 6, avgTime: '2 min', tags: ['Quick'], recommended: true },
        { id: 'pp2', name: 'Complete Quality Audit', description: 'Detailed construction and finish quality check', questions: 15, avgTime: '6 min', tags: ['Complete'], popular: true },
        { id: 'pp3', name: 'Defect Reporting', description: 'Document and report construction defects', questions: 8, avgTime: '3 min', tags: ['Issues'] },
    ],
}

// ============ MAIN COMPONENT ============

export function CreateSurveyWizard({ isOpen, onClose }: CreateSurveyWizardProps) {
    const [step, setStep] = useState(1)
    const [selectedType, setSelectedType] = useState<SurveyType | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [surveyName, setSurveyName] = useState('')
    const [surveyDescription, setSurveyDescription] = useState('')
    const [channels, setChannels] = useState<string[]>(['web'])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const handleClose = () => {
        setStep(1)
        setSelectedType(null)
        setSelectedTemplate(null)
        setSurveyName('')
        setSurveyDescription('')
        setChannels(['web'])
        setStartDate('')
        setEndDate('')
        onClose()
    }

    const handleTypeSelect = (type: SurveyType) => {
        setSelectedType(type)
        setStep(2)
    }

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId)
        setStep(3)
    }

    const handleCreate = () => {
        // TODO: Create survey logic
        console.log('Creating survey:', { selectedType, selectedTemplate, surveyName, surveyDescription, channels, startDate, endDate })
        handleClose()
    }

    const toggleChannel = (channel: string) => {
        setChannels(prev =>
            prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
        )
    }

    // ============ STEP 1: TYPE SELECTION ============
    const renderTypeSelection = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700">
            {surveyTypes.map(type => {
                const Icon = type.icon
                return (
                    <button
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id as SurveyType)}
                        className="flex items-start gap-4 p-6 text-left transition-all group bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <div className={cn("p-3 rounded-none text-white shadow-lg transition-transform group-hover:scale-110", type.color)}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm uppercase tracking-wide text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                {type.label}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                            <span className="inline-block mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {type.questions} questions typical
                            </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors self-center" />
                    </button>
                )
            })}
        </div>
    )

    // ============ STEP 2: TEMPLATE SELECTION ============
    const renderTemplateSelection = () => {
        if (!selectedType) return null
        const typeTemplates = templates[selectedType]
        const typeConfig = surveyTypes.find(t => t.id === selectedType)

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => setStep(1)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-slate-500">
                        {typeConfig?.label} Templates
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {typeTemplates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className={cn(
                                "p-4 text-left border transition-all group rounded-none",
                                selectedTemplate === template.id
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                            {template.name}
                                        </h3>
                                        {template.recommended && (
                                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] uppercase font-bold rounded-none dark:bg-emerald-900/30 dark:text-emerald-400">
                                                Recommended
                                            </span>
                                        )}
                                        {template.popular && (
                                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] uppercase font-bold rounded-none dark:bg-purple-900/30 dark:text-purple-400">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] text-slate-400">
                                            {template.questions} questions
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            ~{template.avgTime}
                                        </span>
                                        <div className="flex gap-1">
                                            {template.tags.map(tag => (
                                                <span key={tag} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] uppercase font-bold rounded-none">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 self-center" />
                            </div>
                        </button>
                    ))}
                </div>

                <button className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 transition-colors rounded-none text-center group">
                    <div className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
                        <span className="text-sm font-medium text-slate-500 group-hover:text-primary-600">
                            Start from Scratch
                        </span>
                    </div>
                </button>
            </div>
        )
    }

    // ============ STEP 3: CUSTOMIZATION ============
    const renderCustomization = () => {
        const template = selectedType ? templates[selectedType].find(t => t.id === selectedTemplate) : null

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-600">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-slate-500">Based on: {template?.name}</span>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Survey Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter survey name"
                        value={surveyName}
                        onChange={(e) => setSurveyName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 placeholder:text-slate-400 font-medium"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Brief description of the survey purpose"
                        value={surveyDescription}
                        onChange={(e) => setSurveyDescription(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 resize-none placeholder:text-slate-400 font-medium"
                    />
                </div>

                {/* Questions Preview */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Questions ({template?.questions})
                        </label>
                        <Button variant="ghost" size="sm" className="rounded-none text-xs">
                            <Plus className="w-4 h-4 mr-1" /> Add Question
                        </Button>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-none overflow-hidden">
                        {[
                            { q: 'What is your expected budget for the property?', type: 'Range' },
                            { q: 'When are you planning to buy?', type: 'MCQ' },
                            { q: 'Preferred property type?', type: 'MCQ' },
                            { q: 'Which location(s) are you interested in?', type: 'Multi-Select' },
                            { q: 'Is this for self-use or investment?', type: 'MCQ' },
                        ].slice(0, Math.min(5, template?.questions || 5)).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 bg-white dark:bg-slate-900">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-mono w-5">{i + 1}</span>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.q}</span>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-bold">
                                    {item.type}
                                </span>
                            </div>
                        ))}
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center">
                            <button className="text-xs text-primary-600 font-medium hover:underline">
                                View all {template?.questions} questions →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ============ STEP 4: DISTRIBUTION ============
    const renderDistribution = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep(3)} className="text-slate-400 hover:text-slate-600">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-500">Set distribution settings</span>
            </div>

            {/* Channels */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Distribution Channels
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { id: 'web', label: 'Web Link', icon: Globe },
                        { id: 'email', label: 'Email', icon: Mail },
                        { id: 'sms', label: 'SMS', icon: Smartphone },
                        { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                    ].map(channel => {
                        const Icon = channel.icon
                        const isSelected = channels.includes(channel.id)
                        return (
                            <button
                                key={channel.id}
                                onClick={() => toggleChannel(channel.id)}
                                className={cn(
                                    "p-4 border rounded-none transition-all flex flex-col items-center gap-2",
                                    isSelected
                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isSelected ? "text-primary-600" : "text-slate-400")} />
                                <span className={cn("text-xs font-bold uppercase tracking-wider", isSelected ? "text-primary-600" : "text-slate-500")}>
                                    {channel.label}
                                </span>
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <Check className="w-4 h-4 text-primary-500" />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Calendar className="w-3 h-3 inline mr-1" /> Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Calendar className="w-3 h-3 inline mr-1" /> End Date (Optional)
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                    />
                </div>
            </div>

            {/* Target Audience */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Users className="w-3 h-3 inline mr-1" /> Target Audience
                </label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium">
                    <option>All Leads</option>
                    <option>New Leads (Last 30 days)</option>
                    <option>Active Loan Applicants</option>
                    <option>Post-Disbursement Customers</option>
                    <option>Site Visit Completers</option>
                    <option>High-Intent Buyers</option>
                    <option>Custom Segment...</option>
                </select>
            </div>

            {/* AI Follow-up Toggle */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-none">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Automated Follow-ups</h4>
                            <p className="text-xs text-slate-500">Automatically follow up with non-responders</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                </div>
            </div>
        </div>
    )

    // ============ RENDER ============
    const getStepContent = () => {
        switch (step) {
            case 1: return renderTypeSelection()
            case 2: return renderTemplateSelection()
            case 3: return renderCustomization()
            case 4: return renderDistribution()
            default: return null
        }
    }

    const getContentTitle = () => {
        switch (step) {
            case 1: return 'What type of survey do you want to create?'
            case 2: return 'Choose a template to start with'
            case 3: return 'Customize your survey'
            case 4: return 'Set distribution settings'
            default: return ''
        }
    }

    const canProceed = () => {
        switch (step) {
            case 1: return !!selectedType
            case 2: return !!selectedTemplate
            case 3: return !!surveyName.trim()
            case 4: return channels.length > 0
            default: return false
        }
    }

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create Survey"
            subtitle="Real Estate CFM"
            steps={STEPS}
            currentStep={step}
            contentTitle={getContentTitle()}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                step > 1 && (
                    <>
                        <Button variant="secondary" className="rounded-none mr-2" onClick={() => setStep(step - 1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        {step < 4 ? (
                            <Button
                                variant="primary"
                                className="rounded-none"
                                onClick={() => setStep(step + 1)}
                                disabled={!canProceed()}
                            >
                                Continue <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button variant="primary" className="rounded-none" onClick={handleCreate}>
                                <Check className="w-4 h-4 mr-2" /> Create Survey
                            </Button>
                        )}
                    </>
                )
            }
        >
            {getStepContent()}
        </WizardModal>
    )
}
