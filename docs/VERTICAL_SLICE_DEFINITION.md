# Auralis Vertical Slice Definition

**Status:** Decision-complete Phase 4 definition; acceptance evidence not executed  
**Definition date:** July 14, 2026  
**Owner decisions:** P4-D01 through P4-D14 approved on July 14, 2026  
**Selected slice:** Manual-Audiogram Critical-Chain Family Slice with Profile Choice  
**First genuine proof deadline:** July 18, 2026, 02:00 CEST  
**Product boundary:** Educational and illustrative; not diagnostic, clinical, prescriptive or device-fitting guidance

## 1. Purpose

This document defines one technology-neutral vertical slice for Auralis.

The slice is an experiment definition and acceptance contract. It identifies the exact user action, input, functional sequence, terminal result, future evidence, failure conditions, risk coverage and Phase 5 constraints required for the first genuine end-to-end proof.

This document does not:

- implement the slice;
- select architecture or technology;
- define modules, dependencies or a file tree;
- execute an experiment;
- claim that any acceptance criterion has passed;
- change the Product Freeze or Risk Map;
- start Phase 5.

## 2. Authority

Authority interpretation follows `AGENTS.md`.

Verified Official Rules and official program terms remain the highest external authority.

The immutable repository sources retain their established order:

1. `docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md`
2. `docs/Auralis_preparation_final.md`
3. `docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md`

Within the first document, `MUST` and `CONDITIONAL MUST` items and facts supported by current official sources are binding. `OFFICIAL SHOULD`, `PROJECT SHOULD` and `INFO` items remain advisory unless explicitly adopted by the owner.

The following approved derived documents apply without overriding the immutable sources:

- `docs/PRODUCT_FREEZE_VALIDATION.md` defines the current frozen product contract.
- `docs/RISK_MAP.md` defines the risk, experiment and evidence constraints.
- P4-D01 through P4-D14 are explicit human decisions for this phase.

If this document conflicts with a higher authority, the higher authority controls and the conflict must be surfaced rather than silently reconciled.

## 3. Selected vertical slice

The selected slice is:

**Manual-Audiogram Critical-Chain Family Slice with Profile Choice**

It begins when a family member chooses exactly one of four hearing-profile input modes:

- `High-frequency hearing loss`
- `Flat hearing loss`
- `Asymmetric hearing loss`
- `Enter an audiogram`

The first three options are predefined synthetic demo audiograms. `Enter an audiogram` opens a guided manual path that assumes no prior audiogram knowledge.

Every option must enter the same real Family Experience pipeline. A preset must not be a decorative shortcut, prepared output or substitute for manual-processing evidence.

The mandatory uninterrupted main proof selects `Enter an audiogram`, changes the specified left- and right-ear thresholds and confirms the profile. Focused branch evidence separately validates all three predefined profiles.

It continues through:

- real manual-profile state creation;
- live GPT-5.6 scene intelligence;
- controlled user-started playback;
- same-source reference and transformed comparison;
- hearing-profile, one-sided and bilateral states;
- data-derived visible state;
- the `turn off the television` intervention;
- grounded live explanation;
- a dedicated terminal completion state.

A separate controlled outage run proves the honest degraded state.

The main live journey must pass in one uninterrupted fresh run. Focused technical evidence may be captured separately, but it may not replace a missing user-facing core step.

## 4. Why this slice

### Candidate comparison

| Candidate | Starting user action | Ending user result | Risks exposed | Risks missed or weakly exposed | Relative scope | Earliest proof potential |
|---|---|---|---|---|---|---|
| Preset-first Family slice | User selects a synthetic preset | Complete support and intervention result | CRED-02–05, SAFE-01, AI-01, DEMO-01 | Critically weak on PROD-02, SEC-01 and manual no-substitution proof | Medium | Fast, but not sufficient |
| Manual-Audiogram Critical-Chain Family Slice with Profile Choice | User chooses a predefined synthetic profile or guided manual entry; the main proof edits and confirms manual left- and right-ear thresholds | Dedicated completion state after full Family Experience | All primary Phase 4 risks plus preset-routing, novice-comprehension and boundary risks | Does not complete the broader final product | Medium-high | Fastest credible integrated proof with accessible entry |
| Minimal manual audio-comparison slice | User edits and confirms thresholds | Reference versus transformed A/B result | PROD-02, CRED-01, CRED-03, SAFE-01 | Weak on support, intervention, live explanation, terminal result and DEMO-01 | Small | Fastest component proof, not a sufficient vertical slice |

The preset-first candidate remains rejected as the primary critical proof because it bypasses the highest-priority manual-personalisation risk. It is not rejected as a user-facing input option.

The three predefined profiles are included because a novice must not be forced into unexplained manual entry. Each preset is a genuine functional branch, while the manual path remains mandatory evidence and receives the uninterrupted main acceptance run.

The minimal comparison candidate was rejected because it ends before the complete product payoff and could pass while the integrated Family Experience remains broken.

The selected slice maximizes risk retired per unit of time because it exposes every primary gating risk in one coherent journey while excluding the broader final-product surface.

## 5. Hypothesis

A family member with no prior audiogram knowledge can choose one of three explained synthetic demo audiograms or complete a guided manual audiogram path and then complete one truthful, safe and understandable Family Experience.

The selected profile must drive a genuine same-source audible and visual comparison. The mandatory manual proof must demonstrate that actual entered values—not a preset substitution—drive the result. One-sided and bilateral modelled support must produce real differences, turning off the television must produce a coherent audio, visual and explanation change, GPT-5.6 must contribute live grounded intelligence, and every failure must remain honestly represented without a dead end or false-live claim.

The hypothesis is false if any mandatory acceptance criterion fails.

## 6. Primary user and context

The primary user is a family member, partner or close person of someone with hearing loss.

The slice uses the frozen Family Experience context:

- first-person perspective of a seventy-year-old father;
- family dinner;
- five people;
- television noise;
- kitchen activity;
- overlapping speech.

The experience remains educational and illustrative. It does not claim to reproduce an individual person's exact hearing, diagnose a condition, recommend a device or predict individual benefit.

## 7. Preconditions

Before a future acceptance run:

1. The run uses one explicitly recorded primary desktop environment and one explicitly recorded headphone/output chain.
2. The user receives a clear low-volume instruction before playback.
3. A validated family-dinner source scene is available with applicable provenance and reuse rights.
4. The source scene can be used without mandatory live image or ambient-sound generation.
5. GPT-5.6 is available for the main live run.
6. A separate controlled outage condition can be established before the outage run without developer intervention inside the user journey.
7. The synthetic manual profile contains no real person's data.
8. Manual values and scene context remain session-only and do not enter logs, history or public artifacts.
9. Input bounds, missing-value handling and supported frequencies have been defined before execution.
10. Evidence capture can observe the input, state transitions, outputs, live/degraded status, safety state and terminal result.
11. The objective distinguishability metric and its threshold have been declared before the experiment and cannot be selected after seeing the result.
12. No acceptance criterion is presumed to have passed.
13. The profile selector offers exactly the four approved input choices and no misleading diagnostic or prevalence claims.
14. The exact left- and right-ear fixtures for all three predefined profiles, their explanations and their limitations are disclosed and frozen before execution.
15. The manual path contains novice orientation and can generate a truthful change-specific explanation from the actual edited values.

