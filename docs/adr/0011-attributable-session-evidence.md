# ADR-0011: Attributable in-session evidence and sanitized bundle

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D13, P5-D19
- **Related product commitments:** Complete attributable evidence for every mandatory criterion
- **Related risks:** RISK-CRED-01–RISK-CRED-05, RISK-DEMO-01, RISK-DOC-01, RISK-SEC-01
- **Related vertical-slice criteria:** VS-AC-05, VS-AC-08–VS-AC-19, VS-AC-21–VS-AC-22, VS-AC-29

## Decision

Produce evidence through normal visible proof, an explicit session inspector and a client-generated sanitized per-run bundle, all tied to one run and ordered semantic events.

## Context

Screen recording alone cannot prove source identity, profile use, model grounding or safety validation.

## Decision drivers

Attribution, privacy, human readability, internal truth and no persistence infrastructure.

## Chosen option

Keep an ordered session event log in memory. Show inspectable current references and measurements. Export a sanitized bundle without raw profile values, prompts, model prose or media.

## Reasons

This combines human proof with machine-readable attribution while preserving the session-only boundary.

## Rejected alternatives

- **Screen recording only:** rejected as internally unverifiable. Reconsider only if an owner-approved evidence contract no longer requires internal truth attribution.
- **Raw diagnostic dump:** rejected for privacy and public-safety risk. Reconsider only for a separately approved private evidence surface after privacy/security review; never for public export.
- **Server evidence database:** rejected as unnecessary persistence. Reconsider only after an approved durable-evidence requirement justifies persistence.
- **Assembling unrelated runs:** rejected because integrated truth would be lost. Reconsider only after an explicit owner decision changes the integrated same-run proof requirement.

## Consequences

- **Positive:** auditable state chain and focused evidence.
- **Negative:** capture/bundle handling must remain disciplined.
- **Accepted trade-offs:** exact raw values are visible only during the controlled session, not in export.

## Risks

Redaction could remove too much or too little. Run attribution can still be broken by incorrect event handling.

## Impact on AI readability

Event names, references and terminal results expose actual behavior. Agents can trace cause and effect without reading UI implementation details.

## Impact on testability

Bundle schema, redaction, order and run consistency are deterministic. Human capture and real audible evidence remain manual.

## Security, privacy and safety impact

The export excludes raw profiles, content payloads, secrets and stable identity. Current-session UI may show the current user's own values.

## Observability and evidence impact

This decision creates the canonical acceptance evidence surface. Operational telemetry remains separate under ADR-0012.

## Conditions for reconsideration

Reconsider if VS-AC-29 cannot be proven without sensitive content or if the bundle can combine incompatible runs.

## Validation required

Redaction audit, event-order tests, run consistency, inspector/bundle agreement and complete VS-AC mapping.

## Traceability

Product Freeze evidence contract; `RISK-CRED-01`–`RISK-CRED-05`, `RISK-DEMO-01`, `RISK-DOC-01`, `RISK-SEC-01`; `VS-AC-05`, `VS-AC-08`–`VS-AC-19`, `VS-AC-21`, `VS-AC-22`, `VS-AC-29`; `EXP-P3-01`, `EXP-P3-04`, `EXP-P3-06`–`EXP-P3-10`, `EXP-P3-12`; `P5-D13`, `P5-D19`; SYSTEM_DESIGN Section 26.
