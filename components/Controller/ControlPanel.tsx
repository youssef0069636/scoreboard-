import React, { useState, useEffect, useRef } from 'react';
import { useMatch } from '../../hooks/useMatch';
import { TEAMS_DB } from '../../constants';
import { EventType, Team, TeamStats, AnimationType, Player } from '../../types';
import { Play, Pause, RotateCcw, Monitor, Trophy, Layers, Goal, Flag, Users, Square, Settings, Copy, ExternalLink, Activity, BarChart3, Palette, Aperture, UserPlus, Edit, Trash2, Save, X, Image as ImageIcon, Clapperboard, Briefcase } from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const { state, dispatch } = useMatch(true);
  const [activeTab, setActiveTab] = useState<'match' | 'events' | 'graphics' | 'setup' | 'stats' | 'players'>('match');
  const [selectedHome, setSelectedHome] = useState(state.homeTeam.id);
  const [selectedAway, setSelectedAway] = useState(state.awayTeam.id);

  // Player Manager State
  const [editingTeamId, setEditingTeamId] = useState<string>(state.homeTeam.id);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerForm, setPlayerForm] = useState<Partial<Player>>({
    number: 0, name: '', position: 'P', image: ''
  });

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

  // Update effect to keep editing team synced if teams change
  useEffect(() => {
      // If currently editing a team that disappears (changed in setup), fallback to current home
      if (editingTeamId !== state.homeTeam.id && editingTeamId !== state.awayTeam.id) {
          setEditingTeamId(state.homeTeam.id);
      }
  }, [state.homeTeam.id, state.awayTeam.id]);


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

  const updateTournamentName = (name: string) => {
      dispatch({
          type: 'UPDATE_MATCH_CONFIG',
          payload: { tournamentName: name }
      });
  }

  const triggerGoal = (team: Team) => {
    updateScore(team.id, 1);
    // Auto update stats
    const currentStats = team.id === state.homeTeam.id ? state.homeStats : state.awayStats;
    updateStats(team.id, 'shots', currentStats.shots + 1);
    updateStats(team.id, 'shotsOnTarget', currentStats.shotsOnTarget + 1);
    updateStats(team.id, 'xg', parseFloat((currentStats.xg + 0.35).toFixed(2))); // Rough auto increment xG

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

  const triggerVar = (team: Team, description: string = 'CHECK') => {
    dispatch({
      type: 'TRIGGER_EVENT',
      payload: {
        id: Date.now().toString(),
        type: EventType.VAR,
        teamId: team.id,
        minute: state.timer.minutes,
        description: description,
        timestamp: Date.now()
      }
    });
    const duration = description === 'CHECK' ? 120000 : 10000; 
    if (description !== 'CHECK') {
        setTimeout(() => dispatch({ type: 'CLEAR_EVENT' }), 10000);
    }
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

  // --- PLAYER MANAGER LOGIC ---
  const getEditingTeam = () => editingTeamId === state.homeTeam.id ? state.homeTeam : state.awayTeam;

  const handleEditPlayer = (player: Player) => {
      setEditingPlayerId(player.id);
      setPlayerForm({ ...player });
  };

  const handleSavePlayer = () => {
      const team = getEditingTeam();
      let updatedPlayers = [...team.players];

      if (editingPlayerId) {
          updatedPlayers = updatedPlayers.map(p => p.id === editingPlayerId ? { ...p, ...playerForm } as Player : p);
      } else {
          const newPlayer: Player = {
              id: `${team.id}-${Date.now()}`,
              number: playerForm.number || 0,
              name: playerForm.name || 'New Player',
              position: playerForm.position || 'P',
              image: playerForm.image || ''
          };
          updatedPlayers.push(newPlayer);
      }
      updatedPlayers.sort((a, b) => a.number - b.number);
      updateTeamConfig(team.id, 'players', updatedPlayers);
      resetPlayerForm();
  };

  const handleDeletePlayer = (playerId: string) => {
      const team = getEditingTeam();
      const updatedPlayers = team.players.filter(p => p.id !== playerId);
      updateTeamConfig(team.id, 'players', updatedPlayers);
  };

  const resetPlayerForm = () => {
      setEditingPlayerId(null);
      setPlayerForm({ number: 0, name: '', position: 'P', image: '' });
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

  const StatInput = ({ label, value, onChange, step = 1 }: any) => (
      <div>
          <label className="text-[10px] text-slate-400 uppercase font-bold">{label}</label>
          <input 
            type="number" 
            step={step}
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            className="w-full bg-slate-900 border border-slate-600 p-1.5 rounded text-sm font-mono" 
          />
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
           <button onClick={() => setActiveTab('players')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'players' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Users size={20} /> Player Manager
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
            <div className="flex flex-col gap-8">
                {/* 1. Select Teams */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                   <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings size={24}/> Team Selection</h2>
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
                      APPLY TEAMS
                   </button>
                </div>

                {/* 2. Match Settings */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Trophy size={24}/> Match Settings</h2>
                    
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div>
                            <label className="block text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">Tournament Name</label>
                            <input 
                                type="text"
                                value={state.tournamentName}
                                onChange={(e) => updateTournamentName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 p-3 rounded text-white font-bold"
                                placeholder="e.g. UEFA CHAMPIONS LEAGUE"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                             <label className="block text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">Match Period</label>
                             <select 
                                value={state.timer.period} 
                                onChange={(e) => updatePeriod(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 p-3 rounded text-white"
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
                        <div>
                             <label className="block text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">Set Home Score</label>
                             <input 
                                type="number" 
                                value={state.homeScore} 
                                onChange={(e) => dispatch({ type: 'SET_SCORE', payload: { teamId: state.homeTeam.id, score: parseInt(e.target.value) } })}
                                className="w-full bg-slate-900 border border-slate-600 p-3 rounded text-white font-mono"
                             />
                        </div>
                         <div>
                             <label className="block text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">Set Away Score</label>
                             <input 
                                type="number" 
                                value={state.awayScore} 
                                onChange={(e) => dispatch({ type: 'SET_SCORE', payload: { teamId: state.awayTeam.id, score: parseInt(e.target.value) } })}
                                className="w-full bg-slate-900 border border-slate-600 p-3 rounded text-white font-mono"
                             />
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* PLAYERS TAB */}
          {activeTab === 'players' && (
              <div className="flex gap-6 h-full">
                  {/* List Section */}
                  <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
                      {/* Team Toggles */}
                      <div className="flex border-b border-slate-700">
                          <button 
                            onClick={() => setEditingTeamId(state.homeTeam.id)} 
                            className={`flex-1 p-4 font-bold flex items-center justify-center gap-2 ${editingTeamId === state.homeTeam.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-750'}`}
                          >
                              <img src={state.homeTeam.logo} className="w-6 h-6 object-contain" />
                              {state.homeTeam.shortName}
                          </button>
                           <button 
                            onClick={() => setEditingTeamId(state.awayTeam.id)} 
                            className={`flex-1 p-4 font-bold flex items-center justify-center gap-2 ${editingTeamId === state.awayTeam.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-750'}`}
                          >
                              <img src={state.awayTeam.logo} className="w-6 h-6 object-contain" />
                              {state.awayTeam.shortName}
                          </button>
                      </div>

                      {/* Player List */}
                      <div className="flex-1 overflow-y-auto p-2">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-slate-900 text-slate-400 sticky top-0">
                                  <tr>
                                      <th className="p-3">#</th>
                                      <th className="p-3">Name</th>
                                      <th className="p-3">Pos</th>
                                      <th className="p-3 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {getEditingTeam().players.map(player => (
                                      <tr key={player.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                          <td className="p-3 font-mono text-cyan-400">{player.number}</td>
                                          <td className="p-3 font-bold">{player.name}</td>
                                          <td className="p-3 text-slate-400 text-xs">{player.position}</td>
                                          <td className="p-3 flex justify-end gap-2">
                                              <button onClick={() => handleEditPlayer(player)} className="p-2 hover:bg-blue-600 rounded text-slate-300 hover:text-white transition-colors">
                                                  <Edit size={14} />
                                              </button>
                                              <button onClick={() => handleDeletePlayer(player.id)} className="p-2 hover:bg-red-600 rounded text-slate-300 hover:text-white transition-colors">
                                                  <Trash2 size={14} />
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Edit Form */}
                  <div className="w-80 bg-slate-800 rounded-xl border border-slate-700 p-6 h-fit">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          {editingPlayerId ? <Edit size={18} className="text-blue-400"/> : <UserPlus size={18} className="text-green-400"/>}
                          {editingPlayerId ? 'Edit Player' : 'Add Player'}
                      </h3>
                      
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs text-slate-400 mb-1">Number</label>
                              <input 
                                type="number" 
                                value={playerForm.number}
                                onChange={(e) => setPlayerForm({...playerForm, number: parseInt(e.target.value)})}
                                className="w-full bg-slate-900 border border-slate-600 p-2 rounded"
                              />
                          </div>
                          <div>
                              <label className="block text-xs text-slate-400 mb-1">Name</label>
                              <input 
                                type="text" 
                                value={playerForm.name}
                                onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-600 p-2 rounded"
                              />
                          </div>
                          <div>
                              <label className="block text-xs text-slate-400 mb-1">Position</label>
                              <select 
                                value={playerForm.position}
                                onChange={(e) => setPlayerForm({...playerForm, position: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-600 p-2 rounded"
                              >
                                  <option value="GK">Goalkeeper (GK)</option>
                                  <option value="DEF">Defender (DEF)</option>
                                  <option value="MID">Midfielder (MID)</option>
                                  <option value="FWD">Forward (FWD)</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1"><ImageIcon size={10}/> Image URL (Optional)</label>
                              <input 
                                type="text" 
                                value={playerForm.image}
                                onChange={(e) => setPlayerForm({...playerForm, image: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-600 p-2 rounded text-xs"
                                placeholder="https://..."
                              />
                          </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                          <button onClick={handleSavePlayer} className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded font-bold flex items-center justify-center gap-2">
                              <Save size={16} /> Save
                          </button>
                          <button onClick={resetPlayerForm} className="bg-slate-700 hover:bg-slate-600 px-3 rounded">
                              <X size={16} />
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
              <div className="grid grid-cols-2 gap-8">
                  <div className="bg-slate-800 p-6 rounded-xl border-t-4" style={{ borderColor: state.homeTeam.colorPrimary }}>
                      <h3 className="font-bold mb-4">{state.homeTeam.name} Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <StatInput label="Possession (%)" value={state.homeStats.possession} onChange={(v: number) => updateStats(state.homeTeam.id, 'possession', v)} />
                          <StatInput label="Exp. Goals (xG)" value={state.homeStats.xg} step={0.01} onChange={(v: number) => updateStats(state.homeTeam.id, 'xg', v)} />
                          <StatInput label="Shots" value={state.homeStats.shots} onChange={(v: number) => updateStats(state.homeTeam.id, 'shots', v)} />
                          <StatInput label="On Target" value={state.homeStats.shotsOnTarget} onChange={(v: number) => updateStats(state.homeTeam.id, 'shotsOnTarget', v)} />
                          <StatInput label="Corners" value={state.homeStats.corners} onChange={(v: number) => updateStats(state.homeTeam.id, 'corners', v)} />
                          <StatInput label="Fouls" value={state.homeStats.fouls} onChange={(v: number) => updateStats(state.homeTeam.id, 'fouls', v)} />
                          <StatInput label="Offsides" value={state.homeStats.offsides} onChange={(v: number) => updateStats(state.homeTeam.id, 'offsides', v)} />
                          <StatInput label="Saves" value={state.homeStats.saves} onChange={(v: number) => updateStats(state.homeTeam.id, 'saves', v)} />
                          <StatInput label="Passes" value={state.homeStats.passes} onChange={(v: number) => updateStats(state.homeTeam.id, 'passes', v)} />
                      </div>
                  </div>

                   <div className="bg-slate-800 p-6 rounded-xl border-t-4" style={{ borderColor: state.awayTeam.colorPrimary }}>
                      <h3 className="font-bold mb-4">{state.awayTeam.name} Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <StatInput label="Possession (%)" value={state.awayStats.possession} onChange={(v: number) => updateStats(state.awayTeam.id, 'possession', v)} />
                          <StatInput label="Exp. Goals (xG)" value={state.awayStats.xg} step={0.01} onChange={(v: number) => updateStats(state.awayTeam.id, 'xg', v)} />
                          <StatInput label="Shots" value={state.awayStats.shots} onChange={(v: number) => updateStats(state.awayTeam.id, 'shots', v)} />
                          <StatInput label="On Target" value={state.awayStats.shotsOnTarget} onChange={(v: number) => updateStats(state.awayTeam.id, 'shotsOnTarget', v)} />
                          <StatInput label="Corners" value={state.awayStats.corners} onChange={(v: number) => updateStats(state.awayTeam.id, 'corners', v)} />
                          <StatInput label="Fouls" value={state.awayStats.fouls} onChange={(v: number) => updateStats(state.awayTeam.id, 'fouls', v)} />
                          <StatInput label="Offsides" value={state.awayStats.offsides} onChange={(v: number) => updateStats(state.awayTeam.id, 'offsides', v)} />
                          <StatInput label="Saves" value={state.awayStats.saves} onChange={(v: number) => updateStats(state.awayTeam.id, 'saves', v)} />
                          <StatInput label="Passes" value={state.awayStats.passes} onChange={(v: number) => updateStats(state.awayTeam.id, 'passes', v)} />
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

                      {/* VAR SECTION */}
                      <div className="bg-slate-900 p-3 rounded border border-slate-700 mt-2">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Monitor size={12} className="text-cyan-400"/> VAR Control</div>
                        <button onClick={() => triggerVar(state.homeTeam, 'CHECK')} className="w-full bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/50 p-3 rounded flex items-center justify-center gap-2 text-cyan-300 mb-2">
                            <Aperture size={16} /> START REVIEW
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => triggerVar(state.homeTeam, 'NO GOAL')} className="bg-red-900/40 hover:bg-red-900/60 p-2 rounded text-[10px] font-bold text-red-400 border border-red-800">NO GOAL</button>
                            <button onClick={() => triggerVar(state.homeTeam, 'GOAL')} className="bg-green-900/40 hover:bg-green-900/60 p-2 rounded text-[10px] font-bold text-green-400 border border-green-800">GOAL</button>
                            <button onClick={() => triggerVar(state.homeTeam, 'PENALTY')} className="bg-yellow-900/40 hover:bg-yellow-900/60 p-2 rounded text-[10px] font-bold text-yellow-400 border border-yellow-800">PENALTY</button>
                            <button onClick={() => triggerVar(state.homeTeam, 'OFFSIDE')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-[10px] font-bold text-slate-300 border border-slate-600">OFFSIDE</button>
                        </div>
                      </div>

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

                      {/* VAR SECTION */}
                      <div className="bg-slate-900 p-3 rounded border border-slate-700 mt-2">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Monitor size={12} className="text-cyan-400"/> VAR Control</div>
                        <button onClick={() => triggerVar(state.awayTeam, 'CHECK')} className="w-full bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/50 p-3 rounded flex items-center justify-center gap-2 text-cyan-300 mb-2">
                            <Aperture size={16} /> START REVIEW
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => triggerVar(state.awayTeam, 'NO GOAL')} className="bg-red-900/40 hover:bg-red-900/60 p-2 rounded text-[10px] font-bold text-red-400 border border-red-800">NO GOAL</button>
                            <button onClick={() => triggerVar(state.awayTeam, 'GOAL')} className="bg-green-900/40 hover:bg-green-900/60 p-2 rounded text-[10px] font-bold text-green-400 border border-green-800">GOAL</button>
                            <button onClick={() => triggerVar(state.awayTeam, 'PENALTY')} className="bg-yellow-900/40 hover:bg-yellow-900/60 p-2 rounded text-[10px] font-bold text-yellow-400 border border-yellow-800">PENALTY</button>
                            <button onClick={() => triggerVar(state.awayTeam, 'OFFSIDE')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-[10px] font-bold text-slate-300 border border-slate-600">OFFSIDE</button>
                        </div>
                      </div>

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
                   <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer">
                         <span className="text-sm">Main Scoreboard</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showScoreboard} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showScoreboard' })}
                           className="w-5 h-5 accent-blue-500"
                         />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer">
                         <span className="text-sm">Starting Lineups</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showLineups} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showLineups' })}
                         className="w-5 h-5 accent-blue-500"
                       />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer border border-cyan-700/50">
                         <span className="text-cyan-400 font-bold text-sm">Match Stats</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showStats} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showStats' })}
                         className="w-5 h-5 accent-cyan-500"
                       />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer border border-cyan-700/50">
                         <span className="text-cyan-400 font-bold text-sm">Formation</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showFormation} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showFormation' })}
                         className="w-5 h-5 accent-cyan-500"
                       />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer border border-cyan-700/50">
                         <span className="text-cyan-400 font-bold text-sm">Intro Animation</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showIntro} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showIntro' })}
                         className="w-5 h-5 accent-cyan-500"
                       />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer border border-cyan-700/50">
                         <span className="text-cyan-400 font-bold text-sm">Ticker</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showTicker} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showTicker' })}
                         className="w-5 h-5 accent-cyan-500"
                       />
                    </label>
                     <label className="flex items-center justify-between p-4 bg-slate-900 rounded cursor-pointer border border-cyan-700/50">
                         <span className="text-cyan-400 font-bold text-sm">Sponsor Bug</span>
                         <input 
                           type="checkbox" 
                           checked={state.overlay.showSponsor} 
                           onChange={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: 'showSponsor' })}
                         className="w-5 h-5 accent-cyan-500"
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