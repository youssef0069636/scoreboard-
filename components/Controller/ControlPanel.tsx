import React, { useState, useEffect, useRef } from 'react';
import { useMatch } from '../../hooks/useMatch';
import { TEAMS_DB } from '../../constants';
import { EventType, Team, TeamStats, AnimationType } from '../../types';
import { Play, Pause, RotateCcw, Monitor, Trophy, Layers, Goal, Flag, Users, Square, Settings, Copy, ExternalLink, Activity, BarChart3, Palette } from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const { state, dispatch } = useMatch(true);
  const [activeTab, setActiveTab] = useState<'match' | 'events' | 'graphics' | 'setup' | 'stats'>('match');
  const [selectedHome, setSelectedHome] = useState(state.homeTeam.id);
  const [selectedAway, setSelectedAway] = useState(state.awayTeam.id);

  // Preview Scale Logic
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  // Robustly calculate the OBS URL, handling Blob URLs and standard domains
  const obsUrl = typeof window !== 'undefined' ? `${window.location.href.split('#')[0]}#/overlay` : '';

  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current) {
        // Calculate scale to fit 1920 width into container width
        const containerWidth = previewRef.current.clientWidth;
        const targetScale = containerWidth / 1920;
        setScale(targetScale);
      }
    };
    
    // Initial calc
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer Handlers
  const toggleTimer = () => {
    dispatch({ 
      type: 'UPDATE_TIMER', 
      payload: { isRunning: !state.timer.isRunning } 
    });
  };

  const resetTimer = () => {
    dispatch({ 
      type: 'UPDATE_TIMER', 
      payload: { minutes: 0, seconds: 0, isRunning: false, addedTime: 0 } 
    });
  };

  const updatePeriod = (period: string) => {
    dispatch({
        type: 'UPDATE_TIMER',
        payload: { period: period as any }
    });
  }

  const updateScore = (teamId: string, increment: number) => {
    const currentScore = teamId === state.homeTeam.id ? state.homeScore : state.awayScore;
    dispatch({
      type: 'SET_SCORE',
      payload: { teamId, score: Math.max(0, currentScore + increment) }
    });
  };

  const updateTeamConfig = (teamId: string, key: keyof Team, value: any) => {
    dispatch({
        type: 'UPDATE_TEAM_CONFIG',
        payload: { teamId, updates: { [key]: value } }
    });
  };

  const updateStats = (teamId: string, key: keyof TeamStats, value: number) => {
    dispatch({
        type: 'UPDATE_STATS',
        payload: { teamId, stats: { [key]: value } }
    });
  };

  const triggerGoal = (team: Team) => {
    updateScore(team.id, 1);
    // Auto update stats
    const currentStats = team.id === state.homeTeam.id ? state.homeStats : state.awayStats;
    updateStats(team.id, 'shots', currentStats.shots + 1);
    updateStats(team.id, 'shotsOnTarget', currentStats.shotsOnTarget + 1);

    dispatch({
      type: 'TRIGGER_EVENT',
      payload: {
        id: Date.now().toString(),
        type: EventType.GOAL,
        teamId: team.id,
        minute: state.timer.minutes,
        player: team.players[9], 
        timestamp: Date.now()
      }
    });
    setTimeout(() => dispatch({ type: 'CLEAR_EVENT' }), 8000);
  };

  const triggerCard = (team: Team, type: EventType) => {
    dispatch({
      type: 'TRIGGER_EVENT',
      payload: {
        id: Date.now().toString(),
        type: type,
        teamId: team.id,
        minute: state.timer.minutes,
        player: team.players[3],
        timestamp: Date.now()
      }
    });
    setTimeout(() => dispatch({ type: 'CLEAR_EVENT' }), 6000);
  };

  const triggerSub = (team: Team) => {
     dispatch({
      type: 'TRIGGER_EVENT',
      payload: {
        id: Date.now().toString(),
        type: EventType.SUBSTITUTION,
        teamId: team.id,
        minute: state.timer.minutes,
        playerIn: team.players[10],
        playerOut: team.players[8],
        timestamp: Date.now()
      }
    });
    setTimeout(() => dispatch({ type: 'CLEAR_EVENT' }), 8000);
  }

  const triggerVar = (team: Team) => {
    dispatch({
      type: 'TRIGGER_EVENT',
      payload: {
        id: Date.now().toString(),
        type: EventType.VAR,
        teamId: team.id,
        minute: state.timer.minutes,
        timestamp: Date.now()
      }
    });
    setTimeout(() => dispatch({ type: 'CLEAR_EVENT' }), 8000);
  }

  const triggerPenalty = (team: Team, result: 'GOAL' | 'SAVED' | 'MISSED') => {
    if (result === 'GOAL') updateScore(team.id, 1);
    
    dispatch({
      type: 'TRIGGER_EVENT',
      payload: {
        id: Date.now().toString(),
        type: EventType.PENALTY,
        teamId: team.id,
        minute: state.timer.minutes,
        description: result,
        timestamp: Date.now()
      }
    });
    setTimeout(() => dispatch({ type: 'CLEAR_EVENT' }), 8000);
  }

  const applyTeams = () => {
    const home = Object.values(TEAMS_DB).find(t => t.id === selectedHome);
    const away = Object.values(TEAMS_DB).find(t => t.id === selectedAway);
    if (home && away) {
      dispatch({ type: 'SET_TEAMS', payload: { home, away } });
    }
  };

  const AnimationSelector = ({ team }: { team: Team }) => (
    <div className="mb-4">
        <label className="block text-xs text-slate-400 mb-1 font-bold uppercase">{team.shortName} Animation Style</label>
        <select 
            value={team.animationType}
            onChange={(e) => updateTeamConfig(team.id, 'animationType', e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white"
        >
            <option value="STANDARD">Standard Broadcast</option>
            <option value="SAMBA_PULSE">Samba Pulse (Brazil)</option>
            <option value="ALBICELESTE_SPIN">Albiceleste Spin (Arg)</option>
            <option value="ROYAL_SLIDE">Royal Slide (Real)</option>
            <option value="BLAUGRANA_BOUNCE">Blaugrana Bounce (Barca)</option>
            <option value="CYBER_FLASH">Cyber Flash (Man City)</option>
        </select>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* LEFT PANEL: CONTROLS (65%) */}
      <div className="flex-1 flex min-w-0">
        {/* Sidebar */}
        <div className="w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col gap-2 shrink-0 overflow-y-auto custom-scrollbar">
          <div className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
            <Monitor /> OBS Controller
          </div>
          
          <button onClick={() => setActiveTab('match')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'match' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Trophy size={20} /> Match Control
          </button>
          <button onClick={() => setActiveTab('events')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Flag size={20} /> Events
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <BarChart3 size={20} /> Stats
          </button>
          <button onClick={() => setActiveTab('graphics')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'graphics' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Layers size={20} /> Graphics
          </button>
          <button onClick={() => setActiveTab('setup')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'setup' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Settings size={20} /> Setup
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 min-w-0">
          
          {/* Header Status */}
          <div className="flex justify-between items-center mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
             <div className="flex items-center gap-8">
                <div className="text-center w-48">
                   <div className="text-sm text-slate-400 uppercase tracking-widest">Home</div>
                   <div className="text-2xl font-bold truncate">{state.homeTeam.name}</div>
                   <div className="text-4xl font-mono text-yellow-400">{state.homeScore}</div>
                </div>
                <div className="text-2xl text-slate-600 font-bold">VS</div>
                <div className="text-center w-48">
                   <div className="text-sm text-slate-400 uppercase tracking-widest">Away</div>
                   <div className="text-2xl font-bold truncate">{state.awayTeam.name}</div>
                   <div className="text-4xl font-mono text-yellow-400">{state.awayScore}</div>
                </div>
             </div>

             <div className="flex flex-col items-center bg-slate-950 px-8 py-2 rounded-lg border border-slate-800">
                <div className="text-5xl font-mono tracking-wider text-white">
                  {state.timer.minutes.toString().padStart(2, '0')}:{state.timer.seconds.toString().padStart(2, '0')}
                </div>
                <div className="flex gap-2 mt-2">
                   <button onClick={toggleTimer} className={`p-2 rounded-full ${state.timer.isRunning ? 'bg-yellow-600' : 'bg-green-600'} text-white hover:brightness-110`}>
                      {state.timer.isRunning ? <Pause size={16} /> : <Play size={16} />}
                   </button>
                   <button onClick={resetTimer} className="p-2 rounded-full bg-red-600 text-white hover:brightness-110">
                      <RotateCcw size={16} />
                   </button>
                   <div className="flex items-center gap-1 ml-4">
                      <button onClick={() => dispatch({type: 'UPDATE_TIMER', payload: {addedTime: state.timer.addedTime + 1}})} className="px-2 bg-slate-700 rounded hover:bg-slate-600 text-xs">+1m</button>
                      <span className="text-xs text-green-400">+{state.timer.addedTime}</span>
                   </div>
                </div>
                <select 
                    value={state.timer.period} 
                    onChange={(e) => updatePeriod(e.target.value)}
                    className="mt-2 bg-slate-900 border border-slate-700 text-xs p-1 rounded w-full"
                >
                    <option value="1st">1st Half</option>
                    <option value="HT">Half Time</option>
                    <option value="2nd">2nd Half</option>
                    <option value="ET1">Extra Time 1</option>
                    <option value="ET2">Extra Time 2</option>
                    <option value="PEN">Penalties</option>
                    <option value="FT">Full Time</option>
                </select>
             </div>
          </div>

          {/* SETUP TAB */}
          {activeTab === 'setup' && (
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <h2 className="text-2xl font-bold mb-6">Match Setup</h2>
               <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                     <label className="block text-slate-400 mb-2">Home Team</label>
                     <select 
                        value={selectedHome} 
                        onChange={(e) => setSelectedHome(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 p-3 rounded text-white"
                     >
                        {Object.values(TEAMS_DB).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-slate-400 mb-2">Away Team</label>
                     <select 
                        value={selectedAway} 
                        onChange={(e) => setSelectedAway(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 p-3 rounded text-white"
                     >
                        {Object.values(TEAMS_DB).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                     </select>
                  </div>
               </div>
               <button onClick={applyTeams} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-bold w-full">
                  START MATCH
               </button>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
              <div className="grid grid-cols-2 gap-8">
                  <div className="bg-slate-800 p-6 rounded-xl border-t-4" style={{ borderColor: state.homeTeam.colorPrimary }}>
                      <h3 className="font-bold mb-4">{state.homeTeam.name} Stats</h3>
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs text-slate-400">Possession (%)</label>
                              <input type="number" value={state.homeStats.possession} onChange={(e) => updateStats(state.homeTeam.id, 'possession', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400">Shots</label>
                                <input type="number" value={state.homeStats.shots} onChange={(e) => updateStats(state.homeTeam.id, 'shots', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">On Target</label>
                                <input type="number" value={state.homeStats.shotsOnTarget} onChange={(e) => updateStats(state.homeTeam.id, 'shotsOnTarget', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs text-slate-400">Corners</label>
                                <input type="number" value={state.homeStats.corners} onChange={(e) => updateStats(state.homeTeam.id, 'corners', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Fouls</label>
                                <input type="number" value={state.homeStats.fouls} onChange={(e) => updateStats(state.homeTeam.id, 'fouls', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                            </div>
                          </div>
                      </div>
                  </div>

                   <div className="bg-slate-800 p-6 rounded-xl border-t-4" style={{ borderColor: state.awayTeam.colorPrimary }}>
                      <h3 className="font-bold mb-4">{state.awayTeam.name} Stats</h3>
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs text-slate-400">Possession (%)</label>
                              <input type="number" value={state.awayStats.possession} onChange={(e) => updateStats(state.awayTeam.id, 'possession', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                          </div>
                           <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400">Shots</label>
                                <input type="number" value={state.awayStats.shots} onChange={(e) => updateStats(state.awayTeam.id, 'shots', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">On Target</label>
                                <input type="number" value={state.awayStats.shotsOnTarget} onChange={(e) => updateStats(state.awayTeam.id, 'shotsOnTarget', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs text-slate-400">Corners</label>
                                <input type="number" value={state.awayStats.corners} onChange={(e) => updateStats(state.awayTeam.id, 'corners', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Fouls</label>
                                <input type="number" value={state.awayStats.fouls} onChange={(e) => updateStats(state.awayTeam.id, 'fouls', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 p-2 rounded" />
                            </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* MATCH TAB */}
          {activeTab === 'match' && (
             <div className="grid grid-cols-2 gap-8">
                {/* Home Control */}
                <div className="bg-slate-800 p-6 rounded-xl border-t-4" style={{ borderColor: state.homeTeam.colorPrimary }}>
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><img src={state.homeTeam.logo} className="w-6 h-6"/> {state.homeTeam.name}</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => updateScore(state.homeTeam.id, 1)} className="bg-green-600 p-4 rounded hover:bg-green-500 font-bold text-xl">+ 1</button>
                      <button onClick={() => updateScore(state.homeTeam.id, -1)} className="bg-red-900/50 p-4 rounded hover:bg-red-900 font-bold text-red-200">- 1</button>
                   </div>
                </div>
                {/* Away Control */}
                <div className="bg-slate-800 p-6 rounded-xl border-t-4" style={{ borderColor: state.awayTeam.colorPrimary }}>
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><img src={state.awayTeam.logo} className="w-6 h-6"/> {state.awayTeam.name}</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => updateScore(state.awayTeam.id, 1)} className="bg-green-600 p-4 rounded hover:bg-green-500 font-bold text-xl">+ 1</button>
                      <button onClick={() => updateScore(state.awayTeam.id, -1)} className="bg-red-900/50 p-4 rounded hover:bg-red-900 font-bold text-red-200">- 1</button>
                   </div>
                </div>
             </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
             <div className="grid grid-cols-2 gap-8">
                {/* Home Events */}
                <div className="bg-slate-800 p-6 rounded-xl border-t-4" style={{ borderColor: state.homeTeam.colorPrimary }}>
                   <h3 className="text-lg font-bold mb-4">{state.homeTeam.name}</h3>
                   <div className="flex flex-col gap-3">
                      <button onClick={() => triggerGoal(state.homeTeam)} className="bg-slate-700 hover:bg-slate-600 p-4 rounded flex items-center gap-3">
                         <Goal className="text-yellow-400" /> TRIGGER GOAL
                      </button>
                      <div className="flex gap-2">
                         <button onClick={() => triggerCard(state.homeTeam, EventType.YELLOW_CARD)} className="flex-1 bg-yellow-900/40 hover:bg-yellow-900/60 p-3 rounded border border-yellow-600 text-yellow-500 flex items-center justify-center gap-2">
                            <Square size={16} fill="currentColor" /> Yellow
                         </button>
                         <button onClick={() => triggerCard(state.homeTeam, EventType.RED_CARD)} className="flex-1 bg-red-900/40 hover:bg-red-900/60 p-3 rounded border border-red-600 text-red-500 flex items-center justify-center gap-2">
                            <Square size={16} fill="currentColor" /> Red
                         </button>
                      </div>
                      <button onClick={() => triggerSub(state.homeTeam)} className="bg-slate-700 hover:bg-slate-600 p-4 rounded flex items-center gap-3">
                         <Users className="text-blue-400" /> Substitution
                      </button>
                      <button onClick={() => triggerVar(state.homeTeam)} className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/50 p-4 rounded flex items-center gap-3 text-purple-300">
                         <Monitor className="text-purple-400" /> VAR CHECK
                      </button>

                      <div className="mt-2 border-t border-slate-700 pt-3">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Activity size={12}/> Penalties</div>
                        <div className="flex gap-1">
                          <button onClick={() => triggerPenalty(state.homeTeam, 'GOAL')} className="flex-1 bg-green-900/40 hover:bg-green-900/60 border border-green-600 p-2 rounded text-xs text-green-400 font-bold transition-colors">GOAL</button>
                          <button onClick={() => triggerPenalty(state.homeTeam, 'SAVED')} className="flex-1 bg-orange-900/40 hover:bg-orange-900/60 border border-orange-600 p-2 rounded text-xs text-orange-400 font-bold transition-colors">SAVED</button>
                          <button onClick={() => triggerPenalty(state.homeTeam, 'MISSED')} className="flex-1 bg-red-900/40 hover:bg-red-900/60 border border-red-600 p-2 rounded text-xs text-red-400 font-bold transition-colors">MISS</button>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Away Events */}
                <div className="bg-slate-800 p-6 rounded-xl border-t-4" style={{ borderColor: state.awayTeam.colorPrimary }}>
                   <h3 className="text-lg font-bold mb-4">{state.awayTeam.name}</h3>
                   <div className="flex flex-col gap-3">
                      <button onClick={() => triggerGoal(state.awayTeam)} className="bg-slate-700 hover:bg-slate-600 p-4 rounded flex items-center gap-3">
                         <Goal className="text-yellow-400" /> TRIGGER GOAL
                      </button>
                      <div className="flex gap-2">
                         <button onClick={() => triggerCard(state.awayTeam, EventType.YELLOW_CARD)} className="flex-1 bg-yellow-900/40 hover:bg-yellow-900/60 p-3 rounded border border-yellow-600 text-yellow-500 flex items-center justify-center gap-2">
                            <Square size={16} fill="currentColor" /> Yellow
                         </button>
                         <button onClick={() => triggerCard(state.awayTeam, EventType.RED_CARD)} className="flex-1 bg-red-900/40 hover:bg-red-900/60 p-3 rounded border border-red-600 text-red-500 flex items-center justify-center gap-2">
                            <Square size={16} fill="currentColor" /> Red
                         </button>
                      </div>
                      <button onClick={() => triggerSub(state.awayTeam)} className="bg-slate-700 hover:bg-slate-600 p-4 rounded flex items-center gap-3">
                         <Users className="text-blue-400" /> Substitution
                      </button>
                      <button onClick={() => triggerVar(state.awayTeam)} className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/50 p-4 rounded flex items-center gap-3 text-purple-300">
                         <Monitor className="text-purple-400" /> VAR CHECK
                      </button>

                      <div className="mt-2 border-t border-slate-700 pt-3">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Activity size={12}/> Penalties</div>
                        <div className="flex gap-1">
                          <button onClick={() => triggerPenalty(state.awayTeam, 'GOAL')} className="flex-1 bg-green-900/40 hover:bg-green-900/60 border border-green-600 p-2 rounded text-xs text-green-400 font-bold transition-colors">GOAL</button>
                          <button onClick={() => triggerPenalty(state.awayTeam, 'SAVED')} className="flex-1 bg-orange-900/40 hover:bg-orange-900/60 border border-orange-600 p-2 rounded text-xs text-orange-400 font-bold transition-colors">SAVED</button>
                          <button onClick={() => triggerPenalty(state.awayTeam, 'MISSED')} className="flex-1 bg-red-900/40 hover:bg-red-900/60 border border-red-600 p-2 rounded text-xs text-red-400 font-bold transition-colors">MISS</button>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* GRAPHICS TAB */}
          {activeTab === 'graphics' && (
             <div className="grid grid-cols-2 gap-8">
                <div className="bg-slate-800 p-6 rounded-xl">
                   <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><Palette size={18}/> Team Config</h3>
                   <AnimationSelector team={state.homeTeam} />
                   <AnimationSelector team={state.awayTeam} />
                </div>

                <div className="bg-slate-800 p-6 rounded-xl">
                   <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><Layers size={18}/> Toggle Overlays</h3>
                   <div className="flex flex-col gap-4">
                      <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer">
                         <span>Main Scoreboard (Top Left)</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showScoreboard} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showScoreboard' })}
                           className="w-6 h-6 accent-blue-500"
                         />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer">
                         <span>Starting Lineups (Full Screen)</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showLineups} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showLineups' })}
                         className="w-6 h-6 accent-blue-500"
                       />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer border border-cyan-700/50">
                         <span className="text-cyan-400 font-bold">Match Stats (HT/FT)</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showStats} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showStats' })}
                         className="w-6 h-6 accent-cyan-500"
                       />
                    </label>
                 </div>
                 
                 <div className="mt-8 border-t border-slate-700 pt-4">
                     <button onClick={() => dispatch({ type: 'CLEAR_EVENT' })} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded">
                        CLEAR ACTIVE GRAPHICS
                     </button>
                 </div>
              </div>
           </div>
        )}

        </div>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW (35%) */}
      <div className="w-[35%] min-w-[400px] bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl z-20">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Monitor size={18} className="text-green-400" /> Live Output
            </h2>
            <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                LIVE
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
              
              {/* Preview Container */}
              <div ref={previewRef} className="w-full relative bg-black rounded-lg border border-slate-700 shadow-xl overflow-hidden group" style={{ aspectRatio: '16/9' }}>
                 <iframe 
                   src={obsUrl}
                   title="Scoreboard Preview"
                   className="absolute top-0 left-0 w-[1920px] h-[1080px] origin-top-left border-0 pointer-events-none select-none"
                   style={{ transform: `scale(${scale})` }}
                 />
                 {/* Overlay to prevent interaction if needed, though pointer-events-none on iframe works */}
                 <div className="absolute inset-0 z-10 pointer-events-none ring-1 ring-inset ring-white/10 rounded-lg"></div>
              </div>

              {/* OBS Info */}
              <div className="mt-8 bg-slate-900 rounded-xl p-5 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">OBS Browser Source</span>
                      <a href={obsUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                        <ExternalLink size={14} />
                      </a>
                  </div>
                  
                  <div className="flex gap-0 mb-3">
                      <input 
                        type="text" 
                        readOnly 
                        value={obsUrl} 
                        className="flex-1 bg-black border border-slate-700 border-r-0 rounded-l px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none select-all"
                      />
                      <button 
                        onClick={() => {
                            navigator.clipboard.writeText(obsUrl);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-r text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        <Copy size={14} /> COPY
                      </button>
                  </div>

                  <div className="text-[10px] text-slate-500 space-y-1">
                      <p>1. In OBS, add a new <span className="text-slate-300 font-bold">Browser Source</span>.</p>
                      <p>2. Paste the URL above.</p>
                      <p>3. Set Width: <span className="text-slate-300 font-bold">1920</span>, Height: <span className="text-slate-300 font-bold">1080</span>.</p>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};
