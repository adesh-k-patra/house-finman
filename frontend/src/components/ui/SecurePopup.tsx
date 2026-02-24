import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface SecurePopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    severity?: 'info' | 'warning' | 'critical';
}

export function SecurePopup({
    isOpen,
    onClose,
    title,
    children,
    severity = 'info'
}: SecurePopupProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const severityStyles = {
        info: 'border-slate-700 shadow-slate-900/50',
        warning: 'border-amber-500/50 shadow-amber-900/20',
        critical: 'border-red-500/50 shadow-red-900/20'
    };

    const headerStyles = {
        info: 'bg-slate-900/90 border-b border-slate-700/50',
        warning: 'bg-amber-950/30 border-b border-amber-500/30 text-amber-500',
        critical: 'bg-red-950/30 border-b border-red-500/30 text-red-500'
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                        className={cn(
                            "relative w-full max-w-lg bg-[#0F172A] border overflow-hidden shadow-2xl flex flex-col",
                            severityStyles[severity]
                        )}
                        style={{ borderRadius: 0 }}
                    >
                        {/* Security Header Bar */}
                        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

                        {/* Main Header */}
                        <div className={cn("px-6 py-5 flex items-center justify-between", headerStyles[severity])}>
                            <div className="flex items-center gap-3">
                                {severity === 'critical' ? (
                                    <div className="p-1.5 bg-red-500/10 border border-red-500/20" style={{ borderRadius: 0 }}>
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors" style={{ borderRadius: 0 }}>
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-lg font-bold tracking-wide text-white font-mono uppercase">
                                        {title}
                                    </h2>
                                    {severity === 'critical' && <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase">System Alert</span>}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                                style={{ borderRadius: 0 }}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6 text-slate-300 bg-[#0F172A]">
                            <div className="mb-8">
                                {children}
                            </div>

                            {/* Security Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 text-[10px] text-slate-500 font-mono uppercase tracking-widest bg-[#0B1120] -mx-6 -mb-6 px-6 py-3">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-3 h-3 text-slate-600" />
                                    <span>End-to-End Encrypted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    SEC-ID: {Math.random().toString(36).substring(2, 8).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
