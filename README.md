# Auralis

> See what hearing sounds like.

Auralis turns an audiogram into a guided listening comparison. A user chooses an illustrative hearing profile, enters the same 64-second family scene, compares the source reference with a deterministic profile result, and then tries changes such as reducing television sound or moving the important speaker closer.

Auralis is an educational, non-clinical experience. It does not diagnose hearing, reproduce an individual person's perception exactly, fit a hearing aid, prescribe treatment, or predict benefit.

- **Live application:** [auralis-build-week-2026.vercel.app](https://auralis-build-week-2026.vercel.app)
- **Runtime implementation baseline:** [`384ece76a29ab4f3c82e69e1bc1c585044d82c29`](https://github.com/OnFiala/auralis-build-week-2026/commit/384ece76a29ab4f3c82e69e1bc1c585044d82c29)
- **OpenAI API key:** optional; the complete deterministic journey works without one

## What the experience contains

The product has one guided journey:

1. **Welcome** — introduces the comparison and recommends comfortable stereo headphones.
2. **Profile** — offers three immutable illustrative profiles plus exact manual bilateral entry.
3. **Scene** — loads and verifies the synthetic family scene, presents its transcript, and requires a low-volume acknowledgement.
4. **Listening** — compares A, the source reference, with B, the current illustrative result.
5. **Interventions** — compares television on/off and the important speaker at the original position or closer and in front.
6. **Explanation** — keeps the deterministic result primary and optionally requests a grounded GPT-5.6 Terra explanation.
7. **Completion** — summarizes the attributable result, downloads sanitized evidence, or starts another comparison.

The audio comparison, intervention logic, safety checks, completion path, and evidence export are deterministic. GPT does not create, alter, or control the audio.

## Fork and run locally

### Prerequisites

- Node.js **22.x** (the version required by `package.json`)
- npm
- a current browser with Web Audio and Web Crypto support
- stereo headphones for the clearest comparison

No database, account, cloud storage, separate media setup, or OpenAI credential is required for the deterministic experience.

### 1. Clone your fork

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/auralis-build-week-2026.git
cd auralis-build-week-2026
npm ci
```

All predefined profiles, the synthetic scene manifest, four WAV stems, transcript data, and visual assets are already included in the repository.

### 2. Start without an OpenAI API key

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

This is the default evaluator path. The complete deterministic comparison remains available. If the user explicitly asks for the optional explanation, Auralis returns a truthful **Degraded** result and still permits completion.

Use `localhost`, `127.0.0.1`, or HTTPS. Do not substitute an unsecured LAN origin such as `http://192.168.x.x`: the browser must expose Web Crypto so Auralis can verify the approved media digests before decoding audio.

### 3. Optionally enable the live Terra explanation

Create a local `.env.local` file containing your own server-side key:

```text
OPENAI_API_KEY=replace_with_your_own_server_side_key
```

Then restart the development server. Auralis uses the existing server route and fixed `gpt-5.6-terra` configuration. Generating an explanation may create paid OpenAI API usage on your account.

Security requirements:

- never commit the local environment file or key;
- never prefix the key with `NEXT_PUBLIC_`;
- never place the key in browser code, a URL, or the Auralis UI;
- keep the request server-side, as implemented by `src/app/api/model/route.ts` and `src/server/openai.ts`.

OpenAI likewise requires standard API keys to remain secret and to be loaded from a server-side environment variable or key-management service. See [OpenAI API authentication](https://developers.openai.com/api/reference/overview#authentication).

The key is optional. With no key, an invalid response, a timeout, a refusal, malformed output, or failed grounding, Auralis fails closed to Degraded while preserving the deterministic comparison.

For your own hosted fork, configure the same variable as a server-side secret in the hosting platform. Do not add it to the repository or expose it to client-side JavaScript.

### Environment variables

| Variable | Required | Scope | Purpose |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | No | Server runtime only | Enables the explicit Live GPT explanation request. Without it, the deterministic journey uses the supported Degraded outcome. |
| `PLAYWRIGHT_BASE_URL` | No | Test process only | Points Playwright at an already-running deployment; otherwise the config starts the locally built application on `127.0.0.1:3000`. |

No other application-specific environment variable is required to run Auralis.

### 4. Run the production build locally

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Check the bounded runtime health endpoint at [http://127.0.0.1:3000/api/health](http://127.0.0.1:3000/api/health). The endpoint is deliberately small and uses `Cache-Control: no-store`.

## Runtime contract

| Concern | Canonical implementation | Runtime behavior |
| --- | --- | --- |
| Guided product state | `src/core/experience.ts` | `ExperienceState` is the single product-state authority; guards and invalidation are reducer-driven. |
| Audiogram data | `src/core/profile.ts` | Three immutable predefined fixtures and one manual bilateral draft; browser-memory only. |
| Deterministic processing | `src/core/transformation.ts` | Produces the bounded profile, support, television, and speaker-position plan. |
| Browser audio | `src/browser/audio.ts` | Verifies the manifest and SHA-256 digests, decodes the four stems, renders A/B, and owns immediate Stop. |
| Scene package | `public/media/family-dinner/` | One approved 64-second synthetic scene with focused speech, overlapping speech, television, and kitchen/room stems. |
| Optional model request | `src/app/api/model/route.ts`, `src/server/model.ts`, `src/server/openai.ts` | One explicit server request per user action, at most three attempts per browser session, no automatic retry. |
| Runtime contracts | `src/contracts/runtime.ts` | Validates the sanitized request, structured response, grounding identities, field bounds, and Live/Degraded classification. |
| Evidence export | `src/browser/evidence.ts` | Exports only the explicit attributable allowlist; no raw provider payload or secret material. |

### State and privacy boundaries

- Product state lives in browser memory and resets through the existing comparison reset action.
- There is no account, database, analytics pipeline, or persistence service.
- Raw audiogram thresholds are not sent to the model. The request contains a bounded, sanitized description of the confirmed deterministic result.
- The model receives no tools and cannot alter support, interventions, playback, safety, or completion state.
- Model responses use structured output, are grounded back to the current result, and are rendered as plain text.
- The provider request uses `store: false`; the application route and browser client use no-store behavior.

## Validation

Install the pinned dependencies and the Chromium binary required by Playwright:

```bash
npm ci
npx playwright install chromium
```

Run the complete repository check:

```bash
npm run check
```

`npm run check` runs, in order:

1. `npm run typecheck`
2. `npm run check:deps`
3. `npm run test:core`
4. `npm run test:model`
5. `npm run build`
6. `npm run test:smoke`
7. `npm run test:journey`

The Playwright configuration starts the already-built production application on `127.0.0.1:3000` when `PLAYWRIGHT_BASE_URL` is unset. Run `npm run build` first when invoking a Playwright script individually against that local server.

The model tests use an injected provider and both browser journeys intercept `/api/model`. The checked-in automated suite is designed to make **zero paid OpenAI API requests** and must not require a real key.

To run only the public smoke test against a deployed URL:

```bash
PLAYWRIGHT_BASE_URL=https://auralis-build-week-2026.vercel.app npm run test:smoke
```

## Agent handoff

An automated coding agent should follow this order before making changes:

1. Read the repository-wide [`AGENTS.md`](AGENTS.md).
2. Read the three authority documents in their declared order:
   - [`docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md`](docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md)
   - [`docs/Auralis_preparation_final.md`](docs/Auralis_preparation_final.md)
   - [`docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md`](docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md)
3. Treat those three documents as immutable snapshots and preserve the protected project history and tags.
4. Verify the current branch, base commit, index, accessible working tree, scope, and rollback before editing.
5. Never read, print, stage, or commit credentials or local environment contents.
6. Use a short-lived branch, make the smallest approved change, and run validation proportional to that change.

For runtime work, the important authority split is simple: `ExperienceState` owns product truth, deterministic browser code owns audio and safety, and GPT is an optional explanatory layer.

## How Codex and GPT-5.6 were used

Codex was the primary engineering environment for Auralis. It accelerated three concrete stages: converting the frozen product intent and Build Week rules into a risk map, vertical slice, system design, and dependency boundaries; implementing the reducer-driven seven-screen journey and deterministic Web Audio pipeline; and running unit, dependency, build, Playwright, accessibility, production, and rollback validation.

The owner retained product authority and made the key decisions: focus on family understanding rather than diagnosis; use same-source deterministic A/B as the core proof; keep GPT limited to a sanitized explanatory layer; support truthful Degraded completion without a shared public key; and approve the final guided flow and visual direction. Every phase, scope change, and publication remained behind an explicit human review gate.

GPT-5.6 Terra is used only in the optional Explanation step. After an explicit user action, the server sends a sanitized description of the current deterministic comparison and asks for four structured fields: scene framing, audible change, what stayed unchanged, and the fixed limitation. Server validation rejects the wrong model, stale or mismatched grounding, forbidden clinical claims, malformed output, refusals, and provider failures.

This division is intentional:

- deterministic code is the reliable product proof;
- GPT adds a warmer family-facing explanation when available;
- Degraded is a supported completion outcome, not failure of the comparison;
- automated journeys intercept the model route rather than spending API credits;
- live Terra quality was separately reviewed by the owner in a controlled local environment.

## Repository map

```text
src/app/                     Next.js UI, metadata, and API routes
src/core/                    Product state, profiles, transformations, projections
src/browser/                 Web Audio, model client, evidence download
src/contracts/               Runtime request and response schemas
src/server/                  Grounding, provider adapter, model tests
public/media/family-dinner/  Approved synthetic manifest and four WAV stems
tests/                       Intercepted smoke and full Live/Degraded journeys
docs/                        Frozen product and competition authority
```

## Known boundaries

- Auralis is illustrative and non-clinical; individual perception can differ.
- A digital check cannot guarantee the user's physical headphone level.
- The public deployment intentionally provides no shared OpenAI API key. Its deterministic journey remains complete and usable.
- The supported minimum viewport for this Build Week release is **390 px**. At 320 px, the Listening family-scene strip has a known 41 px horizontal overflow accepted for this release; 320 px is not a technical pass.
- Auralis is primarily intended for laptop and desktop use.
- Local media verification requires Web Crypto, so use a trusted localhost origin or HTTPS.
- The automated test browser is Chromium. Wider hardware, browser, assistive-technology, and output-device matrices are bounded owner validation rather than universal certification.
- A formal 20-run live-model reliability batch was not executed. Runtime Live GPT reliability is therefore not claimed as an empirical pass; the deterministic/Degraded path is the reliable boundary.

## Current public state

- Canonical application: [https://auralis-build-week-2026.vercel.app](https://auralis-build-week-2026.vercel.app)
- Production root and `/api/health`: HTTP 200, verified 21 July 2026
- Public model mode: optional explanation truthfully Degrades because no shared key is configured

## Project authority

- [OpenAI Build Week 2026 requirements and recommendations](docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md)
- [Auralis preparation](docs/Auralis_preparation_final.md)
- [Auralis vs. OpenAI Build Week 2026 requirements](docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md)

These documents preserve the frozen intent and competition analysis. Current implementation truth is established by the checked-in runtime, tests, validated Git history, and production evidence.

## License

The Auralis source code, documentation, and Auralis-owned production assets are
licensed under the [MIT License](LICENSE). Third-party dependencies retain their
respective licenses. Generated-media provenance and AI disclosures are recorded
in [`public/media/family-dinner/manifest.json`](public/media/family-dinner/manifest.json).
No trademark rights in the Auralis name or mark are granted.
