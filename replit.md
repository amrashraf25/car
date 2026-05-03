# LuxeWash — Luxury Car Cleaning App

## Overview

Full-stack luxury car cleaning service app with role-based flows (Customer, Worker, Admin), JWT authentication, PostgreSQL backend, real-time Socket.IO, interactive SVG car simulator, and multi-step booking wizard.

Built as a pnpm workspace monorepo: Expo mobile frontend + Express API server + shared DB/API libraries.

## Architecture

```
artifacts/
  api-server/       Express + Socket.IO API server (port 8080, proxied at /api)
  mobile/           Expo React Native app (port 18115, proxied at /)
lib/
  db/               Drizzle ORM schema + PostgreSQL client
  api-spec/         OpenAPI spec + Orval codegen config
  api-client-react/ Generated React Query hooks (from Orval)
  api-zod/          Generated Zod schemas (from Orval)
```

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js**: 24 / TypeScript 5.9
- **API framework**: Express 5 + Socket.IO
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`) + drizzle-zod
- **API codegen**: Orval (OpenAPI → React Query hooks + Zod schemas)
- **Mobile**: Expo Router + React Native SVG + React Query
- **Build**: esbuild (API server)

## Demo Accounts

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Customer | customer@demo.com   | password123 |
| Worker   | worker@demo.com     | password123 |
| Admin    | admin@demo.com      | password123 |

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## DB Schema (lib/db/src/schema/)

- `usersTable` — id, name, email, passwordHash, role (customer/worker/admin), avatarUrl
- `carsTable` — id, userId, brand, model, color, plateNumber, carType
- `packagesTable` — id, name, description, price, itemsJson, tier (basic/full/premium)
- `ordersTable` — id, customerId, workerId, carId, packageId, status, scheduledDate/Time, location, totalPrice
- `workersTable` — id, userId, status (available/busy/offline), currentOrderId, lat, lng

## Order Status Flow

`pending` → `confirmed` → `en_route` → `in_progress` → `finishing` → `completed`

## Mobile App Structure (Expo Router)

```
app/
  _layout.tsx          Root layout with auth redirect
  (auth)/
    login.tsx           Login + demo fill
    register.tsx        Register (customer or worker)
  (customer)/
    index.tsx           Dashboard with car silhouette
    book.tsx            4-step booking wizard + SVG car add-ons
    orders.tsx          Order history
    track.tsx           Real-time order tracking (polling)
    cars.tsx            Vehicle management
    profile.tsx         Profile + logout
  (worker)/
    index.tsx           Job list + status toggle
    job.tsx             Job detail + checklist + status update
    profile.tsx         Profile
  (admin)/
    index.tsx           Stats dashboard + workers
    orders.tsx          Orders list with status filter
    workers.tsx         Worker management
    customers.tsx       Customer list
```

## Important Notes

- `lib/api-zod/src/index.ts` exports only `./generated/api` (not types/schemas which don't exist in split mode)
- Socket.IO path: `/api/socket.io`; io instance stored in `artifacts/api-server/src/socket.ts`
- JWT_SECRET env var used; falls back to `luxewash-secret-key-2025`
- DB auto-seeds on first startup if empty (5 users, 3 packages, 2 cars, 4 orders)
- `app/(tabs)/` from scaffold is kept but never routed to (auth redirect handles routing)
