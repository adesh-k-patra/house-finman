import { useState } from 'react'
import { CheckSquare, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

// B.79 Onboarding Checklist Widget
export function OnboardingChecklist() {
    const [isOpen, setIsOpen] = useState(true)
    const [progress, setProgress] = useState(25)

    const steps = [
        { id: 1, label: 'Create your first survey', completed: true },
        { id: 2, label: 'Customize the theme', completed: false },
        { id: 3, label: 'Add 3 questions', completed: false },
        { id: 4, label: 'Publish and share link', completed: false },
    ]

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 font-bold shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2"
            >
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Setup Guide
            </button>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
            <Card className="w-80 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-none overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(false)}>
                    <div>
                        <h3 className="font-bold text-sm">Getting Started</h3>
                        <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 space-y-3">
                    {steps.map(step => (
                        <div key={step.id} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-1 -mx-1 rounded">
                            <div className={`
                                w-5 h-5 rounded border flex items-center justify-center transition-colors
                                ${step.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}
                            `}>
                                {step.completed && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`text-sm font-medium ${step.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                {step.label}
                            </span>
                            {!step.completed && (
                                <PlayCircle className="w-4 h-4 text-purple-600 ml-auto opacity-0 group-hover:opacity-100" />
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
