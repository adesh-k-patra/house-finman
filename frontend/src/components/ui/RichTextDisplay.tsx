import { cn } from '@/utils'

import DOMPurify from 'dompurify'

export function RichTextDisplay({ html, className }: { html: string; className?: string }) {
    const sanitizedHtml = DOMPurify.sanitize(html)
    return (
        <div
            className={cn(
                "prose prose-sm max-w-none dark:prose-invert",
                "prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight",
                "prose-h1:text-2xl prose-h2:text-xl",
                "prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed",
                "prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline",
                "prose-blockquote:border-l-4 prose-blockquote:border-slate-200 dark:prose-blockquote:border-slate-700 prose-blockquote:pl-4 prose-blockquote:italic",
                "prose-ul:list-disc prose-ul:pl-5",
                "prose-img:rounded-none prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-700",
                className
            )}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    )
}
