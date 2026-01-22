import React, { useState, useEffect } from 'react';
import { MatchState } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    match: MatchState;
}

export const BottomTicker: React.FC<Props> = ({ match }) => {
    const [index, setIndex] = useState(0);

    const statsConfig = [
        { label: 'Possession', key: 'possession', isPercent: true },
        { label: 'Attempts', key: 'shots' },
        { label: 'On Target', key: 'shotsOnTarget' },
        { label: 'Corners', key: 'corners' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % statsConfig.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(interval);
    }, [statsConfig.length]);

    if (!match.overlay.showTicker) return null;

    const currentStat = statsConfig[index];
    // @ts-ignore
    const homeValue = match.homeStats[currentStat.key];
    // @ts-ignore
    const awayValue = match.awayStats[currentStat.key];
    const total = homeValue + awayValue;
    
    // Calculate widths for the bar visualization
    // Prevent division by zero defaults
    let homeWidth = 50;
    if (total > 0) {
        homeWidth = (homeValue / total) * 100;
    } else if (currentStat.key === 'possession') {
        // Special case for initial possession
        homeWidth = 50;
    }

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[600px] h-14 bg-[#0e1e5b]/90 backdrop-blur-md rounded-full border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center overflow-hidden font-ucl z-10"
        >
            {/* Gloss */}
            <div className="absolute top-0 left-0 w-full h-[50%] bg-white/5 pointer-events-none" />

            {/* Content Container */}
            <div className="relative w-full h-full flex items-center justify-between px-6">
                
                {/* Home Logo & Value */}
                <div className="flex items-center gap-3 w-32">
                    <img src={match.homeTeam.logo} className="w-8 h-8 object-contain drop-shadow" />
                    <span className="text-2xl font-bold text-white tabular-nums">
                        {homeValue}{currentStat.isPercent ? '%' : ''}
                    </span>
                </div>

                {/* Center Label & Bar */}
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                     <AnimatePresence mode='wait'>
                        <motion.span 
                            key={currentStat.label}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] mb-1"
                        >
                            {currentStat.label}
                        </motion.span>
                     </AnimatePresence>

                     {/* Visual Bar */}
                     <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex relative">
                         <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30 z-10" />
                         <motion.div 
                            initial={false}
                            animate={{ width: `${homeWidth}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                            className="h-full bg-white"
                         />
                         <div className="flex-1 bg-slate-600/50" />
                     </div>
                </div>

                {/* Away Logo & Value */}
                <div className="flex items-center gap-3 w-32 justify-end">
                    <span className="text-2xl font-bold text-white tabular-nums">
                        {awayValue}{currentStat.isPercent ? '%' : ''}
                    </span>
                    <img src={match.awayTeam.logo} className="w-8 h-8 object-contain drop-shadow" />
                </div>

            </div>
        </motion.div>
    );
};