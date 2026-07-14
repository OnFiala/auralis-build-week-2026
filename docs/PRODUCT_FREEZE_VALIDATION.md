# Auralis Product Freeze Validation

**Status:** Phase 2 validation record  
**Decision date:** July 14, 2026  
**Scope:** Product freeze validation only

## 1. Purpose

This document records the approved Phase 2 interpretation of the frozen Auralis product sources for OpenAI Build Week 2026.

It determines the current product scope, demo scope, non-goals, success criteria, resolved authority overlaps, and explicitly deferred decisions.

It does not replace or modify the frozen product sources. It does not select architecture, technology, dependencies, implementation details, a vertical slice, or a file tree.

## 2. Authority

This validation applies the authority hierarchy defined in `AGENTS.md`:

1. [`OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md`](./OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md)
2. [`Auralis_preparation_final.md`](./Auralis_preparation_final.md)
3. [`AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md`](./AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md)

Verified Official Rules and official program terms remain the highest external authority.

The three source documents remain immutable baseline snapshots. Current explicit owner decisions recorded in the primary Codex task clarify the Build Week scope without retroactively changing those snapshots.

## 3. Product-freeze result

Auralis will be submitted in the `Apps for Your Life` category.

The mandatory Build Week product is one complete and validated Family Experience. It is also the sole main journey used in the submission video.

The wider capability map in the frozen product intent remains a product direction, not a commitment that every capability will be implemented for Build Week.

After the mandatory Family Experience is complete and validated, additional capability work may continue only through the controlled expansion rules in this document.

## 4. Fixed product decisions

The Build Week product retains these frozen decisions:

- Product name: `Auralis`
- Tagline: `See what hearing sounds like.`
- Primary audience: family members, partners, and close people of someone with hearing loss
- Primary journey: `Family Experience`
- Default context: a family dinner from the first-person perspective of a seventy-year-old father
- Default scene: five people, television noise, kitchen activity, and overlapping speech
- Main proof: an honest same-source A/B comparison
- Support proof: one-sided support followed by bilateral support
- Second payoff: a practical environment or communication change
- Final outcome: grounded explanation and at least one non-prescriptive action
- Product boundary: educational and illustrative, not diagnostic, clinical, prescriptive, or device-fitting guidance

The experience uses capability-based language rather than commercial brands, price tiers, or individual benefit claims.

## 5. Required Build Week product scope

### 5.1 Hearing-profile inputs

The mandatory product includes three fully functional synthetic model profiles:

1. `High-frequency hearing loss` — default submission profile
2. `Flat hearing loss`
3. `Asymmetric hearing loss`

These names describe synthetic audiogram configurations only. They do not assert prevalence, cause, diagnosis, prognosis, or suitability for a particular person.

Each model profile must include:

- separate left- and right-ear thresholds;
- a plain-language explanation;
- an explanation of what it can and cannot illustrate;
- an expected audible effect;
- deterministic validation fixtures.

The mandatory product also includes manual audiogram entry.

Manual entry must support:

- separate left- and right-ear values;
- supported standard frequencies;
- conservative input bounds;
- clear handling of missing values;
- explicit user confirmation before use;
- no automatic diagnostic label.

A manually entered audiogram is presented neutrally as user-supplied profile data.

The user input must drive the real transformation logic. It must not merely select the nearest preset, trigger a generic effect, or return a prepared output represented as personalised processing.

Upload of a source audio recording is not part of the mandatory scope.

### 5.2 Family scene

The mandatory journey uses the frozen family-dinner scenario.

GPT-5.6 must create or adapt the scene intent, structured scene, and grounded explanation live on every run.

Validated media components and deterministic transformations may be reused. The product must not present cached intelligence output as live generation.

The exact runtime, endpoints, orchestration, media-generation boundary, and failure architecture are deferred to their required design phases.

### 5.3 Listening comparison

The mandatory comparison sequence is:

1. reference hearing;
2. illustrative hearing-profile state;
3. one-sided modelled support;
4. bilateral modelled support;
5. environmental or communication intervention;
6. grounded explanation.

Reference and transformed states must use the same underlying source scene unless a selected intervention intentionally changes that scene.

Directional support must always have an intentional product state:

- `In preparation` while it does not produce a real result;
- `Experimental` only after it produces a genuine but limited or incompletely validated result;
- `Functional` only after its required validation passes.

### 5.4 Environmental interventions

The mandatory Family Experience includes two functional interventions:

1. turn off the television;
2. move the main speaker closer or place the speaker in front of the listener.

Each intervention must change the relevant audio state, visual state, and grounded explanation consistently.

