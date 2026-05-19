# Shri Abhay Nobles Senior Secondary School ERP

A full-stack school management system for Principal/Admin and Teacher roles, migrated from Next.js/MongoDB to Vite+React with an Express API server.

## Run & Operate

- `pnpm --filter @workspace/school-erp run dev` — run the frontend (Vite, auto-assigned port)
- `pnpm --filter @workspace/api-server run dev` — run the API server (auto-assigned port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Optional env: `MONGODB_URI` — MongoDB connection string (API routes return 500 if not set)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + wouter (routing) + @tanstack/react-query
- API: Express 5 + Mongoose (MongoDB)
- Build: esbuild (CJS bundle for API)

## Where things live

- `artifacts/school-erp/src/` — frontend source
  - `App.tsx` — router (wouter Switch/Route)
  - `pages/` — all page components + their CSS
  - `shared/` — API store functions (directory, attendance, homework, results, live-content)
  - `components/erp-ui.tsx` — shared UI helpers (LoginScreen, DashboardShell, OrbBackground)
  - `index.css` — global styles + landing/login/dashboard layout
- `artifacts/api-server/src/` — backend source
  - `routes/erp.ts` — all ERP REST routes (students, teachers, attendance, homework, results, notices, messages, materials, timetable, events)
  - `lib/mongoose.ts` — Mongoose schemas and model definitions

## Architecture decisions

- Backend uses MongoDB (Mongoose) instead of the default Drizzle/Postgres — the original project was MongoDB-native.
- All `MONGODB_URI`-dependent routes return 500 gracefully if the env var is not set; the API server still starts and health endpoint works.
- Frontend routing uses wouter (already in workspace catalog), replacing Next.js App Router.
- `"use client"` directives stripped from all components — not needed in Vite+React.
- Character encoding: source files had triple-encoded UTF-8 (windows-1252 mojibake) that was fixed with a Python decode pipeline at migration time.

## Product

- **Landing page** (`/`) — role picker to Admin or Teacher portal
- **Admin login** (`/admin/login`) — institutional credential form with OTP
- **Admin/Principal dashboard** (`/admin/dashboard`) — full ERP: KPI cards, attendance chart, activities feed, admissions bars, upcoming events, 15+ nav sections (students, teachers, attendance, exams, homework, fees, analytics, notices, settings, etc.)
- **Teacher login** (`/teacher/login`) — teacher-specific login
- **Teacher dashboard** (`/teacher/dashboard`) — teacher workbench: my classes, attendance marking, homework management, results, fee view, timetable, notices, messages, study materials

## Gotchas

- MongoDB routes buffer for 10 s then time out if `MONGODB_URI` is not set — this is expected behavior and doesn't crash the server.
- The admin and teacher dashboards are self-contained with rich demo data; they don't require a live MongoDB connection to render.
- Run the Python encoding fix script at `/tmp/fix_strings.py` + `/tmp/fix_final.py` if you re-copy source files from `.migration-backup/`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Migration source: `.migration-backup/frontend/` (Next.js) and `.migration-backup/backend/` (Express/MongoDB)
