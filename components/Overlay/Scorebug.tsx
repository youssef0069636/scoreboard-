import React from 'react';
import { MatchState } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  match: MatchState;
}

export const Scorebug: React.FC<Props> = ({ match }) => {
  if (!match.overlay.showScoreboard) return null;

  const formatTime = (min: number, sec: number) => 
    `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

  // Score Flip Animation Logic
  const ScoreDigit: React.FC<{ score: number }> = ({ score }) => (
    <div className="relative h-10 w-8 overflow-hidden flex items-center justify-center">
       <AnimatePresence mode="popLayout">
         <motion.span
            key={score}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute font-ucl text-3xl font-bold"
         >
           {score}
         </motion.span>
       </AnimatePresence>
    </div>
  );

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="absolute top-12 left-16 z-50 flex items-stretch h-[54px] select-none shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-ucl"
    >
      {/* 1. Timer Section (Far Left) */}
      <div className="bg-[#020b24] border-r border-slate-700/50 min-w-[90px] px-3 flex flex-col items-center justify-center text-white relative overflow-hidden group">
         {/* Gloss */}
         <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/10 to-transparent" />
         
         <span className="text-xl font-bold tracking-wider tabular-nums leading-none mt-1 z-10">
            {formatTime(match.timer.minutes, match.timer.seconds)}
         </span>
         
         {/* Match Phase Indicator */}
         <div className="flex items-center gap-1.5 mt-0.5 z-10">
           <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${match.timer.isRunning ? 'bg-green-500 text-green-500 animate-pulse' : 'bg-red-500 text-red-500'}`} />
           <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-widest">{match.timer.period}</span>
         </div>

         {match.timer.addedTime > 0 && (
             <div className="absolute -bottom-6 left-0 right-0 bg-green-600 text-center text-xs font-bold py-0.5 border-t border-white/20 shadow-lg">
               +{match.timer.addedTime}
             </div>
         )}
      </div>

      {/* 2. Main Scoreboard Body (Glassmorphism + Midnight Blue) */}
      <div className="flex items-stretch bg-gradient-to-b from-[#0e1e5b] to-[#040b29] text-white border-y border-r border-slate-600/30 relative">
        {/* Metallic Top Edge */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80" />

        {/* Home Team Section */}
        <div className="flex items-center pl-4 pr-3 gap-3 relative">
            <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full border border-white/10 p-1 shadow-inner">
                <img src={match.homeTeam.logo} className="w-full h-full object-contain" alt={match.homeTeam.shortName} />
            </div>
            <span className="text-2xl font-bold tracking-wide uppercase drop-shadow-md">{match.homeTeam.shortName}</span>
            {/* Team Color Bar */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] shadow-[0_-2px_6px_rgba(0,0,0,0.5)]" style={{ backgroundColor: match.homeTeam.colorPrimary }} />
        </div>

        {/* Scores */}
        <div className="flex items-center bg-[#020922]/80 px-4 border-x border-white/10 relative overflow-hidden min-w-[100px] justify-center shadow-inner">
             {/* Background glow behind scores */}
             <div className="absolute inset-0 bg-cyan-500/10 radial-gradient-center" />
             <div className="relative z-10 flex items-center gap-2">
                 <ScoreDigit score={match.homeScore} />
                 <span className="text-slate-500 text-lg mb-1">-</span>
                 <ScoreDigit score={match.awayScore} />
             </div>
        </div>

        {/* Away Team Section */}
        <div className="flex items-center pl-3 pr-4 gap-3 relative">
             {/* Team Color Bar */}
             <div className="absolute bottom-0 left-0 w-full h-[3px] shadow-[0_-2px_6px_rgba(0,0,0,0.5)]" style={{ backgroundColor: match.awayTeam.colorPrimary }} />
             
             <span className="text-2xl font-bold tracking-wide uppercase drop-shadow-md">{match.awayTeam.shortName}</span>
             <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full border border-white/10 p-1 shadow-inner">
                <img src={match.awayTeam.logo} className="w-full h-full object-contain" alt={match.awayTeam.shortName} />
            </div>
        </div>
      </div>
      
      {/* UCL Logo Endcap */}
      <div className="bg-[#020922] w-14 flex items-center justify-center border-y border-r border-slate-600/30 relative overflow-hidden">
         {/* Starball Pattern BG */}
         <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Starball_2024.svg/1024px-Starball_2024.svg.png')] bg-cover bg-center" />
         <img 
           src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/UEFA_Champions_League_logo_2.svg/2048px-UEFA_Champions_League_logo_2.svg.png" 
           className="w-10 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
           alt="UCL"
         />
      </div>

    </motion.div>
  );
};
