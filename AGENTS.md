# Julia Sanfrancisco

## Releases & deploys

PR titles MUST follow Conventional Commits / semver syntax: `feat: ...`, `fix: ...`, `chore: ...`, etc.

PRs are squash-merged using the PR title as the commit message, and the deploy workflow (`.github/workflows/deploy.yml`) only publishes when `semantic-release` can derive a new version from that message. A non-conforming PR title means no release and no deployment.

## Workflow

- Do not commit or push unless explicitly asked to.

## Worktrees

T3 opens each thread in `.worktrees/<branch>` and runs `scripts/worktree-setup`
(wired in `t3.json`), which writes `.env` from `.env.example` plus this
checkout's `PORT` and `PREVIEW_PORT`, installs dependencies, and generates the
typesafe-i18n files. Dev, preview, and Playwright read those ports with
`strictPort`, so a collision fails instead of drifting.

- `bun run dev` — dev server on `PORT`
- `bunx vitest run tests/unit/clock.test.ts` — one unit test file
- `bunx playwright test tests/smoke.spec.ts` — builds, serves on `PREVIEW_PORT`, runs the smoke test

Playwright saves a screenshot under `test-results/` only when a test fails.
The full suite (`bun run test`, plus check and lint) is CI's job.
