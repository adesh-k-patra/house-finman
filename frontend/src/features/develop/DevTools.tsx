import { useState } from 'react'
import { FlaskConical, Play, RotateCcw, Bug } from 'lucide-react'
import { Button, Card } from '@/components/ui'

// B.56 Test Survey Mode
export function TestSurveyMode() {
    const [isTestMode, setIsTestMode] = useState(false)
    const [dummyData, setDummyData] = useState<any>(null)

    const injectDummyData = () => {
        setDummyData({
            q1: 'Under Construction',
            q2: '50L - 75L',
            q3: 'Pune West'
        })
    }

    if (!isTestMode) {
        return (
            <div className="bg-amber-50 border border-amber-200 p-2 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" /> Preview Mode
                </span>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsTestMode(true)}>
                    Enable Test Harness
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-slate-900 text-white p-3 shadow-lg fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-between animate-in slide-in-from-bottom">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-sm tracking-wide">TEST MODE ACTIVE</span>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white h-8 gap-2" onClick={injectDummyData}>
                    <Play className="w-3.5 h-3.5" /> Inject Dummy Data
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white h-8 gap-2">
                    <Bug className="w-3.5 h-3.5" /> Log State
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{dummyData ? 'Data Injected' : 'No Data'}</span>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 h-8" onClick={() => setIsTestMode(false)}>Exit</Button>
            </div>
        </div>
    )
}

// B.74 Data Simulator (Mass Responses)
export function DataSimulator() {
    const [count, setCount] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    const startSimulation = () => {
        setIsRunning(true)
        const interval = setInterval(() => {
            setCount(c => {
                if (c >= 1000) {
                    clearInterval(interval)
                    setIsRunning(false)
                    return c
                }
                return c + Math.floor(Math.random() * 50)
            })
        }, 100)
    }

    return (
        <Card className="p-4 rounded-none border-dashed border-2 border-slate-300">
            <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Load Testing Simulator</h4>
            <div className="flex items-center gap-4">
                <Button
                    onClick={startSimulation}
                    disabled={isRunning}
                    className="bg-slate-900 text-white rounded-none w-full"
                >
                    {isRunning ? 'Generating...' : 'Simulate 1k Responses'}
                </Button>
                <div className="font-mono text-xl font-black">{count}</div>
            </div>
        </Card>
    )
}

// B.72 Export Preview
export function ExportPreviewModal({ isOpen, onClose }: any) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="w-[800px] h-[500px] bg-white shadow-2xl flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between">
                    <h3 className="font-black uppercase">Export Preview</h3>
                    <button onClick={onClose}><RotateCcw className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-auto p-8 bg-slate-100 flex justify-center">
                    <div className="w-[210mm] h-[297mm] bg-white shadow-lg p-8 scale-75 origin-top text-xs">
                        <h1 className="text-2xl font-bold mb-4">Survey Response Report</h1>
                        {/* Mock Table */}
                        <div className="border border-slate-200">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex border-b border-slate-100 p-2">
                                    <div className="w-1/4 font-bold">Q{i}</div>
                                    <div className="w-3/4">Sample Answer Text...</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
