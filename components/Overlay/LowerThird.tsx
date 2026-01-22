import React from 'react';
import { MatchState, EventType, Team, MatchEvent } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor } from 'lucide-react';

interface Props {
  match: MatchState;
}

// --- UCL BROADCAST COMPONENTS ---

// 1a. UCL GOAL ANIMATION - SLIDE (Classic/Huge)
const UclGoalSlide: React.FC<{ event: MatchEvent; team: Team }> = ({ event, team }) => {
    return (
        <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 40, damping: 10 }}
            className="relative h-40 flex items-center font-ucl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-r-4 border-white/20"
            style={{ 
                background: `linear-gradient(90deg, #0e1e5b 0%, #040b29 100%)`,
                minWidth: '900px',
                borderTopRightRadius: '50px',
                borderBottomRightRadius: '50px'
            }}
        >
            {/* Starball Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Starball_2024.svg/1024px-Starball_2024.svg.png')] bg-repeat space-x-4" />
            
            {/* Shiny highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400 to-transparent" />
            
            {/* Left Color Strip */}
            <div className="w-6 h-full mr-8" style={{ backgroundColor: team.colorPrimary }} />

            {/* Logo */}
            <motion.img 
                src={team.logo}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 }}
                className="w-28 h-28 object-contain mr-8 drop-shadow-2xl relative z-10"
            />

            {/* Content */}
            <div className="flex flex-col relative z-10 pr-16">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-7xl font-bold text-white uppercase tracking-tighter italic"
                    style={{ textShadow: '0 0 20px rgba(56, 167, 208, 0.6)' }}
                >
                    GOAL
                </motion.div>
                
                <div className="flex items-center gap-4 mt-1">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.6 }}
                        className="h-[2px] bg-cyan-400"
                     />
                </div>

                <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-4 mt-2"
                >
                    <span className="text-4xl text-cyan-300 font-bold">{event.player?.name}</span>
                    <span className="bg-white text-[#0e1e5b] px-2 py-0 text-3xl font-bold rounded-sm">{event.minute}'</span>
                </motion.div>
            </div>

            {/* Background Flare */}
            <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
        </motion.div>
    );
}

