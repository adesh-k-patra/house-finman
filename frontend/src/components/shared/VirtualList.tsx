import { useRef, useState, useMemo, useEffect } from 'react'

// B.78 Virtual Scroll
export function VirtualList<T>({
    items,
    height,
    itemHeight,
    renderItem
}: {
    items: T[],
    height: number,
    itemHeight: number,
    renderItem: (item: T, index: number) => React.ReactNode
}) {
    const [scrollTop, setScrollTop] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const totalHeight = items.length * itemHeight
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
        items.length - 1,
        Math.floor((scrollTop + height) / itemHeight)
    )

    const visibleItems = useMemo(() => {
        const visible = []
        for (let i = startIndex; i <= endIndex; i++) {
            visible.push({
                index: i,
                data: items[i],
                top: i * itemHeight
            })
        }
        return visible
    }, [items, startIndex, endIndex, itemHeight])

    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop)
    }

    return (
        <div
            ref={containerRef}
            className="overflow-y-auto w-full relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            style={{ height }}
            onScroll={onScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                {visibleItems.map(({ index, data, top }) => (
                    <div
                        key={index}
                        style={{ position: 'absolute', top, height: itemHeight, left: 0, right: 0 }}
                    >
                        {renderItem(data, index)}
                    </div>
                ))}
            </div>
        </div>
    )
}
