# ADR-0001: Client-centric single-deployment topology and supported environment

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D01, P5-D04, P5-D14
- **Related product commitments:** One public Family Experience; real browser audio; anonymous judge access
- **Related risks:** RISK-WEB-01–RISK-WEB-03, RISK-DEMO-01–RISK-DEMO-02, RISK-SEC-02, RISK-TIME-01–RISK-TIME-03
- **Related vertical-slice criteria:** VS-AC-23, VS-AC-26–VS-AC-27, VS-AC-30

## Decision

Use one client-centric web application in one Vercel project. The browser owns canonical interaction state, deterministic audio and visible proof; Node.js Route Handlers form the minimal trusted boundary. Actual stable Chrome and Safari on the same recorded macOS and wired output chain are mandatory first-proof environments.

## Context

The slice needs browser audio, a server-only OpenAI key, public judge access and simple rollback before July 18. It does not need durable data or multiple deployables.

## Decision drivers

Maximum slice coverage, minimum latency and infrastructure, explicit secret boundary, honest browser evidence and reversible deployment.

## Chosen option

One Next.js application and one production URL. No authentication, database, second backend or media-processing service.

## Reasons

Audio remains close to the user and source buffers. The server remains small and auditable. Deployment and rollback have one unit. Dual-browser evidence follows the owner’s stricter validation decision.

## Rejected alternatives

- **Server-centric audio:** rejected for transfer, latency, privacy and backend complexity. Reconsider only if browser rendering fails `VS-AC-05`, `VS-AC-08`–`VS-AC-12` or `VS-AC-15`.
- **Distributed/streaming system:** rejected for coordination and deadline risk. Reconsider only if an approved future slice requires realtime remote processing.
- **Chrome-only first proof:** lower risk but rejected by P5-D14. Reconsider only through an owner recovery decision if the deadline becomes unreachable.

## Consequences

- **Positive:** one deployment, local audio, simple rollback, clear trust boundary.
- **Negative:** browser variance and two mandatory real-browser runs.
- **Accepted trade-offs:** increased `RISK-WEB-01`–`RISK-WEB-03` and `RISK-TIME-01`–`RISK-TIME-03` exposure; anonymous endpoint abuse remains possible.

## Risks

The design exposes browser compatibility and public-endpoint risk but does not mitigate them. Required validation: `EXP-P3-04`, `EXP-P3-05`, `EXP-P3-12`, `EXP-P3-15` and `EXP-P3-18`.

## Impact on AI readability

Runtime ownership is explicit: browser, trusted server and external provider. There is one deployable system and no implicit second backend. Provider configuration remains external and must be recorded.

## Impact on testability

Browser core can be tested locally; trusted handlers can use provider fakes. Branded Chrome can be automated. Actual Safari, physical output and rollback require observed integration evidence. Failure can be injected at the server boundary.

## Security, privacy and safety impact

Secrets remain server-side. Anonymous access avoids judge credentials but requires bounded requests, spend/rate controls and public-route review.

## Observability and evidence impact

One deployment and run identity simplify correlation. Environment, deployment and output-chain evidence must be recorded for every acceptance run.

## Conditions for reconsideration

Reconsider if actual Chrome or Safari cannot satisfy a named blocking criterion, Vercel cannot support the required runtime/rollback, or the July 18 deadline becomes unreachable.

## Validation required

EXP-P3-04, EXP-P3-05, EXP-P3-12, EXP-P3-15 and deployment rollback evidence.

## Traceability

Product Freeze Family Experience; `RISK-WEB-01`–`RISK-WEB-03`, `RISK-DEMO-01`–`RISK-DEMO-02`, `RISK-SEC-02`, `RISK-TIME-01`–`RISK-TIME-03`; `VS-AC-23`, `VS-AC-26`–`VS-AC-27`, `VS-AC-30`; `EXP-P3-04`, `EXP-P3-05`, `EXP-P3-12`, `EXP-P3-15`, `EXP-P3-18`; `P5-D01`, `P5-D04`, `P5-D14`; SYSTEM_DESIGN Sections 6, 8–11 and 28.
