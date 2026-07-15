# ADR-0013: Four-plane critical-chain testing

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D20
- **Related product commitments:** Every mandatory criterion receives attributable evidence
- **Related risks:** RISK-CRED-01–RISK-CRED-05, RISK-SAFE-01, RISK-WEB-01–RISK-WEB-03, RISK-AI-01–RISK-AI-03, RISK-DEMO-01, RISK-TIME-01
- **Related vertical-slice criteria:** VS-AC-01–VS-AC-33

## Decision

Validate the critical chain through four distinct evidence planes: deterministic core, contract/component with fakes, automated browser, and observed real integration.

## Context

No single test type can prove deterministic audio, live model behavior, actual Safari, physical output and human audibility.

## Decision drivers

Evidence strength, fault localization, browser truth, provider truth, deadline and avoidance of false confidence.

## Chosen option

1. Deterministic tests for profile, reducer, transform plan and buffer metrics.
2. Contract/component tests for schemas, UI and failure behavior with fakes.
3. Automated browser tests using branded Chrome where applicable and Playwright WebKit only as a proxy.
4. Observed real integration in actual stable Chrome and Safari with live OpenAI and the recorded physical output chain.

## Reasons

The planes separate fast repeatable checks from claims that require external reality.

## Rejected alternatives

- **Automation only:** rejected because patched WebKit is not Safari and audio audibility is not proven. Reconsider only if all current human and real-evidence requirements are explicitly superseded by owner-approved equivalent proof.
- **Manual testing only:** rejected because regressions and failure branches become unreliable. Reconsider only if automation cannot produce required repeatability and the owner accepts the resulting regression risk.
- **Playwright WebKit as Safari acceptance:** explicitly rejected by current tool limitations. Reconsider only if the tool becomes branded Safari or official evidence establishes equivalent acceptance behavior.
- **One lucky live run:** rejected by VS-AC-28. Reconsider only after an explicit owner decision changes `VS-AC-28`.
- **End-to-end tests without unit seams:** rejected because failures would be difficult to localize. Reconsider only if the deterministic core and its test seams cease to exist through an approved architecture change.

## Consequences

- **Positive:** clearer evidence and safer change localization.
- **Negative:** dual-browser and live-provider evidence consumes time.
- **Accepted trade-offs:** some tests remain manual and environment-specific.

## Risks

The validation matrix itself increases schedule exposure. A green fake plane cannot upgrade external-service or browser status.

## Impact on AI readability

Each contract states where it is proven and what evidence is authoritative. Agents cannot infer that mock success proves production.

## Impact on testability

Deterministic seams cover state, schemas and render metrics; fakes cover outage and timeout; real evidence covers OpenAI, Safari, Chrome, output and listening. Failure injection is explicit.

## Security, privacy and safety impact

Real evidence must use synthetic profiles, controlled low volume and sanitized artifacts. Secrets are never captured.

## Observability and evidence impact

Every plane produces evidence tied to the same contract IDs. The final integrated bundle must distinguish fake, automated and real observations.

## Conditions for reconsideration

Reconsider only if a named plane cannot produce its required evidence or the first-proof deadline requires an owner-approved narrowing of environment claims.

## Validation required

Execution of the mapped Phase 9/10 tests and experiments; this ADR itself executes none.

## Traceability

Product Freeze success criteria; complete risk coverage is the 37-ID set explicitly enumerated in SYSTEM_DESIGN Section 29: `RISK-PROD-01`–`RISK-PROD-04`, `RISK-CLAIM-01`–`RISK-CLAIM-02`, `RISK-CRED-01`–`RISK-CRED-05`, `RISK-SAFE-01`, `RISK-WEB-01`–`RISK-WEB-03`, `RISK-PERF-01`, `RISK-UX-01`–`RISK-UX-02`, `RISK-AI-01`–`RISK-AI-03`, `RISK-DEMO-01`–`RISK-DEMO-03`, `RISK-SEC-01`–`RISK-SEC-02`, `RISK-COMP-01`–`RISK-COMP-03`, `RISK-IP-01`–`RISK-IP-03`, `RISK-TIME-01`–`RISK-TIME-03`, `RISK-SCENE-01`, `RISK-DOC-01`; `VS-AC-01`–`VS-AC-33`; `EXP-P3-01`–`EXP-P3-18` as applicable; `P5-D20`; SYSTEM_DESIGN Sections 27, 29 and 30.
