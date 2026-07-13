# Auralis Project Operating Contract

## 1. Purpose and scope

This file is the repository-wide operating contract for Codex and all delegated agents working on Auralis.

It governs authority, phase order, interviews, change control, Git workflow, validation, documentation, delegation, research, security, reporting, and completion gates. It does not introduce product requirements, architecture, technology choices, implementation scope, or submission claims.

The primary Codex task owns the main project decisions and most core functionality. Owner-facing communication defaults to Czech unless the owner explicitly switches language. This file is normative in English.

In this contract, “primary Codex task” means the single user-visible Codex thread attached to this repository that owns project decisions, integration, most core functionality, and the future `/feedback` submission.

No nested `AGENTS.md`, `AGENTS.override.md`, secondary governance document, or user-visible secondary main implementation task may be created without explicit human approval.

## 2. Project authority hierarchy

For competition rules, obligations, compliance, deadlines, judging, and submission requirements, verified Official Rules and official program terms are the highest external authority.

Within the repository, read the following documents in this order:

1. `docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md`
   - Repository authority for competition requirements, compliance, deadlines, and submission obligations.

Within `docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md`, only items classified as `MUST` or `CONDITIONAL MUST`, together with facts directly supported by current official sources, are binding requirements. `OFFICIAL SHOULD`, `PROJECT SHOULD`, and `INFO` items are advisory or contextual unless the human owner explicitly adopts them as project decisions.

2. `docs/Auralis_preparation_final.md`
   - Authority for the frozen product intent, target problem, intended user experience, and original product scope.
3. `docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md`
   - Analytical authority for rules-driven comparison, gap analysis, and recommendations.

The third document must not silently create product requirements or override either higher document.

This `AGENTS.md` governs agent behavior and project process. It must not be used to override competition rules or silently redefine the product.

`README.md`, subagent output, external research, and agent inference may provide context or evidence, but none of them may silently override the authority hierarchy.

If a current primary source conflicts with a frozen repository source, stop, identify the exact conflict and impact, and request an explicit human decision.

## 3. Locked and immutable files

Treat these files as immutable baseline snapshots:

- `docs/Auralis_preparation_final.md`
- `docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md`
- `docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md`

Do not edit, rename, move, delete, reformat, or regenerate them. A direct change requires a separate explicit human override that names the file and approved change.

The frozen baseline is anchored by:

- commit `89a0a146c762c694f7ddd9d06d9ef458e983c1f1`
- annotated tag `auralis-preparation-freeze`

Do not move, delete, replace, or recreate the tag. Do not rewrite the baseline history.

This root `AGENTS.md` is a protected governance file. Any later change to it requires explicit task scope and human approval of the final diff before commit.

## 4. Explicit human decision authority

The human owner is the final authority for project decisions, scope, risk acceptance, phase gates, publication, and exceptions to this contract.

A current explicit decision in the primary Codex task may clarify or supersede a lower project decision only when it:

1. does not conflict with verified competition rules;
2. is identified as a new decision;
3. states the reason and impact;
4. identifies the previous decision or assumption being changed;
5. is recorded in the appropriate canonical repository document or approved future decision record;
6. does not retroactively conceal the previous state.

An explicit decision does not silently mutate an immutable snapshot.

Only the human owner may accept `HIGH` or `CRITICAL` risk, authorize a protected-file exception, approve a phase transition, or authorize external publication.

When two human instructions conflict, surface the conflict. Follow the newest explicit instruction only when its authority and intended scope are clear.

## 5. Required project phase order

The project must proceed in this order:

0. Repository bootstrap
1. Authority and agent operating contract
2. Product freeze validation
3. Risk map
4. Vertical slice definition
5. Just-enough system design
6. Dependency model
7. Present-time file tree
8. Adversarial simplification
9. Executable walking skeleton
10. Vertical slice implementation
11. Architecture review after reality

Skipping, combining, reordering, or starting phases early is prohibited without an explicit human decision.

A phase-completion approval does not authorize the next phase. The next phase requires a new explicit human instruction.

## 6. Phase gates

Before starting a phase:

1. verify the current phase and previous completion report;
2. confirm the requested scope and forbidden scope;
3. read all relevant authority sources;
4. define required deliverables and acceptance evidence;
5. identify protected files and external effects;
6. classify the task risk;
7. confirm the stop conditions.

During a phase, work only on its approved deliverables. Do not use preparatory work as permission to begin a later phase.

Before closing a phase:

