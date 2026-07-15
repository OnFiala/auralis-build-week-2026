# ADR-0005: Canonical hearing-profile representation and confirmation

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D07
- **Related product commitments:** Three synthetic profiles, manual input, no preset substitution
- **Related risks:** RISK-PROD-02, RISK-CRED-01, RISK-CRED-05, RISK-SEC-01, RISK-CLAIM-02
- **Related vertical-slice criteria:** VS-AC-01–VS-AC-06, VS-AC-30–VS-AC-33

## Decision

Represent every predefined and manual input as one normalized `HearingProfile` containing original separate left/right threshold values, provenance, units, validation, revision and draft/confirmed lifecycle.

## Context

The system must prove that actual values—not a preset label or derived effect—drive the result.

## Decision drivers

Input truth, ear separation, traceability, common downstream processing, novice guidance and session privacy.

## Chosen option

Use one closed frequency grid and bounded dB HL values. Presets load frozen fixtures; manual values remain manual. A derived transformation plan never replaces the profile.

## Reasons

Original values are necessary for traceability and change-specific guidance. One representation prevents preset/manual pipeline divergence.

## Rejected alternatives

- **Nearest-preset mapping:** rejected as false personalization. Reconsider only after an explicit owner decision removes the no-substitution commitment.
- **Store only DSP parameters:** rejected because original input truth becomes unprovable. Reconsider only if attributable evidence can preserve original input truth through another owner-approved canonical representation.
- **Separate preset/manual models:** rejected because downstream behavior can drift. Reconsider only if evidence shows the shared representation cannot truthfully support both approved input classes.
- **Server-canonical profile:** rejected because raw values need not leave the browser. Reconsider only after an approved cross-session requirement and privacy/security review require a trusted-server profile boundary.

## Consequences

- **Positive:** direct input/output trace, one pipeline and clear confirmation gate.
- **Negative:** exact grid, bounds and fixtures require freezing and validation.
- **Accepted trade-offs:** unsupported values are deliberately rejected.

## Risks

A plausible representation does not prove a credible audio mapping. Exact constants remain provisional and `EXP-P3-02` and `EXP-P3-07` remain required.

## Impact on AI readability

There is one profile source of truth. Provenance and lifecycle are explicit. Agents need not infer whether a value came from a preset or manual entry.

## Impact on testability

Fixtures, invalid/missing values, confirmation transitions, distinct manual profiles and no-substitution behavior are deterministic.

## Security, privacy and safety impact

Raw values remain browser memory only. dB HL values are not presented as playback volume or clinical interpretation.

## Observability and evidence impact

Profile reference, revision, source type and ephemeral fingerprint connect edits to transformation results without exporting raw values.

## Conditions for reconsideration

Reconsider if the grid cannot represent all approved fixtures, manual values cannot drive meaningful output, or the representation causes a diagnostic/exactness claim.

## Validation required

EXP-P3-02, EXP-P3-03, EXP-P3-06 and EXP-P3-07.

## Traceability

Product Freeze input contract; `RISK-PROD-02`, `RISK-CRED-01`, `RISK-CRED-05`, `RISK-SEC-01`, `RISK-CLAIM-02`; `VS-AC-01`–`VS-AC-06`, `VS-AC-30`–`VS-AC-33`; `EXP-P3-02`, `EXP-P3-03`, `EXP-P3-06`, `EXP-P3-07`; `P5-D07`; SYSTEM_DESIGN Sections 13–15.
