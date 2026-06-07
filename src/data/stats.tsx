export interface BotStats {
  guildCount: GuildCount;
  userCount: UserCount;
  interactionCount: InteractionCount;
  userInstalls: number;
}

export interface GuildCount {
  current: number;
  history: number[];
  discordEstimate: number;
}

export interface UserCount {
  current: number;
  history: number[];
}

export interface InteractionCount {
  current: number;
  history: number[];
}

/**
 * Last-known-good baseline, committed so a cold cache + dead API still renders
 * sane numbers instead of zeros or a 500. Refresh occasionally so the floor
 * doesn't drift too far below reality. Snapshot: 2026-06-07.
 */
const FALLBACK_STATS: BotStats = {
  guildCount: {
    current: 5019,
    discordEstimate: 5020,
    history: [5014, 5015, 5016, 5016, 5017, 5016, 5015, 5016, 5017, 5019],
  },
  userCount: {
    current: 991710,
    history: [
      986193, 986195, 986257, 986357, 988000, 989500, 990200, 990900, 991300,
      991710,
    ],
  },
  interactionCount: {
    current: 0,
    history: [0],
  },
  userInstalls: 0,
};

/**
 * Fetch live bot stats. On any failure (API down, timeout, bad JSON) this
 * returns FALLBACK_STATS and sets `locals.statsStale = true` so the ISR
 * middleware knows not to cache this degraded render. The page always renders
 * 200: callers never have to handle a throw.
 */
export async function getBotStats(locals?: App.Locals): Promise<BotStats> {
  try {
    const res = await fetch("https://api.poroscout.gg/bot/stats", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`stats API responded ${res.status}`);
    return (await res.json()) as BotStats;
  } catch (error) {
    console.error("[stats] fetch failed, using fallback:", error);
    if (locals) locals.statsStale = true;
    return FALLBACK_STATS;
  }
}
