import * as React from 'react';
import { cn } from '@/utils';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, className, side = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={cn(
                        "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded shadow-sm whitespace-nowrap dark:bg-slate-50 dark:text-slate-900 animate-in fade-in zoom-in-95 duration-200",
                        positionClasses[side],
                        className
                    )}
                >
                    {content}
                    <div
                        className={cn(
                            "absolute w-2 h-2 bg-slate-900 dark:bg-slate-50 rotate-45",
                            side === 'top' && "bottom-[-4px] left-1/2 -translate-x-1/2",
                            side === 'bottom' && "top-[-4px] left-1/2 -translate-x-1/2",
                            side === 'left' && "right-[-4px] top-1/2 -translate-y-1/2",
                            side === 'right' && "left-[-4px] top-1/2 -translate-y-1/2"
                        )}
                    />
                </div>
            )}
        </div>
    );
}
