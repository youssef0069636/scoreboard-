import React from 'react';
import { MatchState, Team, Player } from '../../types';
import { motion } from 'framer-motion';

interface Props {
  match: MatchState;
}

const PlayerNode: React.FC<{ player: Player; x: number; y: number; delay: number }> = ({ player, x, y, delay }) => (
    <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
        style={{ left: `${x}%`, top: `${y}%` }}
    >
        <div className="relative">
            {/* Shirt Circle */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-slate-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-2 border-slate-400 flex items-center justify-center relative z-10">
                <span className="text-xl font-bold text-slate-900">{player.number}</span>
            </div>
            {/* Shadow under player */}
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-black/40 blur-md rounded-full" />
        </div>
        
        <div className="bg-[#0e1e5b]/90 backdrop-blur px-3 py-1 rounded text-center border border-white/20 shadow-lg">
            <div className="text-sm font-bold text-white whitespace-nowrap leading-none uppercase">{player.name}</div>
        </div>
    </motion.div>
);

const TeamFormation: React.FC<{ team: Team; side: 'home' | 'away' }> = ({ team, side }) => {
    // Hardcoded 4-3-3 coordinates for simplicity. 
    // In a full app, this would be dynamic based on a "formation" property in Team.
    const getCoordinates = (index: number) => {
        // GK
        if (index === 0) return { x: 50, y: 85 };
        // DEF (4)
        if (index === 1) return { x: 20, y: 65 }; // RB
        if (index === 2) return { x: 40, y: 70 }; // CB
        if (index === 3) return { x: 60, y: 70 }; // CB
        if (index === 4) return { x: 80, y: 65 }; // LB
        // MID (3)
        if (index === 5) return { x: 30, y: 45 };
        if (index === 6) return { x: 50, y: 50 };
        if (index === 7) return { x: 70, y: 45 };
        // FWD (3)
        if (index === 8) return { x: 20, y: 20 };
        if (index === 9) return { x: 50, y: 15 };
        if (index === 10) return { x: 80, y: 20 };
        return { x: 50, y: 50 };
    };

    return (
        <div className="relative w-[800px] h-[600px] bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm">
             {/* Pitch Graphic */}
             <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/82/Soccer_Field_Transparant.svg')] bg-cover opacity-30 bg-center" />
             <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent" />
             
             {/* Header */}
             <div className="absolute top-4 left-0 w-full text-center z-20">
                 <img src={team.logo} className="w-16 h-16 object-contain mx-auto mb-2 drop-shadow-lg" />
                 <h2 className="text-3xl font-bold text-white uppercase italic tracking-wider drop-shadow-md">{team.shortName}</h2>
                 <p className="text-cyan-400 font-bold tracking-[0.5em] text-sm uppercase">4 - 3 - 3</p>
             </div>

             {/* Players */}
             {team.players.slice(0, 11).map((player, i) => {
                 const coords = getCoordinates(i);
                 return <PlayerNode key={player.id} player={player} x={coords.x} y={coords.y} delay={0.5 + (i * 0.1)} />;
             })}
        </div>
    );
};

export const Formation: React.FC<Props> = ({ match }) => {
    if (!match.overlay.showFormation) return null;

    return (
        <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 1.1 }}
             className="absolute inset-0 z-30 flex items-center justify-center gap-16 font-ucl bg-[#020922]/90 backdrop-blur-md"
        >
             <TeamFormation team={match.homeTeam} side="home" />
             <div className="h-[400px] w-[2px] bg-white/10 rounded-full" />
             <TeamFormation team={match.awayTeam} side="away" />
        </motion.div>
    );
};