
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils';
import { AlertCircle } from 'lucide-react';

interface SliderRatingProps {
    label?: string;
    description?: string;
    required?: boolean;
    error?: string;
    className?: string;
    min?: number;
    max?: number;
    step?: number;
    value?: number | [number, number];
    onChange?: (value: number | [number, number]) => void;
    showInput?: boolean;
    unit?: string; // e.g., 'cr', 'L', '%'
    labels?: { [key: number]: string };
    isRange?: boolean;
    formatValue?: (val: number) => string;
}

export function SliderRating({
    label,
    description,
    required,
    error,
    className,
    min = 0,
    max = 100,
    step = 1,
    value = 0,
    onChange,
    showInput = true,
    unit = '',
    labels,
    isRange = false,
    formatValue
}: SliderRatingProps) {
    // Determine initial state based on isRange
    const initialValue: number | [number, number] = isRange
        ? (Array.isArray(value) ? (value as [number, number]) : [min, max])
        : (typeof value === 'number' ? value : min);

    const [localValue, setLocalValue] = useState<number | [number, number]>(initialValue);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Format display value
    const formatDisplay = (val: number) => {
        if (formatValue) return formatValue(val);
        return `${val}${unit}`;
    };

    // Single Handler
    const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setLocalValue(val);
        onChange?.(val);
    };

    // Range Handlers
    const handleRangeChange = (index: 0 | 1, newVal: number) => {
        if (!Array.isArray(localValue)) return;

        const nextValue = [...localValue] as [number, number];
        nextValue[index] = newVal;

        // Prevent crossing
        if (index === 0 && nextValue[0] > nextValue[1]) nextValue[0] = nextValue[1];
        if (index === 1 && nextValue[1] < nextValue[0]) nextValue[1] = nextValue[0];

        setLocalValue(nextValue);
        onChange?.(nextValue);
    };

    // Calculations
    const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

    const leftPercent = Array.isArray(localValue) ? getPercentage(localValue[0]) : 0;
    const rightPercent = Array.isArray(localValue) ? getPercentage(localValue[1]) : getPercentage(localValue as number);
    const widthPercent = Array.isArray(localValue) ? rightPercent - leftPercent : rightPercent;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Label Section */}
            {(label || description) && (
                <div className="space-y-1">
                    {label && (
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                {label}
                                {required && <span className="text-red-500">*</span>}
                            </label>
                            {showInput && (
                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 border border-blue-100 dark:border-blue-800">
                                    {Array.isArray(localValue)
                                        ? `${formatDisplay(localValue[0])} - ${formatDisplay(localValue[1])}`
                                        : formatDisplay(localValue as number)
                                    }
                                </div>
                            )}
                        </div>
                    )}
                    {description && (
                        <p className="text-xs text-slate-500">{description}</p>
                    )}
                </div>
            )}

            {/* Range Slider Track */}
            <div className="relative pt-6 pb-2 select-none group" ref={trackRef}>
                {/* Track Background */}
                <div className="relative h-2 bg-slate-200 dark:bg-slate-700 w-full">
                    {/* Active Fill */}
                    <div
                        className="absolute h-full bg-blue-600 dark:bg-blue-500 pointer-events-none"
                        style={{ left: `${Array.isArray(localValue) ? leftPercent : 0}%`, width: `${widthPercent}%` }}
                    />

                    {/* Single Thumb Input */}
                    {!isRange && (
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={localValue as number}
                            onChange={handleSingleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                    )}

                    {/* Range Thumb Inputs (Invisible but interactive) */}
                    {isRange && Array.isArray(localValue) && (
                        <>
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={localValue[0]}
                                onChange={(e) => handleRangeChange(0, parseFloat(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none z-20"
                                style={{ pointerEvents: 'all', clipPath: `inset(0 ${100 - rightPercent}% 0 0)` }}
                            />
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={localValue[1]}
                                onChange={(e) => handleRangeChange(1, parseFloat(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none z-20"
                                style={{ pointerEvents: 'all', clipPath: `inset(0 0 0 ${leftPercent}%)` }}
                            />
                        </>
                    )}

                    {/* Visual Thumbs */}
                    {isRange && Array.isArray(localValue) ? (
                        <>
                            {/* Left Thumb */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-md transition-transform hover:scale-110 z-30"
                                style={{ left: `${leftPercent}%`, transform: `translate(-50%, -50%)` }}
                            />
                            {/* Right Thumb */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-md transition-transform hover:scale-110 z-30"
                                style={{ left: `${rightPercent}%`, transform: `translate(-50%, -50%)` }}
                            />
                        </>
                    ) : (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-md transition-transform hover:scale-110 z-30 pointer-events-none"
                            style={{ left: `${rightPercent}%`, transform: `translate(-50%, -50%)` }}
                        />
                    )}
                </div>

                {/* Min/Max Labels */}
                <div className="flex justify-between mt-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <span>{labels?.[min] ?? formatDisplay(min)}</span>
                    <span>{labels?.[max] ?? formatDisplay(max)}</span>
                </div>
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
