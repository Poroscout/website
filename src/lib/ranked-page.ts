import {
  errorMessage,
  rankLabel,
  REGIONS,
  resolveAccount,
  TrackingError,
  trackingRequest,
  type Account,
  type History,
  type Snapshot,
} from "./tracking";

export type RankedPlayerData =
  | {
      status: "ready";
      account: Account;
      snapshots: Snapshot[];
      checkedAt?: string;
      error?: string;
    }
  | { status: "untracked" };

/** Public data only: browser-owned subscriptions never enter the rendered page. */
export async function loadRankedPlayer(player: {
  riotId: string;
  region: string;
}): Promise<RankedPlayerData | undefined> {
  let account: Account;
  try {
    account = await resolveAccount(player.riotId, player.region);
  } catch (err) {
    if (err instanceof TrackingError && err.detail === "account not tracked")
      return { status: "untracked" };
    // The client can still retry lookup when the API is unreachable from the server.
    return undefined;
  }

  try {
    const history = await trackingRequest<History>(
      `accounts/${encodeURIComponent(account.puuid)}/history`,
    );
    return {
      status: "ready",
      account,
      snapshots: history.snapshots,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      status: "ready",
      account,
      snapshots: [],
      error: errorMessage(err),
    };
  }
}

export function rankedPageMetadata(
  player: { riotId: string; region: string },
  data?: RankedPlayerData,
) {
  const account = data?.status === "ready" ? data.account : undefined;
  const ign = account?.ign ?? player.riotId;
  const region = REGIONS.find(
    ([, platform]) => platform === (account?.region ?? player.region),
  )?.[2];
  const ranks: string[] = [];
  if (data?.status === "ready") {
    for (const [queue, label] of [
      ["RANKED_SOLO_5x5", "Solo/Duo"],
      ["RANKED_FLEX_SR", "Flex"],
    ] as const) {
      const latest = data.snapshots.findLast(
        (snapshot) => snapshot.queueType === queue,
      );
      if (latest)
        ranks.push(
          `${label}: ${rankLabel(latest)}${latest.tier ? ` · ${latest.lp} LP` : ""}`,
        );
    }
  }
  return {
    title: `${ign} · Ranked · PoroScout`,
    description: ranks.length
      ? `${ign} on ${region}. ${ranks.join(". ")}. Explore ranked LP history and climb progress on PoroScout.`
      : `Follow ${ign} on ${region}. Explore ranked LP history, promotions, and climb progress on PoroScout.`,
  };
}
