import { useState } from 'react'
import { Plus, Mail, MessageSquare, Clock, ArrowRight, MoreHorizontal, Play, Pause, Trash2, GripVertical } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { FollowUpComposer } from '@/features/surveys/components/FollowUpComposer'

interface SequenceStep {
    id: string
    day: number
    type: 'email' | 'sms' | 'whatsapp'
    name: string
    status: 'active' | 'draft'
}

export function FollowUpManagerPage() {
    const [steps, setSteps] = useState<SequenceStep[]>([
        { id: '1', day: 0, type: 'email', name: 'Welcome Email', status: 'active' },
        { id: '2', day: 2, type: 'whatsapp', name: 'Check-in Message', status: 'active' },
        { id: '3', day: 5, type: 'sms', name: 'Reminder Alert', status: 'draft' },
    ])
    const [isComposerOpen, setIsComposerOpen] = useState(false)

    return (
        <div className="w-full mx-auto p-4 h-[calc(100vh-64px)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Follow-up Sequences</h1>
                    <p className="text-slate-500 font-medium mt-1">Design automated communication journeys for your leads.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none gap-2">
                        <Play className="w-4 h-4 text-emerald-600" /> Test Run
                    </Button>
                    <Button className="bg-slate-900 text-white rounded-none gap-2" onClick={() => setIsComposerOpen(true)}>
                        <Plus className="w-4 h-4" /> Add Step
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 overflow-y-auto relative rounded-none">
                <div className="absolute left-16 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700 border-l border-dashed" />

                <div className="space-y-8 max-w-2xl mx-auto">
                    {/* Trigger */}
                    <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-none flex items-center justify-center font-bold z-10 border-4 border-slate-50 dark:border-slate-900 shadow-sm">
                            Start
                        </div>
                        <Card className="flex-1 p-4 rounded-none border-l-4 border-l-slate-900">
                            <h3 className="font-bold text-slate-900 dark:text-white">Trigger: New Lead Created</h3>
                        </Card>
                    </div>

                    {/* Steps */}
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative flex items-start gap-4 group">
                            {/* Timeline Node */}
                            <div className="w-12 pt-2 flex flex-col items-center z-10">
                                <span className="text-xs font-bold bg-white dark:bg-slate-800 px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-full mb-2 whitespace-nowrap">
                                    {index === 0 ? 'Immediately' : `Day ${step.day}`}
                                </span>
                                <div className="w-3 h-3 bg-purple-600 rounded-full ring-4 ring-slate-50 dark:ring-slate-900" />
                            </div>

                            {/* Card */}
                            <Card className="flex-1 rounded-none border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group-hover:border-purple-200">
                                <div className="p-4 flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 cursor-move text-slate-300 hover:text-slate-500">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                        <div className={`
                                            w-10 h-10 flex items-center justify-center text-white rounded-none
                                            ${step.type === 'email' ? 'bg-blue-600' : step.type === 'whatsapp' ? 'bg-emerald-600' : 'bg-orange-500'}
                                        `}>
                                            {step.type === 'email' && <Mail className="w-5 h-5" />}
                                            {step.type === 'whatsapp' && <MessageSquare className="w-5 h-5" />}
                                            {step.type === 'sms' && <MessageSquare className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">{step.name}</h4>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                {step.type === 'email' ? 'Subject: Welcome to HouseFin...' : 'Message: "Hi {name}, thanks for..."'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge variant={step.status === 'active' ? 'default' : 'secondary'} className="rounded-none uppercase text-[10px]">
                                            {step.status}
                                        </Badge>
                                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}

                    {/* End */}
                    <div className="relative flex items-center gap-4 opacity-50">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center font-bold z-10 border-4 border-slate-50 dark:border-slate-900">
                            End
                        </div>
                        <div className="font-bold text-slate-400 uppercase text-sm tracking-wider">Sequence Complete</div>
                    </div>
                </div>
            </div>

            <FollowUpComposer isOpen={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
        </div>
    )
}