1. verify every required deliverable;
2. close or explicitly defer every required decision;
3. assign a valid disposition to every identified risk;
4. run the required validation;
5. synchronize approved documentation;
6. verify the required Git and publication state;
7. present a final evidence-backed report;
8. obtain explicit human phase-gate approval.

Any exception to phase order must be identified as a new human decision with its reason, impact, risks, and documentation consequence.

## 7. Interview and clarification protocol

When a phase contains material open decisions, use a controlled interview before implementation.

Before asking:

1. read the applicable authority sources completely;
2. separate decided, locked, open, conflicting, and out-of-phase matters;
3. do not ask for information already available from reliable sources.

Ask decisions in dependency order, normally with three to five related decisions per round. Use fewer when fewer material decisions remain. Never invent, duplicate, or artificially split decisions merely to satisfy a batch size. Each decision must contain:

- decision ID and name;
- why it must be decided now;
- what is already determined;
- the open question;
- two or three meaningful variants;
- the Codex recommendation;
- consequences of each variant;
- the recommended owner response format.

Stop after each decision round and wait for the owner.

Classify statements as applicable:

- `FACT`
- `INFERENCE`
- `ASSUMPTION`
- `UNKNOWN`
- `NEEDS VERIFICATION`

For a non-blocking ambiguity, Codex may use the most conservative reversible interpretation and must report it. Stop and ask when the ambiguity affects authority, scope, phase order, protected files, security, public exposure, competition compliance, irreversible action, or a material project decision.

Outside a scheduled interview, ask only when a real safety, destructive-action, authority, or material-scope blocker cannot be resolved from evidence.

## 8. Change-control protocol

After the human approves a task and its scope, Codex has task-scoped autonomy for small, reversible changes inside the current phase.

Codex must obtain explicit approval before:

- changing authority or governance;
- modifying a protected or immutable file;
- expanding scope or changing phase;
- introducing a dependency not already approved by the current phase decision, an accepted ADR, or the explicit task scope;
- making a material product or architecture decision;
- performing a destructive or difficult-to-reverse action;
- publishing externally, deploying, pushing, merging, or modifying `main`;
- creating a new canonical governance or decision document;
- accepting `HIGH` or `CRITICAL` risk.

Changes must be atomic, attributable, and limited to the approved goal. Preserve unrelated human changes and never include them in the task’s commit.

Do not delete, move, rewrite, or broadly clean up files merely because they appear obsolete. Do not hide a decision change by rewriting documentation as though the previous decision never existed.

If no appropriate canonical document exists, stop and propose the smallest necessary document. Do not create it automatically.

## 9. Git branch, commit, and push rules

Read-only inspection may occur on `main`.

Before any file change:

1. confirm the repository root;
2. confirm `main` and `origin`;
3. verify that local `main` matches the expected `origin/main`;
4. verify the working tree is clean or safely isolate unrelated changes;
5. create one short-lived branch with one logical goal.

All file changes must occur on a short-lived working branch. `main` is integration-only.

For ordinary approved work, Codex may create a local commit after required validation passes. Governance, authority, phase-gate, and protected-file changes require human approval of the final diff before commit.

Every push, merge, tag publication, or mutation of `main` requires explicit human approval.

A single explicit approval may authorize an exact reviewed sequence of commit, fast-forward integration, push, and approved tag publication. The approval applies only to the displayed diff, named branches and refs, remote target, commit message, and planned operations. Any material change invalidates the approval and requires a new review.

This does not permit force push, history rewriting, unreviewed changes, or a different integration method.

Prefer fast-forward integration when it is conflict-free. If fast-forward integration is not possible, stop and present safe options. A merge commit requires explicit approval.

Never:

- force push;
- rewrite published history;
- rebase existing published commits;
- delete a published branch or tag without explicit approval;
- amend or replace another person’s work;
- commit unrelated files;
- place credentials or secrets in commits.

Each completed phase that changes repository state must have an identifiable closing commit. If a phase validly produces no tracked repository change, the phase-closing report must state that explicitly. Do not create an empty commit solely to mark phase completion. Create an annotated milestone tag only for an explicitly approved freeze, release, submission, or material rollback checkpoint. The tag name and message require approval before creation.

At completion, verify the branch, commit order, working-tree status, local and remote references, and publication state relevant to the task.

## 10. Validation requirements

Every non-trivial change requires pre-change and post-change validation.

Classify each identified risk:

- `LOW` — local, narrowly scoped, reversible, and without authority, security, public, or destructive impact;
- `MEDIUM` — broader or behavior/process-affecting, but still controlled and reversible;
- `HIGH` — affects authority, security, privacy, public state, repository history, compliance, or has a difficult rollback;
- `CRITICAL` — credible risk of credential exposure, data loss, destructive irreversible action, serious compliance failure, or loss of project integrity.

Every risk must receive exactly one current disposition:

- `MITIGATED`
- `ACCEPTED WITHIN APPROVED TASK SCOPE` — permitted only for `LOW` or `MEDIUM` risk, with the rationale and residual risk reported
- `ACCEPTED BY OWNER` — required for `HIGH` or `CRITICAL` risk and available for any risk
- `DEFERRED` with an owner and concrete revisit trigger
- `BLOCKER`

Codex may use `ACCEPTED WITHIN APPROVED TASK SCOPE` only when the acceptance does not change authority, scope, competition compliance, security posture, public exposure, or an approved product or architecture decision.

Merely listing a risk is not sufficient. An unresolved `HIGH` or `CRITICAL` risk is a stop condition.

Pre-change validation must check:

- authority and active instructions;
- current phase and task scope;
- repository, branch, baseline, and working-tree state;
- protected files;
- expected external effects;
- security and public-repository exposure;
- planned validation and rollback path.

Post-change validation must include:

- the narrowest meaningful checks for the change;
- diff and staged-file review;
- broader regression checks proportional to risk;
- formatting and consistency checks;
- documentation consistency;
- Git status and reference checks;
- protected-file integrity checks where applicable.

Never claim a check passed unless it was run and its result was observed. Explicitly report checks not run and why.

A failed required validation blocks acceptance unless the human owner explicitly accepts the documented gap.

## 11. Documentation update rules

Update the relevant existing canonical documentation in the same branch whenever a change affects behavior, authority, process, operations, or a public contract.

Documentation must distinguish:

- current state;
- target state;
- proposed change;
- temporary workaround;
- superseded decision.

Do not duplicate canonical truth. Do not update documentation retroactively to conceal that a decision changed.

The three immutable baseline documents must remain unchanged. If a later decision changes current project direction, preserve the snapshot and record the new decision separately.

Do not create an ADR structure before Phase 5. If a durable repository decision record is needed earlier and no approved canonical location exists, stop and request approval for the smallest suitable document.

## 12. Rules against speculative abstractions

Create only artifacts required by the current approved phase and task.

Do not introduce:

- speculative directories or placeholder files;
- unapproved governance documents;
- source trees before their approved phase;
- package configuration before stack decisions;
- CI/CD or deployment configuration before approval;
- unused interfaces, abstraction layers, factories, wrappers, or extension points;
- architecture justified only by hypothetical future scale;
- dependencies for unapproved future functionality.

Do not choose a programming language, framework, database, hosting provider, model architecture, deployment system, or product architecture before its approved decision phase.

Prefer the smallest present-time structure that satisfies validated requirements and preserves a clear rollback path.

## 13. Subagent and secondary-thread rules

The primary Codex task owns:

- project authority interpretation;
- final recommendations;
- human decision interviews;
- scope and phase control;
- risk acceptance requests;
- integration decisions;
- most core functionality;
- the final report.

Subagents may be spawned for clearly bounded:

- primary-source research;
- repository inspection;
- validation;
- security review;
- adversarial review;
- independent evidence collection;
- disjoint implementation work explicitly approved in a later phase.

Every subagent assignment must specify:

- objective and why it matters;
- exact scope;
- source-of-truth inputs;
- allowed and forbidden actions;
- read and write boundaries;
- expected evidence and output format;
- validation expectations;
- stop conditions.

Subagents receive the same or narrower permissions than the primary task. Read-only is the default. Write access requires an explicit, disjoint ownership boundary. Never assign overlapping writes.

A subagent must not:

- change project authority, scope, phase, or architecture;
- present an assumption as a confirmed fact;
- accept risk;
- merge, push, publish, or modify `main` without an explicit human instruction for that exact action;
- create a secondary main implementation task;
- bypass active repository, permission, security, or safety controls.

Subagents receive relevant authority and project context from the primary Codex task and approved repository sources.

All subagent outputs are evidence or proposals until returned to, checked, and accepted by the primary task. The primary task remains accountable for the result.

Do not create or fork a user-visible secondary Codex task unless the human explicitly requests it.

## 14. External research and source-verification rules

