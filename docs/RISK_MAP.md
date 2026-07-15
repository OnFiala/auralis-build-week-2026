# Auralis Risk Map

**Status:** Approved and published Phase 3 risk map  
**Assessment date:** July 14, 2026  
**Phase-gate approval:** Approved by the human owner on July 14, 2026  
**Evidence state:** Risk identification and experiment design only; no listed experiment has yet been executed  
**Scope:** OpenAI Build Week 2026 Family Experience

## 1. Purpose and scope

This document records the material uncertainties that could prevent Auralis from:

- satisfying the approved product freeze;
- delivering a credible, safe and understandable educational result;
- operating reliably in its claimed browser and device environments;
- completing the mandatory Family Experience on time;
- surviving live judging and submitted-video playback;
- satisfying competition, security, licensing and public-claim requirements.

It defines risk classifications, evidence requirements, validation experiments, fallbacks, decision deadlines, owners and phase-gate consequences.

It does not select a vertical slice, architecture, technology stack, dependency, model identifier, audio algorithm, deployment platform, source tree or implementation plan. Experiments defined here are future acceptance work and have not been executed in Phase 3.

## 2. Authority

This risk map applies the project authority hierarchy defined in `AGENTS.md` and uses:

1. current verified Official Rules and official program sources;
2. `docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md`;
3. `docs/Auralis_preparation_final.md`;
4. `docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md`;
5. `docs/PRODUCT_FREEZE_VALIDATION.md`;
6. `AGENTS.md`;
7. explicit Phase 3 owner decisions recorded in the primary Codex task.

`docs/PRODUCT_FREEZE_VALIDATION.md` remains the canonical current Build Week product scope. This document identifies uncertainty around that scope; it does not redefine it.

The three baseline documents, `docs/PRODUCT_FREEZE_VALIDATION.md`, `AGENTS.md`, `README.md`, and `.gitignore` remain protected and unchanged.

## 3. External evidence reviewed

All sources below were accessed on July 14, 2026.

