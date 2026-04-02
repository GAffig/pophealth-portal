# Population Health Data Portal

A full-stack web application for exploring and visualizing population health data, built with a React/Vite frontend and an Express API backend in a pnpm monorepo.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4, TanStack Query |
| Backend | Express 5, Node.js 24 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod, drizzle-zod |
| API Codegen | Orval (OpenAPI → React Query hooks + Zod schemas) |
| Monorepo | pnpm workspaces |
| Language | TypeScript 5.9 |

## Project Structure

```
.
├── artifacts/
│   ├── pophealth-portal/   # React + Vite frontend
│   └── api-server/         # Express API server
├── lib/
│   ├── api-spec/           # OpenAPI specification
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle ORM schema & migrations
├── package.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 10+
- PostgreSQL database (set `DATABASE_URL` env var)

### Install dependencies

```bash
pnpm install
```

### Environment variables

Create a `.env` file at the root (or set in your environment):

```
DATABASE_URL=postgresql://user:password@localhost:5432/pophealth
```

### Run development servers

**API server:**

```bash
pnpm --filter @workspace/api-server run dev
```

**Frontend:**

```bash
pnpm --filter @workspace/pophealth-portal run dev
```

### Other commands

```bash
# Full typecheck across all packages
pnpm run typecheck

# Build everything
pnpm run build

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push

# Regenerate API hooks and Zod schemas from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

## Deployment

The app is deployed via Replit. For local development, each artifact binds to its own `PORT` environment variable.
