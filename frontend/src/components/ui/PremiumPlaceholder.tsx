import React from 'react'
import { Construction, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface PremiumPlaceholderProps {
    title: string
    description: string
    icon?: any
    actionLabel?: string
    onAction?: () => void
}

export function PremiumPlaceholder({ title, description, icon: Icon = Construction, actionLabel = "Return to Dashboard", onAction }: PremiumPlaceholderProps) {
    const navigate = useNavigate()

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">

            {/* Sharp Card */}
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-12 max-w-lg w-full relative overflow-hidden shadow-2xl">

                {/* Decorative Sharp Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-600" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-600" />

                {/* Content */}
                <div className="flex flex-col items-center relative z-10">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 rounded-none border border-slate-200 dark:border-slate-700">
                        <Icon className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                    </div>

                    <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest mb-4">
                        Coming Soon
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                        {title}
                    </h1>

                    <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
                        {description}
                    </p>

                    <Button
                        size="lg"
                        onClick={onAction || (() => navigate('/dashboard'))}
                        className="rounded-none font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-lg w-full"
                    >
                        {actionLabel}
                    </Button>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                />
            </div>
        </div>
    )
}
