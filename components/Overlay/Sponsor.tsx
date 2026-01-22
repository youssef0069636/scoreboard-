import React, { useState, useEffect } from 'react';
import { MatchState } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  match: MatchState;
}

export const Sponsor: React.FC<Props> = ({ match }) => {
    const [index, setIndex] = useState(0);

    const sponsors = [
        { name: 'Heineken', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Heineken_logo_black.svg/2560px-Heineken_logo_black.svg.png', color: '#008200' },
        { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png', color: '#EB001B' },
        { name: 'PlayStation', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/2560px-PlayStation_logo.svg.png', color: '#003791' },
        { name: 'FedEx', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/1200px-FedEx_Express.svg.png', color: '#4D148C' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % sponsors.length);
        }, 8000); 
        return () => clearInterval(interval);
    }, []);

    if (!match.overlay.showSponsor) return null;

    return (
        <div className="absolute top-12 right-16 z-30">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, rotateX: 90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: -90 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/40 w-48 h-20 flex items-center justify-center"
                >
                    <img 
                        src={sponsors[index].logo} 
                        className="max-w-full max-h-full object-contain" 
                        alt={sponsors[index].name}
                    />
                </motion.div>
            </AnimatePresence>
            <div className="text-right text-[10px] text-white/50 uppercase tracking-widest mt-1 font-bold">Official Partner</div>
        </div>
    );
};