## 8. Exact starting action

The slice starts when the user chooses exactly one of:

1. `High-frequency hearing loss`
2. `Flat hearing loss`
3. `Asymmetric hearing loss`
4. `Enter an audiogram`

The mandatory main critical-proof run selects `Enter an audiogram`, completes the novice orientation, changes at least one left-ear and one right-ear threshold and explicitly confirms the profile for the Family Experience.

Each predefined option must load its exact synthetic left/right fixture and enter the same real Family Experience pipeline.

The slice does not start with:

- page load;
- an internal request;
- a developer command;
- a preset control that does not drive the real transformation;
- an existing processed result;
- a prepared output presented as personalised processing.

## 9. Input contract

### Profile-choice contract

The selector offers exactly four truthful choices:

- three named predefined synthetic demo audiograms;
- one guided manual-entry option.

Every choice must:

- create an explicit current session profile;
- preserve separate left- and right-ear values;
- drive the same real audio and data-derived visual pipeline;
- expose its synthetic or user-entered nature;
- avoid diagnostic, prevalence, prognosis or treatment claims;
- permit continuation through the Family Experience without a dead end.

### Predefined demo-audiogram contract

Each predefined profile must:

- have a separate frozen left/right threshold fixture;
- provide a plain-language description of its shape and illustrative purpose;
- state that it is synthetic and not a diagnosis or claim of prevalence;
- produce an input-correlated audible result;
- produce the corresponding data-derived visible state;
- remain distinguishable from a generic effect, prepared result and the other profiles.

Focused evidence must validate every predefined profile. Four duplicate complete live acceptance runs are not required for the first proof, because the full downstream journey is proven by the mandatory manual run.

### Guided manual-audiogram contract

The user is shown a fully editable profile labelled:

`Synthetic manual test profile`

It is not labelled as one of the three named presets and does not receive an automatic diagnostic or configuration label.

The manual path assumes that the user has never seen an audiogram. Before editing, it must explain:

- what an audiogram represents and what it does not establish;
- how left and right ears are represented;
- that frequencies progress from lower to higher pitch and are expressed in Hz or kHz;
- that threshold values are expressed in dB HL and are not playback-volume settings or safe-listening recommendations;
- that each value represents one ear at one frequency;
- that a higher entered threshold models reduced sensitivity at that frequency for this illustrative transformation;
- how editing a point affects the current profile, audio transformation and visible state;
- that the result is illustrative and cannot reproduce exact individual perception, provide a diagnosis or prescribe support.

The main demo uses this exact edit set:

| Frequency | Left-ear change | Right-ear change |
|---|---:|---:|
| 2 kHz | 25 → 45 dB HL | 25 → 35 dB HL |
| 4 kHz | 25 → 60 dB HL | 25 → 45 dB HL |

All other displayed values remain unchanged during the main run.

The complete surrounding fixture must be disclosed and frozen before execution. It must not be changed after observing a failed result merely to obtain a pass.

The exact edit values are synthetic falsification inputs only. They do not describe a person, diagnosis, prevalence, cause, prognosis or clinical recommendation.

The input path must:

- keep left and right values separate;
- validate supported frequencies and conservative bounds;
- handle missing or invalid values clearly;
- show the affected ear, frequency and before/after value after every edit;
- derive a plain-language change preview from the actual entered values;
- describe only the expected illustrative processing effect and its limitations;
- require explicit confirmation;
- create the current session profile from the confirmed manual values;
- make the confirmed manual values the real source of the transformation;
- avoid nearest-preset substitution;
- avoid raw-value persistence.

Focused evidence must additionally use a second distinct valid manual profile and all three predefined profile fixtures.

All three preset paths are user-facing functional alternatives. They do not replace the mandatory manual proof.

## 10. Functional end-to-end sequence

The future main live run must execute this sequence without developer intervention inside the flow:

1. The user sees the four approved input choices.
2. For the mandatory main proof, the user chooses `Enter an audiogram`.
3. The product provides the complete novice audiogram orientation defined in Section 9.
4. The product presents the editable `Synthetic manual test profile`.
5. The user makes the exact 2 kHz and 4 kHz left/right changes defined in Section 9.
6. The product shows a change-specific preview derived from the actual edited ears, frequencies and values.
7. The product validates the input without interpreting or diagnosing it.
8. The user explicitly confirms the profile for the Family Experience.
9. The confirmed manual values become the current session profile and actual transformation source.
10. GPT-5.6 creates or adapts the family-dinner scene intent and structured scene state live for this run.
11. The product associates that structured intelligence with one validated reusable family-dinner source scene.
12. The user receives the low-volume instruction and explicitly starts playback.
13. The user hears the reference state.
14. The user hears the hearing-profile state over the same underlying source.
15. The user hears left-ear one-sided modelled support over the same profile, source and scene state.
16. The user hears bilateral modelled support over the same profile, source and scene state.
17. The data-derived visible state follows the actual profile, transformation and support state throughout the comparison.
18. The user selects `Turn off the television`.
19. The television contribution changes coherently in the audio state, visible scene state and subsequent explanation.
20. GPT-5.6 produces a live grounded non-prescriptive explanation based on the actual manual profile, scene state, support state, intervention state and verified result.
21. The user reaches the dedicated terminal completion state.
22. A stop or mute control remains available throughout audible playback.

The outage proof is a separate run defined in Sections 17 and 20.

## 11. Terminal visible result

The successful main run ends in a dedicated completion state.

The completion state must show:

- the selected input mode and profile identity;
- that the manual profile was confirmed;
- that reference and hearing-profile states were compared over the same source;
- that one-sided and bilateral support were completed;
- that the television was turned off and the intervention affected the result;
- the truthful live status;
- the grounded explanation;
- a concise statement of what changed;
- a concise statement of what the result does not claim;
- at least one useful non-prescriptive action;
- a deliberate option to repeat the experience.

The completion state must not claim diagnosis, exact individual perception, guaranteed benefit or device performance.

For a predefined-profile branch, the completion state identifies the profile as a synthetic demonstration. For the mandatory main run, it identifies the input as the confirmed manual profile.

The degraded run may reach a separate honest terminal state that says the deterministic comparison was available but the live explanation was unavailable. That state must expose retry and must not count as a successful live completion.

Final user-facing copy and visual design remain deferred.

## 12. In-slice capabilities

The first critical-chain proof includes only:

