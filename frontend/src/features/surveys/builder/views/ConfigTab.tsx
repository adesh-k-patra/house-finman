import { useState } from 'react'
import { useSurveyBuilder } from '../contexts/SurveyBuilderContext'
import { cn } from '@/utils'
import {
    Smartphone, Monitor, MessageSquare, Mail, Bell, QrCode,
    Calendar, Clock, Target, Sparkles, Clipboard, Users,
    Building, CreditCard, MapPin, Star, FileText, Home,
    Zap
} from 'lucide-react'

// ============ KPI SUMMARY ============

function KPISummary() {
    const { settings, questions } = useSurveyBuilder()

    const kpis = [
        { label: 'Status', value: settings.status.toUpperCase(), color: 'from-slate-500 to-slate-600' },
        { label: 'Channels', value: settings.mediums.length.toString(), color: 'from-blue-500 to-blue-600' },
        { label: 'Questions', value: questions.length.toString(), color: 'from-purple-500 to-purple-600' },
        { label: 'Est. Time', value: `${Math.ceil(questions.length * 0.5)} min`, color: 'from-emerald-500 to-emerald-600' }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {kpis.map((kpi) => (
                <div
                    key={kpi.label}
                    className="bg-white border border-slate-200 rounded-none p-4 shadow-sm"
                >
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                    <p className={cn("text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent", kpi.color)}>
                        {kpi.value}
                    </p>
                </div>
            ))}
        </div>
    )
}

// ============ SECTION CARD ============

interface SectionCardProps {
    title: string
    icon: React.ElementType
    children: React.ReactNode
    className?: string
}

function SectionCard({ title, icon: Icon, children, className }: SectionCardProps) {
    return (
        <div className={cn("bg-white border border-slate-200 rounded-none shadow-sm", className)}>
            <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    {title}
                </h3>
            </div>
            <div className="p-5">
                {children}
            </div>
        </div>
    )
}

// ============ DISTRIBUTION CHANNELS ============

