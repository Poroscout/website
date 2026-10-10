import { useEffect, useRef, useState } from "react";

interface TurnstileAPI {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

// All mounted widgets share one in-flight script request. A failed load can be retried.
let scriptPromise: Promise<void> | undefined;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = undefined;
        script.remove();
        reject(new Error("Verification unavailable"));
      };
      document.head.append(script);
    });
  }
  return scriptPromise;
}

export default function Turnstile({
  siteKey,
  onToken,
  attempt,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  attempt: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    const updateSize = () => {
      // Turnstile's flexible widget has a 300px minimum width.
      setCompact(element.clientWidth < 300);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [siteKey]);

  useEffect(() => {
    let disposed = false;
    let widget: string | undefined;

    function handleToken(token: string) {
      onToken(token);
      setFailed(false);
    }

    function handleExpiry() {
      onToken("");
    }

    function handleWidgetError() {
      onToken("");
      setFailed(true);
    }

    async function renderWidget() {
      try {
        await loadTurnstile();
        if (disposed || !container.current || !window.turnstile) return;
        widget = window.turnstile.render(container.current, {
          sitekey: siteKey,
          theme: "dark",
          size: compact ? "compact" : "flexible",
          callback: handleToken,
          "expired-callback": handleExpiry,
          "error-callback": handleWidgetError,
        });
      } catch {
        if (!disposed) setFailed(true);
      }
    }

    // Changing an attempt, retry, or size replaces the widget and invalidates its token.
    onToken("");
    setFailed(false);
    if (siteKey) void renderWidget();

    return () => {
      disposed = true;
      if (widget) window.turnstile?.remove(widget);
    };
  }, [siteKey, attempt, retry, onToken, compact]);

  if (!siteKey)
    return (
      <p className="tracker-note">
        Starting new trackers is temporarily unavailable. You can still search
        players who are already tracked.
      </p>
    );

  return (
    <div className="verification">
      <div ref={container} />
      {failed && (
        <p role="alert">
          Verification couldn’t load.{" "}
          <button
            type="button"
            className="text-action"
            onClick={() => setRetry((current) => current + 1)}
          >
            Retry verification
          </button>
        </p>
      )}
    </div>
  );
}
