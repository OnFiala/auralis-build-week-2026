# ADR-0009: Bounded two-stage GPT lifecycle with honest degraded behavior

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D10, P5-D18
- **Related product commitments:** Fresh scene intelligence, grounded explanation, transparent outage and retry
- **Related risks:** RISK-AI-01, RISK-AI-03, RISK-DEMO-01, RISK-DOC-01
- **Related vertical-slice criteria:** VS-AC-17–VS-AC-18, VS-AC-20–VS-AC-21, VS-AC-25, VS-AC-28

## Decision

Use two independent stateless GPT text operations—scene creation after profile confirmation and explanation after verified TV-off output. Make both fail-fast, run/purpose/attempt/grounding-gated and manually retryable, with no hidden retry or cached fallback.

## Context

One early explanation cannot be grounded in a result that does not yet exist. Automatic retries and response reuse would obscure live provenance.

## Decision drivers

Freshness, actual-result grounding, latency visibility, cancellation, truthful degradation and simple evidence.

## Chosen option

Each request has a provisional 15-second hard timeout, current run/purpose/attempt and a purpose-specific grounding revision. Stale results are discarded when relevant grounding changes; an unrelated global revision is audit evidence, not a standalone invalidation condition. Failure produces `Degraded`. Retry is a new explicit attempt.

## Reasons

The two-stage lifecycle matches the real sequence and isolates provider failures from deterministic audio.

## Rejected alternatives

- **One combined early call:** rejected because the explanation would precede the verified result. Reconsider only if an owner-approved product decision removes grounding in verified post-intervention results.
- **Long-lived conversation:** rejected because state and retention become implicit. Reconsider only if a later approved requirement needs conversation state and passes retention/privacy review.
- **Automatic retry:** rejected because latency and live-attempt evidence become ambiguous. Reconsider only after `EXP-P3-10` failure and an owner-approved retry contract keeps every attempt explicit and attributable.
- **Prepared/cached explanation:** rejected because it would create false-live risk. Reconsider only after an explicit owner decision changes the mandatory live-explanation commitment.
- **Background workflow:** rejected because no persistence or callback path is needed. Reconsider only if measured provider/runtime behavior requires asynchronous completion and an owner-approved lifecycle preserves live/degraded truth.

## Consequences

- **Positive:** exact grounding point and honest failure state.
- **Negative:** two external latency opportunities.
- **Accepted trade-offs:** live acceptance may fail while deterministic core remains usable.

## Risks

`xhigh` may miss the p95 gate; availability remains external. This design does not accept or mitigate AI risks.

## Impact on AI readability

Request purposes, inputs, result ownership and failure transitions are explicit. No agent must infer whether content is current.

## Impact on testability

Timeout, stale grounding revision, invalid output, refusal, cancellation and retry can use fakes. Real reliability and latency require twenty fresh calls.

## Security, privacy and safety impact

Requests contain only bounded derived grounding facts. Failures cannot alter deterministic audio or safety policy.

## Observability and evidence impact

Every attempt records purpose, attempt number, model, latency, validation and terminal status.

## Conditions for reconsideration

Reconsider if EXP-P3-10 cannot meet reliability/latency and a simpler owner-approved lifecycle would preserve all live/degraded truth requirements.

## Validation required

Twenty fresh runs, controlled outage, stale-response injection, schema/semantic failures, p95 latency and zero false-live audit.

## Traceability

Product Freeze live/degraded contract; `RISK-AI-01`, `RISK-AI-03`, `RISK-DEMO-01`, `RISK-DOC-01`; `VS-AC-17`, `VS-AC-18`, `VS-AC-20`, `VS-AC-21`, `VS-AC-25`, `VS-AC-28`; `EXP-P3-10`; `P5-D10`, `P5-D18`; SYSTEM_DESIGN Sections 21–23.
