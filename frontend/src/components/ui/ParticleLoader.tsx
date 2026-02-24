
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'
import { AnimatedLogo } from '@/features/properties/components/AnimatedLogo' // Ensure we use the correct global or feature path

interface ParticleLoaderProps {
    isLoading: boolean
    onAnimationComplete?: () => void
}

export function ParticleLoader({ isLoading, onAnimationComplete }: ParticleLoaderProps) {
    const [renderParticles, setRenderParticles] = useState(false)
    const [animationState, setAnimationState] = useState<'idle' | 'shaking' | 'exploding' | 'hidden'>('hidden')

    useEffect(() => {
        if (isLoading) {
            setAnimationState('shaking')
            setRenderParticles(false)
        } else if (animationState === 'shaking') {
            // Trigger explosion when loading stops
            setAnimationState('exploding')
            setRenderParticles(true)

            // Clean up after animation
            const timer = setTimeout(() => {
                setAnimationState('hidden')
                setRenderParticles(false)
                if (onAnimationComplete) onAnimationComplete()
            }, 1000) // 1s explosion duration
            return () => clearTimeout(timer)
        }
    }, [isLoading, animationState, onAnimationComplete])

    if (animationState === 'hidden' && !isLoading) return null

    // Generate random particles
    const particles = Array.from({ length: 48 }).map((_, i) => {
        const angle = Math.random() * 360
        const distance = 100 + Math.random() * 100
        const x = Math.cos(angle * (Math.PI / 180)) * distance
        const y = Math.sin(angle * (Math.PI / 180)) * distance
        // Randomize delay slightly for natural feel
        const delay = Math.random() * 0.1

        return {
            id: i,
            style: {
                '--tx': `${x}px`,
                '--ty': `${y}px`,
                '--d': `${delay}s`
            } as React.CSSProperties
        }
    })

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/10 backdrop-blur-[2px] pointer-events-none">

            {/* Logo Container */}
            <div className={cn(
                "relative flex items-center justify-center transition-opacity duration-300",
                animationState === 'shaking' && "animate-shake-vibrate",
                animationState === 'exploding' && "opacity-0"
            )}>
                <AnimatedLogo size="xl" />
            </div>

            {/* Particle Explosion Container */}
            {renderParticles && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="absolute w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-particle-explode"
                            style={p.style}
                        />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes shake-vibrate {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-2px, 2px) rotate(-1deg); }
                    50% { transform: translate(2px, -2px) rotate(1deg); }
                    75% { transform: translate(-2px, -2px) rotate(-1deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }

                @keyframes particle-explode {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx), var(--ty)) scale(0);
                        opacity: 0;
                    }
                }

                .animate-shake-vibrate {
                    animation: shake-vibrate 0.1s linear infinite;
                }

                .animate-particle-explode {
                    animation: particle-explode 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    animation-delay: var(--d);
                }
            `}</style>
        </div>,
        document.body
    )
}
