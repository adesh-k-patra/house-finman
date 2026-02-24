/**
 * Animated Logo Component for House FinMan
 * 
 * Version: Impossible Tri-Cube (Hexagon) - Dark Black Stroke & Climbing Animation
 * 
 * Animation Timeline (Total Loop: 12s):
 * 0s - 3s:   Static Logo [WAIT 3 SEC]
 * 3.0s - 4.5s: CLIMBING Morph to "Steps" (Staggered)
 *              - 3.0s: Bottom Step Starts
 *              - 3.2s: Middle Step Starts
 *              - 3.4s: Top Step Starts
 * 4.5s - 6s: Morph back to "Logo" (Smooth)
 * 6s - 9s:   Static Logo [WAIT 3 SEC]
 * 9s - 10s:  3D Sheen/Gloss Effect
 * 10s - 12s: Static Logo
 */

import { cn } from '@/utils'

interface AnimatedLogoProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    showText?: boolean
    className?: string
    darkMode?: boolean
}

const sizeConfig = {
    xs: { container: 'w-6 h-6', text: 'text-[10px]', subtext: 'text-[7px]' },
    sm: { container: 'w-8 h-8', text: 'text-xs', subtext: 'text-[8px]' },
    md: { container: 'w-10 h-10', text: 'text-sm', subtext: 'text-xs' },
    lg: { container: 'w-16 h-16', text: 'text-xl', subtext: 'text-sm' },
    xl: { container: 'w-24 h-24', text: 'text-3xl', subtext: 'text-base' },
}

export function AnimatedLogo({ size = 'md', showText = false, className }: AnimatedLogoProps) {
    const config = sizeConfig[size]

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className={cn('relative', config.container)}>
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    style={{ overflow: 'visible' }}
                >
                    <defs>
                        {/* Glassmorphic Gradient: Solid Dark White */}
                        <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.98)" />
                            <stop offset="100%" stopColor="rgba(203, 213, 225, 0.9)" />
                        </linearGradient>

                        {/* Thin Drop Shadow */}
                        <filter id="thin-shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.25)" />
                        </filter>

                        {/* Sheen Gradient */}
                        <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    <g filter="url(#thin-shadow)">
                        {/* Segment 1: Left Face -> Bottom Step */}
                        <path
                            className="segment-1"
                            fill="url(#glass-gradient)"
                            stroke="#0f172a" /* Dark Slate 900 (Near Black) */
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />

                        {/* Segment 2: Right Face -> Middle Step */}
                        <path
                            className="segment-2"
                            fill="url(#glass-gradient)"
                            stroke="#0f172a"
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />

                        {/* Segment 3: Top Face -> Top Step */}
                        <path
                            className="segment-3"
                            fill="url(#glass-gradient)"
                            stroke="#0f172a"
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />

                        {/* Sheen Overlay */}
                        <path
                            className="animate-sheen"
                            fill="url(#sheen)"
                            style={{ mixBlendMode: 'overlay', opacity: 0 }}
                            d="M 10 10 L 90 10 L 90 90 L 10 90 Z"
                        />
                    </g>
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span className={cn('font-black uppercase tracking-tighter leading-none text-white', config.text)}>
                        House
                    </span>
                    <span className={cn('font-bold uppercase tracking-[0.2em] leading-none text-slate-300', config.subtext)}>
                        FinMan
                    </span>
                </div>
            )}

            <style>{`
                /* 
                   TIMELINE: 12s Loop
                   
                   Staggered Climbing:
                   3.0s = 25%
                   4.5s = 37.5%
                   
                   Step 1 (Bottom): Starts 25%, Ends 33%
                   Step 2 (Middle): Starts 27%, Ends 35%
                   Step 3 (Top):    Starts 29%, Ends 37.5%
                   
                   All Hold at Steps until 37.5% (4.5s) is too short? 
                   The user said "change the position to a steps structure then comes back".
                   Let's hold step structure for a bit, say 4.5s to 6s, then return?
                   No, previous timeline was 3-4.5 morp to steps, 4.5-6 morph back.
                   Let's stick to that but stagger the START of the morph.
                */

                .segment-1 { animation: morph-seg-1 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .segment-2 { animation: morph-seg-2 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .segment-3 { animation: morph-seg-3 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .animate-sheen { animation: sheen-pass 12s ease-in-out infinite; }

                /* Segment 1: Left Face -> Bottom Step (First to move) */
                @keyframes morph-seg-1 {
                    /* Logo State */
                    0%, 25%, 55%, 100% { d: path("M 50 54 L 21 38 L 21 70 L 50 86 Z"); }
                    
                    /* Steps State - Reached quickly */
                    /* Start moving at 25% (3.0s) */
                    30%, 45% { d: path("M 20 75 L 80 75 L 80 85 L 20 85 Z"); } /* Reaches step at 3.6s, holds */
                }

                /* Segment 2: Right Face -> Middle Step (Second to move) */
                @keyframes morph-seg-2 {
                    /* Logo State */
                    0%, 26%, 55%, 100% { d: path("M 50 54 L 79 38 L 79 70 L 50 86 Z"); }
                    
                    /* Start moving at 26% (3.12s) - slightly delayed */
                    32%, 45% { d: path("M 20 60 L 80 60 L 80 70 L 20 70 Z"); }
                }

                /* Segment 3: Top Face -> Top Step (Last to move - Climbing effect) */
                @keyframes morph-seg-3 {
                    /* Logo State */
                    0%, 27%, 55%, 100% { d: path("M 50 54 L 21 38 L 50 22 L 79 38 Z"); }
                    
                    /* Start moving at 27% (3.24s) */
                    34%, 45% { d: path("M 20 45 L 80 45 L 80 55 L 20 55 Z"); }
                }

                /* Sheen */
                @keyframes sheen-pass {
                    0%, 75% { opacity: 0; transform: translateX(-100%) skewX(-20deg); }
                    79% { opacity: 0.6; transform: translateX(50%) skewX(-20deg); }
                    83%, 100% { opacity: 0; transform: translateX(150%) skewX(-20deg); }
                }

            `}</style>
        </div>
    )
}

export function AnimatedLogoIcon({ size = 'sm', className }: { size?: 'xs' | 'sm' | 'md', className?: string }) {
    return <AnimatedLogo size={size} showText={false} className={className} />
}

export function AnimatedLogoFull({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg', className?: string, darkMode?: boolean }) {
    return <AnimatedLogo size={size} showText={true} className={className} />
}

export default AnimatedLogo
