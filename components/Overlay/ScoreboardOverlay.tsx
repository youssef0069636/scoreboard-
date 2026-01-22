import React from 'react';
import { useMatch } from '../../hooks/useMatch';
import { Scorebug } from './Scorebug';
import { LowerThird } from './LowerThird';
import { Lineups } from './Lineups';
import { StatsBoard } from './StatsBoard';

export const ScoreboardOverlay: React.FC = () => {
  const { state } = useMatch(false);

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-transparent">
      {/* Background for testing - normally transparent in OBS */}
      {/* <div className="absolute inset-0 bg-green-500/20 pointer-events-none" /> */}
      
      {/* Logic: If stats or lineups are shown, hide scorebug to avoid clutter */}
      {(!state.overlay.showLineups && !state.overlay.showStats) && <Scorebug match={state} />}
      
      {state.overlay.showLineups && (
        <Lineups match={state} team={state.homeTeam} />
      )}

      {state.overlay.showStats && (
        <StatsBoard match={state} />
      )}

      <LowerThird match={state} />
    </div>
  );
};
