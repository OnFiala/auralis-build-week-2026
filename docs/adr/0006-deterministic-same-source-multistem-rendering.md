# ADR-0006: Deterministic same-source multi-stem rendering and support semantics

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D08, P5-D09, P5-D11
- **Related product commitments:** Same-source A/B, actual profile transform, one-sided/bilateral support, television-off
- **Related risks:** RISK-CRED-01, RISK-CRED-03–RISK-CRED-05, RISK-WEB-03, RISK-IP-02, RISK-SCENE-01
- **Related vertical-slice criteria:** VS-AC-07–VS-AC-12, VS-AC-19, VS-AC-31

## Decision

Decode one synchronized multi-stem source package in the browser and deterministically render reference, hearing-profile, left-one-sided, bilateral and television-off results through one versioned renderer contract. Use standard Web Audio nodes first and permit AudioWorklet only after named evidence requires it.

## Context

The proof fails if sources change, support is decorative, TV-off is fake or output differs only by level.

## Decision drivers

Source identity, determinism, channel control, objective evidence, browser feasibility and deadline.

## Chosen option

Use a manifest with aligned stems and hashes. Render session buffers through `OfflineAudioContext`; play only validated results through one controlled audible context. Determinism is scoped to the recorded browser/runtime, sample rate, render backend and algorithm version; cross-browser evidence uses declared numerical tolerances rather than bitwise equality.

## Reasons

Multistem media permits real TV removal while keeping one source identity. Offline rendering makes buffers measurable and repeatable. The renderer contract preserves an AudioWorklet escalation path without paying its cost prematurely.

## Rejected alternatives

- **Server rendering:** rejected for latency, transfer and privacy. Reconsider only if recorded browser evidence fails named rendering, timing or safety criteria.
- **Single mixed file:** rejected because TV removal cannot be proven. Reconsider only if a validated source contract can prove the television intervention without separable contributions.
- **Different prepared files per state:** rejected because same-source truth becomes unverifiable. Reconsider only after an explicit owner decision changes the same-source requirement.
- **Mandatory AudioWorklet:** rejected before evidence shows standard nodes are insufficient. Reconsider only if standard nodes fail a named acceptance, timing, evidence or safety criterion.
- **AudioWorklet prohibition:** rejected because custom DSP may be required. Reconsider only after all named browser evidence passes without custom DSP and the escalation path is no longer required.
- **Live ambient generation:** rejected from the critical path. Reconsider only in a later approved slice after the optional-service kill test and deadline review.

## Consequences

- **Positive:** explicit source identity, real intervention, measurable buffers.
- **Negative:** asset preparation and cross-browser graph behavior remain material.
- **Accepted trade-offs:** audio is demonstration-level and requires controlled listening evidence.

## Risks

Credibility, browser parity and asset rights remain unresolved. The architecture exposes these risks early but does not mitigate them.

## Impact on AI readability

Source, plan, renderer and result identities are explicit. GPT has no ownership of transformation. Backend escalation remains behind one contract.

## Impact on testability

Known fixtures can produce deterministic buffers and band metrics. Provider calls are absent. Actual audibility, Safari behavior and physical playback require real evidence.

## Security, privacy and safety impact

No audio upload occurs. Every result still passes ADR-0007 safety policy before playback.

## Observability and evidence impact

Manifest hash, transformation identity, state and objective metrics make same-source and support claims attributable.

## Conditions for reconsideration

Reconsider if standard nodes fail `VS-AC-09`–`VS-AC-12` or `VS-AC-15`, the source package cannot preserve identity/TV removal, or actual Safari cannot render the selected graph.

## Validation required

`EXP-P3-01`, `EXP-P3-02`, `EXP-P3-04`, `EXP-P3-05`, `EXP-P3-07`, `EXP-P3-08`, `EXP-P3-09`, `EXP-P3-11` and `EXP-P3-14`.

## Traceability

Product Freeze comparison, support and intervention commitments; `RISK-CRED-01`, `RISK-CRED-03`–`RISK-CRED-05`, `RISK-WEB-03`, `RISK-IP-02`, `RISK-SCENE-01`; `VS-AC-07`–`VS-AC-12`, `VS-AC-19`, `VS-AC-31`; `EXP-P3-01`, `EXP-P3-02`, `EXP-P3-04`, `EXP-P3-05`, `EXP-P3-07`, `EXP-P3-08`, `EXP-P3-09`, `EXP-P3-11`, `EXP-P3-14`; `P5-D08`, `P5-D09`, `P5-D11`; SYSTEM_DESIGN Sections 16–19.
