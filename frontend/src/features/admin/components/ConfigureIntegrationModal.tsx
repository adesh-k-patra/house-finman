import { useState, useEffect } from 'react'
import { X, Save, Key, RefreshCw, EyeOff, Eye } from 'lucide-react'
import { Button } from '@/components/ui'

interface ConfigureIntegrationModalProps {
    isOpen: boolean
    onClose: () => void
    integrationName: string
    onSave: (config: any) => void
    onDisconnect: () => void
}

export function ConfigureIntegrationModal({ isOpen, onClose, integrationName, onSave, onDisconnect }: ConfigureIntegrationModalProps) {
    if (!isOpen) return null

    const [apiKey, setApiKey] = useState('sk_live_51M...')
    const [showKey, setShowKey] = useState(false)
    const [frequency, setFrequency] = useState('hourly')
    const [webhookUrl] = useState('https://api.housefinman.com/webhooks/v1/integrations')

    // Reset state when opening for a new integration (simulation)
    useEffect(() => {
        if (isOpen) {
            // specific simulation logic could go here
        }
    }, [isOpen, integrationName])

    const handleSave = () => {
        onSave({ apiKey, frequency, webhookUrl })
        onClose()
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] bg-white dark:bg-slate-900 shadow-2xl z-50 animate-fade-in border border-slate-200 dark:border-white/10 rounded-none transform-gpu">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Configure {integrationName}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage API keys and sync settings</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                </div>

                <div className="p-0">
                    <div className="grid grid-cols-[200px_1fr] divide-x divide-slate-200 dark:divide-white/10 h-[400px]">
                        {/* Sidebar (Visual) */}
                        <div className="bg-slate-50 dark:bg-slate-800/30 p-6 space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-white/5 shadow-sm">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center mb-3">
                                    <Key className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-sm">Credentials</h3>
                                <p className="text-xs text-slate-500 mt-1">Securely store your API keys.</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-white/5 shadow-sm">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-3">
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-sm">Sync</h3>
                                <p className="text-xs text-slate-500 mt-1">Control data refresh rates.</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 overflow-y-auto">
                            {/* API Key */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    API Key
                                </label>
                                <div className="relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 pr-10 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-none transition-all"
                                    />
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Sync Frequency */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Sync Frequency
                                </label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-none transition-all"
                                >
                                    <option value="realtime">Real-time (WebSocket)</option>
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily at 00:00 UTC</option>
                                    <option value="manual">Manual Only</option>
                                </select>
                            </div>

                            {/* Webhook URL */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Webhook URL
                                </label>
                                <input
                                    type="text"
                                    value={webhookUrl}
                                    readOnly
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-500 font-mono rounded-none select-all cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none px-4"
                        onClick={() => {
                            if (confirm('Are you sure you want to disconnect this integration?')) {
                                onDisconnect()
                                onClose()
                            }
                        }}
                    >
                        Disconnect
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onClose} className="rounded-none border-slate-300">Cancel</Button>
                        <Button variant="primary" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />} className="rounded-none bg-slate-900 text-white hover:bg-black">Save Configuration</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