The submission video is required to demonstrate at least one of these interventions. The exact video selection may be made during demo-script preparation.

### 5.5 Visual proof

Every model profile and manual audiogram path requires both:

- a clearly audible result; and
- an understandable visual representation derived from the actual profile and applied transformation.

The visual proof must help a general audience understand what changed. It must not be a decorative animation disconnected from the input or engine result.

The exact visualization format is deferred to the appropriate design phase.

## 6. Capability-status contract

Every jury-reachable capability must have exactly one truthful state.

### `Functional`

The capability works end to end and has passed its required acceptance checks.

### `Experimental`

The capability produces a real result but has explicit, documented limitations or incomplete validation.

### `In preparation`

The capability does not claim to work. It presents a deliberate, friendly explanation that the capability is being prepared.

An `In preparation` surface must not simulate a successful result or use a placeholder result that could be mistaken for real processing.

The intended jury journey must not terminate in an unhandled `401`, `403`, `404`, broken route, or accidental dead end. This requirement does not weaken authentication, authorization, or correct security behavior. Approved judging access must instead be designed so that the intended route is usable.

Capabilities that cannot meet one of these truthful states must not be exposed to the jury.

## 7. Controlled scope expansion and cutoff

The complete Family Experience must be functional and validated before optional expansion begins.

An additional capability may enter the Build Week product only when:

1. it already exists within the frozen product direction;
2. its scope and acceptance criteria are explicit;
3. it does not weaken the mandatory Family Experience;
4. it does not create an unmitigated compliance, safety, or submission risk;
5. it can be completed and validated before the expansion cutoff.

The hard cutoff for all new capability work is:

**July 20, 2026 at 02:00 CEST**

After the cutoff, only the following work is allowed:

- defect correction;
- reliability and usability hardening;
- validation;
- documentation of actual status;
- demo recording and editing;
- submission preparation;
- removal or truthful relabelling of incomplete exposed surfaces.

No new capability may begin after the cutoff.

## 8. Submission demo scope

The submission video must remain shorter than three minutes and show one coherent Family Experience.

The main video journey uses the `High-frequency hearing loss` model profile.

The video must show:

1. concise educational and AI disclosure;
2. selection of the default model profile;
3. live GPT-5.6 scene creation or adaptation;
4. the family-dinner first-person scene;
5. same-source reference versus hearing-profile A/B;
6. one-sided followed by bilateral support;
7. at least one mandatory environmental intervention;
8. grounded explanation based on the actual result;
9. the final Auralis product statement.

A concise cutaway must also demonstrate that changing manually entered audiogram thresholds produces corresponding real visual and audible changes. It must not run a second complete Family journey.

The required video ends after the grounded explanation and final product statement.

A short, clearly labelled future-direction frame may be added only if time remains and it does not weaken the complete main journey or imply that an unfinished capability is functional.

The video does not return to a broad Hearing Hub or demonstrate incomplete secondary journeys.

## 9. Non-goals

### 9.1 Hard product and safety non-goals

The Build Week product must not provide or claim:

- diagnosis;
- clinical hearing assessment;
- medical advice;
- hearing-aid prescription or fitting;
- exact reproduction of an individual person's perception;
- exact simulation of a commercial hearing device;
- guaranteed or individual benefit;
- commercial brand or price-tier comparison;
- automatic diagnostic interpretation of a manual audiogram;
- system-wide or long-term hearing correction.

### 9.2 Not part of the mandatory Build Week scope

The following are not required for Phase 2 product completion:

- source-audio upload;
- audiogram image or PDF extraction;
- Guided Hearing Check;
- Personal Support Preview;
- native iOS or iPadOS application;
- HealthKit integration;
- system-wide audio processing;
- broad Hearing Hub implementation;
- shareable scene or marketplace functionality;
- clinic workflow;
- lip-sync or arbitrary character animation.

These areas must not be represented as functional unless they later receive explicit scope approval and pass their required validation before the expansion cutoff.

## 10. Success criteria

### 10.1 Product understanding

The experience succeeds when a family member can:

- understand why the selected situation is difficult;
- hear the difference using the same underlying scene;
- compare one-sided and bilateral modelled support;
- understand at least one practical environment or communication change;
- leave with a useful non-prescriptive action.

### 10.2 Input and engine proof

The experience succeeds technically at the product level when:

- all three synthetic profiles produce their intended, distinguishable results;
- valid manual audiogram data changes the real output;
- different valid manual profiles can produce meaningfully different results;
- the output is not a preset lookup presented as personalised processing;
- audible and visual results correspond to the same actual input and transformation;
- deterministic validation fixtures can verify expected transformations;
- reference and comparison states preserve an honest source relationship.

