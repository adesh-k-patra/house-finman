import { useState } from 'react'
import { SideDrawer } from '@/components/ui/SideDrawer'
import { CheckSquare, Mail, MessageSquare, Send, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/utils'

interface SurveyTargetingEngineProps {
    isOpen: boolean
    onClose: () => void
    recipientCount: number
}

const SURVEYS = [
    { id: 's1', title: 'New Home Buyer Survey', questions: 15, avgTime: '4m' },
    { id: 's2', title: 'Post-Visit Feedback', questions: 5, avgTime: '1m' },
    { id: 's3', title: 'Investment Interest Survey', questions: 8, avgTime: '2m' },
]

export function SurveyTargetingEngine({ isOpen, onClose, recipientCount }: SurveyTargetingEngineProps) {
    const [step, setStep] = useState(1)
    const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null)
    const [selectedChannels, setSelectedChannels] = useState<string[]>(['email'])
    const [schedule, setSchedule] = useState<'now' | 'later'>('now')

    if (!isOpen) return null

    const handleSend = () => {
        // Logic to send survey
        onClose()
        setStep(1)
        setSelectedSurvey(null)
    }

    return (
        <SideDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Survey"
            footer={
                <div className="flex justify-between w-full">
                    {step > 1 ? (
                        <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-none text-sm font-medium">Back</button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            disabled={!selectedSurvey}
                            onClick={() => setStep(s => s + 1)}
                            className="bg-slate-900 text-white px-6 py-2 rounded-none text-sm font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={handleSend} className="bg-emerald-600 text-white px-6 py-2 rounded-none text-sm font-bold hover:bg-emerald-700 flex items-center gap-2">
                            <Send className="w-4 h-4" /> Send Flow
                        </button>
                    )}
                </div>
            }
        >
            <div className="px-6 py-4">
                {/* Progress */}
                <div className="flex items-center justify-between mb-8 px-4">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex flex-col items-center gap-2 relative">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all",
                                step === s ? "border-slate-900 bg-slate-900 text-white" :
                                    step > s ? "border-emerald-500 bg-emerald-500 text-white" :
                                        "border-slate-200 text-slate-300"
                            )}>
                                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                                {s === 1 ? 'Select Survey' : s === 2 ? 'Channel' : 'Review'}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-[34px] left-[50px] right-[50px] h-0.5 bg-slate-100 -z-10" />
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-fade-in-right">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose a Survey</h3>
                        <p className="text-sm text-slate-500 mb-4">Select which survey flow you want to trigger for the selected {recipientCount} applicants.</p>

                        <div className="space-y-3">
                            {SURVEYS.map(survey => (
                                <div
                                    key={survey.id}
                                    onClick={() => setSelectedSurvey(survey.id)}
                                    className={cn(
                                        "p-4 border rounded-none cursor-pointer transition-all flex items-center justify-between group",
                                        selectedSurvey === survey.id
                                            ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                                            : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-none", selectedSurvey === survey.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500")}>
                                            <CheckSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{survey.title}</h4>
                                            <p className="text-xs text-slate-500">{survey.questions} Questions • ~{survey.avgTime} completion time</p>
                                        </div>
                                    </div>
                                    {selectedSurvey === survey.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-fade-in-right">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Distribution Channels</h3>
                            <p className="text-sm text-slate-500 mb-4">How should we deliver this survey?</p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSelectedChannels(p => p.includes('email') ? p.filter(c => c !== 'email') : [...p, 'email'])}
                                    className={cn("p-4 border rounded-none text-left transition-all", selectedChannels.includes('email') ? "border-blue-500 bg-blue-50" : "border-slate-200")}
                                >
                                    <Mail className={cn("w-6 h-6 mb-3", selectedChannels.includes('email') ? "text-blue-500" : "text-slate-400")} />
                                    <div className="font-bold text-sm">Email</div>
                                    <div className="text-xs text-slate-500">Traditional, high deliverability</div>
                                </button>
                                <button
                                    onClick={() => setSelectedChannels(p => p.includes('whatsapp') ? p.filter(c => c !== 'whatsapp') : [...p, 'whatsapp'])}
                                    className={cn("p-4 border rounded-none text-left transition-all", selectedChannels.includes('whatsapp') ? "border-green-500 bg-green-50" : "border-slate-200")}
                                >
                                    <MessageSquare className={cn("w-6 h-6 mb-3", selectedChannels.includes('whatsapp') ? "text-green-500" : "text-slate-400")} />
                                    <div className="font-bold text-sm">WhatsApp</div>
                                    <div className="text-xs text-slate-500">High engagement, instant</div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scheduling</h3>
                            <div className="mt-3 flex gap-4">
                                <button
                                    onClick={() => setSchedule('now')}
                                    className={cn("flex items-center gap-2 px-4 py-2 rounded-none border text-sm font-medium", schedule === 'now' ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600")}
                                >
                                    <Send className="w-4 h-4" /> Send Immediately
                                </button>
                                <button
                                    onClick={() => setSchedule('later')}
                                    className={cn("flex items-center gap-2 px-4 py-2 rounded-none border text-sm font-medium", schedule === 'later' ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600")}
                                >
                                    <Calendar className="w-4 h-4" /> Schedule for Later
                                </button>
                            </div>
                            {schedule === 'later' && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-none border border-slate-100 flex gap-4">
                                    <input type="date" className="px-3 py-2 border rounded-none text-sm" />
                                    <input type="time" className="px-3 py-2 border rounded-none text-sm" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-fade-in-right">
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-none text-center">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Send className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-emerald-900">Ready to Launch</h3>
                            <p className="text-sm text-emerald-700 mt-1">
                                You are about to send <strong>{SURVEYS.find(s => s.id === selectedSurvey)?.title}</strong> to <strong>{recipientCount} applicants</strong> via <strong>{selectedChannels.join(' & ')}</strong>.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase text-slate-500">Projected Performance</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 border rounded-none text-center">
                                    <div className="text-lg font-bold text-slate-900">98%</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Delivery Rate</div>
                                </div>
                                <div className="p-3 border rounded-none text-center">
                                    <div className="text-lg font-bold text-slate-900">~{Math.floor(recipientCount * 0.4)}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Est. Responses</div>
                                </div>
                                <div className="p-3 border rounded-none text-center">
                                    <div className="text-lg font-bold text-slate-900">Low</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Risk Level</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SideDrawer>
    )
}