- exactly four hearing-profile input choices;
- three predefined synthetic demo audiograms as functional input branches;
- plain-language descriptions and limitations for the predefined profiles;
- editable manual audiogram input;
- novice audiogram orientation;
- change-specific explanation derived from actual manual edits;
- explicit confirmation;
- session-only current profile;
- one validated family-dinner source scene;
- live GPT-5.6 scene intent and structured scene contribution;
- explicit user-started playback;
- low-volume instruction;
- reference state;
- hearing-profile state;
- left-ear one-sided modelled support;
- bilateral modelled support;
- data-derived visible state;
- `turn off the television` intervention;
- grounded live explanation;
- stop or mute behavior;
- dedicated completion state;
- transparent degraded state and retry;
- evidence surfaces required to prove the slice;
- focused routing and transformation evidence for each predefined profile.

## 13. Out-of-slice capabilities

The following are outside the first critical-chain proof:

- four duplicate uninterrupted complete live acceptance runs, one for every input mode;
- the `move the main speaker closer or in front` intervention;
- directional support implementation;
- a second complete Family Experience;
- broad Hearing Hub;
- Guided Hearing Check;
- Personal Support Preview;
- image or PDF audiogram extraction;
- source-audio upload;
- native application;
- HealthKit;
- clinic workflow;
- marketplace or sharing;
- accounts, history or long-term profile persistence;
- live image generation as a mandatory dependency;
- live ambient-sound generation as a mandatory dependency;
- final submission video;
- final visual polish;
- full cross-browser certification;
- production-grade physical playback-chain safety validation;
- production-grade audiological or clinical validation.

The second intervention remains a mandatory final-product commitment.

The three functional preset profiles are now included in this slice as genuine input branches. Repeating the complete live acceptance journey separately for every input mode remains a later final-product validation requirement.

If directional support is visible, it must remain `In preparation` unless it produces a genuine result and qualifies for a truthful stronger state.

## 14. Acceptance criteria

Every criterion below is currently `NOT EXECUTED`.

Phase 4 defines future evidence only. It does not mark any criterion as passed or change any Risk Map disposition.

### Input, source and transformation

| ID | Criterion | Reason | Observable evidence | Pass condition | Fail condition | Related risks | Related experiment | Earliest execution | Blocking status |
|---|---|---|---|---|---|---|---|---|---|
| VS-AC-01 | Real manual edit | Exposes personalisation truth | Recorded exact 2/4 kHz edits and resulting current profile | Exact left/right edits are accepted into the current manual profile | Values are ignored, read-only or replaced by prepared state | PROD-02, CRED-05 | EXP-P3-07 | Phase 9 | BLOCKING — NO SAFE FALLBACK |
| VS-AC-02 | Explicit confirmation | Prevents unapproved input use | Input and state-transition trace | No profile is applied before confirmation; exact profile is applied after confirmation | Processing starts before confirmation or confirmation changes values | PROD-02, DEMO-01 | EXP-P3-01, EXP-P3-07 | Phase 9 | BLOCKING |
| VS-AC-03 | Valid input handling | Prevents ambiguous or unsafe input state | Valid, invalid and missing-value cases | Valid input proceeds; invalid or missing input is deliberately blocked with a clear neutral message | Invalid input proceeds, fails silently or receives a diagnostic interpretation | PROD-02, CLAIM-02, UX-01 | EXP-P3-07 | Phase 9 | BLOCKING |
| VS-AC-04 | No diagnostic labelling | Preserves the non-clinical boundary | Visible labels, explanation and claim inventory | Manual data remains neutrally described as user-supplied or synthetic profile data | A diagnosis, prognosis or automatic condition label appears | CLAIM-01, CLAIM-02, DOC-01 | EXP-P3-03, EXP-P3-07 | Phase 9 for surface; Phase 10 for comprehension | BLOCKING BEFORE PUBLIC CLAIM |
| VS-AC-05 | Input-to-output traceability | Proves actual processing | Confirmed values, current state and output trace | The confirmed values can be traced to the applied transformation and output | Output cannot be attributed to the confirmed input | PROD-02, CRED-01, CRED-05 | EXP-P3-07 | Phase 9 | BLOCKING — NO SAFE FALLBACK |
| VS-AC-06 | No nearest-preset substitution | Prevents fake personalisation | Two distinct manual profiles plus all three predefined-profile traces | Distinct manual values produce corresponding distinct states and outputs without hidden replacement by any predefined profile | A manual profile selects a nearest preset, generic effect or prepared output | PROD-02, CRED-05 | EXP-P3-07 | Phase 9 | BLOCKING — NO SAFE FALLBACK |
| VS-AC-07 | One validated family scene | Provides a stable critical source | Scene identity and asset-provenance evidence | One rights-cleared family-dinner source supports the complete core run without optional live media | Core lacks a valid source or requires optional generated media | AI-02, SCENE-01, IP-02 | EXP-P3-01, EXP-P3-11, EXP-P3-14 | Asset selection and Phase 9 | BLOCKING |
| VS-AC-08 | Exact same-source relationship | Makes A/B honest | Source identity and state-transition trace | Reference, hearing-profile and support states use the exact same underlying source until the intentional TV-off change | A comparison substitutes or regenerates the source | CRED-03, DEMO-03 | EXP-P3-08 | Phase 9 | BLOCKING — NO SAFE FALLBACK |
| VS-AC-09 | Real transformed output | Prevents decorative UI proof | Objective input/output comparison | The manual profile causes a reproducible transformed result | Only labels or visuals change, or output remains generic | CRED-01, CRED-05, PROD-02 | EXP-P3-02, EXP-P3-07 | Phase 9 | BLOCKING |
| VS-AC-10 | Distinguishability beyond overall loudness | Establishes demo-level credibility | Predeclared level-normalized objective comparison and structured listening | Objective structure differs after overall-gain normalization; owner identifies each required pair in ≥4/5 randomized trials for first proof; before Phase 10, ≥3 independent listeners each achieve ≥4/5 | Output differs only by overall level, misses the declared metric or misses either listening threshold | CRED-01, CRED-05, WEB-03 | EXP-P3-02, EXP-P3-08 | Phase 9; independent confirmation by Phase 10 | BLOCKING — NO SAFE FALLBACK if credibility cannot be achieved |

Required listening pairs are:

- reference versus hearing-profile state;
- hearing-profile versus one-sided support;
- one-sided versus bilateral support;
- TV-on versus TV-off.

These thresholds are demo-level evidence, not clinical validation.

### Support, visibility and playback safety

