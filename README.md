# Tools We Need

Tools We Need is a free, installable collection of browser-based calculators and utilities. The catalog currently contains 36 tools across finance, work, wellness, planning, productivity, developer workflows, and private local file processing.

## Product guarantees

- Tool inputs and calculations remain in the browser.
- No account or paid tier is required.
- Exports are created locally.
- Each tool route discloses its storage, network, export, and methodology behavior.
- Feedback and tool-request forms are the only intentional data-submission surfaces.

## Local development

Requirements: Node.js 22 or newer and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Run the complete release gate with:

```bash
npm run check
```

## Environment variables

The catalog works without environment variables. Feedback and tool requests require:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Only the Supabase anonymous key belongs in a public variable. Never expose a service-role key.

## Architecture

- Next.js App Router with statically generated tool routes and per-tool metadata
- React tools loaded in independent lazy chunks
- Tailwind CSS
- Vitest calculation and registry contracts
- Optional Supabase tables for bounded anonymous feedback/request inserts
- Custom same-origin service worker for installability and offline revisits

## Deployment

The project is designed for Vercel. Link it to the existing Vercel project, configure the two optional public Supabase values, run `npm run check`, then deploy through the Vercel dashboard or CLI. Apply reviewed migrations from `supabase/migrations` only after linking the intended Supabase project.
