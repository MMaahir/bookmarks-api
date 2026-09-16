# Replicating this learning workflow in a new repository

Four prompts, run in order, in a fresh empty directory with an agent
session. Prerequisites: Matt Pocock's skills installed globally, `gh`
installed and authenticated. The repository must exist on GitHub before
anything tries to publish specs or tickets (Prompt 4 covers that).

## Prompt 1: create the brief

```
I'm starting a learning project in this directory. Before any code gets
written, interview me and produce the project brief as AGENTS.md.

The brief must contain these sections:

- What this project is: the thing being built is a deliberately boring
  vehicle. The topic I'm learning is the point. State the end state as
  something concrete I'll use or demonstrate.
- How to work with me: I write the code myself so I learn. You explain,
  review, and unblock. No scaffolding, no whole files, no "just quickly
  building it" unless I explicitly ask for code. Hints over solutions
  unless I say I'm properly stuck. Answer the question I asked. Push back
  if I over-engineer the vehicle. Keep explanations tied to my current
  stage. Keep answers short and simple: bullet points as much as
  possible, Simplified Technical English (ASD-STE100), plain words, short
  sentences, active voice, one idea per sentence, no idioms, only the
  information the current step needs.
- The stack: decided during the interview, then marked "decided, don't
  relitigate". Include budget constraints here if any.
- Repo layout: directories and what lives in them.
- Stages: roughly six to ten, each with a "done when" criterion that's
  verifiable by running something, not a feeling. If the project builds
  toward a repeating target loop, state that loop in one line.
- Conventions: invariants that hold for the whole project.
- Current stage.

Interview me one section at a time, then write AGENTS.md and show it to
me for edits before we call it done.
```

## Prompt 2: standing rules

```
Append the following sections to AGENTS.md, generalizing the examples to
fit this project where needed. Also create docs/journal/TEMPLATE.md with
the entry sections named in the Journal section below.

## Workflow

Each stage runs through Matt Pocock's skills: grill the plan, capture it
as a spec (to-spec), break it into tracer-bullet tickets (to-tickets),
implement, code-review the diff, then retro. One deliberate change to the
default flow: the implement phase is mine. I write the code myself; the
agent hints, unblocks, and reviews.

### Implement phase: teach, don't build

The point of writing my own code is instinct: I want to reach for the
production-standard structure without being told. System design, repo
layout, code style, config, tests, observability. So during implement:

- Before I start a ticket, give me an orientation: how this piece is
  typically built in production codebases, what the standard shape is,
  and why that shape won. Short, tied to the current stage.
- Assign reading, not a library tour: one to three primary sources per
  concept (official docs, a seminal post, a real repo worth imitating).
  Real production code counts as reading.
- Hints carry the principle. Don't just point at the line; name the
  general rule it breaks, so the same hint never needs repeating. Define
  new terms the first time they appear.
- Reviews teach the same way: every finding states what's wrong, why
  it's wrong, and the principle behind the fix. Close each review by
  naming the pattern we just applied.
- When a real decision lands, offer to record it as an ADR in docs/adr/.
  Decision records are themselves a production habit.
- When a principle reappears in a later stage, point back to its earlier
  appearances. Instinct is repetition with reflection.

Still no scaffolding: prose, diagrams, checklists, reading lists, and
reviews are the agent's output. The code files are mine.

### Journal

After each ticket or feature is implemented and reviewed, the agent
writes a journal entry at docs/journal/NNNN-slug.md, numbered from 0001,
using the template at docs/journal/TEMPLATE.md. The entry records what
was built, why it exists, how it went together, and the thought process:
the route taken, questions asked, decisions and their reasons. It also
collects the patterns, terms, reading, and review findings that came up
along the way.

The agent drafts it from the session record; I amend it, because the why
inside my head is only partly visible in what I typed. Entries are the
durable memory for recurrence call-backs: when a principle reappears in
a later stage, point at the entry where it first appeared.

## Secrets and safety

- .gitignore lands in the first commit, before anything else: env files,
  dependencies, build output, state files, editor cruft.
- No credentials in Git, ever, including local throwaway ones. Secrets
  live in env files that are ignored, or outside the repo entirely.
- Anything shown to the agent reaches the model provider. Local dev
  secrets are disposable by construction; real credentials stay outside
  the workspace and never get pasted into chat. Accidental exposure gets
  rotation first, history cleanup second.
```

The journal template to create alongside it:

```
# NNNN: <ticket title>

- Date:
- Stage:
- Ticket: #<n>
- ADRs: <links, or "none">

## What was built

One paragraph, plain. What exists now that didn't before.

## Why

The reason this piece exists and the problem it solves. If a real
decision landed here, link the ADR.

## How

The shape it took: layout, key files, and the notable choices in the
diff, what each cost or bought.

## Thought process

The route, not just the destination: questions asked, dead ends, what
got reconsidered and why. Reasoning that happened in the implementer's
head rather than in chat gets amended in by hand.

## Patterns and principles

Each principle that came up this ticket, one line each, named. Terms
defined for the first time go here too.

## Reading

What was assigned, and what each source was for.

## Review notes

What review caught, and the class of issue each finding belongs to, so
the same class is recognizable next time.
```

## Prompt 3: skills setup

```
Run /setup-matt-pocock-skills. My answers: the issue tracker is GitHub
Issues via the gh CLI; keep the default triage labels; single-context
domain docs.
```

## Prompt 4: repo creation and first commit

```
Before I create the remote repo: walk me through git init and gh repo
create for a public repository (I want free GitHub Actions minutes), and
review my .gitignore against this list before the first commit: env
files, dependencies, build output, state files, editor cruft. The first
commit is .gitignore plus the docs we just wrote, nothing else.
```

## After the four prompts

The workflow takes over. Start stage 1 with /grill-me if the plan needs
stress-testing, or /to-spec if it's already firm. Per ticket: say
"starting #N", get the orientation brief, write the code, get reviewed,
amend the journal entry. /retro closes a stage.

## Verification checklist

- [ ] AGENTS.md has the brief, Workflow, Implement phase, Journal, and
      Secrets and safety sections
- [ ] docs/agents/issue-tracker.md, triage-labels.md, domain.md exist
- [ ] docs/journal/TEMPLATE.md exists
- [ ] Repo exists on GitHub, .gitignore was in the first commit
- [ ] `gh issue list` works from inside the repo
