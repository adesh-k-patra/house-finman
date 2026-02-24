import { useState } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Link, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface RichTextEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [toolbarVisible, setToolbarVisible] = useState(false)

    // Note: In a real implementation, this would use Tiptap or Slate.js.
    // For this design implementation, we simulate the UI behavior.

    return (
        <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 group focus-within:ring-1 focus-within:ring-slate-900 focus-within:border-slate-900 transition-all rounded-none">
            {/* Toolbar */}
            <div className={cn(
                "flex items-center gap-1 p-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-opacity",
                toolbarVisible ? "opacity-100" : "opacity-50 group-hover:opacity-100"
            )}>
                <ToolbarButton icon={Bold} label="Bold" />
                <ToolbarButton icon={Italic} label="Italic" />
                <ToolbarButton icon={Underline} label="Underline" />
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                <ToolbarButton icon={AlignLeft} label="Left" />
                <ToolbarButton icon={AlignCenter} label="Center" />
                <ToolbarButton icon={AlignRight} label="Right" />
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                <ToolbarButton icon={List} label="Bullet List" />
                <ToolbarButton icon={ListOrdered} label="Numbered List" />
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                <ToolbarButton icon={Link} label="Link" />
                <ToolbarButton icon={Image} label="Image" />
            </div>

            {/* Editor Area */}
            <textarea
                className="w-full min-h-[120px] p-4 bg-transparent outline-none resize-y text-sm leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-sans"
                placeholder={placeholder || "Type your description here..."}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setToolbarVisible(true)}
                onBlur={() => setToolbarVisible(false)}
            />

            <div className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <span className="text-[10px] text-slate-400 font-mono">{value.length} chars</span>
            </div>
        </div>
    )
}

function ToolbarButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={label}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}
