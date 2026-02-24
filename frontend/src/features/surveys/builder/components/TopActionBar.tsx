import React from 'react'
import { ArrowLeft, Undo2, Redo2, Eye, Save, Rocket, Monitor, Smartphone, Sparkles, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { cn } from '@/utils'
import { useSurveyBuilder } from '../contexts/SurveyBuilderContext'

interface TopActionBarProps {
    onMobileMenuClick?: () => void
}

export function TopActionBar({ onMobileMenuClick }: TopActionBarProps) {
    const navigate = useNavigate()
    const { settings, undo, redo, canUndo, canRedo, viewMode, setViewMode, designMode, setDesignMode } = useSurveyBuilder()

    const [isSaving, setIsSaving] = React.useState(false)
    const [isPublishing, setIsPublishing] = React.useState(false)
    const [lastSaved, setLastSaved] = React.useState<Date | null>(null)

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            setLastSaved(new Date())
        }, 800)
    }

    const handlePublish = () => {
        setIsPublishing(true)
        setTimeout(() => {
            setIsPublishing(false)
            // In a real app, this would redirect or show a modal
        }, 1500)
    }

    return (
        <header className="h-14 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 md:px-4 z-40 select-none relative">
            {/* Left: Back & Breadcrumbs */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    className="lg:hidden rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 h-8 w-8 -ml-2"
                    onClick={onMobileMenuClick}
                >
                    <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    className="hidden md:flex rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 h-8 w-8"
                    onClick={() => navigate('/surveys')}
                >
                    <ArrowLeft className="w-4 h-4 text-slate-500" />
                </Button>

                <div className="hidden md:block h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Surveys</span>
                        <span className="text-slate-600">/</span>
                        <span>Create</span>
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight ml-1 md:ml-2 truncate max-w-[120px] md:max-w-none">
                        {settings.name || 'Untitled Survey'}
                    </div>
                </div>
            </div>

            {/* Center: View Switcher (Visible only in Design Mode) */}
            {viewMode === 'design' && (
                <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 md:p-0 md:bg-transparent md:border-none md:static md:w-auto md:flex z-50 flex justify-center">
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-sm border border-slate-200 dark:border-slate-800 shadow-lg md:shadow-none mx-auto">
                        <button
                            onClick={() => setDesignMode('list')}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-sm transition-all",
                                designMode === 'list'
                                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-slate-200 dark:border-slate-700"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                            )}
                        >
                            Builder
                        </button>
                        <button
                            onClick={() => setDesignMode('visual')}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-sm transition-all",
                                designMode === 'visual'
                                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-slate-200 dark:border-slate-700"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                            )}
                        >
                            Logic
                        </button>
                        <button
                            onClick={() => setDesignMode('ai')}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5",
                                designMode === 'ai'
                                    ? "bg-white dark:bg-slate-800 text-purple-600 shadow-sm border border-slate-200 dark:border-slate-700"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                            )}
                        >
                            <Sparkles className="w-3 h-3" />
                            AI
                        </button>
                    </div>
                </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center mr-2 border-r border-slate-200 dark:border-slate-800 pr-2 gap-1">
                    <Button variant="ghost" size="sm" isIconOnly disabled={!canUndo} onClick={undo} className="rounded-none h-8 w-8 text-slate-400 hover:text-slate-600">
                        <Undo2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" isIconOnly disabled={!canRedo} onClick={redo} className="rounded-none h-8 w-8 text-slate-400 hover:text-slate-600">
                        <Redo2 className="w-4 h-4" />
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 font-bold text-slate-600 border-slate-300 dark:border-slate-700 rounded-sm h-8 bg-white dark:bg-slate-900 transition-all min-w-[80px]"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <span className="animate-pulse">Saving...</span>
                    ) : lastSaved ? (
                        <>
                            <span className="text-emerald-600 font-bold">Saved</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-xs">Draft</span>
                        </>
                    )}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 font-bold text-slate-600 hover:bg-slate-100 rounded-sm h-8"
                    onClick={() => setViewMode(viewMode === 'preview' ? 'design' : 'preview')}
                >
                    {viewMode === 'preview' ? (
                        <span className="text-xs">Exit</span>
                    ) : (
                        <><Eye className="w-3.5 h-3.5" /> <span className="hidden sm:inline text-xs">Run Prototype</span></>
                    )}
                </Button>

                <Button
                    className={cn(
                        "gap-2 text-white font-bold shadow-sm rounded-none h-8 px-3 md:px-6 text-xs uppercase tracking-wider transition-all",
                        isPublishing ? "bg-emerald-700" : "bg-[#10b981] hover:bg-[#059669]"
                    )}
                    onClick={handlePublish}
                    disabled={isPublishing}
                >
                    {isPublishing ? (
                        <>
                            <Rocket className="w-3.5 h-3.5 animate-bounce" />
                            <span className="hidden md:inline">Publishing...</span>
                        </>
                    ) : (
                        <>
                            <Rocket className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Publish</span>
                        </>
                    )}
                </Button>
            </div>
        </header>
    )
}
