import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  errorMessage,
  playerPath,
  resolveAccount,
  REGIONS,
  TrackingError,
  trackingRequest,
  type Account,
  type History,
  type Snapshot,
  type Subscription,
} from "../../lib/tracking";
import type { RankedPlayerData } from "../../lib/ranked-page";
import { useRankRefresh } from "./useRankRefresh";
import type { CompletedRefresh } from "../../lib/rank-refresh";

interface PlayerTarget {
  riotId: string;
  region: string;
}

interface TrackingTarget extends PlayerTarget {
  untracked: boolean;
}

export interface RankedTrackerProps {
  player?: PlayerTarget;
  invalidRoute?: boolean;
  siteKey: string;
  demoData?: { account: Account; snapshots: Snapshot[] };
  initialData?: RankedPlayerData;
}

interface TrackerController {
  riotId: string;
  setRiotId: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  account?: Account;
  snapshots: Snapshot[];
  updated?: string;
  error: string;
  loading: boolean;
  refreshing: boolean;
  refreshNotice: string;
  coolingDown: boolean;
  startingTracking: boolean;
  trackingTarget?: TrackingTarget;
  token: string;
  setToken: (value: string) => void;
  attempt: number;
  saved: Subscription[];
  storageWarning: string;
  removing: string;
  lookup: (target: PlayerTarget, signal?: AbortSignal) => Promise<void>;
  refresh: () => Promise<void>;
  clearTrackingTarget: () => void;
  promptTracking: () => void;
  startTracking: () => Promise<void>;
  remove: (subscription: Subscription) => Promise<void>;
}

type DateFormatter = (
  timestamp: string,
  options: Intl.DateTimeFormatOptions,
) => string;
export interface RankedState extends TrackerController, RankedTrackerProps {
  demo: boolean;
  currentSaved: boolean;
  canTrack: boolean;
  regionName?: string;
  showIntroduction: boolean;
  formatDate: DateFormatter;
}

const RankedContext = createContext<RankedState | undefined>(undefined);

/** One state owner per island; nothing is shared between players or server requests. */
export function RankedProvider({
  children,
  ...props
}: RankedTrackerProps & { children: ReactNode }) {
  const tracker = useRankedController(props);
  const [localized, setLocalized] = useState(false);
  useEffect(() => setLocalized(true), []);
  const formatDate = useCallback<DateFormatter>(
    (timestamp, options) =>
      new Date(timestamp).toLocaleString(localized ? undefined : "en-US", {
        ...options,
        timeZone: localized ? undefined : "UTC",
      }),
    [localized],
  );
  const { account, saved, trackingTarget, region } = tracker;
  const currentSaved = saved.some(
    (entry) =>
      entry.puuid === account?.puuid && entry.region === account?.region,
  );
  const value: RankedState = {
    ...props,
    ...tracker,
    demo: !!props.demoData,
    currentSaved,
    canTrack: !!account && !currentSaved && !props.demoData && !trackingTarget,
    regionName: REGIONS.find(
      ([, platform]) => platform === (account?.region ?? region),
    )?.[2],
    showIntroduction:
      !account && !props.player && !trackingTarget && !props.invalidRoute,
    formatDate,
  };
  return (
    <RankedContext.Provider value={value}>{children}</RankedContext.Provider>
  );
}

export function useRankedContext() {
  const value = useContext(RankedContext);
  if (!value)
    throw new Error("Ranked components must render within RankedProvider");
  return value;
}

export function useDateFormatter() {
  return useRankedContext().formatDate;
}

function updatePlayerLocation(account: Account) {
  window.history.replaceState(
    null,
    "",
    playerPath(account.ign, account.region),
  );
  document.title = `${account.ign} · Ranked · PoroScout`;
}

