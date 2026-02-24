import { useState, useEffect } from 'react'
import {
    X, Smartphone, Tablet, Globe, Check, CheckCircle
} from 'lucide-react'
import { cn } from '@/utils'

// Types (should match your project types)
export interface QuestionOption {
    id: string
    text: string
    nextQuestionId?: string
}

export interface Question {
    id: string
    type: string
    text: string
    description?: string
    options: QuestionOption[]
    logicType: 'independent' | 'conditional'
    children?: Question[]
}

export type DeviceType = 'iphone' | 'ipad' | 'desktop'

const DEVICES: Record<DeviceType, { label: string; width: number; height: number; scale: number }> = {
    iphone: { label: 'iPhone', width: 375, height: 812, scale: 0.9 },
    ipad: { label: 'iPad', width: 768, height: 1024, scale: 0.85 },
    desktop: { label: 'Desktop', width: 1280, height: 800, scale: 0.85 }
}

const TOKENS = {
    input: "w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm hover:shadow",
    modalOverlay: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in",
}

interface SurveySimulatorProps {
    isOpen: boolean
    onClose: () => void
    questions: Question[]
    simulatedAnswers?: Record<string, string> // QuestionID -> Answer Text
    mode?: 'preview' | 'simulation'
}

export function SurveySimulator({
    isOpen,
    onClose,
    questions,
    simulatedAnswers = {},
    mode = 'preview'
}: SurveySimulatorProps) {
    const [currentQIndex, setCurrentQIndex] = useState(0)
    const [deviceType, setDeviceType] = useState<DeviceType>('iphone')
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isRotating, setIsRotating] = useState(false)

    // Reset when opening
    useEffect(() => {
        if (isOpen) setCurrentQIndex(0)
    }, [isOpen])

    // Simulation Autoplay Engine
    useEffect(() => {
        if (mode !== 'simulation' || !isOpen) return

        const currentQ = questions[currentQIndex]
        if (!currentQ) return

        // Find answer for current question
        // Note: simulatedAnswers might key by ID. Ensure IDs match.
        // If simulatedAnswers keys are question IDs, we use that.
        // Ideally we'd match exact option IDs, but text matching is often used in this codebase.
        const answerText = simulatedAnswers[currentQ.id]

        const timer = setTimeout(() => {
            if (answerText) {
                // Try to find matching option
                const matchingOpt = currentQ.options.find(o => o.text === answerText || o.id === answerText)

                if (matchingOpt) {
                    // It's an option-based answer
                    handleOptionSelect(matchingOpt, true)
                } else {
                    // Text/Input answer - just move next
                    handleNext()
                }
            } else {
                // No answer (maybe skipped), move next
                handleNext()
            }
        }, 1500) // 1.5s delay to read

        return () => clearTimeout(timer)
    }, [currentQIndex, mode, isOpen, simulatedAnswers, questions])

    const handleNext = () => {
        setCurrentQIndex(prev => (prev + 1) % questions.length)
    }

    const handleOptionSelect = (opt: QuestionOption, isSimulated = false) => {
        setSelectedOption(opt.id)

        // Delay for animation
        setTimeout(() => {
            setSelectedOption(null)

            // Logic handling (simple version)
            if (opt.nextQuestionId) {
                const branchIdx = questions.findIndex(q => q.id === opt.nextQuestionId)
                if (branchIdx >= 0) {
                    setCurrentQIndex(branchIdx)
                    return
                }
            }
            setCurrentQIndex(prev => (prev + 1) % questions.length)
        }, isSimulated ? 1000 : 300) // Longer pause for simulation visibility
    }

    const switchDevice = (type: DeviceType) => {
        if (type === deviceType) return
        setIsRotating(true)
        setTimeout(() => {
            setDeviceType(type)
            setIsRotating(false)
        }, 250)
    }

    const currentQ = questions[currentQIndex] || questions[0]
    if (!currentQ) return null

    const device = DEVICES[deviceType]
    const answer = simulatedAnswers[currentQ.id]

    const renderInput = () => {
        const type = currentQ.type

        if (!currentQ.options?.length || ['text', 'date', 'file', 'number'].includes(type)) {
            return (
                <div className="space-y-4">
                    <input
                        type={type === 'date' ? 'date' : 'text'}
                        className={cn(TOKENS.input, "p-4 text-base rounded-lg border-slate-200 focus:border-emerald-500 shadow-sm transition-all")}
                        placeholder="Type your answer..."
                        value={mode === 'simulation' ? (answer || '') : ''}
                        readOnly={mode === 'simulation'}
                    />
                    {mode !== 'simulation' && <button onClick={handleNext} className={cn(TOKENS.btnPrimary, "w-full rounded-lg py-3")}>Next</button>}
                </div>
            )
        }

        if (['rating', 'nps'].includes(type)) {
            const max = type === 'nps' ? 10 : 5
            return (
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {Array.from({ length: max + 1 }).map((_, i) => {
                            const val = type === 'nps' ? i : i + 1
                            if (type === 'rating' && i === max) return null
                            const valStr = val.toString()
                            const isSelected = answer === valStr

                            return (
                                <button
                                    key={i}
                                    className={cn(
                                        "w-10 h-10 rounded-full font-bold text-sm transition-all shadow-sm border",
                                        isSelected
                                            ? "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400"
                                    )}
                                    onClick={mode !== 'simulation' ? handleNext : undefined}
                                >
                                    {val}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )
        }

        // Default Options
        return (
            <div className={cn(
                "space-y-3",
                deviceType === 'desktop' && 'grid grid-cols-2 gap-4 space-y-0'
            )}>
                {currentQ.options.slice(0, 6).map((opt, i) => {
                    const isSelected = selectedOption === opt.id || (mode === 'simulation' && (answer === opt.text || answer === opt.id))

                    return (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(opt)}
                            className={cn(
                                "w-full bg-white border rounded-lg shadow-sm text-left font-medium transition-all group relative overflow-hidden",
                                isSelected
                                    ? "border-emerald-500 bg-emerald-50/90 text-emerald-900 scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-sm"
                                    : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:shadow-md",
                                deviceType !== 'iphone' && 'p-4'
                            )}
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <span className={cn(
                                "inline-flex items-center justify-center rounded-full font-bold mr-3 transition-colors",
                                deviceType === 'iphone' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm',
                                isSelected
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                            )}>
                                {String.fromCharCode(65 + i)}
                            </span>
                            <span className={deviceType !== 'iphone' ? 'text-base' : ''}>{opt.text}</span>

                            {/* Glassmorphic Shine Effect for Selected */}
                            {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine" />
                            )}
                        </button>
                    )
                })}
            </div>
        )
    }

    const renderSurveyContent = () => (
        <div className={cn(
            "h-full flex flex-col",
            deviceType === 'iphone' ? 'p-6 pt-8' : deviceType === 'ipad' ? 'p-10 pt-12' : 'p-12 pt-8'
        )}>
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-slate-400">{currentQIndex + 1}/{questions.length}</span>
            </div>

            {/* Question */}
            <div className="flex-1 overflow-y-auto">
                <h2 className={cn(
                    "font-bold text-slate-900 mb-2",
                    deviceType === 'iphone' ? 'text-xl' : 'text-2xl'
                )}>{currentQ.text}</h2>
                <p className={cn(
                    "text-slate-500 mb-6",
                    deviceType === 'iphone' ? 'text-sm' : 'text-base'
                )}>
                    {currentQ.description || (['text', 'date'].includes(currentQ.type) ? "Please type your answer." : "Please select an option below.")}
                </p>

                {renderInput()}
            </div>

            {/* Footer */}
            <div className="pt-4 mt-auto border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                        className="text-sm text-slate-400 hover:text-slate-600"
                        disabled={currentQIndex === 0}
                    >← Previous</button>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-300">Powered by CFM</div>
                    <button
                        onClick={() => setCurrentQIndex(prev => (prev + 1) % questions.length)}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >Skip →</button>
                </div>
            </div>
        </div>
    )

    if (!isOpen) return null

    return (
        <div className={TOKENS.modalOverlay + " perspective-[1500px]"}>
            <div className="flex flex-col items-center gap-4 w-full h-full justify-center">

                {/* Simulator Mode Indicator */}
                {mode === 'simulation' && (
                    <div className="fixed top-24 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg animate-bounce">
                        Replaying User Session...
                    </div>
                )}

                {/* Fixed Sticky Header */}
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/10 animate-fade-in">
                    {(Object.keys(DEVICES) as DeviceType[]).map(device => (
                        <button
                            key={device}
                            onClick={() => switchDevice(device)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2",
                                deviceType === device
                                    ? "bg-white text-slate-900 shadow-lg scale-105"
                                    : "text-slate-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {device === 'iphone' && <Smartphone className="w-4 h-4" />}
                            {device === 'ipad' && <Tablet className="w-4 h-4" />}
                            {device === 'desktop' && <Globe className="w-4 h-4" />}
                            {DEVICES[device].label}
                        </button>
                    ))}
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Device Frame with 3D Rotation */}
                <div
                    className="relative transition-all duration-500 ease-in-out"
                    style={{
                        transform: `scale(${device.scale}) ${isRotating ? 'rotateY(90deg) scale(0.8)' : 'rotateY(0deg)'}`,
                        opacity: isRotating ? 0.5 : 1
                    }}
                >
                    {/* iPhone Frame */}
                    {deviceType === 'iphone' && (
                        <div className="w-[375px] h-[812px] bg-black rounded-[50px] border-[14px] border-slate-900 shadow-2xl overflow-hidden relative">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-black rounded-b-2xl z-10" />
                            <div className="h-12 w-full bg-white flex justify-between items-center px-8 pt-2 text-xs font-bold">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center"><div className="w-4 h-2 bg-black rounded-sm" /></div>
                            </div>
                            <div className="h-[calc(100%-48px)] bg-slate-50">
                                {renderSurveyContent()}
                            </div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full" />
                        </div>
                    )}

                    {/* iPad Frame */}
                    {deviceType === 'ipad' && (
                        <div className="w-[768px] h-[1024px] bg-slate-800 rounded-[40px] border-[16px] border-slate-800 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-600 rounded-full z-10" />
                            <div className="h-10 w-full bg-white flex justify-between items-center px-4 text-xs font-bold">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center"><div className="w-4 h-2 bg-black rounded-sm" /><span className="text-[10px]">100%</span></div>
                            </div>
                            <div className="h-[calc(100%-40px)] bg-slate-50">
                                {renderSurveyContent()}
                            </div>
                        </div>
                    )}

                    {/* Desktop Frame */}
                    {deviceType === 'desktop' && (
                        <div className="flex flex-col">
                            <div className="w-[1280px] h-10 bg-slate-100 rounded-t-xl flex items-center px-4 gap-2 border border-slate-200">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 mx-20">
                                    <div className="h-6 bg-white rounded-md border border-slate-200 flex items-center px-3">
                                        <span className="text-[10px] text-slate-500">🔒 survey.cfm.io/preview</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[1280px] h-[800px] bg-slate-50 border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
                                <div className="max-w-2xl mx-auto py-4 h-full">
                                    {renderSurveyContent()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
