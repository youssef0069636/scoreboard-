import React from 'react';
import { MatchState, Team } from '../../types';
import { motion } from 'framer-motion';

interface Props {
  match: MatchState;
  team: Team;
}

export const Lineups: React.FC<Props> = ({ match, team }) => {
  if (!match.overlay.showLineups) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-[#020922] text-white font-ucl overflow-hidden"
    >
      {/* Background with Stars */}
      <div className="absolute inset-0 bg-ucl-stars opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#020922]/80 to-[#020922]" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center pt-16">
          
          {/* Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center mb-12"
          >
             <h2 className="text-cyan-400 text-2xl tracking-[0.5em] uppercase font-bold mb-2">Starting XI</h2>
             <h1 className="text-7xl font-bold uppercase italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
               {team.name}
             </h1>
             <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-4" />
          </motion.div>

          {/* Layout Split */}
          <div className="flex w-full max-w-7xl px-12 gap-16 h-[700px]">
              
              {/* Left: Captain/Star Player/Coach Image */}
              <motion.div 
                 initial={{ x: -100, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ delay: 0.3 }}
                 className="w-1/3 flex flex-col items-center justify-center relative"
              >
                  {/* Glowing Logo behind */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-3xl">
                      <img src={team.logo} className="w-[500px]" />
                  </div>
                  
                  <img src={team.logo} className="w-64 h-64 object-contain drop-shadow-2xl relative z-10" />
                  
                  <div className="mt-12 bg-white/5 backdrop-blur border border-white/10 p-6 rounded-xl w-full text-center">
                      <div className="text-slate-400 uppercase tracking-widest text-sm mb-1">Head Coach</div>
                      <div className="text-3xl font-bold">{team.coach}</div>
                  </div>
              </motion.div>

              {/* Right: Player Grid */}
              <div className="w-2/3 grid grid-cols-2 gap-x-8 gap-y-3 overflow-y-auto content-start">
                  {team.players.map((player, idx) => (
                      <motion.div
                        key={player.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + (idx * 0.05) }}
                        className="flex items-center gap-4 bg-gradient-to-r from-[#0e1e5b] to-transparent p-3 border-b border-white/5 group hover:border-cyan-400/50 transition-colors"
                      >
                         <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl text-cyan-300 border-r border-white/10 pr-4">
                             {player.number}
                         </div>
                         <div className="flex flex-col">
                             <span className="text-2xl font-bold uppercase tracking-tight group-hover:text-cyan-300 transition-colors">{player.name}</span>
                             <span className="text-xs text-slate-400 uppercase tracking-widest">{player.position}</span>
                         </div>
                         {/* Player Image Thumbnail if avail */}
                         {player.image && (
                            <img src={player.image} className="w-12 h-12 rounded-full object-cover ml-auto border border-white/20" />
                         )}
                      </motion.div>
                  ))}
              </div>
          </div>
      </div>
    </motion.div>
  );
};