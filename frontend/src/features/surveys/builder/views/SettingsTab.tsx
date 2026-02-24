import { useState, useEffect } from 'react'
import { useSurveyBuilder } from '../contexts/SurveyBuilderContext'
import { cn } from '@/utils'
import {
    Calendar, Repeat, Palette, Bell, Users, Shield,
    Download, ChevronDown, Check, Eye,
    EyeOff, Key, Link, Mail, Slack,
    AlertTriangle, Trash2, Settings, Target, Smartphone, Globe, MessageSquare
} from 'lucide-react'

// ============ ACCORDION SECTION ============

interface AccordionSectionProps {
    title: string
    icon: React.ElementType
    description: string
    defaultOpen?: boolean
    children: React.ReactNode
}

function AccordionSection({ title, icon: Icon, description, defaultOpen = false, children }: AccordionSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden transition-all hover:border-slate-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-6 py-5 flex items-center justify-between transition-colors",
                    isOpen ? "bg-slate-50 border-b border-slate-100" : "bg-white hover:bg-slate-50"
                )}
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-sm flex items-center justify-center transition-colors",
                        isOpen ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h3 className={cn("font-semibold text-base transition-colors", isOpen ? "text-slate-900" : "text-slate-700")}>{title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                    </div>
                </div>
                <div className={cn("transition-transform duration-200", isOpen ? "rotate-180" : "")}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
            </button>
            {isOpen && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    )
}

// ============ TOGGLE SWITCH ============

interface ToggleProps {
    enabled: boolean
    onChange: (enabled: boolean) => void
    label: string
    description?: string
}

function Toggle({ enabled, onChange, label, description }: ToggleProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-sm hover:border-slate-200 transition-colors">
            <div>
                <p className="font-medium text-slate-800 text-sm">{label}</p>
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={cn(
                    "w-11 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                    enabled ? "bg-blue-600" : "bg-slate-300"
                )}
            >
                <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                    enabled ? "translate-x-6" : "translate-x-1"
                )} />
            </button>
        </div>
    )
}

// ============ BASIC INFO SECTION ============

