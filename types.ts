export interface Player {
  id: string;
  number: number;
  name: string;
  position: string;
  image?: string;
  isCaptain?: boolean;
}

export type AnimationType = 
  | 'STANDARD' 
  | 'SAMBA_PULSE'     // Brazil style
  | 'ALBICELESTE_SPIN' // Argentina style
  | 'ROYAL_SLIDE'      // Real Madrid style
  | 'BLAUGRANA_BOUNCE' // Barcelona style
  | 'CYBER_FLASH';     // Modern/ManCity style

export type GoalAnimationType = 'HUGE_SLIDE' | 'CENTER_BURST';

export interface Team {
  id: string;
  name: string;
  shortName: string; // e.g. RMA, BAR
  colorPrimary: string;
  colorSecondary: string;
  logo: string;
  players: Player[];
  coach: string;
  animationType: AnimationType;
  goalAnimationType: GoalAnimationType;
}

export enum EventType {
  GOAL = 'GOAL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  SUBSTITUTION = 'SUBSTITUTION',
  PENALTY = 'PENALTY',
  VAR = 'VAR',
}

export interface MatchEvent {
  id: string;
  type: EventType;
  teamId: string;
  minute: number;
  playerIn?: Player;
  playerOut?: Player;
  player?: Player; // For cards/goals
  description?: string; // "Goal", "Missed", "Saved" for penalties
  timestamp: number;
}

export interface MatchTimer {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  addedTime: number; // In minutes
  period: '1st' | '2nd' | 'HT' | 'ET1' | 'ET2' | 'PEN' | 'FT';
}

export interface TeamStats {
  possession: number; // Percentage
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  offsides: number; // New
  saves: number;    // New
  passes: number;   // New
  xg: number;       // New (Expected Goals)
}

export interface OverlayState {
  showScoreboard: boolean;
  showLineups: boolean;
  showFormation: boolean; // New
  showLowerThird: boolean;
  showStats: boolean; // Full screen stats
  showIntro: boolean; // Intro sequence
  showTicker: boolean; // New: Bottom stats ticker
  showSponsor: boolean; // New: Sponsor area
  activeEvent: MatchEvent | null;
  customMessage: string | null;
}

export interface MatchState {
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  homeStats: TeamStats;
  awayStats: TeamStats;
  timer: MatchTimer;
  overlay: OverlayState;
  events: MatchEvent[];
  tournamentName: string;
}

export type Action =
  | { type: 'SET_SCORE'; payload: { teamId: string; score: number } }
  | { type: 'UPDATE_TIMER'; payload: Partial<MatchTimer> }
  | { type: 'TRIGGER_EVENT'; payload: MatchEvent }
  | { type: 'CLEAR_EVENT' }
  | { type: 'TOGGLE_OVERLAY'; payload: keyof OverlayState }
  | { type: 'SET_TEAMS'; payload: { home: Team; away: Team } }
  | { type: 'UPDATE_TEAM_CONFIG'; payload: { teamId: string; updates: Partial<Team> } }
  | { type: 'UPDATE_STATS'; payload: { teamId: string; stats: Partial<TeamStats> } }
  | { type: 'SYNC_STATE'; payload: MatchState }
  | { type: 'UPDATE_MATCH_CONFIG'; payload: Partial<MatchState> };