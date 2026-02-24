import React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { X, ArrowRight } from 'lucide-react';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: React.ComponentType<{ className?: string }>;
    colorClass?: string;
    children: React.ReactNode;
    primaryAction?: string;
    onPrimaryAction?: () => void;
    primaryVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success' | 'warning';
    secondaryAction?: string;
    onSecondaryAction?: () => void;
    maxWidth?: string;
    hideFooter?: boolean;
    primaryDisabled?: boolean;
}

export function ModalWrapper({
    isOpen,
    onClose,
    title,
    subtitle,
    icon: Icon,
    colorClass = "text-slate-900",
    children,
    primaryAction,
    onPrimaryAction,
    primaryVariant = 'primary',
    secondaryAction = 'Cancel',
    onSecondaryAction,
    maxWidth = 'max-w-xl',
    hideFooter = false,
    primaryDisabled = false
}: ModalWrapperProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={cn(
                "w-full bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]",
                maxWidth
            )}>
                {/* Header - Glassmorphic & Sharp */}
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex justify-between items-start shrink-0">
                    <div className="flex gap-4">
                        {Icon && (
                            <div className={cn(
                                "mt-1 p-2 rounded-none flex items-center justify-center",
                                colorClass.replace('text-', 'bg-').replace('700', '50').replace('600', '50')
                            )}>
                                <Icon className={cn("w-6 h-6", colorClass)} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{title}</h3>
                            {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content - Fit to borders */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
                    {children}
                </div>

                {/* Footer - Sharp Actions */}
                {!hideFooter && (primaryAction || secondaryAction) && (
                    <div className="px-6 py-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                        {secondaryAction && (
                            <Button
                                variant="ghost"
                                onClick={onSecondaryAction || onClose}
                                className="rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs h-10 px-6"
                            >
                                {secondaryAction}
                            </Button>
                        )}
                        {primaryAction && onPrimaryAction && (
                            <Button
                                variant={primaryVariant}
                                className={cn(
                                    "rounded-none min-w-[140px] shadow-sm font-bold uppercase tracking-wider text-xs h-10 px-6 flex items-center justify-center gap-2 backdrop-blur-sm transition-all duration-300",
                                    // Custom Color Variants requested by User
                                    primaryVariant === 'primary' && "bg-blue-600/90 hover:bg-blue-600 text-white border-transparent hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]",
                                    primaryVariant === 'success' && "bg-emerald-600/90 hover:bg-emerald-600 text-white border-transparent hover:shadow-[0_0_20px_rgba(5,150,105,0.3)]",
                                    primaryVariant === 'danger' && "bg-red-600/90 hover:bg-red-600 text-white border-transparent hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]",
                                    primaryVariant === 'warning' && "bg-amber-500/90 hover:bg-amber-500 text-white border-transparent hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                                )}
                                onClick={onPrimaryAction}
                                disabled={primaryDisabled}
                            >
                                {primaryAction} <ArrowRight className="w-4 h-4 opacity-50" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
