import { TIERS, type Account, type Queue, type Snapshot } from "../lib/tracking";

// Deterministic simulated updates. These records never enter the real tracking API.
export function createRankedDemo(): { account: Account; snapshots: Snapshot[] } {
  const account: Account = { puuid: "demo-player", ign: "Poro On A Mission#DEMO", region: "NA1" };
  const snapshots: Snapshot[] = [];
  let seed = 42;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const now = Date.now();
  function series(queue: Queue, count: number, initial: number, seasonId: number, daysAgo: number) {
    let value = initial, wins = 0, losses = 0;
    for (let i = 0; i < count; i++) {
      let reason: Snapshot["reason"] = i === 0 ? "Reset" : "Game";
      let delta: number | null = null;
      if (i > 0) {
        const win = random() > (i > 32 && i < 42 ? 0.76 : 0.31);
        delta = win ? 24 + Math.floor(random() * 8) : -19 - Math.floor(random() * 7);
        if (i === 23) { reason = "Ambiguous"; wins += 2; losses++; delta = 33; }
        else if (i === 47) { reason = "LpAdjustment"; delta = -15; }
        else if (i === 58) { reason = "Reset"; delta = null; value = Math.max(initial, value - 150); }
        else { wins += Number(win); losses += Number(!win); }
        value = Math.max(0, value + (delta ?? 0));
      }
      const tierIndex = Math.min(7, Math.floor(value / 400));
      snapshots.push({
        id: `demo-${queue}-${seasonId}-${i}`, puuid: account.puuid, queueType: queue,
        ts: new Date(now - daysAgo * 86400000 + i * 8 * 3600000).toISOString(),
        tier: TIERS[tierIndex], division: tierIndex >= 7 ? null : ["IV", "III", "II", "I"][Math.floor(value % 400 / 100)] as Snapshot["division"],
        lp: tierIndex >= 7 ? value - 2800 : value % 100, wins, losses,
        matchId: reason === "Game" && i % 5 !== 0 ? `DEMO_${seasonId}_${i}` : null,
        reason, seasonId, lpDelta: delta,
      });
    }
  }
  series("RANKED_SOLO_5x5", 28, 1065, 25, 390);
  series("RANKED_SOLO_5x5", 86, 1482, 26, 29);
  series("RANKED_FLEX_SR", 44, 2720, 26, 15);
  snapshots.sort((a, b) => +new Date(a.ts) - +new Date(b.ts));
  return { account, snapshots };
}
