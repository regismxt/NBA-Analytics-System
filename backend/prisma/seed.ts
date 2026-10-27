import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const teams = [
  { externalId: "mock-atl", name: "Comets", abbreviation: "ATL", city: "Atlanta", conference: "East", division: "Southeast" },
  { externalId: "mock-bos", name: "Harbor", abbreviation: "BOS", city: "Boston", conference: "East", division: "Atlantic" },
  { externalId: "mock-chi", name: "Steel", abbreviation: "CHI", city: "Chicago", conference: "East", division: "Central" },
  { externalId: "mock-dal", name: "Stallions", abbreviation: "DAL", city: "Dallas", conference: "West", division: "Southwest" },
  { externalId: "mock-den", name: "Peaks", abbreviation: "DEN", city: "Denver", conference: "West", division: "Northwest" },
  { externalId: "mock-la", name: "Lights", abbreviation: "LAL", city: "Los Angeles", conference: "West", division: "Pacific" }
];

const playerNames: Record<string, Array<[string, string, string]>> = {
  ATL: [
    ["Mason", "Reed", "PG"],
    ["Caleb", "Brooks", "SG"],
    ["Evan", "Stone", "SF"],
    ["Noah", "Bennett", "PF"],
    ["Miles", "Carter", "C"]
  ],
  BOS: [
    ["Luca", "Hayes", "PG"],
    ["Andre", "Cole", "SG"],
    ["Isaac", "Pierce", "SF"],
    ["Jonah", "Miles", "PF"],
    ["Theo", "Grant", "C"]
  ],
  CHI: [
    ["Dante", "Wells", "PG"],
    ["Owen", "Banks", "SG"],
    ["Ryan", "Foster", "SF"],
    ["Marcus", "Blake", "PF"],
    ["Julian", "Ford", "C"]
  ],
  DAL: [
    ["Nolan", "Price", "PG"],
    ["Tyler", "Ross", "SG"],
    ["Cam", "Bryant", "SF"],
    ["Jalen", "Knight", "PF"],
    ["Ezra", "Ward", "C"]
  ],
  DEN: [
    ["Kai", "Morgan", "PG"],
    ["Aiden", "Perry", "SG"],
    ["Cole", "Hudson", "SF"],
    ["Finn", "Porter", "PF"],
    ["Levi", "Sullivan", "C"]
  ],
  LAL: [
    ["Rafa", "Silva", "PG"],
    ["Ben", "Cooper", "SG"],
    ["Max", "Torres", "SF"],
    ["Ivy", "Dawson", "PF"],
    ["Leo", "Rivera", "C"]
  ]
};

const gamePlan = [
  { externalId: "mock-game-001", home: "ATL", away: "BOS", date: "2026-01-10T00:30:00.000Z", status: "FINAL", period: 4, clock: "00:00" },
  { externalId: "mock-game-002", home: "CHI", away: "DAL", date: "2026-01-11T01:00:00.000Z", status: "FINAL", period: 4, clock: "00:00" },
  { externalId: "mock-game-003", home: "DEN", away: "LAL", date: "2026-01-12T02:00:00.000Z", status: "FINAL", period: 4, clock: "00:00" },
  { externalId: "mock-game-004", home: "BOS", away: "CHI", date: "2026-01-14T00:30:00.000Z", status: "FINAL", period: 4, clock: "00:00" },
  { externalId: "mock-game-005", home: "DAL", away: "DEN", date: "2026-01-15T01:30:00.000Z", status: "LIVE", period: 3, clock: "04:18" },
  { externalId: "mock-game-006", home: "LAL", away: "ATL", date: "2026-01-16T03:00:00.000Z", status: "SCHEDULED", period: 0, clock: "12:00" }
];

function statLine(gameIndex: number, playerIndex: number, isHome: boolean) {
  const pace = isHome ? 3 : 1;
  const points = 10 + ((gameIndex * 7 + playerIndex * 5 + pace) % 24);
  const rebounds = 2 + ((gameIndex * 3 + playerIndex * 2 + pace) % 11);
  const assists = 1 + ((gameIndex * 4 + playerIndex * 3 + pace) % 10);
  const steals = (gameIndex + playerIndex + pace) % 4;
  const blocks = (gameIndex + playerIndex * 2 + pace) % 3;
  const turnovers = 1 + ((gameIndex + playerIndex + pace) % 5);
  const fieldGoalsAttempted = Math.max(7, Math.round(points / 2) + 4 + (playerIndex % 3));
  const fieldGoalsMade = Math.min(fieldGoalsAttempted, Math.max(2, Math.round(points / 2.6)));
  const threePointsAttempted = 2 + ((playerIndex + gameIndex) % 7);
  const threePointsMade = Math.min(threePointsAttempted, Math.floor((points + playerIndex) % 5));
  const freeThrowsAttempted = 2 + ((points + playerIndex) % 6);
  const freeThrowsMade = Math.max(1, Math.min(freeThrowsAttempted, freeThrowsAttempted - ((gameIndex + playerIndex) % 2)));

  return {
    minutesPlayed: 24 + ((gameIndex + playerIndex * 2) % 15),
    points,
    rebounds,
    assists,
    steals,
    blocks,
    turnovers,
    fieldGoalsMade,
    fieldGoalsAttempted,
    threePointsMade,
    threePointsAttempted,
    freeThrowsMade,
    freeThrowsAttempted,
    plusMinus: isHome ? 4 + playerIndex - gameIndex : gameIndex - playerIndex - 2
  };
}

