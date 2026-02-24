import React, { useState } from 'react'
import { AlertTriangle, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSurveyBuilder } from '../contexts/SurveyBuilderContext'
import { cn } from '@/utils'

export function LiveSurveyGuard({ children }: { children: React.ReactNode }) {
    const { isLocked, setIsLocked, surveyStatus } = useSurveyBuilder()

    // If not locked, just render children
    // If not live, also just render (we only lock LIVE surveys)
    if (!isLocked || surveyStatus !== 'live') {
        return <>{children}</>
    }

    return (
        <div className="relative h-full w-full">
            {/* The Actual Content (Blurred) */}
            <div className="absolute inset-0 filter blur-sm pointer-events-none select-none opacity-50">
                {children}
            </div>

            {/* The Guard Modal */}
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden animate-in zoom-in-95 duration-200">

                    {/* Top Stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />

                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-orange-600" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                        Survey is Live
                    </h2>

                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        This survey is currently collecting responses. Editing it now may cause <b>data inconsistency</b> or break the experience for active users.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-none font-bold uppercase tracking-wider"
                            onClick={() => window.history.back()}
                        >
                            Go Back
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 font-bold"
                            onClick={() => setIsLocked(false)}
                        >
                            <Unlock className="w-4 h-4 mr-2" />
                            Edit Anyway (Pause Survey)
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
