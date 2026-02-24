import { useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

interface SurveyStepperProps {
    steps: {
        id: string
        label: string
        status: 'pending' | 'current' | 'completed'
    }[]
    onStepClick: (id: string) => void
}

export function SurveyStepper({ steps, onStepClick }: SurveyStepperProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10 -translate-y-1/2" />

                {steps.map((step, index) => {
                    const isCompleted = step.status === 'completed'
                    const isCurrent = step.status === 'current'

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-white dark:bg-slate-900 px-4 z-10">
                            <button
                                onClick={() => onStepClick(step.id)}
                                disabled={step.status === 'pending'}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center border-2 transition-all rounded-full mb-2",
                                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                                        isCurrent ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900" :
                                            "bg-white border-slate-300 text-slate-500 dark:bg-slate-900 dark:border-slate-600"
                                )}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                            </button>
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider",
                                isCompleted ? "text-emerald-600 dark:text-emerald-400" :
                                    isCurrent ? "text-slate-900 dark:text-white" :
                                        "text-slate-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
