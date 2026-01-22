import React from 'react';
import { MatchState } from '../../types';
import { motion } from 'framer-motion';

interface Props {
  match: MatchState;
}

const StatRow: React.FC<{ label: string; homeValue: number | string; awayValue: number | string; isPercent?: boolean; maxValue?: number }> = ({ label, homeValue, awayValue, isPercent, maxValue }) => {
    const hVal = typeof homeValue === 'string' ? parseFloat(homeValue) : homeValue;
    const aVal = typeof awayValue === 'string' ? parseFloat(awayValue) : awayValue;
    
    // Calculate visualization width
    let total = hVal + aVal;
    // If a manual max value is provided (e.g. for possession which is out of 100), use that, otherwise use total
    const denominator = maxValue || (total === 0 ? 1 : total);
    
    // If not percent based (like possession), we calculate relative strength
    let homeWidth = 50;
    let awayWidth = 50;

    if (maxValue) {
        // Absolute values (like 50% vs 50% possession)
        homeWidth = hVal;
        awayWidth = aVal;
    } else if (total > 0) {
        // Relative comparison (e.g. 5 shots vs 10 shots)
        homeWidth = (hVal / total) * 100;
        awayWidth = (aVal / total) * 100;
    }

    return (
        <div className="flex items-center w-full max-w-4xl mx-auto mb-5">
            <div className="w-24 text-right text-3xl font-bold text-white pr-4 tabular-nums">
                {homeValue}{isPercent ? '%' : ''}
            </div>
            
            <div className="flex-1 flex flex-col gap-1">
                <div className="text-center text-cyan-400 font-bold uppercase tracking-widest text-xs mb-0.5">{label}</div>
                <div className="h-3 flex rounded-full overflow-hidden bg-slate-800 shadow-inner border border-slate-700/50 relative">
                     {/* Center Marker */}
                     <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30 z-10" />
                     
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${homeWidth}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                     />
                     <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${awayWidth}%` }}
                         transition={{ duration: 1, delay: 0.2 }}
                         className="h-full bg-gradient-to-l from-purple-600 to-purple-400 ml-auto"
                     />
                </div>
            </div>

            <div className="w-24 text-left text-3xl font-bold text-white pl-4 tabular-nums">
                {awayValue}{isPercent ? '%' : ''}
            </div>
        </div>
    );
};

export const StatsBoard: React.FC<Props> = ({ match }) => {
    if (!match.overlay.showStats) return null;

    const { homeStats, awayStats, homeTeam, awayTeam } = match;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="absolute inset-0 bg-[#020922] z-30 flex flex-col items-center justify-center font-ucl"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-ucl-stars opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-[#020922]/90 to-[#020922] pointer-events-none" />

            <div className="relative z-10 w-full max-w-6xl bg-[#0e1e5b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl flex gap-12">
                 
                 {/* Match Header Info (Left) */}
                 <div className="w-1/3 flex flex-col items-center justify-center border-r border-white/10 pr-12">
                     <h2 className="text-cyan-400 text-xl uppercase tracking-[0.5em] font-bold mb-8">Match Statistics</h2>
                     
                     <div className="flex flex-col items-center gap-6 w-full">
                         {/* Home */}
                         <div className="flex items-center gap-4 w-full">
                             <img src={homeTeam.logo} className="w-16 h-16 object-contain" />
                             <h1 className="text-2xl font-bold uppercase text-white truncate">{homeTeam.shortName}</h1>
                             <span className="text-4xl font-mono text-cyan-400 ml-auto">{match.homeScore}</span>
                         </div>

                         <div className="w-full h-[1px] bg-white/10" />

                         {/* Away */}
                         <div className="flex items-center gap-4 w-full">
                             <img src={awayTeam.logo} className="w-16 h-16 object-contain" />
                             <h1 className="text-2xl font-bold uppercase text-white truncate">{awayTeam.shortName}</h1>
                             <span className="text-4xl font-mono text-purple-400 ml-auto">{match.awayScore}</span>
                         </div>
                     </div>

                     <div className="bg-white/10 px-6 py-2 rounded-full text-lg font-bold mt-12 uppercase text-white border border-white/5 shadow-lg">
                         {match.timer.period === 'FT' ? 'Full Time' : match.timer.period === 'HT' ? 'Half Time' : `${match.timer.minutes}' Played`}
                     </div>
                 </div>

                 {/* Stats Grid (Right) */}
                 <div className="w-2/3 flex flex-col justify-center">
                     <StatRow label="Possession" homeValue={homeStats.possession} awayValue={awayStats.possession} isPercent maxValue={100} />
                     <StatRow label="Expected Goals (xG)" homeValue={homeStats.xg.toFixed(2)} awayValue={awayStats.xg.toFixed(2)} />
                     <div className="grid grid-cols-2 gap-x-8">
                         <StatRow label="Shots" homeValue={homeStats.shots} awayValue={awayStats.shots} />
                         <StatRow label="On Target" homeValue={homeStats.shotsOnTarget} awayValue={awayStats.shotsOnTarget} />
                     </div>
                     <div className="grid grid-cols-2 gap-x-8">
                        <StatRow label="Passes" homeValue={homeStats.passes} awayValue={awayStats.passes} />
                        <StatRow label="Corners" homeValue={homeStats.corners} awayValue={awayStats.corners} />
                     </div>
                     <div className="grid grid-cols-2 gap-x-8">
                        <StatRow label="Fouls" homeValue={homeStats.fouls} awayValue={awayStats.fouls} />
                        <StatRow label="Offsides" homeValue={homeStats.offsides} awayValue={awayStats.offsides} />
                     </div>
                     <div className="grid grid-cols-2 gap-x-8">
                        <StatRow label="Yellow Cards" homeValue={homeStats.yellowCards} awayValue={awayStats.yellowCards} />
                        <StatRow label="Saves" homeValue={homeStats.saves} awayValue={awayStats.saves} />
                     </div>
                 </div>
            </div>
        </motion.div>
    );
};