function BasicInfoSection() {
    const { settings, updateSettings } = useSurveyBuilder()
    const [localName, setLocalName] = useState(settings.name)
    const [localDesc, setLocalDesc] = useState(settings.description || '')

    // Sync local state when context changes
    useEffect(() => {
        setLocalName(settings.name)
    }, [settings.name])

    useEffect(() => {
        setLocalDesc(settings.description || '')
    }, [settings.description])

    const handleNameBlur = () => {
        if (localName.trim() && localName !== settings.name) {
            updateSettings({ name: localName })
        }
    }

    const handleDescBlur = () => {
        if (localDesc !== settings.description) {
            updateSettings({ description: localDesc })
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Survey Name</label>
                <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    onBlur={handleNameBlur}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                    value={localDesc}
                    onChange={(e) => setLocalDesc(e.target.value)}
                    onBlur={handleDescBlur}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Describe your survey..."
                />
            </div>
        </div>
    )
}

// ============ TARGETING & GOALS SECTION ============

function TargetingGoalsSection() {
    const { settings, updateSettings } = useSurveyBuilder()
    const responseGoal = settings.targetResponses
    const mediums = settings.mediums

    const [localGoal, setLocalGoal] = useState(responseGoal.toString())

    useEffect(() => {
        setLocalGoal(responseGoal.toString())
    }, [responseGoal])

    const handleGoalBlur = () => {
        const val = parseInt(localGoal)
        if (!isNaN(val) && val > 0) {
            updateSettings({ targetResponses: val })
        } else {
            setLocalGoal(responseGoal.toString())
        }
    }

    const toggleMedium = (medium: string) => {
        // Correct type casting for medium
        const m = medium as any
        if (mediums.includes(m)) {
            updateSettings({ mediums: mediums.filter(existing => existing !== m) })
        } else {
            updateSettings({ mediums: [...mediums, m] })
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Response Goal</label>
                <div className="relative">
                    <input
                        type="number"
                        value={localGoal}
                        onChange={(e) => setLocalGoal(e.target.value)}
                        onBlur={handleGoalBlur}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-4 top-2.5 text-sm text-slate-400">responses</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">We'll notify you when this goal is reached.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Active Channels</label>
                <div className="flex flex-wrap gap-3">
                    {['mobile_web', 'desktop_web', 'email', 'sms'].map(channel => {
                        const isActive = mediums.includes(channel as any)
                        const Icon = channel.includes('mobile') ? Smartphone : channel.includes('web') ? Globe : channel === 'email' ? Mail : MessageSquare
                        return (
                            <button
                                key={channel}
                                onClick={() => toggleMedium(channel)}
                                className={cn(
                                    "px-4 py-2 text-xs font-bold uppercase tracking-wider border rounded-sm transition-all flex items-center gap-2",
                                    isActive
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isActive ? "text-emerald-600" : "text-slate-400")} />
                                {channel.replace('_', ' ')}
                                {isActive && <Check className="w-3.5 h-3.5 ml-1" />}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// ============ SCHEDULE & TIMING SECTION ============

function ScheduleTimingSection() {
    const { settings, updateSettings } = useSurveyBuilder()
    const [autoClose, setAutoClose] = useState(true)
    const [reminderEnabled, setReminderEnabled] = useState(true)

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <input
                        type="datetime-local"
                        value={settings.startDate || ''}
                        onChange={(e) => updateSettings({ startDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                    <input
                        type="datetime-local"
                        value={settings.endDate || ''}
                        onChange={(e) => updateSettings({ endDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                <select
                    value={settings.timezone}
                    onChange={(e) => updateSettings({ timezone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                </select>
            </div>

            <Toggle
                enabled={autoClose}
                onChange={setAutoClose}
                label="Auto-close survey"
                description="Automatically close survey on end date"
            />

            <Toggle
                enabled={reminderEnabled}
                onChange={setReminderEnabled}
                label="Send reminders"
                description="Remind incomplete respondents"
            />
        </div>
    )
}

// ============ RESPONSE FREQUENCY SECTION ============

function ResponseFrequencySection() {
    const [limitPerUser, setLimitPerUser] = useState(true)
    const [cooldownEnabled, setCooldownEnabled] = useState(true)
    const [maxResponses, setMaxResponses] = useState(1)
    const [cooldownHours, setCooldownHours] = useState(24)

    return (
        <div className="space-y-4">
            <Toggle
                enabled={limitPerUser}
                onChange={setLimitPerUser}
                label="Limit responses per user"
                description="Prevent multiple submissions from same user"
            />

            {limitPerUser && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Max responses per user</label>
                    <input
                        type="number"
                        value={maxResponses}
                        onChange={(e) => setMaxResponses(parseInt(e.target.value) || 1)}
                        min={1}
                        max={10}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            <Toggle
                enabled={cooldownEnabled}
                onChange={setCooldownEnabled}
                label="Cooldown period"
                description="Minimum time between responses from same user"
            />

            {cooldownEnabled && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cooldown (hours)</label>
                    <input
                        type="number"
                        value={cooldownHours}
                        onChange={(e) => setCooldownHours(parseInt(e.target.value) || 24)}
                        min={1}
                        max={720}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}
        </div>
    )
}

// ============ BRANDING SECTION ============

function BrandingSection() {
    const [primaryColor, setPrimaryColor] = useState('#3b82f6')
    const [logoUrl, setLogoUrl] = useState('')
    const [showLogo, setShowLogo] = useState(true)
    const [customCSS, setCustomCSS] = useState('')

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 border border-slate-200 rounded-sm cursor-pointer"
                    />
                    <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Logo URL</label>
                <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://your-company.com/logo.png"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <Toggle
                enabled={showLogo}
                onChange={setShowLogo}
                label="Show logo in survey"
                description="Display company logo in survey header"
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Custom CSS (Advanced)</label>
                <textarea
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    placeholder=".survey-container { /* your styles */ }"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>
        </div>
    )
}

// ============ NOTIFICATIONS SECTION ============

function NotificationsSection() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [slackEnabled, setSlackEnabled] = useState(false)
    const [webhookEnabled, setWebhookEnabled] = useState(false)
    const [emailRecipients, setEmailRecipients] = useState('team@homefin.com')
    const [slackChannel, setSlackChannel] = useState('')
    const [webhookUrl, setWebhookUrl] = useState('')

    return (
        <div className="space-y-4">
            <Toggle
                enabled={emailNotifications}
                onChange={setEmailNotifications}
                label="Email notifications"
                description="Get notified for new responses"
            />

            {emailNotifications && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email recipients</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={emailRecipients}
                            onChange={(e) => setEmailRecipients(e.target.value)}
                            placeholder="email@company.com, team@company.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            <Toggle
                enabled={slackEnabled}
                onChange={setSlackEnabled}
                label="Slack integration"
                description="Post responses to Slack channel"
            />

            {slackEnabled && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Slack channel</label>
                    <div className="relative">
                        <Slack className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={slackChannel}
                            onChange={(e) => setSlackChannel(e.target.value)}
                            placeholder="#survey-responses"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            <Toggle
                enabled={webhookEnabled}
                onChange={setWebhookEnabled}
                label="Webhook"
                description="Send data to external endpoint"
            />

            {webhookEnabled && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL</label>
                    <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="url"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            placeholder="https://your-api.com/webhook"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

// ============ PERMISSIONS SECTION ============

function PermissionsSection() {
    const [isPublic, setIsPublic] = useState(false)
    const [requireAuth, setRequireAuth] = useState(false)
    const [accessPassword, setAccessPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const roles = [
        { name: 'Admin', access: 'Full access', enabled: true },
        { name: 'Manager', access: 'Edit & view', enabled: true },
        { name: 'Analyst', access: 'View only', enabled: true },
        { name: 'Agent', access: 'View responses', enabled: false }
    ]

    return (
        <div className="space-y-4">
            <Toggle
                enabled={isPublic}
                onChange={setIsPublic}
                label="Public survey"
                description="Anyone with the link can respond"
            />

            <Toggle
                enabled={requireAuth}
                onChange={setRequireAuth}
                label="Require authentication"
                description="Respondents must log in"
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password protection (optional)</label>
                <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={accessPassword}
                        onChange={(e) => setAccessPassword(e.target.value)}
                        placeholder="Enter access password"
                        className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role access</label>
                <div className="space-y-2">
                    {roles.map((role) => (
                        <div key={role.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-sm">
                            <div>
                                <p className="text-sm font-medium text-slate-800">{role.name}</p>
                                <p className="text-xs text-slate-500">{role.access}</p>
                            </div>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                role.enabled ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                            )}>
                                <Check className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ============ PRIVACY SECTION ============

function PrivacySection() {
    const [gdprCompliant, setGdprCompliant] = useState(true)
    const [anonymize, setAnonymize] = useState(false)
    const [dataRetention, setDataRetention] = useState('365')
    const [consentRequired, setConsentRequired] = useState(true)

    return (
        <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-amber-800">Privacy compliance important</p>
                    <p className="text-xs text-amber-700">Ensure settings comply with local regulations (GDPR, CCPA, etc.)</p>
                </div>
            </div>

            <Toggle
                enabled={gdprCompliant}
                onChange={setGdprCompliant}
                label="GDPR mode"
                description="Enable GDPR-compliant data handling"
            />

            <Toggle
                enabled={consentRequired}
                onChange={setConsentRequired}
                label="Require consent"
                description="Show consent checkbox before survey"
            />

            <Toggle
                enabled={anonymize}
                onChange={setAnonymize}
                label="Anonymize responses"
                description="Remove personal identifiers from data"
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Data retention (days)</label>
                <select
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                    <option value="forever">Forever</option>
                </select>
            </div>
        </div>
    )
}

// ============ EXPORT SECTION ============

function ExportSection() {
    const [autoExport, setAutoExport] = useState(false)
    const [exportFormat, setExportFormat] = useState('csv')
    const [isExporting, setIsExporting] = useState<string | null>(null)

    const handleExport = (format: string) => {
        setIsExporting(format)
        // Simulate download
        setTimeout(() => {
            setIsExporting(null)
            alert(`Successfully exported data as ${format}`)
        }, 1200)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['CSV', 'Excel', 'JSON', 'PDF'].map((format) => (
                    <button
                        key={format}
                        onClick={() => handleExport(format)}
                        disabled={!!isExporting}
                        className={cn(
                            "flex flex-col items-center justify-center gap-3 p-6 bg-white border border-slate-200 rounded-sm transition-all relative overflow-hidden group",
                            "hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
                            isExporting === format ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/10" : "bg-white"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isExporting === format ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                        )}>
                            <Download className={cn("w-5 h-5", isExporting === format && "animate-bounce")} />
                        </div>
                        <span className={cn(
                            "text-sm font-semibold transition-colors",
                            isExporting === format ? "text-blue-700" : "text-slate-700 group-hover:text-slate-900"
                        )}>{format}</span>
                        {isExporting === format && (
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 animate-pulse" />
                        )}
                    </button>
                ))}
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-sm">
                <Toggle
                    enabled={autoExport}
                    onChange={setAutoExport}
                    label="Scheduled exports"
                    description="Automatically export and email data on a recurring schedule"
                />

                {autoExport && (
                    <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-top-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Export format</label>
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors"
                            >
                                <option value="csv">CSV</option>
                                <option value="excel">Excel</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
                            <select
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors"
                            >
                                <option value="daily">Daily (Every morning)</option>
                                <option value="weekly">Weekly (Mondays)</option>
                                <option value="monthly">Monthly (1st day)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="pt-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-xs">Danger Zone</h4>
                <div className="flex items-center justify-between p-5 bg-white border border-red-200 rounded-sm shadow-sm hover:border-red-300 transition-colors">
                    <div>
                        <p className="text-sm font-semibold text-red-900">Delete all responses</p>
                        <p className="text-xs text-red-600 mt-1">Permanently remove all response data. This action cannot be undone.</p>
                    </div>
                    <button
                        onClick={() => alert("This is a critical action! (Simulation)")}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-sm shadow-sm transition-all active:scale-95"
                    >
                        <Trash2 className="w-4 h-4" />
                        DELETE DATA
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============ MAIN TAB ============

export function SettingsTab() {
    return (
        <div className="p-4 md:p-6 space-y-4 pb-20 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800">Settings</h2>
                <p className="text-sm text-slate-500">Configure survey behavior, privacy, and integrations</p>
            </div>

            <AccordionSection
                title="Basic Information"
                icon={Settings}
                description="Survey name, description and public visibility"
                defaultOpen={true}
            >
                <BasicInfoSection />
            </AccordionSection>

            <AccordionSection
                title="Targeting & Goals"
                icon={Target}
                description="Set response goals and active channels"
            >
                <TargetingGoalsSection />
            </AccordionSection>

            <AccordionSection
                title="Schedule & Timing"
                icon={Calendar}
                description="Set when the survey runs and auto-close behavior"
            >
                <ScheduleTimingSection />
            </AccordionSection>

            <AccordionSection
                title="Response Frequency"
                icon={Repeat}
                description="Control how often users can respond"
            >
                <ResponseFrequencySection />
            </AccordionSection>

            <AccordionSection
                title="Branding & Customization"
                icon={Palette}
                description="Customize colors, logo, and styling"
            >
                <BrandingSection />
            </AccordionSection>

            <AccordionSection
                title="Notifications"
                icon={Bell}
                description="Email, Slack, and webhook integrations"
            >
                <NotificationsSection />
            </AccordionSection>

            <AccordionSection
                title="Permissions & Access"
                icon={Users}
                description="Control who can access and respond"
            >
                <PermissionsSection />
            </AccordionSection>

            <AccordionSection
                title="Privacy & Compliance"
                icon={Shield}
                description="GDPR, consent, and data retention"
            >
                <PrivacySection />
            </AccordionSection>

            <AccordionSection
                title="Export & Reports"
                icon={Download}
                description="Download data and schedule exports"
            >
                <ExportSection />
            </AccordionSection>
        </div>
    )
}