| ID | Criterion | Reason | Observable evidence | Pass condition | Fail condition | Related risks | Related experiment | Earliest execution | Blocking status |
|---|---|---|---|---|---|---|---|---|---|
| VS-AC-11 | Genuine one-sided support | Proves ear-specific support | Channel-specific output and visible-state trace | Left-ear support produces a real coherent ear-specific result over the unchanged source | The state is decorative, bilateral or only a label | CRED-04, CRED-05 | EXP-P3-08 | Phase 9 | BLOCKING — NO SAFE FALLBACK |
| VS-AC-12 | Genuine bilateral support | Proves the required support progression | Bilateral output and comparison trace | Both ears receive a real coherent result distinguishable from one-sided support | Bilateral output is decorative or indistinguishable from one-sided support | CRED-04, CRED-05, WEB-03 | EXP-P3-08 | Phase 9 | BLOCKING — NO SAFE FALLBACK |
| VS-AC-13 | Synchronized data-derived visible state | Prevents decorative visualization | Shared-state events and timing trace | Every profile, support and intervention transition shows the correct data-derived state in the correct order within a predeclared threshold | Visible state is wrong, decorative, stale or outside the threshold | CRED-02, UX-02 | EXP-P3-06 | Phase 9 | BLOCKING |
| VS-AC-14 | Controlled user-started playback | Satisfies safety and browser-lifecycle truth | User gesture, low-volume instruction and playback trace | Playback begins only after the instruction and explicit user action | Playback autostarts, bypasses instruction or requires developer action | SAFE-01, WEB-02 | EXP-P3-04 | Phase 9 | BLOCKING |
| VS-AC-15 | Invalid-output and unsafe-transition rejection | Prevents digital audio harm | Worst-case output and transition measurements | Zero clipping, non-finite output or ceiling overshoot; transitions remain within predeclared controls | Any invalid, clipped or uncontrolled output occurs | SAFE-01, WEB-02, WEB-03 | EXP-P3-04 | Phase 9 before user-facing audio | BLOCKING — NO SAFE FALLBACK |
| VS-AC-16 | Effective immediate stop or mute | Preserves user control | Stop and mute trace during every audible state | Audible output ceases within the predeclared response threshold from every tested state | Stop is missing, delayed beyond the threshold or ineffective | SAFE-01, WEB-02 | EXP-P3-04 | Phase 9 before user-facing audio | BLOCKING — NO SAFE FALLBACK |
| VS-AC-17 | Live GPT structured contribution | Proves live intelligence | Fresh request/response provenance and structured-scene trace | GPT-5.6 freshly creates or adapts scene intent and structured scene state for the run | Contribution is absent, cached, prepared or cannot be attributed to the run | AI-01, AI-03, DEMO-01 | EXP-P3-10 | Phase 9 | BLOCKING FOR LIVE ACCEPTANCE |
| VS-AC-18 | Grounded live explanation | Connects AI output to the real result | Explanation input context and output review | Explanation correctly uses the actual profile, scene, support, intervention and verified result and remains non-prescriptive | Explanation is generic, contradictory, diagnostic, prescriptive or based on a different state | AI-01, AI-03, CLAIM-01, DOC-01 | EXP-P3-03, EXP-P3-10 | Phase 9; comprehension by Phase 10 | BLOCKING FOR LIVE ACCEPTANCE |
| VS-AC-19 | Coherent TV-off intervention | Proves a practical payoff | TV-on/off audio, visible-state and explanation trace | Turning off the TV changes all three channels consistently | Any channel is decorative, unchanged or contradictory | PROD-04, CRED-02, UX-01 | EXP-P3-09 | Phase 9 for slice; both interventions by Phase 10 | BLOCKING FOR THIS SLICE |

### Truthful failure, data and completion

| ID | Criterion | Reason | Observable evidence | Pass condition | Fail condition | Related risks | Related experiment | Earliest execution | Blocking status |
|---|---|---|---|---|---|---|---|---|---|
| VS-AC-20 | Honest degraded state | Prevents a model outage from becoming a deceptive dead end | Separate controlled outage capture | Explicit `Degraded` status appears; deterministic comparison may continue with clearly labelled validated media; live explanation is unavailable; retry works | Outage is hidden, falsely successful or ends accidentally | AI-01, AI-03, DEMO-01 | EXP-P3-10 | Phase 9 | BLOCKING FOR OUTAGE PROOF |
| VS-AC-21 | Zero false-live claims | Preserves submission truth | Status and provenance audit across live and outage runs | No cached, prepared or failed result is labelled live | Any non-live result receives a live label or implication | AI-03, DOC-01 | EXP-P3-10 | Phase 9 | BLOCKING |
| VS-AC-22 | Session-only raw profile behavior | Protects user data and public artifacts | Persistence, log, history, network and public-client inspection | Raw values and context do not persist beyond the session or enter logs/history; no privileged credential reaches the client or repository | Raw data persists, is logged, reused or exposed, or a privileged credential is exposed | SEC-01, SEC-02, PROD-02 | EXP-P3-07, EXP-P3-12 | Phase 9 before public testing | BLOCKING BEFORE PUBLIC TESTING |
| VS-AC-23 | No accidental dead end | Proves a usable end-to-end journey | Uninterrupted main-run capture | Every core step is reachable without developer action, unhandled error or broken route | The user cannot continue or reaches an unhandled error or placeholder | PROD-01, DEMO-01, DEMO-02 | EXP-P3-01, EXP-P3-15 | Phase 9 for core | BLOCKING |
| VS-AC-24 | Optional-media kill-test compatibility | Keeps optional generation outside the critical path | Full run with all optional live image/audio generation disabled | Core completes using validated media and live GPT structured intelligence | Any mandatory step depends on an optional media service | AI-02, DEMO-01, SCENE-01 | EXP-P3-11 | Phase 9 | BLOCKING BEFORE OPTIONAL CAPABILITY EXPOSURE |
| VS-AC-25 | One coherent terminal result | Makes the experiment understandable | Completion-state capture and claim inventory | Dedicated completion state accurately summarizes completed states, live status, intervention, limitations and one non-prescriptive action | Result is missing, contradictory, misleading or a dead end | PROD-01, CLAIM-01, CLAIM-02, DOC-01 | EXP-P3-01, EXP-P3-03 | Phase 9; comprehension by Phase 10 | BLOCKING |
| VS-AC-26 | First genuine proof deadline | Protects the critical schedule | Timestamped integrated evidence and milestone review | Complete first proof exists by July 18, 2026, 02:00 CEST | Proof is absent, incomplete or late | TIME-01, TIME-02, PROD-03 | EXP-P3-18 | Phase 9 | BLOCKING; owner recovery required if missed |
| VS-AC-27 | Truthful first-proof environment | Limits claims to observed evidence | Recorded OS, browser, desktop and headphone/output chain | Full main and outage proof pass on the named primary environment; claims remain limited to it | Environment is not recorded or a broader support claim is made | WEB-01, WEB-03, PERF-01, DEMO-02 | EXP-P3-05 | Phase 9 | BLOCKING FOR CLAIMED ENVIRONMENT |
| VS-AC-28 | Live reliability gate | Prevents a single lucky run from becoming the demo claim | Twenty fresh runs and latency record, plus mobile smoke | ≥19 live successes, zero false-live results, zero unrecoverable dead ends and live-explanation p95 ≤10 seconds | Any threshold fails | AI-01, AI-03, DEMO-01 | EXP-P3-10 | Phase 9 before Phase 10/demo | BLOCKING FOR LIVE `FUNCTIONAL` STATUS |
| VS-AC-29 | Complete attributable evidence chain | Makes the acceptance auditable | Evidence bundle in Section 16 | Every mandatory criterion maps to observed, attributable evidence; focused traces and integrated run agree | Evidence is missing, contradictory, unattributable or assembled from incompatible runs | DEMO-01, DOC-01 | EXP-P3-01 | Phase 9 | BLOCKING |