Exact algorithms, thresholds, tolerances, and test implementation are deferred to later phases.

### 10.3 Support and intervention proof

The mandatory journey succeeds when:

- one-sided support produces a real and coherent result;
- bilateral support produces a real and coherent result;
- the transition between them remains understandable;
- turning off the television changes audio and visual activity consistently;
- moving the main speaker changes spatial audio and visual position consistently;
- directional support is labelled according to its actual status.

### 10.4 Live-model proof

The live-model requirement succeeds when GPT-5.6 genuinely creates or adapts the scene intent, scene structure, and grounded explanation during each main run.

The explanation must remain grounded in the actual profile, scene, support state, intervention, and verified transformation result.

A prepared or cached result must not be described as live.

### 10.5 Jury readiness

The product is jury-ready when:

- the mandatory Family Experience is complete end to end;
- every exposed capability has a truthful status;
- the intended judging route contains no accidental dead ends;
- required access works without bypassing security;
- current implementation status is fully documented;
- no visible claim exceeds the evidence;
- the submission video and written description match the actual product.

### 10.6 Submission proof

The submission succeeds at the Phase 2 product-definition level when:

- the main video demonstrates one complete Family Experience;
- the video includes the concise manual-audiogram proof;
- the video remains under three minutes;
- Codex and GPT-5.6 have meaningful and truthfully described roles;
- the app, video, README, repository, and submission text can remain mutually consistent;
- all binding competition requirements remain satisfiable.

## 11. Resolved authority overlaps

### Broad product direction versus Build Week scope

The frozen product intent remains broad. The mandatory Build Week commitment is one complete Family Experience with controlled expansion only after that core passes.

### Reliable demo versus live intelligence

The intelligence path is live on every run. Validated media components and deterministic transformations may be reused.

### Minimal support proof versus broader comparison

One-sided and bilateral support are mandatory. Directional support is visible but may remain `In preparation` or become a genuine `Experimental` capability.

### Model profiles versus manual input

Three synthetic profiles and manual audiogram entry are mandatory. Source-audio upload is not mandatory.

### Short submission video versus product breadth

The video demonstrates the default-profile Family journey and a concise manual-input proof. It does not attempt a second complete journey or broad product tour.

### Hearing-profile terminology

Preset names describe synthetic audiogram configurations. They do not assert prevalence, cause, diagnosis, or applicability to a particular person.

Terminology was checked on July 14, 2026 against:

- [ASHA — Configuration of Hearing Loss](https://www.asha.org/public/hearing/Configuration-of-Hearing-Loss/)
- [ASHA — Hearing Loss in Adults](https://www.asha.org/practice-portal/clinical-topics/hearing-loss/)

## 12. Explicitly deferred decisions

Phase 2 does not decide:

- frontend or backend architecture;
- programming language or framework;
- database or persistence;
- hosting or deployment;
- API and model transport;
- audio-engine implementation;
- model architecture;
- exact audiogram threshold fixtures;
- exact visualization design;
- detailed interaction design;
- final user-facing preparation-state copy;
- dependency selection;
- vertical-slice definition;
- source tree;
- implementation order.

These decisions must occur only in their required project phases.

## 13. Decision ledger

| ID | Decision |
|---|---|
| P2-D01 | Submit under `Apps for Your Life`. |
| P2-D02 | Use a complete Family Experience as the mandatory core, followed by controlled time-bounded expansion. |
| P2-D03 | The main intelligence path runs live on every main journey. |
| P2-D04 | The required video ends after the grounded explanation; a future-direction frame is optional. |
| P2-D05 | Stop all new capability work 48 hours before the submission deadline. |
| P2-D06 | Require three presets and functional manual audiogram entry. |
| P2-D07 | Require one-sided and bilateral support; keep directional support truthfully visible. |
| P2-D08 | GPT-5.6 live-creates or adapts scene intent, structure, and grounded explanation; validated components may be reused. |
| P2-D09 | The custom mandatory input is a manual audiogram, not source-audio upload. |
| P2-D10 | Use general configuration names without prevalence claims. |
| P2-D11 | Use `In preparation` for non-functional directional support and `Experimental` only for a genuine result. |
| P2-D12 | Require both audible and data-derived visual proof. |
| P2-D13 | Use high-frequency, flat, and asymmetric synthetic profiles. |
| P2-D14 | Require television removal and speaker-position interventions. |
| P2-D15 | Include a concise manual-audiogram proof inside the default-profile submission video. |
