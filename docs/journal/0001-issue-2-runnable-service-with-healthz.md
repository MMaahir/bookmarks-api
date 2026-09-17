# 0001: Issue #2 — runnable service with healthz

- Date: 2026-09-16
- Stage: 1 (app and image)
- Issue: #2
- ADRs: none. The test-placement decision is recorded as a convention in
  CONTEXT.md, not an ADR; nothing here rose to an architectural decision
  record yet.

## What was built

A running service. `pnpm dev` starts a Hono app on `@hono/node-server`,
and `GET /healthz` answers 200 with `{"status":"ok"}` and a JSON content
type. The listen port comes from `PORT` with 3000 as default. The
skeleton landed with it: `src/app.ts` (routes, exports the bare app),
`src/server.ts` (the only file that serves it), strict tsconfig, ESLint
flat config, and Vitest with one test that calls the app in-process with
no port bound. Startup logs the real bound port.

## Why

The first tracer bullet: a live wire from HTTP request to JSON answer
that every later issue hangs off. `/healthz` is deliberately dumb. It
reports the process is alive, and from stage 4 on, kubelet probes and
alert rules poll exactly this route, so its contract froze now.

## How

- **app/server split.** `app.ts` is runtime-free: it defines routes and
  exports the app. Tests import it and use `app.request()`, which runs
  the whole stack in-process, no socket, no port. `server.ts` alone
  knows about `serve()` and the port. Swap the entry file and the same
  app runs on any host; that is how Hono's adapters work.
- **Port from env.** `process.env.PORT ? Number(...) : 3000`. The
  `Number(undefined)` is `NaN` trap is documented; a garbage `PORT`
  still crashes opaquely, on purpose, until the Zod issue.
- **tsconfig.** NodeNext pair, `strict`, `noEmit`, `skipLibCheck`,
  `types: ["node"]`, `include: ["src"]`. Relative imports carry `.js`
  extensions because tsc never rewrites paths and Node demands real
  filenames.
- **ESLint.** Flat config, `@eslint/js` recommended plus
  typescript-eslint recommended.
- **Scripts.** `dev` (tsx watch), `test` (vitest run), `lint`,
  `typecheck` (tsc --noEmit).
- **pnpm-workspace.yaml.** Records `allowBuilds: esbuild: true` so the
  esbuild postinstall runs without prompting, on every clone.

## Thought process

- **No scaffolder.** `pnpm create hono` was rejected on purpose: the
  skeleton is the point. Hand-writing tsconfig and app.ts is the
  exercise issue #2 exists to teach.
- **Pins discovered the hard way.** Unpinned `typescript` installed 7.0,
  which broke typescript-eslint's peer range: pinned to `typescript@5`.
  `@types/node` unpinned installed 26.x against a Node 22 runtime:
  pinned to 22. Homebrew's Node 25 was shadowing mise's Node 22;
  mise's activate line was also duplicated in `.zshrc`. Both fixed.
  Toolchain = compiler + types + runtime, all pinned to the slowest
  consumer.
- **pnpm 10 build-script deny.** The esbuild postinstall was blocked by
  default. First approval pass recorded `esbuild: false` by mistake;
  caught in review, fixed to `true`, committed so clones and CI inherit
  it.
- **Test placement.** Checked the real repos: Node, Express, and
  Fastify use a root `test/`; Hono colocates `*.test.ts` in `src/`.
  Chose colocated to match the framework being learned from. Recorded
  in CONTEXT.md: never mix the two styles.
- **Process rules that landed this issue.** Kickoff responses now end
  with an audit reminder (AGENTS.md). Reading assignments now sit
  inline at the step that needs them (AGENTS.md).

## Patterns and principles

- **Slowest tool wins.** Pin the toolchain to the strictest consumer.
  Recurs at image tags, CI matrix, Helm chart versions.
- **Default-deny on install scripts.** Supply-chain hygiene. Recurs at
  Trivy and digest pinning.
- **Config from the environment.** 12-factor rule 3. First appearance;
  returns in the Dockerfile, Helm values, and sealed secrets.
- **Observability starts at the first issue.** healthz for machines, the
  startup log for operators, honest test names for the next reader.
- **Log what actually happened, not what you asked for.** `info.port`
  from the serve callback, not `process.env.PORT`.
- **Boundary validation.** Env vars are untrusted input; parse at the
  edge. Zod generalizes this for HTTP bodies in a later issue.
- **Red-green in miniature.** Test written first, watched it fail,
  added the route, watched it pass.

Terms defined along the way: tracer bullet, liveness probe, app/server
split, peer dependency, flat config, NaN, `allowBuilds`, colocated
tests, NodeNext.

## Reading

- Hono Node.js quickstart — `serve()` shape, callback, port sections.
- Hono testing guide — `app.request()`.
- Vitest guide — `describe`/`test`/`expect` only.
- 12factor.net/config — the argument for env config.
- TypeScript modules reference, NodeNext — the `.js` import rule.
- tsconfig cheat sheet — per-flag reasoning.
- typescript-eslint getting started — flat config shape.

## Review notes

- `describe("Example")` — Mysterious Name. Names are documentation;
  renamed to `describe("app")`.
- Silent startup, then wrong startup log — observability. First no log
  at all, then `console.log(process.env.PORT)`, which logs the input.
  The fix logs the bound truth from the serve callback.
- Unused `import { info } from 'console'` — an autocomplete ghost that
  failed lint after all other gates were green. Gates judge the final
  state; rerun after every edit.
- Hygiene batch — missing trailing newlines, mixed quote styles,
  vestigial `"main": "index.js"`, stray `src/node_modules/` (from a
  pnpm command run in the wrong directory; nearest `node_modules`
  wins module resolution, so strays can produce impossible-looking
  bugs).
- Deliberately not fixed: `PORT=abc` crashes opaquely. Scheduled for
  the Zod boundary-validation issue; refusing to gold-plate stage 1.
