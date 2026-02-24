import { Sparkles, Bot, Send } from 'lucide-react'
import { Button } from '@/components/ui'

export function SmartComposer() {
    return (
        <div className="h-full flex flex-col max-w-3xl mx-auto p-6">
            <div className="text-center mb-8 mt-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3 h-3" /> AI Copilot Active
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">What do you want to ask?</h2>
                <p className="text-slate-500">Describe your research goal, and I'll generate the perfect questions.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2">
                <textarea
                    className="w-full min-h-[120px] p-4 bg-transparent border-none focus:outline-none text-lg resize-none"
                    placeholder="e.g. Create a 5-question logic flow to qualify home buyers with a budget over ₹1Cr..."
                />
                <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex gap-2">
                        {/* Tags/Pills for context */}
                        <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200">
                            + Lead Qual
                        </button>
                        <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200">
                            + Feedback
                        </button>
                    </div>
                    <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none">
                        Generate <Sparkles className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Example Prompts */}
                {['Qualify high-intent buyers', 'Post-site visit feedback', 'Loan eligibility check'].map((prompt, i) => (
                    <button key={i} className="p-4 text-left border border-slate-200 dark:border-slate-800 rounded-lg hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-2 mb-1">
                            <Bot className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Try asking...</span>
                        </div>
                        <p className="text-slate-500 text-sm">"{prompt}"</p>
                    </button>
                ))}
            </div>
        </div>
    )
}