function useRankedController({
  player,
  demoData,
  initialData,
}: RankedTrackerProps) {
  const initialPlayer =
    initialData?.status === "ready" ? initialData : undefined;
  const [riotId, setRiotId] = useState(
    initialPlayer?.account.ign ?? player?.riotId ?? "",
  );
  const [region, setRegion] = useState(
    initialPlayer?.account.region ?? player?.region ?? "NA1",
  );
  const [account, setAccount] = useState<Account | undefined>(
    demoData?.account ?? initialPlayer?.account,
  );
  const [snapshots, setSnapshots] = useState<Snapshot[]>(
    demoData?.snapshots ?? initialPlayer?.snapshots ?? [],
  );
  const [updated, setUpdated] = useState(initialPlayer?.checkedAt);
  const [error, setError] = useState(initialPlayer?.error ?? "");
  const [loading, setLoading] = useState(!!player && !initialData);
  const [startingTracking, setStartingTracking] = useState(false);
  const [trackingTarget, setTrackingTarget] = useState<
    TrackingTarget | undefined
  >(
    initialData?.status === "untracked" && player
      ? { ...player, untracked: true }
      : undefined,
  );
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [removing, setRemoving] = useState("");
  const playerVersion = useRef(0);
  const { saved, storageWarning, save, forget } = useSavedTrackers(!demoData);

  const load = useCallback(async (target: Pick<Account, "puuid">, signal?: AbortSignal) => {
    const version = playerVersion.current;
    const history = await trackingRequest<History>(
      `accounts/${encodeURIComponent(target.puuid)}/history`,
      { signal },
    );
    if (version !== playerVersion.current || signal?.aborted) return;
    setSnapshots(history.snapshots);
    setUpdated(new Date().toISOString());
  }, []);

  const lookup = useCallback(
    async (target: PlayerTarget, signal?: AbortSignal) => {
      const version = ++playerVersion.current;
      setLoading(true);
      setError("");
      setTrackingTarget(undefined);
      setToken("");
      setAccount(undefined);
      setSnapshots([]);
      setUpdated(undefined);
      try {
        const resolved = await resolveAccount(
          target.riotId,
          target.region,
          signal,
        );
        if (signal?.aborted || version !== playerVersion.current) return;
        setAccount(resolved);
        setRiotId(resolved.ign);
        setRegion(resolved.region);
        updatePlayerLocation(resolved);
        await load(resolved, signal);
      } catch (err) {
        if (signal?.aborted || version !== playerVersion.current) return;
        if (
          err instanceof TrackingError &&
          err.detail === "account not tracked"
        ) {
          setAccount(undefined);
          setTrackingTarget({ ...target, untracked: true });
        } else {
          setError(errorMessage(err));
        }
      } finally {
        if (!signal?.aborted && version === playerVersion.current)
          setLoading(false);
      }
    },
    [load],
  );

  const initialRiotId = player?.riotId;
  const initialRegion = player?.region;
  useEffect(() => {
    if (!initialRiotId || !initialRegion || initialData) return;
    const controller = new AbortController();
    void lookup(
      { riotId: initialRiotId, region: initialRegion },
      controller.signal,
    );
    return () => controller.abort();
  }, [initialRiotId, initialRegion, initialData, lookup]);

  const applyRefresh = useCallback(
    async (result: CompletedRefresh, signal: AbortSignal) => {
      if (signal.aborted) return;
      setAccount((previous) => previous?.puuid === result.puuid
        ? { ...previous, currentRank: result.currentRank }
        : previous);
      await load({ puuid: result.puuid }, signal);
      if (!signal.aborted) setError("");
    },
    [load],
  );
  const { refresh, refreshing, refreshNotice, coolingDown } = useRankRefresh(
    demoData ? undefined : account?.puuid,
    applyRefresh,
  );

  useEffect(() => {
    if (!account || demoData || startingTracking || refreshing) return;
    const controller = new AbortController();
    const interval = window.setInterval(() => {
      if (!document.hidden) {
        void load(account, controller.signal).catch(() => {
          // Background failures must not replace the existing chart.
        });
      }
    }, 60_000);
    return () => {
      window.clearInterval(interval);
      controller.abort();
    };
  }, [account, load, refreshing, demoData, startingTracking]);

  function clearTrackingTarget() {
    setTrackingTarget(undefined);
    setToken("");
    setError("");
  }

  function promptTracking() {
    if (!account) return;
    setError("");
    setToken("");
    setTrackingTarget({
      riotId: account.ign,
      region: account.region,
      untracked: false,
    });
  }

  async function startTracking() {
    if (!token || startingTracking || !trackingTarget) return;
    const target = trackingTarget;
    playerVersion.current++;
    setStartingTracking(true);
    setError("");
    try {
      const subscription = await trackingRequest<Subscription>(
        "subscriptions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            riotId: target.riotId,
            region: target.region,
            proofOfWork: token,
          }),
        },
      );
      save(subscription);
      setAccount((previous) => {
        if (
          subscription.currentRank !== undefined ||
          !previous ||
          previous.puuid !== subscription.puuid ||
          previous.region !== subscription.region
        ) {
          return subscription;
        }
        return { ...subscription, currentRank: previous.currentRank };
      });
      setSnapshots([]);
      setUpdated(undefined);
      setRiotId(subscription.ign);
      setRegion(subscription.region);
      setTrackingTarget(undefined);
      updatePlayerLocation(subscription);
      // Creating a subscription succeeds independently of the first history read.
      try {
        await load(subscription);
      } catch (err) {
        setError(errorMessage(err));
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setStartingTracking(false);
      setToken("");
      setAttempt((value) => value + 1);
    }
  }

  async function remove(subscription: Subscription) {
    setRemoving(subscription.subscriptionId);
    setError("");
    try {
      try {
        await trackingRequest<void>(
          `subscription/${encodeURIComponent(subscription.subscriptionId)}`,
          { method: "DELETE" },
        );
      } catch (err) {
        if (!(err instanceof TrackingError && err.status === 404)) throw err;
      }
      forget(subscription.subscriptionId);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setRemoving("");
    }
  }

  return {
    riotId,
    setRiotId,
    region,
    setRegion,
    account,
    snapshots,
    updated,
    error,
    loading,
    refreshing,
    refreshNotice,
    coolingDown,
    startingTracking,
    trackingTarget,
    token,
    setToken,
    attempt,
    saved,
    storageWarning,
    removing,
    lookup,
    refresh,
    clearTrackingTarget,
    promptTracking,
    startTracking,
    remove,
  };
}
const STORAGE_KEY = "poroscout:ranked-trackers:v1";
const STORAGE_WARNING =
  "Browser storage is unavailable. Keep this page open to manage this tracker; it won’t be saved after you leave.";

