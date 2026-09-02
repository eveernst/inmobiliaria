# Code Review Rules

## Stack

- Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS + shadcn/Radix components, Supabase.

## TypeScript

- Use `const`/`let`, never `var`.
- Don't introduce new `any` types in code you're touching. Existing `any` usages are grandfathered — flag them if convenient, but don't block a commit on pre-existing instances outside the diff's scope.
- Types shared across features live in `src/lib/types.ts`.

## React

- Functional components only. This codebase's established convention is `export default` per component file — don't flag it, and don't convert files to named exports.
- New client components need an explicit `"use client"` directive; keep server components as the default elsewhere in `src/app`. Don't block commits over a missing directive on a pre-existing file outside the diff's scope.
- Hooks (`useState`, `useMemo`, etc.) must run unconditionally at the top of the component, never after an early return.

## Project conventions

- API calls go through `src/api/*` or `src/lib/api.ts`, not inline `fetch`/`axios` in components.
- Imports must match filenames byte-for-byte (case-sensitive) — this repo has shipped Windows-only casing bugs that broke on Linux/Vercel.
- Run `next lint` and `tsc --noEmit` before committing.
