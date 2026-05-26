export type MetricInput = {
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
};

export function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

export function safePercentage(made: number, attempted: number) {
  if (!attempted) return 0;
  return round((made / attempted) * 100);
}

export function efficiencyScore(stat: MetricInput) {
  return stat.points + stat.rebounds + stat.assists + stat.steals + stat.blocks - stat.turnovers;
}

export function impactScore(stat: MetricInput) {
  return round(
    stat.points +
      stat.rebounds * 1.2 +
      stat.assists * 1.5 +
      stat.steals * 2 +
      stat.blocks * 2 -
      stat.turnovers * 1.3
  );
}

export function enrichStat<T extends MetricInput>(stat: T) {
  return {
    ...stat,
    efficiency: efficiencyScore(stat),
    impactScore: impactScore(stat),
    fgPercentage: safePercentage(stat.fieldGoalsMade, stat.fieldGoalsAttempted),
    threePointPercentage: safePercentage(stat.threePointsMade, stat.threePointsAttempted),
    freeThrowPercentage: safePercentage(stat.freeThrowsMade, stat.freeThrowsAttempted)
  };
}
