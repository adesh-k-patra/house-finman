

export const ChartDefs = () => (
    <defs>
        <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
        </filter>
        {[
            { id: 'blue', color: '#3B82F6' },
            { id: 'green', color: '#10B981' },
            { id: 'purple', color: '#8B5CF6' },
            { id: 'orange', color: '#F59E0B' },
            { id: 'cyan', color: '#06B6D4' },
            { id: 'pink', color: '#EC4899' },
            { id: 'teal', color: '#14B8A6' },
            { id: 'indigo', color: '#6366F1' },
            { id: 'red', color: '#EF4444' },
            { id: 'rose', color: '#F43F5E' },
            { id: 'slate', color: '#94A3B8' },
            { id: 'yellow', color: '#FACC15' },
        ].map(item => (
            <linearGradient key={item.id} id={`glass-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={item.color} stopOpacity={0.85} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0.55} />
            </linearGradient>
        ))}
    </defs>
)
