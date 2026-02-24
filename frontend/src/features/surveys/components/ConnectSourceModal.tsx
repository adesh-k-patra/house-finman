

import { useState } from 'react'
import { Globe, Smartphone, FileSpreadsheet, CheckCircle, ArrowRight, Loader2, Database, LayoutGrid, AlertCircle, RefreshCw, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'
import { AnimatedLogo } from '@/components/logo/AnimatedLogo'

interface ConnectSourceModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ConnectSourceModal({ isOpen, onClose }: ConnectSourceModalProps) {
    const [selectedSource, setSelectedSource] = useState<string | null>('google')
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle')
    const [config, setConfig] = useState({ apiKey: '', accountId: '' })

    const sources = [
        { id: 'google', name: 'Google Ads', icon: Globe, color: 'text-blue-400', desc: 'Search & Display' },
        { id: 'meta', name: 'Meta Ads', icon: Database, color: 'text-blue-500', desc: 'Lead Forms' },
        { id: 'whatsapp', name: 'WhatsApp', icon: Smartphone, color: 'text-emerald-400', desc: 'Business API' },
        { id: 'csv', name: 'CSV Upload', icon: FileSpreadsheet, color: 'text-slate-400', desc: 'Bulk Import' },
        { id: 'hubspot', name: 'HubSpot', icon: LayoutGrid, color: 'text-orange-500', desc: 'CRM Sync' },
    ]

    if (!isOpen) return null

    const handleConnect = () => {
        setConnectionStatus('connecting')
        // Simulate API call
        setTimeout(() => {
            setConnectionStatus('success')
            setTimeout(() => {
                setConnectionStatus('idle')
            }, 2000)
        }, 1500)
    }

    const activeSource = sources.find(s => s.id === selectedSource)

    const reset = () => {
        setSelectedSource('google')
        setConnectionStatus('idle')
        setConfig({ apiKey: '', accountId: '' })
        onClose()
    }

    // Portal to body to match WizardModal behavior
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={reset}
            />

            {/* Modal Container - Matches WizardModal "Sharp corners as requested" */}
            <div className={cn(
                "relative flex flex-col md:flex-row w-full bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-scale-in",
                "h-[800px] max-w-[1400px]", // Increased size as requested
                "!rounded-none" // Enforce sharp corners
            )}>

                {/* --- Left Sidebar (Dark Theme) --- */}
                <div className={cn(
                    "hidden md:flex flex-col relative",
                    "bg-[#0F172A] text-white p-8",
                    "w-[350px] shrink-0 border-r border-slate-800"
                )}>
                    {/* Header with Logo */}
                    <div className="mb-10">
                        <AnimatedLogo size="lg" className="mb-6" />
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-6 bg-blue-500 rounded-full" />
                            <h2 className="text-xl font-bold tracking-wide uppercase">Connect Source</h2>
                        </div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest ml-3">Integrations</p>
                    </div>

                    {/* Sources List */}
                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                        {sources.map((source) => {
                            const isActive = selectedSource === source.id
                            return (
                                <button
                                    key={source.id}
                                    onClick={() => { setSelectedSource(source.id); setConnectionStatus('idle') }}
                                    className={cn(
                                        "group flex items-start gap-4 transition-all duration-300 w-full text-left p-4 border border-transparent hover:bg-slate-800/50",
                                        isActive ? "bg-slate-800 border-slate-700 shadow-lg" : "opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <div className={cn(
                                        "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-none font-bold text-sm border transition-colors duration-300 bg-slate-900",
                                        isActive ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "border-slate-700 group-hover:border-slate-500"
                                    )}>
                                        <source.icon className={cn("w-5 h-5", source.color)} />
                                    </div>
                                    <div className="mt-0.5">
                                        <h3 className={cn(
                                            "font-bold text-sm tracking-wide uppercase mb-0.5",
                                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                                        )}>
                                            {source.name}
                                        </h3>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider group-hover:text-slate-400">
                                            {source.desc}
                                        </p>
                                    </div>
                                    {isActive && <ArrowRight className="w-4 h-4 text-blue-500 ml-auto mt-3" />}
                                </button>
                            )
                        })}
                    </div>

                    {/* Footer - Branding */}
                    <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>
                        </div>
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 blur-[80px] pointer-events-none" />
                </div>

                {/* --- Right Content (Light Theme) --- */}
                <div className="flex-1 flex flex-col bg-white dark:bg-[#0B1121] relative">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white z-10 shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                {activeSource?.icon && <activeSource.icon className={cn("w-6 h-6", activeSource.color)} />}
                                Configure {activeSource?.name}
                            </h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1">
                                Version 2.4.0 • Auto-Sync Supported
                            </p>
                        </div>
                        <button
                            onClick={reset}
                            className="p-2 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content Area - Removed padding, using px-8/10 for elements specifically */}
                    <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar flex flex-col">
                        {connectionStatus === 'success' ? (
                            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                                <div className="w-24 h-24 bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-8 shadow-sm">
                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h4 className="text-3xl font-black text-slate-900 uppercase mb-4 tracking-tight">Connection Successful</h4>
                                <p className="text-slate-500 font-medium mb-10 max-w-md text-center text-lg">
                                    <span className="font-bold text-slate-900">{activeSource?.name}</span> is now active and syncing data.
                                </p>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setConnectionStatus('idle')} className="px-8 py-4 bg-slate-100 text-slate-700 font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors rounded-none">
                                        Configure Another
                                    </button>
                                    <button onClick={onClose} className="px-8 py-4 bg-slate-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-black transition-colors rounded-none shadow-xl">
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-10 max-w-4xl mx-auto">
                                <div className="bg-blue-50/50 border border-blue-100 p-6 flex items-start gap-4">
                                    <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-1">Integration Note</h4>
                                        <p className="text-sm text-blue-800 leading-relaxed font-medium">
                                            Ensure your API Key has <span className="font-mono font-bold bg-blue-100 px-1">read_leads</span> permission to access the full dataset.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="group">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 group-focus-within:text-blue-600 transition-colors">
                                            API Key / Access Token <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={config.apiKey}
                                            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                            placeholder="sk_live_..."
                                            className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white outline-none transition-all font-mono text-base shadow-sm text-slate-900 placeholder:text-slate-300 rounded-none"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="group">
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 group-focus-within:text-blue-600 transition-colors">
                                                Account ID
                                            </label>
                                            <input
                                                type="text"
                                                value={config.accountId}
                                                onChange={(e) => setConfig({ ...config, accountId: e.target.value })}
                                                placeholder="e.g. 12938492"
                                                className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white outline-none transition-all text-base shadow-sm text-slate-900 placeholder:text-slate-300 rounded-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                                                Environment
                                            </label>
                                            <div className="relative">
                                                <select className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white outline-none transition-all text-base shadow-sm text-slate-900 appearance-none font-medium rounded-none">
                                                    <option>Production</option>
                                                    <option>Sandbox</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions - Fixed at bottom */}
                    {connectionStatus !== 'success' && (
                        <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                            <button onClick={onClose} className="px-8 py-3 text-slate-500 hover:text-slate-900 font-bold uppercase text-xs tracking-widest transition-colors">
                                Cancel
                            </button>
                            <div className="flex gap-4">
                                <button className="px-8 py-4 border border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900 font-bold uppercase text-xs tracking-widest shadow-sm transition-all rounded-none">
                                    Test Connection
                                </button>
                                <button
                                    onClick={handleConnect}
                                    disabled={connectionStatus === 'connecting'}
                                    className="px-10 py-4 bg-slate-900 text-white hover:bg-blue-600 font-bold uppercase text-xs tracking-widest shadow-xl shadow-slate-900/10 flex items-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed rounded-none"
                                >
                                    {connectionStatus === 'connecting' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" /> Connect Source
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
