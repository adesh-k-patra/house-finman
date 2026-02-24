import { X, ArrowLeft } from 'lucide-react'
import { cn } from '@/utils'
import { createPortal } from 'react-dom'
import { AnimatedLogo } from '@/components/logo/AnimatedLogo'


export interface WizardStep {
    id: number | string
    label: string
    description?: string
}

interface WizardModalProps {
    isOpen: boolean
    onClose: () => void

    // Sidebar Props
    title: string
    subtitle?: string
    steps: WizardStep[]
    currentStep: number
    onStepClick?: (stepId: number | string) => void

    // Content Props
    contentTitle: string
    onBack?: () => void
    showBackButton?: boolean
    children: React.ReactNode
    footer?: React.ReactNode

    // Customization
    sidebarWidth?: string // default 'w-1/3' or 'w-[300px]'
    maxWidth?: string // default 'max-w-5xl'
    fullWidthContent?: boolean
    contentClassName?: string
}

export function WizardModal({
    isOpen,
    onClose,
    title,
    subtitle,
    steps,
    currentStep,
    onStepClick,
    contentTitle,
    onBack,
    showBackButton = false,
    children,
    footer,
    sidebarWidth = 'w-[320px]',
    maxWidth = 'max-w-5xl',
    fullWidthContent = false,
    contentClassName
}: WizardModalProps) {
    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container - Sharp corners as requested */}
            <div className={cn(
                "relative flex flex-col md:flex-row w-full bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-scale-in",
                "h-[600px] md:h-auto md:min-h-[600px] max-h-[95vh]",
                maxWidth
            )}>

                {/* --- Left Sidebar (Dark Theme) --- */}
                <div className={cn(
                    "hidden md:flex flex-col relative",
                    "bg-[#0F172A] text-white p-8",
                    sidebarWidth
                )}>
                    {/* Header with Logo */}
                    <div className="mb-10">
                        <AnimatedLogo size="lg" className="mb-6" />
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-6 bg-primary-500 rounded-full" />
                            <h2 className="text-xl font-bold tracking-wide uppercase">{title}</h2>
                        </div>
                        {subtitle && (
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest ml-3">{subtitle}</p>
                        )}
                    </div>

                    {/* Steps */}
                    <div className="flex-1 space-y-8">
                        {steps.map((step, index) => {
                            const stepNumber = index + 1
                            // Assuming steps are ordered and currentStep is 1-based index or matching ID logic
                            // For simplicity using index+1 comparison
                            const isActive = stepNumber === currentStep
                            const isCompleted = stepNumber < currentStep

                            return (
                                <div
                                    key={step.id}
                                    onClick={() => onStepClick?.(step.id)}
                                    className={cn(
                                        "group flex items-start gap-4 transition-all duration-300",
                                        onStepClick ? "cursor-pointer" : "cursor-default",
                                        (isActive || isCompleted) ? "opacity-100" : "opacity-40"
                                    )}
                                >
                                    <div className={cn(
                                        "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-none font-bold text-sm border transition-colors duration-300",
                                        isActive ? "bg-primary-600 border-primary-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]" :
                                            isCompleted ? "bg-primary-600/20 border-primary-600 text-primary-400" :
                                                "border-slate-700 text-slate-500"
                                    )}>
                                        {stepNumber}
                                    </div>
                                    <div className="mt-1">
                                        <h3 className={cn(
                                            "font-bold text-sm tracking-wide uppercase mb-1",
                                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                                        )}>
                                            {step.label}
                                        </h3>
                                        {step.description && (
                                            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                                                {step.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Connection Line (except last item) */}
                                    {index !== steps.length - 1 && (
                                        <div className={cn(
                                            "absolute left-[47px] w-px h-8 bg-slate-800",
                                            // Dynamic height calculation would be better but fixed is ok for now
                                            // This is a visual decoration that might need absolute positioning relative to the parent container
                                        )}
                                            style={{ top: `calc(160px + ${index * 80}px)` }} // Rough approximation, CSS grid/flex preferred for robust lines
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Footer - Branding with Animated Logo */}
                    <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center gap-3">
                        <AnimatedLogo size="xs" showText={true} darkMode={true} />
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px] pointer-events-none" />
                </div>

                {/* --- Right Content (Light Theme) --- */}
                <div className="flex-1 flex flex-col bg-white dark:bg-[#0B1121] min-h-[500px]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            {showBackButton && (
                                <button
                                    onClick={onBack}
                                    className="p-1 -ml-2 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {contentTitle}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

    // Scrollable Content
                    <div className={cn(
                        "flex-1 overflow-y-auto custom-scrollbar",
                        contentClassName || "p-8"
                    )}>
                        <div className={cn(
                            "mx-auto w-full animate-fade-in",
                            fullWidthContent ? "max-w-none px-0" : "max-w-2xl"
                        )}>
                            {children}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {footer && (
                        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                            <div className="max-w-2xl mx-auto w-full flex items-center justify-end gap-3">
                                {footer}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
