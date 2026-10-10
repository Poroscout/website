import { RankCrest } from "./PlayerHeader";
import RankedHistory from "./RankedHistory";
import { PlayerSearch, SavedTrackers, TrackingPrompt } from "./TrackerControls";
import {
  RankedProvider,
  useRankedContext,
  type RankedTrackerProps,
} from "./RankedContext";
import "../../styles/ranked.css";

export default function RankedTracker(props: RankedTrackerProps) {
  return (
    <RankedProvider {...props}>
      <RankedPage />
    </RankedProvider>
  );
}

function RankedPage() {
  const tracker = useRankedContext();
  const {
    account,
    loading,
    trackingTarget,
    saved,
    invalidRoute,
    demo,
    regionName,
    showIntroduction,
  } = tracker;

  return (
    <main className="ranked-shell">
      {account && (
        <div className="ranked-breadcrumb">
          <a href="/ranked">Ranked tracker</a>
          <span aria-hidden="true">/</span>
          <span>{regionName}</span>
        </div>
      )}
      {demo && (
        <div className="demo-banner">
          <div>
            <strong>Graph playground</strong>
            <p>
              This player and all game records are simulated. Try Flex for the
              Master+ LP scale.
            </p>
          </div>
          <a href="/ranked" className="tracker-button">
            Find a real player <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
      {showIntroduction && (
        <header className="tracker-intro">
          <RankCrest />
          <div>
            <h1>Your climb, in perspective.</h1>
            <p className="text-balance">
              Follow your ranked LP in Solo/Duo and Flex over time, we will
              track every win and loss.
            </p>
          </div>
        </header>
      )}
      {invalidRoute ? (
        <div className="tracker-empty">
          <h1>That player link doesn’t look right.</h1>
          <p>
            Search with a full Riot ID and League region to find their ranked
            history.
          </p>
          <a className="tracker-button primary" href="/ranked">
            Find a player
          </a>
        </div>
      ) : (
        <>
          {!demo && <PlayerSearch />}
          {tracker.error && (
            <div className="tracker-alert" role="alert">
              {tracker.error}
              {account && (
                <button
                  className="text-action"
                  type="button"
                  disabled={tracker.refreshing || tracker.coolingDown}
                  onClick={() => void tracker.refresh()}
                >
                  Retry
                </button>
              )}
            </div>
          )}
          {tracker.storageWarning && (
            <p className="tracker-alert" role="alert">
              {tracker.storageWarning}
            </p>
          )}

          {trackingTarget && <TrackingPrompt />}
          {loading && (
            <div className="tracker-loading" role="status">
              <span>Loading ranked history…</span>
              <div className="loading-chart" />
            </div>
          )}
          {account && !loading && <RankedHistory />}
          {saved.length > 0 && <SavedTrackers />}
          {showIntroduction && !loading && (
            <section className="tracker-explainer">
              <div className="explainer-line">
                <svg
                  viewBox="0 0 80 36"
                  width="80"
                  height="36"
                  fill="none"
                  stroke="#5edacc"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path
                    d="M1 29h78"
                    stroke="#c8aa6e"
                    strokeOpacity=".4"
                    strokeDasharray="3 4"
                  />
                  <path d="m2 28 12-5 10 3 12-12 10 4 14-10 17-5" />
                  <circle cx="77" cy="3" r="2.5" fill="#5edacc" />
                </svg>
                <p>A little perspective between queues.</p>
              </div>
              <p>
                See where you crossed a division, inspect each recorded change,
                and share your progress across both Solo/Duo and Flex queue.
              </p>
              <p className="tracker-note">
                Search a player to start tracking. We run periodic checks, so
                latest games may take a while to appear.
              </p>
              <a href="/ranked/demo" className="text-action demo-link">
                Try the graph with demo data <span aria-hidden="true">→</span>
              </a>
            </section>
          )}
        </>
      )}
    </main>
  );
}
