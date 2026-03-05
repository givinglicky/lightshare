import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    angle: number;
    delay: number;
}

interface EnergyButtonProps {
    count: number;
    isLiked?: boolean;
    onLike: () => void;
    className?: string;
    size?: 'sm' | 'lg';
}

export const EnergyButton: React.FC<EnergyButtonProps> = ({
    count,
    onLike,
    className,
    size = 'sm'
}) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    // 觸發粒子特效
    const triggerParticles = useCallback((newCount: number) => {
        const isThousand = newCount > 0 && newCount % 1000 === 0;
        const isHundred = newCount > 0 && newCount % 100 === 0;

        let particleCount = 1; // 預設
        if (isThousand) particleCount = 30;
        else if (isHundred) particleCount = 12;

        const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * (isThousand ? 200 : isHundred ? 100 : 40),
            y: -(Math.random() * (isThousand ? 150 : isHundred ? 80 : 40) + 20),
            size: Math.random() * (isThousand ? 24 : 16) + 8,
            angle: (Math.random() - 0.5) * 60,
            delay: Math.random() * 0.1,
        }));

        setParticles(prev => [...prev.slice(-50), ...newParticles]);

        // 清除舊粒子
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1500);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 預測下一個數值來決定特效
        const nextCount = count + 1;
        triggerParticles(nextCount);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);

        onLike();
    };

    const isThousand = count > 0 && count % 1000 === 0;
    const isHundred = count > 0 && count % 100 === 0;

    return (
        <div className={cn("relative inline-block", className)}>
            {/* 粒子容器 */}
            <AnimatePresence>
                {particles.map(p => (
                    <motion.span
                        key={p.id}
                        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            x: p.x,
                            y: p.y,
                            scale: [0, 1.2, 1, 0.5],
                            rotate: p.angle
                        }}
                        transition={{ duration: 1, delay: p.delay, ease: "easeOut" }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 material-symbols-outlined text-amber-500 fill-icon"
                        style={{ fontSize: p.size }}
                    >
                        sunny
                    </motion.span>
                ))}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                animate={isAnimating ? {
                    scale: isThousand ? [1, 1.4, 0.9, 1] : isHundred ? [1, 1.2, 0.95, 1] : [1, 1.1, 0.95, 1],
                    rotate: isThousand ? [0, -10, 10, -10, 0] : isHundred ? [0, -5, 5, 0] : 0,
                } : {}}
                onClick={handleClick}
                className={cn(
                    "flex items-center gap-2 rounded-full transition-all shadow-md group border-2 z-10",
                    size === 'lg' ? "px-6 py-3" : "px-4 py-2",
                    // 顏色邏輯
                    isThousand
                        ? "bg-red-500 border-red-200 text-white shadow-red-200 animate-pulse"
                        : isHundred
                            ? "bg-amber-400 border-amber-200 text-amber-900 shadow-amber-100"
                            : "bg-amber-warm dark:bg-amber-900/30 border-transparent text-amber-700 dark:text-amber-200 hover:bg-amber-100"
                )}
            >
                <motion.span
                    animate={isAnimating ? {
                        rotate: isThousand ? 360 : isHundred ? 180 : 45
                    } : {}}
                    className={cn(
                        "material-symbols-outlined fill-icon",
                        size === 'lg' ? "text-2xl" : "text-[20px]",
                        isThousand ? "text-white" : "text-amber-500"
                    )}
                >
                    sunny
                </motion.span>
                <span className={cn(
                    "font-black tracking-tight",
                    size === 'lg' ? "text-lg" : "text-sm",
                    isThousand ? "drop-shadow-sm" : ""
                )}>
                    {count} 份正能量
                </span>
            </motion.button>

            {/* 里程碑文字 */}
            <AnimatePresence>
                {isAnimating && (isHundred || isThousand) && (
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: -60 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                    >
                        <span className={cn(
                            "font-black text-xl italic uppercase tracking-tighter",
                            isThousand ? "text-red-600 scale-125 block" : "text-amber-600"
                        )}>
                            {isThousand ? "🔥 Super Energy Burst! 🔥" : "✨ Amazing! ✨"}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