function isSubscription(value: unknown): value is Subscription {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.subscriptionId === "string" &&
    typeof entry.puuid === "string" &&
    typeof entry.ign === "string" &&
    typeof entry.region === "string" &&
    entry.ign.split("#").length === 2 &&
    REGIONS.some(([, platform]) => platform === entry.region)
  );
}

function readSaved(): Subscription[] {
  try {
    const entries: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );
    return Array.isArray(entries) ? entries.filter(isSubscription) : [];
  } catch {
    return [];
  }
}

function useSavedTrackers(enabled: boolean) {
  const [saved, setSaved] = useState<Subscription[]>([]);
  const [storageWarning, setStorageWarning] = useState("");
  const current = useRef(saved);

  useEffect(() => {
    if (!enabled) return;
    function sync() {
      current.current = readSaved();
      setSaved(current.current);
    }
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [enabled]);

  const persist = useCallback(
    (update: (entries: Subscription[]) => Subscription[]) => {
      const entries = update(current.current);
      current.current = entries;
      setSaved(entries);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        setStorageWarning("");
      } catch {
        setStorageWarning(STORAGE_WARNING);
      }
    },
    [],
  );

  const save = useCallback(
    (subscription: Subscription) => {
      persist((entries) => [
        ...entries.filter(
          (entry) =>
            entry.puuid !== subscription.puuid ||
            entry.region !== subscription.region,
        ),
        subscription,
      ]);
    },
    [persist],
  );

  const forget = useCallback(
    (subscriptionId: string) => {
      persist((entries) =>
        entries.filter((entry) => entry.subscriptionId !== subscriptionId),
      );
    },
    [persist],
  );

  return { saved, storageWarning, save, forget };
}
