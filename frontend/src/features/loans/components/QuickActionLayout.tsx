import React from 'react';
import { cn } from '@/utils';
import { Layers } from 'lucide-react';

interface QuickActionLayoutProps {
    sidebar?: React.ReactNode;
    children: React.ReactNode;
    header?: React.ReactNode;
    className?: string;
    sidebarTitle?: string;
    sidebarSubtitle?: string;
}

export function QuickActionLayout({
    sidebar,
    children,
    header,
    className,
    sidebarTitle = "Global Action",
    sidebarSubtitle = "Manage Item"
}: QuickActionLayoutProps) {
    return (
        <div className={cn("flex h-[550px] w-full bg-white dark:bg-slate-950", className)}>
            {/* Sidebar (Dark Theme - Slate 900) */}
            {sidebar && (
                <div className="w-[280px] bg-[#0f172a] text-white p-8 flex flex-col border-r border-slate-800 shrink-0 relative overflow-hidden">
                    {/* Background Shine Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />

                    {/* Header */}
                    <div className="mb-10 pl-2 border-l-2 border-blue-500">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] leading-tight text-white mb-1">
                            {sidebarTitle}
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {sidebarSubtitle}
                        </p>
                    </div>

                    {/* Navigation Steps */}
                    <div className="flex-1 space-y-2">
                        {sidebar}
                    </div>

                    {/* Footer Logo area */}
                    <div className="pt-6 mt-auto border-t border-slate-800/50 flex items-center gap-3 opacity-50">
                        <Layers className="w-5 h-5 text-white" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none">House</p>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500 leading-none mt-0.5">FinMan</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative w-full overflow-hidden">
                {/* Content Header (Standard "Item Details" style) */}
                <div className="h-16 px-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Item Details</h3>
                    </div>
                    {/* Optional Right Side Header Content */}
                    {header}
                </div>

                {/* Content Body - 0 margins, scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                    {children}
                </div>
            </div>
        </div>
    );
}

export interface QuickSidebarItemProps {
    number: number | string;
    title: string;
    subtitle: string;
    active?: boolean;
    onClick?: () => void;
    className?: string; // Allow custom colors (e.g. red for danger steps)
    disabled?: boolean;
}

export const QuickSidebarItem = ({ number, title, subtitle, active = false, onClick, className, disabled }: QuickSidebarItemProps) => (
    <div
        onClick={!disabled ? onClick : undefined}
        className={cn(
            "group flex gap-4 items-center p-3 transition-all duration-300 rounded-none border-l-[3px]",
            active
                ? "bg-gradient-to-r from-blue-600/10 to-transparent border-blue-600 cursor-default"
                : "border-transparent",
            !active && !disabled && "hover:bg-white/5 cursor-pointer",
            disabled && "opacity-40 cursor-not-allowed grayscale",
            className
        )}
    >
        <div className={cn(
            "flex items-center justify-center w-8 h-8 text-xs font-bold rounded-none shadow-sm transition-all duration-300",
            active
                ? "bg-blue-600 text-white scale-110"
                : "bg-slate-800 text-slate-400",
            !disabled && !active && "group-hover:bg-slate-700 group-hover:text-white"
        )}>
            {number}
        </div>
        <div>
            <h4 className={cn(
                "text-xs font-bold uppercase tracking-wider transition-colors",
                active ? "text-white" : "text-slate-400",
                !disabled && !active && "group-hover:text-slate-200"
            )}>
                {title}
            </h4>
            <p className={cn(
                "text-[10px] leading-tight mt-0.5 transition-colors",
                active ? "text-blue-200" : "text-slate-600",
                !disabled && !active && "group-hover:text-slate-500"
            )}>
                {subtitle}
            </p>
        </div>
    </div>
);
