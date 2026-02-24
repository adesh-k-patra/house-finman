import { useState } from 'react'
import {
    Calendar, Users, Globe, Mail, QrCode, Copy, Save, Clock,
    Settings, Bell, Shield, Smartphone,
    CheckCircle, AlertTriangle, Palette, Link2, Download, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

// ============ SIDE NAVIGATION ============

const settingsNav = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'distribution', label: 'Distribution', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'security', label: 'Security', icon: Shield },
]

// ============ MAIN COMPONENT ============

interface SurveySettingsProps {
    status?: string
    onStatusChange?: (status: string) => void
}

export function SurveySettings({ status, onStatusChange }: SurveySettingsProps) {
    const [activeSection, setActiveSection] = useState('general')
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="flex h-[700px] bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in">
            {/* Side Navigation */}
            <div className="w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white">Settings</h3>
                    <p className="text-xs text-slate-500">Configure your survey</p>
                </div>
                <nav className="p-2">
                    {settingsNav.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium transition-all border-l-2",
                                activeSection === item.id
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-l-blue-600"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-transparent"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                    {activeSection === 'general' && <GeneralSettings status={status} onStatusChange={onStatusChange} />}
                    {activeSection === 'schedule' && <ScheduleSettings />}
                    {activeSection === 'audience' && <AudienceSettings />}
                    {activeSection === 'distribution' && <DistributionSettings />}
                    {activeSection === 'branding' && <BrandingSettings />}
                    {activeSection === 'notifications' && <NotificationSettings />}
                    {activeSection === 'alerts' && <AlertSettings />}
                    {activeSection === 'integrations' && <IntegrationSettings />}
                    {activeSection === 'security' && <SecuritySettings />}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Changes are saved automatically</p>
                    <Button onClick={handleSave} className="gap-2 rounded-none">
                        {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? 'Saved!' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ============ SECTION COMPONENTS ============

interface GeneralSettingsProps {
    status?: string
    onStatusChange?: (status: string) => void
}

function GeneralSettings({ status, onStatusChange }: GeneralSettingsProps) {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">General Configuration</h2>
                <p className="text-sm text-slate-500">Basic survey settings and metadata</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Survey Name</label>
                    <input
                        type="text"
                        defaultValue="Post-Disbursement Feedback Survey"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                    <textarea
                        rows={3}
                        defaultValue="Collect feedback from customers after loan disbursement to measure satisfaction and identify areas for improvement."
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Survey Type</label>
                        <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none">
                            <option>NPS (Net Promoter Score)</option>
                            <option>CSAT (Customer Satisfaction)</option>
                            <option>CES (Customer Effort Score)</option>
                            <option>Product Research</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status</label>
                        <select
                            value={status}
                            onChange={(e) => onStatusChange?.(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none"
                        >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="draft">Draft</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                </div>

            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                    {['Post-Disbursement', 'NPS', 'Q1-2024', 'Priority'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-none text-sm font-medium border border-blue-200 dark:border-blue-800">
                            {tag} ×
                        </span>
                    ))}
                    <button className="px-3 py-1 border border-dashed border-slate-300 dark:border-slate-600 rounded-none text-sm text-slate-500 hover:border-blue-500 hover:text-blue-500">
                        + Add Tag
                    </button>
                </div>
            </div>
        </div>

    )
}

function ScheduleSettings() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Schedule</h2>
                <p className="text-sm text-slate-500">Configure when the survey runs</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                        <input type="date" defaultValue="2024-01-15" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">End Date</label>
                        <input type="date" defaultValue="2024-03-15" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Active Hours</label>
                    <div className="flex items-center gap-4">
                        <input type="time" defaultValue="09:00" className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none" />
                        <span className="text-slate-500">to</span>
                        <input type="time" defaultValue="18:00" className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Timezone</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none">
                        <option>Asia/Kolkata (IST)</option>
                        <option>America/New_York (EST)</option>
                        <option>Europe/London (GMT)</option>
                    </select>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Frequency Cap</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-none peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <p className="text-sm text-slate-500">Don't survey the same customer more than once every <strong>30 days</strong></p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Response Time Limit</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-none peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" defaultValue={10} className="w-20 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                        <span className="text-sm text-slate-500">minutes allowed to complete survey</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AudienceSettings() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Audience</h2>
                <p className="text-sm text-slate-500">Define who should receive this survey</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Segment</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none">
                        <option>All Customers</option>
                        <option>Post-Disbursement (7 days)</option>
                        <option>High-Value Customers (LTV greater than ₹10L)</option>
                        <option>At-Risk Customers</option>
                        <option>Custom Segment</option>
                    </select>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">Targeting Rules</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-700">
                            <span className="text-sm">Loan disbursed</span>
                            <select className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm">
                                <option>in last</option>
                                <option>before</option>
                            </select>
                            <input type="number" defaultValue={7} className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                            <span className="text-sm">days</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-700">
                            <span className="text-sm text-blue-600 font-bold">AND</span>
                            <span className="text-sm">Region</span>
                            <select className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm">
                                <option>is</option>
                                <option>is not</option>
                            </select>
                            <select className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm flex-1">
                                <option>Maharashtra</option>
                                <option>Gujarat</option>
                                <option>All Regions</option>
                            </select>
                        </div>
                        <button className="text-sm text-blue-600 font-bold hover:underline">+ Add Rule</button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Sample Size</label>
                    <div className="flex items-center gap-4">
                        <input type="number" defaultValue={1000} className="w-32 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none" />
                        <span className="text-sm text-slate-500">Maximum responses to collect</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DistributionSettings() {
    const surveyLink = 'https://surveys.housefin.in/s/pd-feedback-2024'

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Distribution</h2>
                <p className="text-sm text-slate-500">Configure how the survey is delivered</p>
            </div>

            {/* Web Link */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900 dark:text-white">Web Link</h4>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        readOnly
                        value={surveyLink}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm"
                    />
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(surveyLink)} className="gap-2 rounded-none">
                        <Copy className="w-4 h-4" /> Copy
                    </Button>
                </div>
            </div>

            {/* Email */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-slate-900 dark:text-white">Email Distribution</h4>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Subject Line</label>
                        <input type="text" defaultValue="We'd love your feedback on your recent loan experience" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Sender Name</label>
                        <input type="text" defaultValue="HouseFin Customer Success" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                    </div>
                    <Button className="gap-2 rounded-none">
                        <Mail className="w-4 h-4" /> Send Test Email
                    </Button>
                </div>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 dark:text-white">QR Code</h4>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-slate-900 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                        <Button variant="outline" className="gap-2 w-full justify-start rounded-none">
                            <Download className="w-4 h-4" /> Download PNG
                        </Button>
                        <Button variant="outline" className="gap-2 w-full justify-start rounded-none">
                            <Download className="w-4 h-4" /> Download SVG
                        </Button>
                        <p className="text-xs text-slate-500">For print materials and kiosks</p>
                    </div>
                </div>
            </div>

            {/* SMS / WhatsApp */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-slate-900 dark:text-white">SMS / WhatsApp</h4>
                </div>
                <div>
                    <label className="block text-xs text-slate-500 mb-1">Message Template</label>
                    <textarea
                        rows={3}
                        defaultValue="Hi {name}, thank you for choosing HouseFin! Please take 2 minutes to share your feedback: {link}"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Variables: {'{name}'}, {'{link}'}, {'{loan_id}'}</p>
                </div>
            </div>
        </div>
    )
}

function BrandingSettings() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Branding</h2>
                <p className="text-sm text-slate-500">Customize the look and feel</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Logo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-none border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                            <span className="text-slate-400 text-xs">Logo</span>
                        </div>
                        <Button variant="outline" className="rounded-none">Upload Logo</Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Primary Color</label>
                        <div className="flex gap-2">
                            <input type="color" defaultValue="#3b82f6" className="w-12 h-10 rounded-none border border-slate-200" />
                            <input type="text" defaultValue="#3b82f6" className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Background Color</label>
                        <div className="flex gap-2">
                            <input type="color" defaultValue="#f8fafc" className="w-12 h-10 rounded-none border border-slate-200" />
                            <input type="text" defaultValue="#f8fafc" className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Font Family</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none">
                        <option>Inter (Default)</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                        <option>Lato</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

function NotificationSettings() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Notifications</h2>
                <p className="text-sm text-slate-500">Configure notification preferences</p>
            </div>

            <div className="space-y-3">
                {[
                    { label: 'New response received', enabled: true },
                    { label: 'Daily summary report', enabled: true },
                    { label: 'Detractor alert (NPS below 7)', enabled: true },
                    { label: 'Response milestone (100, 500, 1000)', enabled: false },
                    { label: 'Survey completion', enabled: true },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-none">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-none peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Notification Email</label>
                <input type="email" defaultValue="feedback@housefin.in" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none" />
            </div>
        </div>
    )
}

function AlertSettings() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Alert Rules</h2>
                <p className="text-sm text-slate-500">Configure automated alerts and thresholds</p>
            </div>

            <div className="space-y-4">
                {[
                    { name: 'Low Response Rate', condition: 'Daily responses below 50', severity: 'warning', channel: 'Email + Slack' },
                    { name: 'High Drop-off', condition: 'Drop-off rate above 25%', severity: 'critical', channel: 'SMS + Email' },
                    { name: 'Negative Sentiment Surge', condition: 'Detractors above 30% in 1 hour', severity: 'critical', channel: 'Slack' },
                    { name: 'SLA Breach Risk', condition: 'CX reply pending over 2 hours', severity: 'warning', channel: 'Email' },
                    { name: 'Regional Zero Activity', condition: 'No responses from region in 24h', severity: 'info', channel: 'Email' },
                ].map((alert, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-none text-xs font-bold uppercase",
                                        alert.severity === 'critical' ? "bg-red-100 text-red-700" :
                                            alert.severity === 'warning' ? "bg-orange-100 text-orange-700" :
                                                "bg-blue-100 text-blue-700"
                                    )}>
                                        {alert.severity}
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-white">{alert.name}</span>
                                </div>
                                <p className="text-sm text-slate-500">{alert.condition}</p>
                                <p className="text-xs text-slate-400 mt-1">Notify via: {alert.channel}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 rounded-none peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            <Button variant="outline" className="gap-2 rounded-none">
                <AlertTriangle className="w-4 h-4" /> Create Custom Alert
            </Button>
        </div>
    )
}

function IntegrationSettings() {
    const integrations = [
        { name: 'Salesforce', status: 'connected', icon: '☁️' },
        { name: 'Zendesk', status: 'connected', icon: '🎫' },
        { name: 'Slack', status: 'connected', icon: '💬' },
        { name: 'HubSpot', status: 'available', icon: '🧡' },
        { name: 'MS Teams', status: 'available', icon: '👥' },
        { name: 'Snowflake', status: 'available', icon: '❄️' },
    ]

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Integrations</h2>
                <p className="text-sm text-slate-500">Connect with your tools</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {integrations.map(int => (
                    <div key={int.name} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{int.icon}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{int.name}</span>
                        </div>
                        <Button
                            variant={int.status === 'connected' ? 'outline' : undefined}
                            size="sm"
                            className="w-full rounded-none"
                        >
                            {int.status === 'connected' ? '✓ Connected' : 'Connect'}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SecuritySettings() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Security & Privacy</h2>
                <p className="text-sm text-slate-500">Data protection and compliance settings</p>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">PII Masking</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 rounded-none peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <p className="text-sm text-slate-500">Automatically mask phone numbers, emails, and other PII in exports</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">Data Retention</span>
                    </div>
                    <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none">
                        <option>Keep indefinitely</option>
                        <option>Delete after 1 year</option>
                        <option>Delete after 2 years</option>
                        <option>Delete after 5 years</option>
                    </select>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-none border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">Compliance Status</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['GDPR', 'SOC2', 'ISO 27001', 'HIPAA Ready'].map(badge => (
                            <span key={badge} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-none text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
