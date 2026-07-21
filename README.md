# Auralis

> See what hearing sounds like.

Auralis is a project for OpenAI Build Week 2026.

The Phase 10 deterministic vertical slice is implemented, owner-accepted and publicly deployed. It provides the browser-only profile flow, same-source audio comparison, illustrative support and environmental interventions, an accessible scene transcript, completion and sanitized evidence export.

Public production intentionally has no `OPENAI_API_KEY`: explanation attempts enter a truthful Degraded state while the deterministic experience remains fully usable. Live GPT was validated in the owner-controlled local environment. The 20-run reliability batch was not executed, so the unmeasured reliability risk remains `HIGH — ACCEPTED BY OWNER`.

The Welcome screen recommends comfortable stereo headphones. When Live GPT is configured server-side, its existing four-field Terra explanation uses longer plain-language prose while preserving the same sanitized grounding, deterministic audio authority and truthful Degraded boundary.

Phase 11 architecture review is complete. The implemented architecture passed after one required product-copy correction; no further architecture correction is required before submission.

Auralis is ready for submission polish and demo preparation.

## Local shell

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Validation

Run the complete Phase 9 local check:

```bash
npm run check
```

The check runs TypeScript validation, dependency-boundary enforcement, a production build and the local Playwright smoke test. The individual commands are `npm run typecheck`, `npm run check:deps`, `npm run build` and `npm run test:smoke`.

## Public deployment

Canonical production URL: [https://auralis-build-week-2026.vercel.app](https://auralis-build-week-2026.vercel.app)

- Application commit: `897b5d2fb802c78f7ae1644e48c6bdce47ce062b`
- Production deployment: `dpl_EoTxpV2J2E1QBNF5q4ukLZG7uYfT`

## Documentation

- [Auralis preparation](docs/Auralis_preparation_final.md)
- [Auralis vs. OpenAI Build Week 2026 requirements](docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md)
- [OpenAI Build Week 2026 requirements and recommendations](docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md)

Further work remains controlled by the approved project phase gates.
