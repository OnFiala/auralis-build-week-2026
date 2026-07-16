# Auralis

> See what hearing sounds like.

Auralis is a project for OpenAI Build Week 2026.

An executable walking skeleton now exists. It proves the application shell, trusted health boundary, build and local smoke path. The Auralis product experience is not implemented, Phase 10 has not started, and Phase 9 remains in progress until public deployment validation passes.

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

## Documentation

- [Auralis preparation](docs/Auralis_preparation_final.md)
- [Auralis vs. OpenAI Build Week 2026 requirements](docs/AURALIS_VS_OPENAI_BUILD_WEEK_2026_REQUIREMENTS.md)
- [OpenAI Build Week 2026 requirements and recommendations](docs/OPENAI_BUILD_WEEK_2026_REQUIREMENTS_RECOMMENDATIONS.md)

Further product implementation remains controlled by the approved project phase gates.