function DistributionChannels() {
    const { settings, updateSettings } = useSurveyBuilder()

    const CHANNELS = [
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'sms', label: 'SMS', icon: MessageSquare },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
        { id: 'qr', label: 'QR Code', icon: QrCode },
        { id: 'web', label: 'Web Link', icon: Monitor },
        { id: 'mobile', label: 'Mobile App', icon: Smartphone },
        { id: 'push', label: 'Push Notification', icon: Bell }
    ]

    const toggleChannel = (channelId: string) => {
        const currentMediums = settings.mediums || []
        // @ts-ignore
        const newMediums = currentMediums.some((m: any) => m.type === channelId)
            // @ts-ignore
            ? currentMediums.filter((m: any) => m.type !== channelId)
            : [...currentMediums, { type: channelId, enabled: true }]
        // @ts-ignore
        updateSettings({ mediums: newMediums })
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800">
            {CHANNELS.map((channel: any, index: number) => {
                const isSelected = (settings.mediums || []).some((m: any) => m.type === channel.id && m.enabled)
                const Icon = channel.icon

                return (
                    <div
                        key={channel.id}
                        className={cn(
                            "flex items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                            index !== CHANNELS.length - 1 && "border-b border-slate-100 dark:border-slate-800"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                isSelected ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{channel.label}</h4>
                                <p className="text-xs text-slate-500">
                                    {isSelected ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            onClick={() => toggleChannel(channel.id)}
                            className={cn(
                                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500",
                                isSelected ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out",
                                    isSelected ? "translate-x-5" : "translate-x-0"
                                )}
                            />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

// ============ SCHEDULE SECTION ============

function ScheduleSection() {
    const { settings, updateSettings } = useSurveyBuilder()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1.5" />
                    Start Date & Time
                </label>
                <input
                    type="datetime-local"
                    value={settings.startDate || ''}
                    onChange={(e) => updateSettings({ startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1.5" />
                    End Date & Time
                </label>
                <input
                    type="datetime-local"
                    value={settings.endDate || ''}
                    onChange={(e) => updateSettings({ endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
                <select
                    value={settings.recurring}
                    onChange={(e) => updateSettings({ recurring: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="once">One-time Survey</option>
                    <option value="daily">Daily (Recurring)</option>
                    <option value="weekly">Weekly (Recurring)</option>
                    <option value="monthly">Monthly (Recurring)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                <select
                    value={settings.timezone}
                    onChange={(e) => updateSettings({ timezone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                </select>
            </div>
        </div>
    )
}

// ============ RESPONSE TARGETS ============

function ResponseTargets() {
    const { settings, updateSettings } = useSurveyBuilder()
    const currentResponses = 127 // Dummy data
    const progress = Math.min((currentResponses / settings.targetResponses) * 100, 100)

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Target Responses</label>
                    <input
                        type="number"
                        value={settings.targetResponses}
                        onChange={(e) => updateSettings({ targetResponses: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={1}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current</label>
                    <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-none text-sm font-bold text-emerald-700">
                        {currentResponses} responses
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-none overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-none transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

// ============ CREATION MODE (Redesigned with Toggles) ============

function CreationMode() {
    const { settings, updateSettings, setAiPanelOpen } = useSurveyBuilder()

    return (
        <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-none bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900">AI Survey Builder</h4>
                    <p className="text-xs text-slate-500">Enable AI assistance for question generation</p>
                </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.creationMode === 'ai'}
                    onChange={(e) => {
                        const newMode = e.target.checked ? 'ai' : 'manual'
                        updateSettings({ creationMode: newMode })
                        setAiPanelOpen(newMode === 'ai')
                    }}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    )
}

// ============ TEMPLATE GALLERY ============

const TEMPLATES = [
    { id: '1', name: 'Buyer Intent', icon: Home, tag: 'Popular', color: 'blue', description: 'Capture purchase intent & timeline' },
    { id: '2', name: 'Loan Prequal', icon: CreditCard, tag: 'Finance', color: 'green', description: 'Pre-qualify loan applicants' },
    { id: '3', name: 'Flat Discovery', icon: Building, tag: 'Property', color: 'purple', description: 'Match buyers to properties' },
    { id: '4', name: 'Site Visit Feedback', icon: MapPin, tag: 'Experience', color: 'orange', description: 'Collect site visit ratings' },
    { id: '5', name: 'Loan Experience', icon: FileText, tag: 'Finance', color: 'teal', description: 'Post-loan satisfaction survey' },
    { id: '6', name: 'Post-Purchase', icon: Star, tag: 'Experience', color: 'pink', description: 'New homeowner feedback' },
    { id: '7', name: 'Villa Interest', icon: Home, tag: 'Luxury', color: 'amber', description: 'Premium property intent' },
    { id: '8', name: 'BHK Preference', icon: Building, tag: 'Property', color: 'cyan', description: 'Configuration discovery' },
    { id: '9', name: 'PMAY Eligibility', icon: Users, tag: 'Subsidy', color: 'emerald', description: 'Govt scheme qualification' }
]

const TAG_COLORS: Record<string, string> = {
    'Popular': 'bg-blue-100 text-blue-700',
    'Finance': 'bg-green-100 text-green-700',
    'Property': 'bg-purple-100 text-purple-700',
    'Experience': 'bg-orange-100 text-orange-700',
    'Luxury': 'bg-amber-100 text-amber-700',
    'Subsidy': 'bg-emerald-100 text-emerald-700'
}

function TemplateGallery() {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => {
                const Icon = template.icon
                const isSelected = selectedTemplate === template.id

                return (
                    <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={cn(
                            "text-left p-4 rounded-none border-2 transition-all group",
                            isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                        )}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={cn(
                                "w-10 h-10 rounded-none flex items-center justify-center",
                                isSelected ? "bg-blue-500" : "bg-slate-100 group-hover:bg-slate-200"
                            )}>
                                <Icon className={cn("w-5 h-5", isSelected ? "text-white" : "text-slate-600")} />
                            </div>
                            <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-none", TAG_COLORS[template.tag])}>
                                {template.tag}
                            </span>
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-1">{template.name}</h4>
                        <p className="text-xs text-slate-500">{template.description}</p>
                        {isSelected && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                                <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    Click to use template
                                </span>
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

// ============ IDENTITY SECTION ============

function IdentitySection() {
    const { settings, updateSettings } = useSurveyBuilder()
    const [tags, setTags] = useState<string[]>(settings.industryTags || [])

    const availableTags = ['housing', 'real-estate', 'loans', 'finance', 'luxury', 'affordable', 'ready-to-move', 'under-construction']

    const toggleTag = (tag: string) => {
        const newTags = tags.includes(tag)
            ? tags.filter((t: string) => t !== tag)
            : [...tags, tag]
        setTags(newTags)
        updateSettings({ industryTags: newTags })
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Survey Name</label>
                <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => updateSettings({ name: e.target.value })}
                    placeholder="Enter survey name..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                    value={settings.description}
                    onChange={(e) => updateSettings({ description: e.target.value })}
                    placeholder="Describe the purpose of this survey..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Industry Tags</label>
                <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-none border transition-all",
                                tags.includes(tag)
                                    ? "bg-blue-100 text-blue-700 border-blue-300"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                            )}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ============ MAIN TAB ============

export function ConfigTab() {
    return (
        <div className="p-0 space-y-0">
            {/* KPI Summary */}
            <KPISummary />

            {/* Identity */}
            <SectionCard title="Survey Identity" icon={FileText}>
                <IdentitySection />
            </SectionCard>

            {/* Distribution Channels */}
            <SectionCard title="Distribution Channels" icon={Smartphone}>
                <DistributionChannels />
            </SectionCard>

            {/* Schedule */}
            <SectionCard title="Schedule & Timing" icon={Calendar}>
                <ScheduleSection />
            </SectionCard>

            {/* Response Targets */}
            <SectionCard title="Response Targets" icon={Target}>
                <ResponseTargets />
            </SectionCard>

            {/* Creation Mode */}
            <SectionCard title="Creation Mode" icon={Sparkles}>
                <CreationMode />
            </SectionCard>

            {/* Template Gallery */}
            <SectionCard title="Template Gallery" icon={Clipboard}>
                <TemplateGallery />
            </SectionCard>
        </div>
    )
}
