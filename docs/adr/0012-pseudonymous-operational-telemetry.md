# ADR-0012: Data-minimized pseudonymous operational telemetry

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D16
- **Related product commitments:** Public runtime failures are diagnosable without user tracking
- **Related risks:** RISK-SEC-01–RISK-SEC-02, RISK-DEMO-02, RISK-AI-01
- **Related vertical-slice criteria:** VS-AC-20, VS-AC-22–VS-AC-23, VS-AC-28

## Decision

Emit only allowlisted failure events from the public runtime to deployment logs restricted to authorized project roles whose access is verified before public exposure using an ephemeral per-run identifier. Treat the data as pseudonymous, not anonymous. Telemetry failure never blocks the experience.

## Context

The owner needs to know which step failed after which action, but does not need behavioral tracking or public logs.

## Decision drivers

Operational utility, minimal data, no stable identity, no new datastore and truthful platform-metadata boundaries.

## Chosen option

The client may send event type, step, allowlisted error code, duration bucket and ephemeral run ID. The server validates and writes one structured event to runtime logs restricted to verified authorized project roles.

## Reasons

This provides useful failure sequencing with no analytics platform or durable application store.

## Rejected alternatives

- **Publicly readable logs:** rejected for privacy and security. Reconsider only after explicit owner and privacy/security approval changes the access boundary.
- **Raw prompts, profiles or responses:** rejected as unnecessary sensitive content. Reconsider only if a later approved contract classifies specific fields as non-sensitive and necessary after privacy/security review.
- **Stable user/session analytics:** rejected because cross-session tracking is not required. Reconsider only after an explicit product decision introduces cross-session analytics with required notice, consent and review.
- **No telemetry:** rejected because production-only failures would become opaque. Reconsider if privacy inspection fails or the events provide no material operational value.
- **Full observability platform:** rejected as additional dependency and scope. Reconsider only if minimal logs cannot diagnose material failures and Phase 6 approves the dependency.

## Consequences

- **Positive:** actionable public-runtime failure evidence.
- **Negative:** hosting provider metadata and plan-dependent retention remain.
- **Accepted trade-offs:** log continuity is best effort, not acceptance evidence.

## Risks

Vercel request logs can contain request and User Agent metadata. Abuse and retention need review. Telemetry must not be called anonymous.

## Impact on AI readability

A small allowlist makes side effects explicit. Telemetry cannot mutate product state or become a source of project truth.

## Impact on testability

Payload allowlist, rejection and non-blocking failure can be deterministic. Real retention and owner access require deployed inspection.

## Security, privacy and safety impact

No raw profile, content, media, credential or stable identity is permitted. Query parameters must remain empty of sensitive data.

## Observability and evidence impact

Operational diagnostics complement but do not replace ADR-0011 acceptance evidence.

## Conditions for reconsideration

Remove or replace telemetry if privacy inspection fails, hosting logs expose disallowed data, or the events do not provide material operational value.

## Validation required

Network/log inspection, payload-redaction tests, provider retention review and telemetry-outage behavior.

## Traceability

Product Freeze session/privacy boundary; `RISK-SEC-01`–`RISK-SEC-02`, `RISK-DEMO-02`, `RISK-AI-01`; `VS-AC-20`, `VS-AC-22`, `VS-AC-23`, `VS-AC-28`; `EXP-P3-10`, `EXP-P3-12`, `EXP-P3-15`; `P5-D16`; SYSTEM_DESIGN Sections 24 and 26.