### Profile choice and novice guidance

| ID | Criterion | Reason | Observable evidence | Pass condition | Fail condition | Related risks | Related experiment | Earliest execution | Blocking status |
|---|---|---|---|---|---|---|---|---|---|
| VS-AC-30 | Exact four-option profile choice | Gives novices a usable entry without weakening manual proof | Selector capture and route trace | Exactly three named synthetic profiles and `Enter an audiogram` are available; every choice enters the same Family Experience pipeline; the main proof remains manual | An option is missing, dead, misleading or substitutes for the mandatory manual proof | PROD-01, PROD-02, PROD-03, DEMO-01, TIME-01 | EXP-P3-01, EXP-P3-07, EXP-P3-18 | Phase 9 | BLOCKING FOR SLICE |
| VS-AC-31 | Three functional predefined inputs | Prevents decorative presets | Frozen fixtures plus input/output and visible-state traces for all three profiles | Every profile loads its exact separate left/right fixture and produces a real, distinguishable audio and data-derived visual result without diagnostic or prevalence claims | A profile is decorative, generic, mapped to the wrong fixture or does not reach the real transformation | CRED-01, CRED-05, CLAIM-02, PROD-01 | EXP-P3-01, EXP-P3-02, EXP-P3-07 | Phase 9; final branch validation by Phase 10 | BLOCKING FOR PRESET CAPABILITY |
| VS-AC-32 | Novice audiogram orientation | Makes manual entry understandable without prior knowledge | Orientation inventory and structured comprehension record | A novice can identify left/right ears, frequency, threshold value, how to edit and the non-clinical limits before confirmation | The path requires prior audiogram knowledge or gives materially misleading guidance | UX-01, CLAIM-01, CLAIM-02, DOC-01 | EXP-P3-03 | Phase 9 for surface; Phase 10 for independent comprehension | BLOCKING BEFORE MANUAL PUBLIC USE |
| VS-AC-33 | Change-specific manual explanation | Connects actual edits to the illustrative result | Before/after values and generated explanation trace | The explanation accurately identifies the edited ear, frequency and value change, describes the expected illustrative processing effect and states its limits | Explanation is generic, mismatched, diagnostic, prescriptive or claims exact perception | CRED-02, CRED-05, CLAIM-01, CLAIM-02, DOC-01 | EXP-P3-03, EXP-P3-06, EXP-P3-07 | Phase 9; comprehension by Phase 10 | BLOCKING FOR GUIDED MANUAL PATH |

## 15. Failure and kill criteria

The slice is unsuccessful when any condition below occurs.

| ID | Failure condition | Classification | Required response | Related risks |
|---|---|---|---|---|
| VS-FC-01 | Manual input is not the actual source of the result | NO SAFE FALLBACK | Stop optional work and change the approach before acceptance | PROD-02, CRED-01 |
| VS-FC-02 | Manual input is replaced by a nearest preset, generic effect or prepared output | NO SAFE FALLBACK | Block the manual path and change the approach | PROD-02, CRED-05 |
| VS-FC-03 | Reference and comparison use different underlying sources without the explicit intervention | NO SAFE FALLBACK | Do not claim A/B proof; restore source identity | CRED-03 |
| VS-FC-04 | Output differs only by overall loudness or fails the declared credibility threshold | NO SAFE FALLBACK | Change the transformation or evidence approach; do not claim demo-level credibility | CRED-01, CRED-05 |
| VS-FC-05 | One-sided and bilateral states are decorative or not genuinely different | NO SAFE FALLBACK | Change the support approach before acceptance | CRED-04, CRED-05 |
| VS-FC-06 | Digital safety cannot be observed or controlled, or clipping, invalid output or failed stop occurs | NO SAFE FALLBACK | Block user-facing playback until corrected and revalidated | SAFE-01, WEB-02, WEB-03 |
| VS-FC-07 | Visible proof is not derived from the same actual state as the audio | REQUIRES PHASE 5 APPROACH CHANGE | Correct or simplify the shared-state and evidence contract, then rerun | CRED-02 |
| VS-FC-08 | Live GPT output is absent, ungrounded or based on a different state | REQUIRES PHASE 5 APPROACH CHANGE | Keep live acceptance blocked and change the live intelligence contract | AI-01, AI-03 |
| VS-FC-09 | Cached or prepared intelligence is labelled as live | REQUIRES PHASE 5 APPROACH CHANGE | Remove the false-live state, audit exposed claims and rerun; escalate to owner if publicly exposed | AI-03, DOC-01 |
| VS-FC-10 | Degraded state presents itself as successful live intelligence | REQUIRES PHASE 5 APPROACH CHANGE | Block live acceptance and correct the degraded-state contract | AI-01, AI-03 |
| VS-FC-11 | Raw manual values persist or enter logs, history or public artifacts | REQUIRES PHASE 5 APPROACH CHANGE | Block public testing; correct the data boundary and inspect exposure | SEC-01, SEC-02 |
| VS-FC-12 | Optional image or sound generation is necessary to complete the core | REQUIRES PHASE 5 APPROACH CHANGE | Remove or redesign the optional dependency | AI-02, SCENE-01 |
| VS-FC-13 | A copy, status-visibility, capture or retry defect occurs while underlying truth, safety and function remain intact | REPARABLE WITHIN SLICE | Apply the smallest correction and rerun affected evidence | PROD-01, DEMO-01 |
| VS-FC-14 | The core state has no valid continuation or requires developer intervention inside the user flow | REQUIRES PHASE 5 APPROACH CHANGE | Correct the journey contract before integrated acceptance | PROD-01, DEMO-01 |
| VS-FC-15 | An attributable end-to-end evidence chain cannot be assembled | REQUIRES PHASE 5 APPROACH CHANGE | Improve observability or simplify the proof before acceptance | DEMO-01, DOC-01 |
| VS-FC-16 | The July 18 first-proof deadline is missed | REQUIRES PRODUCT-SCOPE ESCALATION | Stop optional work and request an owner recovery decision | TIME-01, PROD-03 |
| VS-FC-17 | Mandatory core cannot pass by July 20, 2026, 02:00 CEST | NO SAFE FALLBACK | Owner must change the scope or approach; do not proceed with optional expansion | TIME-02, PROD-03 |
| VS-FC-18 | Structured listening misses the approved threshold | REQUIRES PHASE 5 APPROACH CHANGE | Do not claim distinguishability; change the transformation or comparison approach and rerun | CRED-01, CRED-04, CRED-05 |
| VS-FC-19 | A claimed environment fails | REQUIRES PHASE 5 APPROACH CHANGE | Correct and rerun or narrow the claim to observed support | WEB-01, WEB-03, PERF-01 |
| VS-FC-20 | The selector omits or misroutes any of the four approved input choices | REQUIRES PHASE 5 APPROACH CHANGE | Correct the input-state and routing contract before slice acceptance | PROD-01, PROD-02, DEMO-01 |
| VS-FC-21 | A predefined profile is decorative, loads the wrong fixture or produces a generic/prepared result | REQUIRES PHASE 5 APPROACH CHANGE | Keep that profile non-functional and change the approach before claiming the preset capability | CRED-01, CRED-05, PROD-01 |
| VS-FC-22 | Manual guidance is absent, incomprehensible or misleading | REPARABLE WITHIN SLICE only for wording or visibility when underlying truth remains intact; otherwise REQUIRES PHASE 5 APPROACH CHANGE; an inherent diagnostic or exact-perception claim has NO SAFE FALLBACK | Correct and rerun comprehension evidence; block public manual use until it passes | UX-01, CLAIM-01, CLAIM-02, DOC-01 |

