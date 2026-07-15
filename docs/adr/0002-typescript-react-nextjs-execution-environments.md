# ADR-0002: TypeScript, React and Next.js App Router execution environments

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D03
- **Related product commitments:** One coherent browser experience with a trusted model boundary
- **Related risks:** RISK-PROD-01, RISK-DEMO-01, RISK-WEB-01, RISK-TIME-01
- **Related vertical-slice criteria:** VS-AC-23, VS-AC-26, VS-AC-29

## Decision

Use strict TypeScript, React and Next.js App Router for the browser application and Node.js trusted Route Handlers.

## Context

The slice needs typed shared contracts, an interactive stateful browser experience and server-side OpenAI calls without a separate backend deployment.

## Decision drivers

Contract clarity, one language across trust boundaries, browser/platform compatibility, fast deployment and low operational overhead.

## Chosen option

A single TypeScript application using React for UI and Next.js App Router for browser/server composition. Exact versions and incidental libraries remain Phase 6 decisions.

## Reasons

The choice supports one deployable unit, shared contract vocabulary and a direct trusted server boundary while minimizing framework count.

## Rejected alternatives

- **Separate SPA and backend:** rejected because it adds deployment and contract duplication. Reconsider only if one deployment cannot satisfy the trusted boundary.
- **Different full-stack framework:** no present evidence of superior slice coverage. Reconsider if Next.js blocks required runtime behavior.
- **Framework-free application:** rejected because routing, server boundary and deployment work would increase deadline risk. Reconsider only if the selected framework itself becomes the verified blocker for the required runtime or deadline.

## Consequences

- **Positive:** one language, explicit types, integrated server handlers.
- **Negative:** framework runtime behavior and client/server distinctions must be handled carefully.
- **Accepted trade-offs:** framework-specific constraints in exchange for faster first proof.

## Risks

The choice may expose framework/runtime or bundle issues. It does not validate browser audio or model behavior. Validation remains required.

## Impact on AI readability

Contracts can use one terminology across browser and server. Execution environment must remain explicit so agents do not import server-only behavior into client code. Phase 6 must preserve these boundaries.

## Impact on testability

Pure TypeScript contracts and reducer behavior are deterministic. React UI can use component tests. Route Handlers can use provider fakes. Real deployment behavior remains an integration test.

## Security, privacy and safety impact

Server-only code must never be included in the client bundle. Environment-variable handling and response validation remain mandatory.

## Observability and evidence impact

Typed event and response contracts reduce ambiguous evidence. Framework logs are not canonical acceptance evidence.

## Conditions for reconsideration

Reconsider if the selected current Next.js runtime cannot provide required Node handlers, secret isolation, browser delivery or Vercel deployment behavior.

## Validation required

Build/type validation in later phases, client-bundle secret inspection, handler contract tests and deployed smoke evidence.

## Traceability

Product Freeze Family Experience; `RISK-PROD-01`, `RISK-DEMO-01`, `RISK-WEB-01`, `RISK-TIME-01`; `VS-AC-23`, `VS-AC-26`, `VS-AC-29`; `EXP-P3-01`, `EXP-P3-05`, `EXP-P3-12`; `P5-D03`; SYSTEM_DESIGN Sections 6, 9–10 and 34.
