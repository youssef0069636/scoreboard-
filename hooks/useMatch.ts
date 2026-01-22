import { useReducer, useEffect, useCallback } from 'react';
import { MatchState, Action } from '../types';
import { INITIAL_STATE } from '../constants';
import { sendAction, subscribe } from '../services/channel';

// Reducer
const matchReducer = (state: MatchState, action: Action): MatchState => {
  switch (action.type) {
    case 'SET_SCORE':
      return {
        ...state,
        homeScore: action.payload.teamId === state.homeTeam.id ? action.payload.score : state.homeScore,
        awayScore: action.payload.teamId === state.awayTeam.id ? action.payload.score : state.awayScore,
      };
    case 'UPDATE_TIMER':
      return { ...state, timer: { ...state.timer, ...action.payload } };
    case 'TRIGGER_EVENT':
      // Auto-increment stats based on event
      const isHome = action.payload.teamId === state.homeTeam.id;
      const statsKey = isHome ? 'homeStats' : 'awayStats';
      let newStats = { ...state[statsKey] };

      if (action.payload.type === 'YELLOW_CARD') newStats.yellowCards++;
      if (action.payload.type === 'RED_CARD') newStats.redCards++;
      // Note: Goals are handled in SET_SCORE usually, but we could track them here too if stats need to be specific

      return {
        ...state,
        [statsKey]: newStats,
        events: [action.payload, ...state.events],
        overlay: { ...state.overlay, activeEvent: action.payload }
      };
    case 'CLEAR_EVENT':
      return { ...state, overlay: { ...state.overlay, activeEvent: null } };
    case 'TOGGLE_OVERLAY':
      return {
        ...state,
        overlay: { ...state.overlay, [action.payload]: !state.overlay[action.payload] }
      };
    case 'SET_TEAMS':
      return {
        ...state,
        homeTeam: action.payload.home,
        awayTeam: action.payload.away,
        homeScore: 0,
        awayScore: 0,
        events: []
      };
    case 'UPDATE_TEAM_CONFIG':
      if (state.homeTeam.id === action.payload.teamId) {
        return { ...state, homeTeam: { ...state.homeTeam, ...action.payload.updates } };
      } else {
        return { ...state, awayTeam: { ...state.awayTeam, ...action.payload.updates } };
      }
    case 'UPDATE_STATS':
        if (state.homeTeam.id === action.payload.teamId) {
            return { ...state, homeStats: { ...state.homeStats, ...action.payload.stats } };
        } else {
            return { ...state, awayStats: { ...state.awayStats, ...action.payload.stats } };
        }
    case 'SYNC_STATE':
      return action.payload;
    default:
      return state;
  }
};

export const useMatch = (isController: boolean = false) => {
  const [state, dispatch] = useReducer(matchReducer, INITIAL_STATE);

  // Sync effect
  useEffect(() => {
    const unsubscribe = subscribe((action) => {
      // If we are the overlay, we accept all actions from controller
      // If we are controller, we generally drive state but might listen for specific things if needed
      // For simplicity, we just sync state for now.
      if (!isController && action.type === 'SYNC_STATE') {
        dispatch(action);
      } else {
        dispatch(action);
      }
    });

    // If I am the controller, I should periodically broadcast full state to ensure late joiners (overlays) catch up
    let interval: any;
    if (isController) {
      interval = setInterval(() => {
        sendAction({ type: 'SYNC_STATE', payload: state });
      }, 1000);
    }

    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [isController, state]);

  // Timer Effect (Only controller drives the actual logic, overlay just receives updates)
  useEffect(() => {
    if (!isController) return;
    
    let interval: any;
    if (state.timer.isRunning) {
      interval = setInterval(() => {
        let newSeconds = state.timer.seconds + 1;
        let newMinutes = state.timer.minutes;
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
        }
        const newTimer = { ...state.timer, minutes: newMinutes, seconds: newSeconds };
        dispatch({ type: 'UPDATE_TIMER', payload: newTimer });
        // We broadcast the specific update to avoid sending massive state object every second
        // But for this demo, the periodic SYNC_STATE handles heavy lifting, we can also send granular updates
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.timer.isRunning, state.timer.minutes, state.timer.seconds, isController]);

  // Action dispatcher wrapper
  const dispatchAction = useCallback((action: Action) => {
    dispatch(action);
    sendAction(action);
  }, []);

  return { state, dispatch: dispatchAction };
};
