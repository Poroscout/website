import { Fragment, useMemo, useState } from "react";
import {
  outcome,
  rankLabel,
  rankValue,
  TIERS,
  type Queue,
  type Snapshot,
} from "../../lib/tracking";
import LPChart, { RANK_COLORS, SnapshotDetail } from "./LPChart";
import PlayerHeader, { RankCrest } from "./PlayerHeader";
import { useDateFormatter, useRankedContext } from "./RankedContext";

export default function RankedHistory() {
  const { snapshots, demo, updated } = useRankedContext();
  const formatDate = useDateFormatter();
  const [queue, setQueue] = useState<Queue>("RANKED_SOLO_5x5");
  const [season, setSeason] = useState(demo ? "26" : "all");
  const [range, setRange] = useState("all");
  const [activityVersion, setActivityVersion] = useState(0);
  const seasons = useMemo(
    () =>
      [...new Set(snapshots.map((point) => point.seasonId))].sort(
        (a, b) => b - a,
      ),
    [snapshots],
  );
  const series = useMemo(
    () =>
      snapshots.filter(
        (point) =>
          point.queueType === queue &&
          (season === "all" || point.seasonId === Number(season)),
      ),
    [snapshots, queue, season],
  );
  const visible = useMemo(() => {
    if (range === "all") return series;
    const cutoff = Date.now() - Number(range) * 86_400_000;
    return series.filter((point) => new Date(point.ts).getTime() >= cutoff);
  }, [series, range]);
  const previousById = useMemo(
    () => new Map(series.map((point, index) => [point.id, series[index - 1]])),
    [series],
  );
  const latest = series.at(-1);
  let peak: Snapshot | undefined;
  let peakValue = -Infinity;
  for (const point of series) {
    const value = rankValue(point);
    if (value !== null && value > peakValue) {
      peak = point;
      peakValue = value;
    }
  }
  const delta = visible.reduce(
    (total, point) => total + (point.lpDelta ?? 0),
    0,
  );

  function changeFilter(filter: "queue" | "season" | "range", value: string) {
    if (filter === "queue") setQueue(value as Queue);
    if (filter === "season") setSeason(value);
    if (filter === "range") setRange(value);
    setActivityVersion((version) => version + 1);
  }

  return (
    <>
      <PlayerHeader queue={queue} tier={latest?.tier} />
      <section className="history-panel" aria-label="Ranked history">
        <div className="history-toolbar">
          <div className="queue-switch" role="group" aria-label="Ranked queue">
            <button
              type="button"
              aria-pressed={queue === "RANKED_SOLO_5x5"}
              onClick={() => changeFilter("queue", "RANKED_SOLO_5x5")}
            >
              Solo / Duo
            </button>
            <button
              type="button"
              aria-pressed={queue === "RANKED_FLEX_SR"}
              onClick={() => changeFilter("queue", "RANKED_FLEX_SR")}
            >
              Flex
            </button>
          </div>
          <div className="history-filters">
            <label className="sr-only" htmlFor="history-season">
              Season
            </label>
            <select
              id="history-season"
              value={season}
              onChange={(event) => changeFilter("season", event.target.value)}
            >
              <option value="all">All seasons</option>
              {seasons.map((value) => (
                <option key={value} value={value}>
                  Season {value}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="history-range">
              Time range
            </label>
            <select
              id="history-range"
              value={range}
              onChange={(event) => changeFilter("range", event.target.value)}
            >
              <option value="all">All history</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
        {latest && (
          <div className="rank-summary">
            <div>
              <span>Latest recorded rank</span>
              <strong
                style={{
                  color: latest.tier
                    ? RANK_COLORS[TIERS.indexOf(latest.tier)]
                    : undefined,
                }}
              >
                {rankLabel(latest)}{" "}
                <small>{latest.tier ? `${latest.lp} LP` : ""}</small>
              </strong>
            </div>
            <div>
              <span>Peak in selected season</span>
              <strong>
                {peak ? rankLabel(peak) : "Unranked"}{" "}
                <small>{peak ? `${peak.lp} LP` : ""}</small>
              </strong>
            </div>
            <div>
              <span>Recorded LP change</span>
              <strong className={delta >= 0 ? "positive" : "negative"}>
                {delta > 0 ? "+" : ""}
                {delta} <small>LP</small>
              </strong>
            </div>
            <div>
              <span>Recorded season record</span>
              <strong>
                {latest.wins}
                <small>W</small> <span className="stat-divider">/</span>{" "}
                {latest.losses}
                <small>L</small>
              </strong>
            </div>
          </div>
        )}
        {visible.length ? (
          <LPChart snapshots={visible} fullSeries={series} />
        ) : (
          <div className="tracker-empty">
            <RankCrest />
            <h2>
              {snapshots.length
                ? "No history in this view yet."
                : "Your climb starts here."}
            </h2>
            <p>
              {snapshots.length
                ? "Try a different queue, season, or time range."
                : "This player is tracked. Their first ranked snapshot will appear after the next tracking check."}
            </p>
            {range !== "all" && (
              <button
                type="button"
                className="text-action"
                onClick={() => setRange("all")}
              >
                Show all history
              </button>
            )}
          </div>
        )}
        <div className="history-status">
          <p>
            {demo
              ? "Demo data · no live API requests"
              : updated
                ? `History checked ${formatDate(updated, { hour: "numeric", minute: "2-digit" })}`
                : "History refreshes every minute"}
            {!demo && <span> · Tracking checks run periodically</span>}
          </p>
        </div>
      </section>
      {visible.length > 0 && (
        <RecentActivity
          key={activityVersion}
          snapshots={visible}
          previousById={previousById}
        />
      )}
    </>
  );
}

function RecentActivity({
  snapshots,
  previousById,
}: {
  snapshots: Snapshot[];
  previousById: Map<string, Snapshot | undefined>;
}) {
  const [detailId, setDetailId] = useState<string>();
  const [count, setCount] = useState(10);
  const formatDate = useDateFormatter();
  return (
    <section className="ranked-activity" aria-labelledby="activity-heading">
      <div className="section-header">
        <h2 id="activity-heading">Recent activity</h2>
        <span>{snapshots.length} recorded updates</span>
      </div>
      <div className="activity-table">
        <table>
          <thead>
            <tr>
              <th scope="col">Update</th>
              <th scope="col">Rank</th>
              <th scope="col">LP change</th>
              <th scope="col">Recorded</th>
              <th scope="col">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {snapshots
              .slice(-count)
              .reverse()
              .map((point) => {
                const previous = previousById.get(point.id);
                const result = outcome(point, previous);
                const expanded = detailId === point.id;
                return (
                  <Fragment key={point.id}>
                    <tr>
                      <td>
                        <span
                          className={`activity-result ${result === "Victory" ? "positive" : result === "Defeat" ? "negative" : ""}`}
                        >
                          {result}
                        </span>
                      </td>
                      <td>
                        {rankLabel(point)}{" "}
                        <span className="muted">
                          {point.tier ? `· ${point.lp} LP` : ""}
                        </span>
                      </td>
                      <td
                        className={
                          point.lpDelta === null
                            ? "muted"
                            : point.lpDelta >= 0
                              ? "positive"
                              : "negative"
                        }
                      >
                        {point.lpDelta === null
                          ? "—"
                          : `${point.lpDelta > 0 ? "+" : ""}${point.lpDelta}`}
                      </td>
                      <td>
                        <time dateTime={point.ts}>
                          {formatDate(point.ts, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </time>
                      </td>
                      <td>
                        <button
                          className="text-action"
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`detail-${point.id}`}
                          onClick={() =>
                            setDetailId(expanded ? undefined : point.id)
                          }
                        >
                          {expanded ? "Close" : "Details"}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr
                        className="activity-detail-row"
                        id={`detail-${point.id}`}
                      >
                        <td colSpan={5}>
                          <div className="activity-detail">
                            <SnapshotDetail point={point} previous={previous} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
      {snapshots.length > count && (
        <button
          type="button"
          className="tracker-button more-activity"
          onClick={() => setCount((value) => value + 20)}
        >
          Show more updates
        </button>
      )}
    </section>
  );
}