function impactScore(stat: ReturnType<typeof statLine>) {
  return Number(
    (
      stat.points +
      stat.rebounds * 1.2 +
      stat.assists * 1.5 +
      stat.steals * 2 +
      stat.blocks * 2 -
      stat.turnovers * 1.3
    ).toFixed(2)
  );
}

async function seedDemoData(client: Prisma.TransactionClient) {
  // O seed demonstrativo nunca remove dados. As chaves externas permitem reexecução segura.

  const teamMap = new Map<string, number>();
  for (const team of teams) {
    const created = await client.team.upsert({
      where: { externalId: team.externalId },
      update: team,
      create: team
    });
    teamMap.set(team.abbreviation, created.id);
  }

  const playerMap = new Map<string, number[]>();
  for (const team of teams) {
    const roster = playerNames[team.abbreviation];
    const ids: number[] = [];
    for (const [index, [firstName, lastName, position]] of roster.entries()) {
      const playerData = {
        externalId: `mock-${team.abbreviation.toLowerCase()}-${index + 1}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        position,
        teamId: teamMap.get(team.abbreviation)!,
        height: position === "C" ? "6-11" : position === "PF" ? "6-9" : "6-5",
        weight: position === "C" ? 255 : position === "PF" ? 235 : 205,
        birthDate: new Date(Date.UTC(1995 + index, index % 12, 12 + index)),
        active: true
      };
      const player = await client.player.upsert({
        where: { externalId: playerData.externalId },
        update: playerData,
        create: playerData
      });
      ids.push(player.id);
    }
    playerMap.set(team.abbreviation, ids);
  }

  for (const [gameIndex, gameSeed] of gamePlan.entries()) {
    const homePlayers = playerMap.get(gameSeed.home)!;
    const awayPlayers = playerMap.get(gameSeed.away)!;
    const homeStats = homePlayers.map((playerId, index) => ({ playerId, stat: statLine(gameIndex, index, true) }));
    const awayStats = awayPlayers.map((playerId, index) => ({ playerId, stat: statLine(gameIndex, index, false) }));
    const homeScore = gameSeed.status === "SCHEDULED" ? 0 : homeStats.reduce((sum, row) => sum + row.stat.points, 0);
    const awayScore = gameSeed.status === "SCHEDULED" ? 0 : awayStats.reduce((sum, row) => sum + row.stat.points, 0);

    const gameData = {
      externalId: gameSeed.externalId,
      homeTeamId: teamMap.get(gameSeed.home)!,
      awayTeamId: teamMap.get(gameSeed.away)!,
      gameDate: new Date(gameSeed.date),
      status: gameSeed.status,
      season: "2025-26",
      homeScore,
      awayScore,
      period: gameSeed.period,
      clock: gameSeed.clock
    };
    const game = await client.game.upsert({
      where: { externalId: gameData.externalId },
      update: gameData,
      create: gameData
    });

    if (gameSeed.status !== "SCHEDULED") {
      for (const row of [...homeStats, ...awayStats]) {
        const teamId = homePlayers.includes(row.playerId) ? teamMap.get(gameSeed.home)! : teamMap.get(gameSeed.away)!;
        const statData = {
          gameId: game.id,
          playerId: row.playerId,
          teamId,
          ...row.stat
        };
        await client.playerGameStat.upsert({
          where: { gameId_playerId: { gameId: game.id, playerId: row.playerId } },
          update: statData,
          create: statData
        });

        const snapshotData = {
          gameId: game.id,
          playerId: row.playerId,
          impactScore: impactScore(row.stat),
          fantasyScore: row.stat.points + row.stat.rebounds * 1.2 + row.stat.assists * 1.5 + row.stat.steals * 3 + row.stat.blocks * 3 - row.stat.turnovers,
          usageRate: Number((18 + ((gameIndex + row.playerId) % 14)).toFixed(2))
        };
        await client.analyticsSnapshot.upsert({
          where: { gameId_playerId: { gameId: game.id, playerId: row.playerId } },
          update: snapshotData,
          create: snapshotData
        });
      }

      const topHomePlayer = [...homeStats].sort((a, b) => b.stat.points - a.stat.points)[0];
      const topAwayPlayer = [...awayStats].sort((a, b) => b.stat.points - a.stat.points)[0];
      for (const eventData of [
        {
          gameId: game.id,
          playerId: topHomePlayer.playerId,
          eventType: "SCORE",
          eventDescription: "Home scorer attacks the rim",
          period: Math.max(1, gameSeed.period),
          clock: gameSeed.clock
        },
        {
          gameId: game.id,
          playerId: topAwayPlayer.playerId,
          eventType: "THREE_POINTER",
          eventDescription: "Away scorer hits from the corner",
          period: Math.max(1, gameSeed.period),
          clock: gameSeed.clock
        }
      ]) {
        const existingEvent = await client.liveEvent.findFirst({
          where: { gameId: eventData.gameId, playerId: eventData.playerId, eventType: eventData.eventType }
        });
        if (!existingEvent) await client.liveEvent.create({ data: eventData });
      }
    }
  }
}

async function main() {
  if (process.env.SEED_MODE !== "demo") {
    console.log("Seed ignorado. Defina SEED_MODE=demo para carregar dados demonstrativos.");
    return false;
  }

  await prisma.$transaction(
    async (client) => {
      // Serializa execuções concorrentes para manter a deduplicação dos eventos atômica.
      await client.$executeRaw`SELECT pg_advisory_xact_lock(20261026)`;
      await seedDemoData(client);
    },
    { maxWait: 10_000, timeout: 30_000 }
  );

  return true;
}

main()
  .then(async (executed) => {
    await prisma.$disconnect();
    console.log(executed ? "Seed completed with mock NBA analytics data." : "Seed skipped safely.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