| Source | What it supports | What it does not establish | Decision impact |
|---|---|---|---|
| [OpenAI Build Week Official Rules](https://openai.devpost.com/rules) | Eligibility, deadline, repository/access, licensing, submission and judging obligations | That the future submission package is complete | Requires repeated submission audit. |
| [OpenAI Build Week FAQ](https://openai.devpost.com/details/faqs) | Current program and submission guidance | Future rule stability | Recheck before submission. |
| [OpenAI Build Week overview](https://openai.devpost.com/) | Current public program dates and category context | Product eligibility by itself | Supports schedule boundaries. |
| [GPT-5.6 Sol documentation](https://developers.openai.com/api/docs/models/gpt-5.6-sol) | Current GPT-5.6 output/tool capabilities, including hosted image-generation tool support | A general hosted sound-effects generation capability or Auralis runtime reliability | Exact media boundary remains deferred. |
| [OpenAI image-generation guide](https://developers.openai.com/api/docs/guides/image-generation) | Current image-generation API/tool behavior and `gpt-image-2` availability | That a specific image model is always directly selected by a GPT-5.6 hosted tool call | Live media generation remains optional. |
| [OpenAI audio guide](https://developers.openai.com/api/docs/guides/audio) | Current speech/audio model families and API patterns | A verified general sound-scene generation tool directly invoked by GPT-5.6 | Exact sound-generation capability needs later verification. |
| [OpenAI Usage Policies](https://openai.com/policies/usage-policies/) | Current policy boundaries relevant to health-related output | Clinical validity or regulatory clearance | Public claims remain educational and non-clinical. |
| [Web Audio API specification](https://www.w3.org/TR/webaudio-1.1/) | Browser audio-processing and lifecycle semantics | Consistent behavior across all devices and output chains | Requires observed environment evidence. |
| [Chrome Web Audio autoplay guidance](https://developer.chrome.com/blog/web-audio-autoplay) | Chrome autoplay and audio-context constraints | Safari or mobile behavior | Requires explicit user-start and lifecycle testing. |
| [WebKit autoplay guidance](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/) | WebKit media autoplay behavior | Cross-browser equivalence | Requires separate WebKit evidence. |
| [WHO safe-listening guidance](https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening) | General relationship among level, duration and hearing risk | Safety of a specific browser/device/headphone chain | Demo evidence is limited to digital controls and user precautions. |
| [NIDCD outcome-measure discussion](https://www.nidcd.nih.gov/about/nidcd-director-message/toward-developing-meaningful-outcome-measures-for-adult-hearing-health-care) | Need for meaningful evidence in hearing-related outcomes | Validity of the proposed Auralis simulation | Supports conservative evidence language. |
| [Hearing-loss simulator study](https://pubmed.ncbi.nlm.nih.gov/37956704/) | Published evidence that simulator credibility and listener response are empirical questions | Validation of the future Auralis engine | Requires Auralis-specific objective and listening evidence. |
| [FDA intended-use guidance](https://www.fda.gov/medical-devices/digital-health-center-excellence/step-1-software-function-intended-medical-purpose) | Importance of intended purpose in medical-device positioning | A legal classification of Auralis | Reinforces non-diagnostic boundary. |
| [FTC health-products guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance) | Need for evidence supporting health-benefit claims | Approval of any Auralis claim | Blocks unsupported benefit claims. |
| [YouTube encoding guidance](https://support.google.com/youtube/answer/1722171) | Transcoding and upload-output considerations | Preservation of the Auralis auditory proof | Requires public-stream listening evidence. |
| [W3C WAI audio/video guidance](https://www.w3.org/WAI/media/av/) | Accessible alternatives for audiovisual content | Compliance of the future experience | Requires keyboard, text and caption validation. |

External evidence does not silently create a product or architecture decision.

## 4. Methodology

Each risk is a concrete uncertainty with its own trigger, evidence requirement, experiment or fallback.

A downstream consequence is not duplicated as another risk unless it has a distinct trigger, validation method or fallback.

The current score is:

`Exposure = Impact × Likelihood`

Low confidence does not reduce priority. No planned mitigation is treated as observed evidence.

Every current risk is `DEFERRED`, because its implementation evidence does not yet exist. Each deferral identifies an owner, revisit trigger and deadline. Any future acceptance of `HIGH` or `CRITICAL` residual risk requires the human owner.

## 5. Scales

### Impact

- `1 — Negligible`
- `2 — Minor`
- `3 — Material`
- `4 — Major`
- `5 — Critical`

### Likelihood

- `1 — Rare`
- `2 — Unlikely`
- `3 — Plausible`
- `4 — Likely`
- `5 — Very likely`

### Confidence

- `LOW`
- `MEDIUM`
- `HIGH`

### Portfolio priority

- `20–25 — CRITICAL`
- `15–19 — HIGH`
- `8–14 — MEDIUM`
- `1–7 — LOW`

Safety, compliance and integrity blockers may override mechanical scoring.

## 6. Portfolio summary

| Category | Total | Critical | High | Medium |
|---|---:|---:|---:|---:|
| Product and scope | 4 | 2 | 0 | 2 |
| Health claims and regulatory positioning | 2 | 0 | 2 | 0 |
| Audiological and simulation credibility | 5 | 1 | 2 | 2 |
| Audio-output safety | 1 | 0 | 1 | 0 |
| Browser and Web Audio constraints | 3 | 1 | 2 | 0 |
| Mobile performance and variability | 1 | 0 | 0 | 1 |
| UX, comprehension and accessibility | 2 | 0 | 0 | 2 |
| AI model and external services | 3 | 1 | 2 | 0 |
| Live demo and deployment | 3 | 2 | 1 | 0 |
| Data, privacy and security | 2 | 0 | 2 | 0 |
| Competition compliance | 3 | 0 | 3 | 0 |
| Asset licensing and provenance | 3 | 1 | 2 | 0 |
| Delivery time and sequencing | 3 | 3 | 0 | 0 |
| Scene and media quality | 1 | 0 | 1 | 0 |
| Public claims and documentation | 1 | 0 | 1 | 0 |
| **Total** | **37** | **11** | **19** | **7** |

Risks with `LOW` assessment confidence:

- `RISK-CRED-01`
- `RISK-CRED-04`
- `RISK-CRED-05`
- `RISK-PERF-01`
- `RISK-UX-01`
- `RISK-DEMO-02`

No risk is currently accepted or mitigated.

## 7. Top gating risks

The following risks can invalidate the mandatory product or prevent a later phase gate:

- `RISK-PROD-02` — manual audiogram is not real end-to-end processing;
- `RISK-CRED-01` — simulation lacks demo-level audiological credibility;
- `RISK-CRED-03` — same-source A/B cannot be demonstrated honestly;
- `RISK-SAFE-01` — digital output safety evidence fails;
- `RISK-AI-01` — live GPT path is unreliable;
- `RISK-DEMO-01` — the complete live journey fails under integrated conditions;
- `RISK-TIME-01` — the first genuine end-to-end proof occurs too late.

These risks must directly shape Phase 4 acceptance design. This statement does not select the vertical slice.

## 8. Complete risk register

| ID | Category | Risk | Impact | Likelihood | Exposure | Confidence | Earliest discovery | Decision deadline | Current disposition |
|---|---|---|---:|---:|---:|---|---|---|---|
| RISK-PROD-01 | Product/scope | Unfinished exposed capability or dead end | 4 | 3 | 12 MEDIUM | HIGH | Phase 4 | Before Phase 10; ≤20 Jul 02:00 | DEFERRED |
| RISK-PROD-02 | Product/scope | Manual audiogram fails or fakes personalisation | 5 | 4 | 20 CRITICAL | MEDIUM | Phase 4 | Before Phase 10; ≤20 Jul 02:00 | DEFERRED |
| RISK-PROD-03 | Product/scope | Optional expansion precedes validated core | 5 | 4 | 20 CRITICAL | HIGH | Phase 4 | Every gate; 20 Jul 02:00 | DEFERRED |
| RISK-PROD-04 | Product/scope | Interventions are internally incoherent | 4 | 3 | 12 MEDIUM | MEDIUM | Phase 4 | Before Phase 10; ≤20 Jul 02:00 | DEFERRED |
| RISK-CLAIM-01 | Claims | Diagnostic, prescriptive or benefit claim | 5 | 3 | 15 HIGH | HIGH | Phase 3 | Before any public claim | DEFERRED |
| RISK-CLAIM-02 | Claims | Impression of exact individual perception | 5 | 3 | 15 HIGH | HIGH | Phase 3 | Before Phase 4/public artifact | DEFERRED |
| RISK-CRED-01 | Credibility | Simulation is not audiologically defensible | 5 | 4 | 20 CRITICAL | LOW | Phase 3 | Before Phase 5 approval | DEFERRED |
| RISK-CRED-02 | Credibility | Audible and visual results are unsynchronised | 4 | 3 | 12 MEDIUM | MEDIUM | Phase 4 | Before Phase 10 first-proof gate | DEFERRED |
| RISK-CRED-03 | Credibility | Honest same-source A/B cannot be proved | 5 | 3 | 15 HIGH | MEDIUM | Phase 4 | Before Phase 10 first-proof gate | DEFERRED |
| RISK-CRED-04 | Credibility | One-sided and bilateral support do not differ genuinely | 4 | 3 | 12 MEDIUM | LOW | Phase 4 | Before Phase 10; ≤20 Jul 02:00 | DEFERRED |
| RISK-CRED-05 | Credibility | Results are indistinct or merely louder | 4 | 4 | 16 HIGH | LOW | Phase 4 | Before Phase 10 acceptance | DEFERRED |
| RISK-SAFE-01 | Audio safety | Unsafe level, clipping, jump, exposure or stop behavior | 5 | 3 | 15 HIGH | MEDIUM | Phase 3 | Before first user-facing Phase 10 audio | DEFERRED |
| RISK-WEB-01 | Browser | Claimed browser behaves differently or lacks support | 4 | 4 | 16 HIGH | HIGH | Phase 5 | Before Phase 5; Phase 9 shell smoke and Phase 10 product/runtime validation | DEFERRED |
| RISK-WEB-02 | Browser | Autoplay or lifecycle breaks playback | 4 | 4 | 16 HIGH | HIGH | Phase 5 | Before first user-facing Phase 10 audio | DEFERRED |
| RISK-WEB-03 | Browser/device | Output-chain variability defeats safety or comparison | 5 | 4 | 20 CRITICAL | HIGH | Phase 3 | Before Phase 5; evidence by Phase 10 | DEFERRED |
| RISK-PERF-01 | Mobile | Mobile constraints cause glitches, drift or failure | 4 | 3 | 12 MEDIUM | LOW | Phase 5 | Before mobile support claim | DEFERRED |
| RISK-UX-01 | UX | General users do not understand result or limitation | 4 | 3 | 12 MEDIUM | LOW | Phase 4 | Before Phase 10/video lock | DEFERRED |
| RISK-UX-02 | Accessibility | Audio-first proof excludes required users | 4 | 3 | 12 MEDIUM | MEDIUM | Phase 4 | Before Phase 10/video lock | DEFERRED |
| RISK-AI-01 | AI dependency | Live GPT path fails or exceeds latency | 5 | 4 | 20 CRITICAL | MEDIUM | Phase 5 | Before Phase 10 first-proof gate for initial live-path proof; before Phase 10 acceptance for the reliability threshold; repeat pre-demo validation | DEFERRED |
| RISK-AI-02 | AI dependency | External service cannot remain available or compliant | 5 | 3 | 15 HIGH | MEDIUM | Phase 5 | Before Phase 6; through judging | DEFERRED |
| RISK-AI-03 | Product truth | Prepared or fallback result is labelled live | 5 | 3 | 15 HIGH | HIGH | Phase 4 | Before Phase 5 and every capture | DEFERRED |
| RISK-DEMO-01 | Demo reliability | Integrated main demo fails live | 5 | 4 | 20 CRITICAL | MEDIUM | Phase 4 | Before Phase 10 first-proof gate and pre-demo rehearsals | DEFERRED |
| RISK-DEMO-02 | Deployment | Judge route unavailable or requires user key | 5 | 3 | 15 HIGH | LOW | Phase 5 | Before submission; through judging | DEFERRED |
| RISK-DEMO-03 | Video | Auditory hero moment is lost after capture/upload | 5 | 4 | 20 CRITICAL | HIGH | Phase 10 | Before final video upload | DEFERRED |
| RISK-SEC-01 | Data/privacy | Raw profile or context is retained or exposed | 5 | 3 | 15 HIGH | MEDIUM | Phase 5 | Before Phase 5/public testing | DEFERRED |
| RISK-SEC-02 | Security | Secret or privileged service is exposed | 5 | 3 | 15 HIGH | MEDIUM | Phase 5 | Before deployment/every push | DEFERRED |
| RISK-COMP-01 | Competition | Codex/GPT and `/feedback` evidence is insufficient | 5 | 3 | 15 HIGH | HIGH | Phase 3 | Before submission approval | DEFERRED |
| RISK-COMP-02 | Competition | Repository license/access path is non-compliant | 5 | 3 | 15 HIGH | HIGH | Phase 3 | Before 22 Jul 02:00 | DEFERRED |
| RISK-COMP-03 | Competition | Eligibility, fields, URLs or rule drift invalidates package | 5 | 3 | 15 HIGH | HIGH | Phase 3 | Recheck immediately pre-submit | DEFERRED |
| RISK-IP-01 | Licensing | Visual provenance or rights are missing | 5 | 3 | 15 HIGH | MEDIUM | Phase 5 | Before public inclusion | DEFERRED |
| RISK-IP-02 | Licensing | Audio provenance or rights are missing | 5 | 4 | 20 CRITICAL | HIGH | Phase 5 | Before first user-facing Phase 10 audio and video capture | DEFERRED |
| RISK-IP-03 | Licensing | Voice, music, font or icon terms are incompatible | 5 | 3 | 15 HIGH | MEDIUM | Phase 5 | Before public inclusion | DEFERRED |
| RISK-TIME-01 | Delivery | End-to-end audio proof occurs too late | 5 | 4 | 20 CRITICAL | HIGH | Phase 4 | First proof by 18 Jul 02:00 | DEFERRED |
| RISK-TIME-02 | Delivery | Mandatory core misses expansion cutoff | 5 | 4 | 20 CRITICAL | HIGH | Phase 4 | 20 Jul 02:00 | DEFERRED |
| RISK-TIME-03 | Delivery | Hardening/video/submission window is insufficient | 5 | 4 | 20 CRITICAL | HIGH | Phase 4 | Freeze 21 Jul; submit 22 Jul | DEFERRED |
| RISK-SCENE-01 | Media quality | Family scene is late or not intelligible/coherent | 4 | 4 | 16 HIGH | MEDIUM | Phase 4 | Before Phase 10 first-proof gate | DEFERRED |
| RISK-DOC-01 | Documentation | Public surfaces make inconsistent claims | 5 | 3 | 15 HIGH | HIGH | Phase 3 | Every public update/pre-submit | DEFERRED |

## 9. Risk details

### RISK-PROD-01

- **Risk ID:** `RISK-PROD-01`
- **Category:** Product and scope
- **Risk:** A jury-reachable capability is unfinished, mislabelled as functional, or terminates in an accidental dead end.
- **Trigger or failure mode:** A visible control or route produces a placeholder, unhandled error, inaccessible page or misleading success state.
- **Affected product commitment:** Truthful `Functional`, `Experimental` or `In preparation` status for every exposed capability.
- **Impact:** `4 — Major`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `12 — MEDIUM`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 4 — acceptance and exposed-surface design.
- **Latest safe discovery point:** Before Phase 10 acceptance.
- **Evidence needed:** Complete exposed-surface inventory, reachable-state walkthrough and captured terminal states.
- **Validation experiment:** `EXP-P3-18`
- **Experiment type:** Scope/status and schedule gate.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 4 for design; final observation in Phase 10.
- **Pass criteria:** Every jury-reachable surface has one truthful state and no accidental dead end.
- **Failure criteria:** Any misleading success state, unhandled `401`, `403`, `404`, broken route or placeholder mistaken for a real result.
- **Fallback:** Hide the surface or present a deliberate friendly `In preparation` ending until genuine validation passes.
- **Decision deadline:** Before Phase 10 acceptance and no later than July 20, 2026, 02:00 CEST; otherwise remove the surface.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-18`; deferral is valid only while unfinished surfaces remain hidden or truthfully labelled.
- **Residual risk:** A later route or copy change can reintroduce an inconsistent state.
- **Dependencies or related risks:** `RISK-PROD-03`, `RISK-DEMO-02`, `RISK-DOC-01`.
- **Source or rationale:** Product-freeze capability-status contract.

### RISK-PROD-02

- **Risk ID:** `RISK-PROD-02`
- **Category:** Product and scope
- **Risk:** Manual audiogram entry fails end to end or merely chooses a preset while appearing personalised.
- **Trigger or failure mode:** Different valid left/right threshold inputs produce the same generic output or cannot be traced to the resulting transformation.
- **Affected product commitment:** Functional manual audiogram input driving real visual and audible output.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 4 — vertical-slice acceptance design.
- **Latest safe discovery point:** First executable critical-chain proof.
- **Evidence needed:** At least two materially different manual profiles, an input-to-output trace and corresponding objective/audio/visual changes.
- **Validation experiment:** `EXP-P3-01` and `EXP-P3-07`
- **Experiment type:** End-to-end product-truth experiment.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Threshold changes drive corresponding real output and never silently select the nearest preset.
- **Failure criteria:** Generic output, preset substitution, ignored ear/frequency values or untraceable result.
- **Fallback:** `NO SAFE FALLBACK — scope or approach must change before the stated deadline.`
- **Decision deadline:** Before Phase 10 acceptance and no later than July 20, 2026, 02:00 CEST; failure blocks mandatory scope.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-01` and `EXP-P3-07`; deferral is valid only while manual entry is not labelled `Functional`.
- **Residual risk:** Passing fixtures may not cover every valid profile; bounds and unsupported inputs remain explicit.
- **Dependencies or related risks:** `RISK-CRED-01`, `RISK-CRED-05`, `RISK-SEC-01`, `RISK-TIME-01`.
- **Source or rationale:** Product-freeze manual-input and engine-proof requirements.

### RISK-PROD-03

- **Risk ID:** `RISK-PROD-03`
- **Category:** Product and scope
- **Risk:** Optional capability work begins before the mandatory Family Experience is complete and validated.
- **Trigger or failure mode:** Time is spent on directional support, live media generation or another expansion while a core acceptance check remains open.
- **Affected product commitment:** Core-first controlled expansion.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 4 — scope gate.
- **Latest safe discovery point:** Every phase and scope-change gate.
- **Evidence needed:** Mandatory-scope burn-down with current validation state and explicit optional-work inventory.
- **Validation experiment:** `EXP-P3-18`
- **Experiment type:** Schedule and scope-control audit.
- **Experiment owner:** Primary Codex task; human owner approves exceptions.
- **Earliest valid execution phase:** Phase 4.
- **Pass criteria:** No optional capability begins before every mandatory Family Experience acceptance gate passes.
- **Failure criteria:** Optional implementation consumes time while a mandatory result is incomplete or unvalidated.
- **Fallback:** Stop optional work immediately and remove incomplete optional exposure.
- **Decision deadline:** At every phase gate; absolute stop for new capability work is July 20, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit at every scope gate through `EXP-P3-18`; deferral is valid only while optional work has not begun.
- **Residual risk:** Small “temporary” additions can still create hidden integration and validation cost.
- **Dependencies or related risks:** `RISK-TIME-02`, `RISK-TIME-03`, `RISK-SCENE-01`.
- **Source or rationale:** Product-freeze controlled-expansion rule.

### RISK-PROD-04

- **Risk ID:** `RISK-PROD-04`
- **Category:** Product and scope
- **Risk:** Television-off and speaker-position interventions do not change audio, visual state and explanation coherently.
- **Trigger or failure mode:** Only the UI label changes, or the three result channels contradict one another.
- **Affected product commitment:** Two functional environmental or communication interventions.
- **Impact:** `4 — Major`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `12 — MEDIUM`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 4 — intervention acceptance design.
- **Latest safe discovery point:** Phase 10 acceptance.
- **Evidence needed:** Before/after captures and transformation evidence for both mandatory interventions.
- **Validation experiment:** `EXP-P3-09`
- **Experiment type:** Cross-channel coherence experiment.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Both interventions create internally consistent audible, visual and grounded-explanation changes.
- **Failure criteria:** Any mandatory intervention is decorative, contradictory or not derived from the actual state.
- **Fallback:** Temporarily hide a failing intervention while it is repaired; mandatory product acceptance remains blocked until both pass.
- **Decision deadline:** Before Phase 10 acceptance and no later than July 20, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-09`; deferral is valid only while neither intervention is falsely labelled `Functional`.
- **Residual risk:** User interpretation may still differ even when the channels are technically coherent.
- **Dependencies or related risks:** `RISK-CRED-02`, `RISK-UX-01`, `RISK-DEMO-03`.
- **Source or rationale:** Product-freeze intervention requirements.

### RISK-CLAIM-01

- **Risk ID:** `RISK-CLAIM-01`
- **Category:** Health claims and regulatory positioning
- **Risk:** User-facing or model-generated content becomes diagnostic, prescriptive, clinical, fitting guidance or an unsupported individual-benefit claim.
- **Trigger or failure mode:** Copy identifies a condition, recommends a device/treatment, predicts benefit or presents the experience as medical advice.
- **Affected product commitment:** Educational, illustrative and non-clinical product boundary.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 3 — primary-source and claim-boundary review.
- **Latest safe discovery point:** Before any user-facing claim is approved.
- **Evidence needed:** Complete claim inventory plus independent comprehension review.
- **Validation experiment:** `EXP-P3-03`
- **Experiment type:** Claims and comprehension audit.
- **Experiment owner:** Human owner with at least three independent reviewers.
- **Earliest valid execution phase:** Phase 10 after representative copy exists.
- **Pass criteria:** Reviewers consistently understand the experience as educational and non-prescriptive.
- **Failure criteria:** Any material surface is interpreted as diagnosis, treatment, fitting advice or promised benefit.
- **Fallback:** Remove or rewrite the claim and constrain model output; if the claim is inherent to the approach, `NO SAFE FALLBACK`.
- **Decision deadline:** Before public testing, final video recording or any public claim.
- **Current disposition:** `DEFERRED` — owner: human owner; revisit on `EXP-P3-03`; deferral is valid only while public copy remains unapproved.
- **Residual risk:** Generative wording can drift; checks must cover live output and later public artifacts.
- **Dependencies or related risks:** `RISK-CLAIM-02`, `RISK-AI-03`, `RISK-DOC-01`.
- **Source or rationale:** Product non-goals, OpenAI policies, FDA intended-purpose and FTC evidence principles.

### RISK-CLAIM-02

- **Risk ID:** `RISK-CLAIM-02`
- **Category:** Health claims and regulatory positioning
- **Risk:** The experience creates an unjustified impression of exactly reproducing an individual person’s hearing perception.
- **Trigger or failure mode:** Personalised wording, visuals or narration imply “this is exactly what this person hears.”
- **Affected product commitment:** Synthetic educational illustration with explicit limitations.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 3 — claim-boundary review.
- **Latest safe discovery point:** Before Phase 4 acceptance language and every public artifact.
- **Evidence needed:** Limitation wording and independent comprehension evidence.
- **Validation experiment:** `EXP-P3-03`
- **Experiment type:** Claims and comprehension audit.
- **Experiment owner:** Human owner with independent reviewers.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Reviewers understand that the result is illustrative and not an exact individual percept.
- **Failure criteria:** A reviewer reasonably interprets the result as exact reproduction.
- **Fallback:** Remove personal-certainty wording and narrow the presentation; if exactness is inherent to the approach, `NO SAFE FALLBACK`.
- **Decision deadline:** Before Phase 4 closes and again before every public artifact.
- **Current disposition:** `DEFERRED` — owner: human owner; revisit on `EXP-P3-03`; deferral is valid only while no exactness claim is published.
- **Residual risk:** Strong sensory impact can imply certainty even when disclaimers exist.
- **Dependencies or related risks:** `RISK-CRED-01`, `RISK-PROD-02`, `RISK-DOC-01`.
- **Source or rationale:** Explicit product non-goal and evidence limitations of individual simulation.

### RISK-CRED-01

- **Risk ID:** `RISK-CRED-01`
- **Category:** Audiological and simulation credibility
- **Risk:** The simulation is not audiologically defensible for its stated educational purpose.
- **Trigger or failure mode:** Transformations lack a traceable relationship to input profiles, behave inconsistently or overstate what they illustrate.
- **Affected product commitment:** Credible educational comparison for three presets and manual input.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `LOW`
- **How early it can be discovered:** Phase 3 — evidence-standard decision.
- **Latest safe discovery point:** Before Phase 5 approval for the evidence contract; observed result before `Functional` status.
- **Evidence needed:** Deterministic fixtures, objective output evidence, structured internal listening and explicit limitations.
- **Validation experiment:** `EXP-P3-02`
- **Experiment type:** Objective transformation and structured-listening validation.
- **Experiment owner:** Primary Codex task for evidence; human owner for residual `CRITICAL` risk.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Outputs are deterministic, input-correlated, meaningfully distinguishable and not reducible to gain changes alone.
- **Failure criteria:** No stable input relationship, unexplained behavior or result that is only louder/quieter.
- **Fallback:** `NO SAFE FALLBACK — scope or approach must change before the stated deadline.`
- **Decision deadline:** Evidence standard before Phase 5 approval; result before capability becomes `Functional`.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-02`; deferral is valid only while credibility remains explicitly unverified.
- **Residual risk:** Demo-level internal evidence is not production-grade audiological validation. Any accepted residual `CRITICAL` risk requires the human owner.
- **Dependencies or related risks:** `RISK-PROD-02`, `RISK-CRED-03`, `RISK-CRED-05`, `RISK-CLAIM-02`.
- **Source or rationale:** Product engine-proof requirements, NIDCD evidence principles and simulator research.

### RISK-CRED-02

- **Risk ID:** `RISK-CRED-02`
- **Category:** Audiological and simulation credibility
- **Risk:** Audible and visual results become temporally or semantically unsynchronised.
- **Trigger or failure mode:** The visual state shows another profile, support state or intervention from the sound being heard.
- **Affected product commitment:** Audible and data-derived visual proof from the same actual input and transformation.
- **Impact:** `4 — Major`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `12 — MEDIUM`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 4 — acceptance design.
- **Latest safe discovery point:** Phase 10 first-proof gate.
- **Evidence needed:** Captured shared events and state/timing trace.
- **Validation experiment:** `EXP-P3-06`
- **Experiment type:** Temporal and semantic synchronization check.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Every state change has correct semantic order and stays within a threshold declared before execution.
- **Failure criteria:** Any mismatched state, reversed order or threshold violation.
- **Fallback:** Reduce the visual proof to a stable data-derived state representation and rerun validation; never show decorative unsynchronised animation.
- **Decision deadline:** Before Phase 10 first-proof gate.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-06`; deferral is valid only while synchronization is not claimed as validated.
- **Residual risk:** Capture and playback latency can differ from the live environment.
- **Dependencies or related risks:** `RISK-PROD-04`, `RISK-WEB-03`, `RISK-DEMO-03`.
- **Source or rationale:** Product-freeze visual-proof requirement.

### RISK-CRED-03

- **Risk ID:** `RISK-CRED-03`
- **Category:** Audiological and simulation credibility
- **Risk:** Auralis cannot prove an honest same-source A/B comparison.
- **Trigger or failure mode:** Reference and comparison use different source content, alignment, timing or scene conditions without an intentional intervention.
- **Affected product commitment:** Same-source reference versus hearing-profile comparison.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 4 — acceptance design.
- **Latest safe discovery point:** Phase 10 first-proof gate.
- **Evidence needed:** Source identity, state trace and reproducible reference/transformed pair.
- **Validation experiment:** `EXP-P3-01` and `EXP-P3-08`
- **Experiment type:** Source-identity and comparative-output validation.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Reference and transformed states demonstrably originate from the same source except for an intentional intervention.
- **Failure criteria:** Different source content or untraceable comparison.
- **Fallback:** `NO SAFE FALLBACK — scope or approach must change before the stated deadline.`
- **Decision deadline:** Before Phase 10 first-proof gate; otherwise the selected approach is blocked.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-08`; deferral is valid only while no A/B proof is claimed.
- **Residual risk:** Output routing or capture can later break source identity.
- **Dependencies or related risks:** `RISK-CRED-02`, `RISK-CRED-05`, `RISK-DEMO-03`.
- **Source or rationale:** Fixed main proof in the product freeze.

### RISK-CRED-04

- **Risk ID:** `RISK-CRED-04`
- **Category:** Audiological and simulation credibility
- **Risk:** One-sided and bilateral support states do not produce a genuine, coherent and distinguishable difference.
- **Trigger or failure mode:** Both states yield the same output or differ only through labels or arbitrary gain.
- **Affected product commitment:** Mandatory one-sided followed by bilateral support proof.
- **Impact:** `4 — Major`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `12 — MEDIUM`
- **Confidence in assessment:** `LOW`
- **How early it can be discovered:** Phase 4 — acceptance design.
- **Latest safe discovery point:** Phase 10 acceptance.
- **Evidence needed:** Objective state comparison plus structured listening using the same source.
- **Validation experiment:** `EXP-P3-08`
- **Experiment type:** Comparative support-state experiment.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Both states are real, coherent and distinguishable through evidence beyond labels.
- **Failure criteria:** Identical outputs, decorative state change or distinction explained only by overall loudness.
- **Fallback:** `NO SAFE FALLBACK — scope or approach must change before the stated deadline.`
- **Decision deadline:** Before Phase 10 acceptance and no later than July 20, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-08`; deferral is valid only while support is not labelled `Functional`.
- **Residual risk:** Listener distinction may vary by playback environment.
- **Dependencies or related risks:** `RISK-CRED-05`, `RISK-WEB-03`, `RISK-DEMO-03`.
- **Source or rationale:** Mandatory support sequence in the product freeze.

### RISK-CRED-05

- **Risk ID:** `RISK-CRED-05`
- **Category:** Audiological and simulation credibility
- **Risk:** Profiles or support states are not meaningfully distinguishable, or “better” is only louder.
- **Trigger or failure mode:** Output comparisons collapse to level changes or fail structured listening.
- **Affected product commitment:** Distinct presets, manual profiles and support states with understandable results.
- **Impact:** `4 — Major`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `16 — HIGH`
- **Confidence in assessment:** `LOW`
- **How early it can be discovered:** Phase 4 — fixture and listening-evidence design.
- **Latest safe discovery point:** Phase 10 first-proof gate for core states and Phase 10 acceptance for all mandatory profiles.
- **Evidence needed:** Level-aware objective comparison plus structured internal listening.
- **Validation experiment:** `EXP-P3-02` and `EXP-P3-08`
- **Experiment type:** Objective and perceptual distinction experiment.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Mandatory states differ consistently for their actual inputs and remain distinguishable after controlling for simple level differences.
- **Failure criteria:** Indistinguishable result or only an overall gain change.
- **Fallback:** Simplify the effect while preserving the mandatory product state and rerun validation; directional support may be downgraded or removed if it is the failing optional state.
- **Decision deadline:** Before Phase 10 first-proof gate for core states and Phase 10 acceptance for all mandatory profiles.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-02` and `EXP-P3-08`; deferral is valid only while unvalidated states are not `Functional`.
- **Residual risk:** General-audience perception remains device- and listener-dependent.
- **Dependencies or related risks:** `RISK-CRED-01`, `RISK-CRED-04`, `RISK-WEB-03`.
- **Source or rationale:** Product success criteria for distinguishable real results.

### RISK-SAFE-01

- **Risk ID:** `RISK-SAFE-01`
- **Category:** Audio-output safety
- **Risk:** Playback creates unintentionally high digital level, clipping, uncontrolled jumps, excessive exposure or ineffective stop behavior.
- **Trigger or failure mode:** Worst-case content or state transition exceeds declared limits, clips, starts unexpectedly or cannot be stopped promptly.
- **Affected product commitment:** Credible and safe educational audio experience.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 3 — evidence-standard decision.
- **Latest safe discovery point:** Before first user-facing Phase 10 audio.
- **Evidence needed:** Worst-case digital-output sweep, transition measurements, explicit low-volume start instruction and observed stop behavior.
- **Validation experiment:** `EXP-P3-04`
- **Experiment type:** Digital safety and transition sweep.
- **Experiment owner:** Primary Codex task; human owner accepts any residual `HIGH` risk.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** No clipping or non-finite output, no excursion above the predeclared digital ceiling, explicit low-volume start and effective stop.
- **Failure criteria:** Any uncontrolled level, clipping, non-finite sample, unsafe transition or ineffective stop.
- **Fallback:** `NO SAFE FALLBACK — audio playback remains blocked until the failure is removed.`
- **Decision deadline:** Before first user-facing Phase 10 audio.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-04`; deferral is valid only while playback is not released.
- **Residual risk:** Digital checks cannot validate the user’s physical volume, headphones, hearing sensitivity or exposure duration. No production-grade safety claim is permitted.
- **Dependencies or related risks:** `RISK-WEB-02`, `RISK-WEB-03`, `RISK-DEMO-03`.
- **Source or rationale:** WHO safe-listening guidance and P3-D03 demo boundary.

### RISK-WEB-01

- **Risk ID:** `RISK-WEB-01`
- **Category:** Browser and Web Audio platform constraints
- **Risk:** Required audio behavior is unsupported or materially different in a claimed browser.
- **Trigger or failure mode:** A mandatory state fails, differs materially or lacks a required platform capability.
- **Affected product commitment:** Reliable supported browser experience.
- **Impact:** `4 — Major`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `16 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 5 — technology and platform decision.
- **Latest safe discovery point:** Before Phase 5 approval, reconfirmed by the Phase 9 shell smoke and Phase 10 product/runtime check.
- **Evidence needed:** Observed primary/secondary desktop matrix and current-mobile smoke.
- **Validation experiment:** `EXP-P3-05`
- **Experiment type:** Browser/device compatibility matrix.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 9 for shell/static evidence after a runnable path exists; Phase 10 for product/runtime evidence.
- **Pass criteria:** Every mandatory case passes in both claimed desktop environments; mobile claims remain limited to observed smoke evidence.
- **Failure criteria:** Any claimed mandatory environment fails its core journey.
- **Fallback:** Narrow the supported-environment claim to the observed passing matrix.
- **Decision deadline:** Compatibility assumptions before Phase 5 approval; observed claim evidence before Phase 10.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-05`; deferral is valid only while support claims remain provisional.
- **Residual risk:** Browser updates may change behavior after validation.
- **Dependencies or related risks:** `RISK-WEB-02`, `RISK-WEB-03`, `RISK-PERF-01`.
- **Source or rationale:** Web Audio specification and browser autoplay documentation.

### RISK-WEB-02

- **Risk ID:** `RISK-WEB-02`
- **Category:** Browser and Web Audio platform constraints
- **Risk:** Autoplay policy, suspended/interrupted audio context, focus loss or route transition breaks playback.
- **Trigger or failure mode:** Audio fails to start, silently stops or resumes in the wrong state.
- **Affected product commitment:** Reliable user-controlled main journey.
- **Impact:** `4 — Major`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `16 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 5 — lifecycle design.
- **Latest safe discovery point:** Before first user-facing Phase 10 audio.
- **Evidence needed:** Observed start, pause, resume, interruption, focus and route-transition behavior.
- **Validation experiment:** `EXP-P3-04` and `EXP-P3-05`
- **Experiment type:** Lifecycle and interruption matrix.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Explicit user start succeeds; every tested interruption ends in a correct state or a clear recoverable prompt.
- **Failure criteria:** Silent failure, uncontrolled playback or incorrect state after interruption.
- **Fallback:** Require explicit user restart and present a clear recoverable state; never imply uninterrupted playback.
- **Decision deadline:** Before first user-facing Phase 10 audio.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-04` and `EXP-P3-05`; deferral is valid only before public playback.
- **Residual risk:** OS-level interruptions remain outside application control.
- **Dependencies or related risks:** `RISK-SAFE-01`, `RISK-WEB-03`, `RISK-DEMO-01`.
- **Source or rationale:** Web Audio, Chrome and WebKit lifecycle/autoplay behavior.

### RISK-WEB-03

- **Risk ID:** `RISK-WEB-03`
- **Category:** Browser and Web Audio platform constraints
- **Risk:** Headphones, speakers, Bluetooth routing, sample rate, output latency, OS processing and user volume make results unsafe or non-comparable.
- **Trigger or failure mode:** The same digital output produces materially different level, timing or spatial evidence across tested chains.
- **Affected product commitment:** Credible same-source comparison in supported environments.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 3 — supported-environment evidence policy.
- **Latest safe discovery point:** Environment assumptions before Phase 5; observed matrix before Phase 10.
- **Evidence needed:** Primary/secondary desktop tests, current-mobile smoke, headphones and built-in-output checks.
- **Validation experiment:** `EXP-P3-04`, `EXP-P3-05` and `EXP-P3-08`
- **Experiment type:** Output-chain and comparison matrix.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Mandatory comparisons remain safe at the digital boundary and understandable in every claimed environment.
- **Failure criteria:** Any claimed environment defeats safety, source comparison or support distinction.
- **Fallback:** Narrow support claims, instruct low-volume start and state the physical-chain limitation explicitly.
- **Decision deadline:** Before Phase 5 approval for the target matrix; observed evidence before Phase 10.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on the environment experiments; deferral is valid only while no untested environment is claimed.
- **Residual risk:** Uncontrolled user hardware and volume remain outside demo-level validation; any accepted `CRITICAL` residual risk requires the human owner.
- **Dependencies or related risks:** `RISK-SAFE-01`, `RISK-CRED-04`, `RISK-DEMO-03`.
- **Source or rationale:** Platform variability and P3-D03/P3-D04 evidence boundary.

### RISK-PERF-01

- **Risk ID:** `RISK-PERF-01`
- **Category:** Mobile performance and device variability
- **Risk:** Mobile CPU, memory, thermal pressure, backgrounding or network constraints cause glitches, drift, stalls or crashes.
- **Trigger or failure mode:** Current-mobile smoke produces a broken or misleading journey.
- **Affected product commitment:** Truthful mobile reach without claiming unsupported parity.
- **Impact:** `4 — Major`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `12 — MEDIUM`
- **Confidence in assessment:** `LOW`
- **How early it can be discovered:** Phase 5 — performance-budget decision.
- **Latest safe discovery point:** Before any mobile support claim.
- **Evidence needed:** Current-device smoke with observed stability and state behavior.
- **Validation experiment:** `EXP-P3-05`
- **Experiment type:** Device smoke and stability check.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** The explicitly claimed mobile smoke journey completes without material glitch, crash or false state.
- **Failure criteria:** Broken mandatory smoke path or claimed parity unsupported by evidence.
- **Fallback:** Limit mobile to the passing observed scope or make no mobile-support claim.
- **Decision deadline:** Before Phase 10 and before recording mobile evidence.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-05`; deferral is valid only while mobile parity is not claimed.
- **Residual risk:** Device diversity remains wider than the tested sample.
- **Dependencies or related risks:** `RISK-WEB-01`, `RISK-WEB-02`, `RISK-AI-01`.
- **Source or rationale:** P3-D04 supported-environment decision.

### RISK-UX-01

- **Risk ID:** `RISK-UX-01`
- **Category:** UX, comprehension and accessibility
- **Risk:** General users do not understand the comparison, its limitation or the practical action despite completing the flow.
- **Trigger or failure mode:** Independent reviewers misstate what changed, infer diagnosis/exactness or cannot identify an action.
- **Affected product commitment:** Understandable Family Experience for a general audience.
- **Impact:** `4 — Major`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `12 — MEDIUM`
- **Confidence in assessment:** `LOW`
- **How early it can be discovered:** Phase 4 — outcome acceptance design.
- **Latest safe discovery point:** Before Phase 10 acceptance and video lock.
- **Evidence needed:** Structured comprehension responses from the owner and at least three independent people.
- **Validation experiment:** `EXP-P3-03`
- **Experiment type:** Independent comprehension audit.
- **Experiment owner:** Human owner.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** All reviewers understand the comparison, limitation and at least one non-prescriptive action.
- **Failure criteria:** Material misunderstanding by any reviewer without a resolved explanation.
- **Fallback:** Simplify wording and journey emphasis, then repeat the audit.
- **Decision deadline:** Before final video and public product claims.
- **Current disposition:** `DEFERRED` — owner: human owner; revisit on `EXP-P3-03`; deferral is valid only while no comprehension claim is made.
- **Residual risk:** Small reviewer samples do not represent every audience.
- **Dependencies or related risks:** `RISK-CLAIM-01`, `RISK-CLAIM-02`, `RISK-DOC-01`.
- **Source or rationale:** Product success criterion for family understanding.

### RISK-UX-02

- **Risk ID:** `RISK-UX-02`
- **Category:** UX, comprehension and accessibility
- **Risk:** Audio-first evidence excludes users needing captions, text alternatives, keyboard access, reduced motion or non-auditory status cues.
- **Trigger or failure mode:** A mandatory state cannot be reached or understood without hearing, pointer input or motion.
- **Affected product commitment:** Usable and understandable public demo.
- **Impact:** `4 — Major`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `12 — MEDIUM`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 4 — acceptance design.
- **Latest safe discovery point:** Phase 10 acceptance and submission-video lock.
- **Evidence needed:** Keyboard walkthrough, text/status alternatives, reduced-motion behavior and caption/transcript review.
- **Validation experiment:** `EXP-P3-13` and `EXP-P3-16`
- **Experiment type:** Accessibility acceptance and public-stream review.
- **Experiment owner:** Primary Codex task; human owner for public review.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Mandatory states are reachable and understandable with the specified alternatives.
- **Failure criteria:** A required state or explanation depends exclusively on inaccessible audio, motion or input.
- **Fallback:** Provide a stable text/status representation, captions and reduced-motion presentation before publication.
- **Decision deadline:** Before Phase 10 acceptance and final video upload.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-13`; deferral is valid only before public acceptance.
- **Residual risk:** Full conformance is not established by the limited demo audit.
- **Dependencies or related risks:** `RISK-UX-01`, `RISK-CRED-02`, `RISK-DEMO-03`.
- **Source or rationale:** W3C WAI audiovisual accessibility guidance.

### RISK-AI-01

- **Risk ID:** `RISK-AI-01`
- **Category:** AI model and external-service dependency
- **Risk:** The live GPT-5.6 path fails, times out, is rate-limited or has unacceptable latency during the main journey.
- **Trigger or failure mode:** Scene intent, structure or grounded explanation does not arrive correctly during a fresh run.
- **Affected product commitment:** Genuine live GPT-5.6 intelligence on every main run.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 5 — external-service decision.
- **Latest safe discovery point:** Phase 10 first-proof gate for initial live-path proof; Phase 10 acceptance for the full reliability threshold; repeat pre-demo validation.
- **Evidence needed:** Twenty fresh integrated runs with timestamps, status and grounding observations.
- **Validation experiment:** `EXP-P3-10`
- **Experiment type:** Live-service reliability and latency experiment.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** At least 19/20 live successes, zero false-live states, zero dead ends and live-explanation p95 no greater than 10 seconds.
- **Failure criteria:** Lower success, any false-live state, any dead end or latency threshold failure.
- **Fallback:** Friendly transparent degraded state and retry/restart path. The fallback does not satisfy the mandatory live acceptance.
- **Decision deadline:** Initial live-path proof before the Phase 10 first-proof gate; full reliability acceptance before Phase 10 acceptance and every final rehearsal.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-10`; deferral is valid only while live reliability is not claimed.
- **Residual risk:** External-service incidents can occur after a passing sample; any accepted `CRITICAL` residual risk requires the human owner.
- **Dependencies or related risks:** `RISK-AI-02`, `RISK-AI-03`, `RISK-DEMO-01`.
- **Source or rationale:** Product-freeze live-model requirement and P3-D10.

### RISK-AI-02

- **Risk ID:** `RISK-AI-02`
- **Category:** AI model and external-service dependency
- **Risk:** The product depends on an external model or media service whose availability, quota, cost or terms cannot be sustained through judging.
- **Trigger or failure mode:** Disabling a non-mandatory service breaks the Family Experience, or service access cannot remain available.
- **Affected product commitment:** Reliable mandatory journey with GPT-5.6 as the only mandatory model-service dependency.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 5 — dependency decision.
- **Latest safe discovery point:** Before Phase 6 approval; continuity maintained through judging.
- **Evidence needed:** Optional-service kill test and verified current service terms/availability for every selected dependency.
- **Validation experiment:** `EXP-P3-11`
- **Experiment type:** Dependency-removal and continuity test.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10 after the mandatory critical chain passes and before optional-image exposure.
- **Pass criteria:** Mandatory Family Experience completes with optional image/audio generation disabled.
- **Failure criteria:** An optional service outage prevents mandatory completion.
- **Fallback:** Remove the optional service and use validated reusable media; never call reused media freshly generated.
- **Decision deadline:** Before Phase 6 dependency approval; service evidence maintained through August 6, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-11`; deferral is valid only while optional services are not mandatory dependencies.
- **Residual risk:** GPT-5.6 itself remains a mandatory external dependency.
- **Dependencies or related risks:** `RISK-AI-01`, `RISK-DEMO-01`, `RISK-SCENE-01`.
- **Source or rationale:** P3-D11 and P3-D16; current OpenAI documentation does not establish a general GPT-5.6 sound-scene generation tool.

### RISK-AI-03

- **Risk ID:** `RISK-AI-03`
- **Category:** AI model and external-service dependency
- **Risk:** A cached, prepared, retried or fallback result is represented as live model output.
- **Trigger or failure mode:** UI or submission wording says “live” when the displayed intelligence or media was prepared earlier.
- **Affected product commitment:** Truthful live GPT role and capability status.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 4 — evidence and state contract.
- **Latest safe discovery point:** Before Phase 5 approval and every demo capture.
- **Evidence needed:** Per-run state evidence distinguishing live, reused, retry, degraded and prepared output.
- **Validation experiment:** `EXP-P3-10`
- **Experiment type:** Live-state truthfulness audit.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Zero false-live states across twenty fresh runs and all failure states remain explicit.
- **Failure criteria:** Any cached, fallback or reused result is described as freshly generated.
- **Fallback:** Label prepared/reused output accurately and show a friendly failure state; the mandatory live requirement remains unpassed.
- **Decision deadline:** Before Phase 5 state design and every public capture.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-10`; deferral is valid only while public live claims remain unapproved.
- **Residual risk:** Copy changes can later obscure the distinction.
- **Dependencies or related risks:** `RISK-AI-01`, `RISK-DOC-01`, `RISK-COMP-01`.
- **Source or rationale:** Product-freeze live-model truthfulness requirement.

### RISK-DEMO-01

- **Risk ID:** `RISK-DEMO-01`
- **Category:** Live-demo and deployment reliability
- **Risk:** The complete main demo fails under live judging conditions even though components worked separately.
- **Trigger or failure mode:** One critical-chain link fails during an integrated fresh run.
- **Affected product commitment:** Complete validated Family Experience.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 4 — end-to-end acceptance design.
- **Latest safe discovery point:** Phase 10 first-proof gate and every pre-demo rehearsal.
- **Evidence needed:** Integrated proof covering real input, transform, same-source A/B, support, safety, visual state, live GPT and outage truth.
- **Validation experiment:** `EXP-P3-01` and `EXP-P3-11`
- **Experiment type:** Critical-chain and dependency-kill tests.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Every mandatory chain link completes truthfully in one fresh run; optional media service removal does not break it.
- **Failure criteria:** Any mandatory link is absent, fake, ungrounded or terminates the journey.
- **Fallback:** Present an honest recoverable failure state and stop optional work. The fallback does not pass live-demo acceptance.
- **Decision deadline:** First proof by July 18, 2026, 02:00 CEST; full acceptance before Phase 10 closes.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-01`; deferral is valid only before an integrated result is claimed.
- **Residual risk:** Environmental service failure remains possible after rehearsals; any accepted `CRITICAL` residual risk requires the human owner.
- **Dependencies or related risks:** `RISK-TIME-01`, `RISK-AI-01`, `RISK-WEB-02`.
- **Source or rationale:** Mandatory end-to-end product and jury-readiness criteria.

### RISK-DEMO-02

- **Risk ID:** `RISK-DEMO-02`
- **Category:** Live-demo and deployment reliability
- **Risk:** The judging route is unavailable, gated, slow or dependent on a judge-provided API key.
- **Trigger or failure mode:** A clean anonymous session cannot reach and complete the claimed journey.
- **Affected product commitment:** Usable judging access without weakening security.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `LOW`
- **How early it can be discovered:** Phase 5 — deployment requirement.
- **Latest safe discovery point:** Submission-package approval.
- **Evidence needed:** Repeated clean-session external-route smoke without developer authentication or judge credentials.
- **Validation experiment:** `EXP-P3-15`
- **Experiment type:** Anonymous judging-route smoke.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Three cold runs per claimed environment reach the main journey without a judge-provided key.
- **Failure criteria:** Authentication dead end, unavailable route, material load failure or secret exposure.
- **Fallback:** Use only another separately approved compliant access route; do not bypass security or require a judge key.
- **Decision deadline:** Before submission approval; required availability through August 6, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-15`; deferral is valid only before a public route is submitted.
- **Residual risk:** Hosting or network failure can occur during judging.
- **Dependencies or related risks:** `RISK-SEC-02`, `RISK-WEB-01`, `RISK-COMP-03`.
- **Source or rationale:** Product jury-readiness and competition access requirements.

### RISK-DEMO-03

- **Risk ID:** `RISK-DEMO-03`
- **Category:** Live-demo and deployment reliability
- **Risk:** The auditory hero moment becomes unclear after capture, voiceover, transcoding or playback on ordinary speakers.
- **Trigger or failure mode:** Uploaded-stream listeners cannot identify A/B, support or intervention differences.
- **Affected product commitment:** Persuasive under-three-minute submission video.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 10 — first captured end-to-end audio.
- **Latest safe discovery point:** Before final recording and upload.
- **Evidence needed:** Public uploaded-stream listening on both desktop environments, current mobile, headphones and built-in output.
- **Validation experiment:** `EXP-P3-08` and `EXP-P3-16`
- **Experiment type:** Capture-chain and public-stream listening validation.
- **Experiment owner:** Human owner with at least three independent listeners.
- **Earliest valid execution phase:** Phase 10 after capture is possible.
- **Pass criteria:** All reviewers can hear the required differences and understand the narration/captions in the public stream.
- **Failure criteria:** A mandatory auditory proof is unclear in any required acceptance environment.
- **Fallback:** Simplify and re-record the scene or mix using validated same-source media; captions may clarify context but cannot replace audible proof.
- **Decision deadline:** Before final video upload, leaving rework time before July 22, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: human owner; revisit on `EXP-P3-16`; deferral is valid only before the final stream is accepted.
- **Residual risk:** Individual hearing and playback setups remain variable; any accepted `CRITICAL` residual risk requires the human owner.
- **Dependencies or related risks:** `RISK-CRED-03`, `RISK-CRED-05`, `RISK-SCENE-01`.
- **Source or rationale:** Submission-video proof and YouTube transcoding uncertainty.

### RISK-SEC-01

- **Risk ID:** `RISK-SEC-01`
- **Category:** Data, privacy and security
- **Risk:** Manual audiogram or user context is retained, exposed, logged or reused outside the approved session-only boundary.
- **Trigger or failure mode:** Raw profile/context appears in persistence, logs, analytics or later sessions.
- **Affected product commitment:** Session-only manual profile and context handling.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 5 — data-boundary decision.
- **Latest safe discovery point:** Before Phase 5 approval and public testing.
- **Evidence needed:** Representative-session inspection of persistence, logs and network-visible artifacts.
- **Validation experiment:** `EXP-P3-07` and `EXP-P3-12`
- **Experiment type:** Data-flow and retention audit.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10 for observed evidence.
- **Pass criteria:** No raw profile/context persists beyond the session or enters logs.
- **Failure criteria:** Any undisclosed retained, reused or publicly exposed raw data.
- **Fallback:** Block public/manual-input testing until the session-only boundary is restored.
- **Decision deadline:** Data boundary before Phase 5 approval; observed evidence before public testing.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-12`; deferral is valid only while no raw user data is collected publicly.
- **Residual risk:** Infrastructure metadata may still exist and must not contain raw values.
- **Dependencies or related risks:** `RISK-PROD-02`, `RISK-SEC-02`, `RISK-DOC-01`.
- **Source or rationale:** P3-D12 and public-repository privacy discipline.

### RISK-SEC-02

- **Risk ID:** `RISK-SEC-02`
- **Category:** Data, privacy and security
- **Risk:** A secret or privileged external-service capability is exposed through the client, repository, logs or judging route.
- **Trigger or failure mode:** A credential or privileged request path is recoverable from public artifacts or browser traffic.
- **Affected product commitment:** Secure public demonstration without judge credentials.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 5 — trust-boundary decision.
- **Latest safe discovery point:** Before first public deployment and every push.
- **Evidence needed:** Public-client, repository, logs and route inspection.
- **Validation experiment:** `EXP-P3-12` and `EXP-P3-15`
- **Experiment type:** Security-boundary and anonymous-route audit.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 9 for static secret and public-repository checks; Phase 10 for provider, route and representative-session checks.
- **Pass criteria:** No secret or privileged credential is exposed; judges need no private key.
- **Failure criteria:** Any credential disclosure or unsafe privileged route.
- **Fallback:** Remove the exposed dependency/route and block publication until corrected.
- **Decision deadline:** Before first public deployment and every push.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-12`; deferral is valid only before public deployment.
- **Residual risk:** Later configuration or logging changes can reintroduce exposure.
- **Dependencies or related risks:** `RISK-AI-02`, `RISK-DEMO-02`, `RISK-COMP-02`.
- **Source or rationale:** `AGENTS.md` public-repository and secret-handling rules.

### RISK-COMP-01

- **Risk ID:** `RISK-COMP-01`
- **Category:** Competition compliance and submission evidence
- **Risk:** Meaningful Codex/GPT-5.6 use and the primary `/feedback` task are not sufficiently evidenced.
- **Trigger or failure mode:** Submission claims cannot be supported by the repository, runtime proof or designated task.
- **Affected product commitment:** Binding Build Week AI/tool evidence.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 3 — rules and evidence planning.
- **Latest safe discovery point:** Submission-package approval.
- **Evidence needed:** Continuous truthful record of Codex and live GPT roles plus designated future `/feedback` evidence.
- **Validation experiment:** `EXP-P3-17`
- **Experiment type:** Submission-package compliance audit.
- **Experiment owner:** Primary Codex task; human owner authorizes `/feedback`.
- **Earliest valid execution phase:** Submission preparation.
- **Pass criteria:** Every required AI-use claim is supported and the designated `/feedback` action is completed only when explicitly authorized.
- **Failure criteria:** Missing, reconstructed, inconsistent or misleading evidence.
- **Fallback:** Correct the package before submission; do not fabricate or infer missing evidence.
- **Decision deadline:** Before submission approval and July 22, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-17`; deferral is valid while evidence is accumulated honestly and `/feedback` remains uninvoked.
- **Residual risk:** Late rule or submission-form wording may require adjustment.
- **Dependencies or related risks:** `RISK-AI-03`, `RISK-DOC-01`, `RISK-COMP-03`.
- **Source or rationale:** Official Rules and project governance.

### RISK-COMP-02

- **Risk ID:** `RISK-COMP-02`
- **Category:** Competition compliance and submission evidence
- **Risk:** The public repository lacks required relevant licensing at submission and no compliant private-sharing path is completed.
- **Trigger or failure mode:** Repository access/licensing state does not satisfy current submission rules.
- **Affected product commitment:** Valid repository submission.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 3 — current-rules verification.
- **Latest safe discovery point:** Before the repository is submitted.
- **Evidence needed:** Current official rule check and separately approved license or compliant access decision.
- **Validation experiment:** `EXP-P3-17`
- **Experiment type:** Repository/submission compliance audit.
- **Experiment owner:** Human owner for license/access decision; primary Codex task for verification.
- **Earliest valid execution phase:** Submission preparation.
- **Pass criteria:** Repository and licensing/access state match current official requirements.
- **Failure criteria:** Missing required rights/access condition or unapproved license creation.
- **Fallback:** Use only a separately owner-approved compliant license or private-sharing path.
- **Decision deadline:** Before July 22, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: human owner; revisit on `EXP-P3-17`; deferral is valid because no license is currently being created or assumed.
- **Residual risk:** Official requirements may change before submission.
- **Dependencies or related risks:** `RISK-IP-01–03`, `RISK-COMP-03`.
- **Source or rationale:** Official Rules; license selection remains a separate owner decision.

### RISK-COMP-03

- **Risk ID:** `RISK-COMP-03`
- **Category:** Competition compliance and submission evidence
- **Risk:** Eligibility, required fields, English materials, URLs or late rule changes invalidate the submission package.
- **Trigger or failure mode:** A current binding requirement is missing or becomes outdated.
- **Affected product commitment:** Eligible and complete submission.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 3 — primary-source verification.
- **Latest safe discovery point:** Immediately before final submission.
- **Evidence needed:** Current official `MUST` and `CONDITIONAL MUST` checklist with every item observed.
- **Validation experiment:** `EXP-P3-17`
- **Experiment type:** Repeated official-source submission audit.
- **Experiment owner:** Primary Codex task; human owner submits.
- **Earliest valid execution phase:** Submission preparation.
- **Pass criteria:** Zero missing binding requirements immediately before submission.
- **Failure criteria:** Any unresolved eligibility, field, language, URL, access or deadline issue.
- **Fallback:** Correct the package before the deadline; no post-deadline fallback is assumed.
- **Decision deadline:** Recheck at video lock and immediately before July 22, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-17`; deferral is valid while current official requirements continue to be tracked.
- **Residual risk:** A last-minute external rule or platform change may still occur.
- **Dependencies or related risks:** `RISK-COMP-01`, `RISK-COMP-02`, `RISK-DOC-01`.
- **Source or rationale:** Official Rules, FAQ and program page.

### RISK-IP-01

- **Risk ID:** `RISK-IP-01`
- **Category:** Visual, audio, voice, font and asset licensing
- **Risk:** Visual assets lack documented provenance, permission or public-submission rights.
- **Trigger or failure mode:** An asset enters the repository, product or video without original source and applicable terms.
- **Affected product commitment:** Publicly distributable product and submission materials.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 5 — asset-source decision.
- **Latest safe discovery point:** Before the asset enters a public build or video.
- **Evidence needed:** Per-asset origin, author/tool, terms, modification, attribution and permitted-use record.
- **Validation experiment:** `EXP-P3-14`
- **Experiment type:** Asset provenance audit.
- **Experiment owner:** Primary Codex task; human owner approves ambiguous rights.
- **Earliest valid execution phase:** When the first asset is selected.
- **Pass criteria:** Every used visual asset has complete applicable provenance evidence.
- **Failure criteria:** Any missing, incompatible or unverifiable right.
- **Fallback:** Remove or replace the asset before publication.
- **Decision deadline:** Before public inclusion.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit per asset through `EXP-P3-14`; deferral is valid while no unaudited asset is published.
- **Residual risk:** Service terms can change; preserve the applicable version/date.
- **Dependencies or related risks:** `RISK-IP-03`, `RISK-SCENE-01`, `RISK-COMP-02`.
- **Source or rationale:** Public-repository and submission-rights requirements.

### RISK-IP-02

- **Risk ID:** `RISK-IP-02`
- **Category:** Visual, audio, voice, font and asset licensing
- **Risk:** Speech, television, ambience or other audio assets lack documented provenance or submission rights.
- **Trigger or failure mode:** Core scene audio cannot be proven reusable in the public app, repository or video.
- **Affected product commitment:** Functional family-dinner scene and public video.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 5 — asset-source decision.
- **Latest safe discovery point:** Before first user-facing Phase 10 audio and any video capture.
- **Evidence needed:** Per-audio-asset source, author/tool, rights, consent, modification and attribution record.
- **Validation experiment:** `EXP-P3-14`
- **Experiment type:** Audio provenance audit.
- **Experiment owner:** Primary Codex task; human owner approves ambiguous rights.
- **Earliest valid execution phase:** When scene audio is selected.
- **Pass criteria:** Every used audio component has complete public-app and video rights evidence.
- **Failure criteria:** Missing, incompatible or unverifiable rights for any used audio.
- **Fallback:** Remove or replace the asset with documented media; no unaudited audio may remain.
- **Decision deadline:** Before first user-facing Phase 10 audio and before video capture.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit per asset through `EXP-P3-14`; deferral is valid while no unaudited audio is used publicly.
- **Residual risk:** Generated-media terms and voice/publicity issues may require separate evidence; any accepted `CRITICAL` residual risk requires the human owner.
- **Dependencies or related risks:** `RISK-IP-03`, `RISK-SCENE-01`, `RISK-DEMO-03`.
- **Source or rationale:** Mandatory audio scene and public-submission rights.

### RISK-IP-03

- **Risk ID:** `RISK-IP-03`
- **Category:** Visual, audio, voice, font and asset licensing
- **Risk:** AI voices, music, fonts, icons or glyphs have incompatible terms, missing attribution, imitation, trademark or publicity risk.
- **Trigger or failure mode:** A supporting asset lacks exact current source terms or necessary permission.
- **Affected product commitment:** Legally supportable public app, video and repository.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 5 — asset-source decision.
- **Latest safe discovery point:** Before inclusion in a public build or video.
- **Evidence needed:** Original license/terms and any required attribution or consent per asset.
- **Validation experiment:** `EXP-P3-14`
- **Experiment type:** Supporting-asset license audit.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** When the asset is selected.
- **Pass criteria:** Every supporting asset has compatible, recorded terms and required attribution/consent.
- **Failure criteria:** Missing terms, incompatible use, imitation or publicity concern.
- **Fallback:** Remove or replace the asset.
- **Decision deadline:** Before public inclusion.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit per asset through `EXP-P3-14`; deferral is valid while no unaudited supporting asset is published.
- **Residual risk:** Terms may change; applicable versions must be recorded.
- **Dependencies or related risks:** `RISK-IP-01`, `RISK-IP-02`, `RISK-COMP-02`.
- **Source or rationale:** Per-asset provenance decision P3-D13.

### RISK-TIME-01

- **Risk ID:** `RISK-TIME-01`
- **Category:** Delivery time and sequencing
- **Risk:** The first genuine end-to-end audio path is attempted too late to expose integration failure.
- **Trigger or failure mode:** Work progresses on isolated surfaces while the critical chain remains unexecuted.
- **Affected product commitment:** Complete validated Family Experience by the cutoff.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 4 — vertical-slice priority.
- **Latest safe discovery point:** July 18, 2026, 02:00 CEST.
- **Evidence needed:** One fresh end-to-end critical-chain result.
- **Validation experiment:** `EXP-P3-01` and `EXP-P3-18`
- **Experiment type:** Early integration and schedule gate.
- **Experiment owner:** Primary Codex task.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Critical chain executes by the approved deadline with real rather than placeholder results.
- **Failure criteria:** Missing chain link or missed deadline.
- **Fallback:** Stop optional/non-blocking work and change the approach before proceeding.
- **Decision deadline:** July 18, 2026, 02:00 CEST; missing it requires an owner recovery decision.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-01`; deferral is valid only while Phase 4 prioritizes this proof.
- **Residual risk:** A first pass may still hide reliability or device failures; any accepted `CRITICAL` residual risk requires the human owner.
- **Dependencies or related risks:** `RISK-DEMO-01`, `RISK-PROD-02`, `RISK-AI-01`.
- **Source or rationale:** P3-D08 and P3-D09.

### RISK-TIME-02

- **Risk ID:** `RISK-TIME-02`
- **Category:** Delivery time and sequencing
- **Risk:** The mandatory Family Experience is not complete and validated before the expansion cutoff.
- **Trigger or failure mode:** Any mandatory product acceptance remains open at July 20, 2026, 02:00 CEST.
- **Affected product commitment:** Complete Family Experience before optional expansion.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 4 — scope and sequence gate.
- **Latest safe discovery point:** July 20, 2026, 02:00 CEST.
- **Evidence needed:** Mandatory-scope burn-down with observed validation state.
- **Validation experiment:** `EXP-P3-18`
- **Experiment type:** Scope-completion and cutoff gate.
- **Experiment owner:** Primary Codex task; human owner handles recovery decisions.
- **Earliest valid execution phase:** Phase 4 and every later phase.
- **Pass criteria:** Every mandatory capability is complete and validly evidenced before the cutoff.
- **Failure criteria:** Any mandatory capability remains incomplete or unvalidated at the cutoff.
- **Fallback:** `NO SAFE FALLBACK — scope or approach must change; no new capability work may start.`
- **Decision deadline:** July 20, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit daily through `EXP-P3-18`; deferral is valid only while mandatory work remains first priority.
- **Residual risk:** Validation rework can consume the protected hardening window; any accepted `CRITICAL` residual risk requires the human owner.
- **Dependencies or related risks:** `RISK-PROD-03`, `RISK-TIME-01`, `RISK-TIME-03`.
- **Source or rationale:** Product-freeze hard expansion cutoff.

### RISK-TIME-03

- **Risk ID:** `RISK-TIME-03`
- **Category:** Delivery time and sequencing
- **Risk:** Insufficient time remains for hardening, multi-environment checks, video capture/upload, documentation and submission audit.
- **Trigger or failure mode:** Capability work continues into the protected submission window.
- **Affected product commitment:** Reliable, documented and compliant submission.
- **Impact:** `5 — Critical`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `20 — CRITICAL`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 4 — milestone allocation.
- **Latest safe discovery point:** Hardening freeze on July 21, 2026, 02:00 CEST.
- **Evidence needed:** Current completion state, remaining validation, video and package checklist.
- **Validation experiment:** `EXP-P3-18`
- **Experiment type:** Hardening/submission-window gate.
- **Experiment owner:** Primary Codex task; human owner approves recovery.
- **Earliest valid execution phase:** Phase 4.
- **Pass criteria:** New capability work has stopped; remaining work is limited to approved hardening, validation, documentation, video and submission.
- **Failure criteria:** Material capability development continues after the freeze or critical submission work lacks time.
- **Fallback:** Stop capability work immediately, remove incomplete exposure and prioritize the mandatory submission package.
- **Decision deadline:** Hardening freeze July 21, 2026, 02:00 CEST; submission July 22, 2026, 02:00 CEST.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit daily through `EXP-P3-18`; deferral is valid only while the protected window remains reserved.
- **Residual risk:** Upload/platform delays can still consume the final buffer; any accepted `CRITICAL` residual risk requires the human owner.
- **Dependencies or related risks:** `RISK-TIME-02`, `RISK-DEMO-03`, `RISK-COMP-03`.
- **Source or rationale:** Product cutoff, P3-D14 and official submission deadline.

### RISK-SCENE-01

- **Risk ID:** `RISK-SCENE-01`
- **Category:** Scene and media production quality
- **Risk:** The family-dinner scene takes too long to produce or lacks intelligible dialogue, spatial coherence, emotional clarity or reusable validated media.
- **Trigger or failure mode:** Required scene states cannot support the comparison and intervention evidence on schedule.
- **Affected product commitment:** Frozen family-dinner main journey.
- **Impact:** `4 — Major`
- **Likelihood:** `4 — Likely`
- **Exposure / priority:** `16 — HIGH`
- **Confidence in assessment:** `MEDIUM`
- **How early it can be discovered:** Phase 4 — scene-proof acceptance design.
- **Latest safe discovery point:** Phase 10 first-proof gate.
- **Evidence needed:** Captured scene proof across required states and optional-media kill test.
- **Validation experiment:** `EXP-P3-11` and `EXP-P3-16`
- **Experiment type:** Scene continuity and public-listening validation.
- **Experiment owner:** Primary Codex task; human owner for listener review.
- **Earliest valid execution phase:** Phase 10.
- **Pass criteria:** Validated media supports intelligible, coherent mandatory states without optional live media generation.
- **Failure criteria:** Scene cannot support comparison/intervention proof or depends on an optional generation service.
- **Fallback:** Simplify media production while preserving the required family-dinner scenario and validated state changes.
- **Decision deadline:** Before Phase 10 first-proof gate; otherwise simplify immediately.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit on `EXP-P3-11`; deferral is valid only while media quality is not claimed as complete.
- **Residual risk:** Simplification may reduce emotional impact while preserving product truth.
- **Dependencies or related risks:** `RISK-AI-02`, `RISK-IP-02`, `RISK-DEMO-03`.
- **Source or rationale:** Frozen scene and P3-D16 optional live-media boundary.

### RISK-DOC-01

- **Risk ID:** `RISK-DOC-01`
- **Category:** Public-claim and documentation consistency
- **Risk:** The app, README, repository, video and submission text make inconsistent capability, live-model, safety or provenance claims.
- **Trigger or failure mode:** A public artifact describes functionality or evidence differently from the observed product.
- **Affected product commitment:** Mutually consistent and truthful submission package.
- **Impact:** `5 — Critical`
- **Likelihood:** `3 — Plausible`
- **Exposure / priority:** `15 — HIGH`
- **Confidence in assessment:** `HIGH`
- **How early it can be discovered:** Phase 3 — canonical claim inventory.
- **Latest safe discovery point:** Every public-artifact update and final submission audit.
- **Evidence needed:** Cross-artifact claim matrix against observed runtime and provenance evidence.
- **Validation experiment:** `EXP-P3-03`, `EXP-P3-16` and `EXP-P3-17`
- **Experiment type:** Claims, public-stream and submission consistency audit.
- **Experiment owner:** Primary Codex task; human owner approves final package.
- **Earliest valid execution phase:** Phase 10 and submission preparation.
- **Pass criteria:** Every public claim matches observed capability status, live/reused state, safety boundary and provenance.
- **Failure criteria:** Any unsupported or contradictory public statement.
- **Fallback:** Correct, narrow or remove the claim before publication.
- **Decision deadline:** At every public update and immediately before submission.
- **Current disposition:** `DEFERRED` — owner: primary Codex task; revisit at every public update and `EXP-P3-17`; deferral is valid only while final public artifacts are not approved.
- **Residual risk:** A last-minute edit can reintroduce inconsistency.
- **Dependencies or related risks:** `RISK-CLAIM-01–02`, `RISK-AI-03`, `RISK-COMP-01–03`.
- **Source or rationale:** Product jury-readiness and submission-proof requirements.

## 10. Validation experiment queue

`P3` in an experiment ID means the experiment was defined in Phase 3, not executed in Phase 3.

| Experiment ID | Related risks | Hypothesis | Earliest phase | Evidence | Pass | Fail | Decision after result | Owner | Deadline |
|---|---|---|---|---|---|---|---|---|---|
| EXP-P3-01 | PROD-02, CRED-01–05, SAFE-01, AI-01, AI-03, DEMO-01, TIME-01 | The entire critical chain can produce one genuine integrated result. | Phase 10 first-proof gate | Controlled scene; preset and manual input; support transition; intervention; audio, visual, live GPT and outage trace. | Every link is real, same-source, safe, grounded and truthfully labelled. | Any missing, fake, unsafe, ungrounded or dead-end link. | Continue core work only after pass; otherwise stop optional work and change approach. | Primary Codex task | 18 Jul 2026, 02:00 CEST |
| EXP-P3-02 | CRED-01, CRED-05 | Mandatory results are deterministic, input-correlated and distinguishable beyond gain. | Phase 10 first-proof gate | Fixed profiles, objective output comparisons and structured internal listening. | Stable input relationship; meaningful distinctions; limitations recorded. | Unstable relationship, indistinguishable output or only level change. | Permit demo-level `Functional` consideration or change approach. | Primary Codex task; owner accepts residual CRITICAL risk | Before relevant `Functional` state |
| EXP-P3-03 | CLAIM-01–02, UX-01, DOC-01 | Independent users understand the educational boundary and practical outcome. | Phase 10 | Full claim inventory and structured review by owner plus ≥3 independent people. | All understand illustrative/non-diagnostic boundary and an action. | Any unresolved diagnostic, exactness or prescriptive interpretation. | Owner returns GO/NO-GO; revise and rerun after NO-GO. | Human owner | Before video/public-claim lock |
| EXP-P3-04 | SAFE-01, WEB-02–03 | Worst-case digital playback and transitions remain controlled. | Before first user-facing Phase 10 audio | Worst-case assets; start, switch, resume and stop sweep with observed output. | Zero clipping/non-finite output/ceiling overshoot; low-volume instruction; effective stop. | Any uncontrolled level, invalid output or failed stop. | Block public playback until corrected. | Primary Codex task | Before first user-facing Phase 10 audio |
| EXP-P3-05 | WEB-01–03, PERF-01 | Mandatory journey works in the claimed environment matrix. | Phase 9 shell smoke; Phase 10 product/runtime check | Full primary/secondary desktop runs and current-mobile smoke. | 100% mandatory claimed cases pass. | Any claimed mandatory case fails. | Narrow support claims or correct and rerun. | Primary Codex task | Before Phase 10 acceptance |
| EXP-P3-06 | CRED-02 | Audible and visual states remain semantically and temporally aligned. | Phase 10 first-proof gate | Captured shared-state events and timing trace. | Correct order and predeclared threshold on every tested transition. | Any mismatch, wrong order or threshold breach. | Simplify visual representation or correct synchronization. | Primary Codex task | Before Phase 10 first-proof gate |
| EXP-P3-07 | PROD-02, CLAIM-02, CRED-05, SEC-01 | Manual thresholds drive real output without hidden preset substitution or retention. | Phase 10 first-proof gate | Two distinct manual profiles plus preset; input/output and session-retention trace. | Corresponding real change, no nearest-preset substitution, no raw persistence. | Ignored input, generic output, substitution or retained raw data. | Block manual path and change approach. | Primary Codex task | 18 Jul proof; final by 20 Jul |
| EXP-P3-08 | CRED-03–05, DEMO-03 | Same-source A/B and one-sided/bilateral differences are genuine and audible. | Phase 10 first-proof gate; repeat for Phase 10 acceptance | Source identity, objective comparisons and structured listening across required states. | Exact source relationship and meaningful distinction beyond gain. | Different source, decorative state or indistinguishable result. | Change approach; do not claim mandatory proof. | Primary Codex task | Before Phase 10 first-proof gate and Phase 10 acceptance as applicable |
| EXP-P3-09 | PROD-04 | Both interventions change audio, visual state and explanation coherently. | Phase 10 first-proof gate for slice; Phase 10 acceptance for both interventions | TV-off and speaker-position before/after traces. | Both interventions pass all three channels. | Any decorative or contradictory channel. | Repair before mandatory acceptance. | Primary Codex task | Before Phase 10 acceptance; ≤20 Jul |
| EXP-P3-10 | AI-01, AI-03, DEMO-01 | Live GPT path is reliable, grounded and truthfully represented. | Phase 10 acceptance and pre-demo validation | Twenty fresh runs across supported desktop evidence, plus mobile smoke. | ≥19 live successes, 0 false-live, 0 dead ends, explanation p95 ≤10s. | Any threshold failure. | Use honest degraded state; live acceptance remains blocked. | Primary Codex task | Before Phase 10 acceptance and pre-demo validation |
| EXP-P3-11 | AI-02, DEMO-01, SCENE-01 | Optional media generation can be removed without breaking the core. | Phase 10 after mandatory critical chain; before optional-image exposure | Disable all optional live image/audio generation and execute the mandatory journey. | Core completes with validated media and live GPT intelligence. | Any mandatory step depends on disabled optional generation. | Remove or redesign the optional dependency. | Primary Codex task | Before optional-image exposure |
| EXP-P3-12 | SEC-01–02 | Session data and service credentials remain outside persistence, logs and public artifacts. | Phase 9 static secret/public-repository checks; Phase 10 runtime/session check | Representative session plus persistence, log, network and public-client inspection. | No raw profile/context retention and no secret/client privileged key. | Any raw-data or secret exposure. | Block public testing/deployment. | Primary Codex task | Before public testing/deployment |
| EXP-P3-13 | UX-02 | Mandatory states remain reachable and understandable with accessibility alternatives. | Phase 10 | Keyboard, text status, captions/transcript, reduced motion and non-audio cues. | All mandatory states pass. | Any mandatory inaccessible state. | Add/simplify alternatives and rerun. | Primary Codex task | Before Phase 10 acceptance |
| EXP-P3-14 | IP-01–03 | Every public asset has complete applicable provenance and rights evidence. | Asset selection | Per-asset origin, author/tool, terms/version, modification, consent and attribution. | 100% of used assets pass. | Any missing or incompatible evidence. | Remove or replace the asset. | Primary Codex task; owner resolves ambiguity | Before each asset is public |
| EXP-P3-15 | DEMO-02, SEC-02 | A clean judge can reach the product without developer credentials. | Phase 10 | Three cold anonymous runs per claimed environment. | Main journey reachable, no judge key and no secret exposure. | Any access dead end or credential requirement. | Correct or use another approved compliant route. | Primary Codex task | Before submission; maintain through judging |
| EXP-P3-16 | DEMO-03, UX-02, DOC-01, SCENE-01 | The public stream preserves auditory proof and truthful explanation. | Phase 10 | Uploaded stream on two desktops, mobile, headphones and built-in output; owner plus ≥3 listeners. | Required differences audible; voice/captions clear; claims supported. | Any required proof unclear or unsupported. | Simplify, re-record and re-upload. | Human owner | Before final video approval |
| EXP-P3-17 | COMP-01–03, DOC-01 | The submission package satisfies every current binding requirement. | Submission preparation | Current official `MUST` checklist covering repository/access, license, README/setup, video, URLs, `/feedback` and disclosures. | Zero missing binding items. | Any unresolved mandatory item. | Correct before submission; no invented evidence. | Primary Codex task; human owner submits | Freeze and immediately before 22 Jul 02:00 |
| EXP-P3-18 | PROD-01, PROD-03, TIME-01–03 | Scope and submission windows remain protected. | Phase 4 | Daily evidence review against first-proof, cutoff, freeze and submission milestones. | First proof by 18 Jul; no new capability after 20 Jul; hardening freeze 21 Jul; submit by 22 Jul. | Any missed gate or optional work preceding the core. | Stop optional/non-blocking work and request owner recovery decision. | Primary Codex task | Daily through submission |

## 11. Phase-gate requirements

### Before Phase 4 completion

Phase 4 must:

- select a vertical slice that exposes the primary gating risks;
- define observable acceptance for real manual input, transformation, same-source A/B, support difference, digital safety, visual state, live GPT grounding and honest failure;
- preserve the optional-media kill-test boundary;
- avoid assuming that any unexecuted experiment has passed.

Phase 4 must not select architecture or dependencies belonging to later phases.

### Before Phase 5 approval

The system-design decision must not proceed with an unresolved assumption that:

- manual input can drive real processing;
- the simulation evidence standard can be satisfied;
- browser or output-chain behavior is uniform;
- cached output can be represented as live;
- raw user input requires persistence;
- optional media generation is mandatory.

Exact architecture and technology remain `OUT OF PHASE — revisit in Phase 5`.

### Phase 10 first-proof gate

At minimum, execute the applicable portions of:

- `EXP-P3-01`
- `EXP-P3-02`
- `EXP-P3-04`
- `EXP-P3-05`
- `EXP-P3-06`
- `EXP-P3-07`
- `EXP-P3-08`
- `EXP-P3-09`
- `EXP-P3-10`
- `EXP-P3-11`
- `EXP-P3-12`

The first real end-to-end critical-chain proof is due by July 18, 2026, 02:00 CEST.

### Phase 10 acceptance

Complete and pass:

- all mandatory-profile and manual-input evidence;
- `EXP-P3-03`
- final environment evidence from `EXP-P3-05`
- `EXP-P3-13`
- applicable public-route evidence from `EXP-P3-15`
- all mandatory unresolved Phase 10 first-proof experiments.

No new capability may begin after July 20, 2026, 02:00 CEST.

### Pre-demo and submission

Complete:

- `EXP-P3-14`
- `EXP-P3-15`
- `EXP-P3-16`
- `EXP-P3-17`
- `EXP-P3-18`

Capability hardening freeze is July 21, 2026, 02:00 CEST. Submission deadline is July 22, 2026, 02:00 CEST.

## 12. Risk-to-product-commitment traceability

| Product commitment | Related risks | Required evidence | Latest safe gate |
|---|---|---|---|
| Complete, truthful Family Experience | PROD-01, PROD-03, DEMO-01, TIME-02–03 | Integrated journey plus surface/status audit | Phase 10 and cutoff |
| Three synthetic profiles | CRED-01, CRED-05, CLAIM-02 | Deterministic fixtures and structured listening | Phase 10 |
| Real manual audiogram path | PROD-02, CRED-01, CRED-05, SEC-01 | Input/output trace for distinct profiles | First proof and Phase 10 |
| Honest same-source A/B | CRED-02–03, DEMO-03 | Source identity, sync and public listening | Phase 10 first-proof gate/video lock |
| One-sided and bilateral support | CRED-04–05, WEB-03 | Objective and listening distinction | Phase 10 |
| Two functional interventions | PROD-04, CRED-02, UX-01 | Coherent audio/visual/explanation evidence | Phase 10 |
| Data-derived visual proof | CRED-02, UX-02 | Shared-state trace and accessible alternative | Phase 10 |
| Live GPT intent/structure/explanation | AI-01, AI-03, DEMO-01 | Twenty fresh grounded runs | Phase 10 acceptance and pre-demo validation |
| Optional live media generation | AI-02, SCENE-01, DOC-01 | Kill test and truthful state labelling | Before exposure |
| Digital audio safety | SAFE-01, WEB-02–03 | Worst-case output and transition sweep | Before user audio |
| Supported browser/device environment | WEB-01–03, PERF-01, DEMO-02 | Observed environment matrix | Phase 10 |
| Educational non-clinical boundary | CLAIM-01–02, UX-01, DOC-01 | Independent comprehension GO | Video/public lock |
| Session-only data handling | SEC-01–02 | Persistence/log/network inspection | Before public testing |
| Public asset rights | IP-01–03 | Complete per-asset provenance | Before public inclusion |
| Under-three-minute submission proof | DEMO-03, COMP-01–03, DOC-01 | Public stream and submission audit | Before submission |
| Controlled expansion and schedule | PROD-03, TIME-01–03 | Daily milestone and scope evidence | 18/20/21/22 July gates |

Every mandatory product commitment has at least one related risk and validation path.

## 13. Risks that must shape Phase 4

| Priority | Risk IDs | What the vertical slice must prove | What Phase 4 must not assume |
|---|---|---|---|
| Primary | PROD-02, CRED-01, CRED-03, SAFE-01, AI-01, DEMO-01, TIME-01 | Real manual input, real transformation, honest same-source proof, digital safety, live grounded GPT and one complete chain | That any component-level demo proves the integrated journey |
| Secondary | CRED-02, CRED-04, CRED-05, WEB-02, WEB-03, PROD-04, SCENE-01 | Synchronized states, genuine support distinction, understandable output, lifecycle recovery, coherent intervention and viable scene media | That louder means better, that devices are uniform, or that optional media is mandatory |
| Boundary constraints | CLAIM-01–02, SEC-01–02, AI-03, DOC-01 | Claims, data state and live/reused status remain explicit throughout the proof | That these concerns can be added only after implementation |

Phase 4 must choose the actual slice. This document defines only the risk evidence it must expose.

## 14. Deferred architecture and dependency questions

- Vertical-slice selection: `OUT OF PHASE — revisit in Phase 4`.
- Frontend/backend framework and programming language: `OUT OF PHASE — revisit in Phase 5`.
- Audio-processing topology and exact simulation algorithm: `OUT OF PHASE — revisit in Phase 5`.
- API transport, trust boundary and persistence mechanism: `OUT OF PHASE — revisit in Phase 5`.
- Browser lifecycle implementation: `OUT OF PHASE — revisit in Phase 5`.
- Exact GPT endpoint, model identifier and orchestration: `OUT OF PHASE — revisit in Phase 5`.
- Exact image/audio generation tool and service boundary: `OUT OF PHASE — revisit in Phase 5`.
- Deployment platform: `OUT OF PHASE — revisit in Phase 5`.
- Dependency selection and approved versions: `OUT OF PHASE — revisit in Phase 6`.
- Exact tolerances and executable test implementation: later acceptance phases after the corresponding design decision.

Current official OpenAI documentation confirms GPT-5.6 hosted image-generation support and separate image/audio model families. It does not currently confirm the exact general sound-scene generation path described conceptually by the owner. Because P3-D16 makes that capability optional, this uncertainty does not block the mandatory product.

## 15. Decision ledger

| ID | Decision |
|---|---|
| P3-D01 | Safety, binding compliance, security and product truth are non-waivable blockers. |
| P3-D02 | Build Week credibility uses objective evidence plus structured internal listening; production would need expert-grade validation. |
| P3-D03 | Demo safety validates digital controls and warnings; full playback-chain validation is a future production requirement. |
| P3-D04 | Require primary and secondary desktop evidence plus current-mobile smoke; claim only observed support. |
| P3-D05 | Live failure receives a transparent friendly degraded state; it does not satisfy live acceptance. |
| P3-D06 | A genuine internally validated result may become `Functional`; residual limitations remain explicit. |
| P3-D07 | Owner conducts the comprehension audit with at least three independent people and returns GO/NO-GO. |
| P3-D08 | First real end-to-end proof is due July 18, 2026, 02:00 CEST. |
| P3-D09 | First proof exposes real input, transformation, A/B, support, safety, visual state, live GPT and outage truth. |
| P3-D10 | Reliability gate: 20 fresh runs, ≥19 live successes, 0 false-live, 0 dead ends, explanation p95 ≤10 seconds. |
| P3-D11 | GPT-5.6 is the only mandatory model-service dependency; other services must pass a kill test. |
| P3-D12 | Manual profile and context are session-only; raw values do not enter logs or history. |
| P3-D13 | Every asset requires individual provenance evidence. |
| P3-D14 | Hardening freeze is July 21, 2026, 02:00 CEST. |
| P3-D15 | Public uploaded-video proof covers two desktops, current mobile, headphones, built-in output and independent listeners. |
| P3-D16 | Live image/audio generation may be optional `Experimental`; mandatory Family Experience uses validated media. |

## 16. Accepted, blocked and residual risk

Current owner-accepted risks: none.

Current `ACCEPTED WITHIN APPROVED TASK SCOPE` risks: none.

Current `BLOCKER` risks: none before execution of the defined gates.

All 37 risks are currently `DEFERRED` with an owner, experiment or review trigger and deadline.

A failed mandatory experiment may transition its related risk to `BLOCKER`.

Only the human owner may accept a `HIGH` or `CRITICAL` residual risk. In particular:

- Demo-level internal credibility evidence does not establish production-grade audiological validation.
- Digital-output checks do not establish safety across uncontrolled physical playback chains.
- A passing service sample does not guarantee future external availability.
- A passing device matrix supports only the observed environments.
- A passing comprehension sample does not represent every user.

Proceeding to a later approved phase does not itself accept these risks.

## 17. No-safe-fallback risks

Direct no-safe-fallback risks:

- `RISK-PROD-02`
- `RISK-CRED-01`
- `RISK-CRED-03`
- `RISK-CRED-04`
- `RISK-SAFE-01`
- `RISK-TIME-02`

For these risks, failure requires the scope or approach to change before the stated deadline.

`RISK-CLAIM-01` and `RISK-CLAIM-02` also have no safe fallback when the misleading claim is inherent to the selected approach. Removable wording may instead be corrected and revalidated.

## 18. Change-control rules

- Risk IDs are stable and must not be recycled.
- A new risk receives a new category ID.
- A changed score, confidence, disposition, fallback or deadline must record the evidence and decision that caused the change.
- A planned mitigation cannot become `MITIGATED` until observed evidence passes.
- `HIGH` or `CRITICAL` acceptance requires explicit human-owner approval.
- A failed mandatory gate must not be hidden by rewriting the earlier assessment.
- Product-scope changes belong in the approved canonical decision location, not silently in this risk map.
- Architecture, dependencies and vertical-slice decisions must occur only in their required phases.
- The protected baseline and product-freeze documents remain unchanged.

## 19. Phase status

Phase 3 is complete, validated, published and approved by the human owner.

All identified risks remain governed by their recorded dispositions, experiment triggers and decision deadlines. Phase completion does not imply that any deferred experiment has passed or that any risk has been mitigated.

No validation experiment in this document has yet been executed.

Phase 4 has not been started.
