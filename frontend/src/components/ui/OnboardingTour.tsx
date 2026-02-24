import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, MapPin } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface TourStep {
    target: string // CSS selector
    title: string
    content: string
    position?: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTourProps {
    steps: TourStep[]
    isOpen: boolean
    onComplete: () => void
    onSkip: () => void
}

export function OnboardingTour({ steps, isOpen, onComplete, onSkip }: OnboardingTourProps) {
    const [currentStep, setCurrentStep] = useState(0)

    if (!isOpen) return null

    const step = steps[currentStep]
    const isLast = currentStep === steps.length - 1

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-[1px] animate-fade-in pointer-events-auto">
            {/* Spotlight Hole (Simulated via overlay for now, real implementation needs complex SVG or CSS clip-path) */}

            {/* Tooltip Card - Positioned centrally for demo, but logically would follow target */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-slate-900 shadow-2xl border-l-4 border-l-blue-500 border-y border-r border-slate-200 dark:border-slate-700 animate-scale-in">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-none">
                                STEP {currentStep + 1}/{steps.length}
                            </span>
                        </div>
                        <button onClick={onSkip} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        {step.content}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-colors",
                                        i === currentStep ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(prev => prev - 1)} className="rounded-none">
                                    Back
                                </Button>
                            )}
                            <Button
                                size="sm"
                                onClick={() => isLast ? onComplete() : setCurrentStep(prev => prev + 1)}
                                className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-none gap-1"
                            >
                                {isLast ? 'Finish' : 'Next'} <ChevronRight className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
