import React from 'react';
import { cn } from '@/utils';
import { AlertCircle, FileText, AlignLeft } from 'lucide-react';

interface BaseInputProps {
    label?: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    error?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

export function ShortTextInput({
    label,
    placeholder = 'Type your answer here...',
    description,
    required,
    error,
    value,
    onChange,
    className,
    disabled
}: BaseInputProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {(label || description) && (
                <div className="space-y-1">
                    {label && (
                        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            {label}
                            {required && <span className="text-red-500">*</span>}
                        </label>
                    )}
                    {description && (
                        <p className="text-xs text-slate-500">{description}</p>
                    )}
                </div>
            )}

            <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400">
                    <FileText className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        "w-full px-10 py-2.5 bg-white dark:bg-slate-900 border text-sm font-medium transition-colors",
                        "border-slate-300 dark:border-slate-700",
                        "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                        "placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10" : "hover:border-slate-400 dark:hover:border-slate-600"
                    )}
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                </div>
            )}
        </div>
    );
}

export function LongTextInput({
    label,
    placeholder = 'Type your detailed answer here...',
    description,
    required,
    error,
    value,
    onChange,
    className,
    disabled
}: BaseInputProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {(label || description) && (
                <div className="space-y-1">
                    {label && (
                        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            {label}
                            {required && <span className="text-red-500">*</span>}
                        </label>
                    )}
                    {description && (
                        <p className="text-xs text-slate-500">{description}</p>
                    )}
                </div>
            )}

            <div className="relative">
                <div className="absolute top-3 left-3 text-slate-400">
                    <AlignLeft className="w-4 h-4" />
                </div>
                <textarea
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={4}
                    className={cn(
                        "w-full px-10 py-3 bg-white dark:bg-slate-900 border text-sm font-medium transition-colors resize-none",
                        "border-slate-300 dark:border-slate-700",
                        "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                        "placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10" : "hover:border-slate-400 dark:hover:border-slate-600"
                    )}
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                </div>
            )}
        </div>
    );
}
