'use client';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function HeroCountdown() {
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div className="flex items-center gap-3 mt-5 justify-center lg:justify-start">
            <Clock className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-yellow-200 font-medium text-sm">ينتهي العرض خلال:</span>
            <div className="flex items-center gap-1">
                {[{ label: 'س', val: pad(timeLeft.hours) }, { label: 'د', val: pad(timeLeft.minutes) }, { label: 'ث', val: pad(timeLeft.seconds) }].map(({ label, val }, i) => (
                    <span key={i} className="flex flex-col items-center">
                        <span className="bg-white/20 backdrop-blur text-white font-black text-lg px-2.5 py-1 rounded-lg min-w-[2.5rem] text-center tabular-nums">
                            {val}
                        </span>
                        <span className="text-yellow-300 text-[10px] mt-0.5">{label}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
