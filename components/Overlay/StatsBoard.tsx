import React from 'react';
import { MatchState } from '../../types';
import { motion } from 'framer-motion';

interface Props {
  match: MatchState;
}

const StatRow: React.FC<{ label: string; homeValue: number; awayValue: number; isPercent?: boolean }> = ({ label, homeValue, awayValue, isPercent }) => {
    const total = homeValue + awayValue;
    const homeWidth = total === 0 ? 50 : (homeValue / total) * 100;
    const awayWidth = total === 0 ? 50 : (awayValue / total) * 100;

    return (
        <div className="flex items-center w-full max-w-4xl mx-auto mb-6">
            <div className="w-24 text-right text-3xl font-bold text-white pr-4 tabular-nums">
                {homeValue}{isPercent ? '%' : ''}
            </div>
            
            <div className="flex-1 flex flex-col gap-1">
                <div className="text-center text-cyan-400 font-bold uppercase tracking-widest text-sm mb-1">{label}</div>
                <div className="h-4 flex rounded-full overflow-hidden bg-slate-800 shadow-inner border border-slate-700/50 relative">
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

            <div className="relative z-10 w-full max-w-5xl bg-[#0e1e5b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl">
                 {/* Header */}
                 <div className="text-center mb-12">
                     <h2 className="text-cyan-400 text-xl uppercase tracking-[0.5em] font-bold mb-2">Match Statistics</h2>
                     <div className="flex items-center justify-center gap-12">
                         <div className="flex flex-col items-center">
                             <img src={homeTeam.logo} className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                             <h1 className="text-4xl font-bold uppercase mt-4 text-white">{homeTeam.shortName}</h1>
                         </div>
                         <div className="flex flex-col items-center">
                             <div className="text-6xl font-black text-white bg-clip-text bg-gradient-to-b from-white to-slate-400 text-transparent">
                                 {match.homeScore} - {match.awayScore}
                             </div>
                             <div className="bg-white/10 px-4 py-1 rounded-full text-sm font-bold mt-2 uppercase text-cyan-200 border border-white/5">
                                 {match.timer.period === 'FT' ? 'Full Time' : match.timer.period === 'HT' ? 'Half Time' : 'Live'}
                             </div>
                         </div>
                         <div className="flex flex-col items-center">
                             <img src={awayTeam.logo} className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                             <h1 className="text-4xl font-bold uppercase mt-4 text-white">{awayTeam.shortName}</h1>
                         </div>
                     </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="flex flex-col gap-2">
                     <StatRow label="Possession" homeValue={homeStats.possession} awayValue={awayStats.possession} isPercent />
                     <StatRow label="Shots" homeValue={homeStats.shots} awayValue={awayStats.shots} />
                     <StatRow label="On Target" homeValue={homeStats.shotsOnTarget} awayValue={awayStats.shotsOnTarget} />
                     <StatRow label="Corners" homeValue={homeStats.corners} awayValue={awayStats.corners} />
                     <StatRow label="Fouls" homeValue={homeStats.fouls} awayValue={awayStats.fouls} />
                     <StatRow label="Yellow Cards" homeValue={homeStats.yellowCards} awayValue={awayStats.yellowCards} />
                     <StatRow label="Red Cards" homeValue={homeStats.redCards} awayValue={awayStats.redCards} />
                 </div>
            </div>
        </motion.div>
    );
};
