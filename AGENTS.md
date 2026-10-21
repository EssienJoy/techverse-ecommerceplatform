<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Guidance

- This project uses Next.js 16, React, TypeScript, Tailwind CSS, and Prisma ORM.
- Keep changes focused on the requested task. Inspect the relevant implementation and nearby conventions before editing; preserve unrelated code and user changes.
- Keep domain code in its existing feature area under `src/features/` and shared UI or utilities under `src/shared/` or `src/lib/`. Preserve established barrel exports where applicable.
- Prefer TypeScript for new application code and co-locate component-specific styles when practical.
- Reuse existing dependencies and UI patterns. Avoid introducing a dependency or abstraction unless the task requires it.
- Do not edit generated Prisma client files. Make schema changes in the source files under `prisma/` and follow applicable instructions in `.agents/skills/` for Prisma work.
- For UI changes, follow existing components and styling conventions; make layouts responsive and controls accessible by keyboard.

## Development Workflow

- Use `npm run dev` while iterating so Next.js HMR remains available.
- Do not run `npm run build` in an interactive agent session. A production build changes `.next` output and can disrupt the development server. Run it outside the interactive workflow only when specifically required.
- When adding or updating dependencies, update the package manager's lockfile and restart the development server.

## Validation

- Run `npm run lint` for ESLint validation and `npx tsc --noEmit` when a TypeScript change needs a type check.
- There is no test script in `package.json`. Run relevant existing tests directly if the touched area has them, and report checks that could not be run.
- Do not claim a check passed unless it was run.

## Available Commands

| Command            | Purpose                                                         |
| ------------------ | --------------------------------------------------------------- |
| `npm run dev`      | Start the Next.js development server with HMR.                  |
| `npm run lint`     | Run ESLint.                                                     |
| `npx tsc --noEmit` | Type-check without emitting files.                              |
| `npm run build`    | Production build; do not run during interactive agent sessions. |