A disclaimer, label, prepared output or degraded state cannot convert a no-safe-fallback failure into a pass.

Only presentation, capture or retry defects may be repaired within the slice, and only when the underlying product truth, safety, data boundary and evidence remain intact.

## 16. Evidence plan

No evidence artifact listed here currently exists or has passed review.

| ID | Future evidence artifact | What it proves | Required timing |
|---|---|---|---|
| VS-EV-01 | Uninterrupted fresh live main-run capture | Complete user-facing critical chain and no developer intervention | First proof |
| VS-EV-02 | Exact manual edit, confirmation and current-profile trace | Real manual input and explicit confirmation | First proof |
| VS-EV-03 | Second distinct manual profile plus all three predefined-profile traces | No nearest-preset substitution, exact preset fixtures and value-correlated output | First proof/final by cutoff |
| VS-EV-04 | Source identity and transformed-output comparison | Honest same-source A/B and real processing | First proof |
| VS-EV-05 | Hearing-profile, one-sided and bilateral objective comparison | Genuine support states and beyond-gain differences | First proof |
| VS-EV-06 | Safety, clipping, invalid-output, transition and stop sweep | Controlled digital playback | Before user-facing audio |
| VS-EV-07 | Shared audible/visible state and timing trace | Semantic and temporal alignment | Phase 9 acceptance |
| VS-EV-08 | Fresh GPT provenance, structured contribution, grounding and latency record | Live intelligence and explanation truth | First proof and reliability gate |
| VS-EV-09 | Separate controlled outage capture | Honest degraded state, unavailable live explanation and retry | First proof |
| VS-EV-10 | Persistence, log, history, network and public-client inspection | Session-only data and credential boundary | Before public testing |
| VS-EV-11 | Full core run with optional live image/audio generation disabled | Optional-media kill-test compatibility | Before optional exposure |
| VS-EV-12 | Randomized structured-listening records | Approved perceptual thresholds | First proof and Phase 10 |
| VS-EV-13 | Completion-state and claim inventory | Coherent result and non-clinical boundary | First proof; comprehension audit by Phase 10 |
| VS-EV-14 | Exact environment and output-chain record | Truthful observed support boundary | Every acceptance run |
| VS-EV-15 | Asset provenance record for the validated scene | Public reuse rights | Before asset inclusion |
| VS-EV-16 | Timestamped milestone review | July 18/20/21/22 schedule protection | Daily through submission |
| VS-EV-17 | Four-choice selector, route and predefined-profile transformation trace | Exact input options, functional routing and genuine preset branches | First proof |
| VS-EV-18 | Manual orientation, change-specific explanation and novice-comprehension record | Understandable manual entry, actual-edit grounding and non-clinical limits | Phase 9 surface; Phase 10 independent comprehension |

Every artifact must identify the run, input fixture, source identity, environment and applicable state. Evidence from incompatible runs must not be combined as though it came from one integrated run.

## 17. Internal demo scenario

This is an internal vertical-slice acceptance scenario. It is not the final submission video.

### Preconditions

- One controlled primary desktop environment is named.
- One headphone/output chain is named.
- The user begins at low volume.
- Validated family-dinner media and its provenance are available.
- The synthetic manual fixture is loaded.
- All three predefined fixtures and their explanations are frozen.
- The four-choice selector is available.
- The manual orientation and change-specific explanation are available.
- GPT-5.6 is available for the main run.
- Evidence capture is ready.
- No real-person audiogram is used.
- No optional live image or ambient-sound generation is required.

### Main live run

1. Review the four available profile-input choices.
2. Choose `Enter an audiogram` for the mandatory critical-proof run.
3. Complete the novice audiogram orientation.
4. Review the editable `Synthetic manual test profile`.
5. Change:
   - left 2 kHz: 25 → 45 dB HL;
   - right 2 kHz: 25 → 35 dB HL;
   - left 4 kHz: 25 → 60 dB HL;
   - right 4 kHz: 25 → 45 dB HL.
6. Verify the change-specific preview against the actual edited values.
7. Confirm the profile.
8. Observe neutral validation and the confirmed current profile.
9. Receive a fresh live GPT-5.6 scene-intent and structured-scene contribution.
10. Read the low-volume instruction.
11. Explicitly start playback.
12. Hear and observe the reference state.
13. Hear and observe the hearing-profile state over the same source.
14. Hear and observe left-ear one-sided modelled support.
15. Hear and observe bilateral modelled support.
16. Select `Turn off the television`.
17. Hear and observe the coherent TV-off result.
18. Receive the grounded live non-prescriptive explanation.
19. Reach the dedicated completion state.
20. Verify that stop or mute remains effective throughout.

The run fails if any user-facing core step is missing or comes from a different run.

### Focused predefined-profile verification

For each of the three predefined profiles:

1. select the profile in a separate focused run;
2. verify the exact frozen left/right fixture;
3. verify that the same downstream Family Experience becomes reachable;
4. verify a real input-correlated audio transformation;
5. verify the matching data-derived visible state;
6. verify the profile description and non-clinical limitations.

These focused runs do not replace the uninterrupted manual main run and do not require four duplicate complete GPT-enabled journeys for the first proof.

### Separate outage proof

1. Establish the controlled live-model outage condition before the second run.
2. Repeat the same profile and validated scene.
3. Verify explicit `Degraded` status.
4. Verify that deterministic comparison may continue only with clearly labelled validated prepared media.
5. Verify that no prepared or cached explanation is presented as live.
6. Verify that the terminal state states that live explanation is unavailable.
7. Verify that retry is available.
8. Confirm that the degraded run is excluded from live acceptance.

### Evidence captured

The scenario captures VS-EV-01 through VS-EV-18 as applicable. Focused traces may be separate, but they must remain attributable to the same declared fixture, source and environment.

## 18. Risk coverage matrix

