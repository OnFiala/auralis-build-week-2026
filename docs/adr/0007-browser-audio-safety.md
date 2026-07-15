# ADR-0007: Browser audio lifecycle and fail-closed digital safety

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D12
- **Related product commitments:** Controlled playback, low-volume instruction, immediate stop/mute
- **Related risks:** RISK-SAFE-01, RISK-WEB-02–RISK-WEB-03
- **Related vertical-slice criteria:** VS-AC-14–VS-AC-16

## Decision

Apply one immutable fail-closed digital safety policy to every renderer and audible state.

## Context

Invalid samples, uncontrolled transitions or ineffective stop behavior are blocking failures with no safe fallback.

## Decision drivers

User control, deterministic validation, browser lifecycle truth and measurable rejection behavior.

## Chosen option

Require user gesture and low-volume acknowledgement; validate complete rendered buffers; enforce a central output ceiling; use bounded ramps; prioritize stop/mute; and require explicit recovery from suspended/interrupted contexts. An interruption latches application mute or terminates the active source; a browser return to `running` cannot clear that latch without a new explicit user action.

Provisional values are `-6 dBFS` sample peak, 50 ms state-transition ramps, ≤20 ms mute ramp and ≤100 ms observed audible-stop target.

## Reasons

A centralized policy prevents each state or renderer from implementing different safety behavior.

## Rejected alternatives

- **Per-component safety:** rejected because controls can diverge. Reconsider only if a replacement can mechanically prove one invariant safety policy across every audible path.
- **Autoplay or automatic resume:** rejected because browser and user control become unreliable. Reconsider only after an explicit owner decision changes the user-start requirement and browser support is verified.
- **Limiter-only validation:** rejected because it can hide invalid upstream output. Reconsider only if independent upstream validation remains in place, in which case the alternative is no longer limiter-only.
- **Physical safety claim:** rejected because browser samples do not determine ear-level exposure. Reconsider only after production-grade controlled output-chain validation explicitly expands the claim.

## Consequences

- **Positive:** explicit playback gate and measurable failures.
- **Negative:** some transitions may be conservative and quieter.
- **Accepted trade-offs:** numeric limits may change after evidence but cannot be selected after seeing a failure merely to manufacture a pass.

## Risks

Digital controls do not resolve device/output variability. EXP-P3-04 remains blocking before user-facing playback.

## Impact on AI readability

All playable results use one policy and one safety status. Agents do not infer safety from UI state or renderer implementation.

## Impact on testability

Finite samples, peak, duration, transition and stop behavior can be measured. Context suspension and interruption can be injected partly; physical output requires observation.

## Security, privacy and safety impact

Direct material safety impact. No privacy or credential impact.

## Observability and evidence impact

Each validation and stop transition emits attributable evidence with measured values and rejection reasons.

## Conditions for reconsideration

Reconsider numeric controls only when EXP-P3-04 evidence shows they are inadequate or incompatible with a required browser. The fail-closed policy itself remains mandatory.

## Validation required

Worst-case buffer sweep, transition sweep, stop/mute timing and actual Chrome/Safari output-chain evidence.

## Traceability

Product Freeze safety contract; `RISK-SAFE-01`, `RISK-WEB-02`–`RISK-WEB-03`; `VS-AC-14`–`VS-AC-16`; `EXP-P3-04`, `EXP-P3-05`; `P5-D12`; SYSTEM_DESIGN Section 19.
