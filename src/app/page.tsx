"use client";

import { useState } from "react";

type CheckState = "idle" | "checking" | "ready" | "unavailable";

const statusText: Record<CheckState, string> = {
  idle: "System status has not been checked.",
  checking: "Checking system status…",
  ready: "System status: ready.",
  unavailable: "System status: unavailable.",
};

function isExpectedHealthResponse(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const health = value as Record<string, unknown>;
  return (
    Object.keys(health).length === 3 &&
    health.status === "ok" &&
    health.service === "auralis-shell" &&
    health.phase === "9-walking-skeleton"
  );
}

export default function HomePage() {
  const [checkState, setCheckState] = useState<CheckState>("idle");

  async function checkSystemStatus() {
    setCheckState("checking");

    try {
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const payload: unknown = await response.json();

      if (!response.ok || !isExpectedHealthResponse(payload)) {
        throw new Error("Unexpected health response");
      }

      setCheckState("ready");
    } catch {
      setCheckState("unavailable");
    }
  }

  return (
    <main>
      <section aria-labelledby="auralis-heading">
        <p className="eyebrow">OpenAI Build Week 2026</p>
        <h1 id="auralis-heading">Auralis</h1>
        <p className="tagline">See what hearing sounds like.</p>
        <p>This is the executable system shell.</p>
        <p>The hearing experience is not implemented yet.</p>

        <button
          type="button"
          onClick={checkSystemStatus}
          disabled={checkState === "checking"}
        >
          {checkState === "checking" ? "Checking…" : "Check system status"}
        </button>

        <p className={`status status-${checkState}`} role="status" aria-live="polite">
          {statusText[checkState]}
        </p>
      </section>
    </main>
  );
}
