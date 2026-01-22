import React from 'react';
import { MatchState } from '../../types';
import { motion } from 'framer-motion';

interface Props {
  match: MatchState;
}

export const Intro: React.FC<Props> = ({ match }) => {
    if (!match.overlay.showIntro) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#020922] font-ucl overflow-hidden flex flex-col items-center justify-center"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-ucl-stars opacity-50 animate-pulse" />
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020922_80%)] opacity-80"
            />

            {/* Tournament Header */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-16 relative z-10"
            >
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/UEFA_Champions_League_logo_2.svg/2048px-UEFA_Champions_League_logo_2.svg.png" 
                    className="w-32 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                />
                <h1 className="text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                    {match.tournamentName}
                </h1>
            </motion.div>

            {/* Versus Section */}
            <div className="flex items-center gap-24 relative z-10">
                {/* Home */}
                <motion.div 
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 50, delay: 1 }}
                    className="flex flex-col items-center"
                >
                    <img src={match.homeTeam.logo} className="w-64 h-64 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]" />
                    <h2 className="text-5xl font-bold text-white mt-8 uppercase tracking-wide">{match.homeTeam.name}</h2>
                </motion.div>

                {/* VS */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 1.5 }}
                    className="text-8xl font-black italic text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                >
                    VS
                </motion.div>

                {/* Away */}
                 <motion.div 
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 50, delay: 1 }}
                    className="flex flex-col items-center"
                >
                    <img src={match.awayTeam.logo} className="w-64 h-64 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]" />
                    <h2 className="text-5xl font-bold text-white mt-8 uppercase tracking-wide">{match.awayTeam.name}</h2>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute bottom-16 text-cyan-200 uppercase tracking-[1em] text-sm font-bold"
            >
                Live Broadcast
            </motion.div>
        </motion.div>
    );
};