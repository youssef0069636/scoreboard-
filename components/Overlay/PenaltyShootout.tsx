import React, { useMemo } from 'react';
import { MatchState, EventType } from '../../types';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Props {
  match: MatchState;
}

export const PenaltyShootout: React.FC<Props> = ({ match }) => {
  // Logic to extract penalty stats
  const penaltyEvents = useMemo(() => {
    return match.events
      .filter(e => e.type === EventType.PENALTY)
      .sort((a, b) => a.timestamp - b.timestamp); // Ascending order
  }, [match.events]);

  const homePenalties = penaltyEvents.filter(e => e.teamId === match.homeTeam.id);
  const awayPenalties = penaltyEvents.filter(e => e.teamId === match.awayTeam.id);

  const homeScore = homePenalties.filter(e => e.description === 'GOAL').length;
  const awayScore = awayPenalties.filter(e => e.description === 'GOAL').length;
  
  // Calculate rounds (ensure at least 5 slots are shown)
  const totalKicks = Math.max(homePenalties.length, awayPenalties.length);
  const roundsCount = Math.max(5, totalKicks + 1); // Always show one empty ahead
  const rounds = Array.from({ length: roundsCount }, (_, i) => i);

  // Helper for icons
  const renderResult = (events: any[], index: number) => {
      const event = events[index];
      
      // If no event yet for this slot
      if (!event) {
          // If it's the very next kick (e.g. Home has 2, this is index 2), highlight it
          const isNext = index === events.length;
          return (
             <div className={`w-6 h-6 rounded-full border-2 transition-all ${isNext ? 'border-white bg-white/20 scale-125' : 'border-slate-600 bg-slate-800/50'}`} />
          );
      }
      
      if (event.description === 'GOAL') {
          return (
            <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)] border-2 border-green-400"
            >
                <Check size={20} className="text-white stroke-[4px]" />
            </motion.div>
          );
      }
      return (
        <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.6)] border-2 border-red-500"
        >
            <X size={20} className="text-white stroke-[4px]" />
        </motion.div>
      );
  }

  // Determine status text
  const lastEvent = penaltyEvents[penaltyEvents.length - 1];
  const isHomeNext = homePenalties.length === awayPenalties.length; 
  // Simple logic: if equal kicks, home goes first (usually). 
  const currentTeam = isHomeNext ? match.homeTeam : match.awayTeam;
  const kickNumber = (isHomeNext ? homePenalties.length : awayPenalties.length) + 1;

  return (
    <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center font-ucl z-40"
    >
        {/* Main Board */}
        <div className="bg-[#0e1e5b]/95 backdrop-blur-xl border-y border-x border-white/20 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[900px]">
            {/* Header */}
            <div className="text-center mb-8 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 bg-cyan-600 px-4 py-1 rounded text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                    Penalty Shootout
                </div>

                <div className="flex items-center justify-between gap-12 px-8">
                     {/* Home */}
                     <div className={`flex flex-col items-center w-40 transition-opacity ${currentTeam.id === match.homeTeam.id ? 'opacity-100 scale-105' : 'opacity-60'}`}>
                         <img src={match.homeTeam.logo} className="w-20 h-20 object-contain mb-3 drop-shadow-lg" />
                         <span className="text-3xl font-bold uppercase tracking-tight">{match.homeTeam.shortName}</span>
                         {currentTeam.id === match.homeTeam.id && (
                             <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest mt-2 animate-pulse">Shooting</span>
                         )}
                     </div>
                     
                     {/* Score */}
                     <div className="flex flex-col items-center">
                         <div className="bg-black/40 rounded-xl px-10 py-4 flex items-center gap-6 border border-white/10 shadow-inner">
                             <span className="text-6xl font-mono font-bold text-white tabular-nums text-right w-20">{homeScore}</span>
                             <span className="text-slate-500 text-4xl font-light">vs</span>
                             <span className="text-6xl font-mono font-bold text-white tabular-nums text-left w-20">{awayScore}</span>
                         </div>
                         <div className="mt-2 text-slate-400 text-sm font-bold uppercase tracking-widest">
                             Kick {Math.ceil((homePenalties.length + awayPenalties.length + 1) / 2)}
                         </div>
                     </div>

                     {/* Away */}
                     <div className={`flex flex-col items-center w-40 transition-opacity ${currentTeam.id === match.awayTeam.id ? 'opacity-100 scale-105' : 'opacity-60'}`}>
                         <img src={match.awayTeam.logo} className="w-20 h-20 object-contain mb-3 drop-shadow-lg" />
                         <span className="text-3xl font-bold uppercase tracking-tight">{match.awayTeam.shortName}</span>
                         {currentTeam.id === match.awayTeam.id && (
                             <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest mt-2 animate-pulse">Shooting</span>
                         )}
                     </div>
                </div>
            </div>

            {/* Indicators Grid */}
            <div className="flex flex-col gap-6 bg-black/20 rounded-xl p-6 border border-white/5">
                 {/* Home Row */}
                 <div className="flex items-center gap-6">
                      <div className="w-20 text-right text-sm font-bold text-slate-400 uppercase">{match.homeTeam.shortName}</div>
                      <div className="flex items-center gap-3 flex-1">
                          {rounds.map(i => (
                              <div key={`home-${i}`} className="flex items-center justify-center">
                                  {renderResult(homePenalties, i)}
                              </div>
                          ))}
                      </div>
                 </div>
                 
                 <div className="h-[1px] bg-white/10 w-full" />

                 {/* Away Row */}
                 <div className="flex items-center gap-6">
                      <div className="w-20 text-right text-sm font-bold text-slate-400 uppercase">{match.awayTeam.shortName}</div>
                      <div className="flex items-center gap-3 flex-1">
                          {rounds.map(i => (
                              <div key={`away-${i}`} className="flex items-center justify-center">
                                  {renderResult(awayPenalties, i)}
                              </div>
                          ))}
                      </div>
                 </div>
            </div>
        </div>
    </motion.div>
  );
};