import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { outcome, rankLabel, type Snapshot } from "../../lib/tracking";
import {
  createChartGeometry,
  type ChartAxis,
  type ChartRange,
} from "./lpChartGeometry";
import { useDateFormatter } from "./RankedContext";

export const RANK_COLORS = [
  "#918787",
  "#be8b68",
  "#a5b7cb",
  "#d4b66a",
  "#6ec3c9",
  "#56bc96",
  "#899ff0",
  "#be8fdd",
  "#e07a8b",
  "#e9c777",
];

const POINT_COLORS = {
  victory: "#6cd7ba",
  defeat: "#ef969e",
  unknown: "#e9b86e",
};

export function SnapshotDetail({
  point,
  previous,
}: {
  point: Snapshot;
  previous?: Snapshot;
}) {
  const [copied, setCopied] = useState(false);
  const formatDate = useDateFormatter();
  const result = outcome(point, previous);
  const resultClass =
    result === "Victory" ? "positive" : result === "Defeat" ? "negative" : "";
  const deltaClass =
    point.lpDelta !== null && point.lpDelta >= 0 ? "positive" : "negative";
  const deltaLabel =
    point.lpDelta === null
      ? "—"
      : `${point.lpDelta > 0 ? "+" : ""}${point.lpDelta} LP`;

  async function copyMatchId() {
    if (!point.matchId) return;
    try {
      await navigator.clipboard.writeText(point.matchId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <div className="detail-top">
        <strong className={resultClass}>{result}</strong>
        <span className={deltaClass}>{deltaLabel}</span>
      </div>
      <p className="detail-rank">
        {rankLabel(point)} <span>· {point.lp} LP</span>
      </p>
      <time dateTime={point.ts}>
        {formatDate(point.ts, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </time>
      <p className="detail-record">
        {point.wins}W / {point.losses}L · Season {point.seasonId}
      </p>
      {point.reason === "Ambiguous" && (
        <p className="detail-note">
          Several games between checks. This is their combined LP change.
        </p>
      )}
      {point.reason === "LpAdjustment" && (
        <p className="detail-note">
          LP or rank changed without an observed game.
        </p>
      )}
      {point.reason === "Reset" && (
        <p className="detail-note">
          A starting rank or reset. A new chart segment begins here.
        </p>
      )}
      {point.matchId && (
        <button className="match-copy" type="button" onClick={copyMatchId}>
          {copied ? "Match ID copied" : point.matchId}
          <span aria-hidden="true">{copied ? "✓" : "Copy"}</span>
        </button>
      )}
    </>
  );
}

export default function LPChart({
  snapshots,
  fullSeries,
}: {
  snapshots: Snapshot[];
  fullSeries: Snapshot[];
}) {
  const formatDate = useDateFormatter();
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const [selected, setSelected] = useState<number | null>(null);
  const [pinned, setPinned] = useState(false);
  const [windowRange, setWindowRange] = useState<ChartRange>([0, 1]);
  const [axis, setAxis] = useState<ChartAxis>("games");
  const clip = useId().replaceAll(":", "");
  const drag = useRef<{ x: number; range: ChartRange; moved: boolean } | null>(
    null,
  );

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(320, entry.contentRect.width));
    });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setWindowRange([0, 1]);
    setSelected(null);
    setPinned(false);
  }, [snapshots, axis]);

  const geometry = useMemo(
    () => createChartGeometry(snapshots, width, axis, windowRange),
    [snapshots, width, axis, windowRange],
  );
  // Use the full history so the first point in a filtered view keeps its result.
  const pointColors = useMemo(
    () =>
      new Map(
        fullSeries.map((point, index) => {
          const result = outcome(point, fullSeries[index - 1]);
          const color =
            result === "Victory"
              ? POINT_COLORS.victory
              : result === "Defeat"
                ? POINT_COLORS.defeat
                : POINT_COLORS.unknown;
          return [point.id, color];
        }),
      ),
    [fullSeries],
  );
  const {
    data,
    visible,
    values,
    left,
    right,
    top,
    bottom,
    height,
    plotWidth,
    span,
    minSpan,
    unit,
    x,
    y,
  } = geometry;
  const chosen = selected === null ? undefined : data[selected];
  const chosenX = chosen ? x(chosen.index) : 0;
  const tooltipLeft = Math.max(
    8,
    Math.min(width - 280, chosenX > width / 2 ? chosenX - 276 : chosenX + 16),
  );
  // The predecessor comes from the complete history, not the filtered chart view.
  const previous = chosen
    ? fullSeries[
        fullSeries.findIndex((point) => point.id === chosen.point.id) - 1
      ]
    : undefined;

  function clearSelection() {
    setSelected(null);
    setPinned(false);
  }

  function resetView() {
    setWindowRange([0, 1]);
    clearSelection();
  }

  function nearest(clientX: number) {
    const bounds = container.current!.getBoundingClientRect();
    const target =
      windowRange[0] + ((clientX - bounds.left - left) / plotWidth) * span;
    return data.reduce((best, point) => {
      return Math.abs(unit(point.index) - target) <
        Math.abs(unit(best) - target)
        ? point.index
        : best;
    }, visible[0]?.index ?? 0);
  }

  function zoom(
    factor: number,
    anchor = (windowRange[0] + windowRange[1]) / 2,
  ) {
    const nextSpan = Math.min(1, Math.max(minSpan, span * factor));
    const start = Math.max(0, Math.min(1 - nextSpan, anchor - nextSpan / 2));
    setWindowRange([start, start + nextSpan]);
    clearSelection();
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    const { key } = event;
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) {
      event.preventDefault();
      let next: number;
      if (key === "Home") next = 0;
      else if (key === "End") next = data.length - 1;
      else {
        const direction = key === "ArrowLeft" ? -1 : 1;
        const current = selected ?? (key === "ArrowLeft" ? data.length : -1);
        next = Math.max(0, Math.min(data.length - 1, current + direction));
      }
      setSelected(next);
      setPinned(true);
      if (unit(next) < windowRange[0] || unit(next) > windowRange[1]) {
        setWindowRange([0, 1]);
      }
    } else if (key === "Escape") {
      clearSelection();
    } else if (key === "Enter") {
      event.preventDefault();
      setPinned(!pinned);
    }
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const activeDrag = drag.current;
    if (activeDrag && span < 1) {
      const dragSpan = activeDrag.range[1] - activeDrag.range[0];
      const delta = ((event.clientX - activeDrag.x) / plotWidth) * dragSpan;
      if (Math.abs(event.clientX - activeDrag.x) > 4) activeDrag.moved = true;
      const start = Math.max(
        0,
        Math.min(1 - dragSpan, activeDrag.range[0] - delta),
      );
      setWindowRange([start, start + dragSpan]);
      setSelected(null);
    } else if (!pinned && event.pointerType !== "touch") {
      setSelected(nearest(event.clientX));
    }
  }

  function handlePointerLeave() {
    if (!pinned && !drag.current) setSelected(null);
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    drag.current = { x: event.clientX, range: windowRange, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<SVGSVGElement>) {
    if (!drag.current?.moved) {
      const next = nearest(event.clientX);
      setSelected(next);
      setPinned(!(pinned && selected === next));
    }
    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handlePointerCancel() {
    drag.current = null;
  }

  if (!values.length)
    return (
      <div className="chart-empty">
        <h3>No ranked LP in this view</h3>
        <p>Unranked snapshots are listed below. Try another queue or season.</p>
      </div>
    );

  return (
    <div className="lp-chart">
      <div className="chart-tools">
        <p>
          <span className="series-key" />
          Ranked LP{" "}
          <span className="chart-tool-hint">
            · {snapshots.length} snapshots
          </span>
        </p>
        <div className="chart-tool-buttons">
          <label className="sr-only" htmlFor={`${clip}-axis`}>
            Horizontal axis
          </label>
          <select
            id={`${clip}-axis`}
            value={axis}
            onChange={(event) => setAxis(event.target.value as ChartAxis)}
          >
            <option value="games">By update</option>
            <option value="time">By date</option>
          </select>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={snapshots.length < 6 || span <= minSpan}
            onClick={() => zoom(0.6)}
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            disabled={span === 1}
            onClick={() => zoom(1.6)}
          >
            −
          </button>
          <button type="button" onClick={resetView}>
            Reset view
          </button>
        </div>
      </div>
      <div className="chart-canvas" ref={container}>
        <svg
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label="Interactive ranked LP history. Use left and right arrow keys to inspect snapshots, Enter to pin, Escape to close."
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <defs>
            <clipPath id={clip}>
              <rect x={left} y={top} width={plotWidth} height={bottom - top} />
            </clipPath>
          </defs>
          {geometry.bands.map((band) => (
            <g key={band.tier}>
              <rect
                x={left}
                y={band.top}
                width={plotWidth}
                height={band.height}
                fill={RANK_COLORS[band.colorIndex]}
                opacity={0.065}
              />
              <text
                className="rank-band-name"
                x={width - right - 8}
                y={band.top + 19}
                textAnchor="end"
                fill={RANK_COLORS[band.colorIndex]}
              >
                {band.label}
              </text>
            </g>
          ))}
          {geometry.boundaries.map((boundary) => (
            <g key={boundary.value}>
              <line
                x1={left}
                x2={width - right}
                y1={boundary.y}
                y2={boundary.y}
                stroke={
                  boundary.major ? RANK_COLORS[boundary.colorIndex] : "#7c93a2"
                }
                strokeOpacity={boundary.major ? 0.38 : 0.16}
                strokeDasharray={boundary.major ? undefined : "3 5"}
              />
              <text
                x={left - 12}
                y={boundary.y + 4}
                textAnchor="end"
                className="axis-label"
              >
                {boundary.label}
              </text>
            </g>
          ))}
          <g clipPath={`url(#${clip})`}>
            {geometry.lines.map((line, index) => (
              <path
                key={index}
                d={line}
                stroke="#5edacc"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            ))}
            {visible.map(({ point, index, value }) => {
              const showPoint =
                value !== null &&
                (visible.length < 100 ||
                  point.reason === "Reset" ||
                  index === selected);
              if (!showPoint || value === null) return null;
              const isReset = point.reason === "Reset";
              const color = pointColors.get(point.id) ?? POINT_COLORS.unknown;
              return (
                <circle
                  key={point.id}
                  cx={x(index)}
                  cy={y(value)}
                  r={isReset ? 4.5 : 3}
                  fill={color}
                  stroke="#06121d"
                  strokeWidth="1.5"
                />
              );
            })}
            {chosen && (
              <>
                <line
                  x1={chosenX}
                  x2={chosenX}
                  y1={top}
                  y2={bottom}
                  stroke="#f0e6d2"
                  strokeOpacity="0.5"
                  strokeDasharray="3 4"
                />
                {chosen.value !== null && (
                  <circle
                    cx={chosenX}
                    cy={y(chosen.value)}
                    r="6"
                    fill={pointColors.get(chosen.point.id) ?? POINT_COLORS.unknown}
                    stroke="#010a13"
                    strokeWidth="3"
                  />
                )}
              </>
            )}
          </g>
          {geometry.dateTicks.map((tick) => (
            <text
              key={tick.index}
              x={tick.x}
              y={bottom + 28}
              textAnchor="middle"
              className="axis-label"
            >
              {formatDate(tick.timestamp, { month: "short", day: "numeric" })}
            </text>
          ))}
        </svg>
        {chosen && (
          <div
            className={`chart-tooltip${pinned ? " is-pinned" : ""}`}
            role="status"
            style={{ left: tooltipLeft, top: 48 }}
          >
            <SnapshotDetail
              key={chosen.point.id}
              point={chosen.point}
              previous={previous}
            />
            {pinned && (
              <button
                type="button"
                className="tooltip-close"
                aria-label="Close snapshot detail"
                onClick={clearSelection}
              >
                ×
              </button>
            )}
            <span className="tooltip-help">
              {pinned ? "Pinned · use arrows to move" : "Click or tap to pin"}
            </span>
          </div>
        )}
      </div>
      <div className="chart-caption">
        <span>
          <i className="outcome-dot" style={{ background: POINT_COLORS.victory }} />
          Victory
        </span>
        <span>
          <i className="outcome-dot" style={{ background: POINT_COLORS.defeat }} />
          Defeat
        </span>
        <span>
          <i className="outcome-dot" style={{ background: POINT_COLORS.unknown }} />
          Unknown / reset
        </span>
      </div>
    </div>
  );
}
