import { useEffect, useId, useState } from "react";
import { useRankedContext } from "./RankedContext";

export default function RefreshButton() {
  const { refresh, refreshing, refreshNotice, coolingDown } = useRankedContext();
  const tooltipId = useId();
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    setShowNotice(!!refreshNotice);
    if (!refreshNotice) return;
    const timer = window.setTimeout(() => setShowNotice(false), 5000);
    return () => window.clearTimeout(timer);
  }, [refreshNotice]);

  const expanded = refreshing || showNotice;
  const message = refreshing ? "Refreshing… This may take a moment." : refreshNotice;

  return (
    <div className="group relative">
      <button
        type="button"
        disabled={refreshing || coolingDown}
        aria-busy={refreshing}
        aria-describedby={message ? tooltipId : undefined}
        onClick={() => void refresh()}
        className="relative inline-flex min-h-[46px] items-center justify-center gap-2 rounded border border-[#344855] bg-[#0a1a28] px-4 py-2.5 text-sm! font-bold! text-[#d8e3e9] transition-colors hover:border-[#698897] hover:bg-[#132b3b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0ac8b9] disabled:opacity-100!"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M6.1 7a7 7 0 0 1 11.55-1.65L20 8M4 16l2.35 2.65A7 7 0 0 0 17.9 17" />
        </svg>
        Refresh
        {refreshing && (
          <svg
            className="pointer-events-none absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)] overflow-visible text-[#0ac8b9]"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              rx="4"
              pathLength="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="18 82"
              strokeLinecap="round"
              className="h-[calc(100%-2px)] w-[calc(100%-2px)] motion-safe:animate-[refresh-border_1.6s_linear_infinite]"
            />
          </svg>
        )}
      </button>
      <div
        id={tooltipId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`pointer-events-none absolute bottom-[calc(100%+10px)] left-0 z-20 w-56 origin-bottom-left rounded-md bg-[#132b3b] px-3 py-2.5 text-xs! leading-relaxed text-[#d8e3e9] shadow-[0_6px_18px_#0006] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-opacity ${
          expanded
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-1 scale-95 opacity-0"
        } ${message ? "group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100" : ""} motion-reduce:transform-none`}
      >
        {message}
      </div>
    </div>
  );
}
