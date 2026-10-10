import { useCallback, useEffect, useRef, useState } from "react";
import { refreshRank, type CompletedRefresh } from "../../lib/rank-refresh";
import { errorMessage, TrackingError } from "../../lib/tracking";

function savedOperation(puuid: string, operationId?: string | null) {
  const key = `poroscout:rank-refresh:${puuid}`;
  try {
    if (operationId === null) localStorage.removeItem(key);
    else if (operationId !== undefined) localStorage.setItem(key, operationId);
    else return localStorage.getItem(key) ?? undefined;
  } catch { /* Refresh still works when browser storage is unavailable. */ }
}

/** Cancelling observation never cancels the server's accepted refresh. */
export function useRankRefresh(
  puuid: string | undefined,
  onCompleted: (result: CompletedRefresh, signal: AbortSignal) => Promise<void>,
) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState("");
  const [coolingDown, setCoolingDown] = useState(false);
  const request = useRef<AbortController | undefined>(undefined);
  const retryAt = useRef(0);
  const cooldownTimer = useRef<number | undefined>(undefined);

  const refresh = useCallback(async () => {
    if (!puuid || request.current || Date.now() < retryAt.current) return;
    const controller = new AbortController();
    request.current = controller;
    setRefreshing(true);
    setRefreshNotice("");
    try {
      const result = await refreshRank({
        puuid,
        operationId: savedOperation(puuid),
        signal: controller.signal,
        onAccepted: (id) => savedOperation(puuid, id),
      });
      savedOperation(puuid, null);
      await onCompleted(result, controller.signal);
      if (!controller.signal.aborted) {
        setRefreshNotice(result.resetPending
          ? "Ranks refreshed. History is awaiting a confirming check."
          : "Ranks and history are up to date.");
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof TrackingError) {
        if ([400, 404, 502].includes(error.status)) savedOperation(puuid, null);
        if (error.status === 429) {
          const delay = Math.max(1000, error.retryAfter);
          retryAt.current = Date.now() + delay;
          setCoolingDown(true);
          cooldownTimer.current = window.setTimeout(() => setCoolingDown(false), delay);
          setRefreshNotice(`Please wait ${Math.ceil(delay / 1000)} seconds before refreshing again.`);
          return;
        }
      }
      setRefreshNotice(error instanceof TrackingError && error.status === 404
        ? "This account is no longer tracked. Track the player to refresh."
        : "Refresh failed. " + errorMessage(error));
    } finally {
      if (request.current === controller) {
        request.current = undefined;
        setRefreshing(false);
      }
    }
  }, [puuid, onCompleted]);

  useEffect(() => {
    setRefreshing(false);
    setRefreshNotice("");
    setCoolingDown(false);
    retryAt.current = 0;
    if (puuid && savedOperation(puuid)) void refresh();
    return () => {
      request.current?.abort();
      request.current = undefined;
      clearTimeout(cooldownTimer.current);
    };
  }, [puuid, refresh]);

  return { refresh, refreshing, refreshNotice, coolingDown };
}
