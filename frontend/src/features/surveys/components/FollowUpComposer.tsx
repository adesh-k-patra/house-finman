import { useState } from 'react'
import {
    Send, X, MessageSquare, Mail, Phone, Calendar,
    User, Paperclip, Zap, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface FollowUpComposerProps {
    isOpen: boolean
    onClose: () => void
}

export function FollowUpComposer({ isOpen, onClose }: FollowUpComposerProps) {
    if (!isOpen) return null

    const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp'>('email')

    const [sending, setSending] = useState(false)

    const handleSend = () => {
        setSending(true)
        setTimeout(() => {
            setSending(false)
            onClose()
        }, 1500)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl shadow-2xl animate-scale-in border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh] rounded-none">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Send className="w-4 h-4 text-purple-600" /> New Follow-up
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Compose a manual follow-up message</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-48 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 p-4 shrink-0">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Channel</label>
                                <div className="space-y-1">
                                    {[
                                        { id: 'email', label: 'Email', icon: Mail },
                                        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                                        { id: 'sms', label: 'SMS', icon: Phone },
                                    ].map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setChannel(c.id as any)}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border rounded-none",
                                                channel === c.id
                                                    ? "bg-white dark:bg-slate-800 text-purple-600 border-purple-200 dark:border-purple-800 shadow-sm"
                                                    : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            <c.icon className="w-4 h-4" /> {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Recipients</label>
                                <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm grid gap-1">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-slate-400" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Selected (12)</span>
                                    </div>
                                    <div className="text-xs text-slate-500 pl-5">
                                        Detractors from Q1 Survey
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Composer */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto">
                        <div className="p-6 space-y-4">
                            {channel === 'email' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="Enter subject line..."
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-none"
                                    />
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Message Content</label>
                                    <div className="flex items-center gap-2">
                                        <button className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700">
                                            <Zap className="w-3 h-3" /> AI Enhance
                                        </button>
                                        <button className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-700">
                                            <Paperclip className="w-3 h-3" /> Attach
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full h-64 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none font-mono rounded-none"
                                    placeholder={channel === 'email' ? "Write your email here..." : "Type message..."}
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {['{first_name}', '{last_name}', '{company}', '{survey_link}'].map(token => (
                                    <button
                                        key={token}
                                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap rounded-none"
                                    >
                                        {token}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>Send Immediately</span>
                        <ChevronDown className="w-3 h-3 cursor-pointer hover:text-slate-700" />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="rounded-none uppercase font-bold text-xs h-9">Discard</Button>
                        <Button
                            variant="primary"
                            onClick={handleSend}
                            disabled={sending}
                            className="rounded-none uppercase font-bold text-xs h-9 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20"
                            leftIcon={sending ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-3 h-3" />}
                        >
                            {sending ? 'Sending...' : 'Send Message'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
