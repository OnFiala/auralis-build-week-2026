# ADR-0004: Trusted OpenAI gateway and exact model contract

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D05
- **Related product commitments:** Live GPT-5.6 structured contribution and grounded explanation
- **Related risks:** RISK-AI-01, RISK-AI-03, RISK-SEC-02, RISK-COMP-01
- **Related vertical-slice criteria:** VS-AC-17–VS-AC-18, VS-AC-21–VS-AC-22, VS-AC-28

## Decision

Call exact model `gpt-5.6-sol` through the Responses API from the trusted server using `reasoning.effort: "xhigh"`, strict structured contracts and a server-only OpenAI Platform API key.

## Context

The public browser cannot hold a privileged key. A Codex or ChatGPT subscription is not runtime authentication for the deployed product.

## Decision drivers

Verified model identity, secret isolation, structured output, live provenance and competition truth.

## Chosen option

Use the official Platform API. Do not use the `gpt-5.6` alias, client-side calls, Chat Completions, background state or silent model fallback.

## Reasons

The exact identifier makes runtime proof auditable. Responses supports the selected structured and tool contracts.

## Rejected alternatives

- **Client-side OpenAI calls:** rejected for credential exposure. Reconsider only if an official browser credential mechanism removes privileged-secret exposure and passes security review.
- **Unsuffixed alias:** rejected because routing could obscure the exact runtime model. Reconsider only if exact runtime identifiers become unavailable and the owner approves explicit alias semantics.
- **Codex/ChatGPT account usage:** rejected because it does not authenticate a public application. Reconsider only if OpenAI officially provides deployable public-application authentication for that subscription and the owner approves it.
- **Silent fallback model:** rejected because it creates false-live/model claims. Reconsider only as an explicitly labelled owner-approved model change; never as a silent fallback.

## Consequences

- **Positive:** explicit provider boundary and model provenance.
- **Negative:** usage-based API billing, availability and latency dependency.
- **Accepted trade-offs:** `xhigh` may fail the latency target and therefore remains evidence-gated.

## Risks

Account access, billing, rate limits and latency are unresolved. No live criterion passes until EXP-P3-10.

## Impact on AI readability

The model has exactly two bounded responsibilities and no ownership of deterministic audio truth. Model identifier, purpose and result status are explicit.

## Impact on testability

The provider boundary is mockable; schemas and failures are deterministic. Actual access, model identity and latency require real API evidence.

## Security, privacy and safety impact

The key remains server-only. Prompts exclude raw profile values and arbitrary user text. `store: false` does not establish Zero Data Retention and does not by itself eliminate standard abuse-monitoring retention or eligible prompt caching.

## Observability and evidence impact

Every call records current model ID, request purpose, attempt, response reference, run, purpose-specific grounding revision, latency and validation result without logging content.

## Conditions for reconsideration

Reconsider if official documentation removes required capability, exact model access is unavailable, or `xhigh` cannot satisfy the approved reliability/latency gate. Any replacement requires an owner decision.

## Validation required

Real account/access check, twenty-run reliability evidence, latency distribution, refusal/incomplete cases and secret inspection.

## Traceability

Product Freeze live GPT commitment; `RISK-AI-01`, `RISK-AI-03`, `RISK-SEC-02`, `RISK-COMP-01`; `VS-AC-17`, `VS-AC-18`, `VS-AC-21`, `VS-AC-22`, `VS-AC-28`; `EXP-P3-10`, `EXP-P3-12`, `EXP-P3-17`; `P5-D05`; SYSTEM_DESIGN Sections 11 and 21–24.
