<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Guidance

- Keep changes focused on the requested task. Do not rewrite, reformat, or remove unrelated code or existing user changes.
- Before editing, inspect the relevant implementation and nearby conventions. Prefer the smallest change that solves the request.
- This project uses Next.js 16, React, TypeScript, and Tailwind CSS. Before changing Next.js code, read the relevant guide under `node_modules/next/dist/docs/` and follow its current APIs and conventions.
- Keep domain code in its existing feature area under `src/features/` and shared UI or utilities under `src/shared/` or `src/lib/`. Preserve established barrel exports where applicable.
- Reuse existing dependencies and UI patterns. Do not add a dependency or introduce a new abstraction unless the task requires it.
- For UI changes, follow the existing components and styling conventions; make layouts responsive and controls accessible by keyboard.
- Validate changes with the narrowest relevant check. Available project checks include `npm run lint` and `npm run build`; there is currently no test script. Do not claim checks passed unless they were run.
- Do not change generated or configuration files unless they are directly required by the task. Never remove the Next.js-managed block above; `next dev` may recreate it.
