
import { useState } from 'react'
import { X, CheckCircle2, Loader2, ShieldCheck, Key } from 'lucide-react'
import { Button } from '@/components/ui'

interface ConnectIntegrationModalProps {
    isOpen: boolean
    onClose: () => void
    integrationName: string
    icon?: React.ElementType
    onConnect: () => void
}

export function ConnectIntegrationModal({ isOpen, onClose, integrationName, icon: Icon, onConnect }: ConnectIntegrationModalProps) {
    if (!isOpen) return null

    const [step, setStep] = useState(1) // 1: Auth, 2: Connecting, 3: Success

    const handleConnect = () => {
        setStep(2)
        setTimeout(() => {
            setStep(3)
        }, 2000)
    }

    const handleFinish = () => {
        onConnect()
        setStep(1)
        onClose()
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-sm shadow-xl z-50 animate-fade-in border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connect {integrationName}</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
                </div>

                <div className="p-8 text-center space-y-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center">
                                {Icon ? <Icon className="w-8 h-8 text-slate-600 dark:text-slate-300" /> : <Key className="w-8 h-8 text-slate-400" />}
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Authentication Required</h3>
                                <p className="text-sm text-slate-500 mt-1">You need to authenticate with {integrationName} to allow access to your data.</p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-sm flex items-start text-left gap-3">
                                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-700 dark:text-blue-400">Secure Connection</p>
                                    <p className="text-blue-600/80 dark:text-blue-400/80 text-xs">Your credentials are encrypted and never stored on our servers.</p>
                                </div>
                            </div>

                            <Button variant="primary" className="w-full" onClick={handleConnect}>Authenticate & Connect</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 py-8 animate-fade-in">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Establishing secure connection...</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connected Successfully!</h3>
                                <p className="text-sm text-slate-500 mt-1">{integrationName} is now synced with your account.</p>
                            </div>
                            <Button variant="primary" className="w-full" onClick={handleFinish}>Done</Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
