import { useState } from "react";
import {
  playerPath,
  playerRankTier,
  type Queue,
  type Snapshot,
} from "../../lib/tracking";
import { useRankedContext } from "./RankedContext";
import RefreshButton from "./RefreshButton";

export default function PlayerHeader({
  queue,
  tier,
}: {
  queue: Queue;
  tier?: Snapshot["tier"];
}) {
  const {
    account,
    demo,
    canTrack,
    promptTracking: onTrack,
    regionName,
  } = useRankedContext();
  const [shareNotice, setShareNotice] = useState("");
  if (!account) return null;
  const [name, tag] = account.ign.split("#");
  const badgeTier = playerRankTier(account, queue, tier);

  async function share() {
    if (!account) return;
    const path = demo
      ? "/ranked/demo"
      : playerPath(account.ign, account.region);
    try {
      await navigator.clipboard.writeText(
        new URL(path, window.location.origin).href,
      );
      setShareNotice("Link copied");
    } catch {
      setShareNotice("Copy this page’s URL to share");
    }
  }

  return (
    <header className="player-header">
      <div className="player-identity">
        <RankCrest tier={badgeTier} />
        <div>
          <h1>
            {name}
            <span>#{tag}</span>
          </h1>
          <p>
            {regionName}
            {demo && "· Simulated ranked history"}
          </p>
        </div>
      </div>
      <div className="player-actions flex-wrap">
        {!demo && <RefreshButton />}
        <button
          type="button"
          className="tracker-button"
          onClick={() => void share()}
        >
          {shareNotice || (demo ? "Share demo" : "Share player")}
        </button>
        {canTrack && (
          <button
            className="tracker-button primary"
            type="button"
            onClick={onTrack}
          >
            Track player
          </button>
        )}
      </div>
    </header>
  );
}

export function RankCrest({ tier }: { tier?: Snapshot["tier"] }) {
  if (tier === null) return null;
  if (tier) {
    const label = `${tier[0]}${tier.slice(1).toLowerCase()}`;
    return (
      <img
        className="rank-crest"
        src={`/rank-emblems/${tier.toLowerCase()}.webp`}
        width={144}
        height={160}
        alt={`${label} rank badge`}
        decoding="async"
      />
    );
  }
  return (
    <svg
      className="rank-crest"
      viewBox="0 0 80 88"
      fill="none"
      aria-hidden="true"
      style={{ color: "#c8aa6e" }}
    >
      <path
        d="M40 4 65 18 69 47 40 80 11 47 15 18Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".45"
      />
      <path
        d="m40 15 19 13-4 24-15 17-15-17-4-24Z"
        fill="currentColor"
        fillOpacity=".1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m40 25 11 15-11 19-11-19Z"
        fill="currentColor"
        fillOpacity=".28"
        stroke="currentColor"
      />
      <path
        d="m9 28 14 10M71 28 57 38M8 39l17 10M72 39 55 49"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
