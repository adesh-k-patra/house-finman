import * as React from 'react';
import { cn } from '@/utils';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ className, checked, onCheckedChange, ...props }: CheckboxProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(e.target.checked);
    };

    return (
        <div className="relative inline-flex items-center">
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={handleChange}
                {...props}
            />
            <div
                className={cn(
                    "h-4 w-4 shrink-0 rounded-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900 transition-all cursor-pointer",
                    checked && "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500",
                    className
                )}
            >
                <Check className={cn("h-3.5 w-3.5 text-white dark:text-slate-900 hidden", checked && "block")} />
            </div>
        </div>
    );
}
