
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
    X,
    Smartphone,
    Tablet,
    Globe
} from 'lucide-react'
import { cn } from '@/utils'

// ============ TYPES & CONSTANTS ============

type DeviceType = 'iphone' | 'ipad' | 'desktop'

const DEVICES: Record<DeviceType, { label: string; width: number; height: number; scale: number }> = {
    iphone: { label: 'iPhone', width: 375, height: 812, scale: 0.9 },
    ipad: { label: 'iPad', width: 768, height: 1024, scale: 0.85 },
    desktop: { label: 'Desktop', width: 1280, height: 800, scale: 0.85 }
}

const TOKENS = {
    card: "bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.05)] rounded-none",
    input: "w-full px-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-medium transition-colors shadow-sm",
    modalOverlay: "fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in"
}

export interface UniversalSimulatorProps {
    isOpen: boolean
    onClose: () => void
    questions: any[]
    mode: 'preview' | 'replay'
    replayResponse?: {
        answers: Record<string, any>
        timeTaken?: Record<string, number> // Optional time taken per question in seconds
    } | null
}

// ============ COMPONENT ============

export function UniversalSimulator({ isOpen, onClose, questions, mode, replayResponse }: UniversalSimulatorProps) {
    const [deviceType, setDeviceType] = useState<DeviceType>('iphone')
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isRotating, setIsRotating] = useState(false)

    // Derived state for the current question
    const [history, setHistory] = useState<string[]>([]) // Stack of visited question IDs
    const [currentQId, setCurrentQId] = useState<string | null>(null)

    // Initialize
    useEffect(() => {
        console.log("UniversalSimulator Open:", isOpen, "Mode:", mode, "Questions:", questions.length)
        if (isOpen && questions.length > 0) {
            // Find start question (level 0, order 0)
            const startQ = questions.find((q: any) => q.level === 0 && q.order === 0) || questions[0]
            console.log("Starting Simulation with:", startQ)
            setCurrentQId(startQ.id)
            setHistory([])
        }
    }, [isOpen, questions])

    const currentQ = questions.find(q => q.id === currentQId) || questions[0]
    // Calculate index for progress bar based on flatten list or just simple count
    const totalQCount = questions.length
    const currentProgressIndex = questions.findIndex(q => q.id === currentQId) + 1

    // Replay Engine
    useEffect(() => {
        if (mode !== 'replay' || !replayResponse || !isOpen || !currentQ) return

        const answer = replayResponse.answers[currentQ.id]

        // Dynamic delay based on time taken (default 1.5s if not provided)
        // If timeTaken is provided, use it (clamped to min 0.5s, max 3s for UX) to simulate reading/thinking time
        let delay = 1500
        if (replayResponse.timeTaken && replayResponse.timeTaken[currentQ.id]) {
            // Convert seconds to ms, clamp between 500ms and 3000ms for demo purposes
            // (Real time might be too slow/fast, so we compress it)
            const recordedTime = replayResponse.timeTaken[currentQ.id] * 1000
            delay = Math.min(Math.max(recordedTime * 0.5, 800), 2500)
        }

        const timer = setTimeout(() => {
            if (answer) {
                // Try to find matching option for logic
                const matchingOpt = currentQ.options.find((o: any) => o.text === answer)
                if (matchingOpt) {
                    handleOptionSelect(matchingOpt)
                } else {
                    handleNext()
                }
            } else {
                handleNext()
            }
        }, delay)

        return () => clearTimeout(timer)
    }, [currentQId, mode, replayResponse, isOpen])

    if (!isOpen || !currentQ) return null

    const handleNext = () => {
        // Find next question based on Logic or Order
        const nextQ = findNextQuestion(currentQ, null)
        if (nextQ) {
            setHistory(prev => [...prev, currentQ.id])
            setCurrentQId(nextQ.id)
        } else {
            // End of survey
            if (mode === 'preview') {
                alert("End of Preview")
                onClose()
            } else {
                // Fade out or show completion screen? For now just close or stay on last screen
                // Let's close for now
                onClose()
            }
        }
    }

    const handleOptionSelect = (opt: any) => {
        setSelectedOption(opt.id)
        setTimeout(() => {
            setSelectedOption(null)

            // Logic Check
            const nextQ = findNextQuestion(currentQ, opt.id)

            if (nextQ) {
                setHistory(prev => [...prev, currentQ.id])
                setCurrentQId(nextQ.id)
            } else {
                if (mode === 'preview') {
                    alert("End of Preview")
                }
                onClose()
            }
        }, 300)
    }

    const findNextQuestion = (q: any, selectedOptionId: string | null): any | null => {
        // 1. Check Logic Rules
        if (selectedOptionId) {
            const rule = q.logic?.find((l: any) => l.triggerOptionId === selectedOptionId)
            if (rule) {
                const target = questions.find((tq: any) => tq.id === rule.targetQuestionId)
                if (target) return target
            }
        }

        // 3. Fallback: Next sibling by order
        // Find questions with same parent (or null) and higher order
        const siblings = questions.filter((oq: any) => oq.parentId === q.parentId && oq.order > q.order)
        if (siblings.length > 0) {
            return siblings.sort((a: any, b: any) => a.order - b.order)[0]
        }

        // 4. Fallback: Return to parent's next sibling (backtracking)
        if (q.parentId) {
            const parent = questions.find((p: any) => p.id === q.parentId)
            if (parent) {
                // Recursively find next after parent
                // Simple approach: look for next question in the flat list index for now (simple prototype fallback)
                const currentIdx = questions.findIndex((item: any) => item.id === q.id)
                if (currentIdx < questions.length - 1) {
                    return questions[currentIdx + 1]
                }
            }
        }

        return null
    }

    const handleBack = () => {
        if (history.length > 0) {
            const prevId = history[history.length - 1]
            setHistory(prev => prev.slice(0, -1))
            setCurrentQId(prevId)
        }
    }

    const switchDevice = (type: DeviceType) => {
        if (type === deviceType) return
        setIsRotating(true)
        setTimeout(() => {
            setDeviceType(type)
            setIsRotating(false)
        }, 250)
    }

    const renderInput = () => {
        const type = currentQ.type
        const answer = mode === 'replay' && replayResponse ? replayResponse.answers[currentQ.id] : null

        if (['text', 'date', 'file', 'number'].includes(type) || type === 'file_upload') {
            return (
                <div className="space-y-4">
                    <input
                        type={type === 'date' ? 'date' : 'text'}
                        className={cn(TOKENS.input, "p-4 text-base rounded-lg border-slate-200 focus:border-emerald-500 shadow-sm transition-all")}
                        placeholder={currentQ.placeholder || "Type your answer..."}
                        value={answer || ''}
                        readOnly={mode === 'replay'}
                    />
                    {mode !== 'replay' && <button onClick={handleNext} className={cn(TOKENS.btnPrimary, "w-full rounded-lg py-3")}>Next</button>}
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
                            if (type === 'rating' && i === max) return null // 1-5
                            const isSelected = answer === val.toString()
                            return (
                                <button
                                    key={i}
                                    className={cn(
                                        "w-10 h-10 rounded-full font-bold text-sm transition-all shadow-sm border",
                                        isSelected
                                            ? "bg-emerald-500 text-white border-emerald-600 scale-110"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400"
                                    )}
                                    onClick={mode !== 'replay' ? handleNext : undefined}
                                >
                                    {val}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )
        }

        // Default MCQ / Options
        return (
            <div className={cn(
                "space-y-3",
                deviceType === 'desktop' && 'grid grid-cols-2 gap-4 space-y-0'
            )}>
                {currentQ.options.map((opt: any, i: number) => (
                    <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt)}
                        className={cn(
                            "w-full p-4 bg-white border rounded-lg shadow-sm text-left font-medium transition-all group",
                            selectedOption === opt.id || (mode === 'replay' && answer === opt.text)
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 scale-[0.98]"
                                : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:shadow-md",
                            deviceType !== 'iphone' && 'p-5'
                        )}
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <span className={cn(
                            "inline-flex items-center justify-center rounded-full bg-slate-100 font-bold mr-3 transition-colors",
                            deviceType === 'iphone' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm',
                            selectedOption === opt.id || (mode === 'replay' && answer === opt.text)
                                ? "bg-emerald-500 text-white"
                                : "text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                        )}>{String.fromCharCode(65 + i)}</span>
                        <span className={deviceType !== 'iphone' ? 'text-base' : ''}>{opt.text}</span>
                    </button>
                ))}
            </div>
        )
    }

    const device = DEVICES[deviceType]

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
                        style={{ width: `${(currentProgressIndex / totalQCount) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-slate-400">{currentProgressIndex}/{totalQCount}</span>
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
                    {['text', 'date', 'file', 'file_upload'].includes(currentQ.type) ? "Please type your answer." : "Please select an option below."}
                </p>

                {renderInput()}
            </div>

            {/* Footer */}
            <div className="pt-4 mt-auto border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={history.length === 0}
                        className="text-sm text-slate-400 hover:text-slate-600 disabled:opacity-50"
                    >← Previous</button>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-300">Powered by CFM</div>
                    <button
                        onClick={handleNext}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >Skip →</button>
                </div>
            </div>
        </div>
    )

    if (!isOpen) return null

    return createPortal(
        <div className={TOKENS.modalOverlay + " perspective-[1500px]"}>
            <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
                {/* Fixed Sticky Header */}
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/10 animate-fade-in">
                    {(Object.keys(DEVICES) as DeviceType[]).map(d => (
                        <button
                            key={d}
                            onClick={() => switchDevice(d)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2",
                                deviceType === d
                                    ? "bg-white text-slate-900 shadow-lg scale-105"
                                    : "text-slate-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {d === 'iphone' && <Smartphone className="w-4 h-4" />}
                            {d === 'ipad' && <Tablet className="w-4 h-4" />}
                            {d === 'desktop' && <Globe className="w-4 h-4" />}
                            {DEVICES[d].label}
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
                    {/* Frame Graphics matched from original */}
                    {deviceType === 'iphone' && (
                        <div className="w-[375px] h-[812px] bg-black rounded-[50px] border-[14px] border-slate-900 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-black rounded-b-2xl z-10" />
                            <div className="h-12 w-full bg-white flex justify-between items-center px-8 pt-2 text-xs font-bold">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center"><div className="w-4 h-2 bg-black rounded-sm" /></div>
                            </div>
                            <div className="h-[calc(100%-48px)] bg-slate-50">{renderSurveyContent()}</div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full" />
                        </div>
                    )}

                    {deviceType === 'ipad' && (
                        <div className="w-[768px] h-[1024px] bg-slate-800 rounded-[40px] border-[16px] border-slate-800 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-600 rounded-full z-10" />
                            <div className="h-10 w-full bg-white flex justify-between items-center px-6 text-xs font-bold">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center"><div className="w-4 h-2 bg-black rounded-sm" /></div>
                            </div>
                            <div className="h-[calc(100%-40px)] bg-slate-50">{renderSurveyContent()}</div>
                        </div>
                    )}

                    {deviceType === 'desktop' && (
                        <div className="flex flex-col">
                            <div className="w-[1280px] h-10 bg-slate-100 rounded-t-xl flex items-center px-4 gap-2 border border-slate-200">
                                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
                                <div className="flex-1 mx-20"><div className="h-6 bg-white rounded-md border border-slate-200 flex items-center px-3"><span className="text-[10px] text-slate-500">🔒 survey.cfm.io/preview</span></div></div>
                            </div>
                            <div className="w-[1280px] h-[800px] bg-slate-50 border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
                                <div className="max-w-2xl mx-auto h-full">{renderSurveyContent()}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
