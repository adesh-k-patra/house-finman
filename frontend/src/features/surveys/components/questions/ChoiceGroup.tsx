import React from 'react';
import { cn } from '@/utils';
import { AlertCircle, Check } from 'lucide-react';

interface Option {
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

interface ChoiceGroupProps {
    label?: string;
    description?: string;
    required?: boolean;
    error?: string;
    className?: string;
    options: Option[];
    value?: string | string[]; // Single string for radio, array for checkbox
    onChange?: (value: string | string[]) => void;
    multiSelect?: boolean;
    layout?: 'vertical' | 'horizontal' | 'grid';
}

export function ChoiceGroup({
    label,
    description,
    required,
    error,
    className,
    options,
    value,
    onChange,
    multiSelect = false,
    layout = 'vertical'
}: ChoiceGroupProps) {

    const isSelected = (optionId: string) => {
        if (Array.isArray(value)) {
            return value.includes(optionId);
        }
        return value === optionId;
    };

    const handleSelect = (optionId: string) => {
        if (multiSelect) {
            const currentValues = Array.isArray(value) ? value : [];
            if (currentValues.includes(optionId)) {
                onChange?.(currentValues.filter(id => id !== optionId));
            } else {
                onChange?.([...currentValues, optionId]);
            }
        } else {
            onChange?.(optionId);
        }
    };

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

            <div className={cn(
                "gap-3",
                layout === 'vertical' && "flex flex-col",
                layout === 'horizontal' && "flex flex-row flex-wrap",
                layout === 'grid' && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}>
                {options.map((option) => {
                    const selected = isSelected(option.id);
                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelect(option.id)}
                            className={cn(
                                "group relative flex items-start gap-3 p-4 text-left transition-all border outline-none",
                                "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700",
                                selected
                                    ? "border-l-4 border-l-blue-600 border-t-slate-200 border-r-slate-200 border-b-slate-200 bg-blue-50/30 dark:bg-blue-900/10 dark:border-t-slate-700 dark:border-r-slate-700 dark:border-b-slate-700"
                                    : "border-l-4 border-l-transparent hover:border-l-slate-300 dark:hover:border-l-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-5 h-5 mt-0.5 border transition-colors shrink-0",
                                multiSelect ? "rounded-none" : "rounded-full",
                                selected
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-blue-400"
                            )}>
                                {selected && <Check className="w-3.5 h-3.5" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    {option.icon && (
                                        <span className={cn(
                                            "text-slate-500",
                                            selected ? "text-blue-600 dark:text-blue-400" : ""
                                        )}>
                                            {option.icon}
                                        </span>
                                    )}
                                    <span className={cn(
                                        "text-sm font-bold",
                                        selected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-200"
                                    )}>
                                        {option.label}
                                    </span>
                                </div>
                                {option.description && (
                                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                        {option.description}
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 p-2 border-l-2 border-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                </div>
            )}
        </div>
    );
}