| Slice step or criterion | Related risks | Evidence required | Latest safe gate |
|---|---|---|---|
| Profile selector and predefined branches | PROD-01, PROD-03, CRED-01, CRED-05, CLAIM-02, TIME-01 | VS-EV-03, VS-EV-17 | First proof; final by July 20 |
| Guided manual edit and confirmation | PROD-02, CRED-01, CRED-02, CRED-05, CLAIM-01, CLAIM-02, UX-01, SEC-01 | VS-EV-02, VS-EV-03, VS-EV-18 | First proof; final by July 20 |
| Live scene intelligence | AI-01, AI-03, DEMO-01 | VS-EV-08 | First proof and pre-demo |
| Validated family scene | AI-02, SCENE-01, IP-02 | VS-EV-11, VS-EV-15 | Before first/public use |
| Controlled playback and stop | SAFE-01, WEB-02, WEB-03 | VS-EV-06 | Before user-facing audio |
| Reference versus transformed state | CRED-01, CRED-03, CRED-05 | VS-EV-04, VS-EV-12 | First proof |
| One-sided and bilateral support | CRED-04, CRED-05, WEB-03 | VS-EV-05, VS-EV-12 | First proof; final Phase 10 |
| Data-derived visible state | CRED-02, UX-02 | VS-EV-07 | Phase 9 acceptance |
| TV-off intervention | PROD-04, CRED-02, UX-01 | VS-EV-07, VS-EV-13 | Slice proof; both interventions by July 20 |
| Grounded explanation and claims | CLAIM-01, CLAIM-02, AI-01, AI-03, DOC-01 | VS-EV-08, VS-EV-13 | Phase 10/video lock |
| Degraded and false-live boundary | AI-01, AI-03, DEMO-01 | VS-EV-09 | First proof and pre-demo |
| Session-only behavior | SEC-01, SEC-02 | VS-EV-10 | Before public testing |
| Complete integrated journey | PROD-01, PROD-03, DEMO-01, TIME-01 | VS-EV-01, VS-EV-16 | July 18 |
| Broader environment truth | WEB-01–03, PERF-01, DEMO-02 | VS-EV-14 plus later matrix | Phase 10 |
| Scope and submission windows | PROD-03, TIME-01–03 | VS-EV-16 | July 18/20/21/22 |

Direct no-safe-fallback risks remain:

- `RISK-PROD-02`
- `RISK-CRED-01`
- `RISK-CRED-03`
- `RISK-CRED-04`
- `RISK-SAFE-01`
- `RISK-TIME-02`

`RISK-CLAIM-01` and `RISK-CLAIM-02` also have no safe fallback when the misleading claim is inherent to the selected approach.

## 19. Experiment mapping

No experiment below has been executed.

| EXP-P3 ID | Slice responsibility | Evidence defined here | Execution phase |
|---|---|---|---|
| EXP-P3-01 | Prove the complete integrated critical chain and functional entry routes | VS-EV-01 through VS-EV-09, VS-EV-17 | Phase 9 |
| EXP-P3-02 | Prove deterministic, input-correlated distinction beyond gain for manual and predefined profiles | VS-EV-03, VS-EV-04, VS-EV-05, VS-EV-12, VS-EV-17 | Phase 9 |
| EXP-P3-03 | Prove understanding of the educational boundary, manual controls and action | VS-EV-13, VS-EV-18; owner plus ≥3 independent people | Phase 10 |
| EXP-P3-04 | Prove digital playback safety and stop behavior | VS-EV-06 | Phase 9 before user audio |
| EXP-P3-05 | Prove supported environment claims | VS-EV-14; one controlled environment first, full required matrix later | Phase 9 and Phase 10 |
| EXP-P3-06 | Prove audible and visible alignment | VS-EV-07 | Phase 9 |
| EXP-P3-07 | Prove real manual processing, no preset substitution, truthful predefined profiles and no retention | VS-EV-02, VS-EV-03, VS-EV-10, VS-EV-17, VS-EV-18 | Phase 9 |
| EXP-P3-08 | Prove same-source A/B and genuine support differences | VS-EV-04, VS-EV-05, VS-EV-12 | Phase 9 |
| EXP-P3-09 | Prove intervention coherence | TV-off evidence in VS-EV-07 and VS-EV-13; second intervention remains required later | Phase 9 for slice; complete by Phase 10 |
| EXP-P3-10 | Prove live reliability, grounding and honest degraded state | VS-EV-08, VS-EV-09 | Phase 9 and pre-demo |
| EXP-P3-11 | Prove optional media is removable | VS-EV-11 | Phase 9 before optional exposure |
| EXP-P3-12 | Prove session and credential boundaries | VS-EV-10 | Phase 9 before public testing |
| EXP-P3-13 | Prove accessibility alternatives | Not part of first-proof execution; future states must remain compatible | Phase 10 |
| EXP-P3-14 | Prove public asset provenance | VS-EV-15 | At asset selection |
| EXP-P3-15 | Prove clean judge access | Outside first slice; main journey must avoid designing a credential-dependent dead end | Phase 10 |
| EXP-P3-16 | Prove the uploaded stream preserves the auditory result | Outside first slice; VS-EV-12 informs later recording | Phase 10 |
| EXP-P3-17 | Prove the complete submission package | Outside first slice | Submission preparation |
| EXP-P3-18 | Protect schedule and scope | VS-EV-16 | Phase 4 through submission |

The first slice does not by itself satisfy experiments whose pass criteria explicitly require the broader final product, environment matrix, submission video or submission package.

## 20. Honest degraded-state contract

A degraded state is entered when the required live GPT contribution:

- is unavailable;
- times out;
- returns invalid structured output;
- cannot be grounded in the current state;
- otherwise cannot truthfully qualify as live success.

The degraded state must:

- display the explicit status `Degraded`;
- explain that live scene intelligence or explanation is unavailable;
- keep any reused validated scene clearly identified as prepared media;
- permit deterministic comparison only when that comparison remains real and safe;
- withhold the live grounded explanation;
- expose retry;
- avoid an accidental dead end;
- remain excluded from live acceptance and reliability success counts.

The degraded state must not:

- display a live-success badge;
- present cached or prepared intelligence as fresh;
- count as a successful live run;
- hide the outage;
- override a no-safe-fallback failure in manual processing, source identity, support, safety or schedule.

## 21. Optional-media kill-test boundary

Live image generation and live ambient-sound generation are not mandatory dependencies of the slice.

With all optional media-generation services disabled or unavailable:

- the validated family-dinner source scene remains usable;
- manual input still drives the real transformation;
- reference, hearing-profile, one-sided and bilateral states remain functional;
- the TV-off intervention remains coherent;
- GPT-5.6 still provides the required live structured intelligence in a successful live run;
- the live grounded explanation remains available;
- the terminal result remains reachable.

Failure of this kill test requires an approach change. It may not be repaired by relabelling the optional service as mandatory.

Any media used in the product, repository or video still requires individual provenance and rights evidence.

## 22. Schedule and decision deadlines