// 1b. UCL GOAL ANIMATION - CENTER BURST (Pop/Explosion)
const UclGoalBurst: React.FC<{ event: MatchEvent; team: Team }> = ({ event, team }) => {
    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center font-ucl z-50 pointer-events-none"
        >
            {/* Burst Background */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent blur-3xl scale-150"
                style={{ background: `radial-gradient(circle, ${team.colorPrimary}50 0%, transparent 70%)` }}
            />
            
            <motion.img 
                src={team.logo}
                animate={{ scale: [0.8, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-80 h-80 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] z-10"
            />
            
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-[12rem] font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 leading-none drop-shadow-2xl z-20"
                style={{ textShadow: `0 10px 30px ${team.colorSecondary}` }}
            >
                GOAL
            </motion.div>
            
            <motion.div 
                 initial={{ y: 50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="bg-[#0e1e5b]/90 backdrop-blur-xl px-12 py-3 rounded-full border border-white/20 mt-4 flex items-center gap-6 z-20 shadow-2xl"
            >
                 <div className="w-5 h-5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: team.colorPrimary }} />
                 <span className="text-4xl font-bold text-white uppercase tracking-tight">{event.player?.name}</span>
                 <div className="h-8 w-[1px] bg-white/20" />
                 <span className="text-3xl text-cyan-400 font-mono">{event.minute}'</span>
            </motion.div>
        </motion.div>
    );
}

// 2. UCL CARD ANIMATION
const UclCard: React.FC<{ event: MatchEvent; team: Team; isRed: boolean }> = ({ event, team, isRed }) => {
    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="h-28 bg-[#0e1e5b]/95 backdrop-blur-md border border-white/10 flex items-center pr-12 rounded-r-full overflow-hidden shadow-2xl font-ucl ml-12"
            style={{ maxWidth: '800px' }}
        >
             {/* Card Indicator Strip */}
             <div className={`w-3 h-full ${isRed ? 'bg-red-600' : 'bg-yellow-400'}`} />
             
             {/* Team Logo */}
             <div className="w-24 h-full flex items-center justify-center bg-black/20">
                 <img src={team.logo} className="w-14 h-14 object-contain" />
             </div>

             {/* Card Graphic */}
             <div className="ml-6 mr-6 relative">
                 <div className={`w-10 h-14 rounded shadow-lg border border-white/20 transform -rotate-6 ${isRed ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-yellow-300 to-yellow-500'}`} />
             </div>

             {/* Text */}
             <div className="flex flex-col">
                 <div className="text-2xl font-bold text-slate-300 uppercase tracking-widest">{isRed ? 'RED CARD' : 'YELLOW CARD'}</div>
                 <div className="flex items-baseline gap-3">
                     <span className="text-4xl font-bold text-white uppercase">{event.player?.name}</span>
                     <span className="text-2xl text-cyan-400">{event.player?.number}</span>
                 </div>
             </div>
        </motion.div>
    )
}

// 3. UCL SUB ANIMATION
const UclSub: React.FC<{ event: MatchEvent; team: Team }> = ({ event, team }) => (
    <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col gap-1 font-ucl ml-12"
    >
        <div className="bg-[#0e1e5b] text-white px-6 py-2 rounded-tr-lg w-fit border-l-4 border-cyan-400 font-bold tracking-widest text-sm uppercase">
            Substitution • {team.shortName}
        </div>
        
        {/* IN */}
        <div className="flex items-center bg-[#040b29]/90 backdrop-blur w-[500px] border-l-4 border-green-500 p-3 shadow-lg">
             <div className="w-12 text-green-500 font-black text-2xl text-center">IN</div>
             <div className="h-10 w-[1px] bg-white/10 mx-4" />
             <div className="flex flex-col">
                 <span className="text-2xl font-bold text-white uppercase">{event.playerIn?.name}</span>
                 <span className="text-xs text-slate-400">#{event.playerIn?.number} {event.playerIn?.position}</span>
             </div>
        </div>

        {/* OUT */}
        <div className="flex items-center bg-[#040b29]/90 backdrop-blur w-[500px] border-l-4 border-red-500 p-3 shadow-lg">
             <div className="w-12 text-red-500 font-black text-2xl text-center">OUT</div>
             <div className="h-10 w-[1px] bg-white/10 mx-4" />
             <div className="flex flex-col">
                 <span className="text-2xl font-bold text-slate-400 uppercase">{event.playerOut?.name}</span>
                 <span className="text-xs text-slate-500">#{event.playerOut?.number} {event.playerOut?.position}</span>
             </div>
        </div>
    </motion.div>
)

// 4. PENALTY / GENERIC STRAP
const UclStrap: React.FC<{ title: string; subtitle: string; colorClass: string; icon?: React.ReactNode }> = ({ title, subtitle, colorClass, icon }) => (
    <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="relative mx-auto bg-[#0e1e5b] min-w-[600px] max-w-4xl h-24 rounded-full flex items-center px-8 border-2 border-slate-600/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden font-ucl"
    >
        {/* Animated Gradient BG */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1e5b] via-[#1a2f7d] to-[#0e1e5b] opacity-80" />
        
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white z-10 shadow-lg ${colorClass}`}>
            {icon}
        </div>

        <div className="ml-6 flex flex-col z-10">
            <h2 className="text-4xl font-bold text-white tracking-wide uppercase italic">{title}</h2>
            <p className="text-xl text-cyan-300 uppercase tracking-widest font-semibold">{subtitle}</p>
        </div>

        {/* Shine */}
        <motion.div 
            animate={{ x: ['-200%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
        />
    </motion.div>
);

// 5. VAR ANIMATION (Neon Box)
const UclVar: React.FC = () => (
    <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        className="w-[600px] h-[300px] bg-black/90 border-[3px] border-cyan-500 rounded-lg relative flex flex-col items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.6)] font-ucl overflow-hidden mx-auto"
    >
        {/* Shutter / Scan effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[length:10px_10px]" />
        
        <motion.div 
           animate={{ opacity: [0.5, 1, 0.5] }}
           transition={{ duration: 0.2, repeat: Infinity }}
           className="border-[2px] border-cyan-400/50 absolute top-4 bottom-4 left-4 right-4 rounded"
        />
        
        {/* Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-500" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-500" />

        <Monitor size={64} className="text-cyan-400 mb-4 animate-pulse" />
        <h1 className="text-6xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">VAR CHECK</h1>
        <div className="bg-cyan-900/50 px-4 py-1 rounded text-cyan-300 uppercase tracking-widest mt-2 border border-cyan-500/30">
            Reviewing Incident
        </div>
    </motion.div>
);

// --- MAIN CONTROLLER ---

export const LowerThird: React.FC<Props> = ({ match }) => {
  const { activeEvent } = match.overlay;

  if (!activeEvent) return null;

  const team = activeEvent.teamId === match.homeTeam.id ? match.homeTeam : match.awayTeam;
  const isGoal = activeEvent.type === EventType.GOAL;
  const isYellow = activeEvent.type === EventType.YELLOW_CARD;
  const isRed = activeEvent.type === EventType.RED_CARD;
  const isSub = activeEvent.type === EventType.SUBSTITUTION;
  const isVar = activeEvent.type === EventType.VAR;
  const isPenalty = activeEvent.type === EventType.PENALTY;

  return (
    <AnimatePresence>
      {activeEvent && (
        <div className="absolute bottom-20 left-0 w-full flex justify-center z-40 pointer-events-none">
          
          {/* Goal Animation - Dynamic Choice */}
          {isGoal && (
             team.goalAnimationType === 'CENTER_BURST' ? (
                <UclGoalBurst event={activeEvent} team={team} />
             ) : (
                <div className="absolute bottom-10 left-0">
                    <UclGoalSlide event={activeEvent} team={team} />
                </div>
             )
          )}

          {/* Cards */}
          {(isYellow || isRed) && (
              <div className="absolute bottom-10 left-0">
                  <UclCard event={activeEvent} team={team} isRed={isRed} />
              </div>
          )}

          {/* Subs */}
          {isSub && (
              <div className="absolute bottom-10 left-0">
                  <UclSub event={activeEvent} team={team} />
              </div>
          )}

          {/* VAR */}
          {isVar && <UclVar />}

          {/* Penalty */}
          {isPenalty && (
             <UclStrap 
                title={activeEvent.description === 'GOAL' ? 'PENALTY GOAL' : activeEvent.description === 'SAVED' ? 'PENALTY SAVED' : 'PENALTY MISSED'} 
                subtitle={team.name} 
                colorClass={
                    activeEvent.description === 'GOAL' ? 'bg-green-600' : 
                    activeEvent.description === 'SAVED' ? 'bg-orange-500' : 'bg-red-600'
                }
                icon={<div className="w-4 h-4 rounded-full bg-white animate-pulse" />}
             />
          )}

        </div>
      )}
    </AnimatePresence>
  );
};