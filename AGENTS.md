# Julia Sanfrancisco

## Releases & deploys

PR titles MUST follow Conventional Commits / semver syntax: `feat: ...`, `fix: ...`, `chore: ...`, etc.

PRs are squash-merged using the PR title as the commit message, and the deploy workflow (`.github/workflows/deploy.yml`) only publishes when `semantic-release` can derive a new version from that message. A non-conforming PR title means no release and no deployment.

## Workflow

- Do not commit or push unless explicitly asked to.
