# ADR-0010: Optional unique scene image through exact gpt-image-2

- **Status:** Accepted
- **Date:** July 15, 2026
- **Decision owners:** Human owner; primary Codex task
- **Related Phase 5 decisions:** P5-D15, P5-D17
- **Related product commitments:** Unique first-person scene imagery without optional-media critical-path dependence
- **Related risks:** RISK-AI-02, RISK-IP-01, RISK-IP-03, RISK-SCENE-01, RISK-TIME-01
- **Related vertical-slice criteria:** VS-AC-07, VS-AC-24, VS-AC-26

## Decision

Every normal run requests a new first-person scene image. GPT-5.6 emits a strict bounded `generate_scene_image` function call; the trusted server validates it and calls the Image API with exact model `gpt-image-2`. Image completion is optional and non-blocking.

## Context

The owner requires unique imagery, while the approved slice requires the core to pass with optional media disabled.

## Decision drivers

Uniqueness, exact model evidence, kill-test compatibility, no stale reuse and deadline protection.

## Chosen option

The live scene text result is returned independently. The scene request forces the named `generate_scene_image` function through explicit `tool_choice`, sets `parallel_tool_calls: false`, and the server rejects zero or multiple calls before invoking exact `gpt-image-2`. A separate bounded image operation may take up to a provisional 120 seconds. Only a current-run result may be displayed. Until required validation passes, a genuine result is labelled `Experimental`; before a genuine result it is hidden or `In preparation`; failure is `unavailable` and non-blocking.

## Reasons

This preserves visual ambition without allowing image latency, moderation or outage to destroy the audio proof.

## Rejected alternatives

- **Image-required completion:** rejected because it violates VS-AC-24. Reconsider only after an explicit owner decision removes the optional-media kill-test constraint.
- **Pregenerated pool:** rejected because it does not satisfy unique-per-run intent. Reconsider only after an explicit owner decision changes the unique-per-normal-run requirement.
- **Stale fallback image:** rejected because it misrepresents provenance. Reconsider only if non-current imagery is explicitly reclassified as prepared media and the owner changes the current-run requirement.
- **Unconstrained prompt/client Image API call:** rejected for secret, cost and content-control risk. Reconsider only if future official client credentials and content controls eliminate current secret, cost and abuse risks and pass security review.
- **Hosted image tool without exact model control:** rejected because the owner chose exact `gpt-image-2`. Reconsider only if official tooling guarantees exact `gpt-image-2` selection and the owner approves the lifecycle change.

## Consequences

- **Positive:** unique imagery in successful normal runs and exact provenance.
- **Negative:** cost, latency, moderation and organization-verification dependency.
- **Accepted trade-offs:** a successful live text run may visibly report image unavailability.

## Risks

Image quality, rights, latency and API access remain unvalidated. Core kill-test evidence is mandatory before exposure.

## Impact on AI readability

Image intent, server validation, provider call and display status are separate. Generated imagery cannot alter source or audio truth.

## Impact on testability

Tool arguments, server rejection, timeout and stale-image behavior can be faked. Actual model access, moderation and image quality require real integration.

## Security, privacy and safety impact

The key remains server-side. Image instructions contain no raw profile or arbitrary user text.

## Observability and evidence impact

Current run, GPT tool-call reference, exact image model, latency and terminal image state are recorded without exporting the image payload.

## Conditions for reconsideration

Reconsider if exact `gpt-image-2` becomes unavailable, the optional-media kill test fails, image latency threatens the proof, or rights/provenance cannot be documented.

## Validation required

Organization access, fresh-image checks, timeout/moderation cases, stale-result rejection, provenance, `EXP-P3-11` and `EXP-P3-14`.

## Traceability

Product Freeze optional-media boundary; `RISK-AI-02`, `RISK-IP-01`, `RISK-IP-03`, `RISK-SCENE-01`, `RISK-TIME-01`; `VS-AC-07`, `VS-AC-24`, `VS-AC-26`; `EXP-P3-11`, `EXP-P3-14`, `EXP-P3-18`; `P5-D15`, `P5-D17`; SYSTEM_DESIGN Sections 12, 21 and 25.
