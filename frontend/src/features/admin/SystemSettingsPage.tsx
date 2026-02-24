
/**
 * System Settings Page for House FinMan
 * 
 * Features:
 * - General Settings
 * - Notification Preferences
 * - Branding & Theme
 */

import { useState } from 'react'
import { Save, Bell, Smartphone, Mail, Globe, Lock, Shield, Palette, Building } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

const settingsTabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'branding', label: 'Branding', icon: Palette },
]

export default function SystemSettingsPage() {
    const [activeTab, setActiveTab] = useState('general')

    return (
        <div className="space-y-0 animate-fade-in relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 min-h-[600px]">
            {/* Header - Sharp */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">System Settings</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">/admin/settings/system</p>
                </div>
                <div className="flex items-center gap-0 border border-slate-200 dark:border-white/10">
                    <Button variant="ghost" className="rounded-none border-r border-slate-200 dark:border-white/10 px-4 h-9" onClick={() => { if (confirm('Discard unsaved changes?')) window.location.reload() }}>Discard</Button>
                    <Button variant="primary" className="rounded-none px-4 h-9" leftIcon={<Save className="w-3.5 h-3.5" />} onClick={() => alert('System Settings Saved Successfully!')}>Save Changes</Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-0 border-t-0 border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 min-h-[500px]">
                {/* Vertical Tabs Sidebar */}
                <div className="col-span-12 lg:col-span-3 border-r border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900">
                    <nav className="flex flex-col">
                        {settingsTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-4 text-xs font-bold transition-all border-l-2 uppercase tracking-wider',
                                    activeTab === tab.id
                                        ? 'bg-white dark:bg-slate-800 border-l-primary-500 text-primary-600 dark:text-white shadow-sm'
                                        : 'border-l-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700'
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary-500" : "text-slate-400")} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="col-span-12 lg:col-span-9 bg-white dark:bg-slate-900">
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-white/5 animate-fade-in h-full">
                            <div className="bg-transparent">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-white/5 flex items-center gap-2 uppercase tracking-wide">
                                    <Building className="w-4 h-4 text-primary-500" /> Identity
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 transition-colors rounded-none placeholder:text-slate-400" defaultValue="House FinMan" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Support Email</label>
                                        <input type="email" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 transition-colors rounded-none placeholder:text-slate-400" defaultValue="support@housefinman.com" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-transparent">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-white/5 flex items-center gap-2 uppercase tracking-wide">
                                    <Globe className="w-4 h-4 text-purple-500" /> Localization
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Default Currency</label>
                                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 transition-colors rounded-none">
                                            <option>INR (₹)</option>
                                            <option>USD ($)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
                                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 transition-colors rounded-none">
                                            <option>Asia/Kolkata (IST)</option>
                                            <option>UTC</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="grid grid-cols-1 gap-0 divide-y divide-slate-100 dark:divide-white/5 animate-fade-in">
                            <div className="flex items-start justify-between bg-white dark:bg-slate-900 group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-orange-600 rounded-none shadow-sm">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">Email Alerts</h3>
                                        <p className="text-xs text-slate-500 mt-1 max-w-md">Receive critical system updates, daily digests, and security warnings via email.</p>

                                        <div className="mt-6 flex items-center gap-4">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sender:</label>
                                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-slate-600 dark:text-slate-300">alerts@housefinman.com</code>
                                        </div>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-sm peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </label>
                            </div>

                            <div className="flex items-start justify-between bg-white dark:bg-slate-900 group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-emerald-600 rounded-none shadow-sm">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">SMS Notifications</h3>
                                        <p className="text-xs text-slate-500 mt-1 max-w-md">Receive OTPs, urgent pings, and payment confirmations directly to mobile.</p>

                                        <div className="mt-6">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">SMS Gateway</label>
                                            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-xs w-64 rounded-none focus:outline-none focus:border-emerald-500">
                                                <option>Twilio</option>
                                                <option>AWS SNS</option>
                                                <option>Msg91</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-sm peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-slate-100 dark:divide-white/5 animate-fade-in h-full">
                            <div className="bg-red-50/5 dark:bg-red-900/5">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-white/5 flex items-center gap-2 uppercase tracking-wide">
                                    <Lock className="w-4 h-4 text-red-500" /> Access Control
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Session Timeout (Minutes)</label>
                                        <input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-red-500 rounded-none" defaultValue="30" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Password Expiry (Days)</label>
                                        <input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-red-500 rounded-none" defaultValue="90" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50/5 dark:bg-indigo-900/5">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-white/5 flex items-center gap-2 uppercase tracking-wide">
                                    <Shield className="w-4 h-4 text-indigo-500" /> Multi-Factor Auth
                                </h3>
                                <div className="flex items-start gap-4 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/30 shadow-none">
                                    <input type="checkbox" className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded-none focus:ring-indigo-500" defaultChecked />
                                    <div>
                                        <span className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Enforce 2FA Globally</span>
                                        <span className="block text-xs text-slate-500 mt-1 leading-relaxed">Require 2FA for all admin and manager level accounts. Recommended for security.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'branding' && (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-50">
                            <Palette className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 mb-2">BRANDING</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">Theme customization and white-labeling options coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
