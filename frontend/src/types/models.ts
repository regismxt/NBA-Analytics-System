export type Team = {
  id: number;
  externalId: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  players?: Player[];
  games?: Game[];
  _count?: {
    players: number;
    homeGames: number;
    awayGames: number;
  };
};

export type PlayerAverages = {
  gamesPlayed: number;
  points: number;
  rebounds: number;
  assists: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  efficiency: number;
  impactScore: number;
  fgPercentage?: number;
  threePointPercentage?: number;
  freeThrowPercentage?: number;
};

export type Player = {
  id: number;
  externalId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  teamId: number;
  height?: string;
  weight?: number;
  active: boolean;
  team: Team;
  averages?: PlayerAverages;
  stats?: PlayerGameStat[];
};

export type Game = {
  id: number;
  externalId: string;
  homeTeamId: number;
  awayTeamId: number;
  gameDate: string;
  status: "FINAL" | "LIVE" | "SCHEDULED" | string;
  season: string;
  homeScore: number;
  awayScore: number;
  period: number;
  clock?: string;
  homeTeam: Team;
  awayTeam: Team;
  liveEvents?: LiveEvent[];
  _count?: { playerStats: number };
};

export type PlayerGameStat = {
  id: number;
  gameId: number;
  playerId: number;
  teamId: number;
  minutesPlayed: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointsMade: number;
  threePointsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  plusMinus: number;
  efficiency: number;
  impactScore: number;
  fgPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
  player: Player;
  team: Team;
  game?: Game;
};

export type LiveEvent = {
  id: number;
  gameId: number;
  playerId?: number;
  eventType: string;
  eventDescription: string;
  period: number;
  clock?: string;
  createdAt: string;
  player?: Player;
};

export type RankingRow = {
  playerId: number;
  fullName: string;
  position: string;
  team: string;
  gamesPlayed: number;
  total: number;
  average: number;
  totals: Record<string, number>;
};

export type DashboardSummary = {
  totals: {
    games: number;
    players: number;
    topScorer: RankingRow | null;
    mostEfficient: RankingRow | null;
  };
  recentGames: Game[];
  topScorers: RankingRow[];
};

export type TopPerformers = {
  points: RankingRow[];
  assists: RankingRow[];
  rebounds: RankingRow[];
  efficiency: RankingRow[];
  impact: RankingRow[];
};

export type PlayerComparisonSide = {
  player?: Player;
  gamesPlayed: number;
  totals: Record<string, number>;
  averages: PlayerAverages;
  gameLog: PlayerGameStat[];
};

export type PlayerComparison = {
  playerA: PlayerComparisonSide;
  playerB: PlayerComparisonSide;
};
