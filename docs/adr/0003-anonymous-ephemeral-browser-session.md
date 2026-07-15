# ADR-0003: Anonymous ephemeral browser session with no persistence

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D02
- **Related product commitments:** Session-only manual profile; anonymous judge access
- **Related risks:** RISK-PROD-02, RISK-SEC-01–RISK-SEC-02, RISK-DEMO-02
- **Related vertical-slice criteria:** VS-AC-22–VS-AC-23, VS-AC-27

## Decision

Keep the complete session and all raw profile values in browser memory only. Use no account, browser persistence, server session, database or durable model conversation.

## Context

The experience needs one temporary profile and one run. History, accounts and long-term personalization are explicitly out of scope.

## Decision drivers

Privacy, minimum infrastructure, judge accessibility, deterministic cleanup and simple rollback.

## Chosen option

A new tab/run creates a new ephemeral state. Refresh, close or explicit restart destroys raw session data. Server operations are stateless.

## Reasons

Persistence provides no first-slice benefit and creates material privacy, security and delivery risk.

## Rejected alternatives

- **Database-backed sessions:** rejected as unnecessary and privacy-expanding. Reconsider only after an approved future persistence requirement.
- **Browser local/session storage:** rejected because it violates session-only raw-value behavior. Reconsider only after an explicit owner decision supersedes the session-only raw-value boundary.
- **Authenticated accounts:** rejected because judges must not need credentials and no user history is required. Reconsider only after an approved product or judge-access requirement needs identity or cross-session continuity.

## Consequences

- **Positive:** no data migration, simple reset, narrow exposure.
- **Negative:** refresh loses progress and evidence must be exported before leaving.
- **Accepted trade-offs:** no resume/history capability.

## Risks

Provider and hosting request metadata still exist. In-memory browser inspection is possible by the current user. `EXP-P3-07` and `EXP-P3-12` remain required.

## Impact on AI readability

There is one canonical session lifetime and no hidden durable state. Agents do not need to reconcile client, database and provider histories.

## Impact on testability

Refresh/close/reset behavior and storage absence can be inspected deterministically. Network and platform logs require deployed evidence.

## Security, privacy and safety impact

Material privacy improvement. Raw values must not enter URLs, logs, telemetry, evidence bundles or model prompts.

## Observability and evidence impact

Evidence is deliberately session-scoped. The user must export the sanitized bundle before ending the run.

## Conditions for reconsideration

Only an explicit future product decision requiring approved history or cross-session continuity may reopen persistence.

## Validation required

Storage inspection, network/log audit, refresh/reset cases and clean-browser judge runs.

## Traceability

Product Freeze session-only boundary; `RISK-PROD-02`, `RISK-SEC-01`–`RISK-SEC-02`, `RISK-DEMO-02`; `VS-AC-22`, `VS-AC-23`, `VS-AC-27`; `EXP-P3-07`, `EXP-P3-12`, `EXP-P3-15`; `P5-D02`; SYSTEM_DESIGN Sections 11, 14 and 24.
