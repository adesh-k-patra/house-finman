import { Bot, Clock, Zap, Save } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { cn } from '@/utils'

export function AISettingsPage() {
    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Configurations</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage automated follow-ups and insight generation settings.</p>
                </div>
                <Button className="bg-slate-900 text-white rounded-none gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Section 1: Personality */}
                <Card
                    className="md:col-span-2 rounded-none shadow-sm"
                    title="Agent Persona"
                    icon={<Bot className="w-5 h-5" />}
                    variant="purple"
                    padding="lg"
                >
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Tone of Voice</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Professional', 'Friendly', 'Urgent'].map(tone => (
                                    <button key={tone} className={cn(
                                        "px-4 py-3 border text-sm font-bold transition-all",
                                        tone === 'Professional'
                                            ? "border-purple-600 bg-purple-50 text-purple-700"
                                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                    )}>
                                        {tone}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Fallback Message</label>
                            <textarea
                                className="w-full h-24 p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-1 focus:ring-slate-900 outline-none resize-none rounded-none"
                                defaultValue="I'm not sure about that. Let me connect you with a human agent who can help better."
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Used when confidence score is below 60%.</p>
                        </div>
                    </div>
                </Card>

                {/* Section 2: Cadence */}
                <Card
                    className="rounded-none shadow-sm"
                    title="Sequence Timing"
                    icon={<Clock className="w-5 h-5" />}
                    variant="blue"
                    padding="lg"
                >
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Max Follow-ups</span>
                            <input type="number" className="w-16 p-1 border border-slate-300 text-center font-bold text-sm" defaultValue={3} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Delay (Hours)</span>
                            <input type="number" className="w-16 p-1 border border-slate-300 text-center font-bold text-sm" defaultValue={24} />
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase text-slate-500">Working Hours</span>
                                <Badge variant="outline" className="rounded-none text-[10px]">IST</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="time" className="border border-slate-300 p-1 text-xs" defaultValue="09:00" />
                                <input type="time" className="border border-slate-300 p-1 text-xs" defaultValue="18:00" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Section 3: Triggers */}
                <div className="md:col-span-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" /> Auto-Triggers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Survey Completed', 'Link Clicked', 'Partial Drop-off'].map((trigger, i) => (
                            <div key={trigger} className="border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex items-center justify-between group cursor-pointer hover:border-slate-400">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{trigger}</span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${i === 2 ? 'bg-slate-200' : 'bg-emerald-500'}`}>
                                    <div className={`absolute top-0.5 bottom-0.5 w-4 h-4 rounded-full bg-white transition-all ${i === 2 ? 'left-0.5' : 'right-0.5'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
