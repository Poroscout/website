import { test } from "node:test";
import assert from "node:assert/strict";
import { outcome, parsePlayerPath, playerPath, playerRankTier, rankSegments, rankValue, type Account, type Snapshot } from "../src/lib/tracking.ts";
const point = (overrides: Partial<Snapshot> = {}): Snapshot => ({ id: "point", puuid: "test", queueType: "RANKED_SOLO_5x5", ts: "2026-10-01T18:00:00Z", tier: "GOLD", division: "I", lp: 80, wins: 10, losses: 5, matchId: null, reason: "Game", seasonId: 26, lpDelta: null, ...overrides });

test("friendly links preserve Unicode, spaces, hyphens, and case", () => {
  for (const ign of ["Derock#ROCK", "A-B C#TAG", "玩家 Ü#A-B", "A/B?#T%G"]) {
    assert.deepEqual(parsePlayerPath(playerPath(ign, "NA1")), { riotId: ign, region: "NA1" });
  }
  assert.deepEqual(parsePlayerPath("/ranked/na/Derock-ROCK"), { riotId: "Derock#ROCK", region: "NA1" });
  assert.deepEqual(parsePlayerPath("/ranked/eune/A-B/TAG"), { riotId: "A-B#TAG", region: "EUN1" });
  for (const path of ["/ranked/nope/Derock-ROCK", "/ranked/na/Derock", "/ranked/na/A-", "/ranked/na/%-TAG", "/ranked/na/A%23B-TAG"]) assert.equal(parsePlayerPath(path), null);
});
test("rank scale crosses divisions and tiers without a 100 LP discontinuity", () => {
  assert.equal(rankValue(point({ division: "II", lp: 80 })), 1480);
  assert.equal(rankValue(point({ division: "I", lp: 10 }))! - rankValue(point({ division: "II", lp: 80 }))!, 30);
  assert.equal(rankValue(point({ tier: "PLATINUM", division: "IV", lp: 5 }))! - rankValue(point({ lp: 80 }))!, 25);
  assert.equal(rankValue(point({ tier: null, division: null })), null);
});
test("all apex ranks share one LP scale", () => {
  for (const tier of ["MASTER", "GRANDMASTER", "CHALLENGER"] as const) assert.equal(rankValue(point({ tier, division: "I", lp: 550 })), 3350);
});
test("chart segments break at resets, unranked, queue changes, and season changes", () => {
  const snapshots = [point({ reason: "Reset" }), point(), point({ reason: "Reset" }), point(), point({ tier: null, division: null }), point(), point({ seasonId: 27 }), point({ seasonId: 27, queueType: "RANKED_FLEX_SR" })];
  assert.deepEqual(rankSegments(snapshots), [[0, 1], [2, 3], [5], [6], [7]]);
});
test("results come from game counters, never LP direction", () => {
  assert.equal(outcome(point({ wins: 11, lpDelta: -10 }), point()), "Victory");
  assert.equal(outcome(point({ losses: 6, lpDelta: 15 }), point()), "Defeat");
  assert.equal(outcome(point({ lpDelta: 30 }), point()), "Ranked game");
  assert.equal(outcome(point({ reason: "Ambiguous", wins: 12 }), point()), "Multiple games");
  assert.equal(outcome(point({ reason: "LpAdjustment" }), point()), "LP adjustment");
  assert.equal(outcome(point({ reason: "Reset" }), point()), "Baseline / reset");
  assert.equal(outcome(point({ seasonId: 27, wins: 11 }), point()), "Ranked game");
});

test("current queue rank takes precedence over history, including explicit unranked results", () => {
  const account: Account = { puuid: "player", ign: "Player#TAG", region: "NA1" };
  const ranked: Account = {
    ...account,
    currentRank: {
      solo: { tier: "DIAMOND", division: "II", lp: 63, wins: 80, losses: 60 },
      flex: null,
    },
  };
  assert.equal(playerRankTier(ranked, "RANKED_SOLO_5x5", "GOLD"), "DIAMOND");
  assert.equal(playerRankTier(ranked, "RANKED_FLEX_SR", "CHALLENGER"), null);
  assert.equal(playerRankTier({ ...ranked, currentRank: null }, "RANKED_SOLO_5x5", "DIAMOND"), null);
  assert.equal(playerRankTier(account, "RANKED_SOLO_5x5", "GOLD"), "GOLD");
  assert.equal(playerRankTier(account, "RANKED_SOLO_5x5"), undefined);
});
