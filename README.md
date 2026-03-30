# Picaso – Collaborative Whiteboard (Monorepo)

## Demo
Check out the demo video of Picaso:

https://github.com/user-attachments/assets/19890a67-653a-49ae-b44b-edc18882bd2b

Picaso is a collaborative whiteboard built with a Next.js frontend, an Express HTTP backend, a WebSocket server for realtime updates, and Prisma/PostgreSQL for persistence. The repo is managed with Turborepo and uses TypeScript across all packages.

## Apps and Packages

Apps
- `apps/picaso-frontend`: Next.js app (whiteboard UI, auth, rooms)
- `apps/http-backend`: Express API (auth, rooms, chats, shapes persistence)
- `apps/websocket-backend`: WebSocket server (room membership, realtime whiteboard events)

Packages
- `packages/db`: Prisma schema and client
- `packages/common`: shared Zod schemas/types
- `packages/backend-common`: shared backend config (e.g., `JWT_SECRET`)
- `packages/ui`: small shared UI components
- `packages/eslint-config`, `packages/typescript-config`: shared config

## Prerequisites
- Node.js 18+
- pnpm 9+
- A PostgreSQL database (local or hosted)

## Environment Variables

Frontend (`apps/picaso-frontend/.env.local`)
- `NEXT_PUBLIC_HTTP_BACKEND` (e.g., `http://localhost:3001`)
- `NEXT_PUBLIC_WS_URL` (e.g., `ws://localhost:8080`)

HTTP Backend (`apps/http-backend/.env`)
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (any long random string)

WebSocket Backend (`apps/websocket-backend/.env`)
- `JWT_SECRET` (must match HTTP backend)

## Install
```bash
pnpm install
```

## Database Setup
Set `DATABASE_URL` in `apps/http-backend/.env`. Then generate/migrate Prisma from the `packages/db` package:
```bash
pnpm --filter @repo/db exec prisma generate
pnpm --filter @repo/db exec prisma migrate deploy
```

## Development
Run all apps together:
```bash
pnpm dev
```
This starts:
- Frontend at `http://localhost:3000`
- HTTP API at `http://localhost:3001`
- WebSocket server at `ws://localhost:8080`

Run apps individually:
```bash
pnpm --filter http-backend dev
pnpm --filter websocket-backend dev
pnpm --filter picaso-frontend dev
```

## Build
```bash
pnpm build
```

## Features
- Auth: `POST /signup`, `POST /signin` (JWT)
- Rooms: `POST /room` (auth required)
- Chats: `GET /chats/:roomId`
- Whiteboard shapes:
  - `GET /shapes/:roomId` – fetch non-erased shapes
  - `POST /shapes` – create shape `{ roomId, type, data }`
  - `POST /shapes/:id/erase` – soft-erase
- WebSocket:
  - Connect with `?token=<JWT>`
  - Messages: `{ type: "join_room", roomId }`, `ADD_SHAPE`, `DELETE_SHAPE`, `CHAT`
  - Broadcasts to users in the same room (except sender) for shape events

## Frontend Notes
- Tools: circle, rectangle, line, pencil, eraser
- Shapes persist via HTTP; realtime sync via WebSocket
- Endpoints are configured via `apps/picaso-frontend/app/config.ts`

## Scripts
- `pnpm dev` – run all apps
- `pnpm build` – build all apps
- `pnpm lint` – lint all packages
- `pnpm format` – format repo files

## Folder Structure (excerpt)
```text
apps/
  http-backend/
  picaso-frontend/
  websocket-backend/
packages/
  db/
  common/
  backend-common/
  ui/
```

## License
MIT
