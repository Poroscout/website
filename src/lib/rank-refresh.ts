import { TrackingError, trackingRequest, type Account } from "./tracking";

export interface CompletedRefresh {
  operationId: string;
  puuid: string;
  status: "succeeded";
  checkedAt: string;
  currentRank: NonNullable<Account["currentRank"]>;
  resetPending: boolean;
}

type PendingRefresh = {
  operationId: string;
  puuid: string;
  statusUrl: string;
} & ({ status: "pending" } | { status: "running" });

type RefreshOperation = CompletedRefresh | PendingRefresh | {
  operationId: string;
  puuid: string;
  status: "failed";
  error: string;
};

function waitForPoll(delay: number, signal: AbortSignal): Promise<void> {
  signal.throwIfAborted();
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  const timer = setTimeout(() => {
    signal.removeEventListener("abort", abort);
    resolve();
  }, delay);
  const abort = () => {
    clearTimeout(timer);
    reject(signal.reason);
  };
  signal.addEventListener("abort", abort, { once: true });
  return promise;
}

/** POST only once; subsequent observations read the durable operation. */
export async function refreshRank({
  puuid,
  operationId,
  signal,
  onAccepted,
}: {
  puuid: string;
  operationId?: string;
  signal: AbortSignal;
  onAccepted: (operationId: string) => void;
}): Promise<CompletedRefresh> {
  let operation = await trackingRequest<RefreshOperation>(
    operationId
      ? `refreshes/${encodeURIComponent(operationId)}`
      : `accounts/${encodeURIComponent(puuid)}/refresh`,
    { method: operationId ? "GET" : "POST", signal },
  );

  if (operation.status === "pending" || operation.status === "running") {
    onAccepted(operation.operationId);
  }
  while (operation.status === "pending" || operation.status === "running") {
    await waitForPoll(1000, signal);
    try {
      operation = await trackingRequest<RefreshOperation>(
        `refreshes/${encodeURIComponent(operation.operationId)}`,
        { signal },
      );
    } catch (error) {
      if (!(error instanceof TrackingError) || error.status !== 429) throw error;
      await waitForPoll(Math.max(1000, error.retryAfter), signal);
    }
  }

  if (operation.status === "failed") {
    throw new TrackingError(502, operation.error);
  }
  return operation;
}
