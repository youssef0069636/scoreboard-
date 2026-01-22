import { MatchState, Team, TeamStats } from './types';

// Helper to generate generic players
const generatePlayers = (teamPrefix: string): any[] => {
  return Array.from({ length: 11 }, (_, i) => ({
    id: `${teamPrefix}-${i}`,
    number: i + 1,
    name: i === 0 ? "Goalkeeper" : `Player ${i + 1}`,
    position: i === 0 ? "GK" : "P",
    image: `https://placehold.co/200x200/222/fff?text=${teamPrefix}+${i+1}`
  }));
};

// Helper for team logos to ensure reliability
const getTeamLogo = (shortName: string, color: string) => 
  `https://placehold.co/400x400/${color.replace('#', '')}/ffffff/png?text=${shortName}`;

export const TEAMS_DB: Record<string, Team> = {
  REAL_MADRID: {
    id: 'rma',
    name: 'Real Madrid',
    shortName: 'RMA',
    colorPrimary: '#FEBE10',
    colorSecondary: '#001c55', // UCL Navy
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
    coach: 'Carlo Ancelotti',
    players: [
      { id: 'rma-1', number: 1, name: 'Courtois', position: 'GK', image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250002164.jpg' },
      { id: 'rma-2', number: 2, name: 'Carvajal', position: 'DEF', image: 'https://placehold.co/200x200/FEBE10/000?text=Carvajal' },
      { id: 'rma-3', number: 3, name: 'Militão', position: 'DEF', image: 'https://placehold.co/200x200/FEBE10/000?text=Militao' },
      { id: 'rma-4', number: 22, name: 'Rüdiger', position: 'DEF', image: 'https://placehold.co/200x200/FEBE10/000?text=Rudiger' },
      { id: 'rma-5', number: 23, name: 'Mendy', position: 'DEF', image: 'https://placehold.co/200x200/FEBE10/000?text=Mendy' },
      { id: 'rma-6', number: 8, name: 'Valverde', position: 'MID', image: 'https://placehold.co/200x200/FEBE10/000?text=Valverde' },
      { id: 'rma-7', number: 14, name: 'Tchouaméni', position: 'MID', image: 'https://placehold.co/200x200/FEBE10/000?text=Tchouameni' },
      { id: 'rma-8', number: 5, name: 'Bellingham', position: 'MID', image: 'https://placehold.co/200x200/FEBE10/000?text=Bellingham' },
      { id: 'rma-9', number: 11, name: 'Rodrygo', position: 'FWD', image: 'https://placehold.co/200x200/FEBE10/000?text=Rodrygo' },
      { id: 'rma-10', number: 7, name: 'Vinícius Jr.', position: 'FWD', image: 'https://placehold.co/200x200/FEBE10/000?text=Vini+Jr' },
      { id: 'rma-11', number: 9, name: 'Mbappé', position: 'FWD', image: 'https://placehold.co/200x200/FEBE10/000?text=Mbappe' },
    ],
    animationType: 'ROYAL_SLIDE',
    goalAnimationType: 'HUGE_SLIDE'
  },
  BARCELONA: {
    id: 'bar',
    name: 'FC Barcelona',
    shortName: 'BAR',
    colorPrimary: '#A50044',
    colorSecondary: '#004D98',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
    coach: 'Hansi Flick',
    players: [
      { id: 'bar-1', number: 1, name: 'Ter Stegen', position: 'GK', image: 'https://placehold.co/200x200/A50044/fff?text=Ter+Stegen' },
      { id: 'bar-2', number: 23, name: 'Koundé', position: 'DEF', image: 'https://placehold.co/200x200/A50044/fff?text=Kounde' },
      { id: 'bar-3', number: 2, name: 'Cubarsí', position: 'DEF', image: 'https://placehold.co/200x200/A50044/fff?text=Cubarsi' },
      { id: 'bar-4', number: 4, name: 'Araújo', position: 'DEF', image: 'https://placehold.co/200x200/A50044/fff?text=Araujo' },
      { id: 'bar-5', number: 3, name: 'Balde', position: 'DEF', image: 'https://placehold.co/200x200/A50044/fff?text=Balde' },
      { id: 'bar-6', number: 8, name: 'Pedri', position: 'MID', image: 'https://placehold.co/200x200/A50044/fff?text=Pedri' },
      { id: 'bar-7', number: 6, name: 'Gavi', position: 'MID', image: 'https://placehold.co/200x200/A50044/fff?text=Gavi' },
      { id: 'bar-8', number: 21, name: 'De Jong', position: 'MID', image: 'https://placehold.co/200x200/A50044/fff?text=De+Jong' },
      { id: 'bar-9', number: 19, name: 'Lamine Yamal', position: 'FWD', image: 'https://placehold.co/200x200/A50044/fff?text=Yamal' },
      { id: 'bar-10', number: 11, name: 'Raphinha', position: 'FWD', image: 'https://placehold.co/200x200/A50044/fff?text=Raphinha' },
      { id: 'bar-11', number: 9, name: 'Lewandowski', position: 'FWD', image: 'https://placehold.co/200x200/A50044/fff?text=Lewy' },
    ],
    animationType: 'BLAUGRANA_BOUNCE',
    goalAnimationType: 'CENTER_BURST'
  },
  MAN_CITY: {
    id: 'mci',
    name: 'Manchester City',
    shortName: 'MCI',
    colorPrimary: '#6CABDD',
    colorSecondary: '#1C2C5B',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
    coach: 'Pep Guardiola',
    players: generatePlayers('MCI'),
    animationType: 'CYBER_FLASH',
    goalAnimationType: 'CENTER_BURST'
  },
  PSG: {
    id: 'psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    colorPrimary: '#004171',
    colorSecondary: '#DA291C',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png',
    coach: 'Luis Enrique',
    players: generatePlayers('PSG'),
    animationType: 'CYBER_FLASH',
    goalAnimationType: 'HUGE_SLIDE'
  },
  BAYERN: {
    id: 'bay',
    name: 'Bayern Munich',
    shortName: 'BAY',
    colorPrimary: '#DC052D',
    colorSecondary: '#0066B2',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
    coach: 'Vincent Kompany',
    players: generatePlayers('BAY'),
    animationType: 'STANDARD',
    goalAnimationType: 'HUGE_SLIDE'
  },
  BRAZIL: {
    id: 'bra',
    name: 'Brazil',
    shortName: 'BRA',
    colorPrimary: '#FFDF00',
    colorSecondary: '#009C3B',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Brazilian_Football_Confederation_logo.svg/800px-Brazilian_Football_Confederation_logo.svg.png',
    coach: 'Dorival Júnior',
    players: generatePlayers('BRA'),
    animationType: 'SAMBA_PULSE',
    goalAnimationType: 'CENTER_BURST'
  },
  ARGENTINA: {
    id: 'arg',
    name: 'Argentina',
    shortName: 'ARG',
    colorPrimary: '#74ACDF',
    colorSecondary: '#FFFFFF',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/Argentina_national_football_team_logo.svg/800px-Argentina_national_football_team_logo.svg.png',
    coach: 'Lionel Scaloni',
    players: generatePlayers('ARG'),
    animationType: 'ALBICELESTE_SPIN',
    goalAnimationType: 'HUGE_SLIDE'
  },
  FRANCE: {
    id: 'fra',
    name: 'France',
    shortName: 'FRA',
    colorPrimary: '#002395',
    colorSecondary: '#ED2939',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/1200px-Flag_of_France.svg.png',
    coach: 'Didier Deschamps',
    players: generatePlayers('FRA'),
    animationType: 'STANDARD',
    goalAnimationType: 'HUGE_SLIDE'
  },
  ENGLAND: {
    id: 'eng',
    name: 'England',
    shortName: 'ENG',
    colorPrimary: '#FFFFFF',
    colorSecondary: '#CE1124',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/1200px-Flag_of_England.svg.png',
    coach: 'Gareth Southgate',
    players: generatePlayers('ENG'),
    animationType: 'ROYAL_SLIDE',
    goalAnimationType: 'HUGE_SLIDE'
  },
  ITALY: {
    id: 'ita',
    name: 'Italy',
    shortName: 'ITA',
    colorPrimary: '#0064AA',
    colorSecondary: '#FFFFFF',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png',
    coach: 'Luciano Spalletti',
    players: generatePlayers('ITA'),
    animationType: 'STANDARD',
    goalAnimationType: 'HUGE_SLIDE'
  }
};

const INITIAL_STATS: TeamStats = {
  possession: 50,
  shots: 0,
  shotsOnTarget: 0,
  corners: 0,
  fouls: 0,
  yellowCards: 0,
  redCards: 0,
  offsides: 0,
  saves: 0,
  passes: 0,
  xg: 0.00
};

export const INITIAL_STATE: MatchState = {
  tournamentName: 'UEFA CHAMPIONS LEAGUE',
  homeTeam: TEAMS_DB.REAL_MADRID,
  awayTeam: TEAMS_DB.BARCELONA,
  homeScore: 0,
  awayScore: 0,
  homeStats: { ...INITIAL_STATS },
  awayStats: { ...INITIAL_STATS },
  timer: {
    minutes: 0,
    seconds: 0,
    isRunning: false,
    addedTime: 0,
    period: '1st',
  },
  overlay: {
    showScoreboard: true,
    showLineups: false,
    showLowerThird: false,
    showStats: false,
    showIntro: false,
    showTicker: false,
    showFormation: false,
    showSponsor: true,
    activeEvent: null,
    customMessage: null,
  },
  events: [],
};