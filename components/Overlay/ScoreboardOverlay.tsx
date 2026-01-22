import React from 'react';
import { useMatch } from '../../hooks/useMatch';
import { Scorebug } from './Scorebug';
import { LowerThird } from './LowerThird';
import { Lineups } from './Lineups';
import { StatsBoard } from './StatsBoard';
import { PenaltyShootout } from './PenaltyShootout';
import { BottomTicker } from './BottomTicker';
import { Formation } from './Formation';
import { Intro } from './Intro';
import { Sponsor } from './Sponsor';

export const ScoreboardOverlay: React.FC = () => {
  const { state } = useMatch(false);
  const isPenaltyShootout = state.timer.period === 'PEN';
  // Full screen graphics that should hide the bug/ticker
  const isFullScreen = state.overlay.showLineups || state.overlay.showStats || state.overlay.showFormation || state.overlay.showIntro || isPenaltyShootout;

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-transparent">
      {/* Background for testing - normally transparent in OBS */}
      {/* <div className="absolute inset-0 bg-green-500/20 pointer-events-none" /> */}
      
      {state.overlay.showIntro && <Intro match={state} />}

      {!isFullScreen && <Scorebug match={state} />}
      
      {state.overlay.showLineups && (
        <Lineups match={state} team={state.homeTeam} />
      )}

      {state.overlay.showStats && (
        <StatsBoard match={state} />
      )}

      {state.overlay.showFormation && (
        <Formation match={state} />
      )}

      {isPenaltyShootout && (
        <PenaltyShootout match={state} />
      )}
      
      {/* Live Ticker - always available unless full screens override it */}
      {!isFullScreen && (
          <BottomTicker match={state} />
      )}

      {/* Sponsor - usually always visible unless intro/lineups covering it */}
      {!state.overlay.showIntro && !state.overlay.showLineups && (
          <Sponsor match={state} />
      )}

      <LowerThird match={state} />
    </div>
  );
};