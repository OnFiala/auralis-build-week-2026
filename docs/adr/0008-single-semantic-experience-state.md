# ADR-0008: Single semantic experience state and derived visible proof

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D06
- **Related product commitments:** Audio/visual synchronization and deliberate terminal states
- **Related risks:** RISK-CRED-02, RISK-PROD-01, RISK-UX-02, RISK-DEMO-01
- **Related vertical-slice criteria:** VS-AC-02, VS-AC-13, VS-AC-19–VS-AC-20, VS-AC-23, VS-AC-25, VS-AC-29

## Decision

Maintain one typed in-memory `ExperienceState` changed only through explicit events and a deterministic reducer. Derive audio selection, visible proof and completion from that state.

## Context

Separate UI, audio and model stores could drift and create decorative or stale evidence.

## Decision drivers

Single source of truth, deterministic replay, attributable transitions, minimal dependency surface and stale-response rejection.

## Chosen option

Events carry run, sequence and revision. Side effects return results as events. `ExperienceState` is the sole canonical owner of intervention and image status; corresponding `SceneState` fields and visible proof are read-only projections. No component-local semantic truth may override the aggregate. Async results also carry a purpose-specific grounding revision so unrelated global-revision changes do not invalidate a valid result.

## Reasons

The state needed by the slice is bounded and can remain explicit without a state-machine dependency.

## Rejected alternatives

- **Independent synchronized stores:** rejected because synchronization itself becomes an unproven system. Reconsider only if reducer evidence fails and a replacement proves atomic cross-surface consistency while retaining one authority.
- **Component-local truth:** rejected because evidence and audio can diverge. Reconsider only after an owner-approved decision removes the single-authority requirement.
- **Statechart runtime dependency:** rejected until reducer complexity proves it necessary. Reconsider only if measured reducer complexity or invalid transitions trigger it.
- **Event sourcing:** rejected because no durable event store is needed. Reconsider only after an approved durable audit or persistence requirement exists.

## Consequences

- **Positive:** deterministic transitions and visible/audio consistency.
- **Negative:** reducer discipline and explicit event design are required.
- **Accepted trade-offs:** all state changes are slightly more formal.

## Risks

A poorly defined reducer can still admit impossible states. State-transition tests and runtime invariants remain required.

## Impact on AI readability

Canonical fields, events and side effects are explicit. Agents can localize changes and need not infer which store wins.

## Impact on testability

Event sequences, stale results, completion and visible derivation can be tested deterministically. Browser timing remains integration evidence.

## Security, privacy and safety impact

Raw state remains browser memory. Safety state can block playback centrally.

## Observability and evidence impact

The ordered event sequence is the backbone of attributable evidence and synchronization timing.

## Conditions for reconsideration

Reconsider the mechanism only if the reducer cannot represent required states without invalid transition complexity or evidence gaps. Any replacement must preserve one semantic authority.

## Validation required

Reducer invariants, stale-event rejection, visible/audio alignment and full journey traces.

## Traceability

Product Freeze visible-state truth; `RISK-CRED-02`, `RISK-PROD-01`, `RISK-UX-02`, `RISK-DEMO-01`; `VS-AC-02`, `VS-AC-13`, `VS-AC-19`, `VS-AC-20`, `VS-AC-23`, `VS-AC-25`, `VS-AC-29`; `EXP-P3-01`, `EXP-P3-06`, `EXP-P3-13`; `P5-D06`; SYSTEM_DESIGN Sections 14 and 20.
