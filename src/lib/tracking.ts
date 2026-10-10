export const REGIONS = [
  ["na", "NA1", "North America"], ["euw", "EUW1", "Europe West"],
  ["eune", "EUN1", "Europe Nordic & East"], ["kr", "KR", "Korea"],
  ["br", "BR1", "Brazil"], ["jp", "JP1", "Japan"],
  ["lan", "LA1", "Latin America North"], ["las", "LA2", "Latin America South"],
  ["oce", "OC1", "Oceania"], ["tr", "TR1", "Türkiye"], ["ru", "RU", "Russia"],
  ["ph", "PH2", "Philippines"], ["sg", "SG2", "Singapore"],
  ["th", "TH2", "Thailand"], ["tw", "TW2", "Taiwan"],
  ["vn", "VN2", "Vietnam"], ["me", "ME1", "Middle East"],
] as const;
export const TIERS = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"] as const;
export type Tier = typeof TIERS[number];
export type Queue = "RANKED_SOLO_5x5" | "RANKED_FLEX_SR";
export interface QueueRank {
  tier: Tier;
  division: "IV" | "III" | "II" | "I" | null;
  lp: number;
  wins: number;
  losses: number;
}
export interface Account {
  puuid: string;
  ign: string;
  region: string;
  currentRank?: { solo: QueueRank | null; flex: QueueRank | null } | null;
}
export interface Subscription extends Account { subscriptionId: string }
export interface Snapshot {
  id: string; puuid: string; queueType: Queue; ts: string;
  tier: Tier | null; division: "IV" | "III" | "II" | "I" | null;
  lp: number; wins: number; losses: number; matchId: string | null;
  reason: "Game" | "Ambiguous" | "LpAdjustment" | "Reset";
  seasonId: number; lpDelta: number | null;
}
export interface History { puuid: string; season: number | null; split: string | null; snapshots: Snapshot[] }

/** Missing currentRank permits a history fallback; explicit null always means unranked. */
export function playerRankTier(account: Account, queue: Queue, historyTier?: Tier | null): Tier | null | undefined {
  if (account.currentRank === undefined) return historyTier;
  const rank = account.currentRank?.[queue === "RANKED_SOLO_5x5" ? "solo" : "flex"];
  return rank?.tier ?? null;
}
export class TrackingError extends Error {
  status: number;
  detail: string;
  retryAfter: number;
  constructor(status: number, detail: string, retryAfter = 0) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.retryAfter = retryAfter;
  }
}
const TRACKING_API_ORIGIN = (import.meta.env?.TRACKING_API_ORIGIN || "https://api.poroscout.gg").replace(/\/+$/, "");
export async function trackingRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${TRACKING_API_ORIGIN}/tracking/${path}`, { ...init, signal: init?.signal ?? AbortSignal.timeout(15000) });
  if (!response.ok) {
    let detail = await response.text();
    try {
      const payload = JSON.parse(detail);
      if (typeof payload?.error === "string") detail = payload.error;
    } catch {
      // Older tracking routes return plain text.
    }
    const retry = response.headers.get("Retry-After");
    let retryAfter = 0;
    if (retry) {
      const seconds = Number(retry);
      const delay = Number.isFinite(seconds)
        ? seconds * 1000
        : Date.parse(retry) - Date.now();
      if (Number.isFinite(delay)) retryAfter = Math.max(0, delay);
    }
    throw new TrackingError(response.status, detail, retryAfter);
  }
  return response.status === 204 ? undefined as T : response.json();
}
export function resolveAccount(riotId: string, region: string, signal?: AbortSignal) {
  return trackingRequest<Account>(`accounts/resolve?${new URLSearchParams({ riotId, region })}`, { signal });
}
export function playerPath(ign: string, region: string) {
  const [name, tag] = ign.split("#");
  const slug = REGIONS.find((r) => r[1] === region)?.[0] ?? region.toLowerCase();
  // Encode literal hyphens too, leaving only the name/tag separator unescaped.
  const encode = (s: string) => encodeURIComponent(s).replaceAll("-", "%2D");
  return `/ranked/${slug}/${encode(name)}-${encode(tag)}`;
}
export function parsePlayerPath(pathname: string): { riotId: string; region: string } | null {
  const parts = pathname.replace(/\/$/, "").split("/");
  const region = REGIONS.find((r) => r[0] === parts[2]?.toLowerCase() || r[1].toLowerCase() === parts[2]?.toLowerCase());
  if (!region) return null;
  try {
    let name: string, tag: string;
    if (parts.length === 5) [name, tag] = parts.slice(3).map(decodeURIComponent);
    else if (parts.length === 4) {
      const separator = parts[3].lastIndexOf("-");
      if (separator < 1) return null;
      name = decodeURIComponent(parts[3].slice(0, separator));
      tag = decodeURIComponent(parts[3].slice(separator + 1));
    } else return null;
    return name.trim() && tag.trim() && !name.includes("#") && !tag.includes("#") ? { riotId: `${name}#${tag}`, region: region[1] } : null;
  } catch { return null; }
}
export function rankValue(point: Snapshot): number | null {
  if (!point.tier) return null;
  const tier = TIERS.indexOf(point.tier);
  if (tier >= 7) return 2800 + point.lp;
  if (!point.division) return null;
  return tier * 400 + ["IV", "III", "II", "I"].indexOf(point.division) * 100 + point.lp;
}
export function rankLabel(point: Snapshot) {
  if (!point.tier) return "Unranked";
  return `${point.tier[0]}${point.tier.slice(1).toLowerCase()}${TIERS.indexOf(point.tier) < 7 && point.division ? ` ${point.division}` : ""}`;
}
export function rankSegments(snapshots: Snapshot[]): number[][] {
  const segments: number[][] = [];
  let current: number[] = [];
  snapshots.forEach((point, index) => {
    const previous = snapshots[index - 1];
    if (point.reason === "Reset" || rankValue(point) === null || previous && (previous.seasonId !== point.seasonId || previous.queueType !== point.queueType)) {
      if (current.length) segments.push(current);
      current = [];
    }
    if (rankValue(point) !== null) current.push(index);
  });
  if (current.length) segments.push(current);
  return segments;
}
export function outcome(point: Snapshot, previous?: Snapshot) {
  if (point.reason === "Reset") return "Baseline / reset";
  if (point.reason === "LpAdjustment") return "LP adjustment";
  if (point.reason === "Ambiguous") return "Multiple games";
  if (!previous || previous.seasonId !== point.seasonId) return "Ranked game";
  const wins = point.wins - previous.wins, losses = point.losses - previous.losses;
  return wins === 1 && losses === 0 ? "Victory" : losses === 1 && wins === 0 ? "Defeat" : "Ranked game";
}
export function errorMessage(error: unknown): string {
  if (error instanceof TrackingError) {
    if (error.detail === "account not tracked") return "This player isn’t tracked yet. Start tracking to record their climb.";
    if (error.detail === "riot id not found") return "Player not found. Check the name and tag, then try again.";
    if (error.status === 403) return "Verification expired or failed. Complete the check and try again.";
    if (error.detail === "subscription limit reached") return "This network has reached its tracker limit. Remove a saved tracker and try again.";
    if (error.status === 429) return "Too many requests. Wait a moment and try again.";
    if (error.status === 400 || error.status === 422) return "Check the Riot ID (Name#TAG) and League region, then try again.";
  }
  return "We couldn’t reach the tracker. Try again in a moment.";
}