Use repository authority first.

Verify material external or time-sensitive claims against current primary sources. Record the source, access date, uncertainty, and decision impact when relevant.

For competition requirements, use Official Rules and official program sources.

For OpenAI API, models, Codex, ChatGPT, Agents SDK, Apps SDK, pricing, limits, plugins, skills, MCP, or platform behavior:

1. use the official OpenAI documentation source first;
2. read the relevant page, not only search results;
3. do not guess current parameters, identifiers, availability, limits, or pricing;
4. state when official documentation is unavailable, unclear, or conflicting.

Prefer primary technical documentation, specifications, or source repositories over summaries and commentary.

External evidence must not silently modify project authority. Surface any conflict as an explicit decision.

Clearly separate sourced facts from inference. Do not cite an inaccessible or unread source as verified.

## 15. Security, secrets, and public-repository rules

This is a public repository. Treat every committed and pushed file as publicly disclosed.

Before commit or push, inspect the diff and staged-file list for:

- API keys and access tokens;
- passwords and credentials;
- private keys and certificates;
- real `.env` files;
- non-public internal URLs;
- absolute local paths;
- private email addresses or phone numbers;
- personal or sensitive information;
- logs, dumps, generated artifacts, or temporary files;
- any information whose public disclosure could create risk.

Never print, store, commit, or include credentials in reports. Do not read managed token files merely to verify that they exist.

Do not weaken secret handling, authentication, authorization, privacy controls, or public-repository protections without explicit approval.

Do not create or select a license without a separate explicit human decision.

External publication, deployment, submission, messaging, repository visibility changes, or sharing of conversation content requires explicit human approval.

Do not invoke `/feedback` until the designated submission stage and a new explicit human instruction. Before any future feedback submission, review the shared session and logs for sensitive information.

## 16. Reporting requirements

Every non-trivial task report must cover all applicable items below. Ordinary task reports should remain concise and proportional to the work performed. A phase-closing report must address all eleven items explicitly.

1. outcome and current phase status;
2. files inspected, created, changed, moved, or deleted;
3. decisions, assumptions, deviations, and unresolved uncertainty;
4. validation run and observed results;
5. checks not run and why;
6. risk classifications and dispositions;
7. residual risks and open questions;
8. branch, commit, merge, push, and tag state;
9. documentation update state;
10. subagent work used, rejected, or incomplete;
11. the exact next approval or phase gate.

Keep facts, inference, proposed changes, temporary workarounds, and unverified claims visibly separate.

Small tasks may use a shorter report, but must not hide validation gaps, unresolved risk, external effects, or incomplete publication state.

A phase-closing report must end with an exact statement in this form:

`Phase N complete. Phase N+1 has not been started.`

Do not use that statement until the phase definition of completion is satisfied.

## 17. Stop conditions

Stop before mutation or publication when any of the following applies:

- a material authority conflict is unresolved;
- competition compliance is uncertain and could affect eligibility or submission;
- a protected or immutable file would change without explicit approval;
- the task would expand scope, skip a phase, or start a later phase;
- a destructive, irreversible, credential-related, or externally visible action lacks approval;
- a new dependency, architecture choice, or material product decision lacks its required gate;
- a `HIGH` or `CRITICAL` risk lacks a valid disposition;
- required validation fails or cannot produce acceptance evidence;
- unrelated working-tree changes cannot be safely isolated;
- a diff includes unexpected or sensitive files;
- publication, merge, push, deployment, submission, or `/feedback` lacks approval;
- a permission or safety control denies an action and no materially safer alternative exists;
- the evidence required for phase completion is missing.

Do not work around an explicit permission or safety denial through an indirect path.

For non-blocking ambiguity, use the most conservative reversible option and report it. Stop when a safe interpretation would materially change the project outcome or authority.

## 18. Definition of phase completion

A phase is complete only when:

- every required deliverable exists;
- mandatory decisions are closed or explicitly deferred with an owner and revisit trigger;
- every identified risk is classified and has a valid disposition;
- required validation and acceptance evidence are complete;
- any accepted validation gap is explicitly documented and approved;
- canonical documentation matches the actual state;
- protected files remain intact or have a separately approved exception;
- Git branch, commit, merge, push, and tag state match the approved workflow;
- the final report is complete and evidence-backed;
- the human owner explicitly approves the phase gate.

Files changing, a local commit existing, or tests passing is not sufficient by itself.

After completion, stop. Do not start the next phase until the human provides a new explicit instruction.
