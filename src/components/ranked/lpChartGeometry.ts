import {
  rankSegments,
  rankValue,
  TIERS,
  type Snapshot,
} from "../../lib/tracking";

export type ChartAxis = "games" | "time";
export type ChartRange = [number, number];

const DIVISIONS = ["IV", "III", "II", "I"];

export function createChartGeometry(
  snapshots: Snapshot[],
  width: number,
  axis: ChartAxis,
  windowRange: ChartRange,
) {
  const left = width < 600 ? 76 : 98;
  const right = 24;
  const top = 24;
  const bottom = 378;
  const height = 420;
  const plotWidth = width - left - right;
  const firstTime = snapshots.length ? +new Date(snapshots[0].ts) : 0;
  const lastTime = snapshots.length ? +new Date(snapshots.at(-1)!.ts) : 1;
  const [start, end] = windowRange;
  const span = end - start;

  const data = snapshots.map((point, index) => {
    const position =
      axis === "time" && lastTime !== firstTime
        ? (+new Date(point.ts) - firstTime) / (lastTime - firstTime)
        : snapshots.length > 1
          ? index / (snapshots.length - 1)
          : 0.5;
    return { point, index, value: rankValue(point), position };
  });
  const unit = (index: number) => data[index].position;
  const x = (index: number) =>
    left + ((unit(index) - start) / span) * plotWidth;
  const visible = data.filter(
    ({ position }) => position >= start && position <= end,
  );

  // Include neighbors so lines entering a zoomed viewport use the same scale.
  const scalePoints = data.filter(({ position }, index) => {
    const insideWindow = position >= start && position <= end;
    const entersFromLeft =
      index + 1 < data.length && position < start && unit(index + 1) >= start;
    const exitsToRight = index > 0 && position > end && unit(index - 1) <= end;
    return insideWindow || entersFromLeft || exitsToRight;
  });
  const values = scalePoints.flatMap(({ value }) =>
    value === null ? [] : [value],
  );
  const low = Math.max(
    0,
    Math.floor(((values.length ? Math.min(...values) : 0) - 50) / 100) * 100,
  );
  const high = Math.ceil((Math.max(...values, low + 100) + 50) / 100) * 100;
  const y = (value: number) =>
    bottom - ((value - low) / (high - low)) * (bottom - top);
  const lines = rankSegments(snapshots).map((indices) =>
    indices
      .map((index, position) => {
        const command = position ? "L" : "M";
        return `${command}${x(index).toFixed(2)},${y(data[index].value!).toFixed(2)}`;
      })
      .join(" "),
  );

  // Apex ranks share LP; their leaderboard-dependent boundaries are not supplied by the API.
  const bands = [...TIERS.slice(0, 7), "APEX"].flatMap((tier, index) => {
    const from = Math.max(low, index * 400);
    const to = Math.min(high, index === 7 ? high : (index + 1) * 400);
    return to > from
      ? [
          {
            tier,
            colorIndex: index,
            label: tier === "APEX" ? "MASTER+" : tier,
            top: y(to),
            height: y(from) - y(to),
          },
        ]
      : [];
  });
  const step = high - low > 1600 ? 400 : 100;
  const boundaries = [];
  for (let value = Math.ceil(low / step) * step; value <= high; value += step) {
    const tier = Math.min(7, Math.floor(value / 400));
    boundaries.push({
      value,
      colorIndex: tier,
      major: value % 400 === 0 && value <= 2800,
      y: y(value),
      label:
        value >= 2800
          ? `${value - 2800} LP`
          : `${TIERS[tier][0]}${TIERS[tier].slice(1).toLowerCase()} ${DIVISIONS[(value % 400) / 100]}`,
    });
  }

  const tickCount = width < 600 ? 3 : 6;
  const tickIndices = Array.from(
    new Set(
      Array.from(
        { length: tickCount },
        (_, index) =>
          visible[Math.round((index / (tickCount - 1)) * (visible.length - 1))]
            ?.index,
      ).filter((index) => index !== undefined),
    ),
  );
  const dateTicks = tickIndices.map((index) => ({
    index,
    x: x(index),
    timestamp: snapshots[index].ts,
  }));
  const minSpan = Math.min(1, 4 / Math.max(1, snapshots.length - 1));

  return {
    data,
    visible,
    values,
    lines,
    bands,
    boundaries,
    dateTicks,
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
    hasApexRanks: values.some((value) => value >= 2800),
  };
}