| Gate | Deadline | Required state | Failure response |
|---|---|---|---|
| Phase 4 definition | Before Phase 5 approval | Canonical definition approved without architecture or dependency choices | Do not start Phase 5 |
| First genuine critical-chain proof | July 18, 2026, 02:00 CEST | One integrated main proof plus outage truth and required initial evidence | Stop optional work and request owner recovery decision |
| Mandatory-core expansion cutoff | July 20, 2026, 02:00 CEST | Mandatory Family Experience complete and validated before optional expansion | NO SAFE FALLBACK; owner scope or approach decision |
| Capability hardening freeze | July 21, 2026, 02:00 CEST | No new capability work; hardening, validation, documentation and submission work only | Remove or truthfully relabel incomplete surfaces |
| Submission deadline | July 22, 2026, 02:00 CEST | Complete compliant submission package | Do not submit incomplete or invented evidence |

Daily review against these gates is part of EXP-P3-18.

## 23. Phase 5 handoff constraints

Phase 5 receives an evidence-driven problem definition, not proof that the slice already works.

| Open design question | Constraint established by the slice | What Phase 5 must decide | What Phase 5 must not assume |
|---|---|---|---|
| End-to-end system responsibilities | One uninterrupted guided manual-to-completion journey is mandatory; three predefined branches enter the same downstream flow | The smallest responsibility and interface structure that can execute the flow | That component or preset success proves manual integration |
| Profile choice and input representation | Exactly four choices; exact preset fixtures; separate manual left/right values; confirmation and session-only behavior | Input-state, validation, current-profile and error contracts | That a preset may replace manual evidence, that manual input may collapse to a preset or that persistence is required |
| Novice audiogram education | Manual entry assumes zero prior literacy and requires actual-edit explanations | The smallest truthful orientation and explanation contract | That users understand audiograms, dB HL, ears or frequency notation without guidance |
| Transformation approach | Manual values must drive real, reproducible output | A just-enough processing and verification design | That louder is sufficient or the algorithm already works |
| Support semantics | Left-ear one-sided and bilateral states must be genuinely different | Ear-specific state and transformation contracts | That labels or balance changes alone satisfy support |
| Source identity | Reference and transformed states share one source | How source identity is preserved and evidenced | That similar media is the same source |
| Visible-state contract | Visible state derives from the same actual profile and transformation | Shared semantic state and timing evidence contract | That a decorative animation is acceptable |
| Live GPT contract | GPT-5.6 supplies fresh bounded scene intelligence and grounded explanation | Structured input/output, grounding, timeout and validation contracts | That cached output may be described as live |
| Degraded behavior | Explicit degraded state, no live explanation, retry and no false success | Failure-state and recovery responsibilities | That degraded execution satisfies live acceptance |
| Playback safety | User gesture, low-volume instruction, controlled transitions and stop are mandatory | Digital safety controls and measurement points | That physical playback environments are uniform |
| Session boundary | Raw profile and context are session-only and absent from logs/history | Data lifetime, logging and trust-boundary design | That persistence is required or harmless |
| Evidence observability | Every criterion requires attributable evidence | Minimal instrumentation and evidence interfaces | That a screen recording proves internal truth |
| Objective comparison | Metric must be declared before experiment and exclude overall-gain-only differences | Measurement contract and later executable threshold implementation | That a post-hoc metric is valid |
| Primary environment | One controlled desktop/headphone chain for first proof; broader matrix remains later | Exact initial supported environment and fallback claim boundary | That all browsers or devices behave uniformly |
| Optional media | Core must pass with optional live media disabled | Isolation boundary for optional media capabilities | That media generation is part of the critical path |
| Asset provenance | Every used scene asset requires applicable rights evidence | How selected media and provenance are associated operationally | That generated or found media is automatically reusable |

Phase 5 must not select dependencies belonging to Phase 6 or create the Phase 7 file tree early.

## 24. Decision ledger

| ID | Selected decision |
|---|---|
| P4-D01 | Select the Manual-Audiogram Critical-Chain Family Slice including one intervention. |
| P4-D02 | Use `turn off the television` as the slice intervention. |
| P4-D03 | Require live bounded GPT-5.6 scene intent, structured scene contribution and grounded explanation; validated media may be reused. |
| P4-D04 | Use an explicit degraded state with retry; deterministic comparison may continue with clearly labelled validated media, but the run does not satisfy live acceptance. |
| P4-D05 | End in a dedicated visible completion state. |
| P4-D06 | Require hearing-profile, one-sided and bilateral states over the same profile, source and scene. |
| P4-D07 | Use one controlled primary desktop and recorded headphone/output chain for the first proof; preserve the broader later matrix. |
| P4-D08 | Require one uninterrupted integrated capture plus focused objective evidence. |
| P4-D09 | Prove degraded behavior in a separate controlled outage run. |
| P4-D10 | Use the exact approved synthetic 2 kHz and 4 kHz left/right manual edit set. |
| P4-D11 | Require every user-facing core step to pass in one fresh uninterrupted live run. |
| P4-D12 | Use tiered objective and structured-listening thresholds: owner for first proof and at least three independent listeners before Phase 10 acceptance. |
| P4-D13 | Use strict reparable, approach-change, owner-escalation and no-safe-fallback failure classes. |
| P4-D14 | Offer three predefined synthetic audiograms or guided manual entry; assume zero audiogram literacy; keep manual as the mandatory critical proof and require real preset transformations. |

Derived implementation-neutral detail:

- The one-sided demo state supports the left ear because the approved fixture contains the larger changes on the left side.

There are no deviations from Codex recommendations and no unresolved owner decision required to define this slice.

## 25. Change control

This document may not silently:

- change the Product Freeze;
- change a Risk Map score, disposition, deadline or fallback;
- replace the approved slice;
- weaken a no-safe-fallback condition;
- change the exact manual edit fixture after observing a failed result;
- remove, rename or weaken the four approved input choices without an explicit decision;
- make a predefined profile decorative or use it as a substitute for manual-processing evidence;
- remove the novice orientation or replace actual-edit explanation with generic or diagnostic copy;
- change the required listening threshold;
- remove a mandatory acceptance or failure criterion;
- broaden the first-proof support claim;
- introduce architecture, technology, dependencies or implementation decisions;
- represent an unexecuted criterion as passed.

A future change must identify:

1. the previous decision or constraint;
2. the new proposed state;
3. the evidence or owner decision causing the change;
4. affected risks and criteria;
5. schedule and Phase 5 consequences.

The immutable baseline documents remain unchanged.

## 26. Phase status

The Phase 4 decision interview is complete.

This document defines the selected vertical slice, but does not implement or validate it.

Current evidence state:

- no acceptance criterion has been executed;
- no EXP-P3 experiment has been executed by this phase;
- no risk has been newly mitigated or accepted;
- all Risk Map dispositions remain unchanged;
- no architecture, dependency, file tree, code, asset or runtime has been created;
- Phase 5 has not been started.

Phase 4 project completion additionally requires:

- creation of this canonical document on the approved working branch;
- validation of its IDs, traceability, formatting, public safety and protected-file integrity;
- owner approval of the resulting diff and publication sequence;
- commit, fast-forward integration and push under the approved Git workflow;
- an evidence-backed final report;
- explicit human Phase 4 phase-gate approval.

Publication of this definition will not imply that the future vertical slice or any experiment has passed.
