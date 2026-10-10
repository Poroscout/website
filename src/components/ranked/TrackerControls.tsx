import type { FormEvent } from "react";
import { playerPath, playerRankTier, REGIONS } from "../../lib/tracking";
import { RankCrest } from "./PlayerHeader";
import { useRankedContext } from "./RankedContext";
import Turnstile from "./Turnstile";

export function PlayerSearch() {
  const {
    riotId,
    region,
    account,
    player,
    trackingTarget,
    loading,
    startingTracking,
    setRiotId,
    setRegion,
    clearTrackingTarget,
    lookup,
  } = useRankedContext();
  const compact = !!(account || player || trackingTarget);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup({ riotId: riotId.trim(), region });
  }

  function onRiotIdChange(value: string) {
    setRiotId(value);
    clearTrackingTarget();
  }

  function onRegionChange(value: string) {
    setRegion(value);
    clearTrackingTarget();
  }
  const disabled = loading || startingTracking;
  return (
    <form
      className={`player-search ${compact ? "compact" : ""}`}
      onSubmit={onSearch}
    >
      <div className="riot-input">
        <label htmlFor="riot-id">Riot ID</label>
        <div>
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            id="riot-id"
            name="riotId"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Game name#TAG"
            value={riotId}
            onChange={(event) => onRiotIdChange(event.target.value)}
            required
            pattern="[^#]+#[^#]+"
            maxLength={100}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="region-input">
        <label htmlFor="player-region">Region</label>
        <select
          id="player-region"
          value={region}
          onChange={(event) => onRegionChange(event.target.value)}
          disabled={disabled}
        >
          {REGIONS.map(([slug, platform, name]) => (
            <option key={platform} value={platform}>
              {slug.toUpperCase()} · {name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="tracker-button primary"
        disabled={disabled}
      >
        {loading ? "Finding player…" : "Search player"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

export function TrackingPrompt() {
  const {
    account,
    trackingTarget: target,
    siteKey,
    attempt,
    token,
    loading,
    startingTracking,
    setToken,
    startTracking,
    clearTrackingTarget,
  } = useRankedContext();
  if (!target) return null;

  function onCancel() {
    clearTrackingTarget();
    document.getElementById("riot-id")?.focus();
  }
  const [name, tag] = target.riotId.split("#");
  const regionName = REGIONS.find(
    ([, platform]) => platform === target.region,
  )?.[2];
  return (
    <section
      className="tracking-prompt"
      aria-labelledby="tracking-heading"
      aria-busy={startingTracking}
    >
      <div className="tracking-copy">
        <div className="tracking-identity" role="status">
          <RankCrest
            tier={
              account ? playerRankTier(account, "RANKED_SOLO_5x5") : undefined
            }
          />
          <div>
            <h2 id="tracking-heading">
              {name}
              <span>#{tag}</span>
            </h2>
            <p>
              {regionName}
              <span aria-hidden="true"> · </span>
              <span className="tracking-state">
                {target.untracked
                  ? "Not tracked yet"
                  : "Already has ranked history"}
              </span>
            </p>
          </div>
        </div>
        <h3>
          {target.untracked
            ? "Be here for the next game."
            : "Keep this player in your trackers."}
        </h3>
        <p>
          {target.untracked
            ? "Start recording their Solo/Duo and Flex LP. Tracking begins now; past games aren’t imported."
            : "Save this player on this browser and keep their Solo/Duo and Flex tracking active."}
        </p>
        <p className="tracker-note">
          Ranked history is public. Your saved trackers stay on this browser.
        </p>
      </div>
      <div className="tracking-controls">
        {siteKey && (
          <p className="verification-label">Verify to start tracking</p>
        )}
        <Turnstile siteKey={siteKey} onToken={setToken} attempt={attempt} />
        <button
          className="tracker-button primary"
          type="button"
          disabled={!token || startingTracking || loading}
          onClick={() => void startTracking()}
        >
          {startingTracking ? "Starting tracker…" : "Start tracking"}
          <span aria-hidden="true">→</span>
        </button>
        <button
          className="text-action"
          type="button"
          disabled={startingTracking}
          onClick={onCancel}
        >
          {target.untracked ? "Search another player" : "Cancel"}
        </button>
      </div>
    </section>
  );
}

export function SavedTrackers() {
  const { saved, removing, remove } = useRankedContext();
  return (
    <section className="saved-trackers" aria-labelledby="saved-heading">
      <div className="section-header">
        <h2 id="saved-heading">Your tracked players</h2>
        <span>Saved on this browser</span>
      </div>
      <ul>
        {saved.map((subscription) => (
          <li key={subscription.subscriptionId}>
            <a href={playerPath(subscription.ign, subscription.region)}>
              <span>{subscription.ign}</span>
              <small>
                {REGIONS.find(
                  ([, platform]) => platform === subscription.region,
                )?.[0].toUpperCase()}
              </small>
            </a>
            <button
              className="text-action"
              type="button"
              disabled={!!removing}
              onClick={() => void remove(subscription)}
            >
              {removing === subscription.subscriptionId
                ? "Removing…"
                : "Stop tracking"}
              <span className="sr-only"> {subscription.ign}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="tracker-note">
        Stopping your subscription preserves history. Other subscriptions may
        keep a player tracked.
      </p>
    </section>
  );
}
