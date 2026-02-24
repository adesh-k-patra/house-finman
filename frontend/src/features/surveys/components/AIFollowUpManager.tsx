import { useState } from 'react'
import {
    MessageSquare, Mail, Phone, Clock, ArrowRight, Plus, Trash2,
    Settings, Zap, AlertTriangle, CheckCircle2, Play
} from 'lucide-react'
import { Button, Card, Checkbox } from '@/components/ui'
import { cn } from '@/utils'

// ============ MOCK DATA ============

type Channel = 'whatsapp' | 'sms' | 'email' | 'call'

interface SequenceStep {
    id: string
    name: string
    delay: string // e.g., "2 hours", "1 day"
    condition: string // e.g., "If no reply", "If negative sentiment"
    channel: Channel
    template: string
    enabled: boolean
}

const defaultSteps: SequenceStep[] = [
    { id: 's1', name: 'Immediate Acknowledgement', delay: 'Instant', condition: 'Always', channel: 'whatsapp', template: 'Thanks for your feedback!', enabled: true },
    { id: 's2', name: 'Nudge for detailed review', delay: '24 hours', condition: 'If incomplete', channel: 'email', template: 'Complete your survey to unlock...', enabled: true },
    { id: 's3', name: 'Manager Escalation', delay: 'Immediate', condition: 'If Detractor (NPS < 6)', channel: 'call', template: 'Assign task to Agent', enabled: true },
    { id: 's4', name: 'Final Reminder', delay: '3 days', condition: 'If no reply', channel: 'sms', template: 'Last chance to share feedback...', enabled: true },
]

// ============ MAIN COMPONENT ============

export function AIFollowUpManager() {
    const [steps, setSteps] = useState<SequenceStep[]>(defaultSteps)
    const [activeTab, setActiveTab] = useState<'sequences' | 'channels'>('sequences')

    const toggleStep = (id: string) => {
        setSteps(steps.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
    }

    const deleteStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id))
    }

    const getChannelIcon = (channel: Channel) => {
        switch (channel) {
            case 'whatsapp': return <MessageSquare className="w-4 h-4" />
            case 'sms': return <Phone className="w-4 h-4" />
            case 'email': return <Mail className="w-4 h-4" />
            case 'call': return <Phone className="w-4 h-4" />
        }
    }

    const getChannelColor = (channel: Channel) => {
        switch (channel) {
            case 'whatsapp': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
            case 'sms': return 'text-blue-600 bg-blue-50 border-blue-200'
            case 'email': return 'text-purple-600 bg-purple-50 border-purple-200'
            case 'call': return 'text-orange-600 bg-orange-50 border-orange-200'
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-fade-in shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> AI Follow-up Manager
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Configure automated sequences based on respondent behavior.</p>
                </div>
                <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                    <button
                        onClick={() => setActiveTab('sequences')}
                        className={cn(
                            "px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                            activeTab === 'sequences' ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Sequences
                    </button>
                    <button
                        onClick={() => setActiveTab('channels')}
                        className={cn(
                            "px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                            activeTab === 'channels' ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Channels
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50">
                {activeTab === 'sequences' && (
                    <div className="max-w-3xl mx-auto">
                        <div className="relative space-y-8 pl-8 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-700 before:border-l before:border-dashed">
                            {steps.map((step, index) => (
                                <div key={step.id} className="relative group animate-slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
                                    {/* Timeline Node */}
                                    <div className="absolute -left-[45px] top-6 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 z-10 shadow-sm group-hover:border-primary-500 transition-colors">
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-primary-600">{index + 1}</span>
                                    </div>

                                    <Card className={cn(
                                        "rounded-none border-l-4 transition-all duration-300 hover:shadow-md",
                                        step.enabled ? "border-l-primary-500 opacity-100" : "border-l-slate-300 opacity-60 grayscale-[0.5]"
                                    )}>
                                        <div className="p-5 flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={cn(
                                                "w-12 h-12 flex items-center justify-center border-2 shrink-0 rounded-none",
                                                getChannelColor(step.channel)
                                            )}>
                                                {getChannelIcon(step.channel)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-sm">{step.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox checked={step.enabled} onCheckedChange={() => toggleStep(step.id)} />
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        Wait: {step.delay}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-amber-700 dark:text-amber-500 font-medium">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Condition: {step.condition}
                                                    </div>
                                                </div>

                                                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-sm italic text-slate-600 dark:text-slate-400 font-serif">
                                                    "{step.template}"
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none hover:bg-slate-100 text-slate-400 hover:text-slate-900"><Settings className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none hover:bg-red-50 text-slate-400 hover:text-red-500" onClick={() => deleteStep(step.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </Card>

                                    {/* Connector Arrow */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-[50%] -bottom-6 transform -translate-x-1/2 hidden">
                                            <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add Step Button */}
                            <div className="relative group pl-2">
                                <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary-600 transition-colors w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 group-hover:border-primary-500 bg-transparent hover:bg-primary-50/10">
                                    <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-primary-100">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    Add Sequence Step
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'channels' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { id: 'whatsapp', name: 'WhatsApp Business', status: 'connected', stats: '98% Delivery' },
                            { id: 'sms', name: 'Twilio SMS', status: 'connected', stats: '92% Delivery' },
                            { id: 'email', name: 'SendGrid Email', status: 'connected', stats: '85% Open Rate' },
                            { id: 'call', name: 'Exotel Voice', status: 'disconnected', stats: 'Not configured' },
                        ].map(c => (
                            <Card key={c.id} className="p-6 rounded-none border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 flex items-center justify-center border-2 rounded-none",
                                        c.status === 'connected' ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-slate-200 bg-slate-50 text-slate-400"
                                    )}>
                                        {c.id === 'whatsapp' && <MessageSquare className="w-6 h-6" />}
                                        {c.id === 'sms' && <Phone className="w-6 h-6" />}
                                        {c.id === 'email' && <Mail className="w-6 h-6" />}
                                        {c.id === 'call' && <Phone className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-sm">{c.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={cn("w-2 h-2 rounded-full", c.status === 'connected' ? "bg-emerald-500" : "bg-slate-300")} />
                                            <span className="text-xs text-slate-500 capitalize">{c.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{c.stats}</p>
                                    <Button variant="ghost" size="sm" className="mt-2 text-primary-600 hover:text-primary-700 p-0 h-auto text-xs font-bold uppercase">Configure</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
