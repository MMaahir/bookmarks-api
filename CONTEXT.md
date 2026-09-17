# bookmarks-api

A personal bookmark saver. One person saves web addresses and reads them
back later. The app is deliberately boring; it exists to carry the
platform built around it.

## Language

**Bookmark**:
One saved web address and its human-given name. One web address can be
saved once: a repeat save is rejected, not merged.
_Avoid_: link, favorite, saved page

**Title**:
The human-given name of a Bookmark. Optional.
_Avoid_: label, name

## Conventions

**Test placement**:
Tests colocate in `src/`, one `*.test.ts` beside the file it tests,
`src/app.test.ts` beside `src/app.ts`. Same layout as Hono's own repo.
Chosen over a root `test/` directory on 2026-09-16. Never mix the two.
