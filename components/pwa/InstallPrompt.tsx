"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "funday-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as Navigator & { standalone?: boolean }).standalone);

    setStandalone(!!standaloneMode);

    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIos(ios);

    if (standaloneMode || dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (ios && !standaloneMode) {
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  }

  if (!visible || standalone) return null;

  return (
    <div
      className="fixed left-4 right-4 top-[4.5rem] z-[60] mx-auto max-w-lg rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-lg"
      role="dialog"
      aria-label="Install app"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-sage)]/20">
          <Download className="h-5 w-5 text-[var(--color-sage-dark)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Install Fun Day Planner</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {isIos && !deferred
              ? "Tap Share, then “Add to Home Screen” to use the app like a native app."
              : "Add to your home screen for quick access — works offline for your saved data."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {deferred ? (
              <Button className="min-h-10" onClick={install}>
                Install app
              </Button>
            ) : null}
            <Button variant="secondary" className="min-h-10" onClick={dismiss}>
              Not now
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg p-1 text-[var(--color-muted)]"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
