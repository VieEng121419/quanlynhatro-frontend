# 🏠 Nha Tro Tuan Viet Management — Frontend

> A rooming house management website for landlords: manage rooms, contracts, invoices, and debts.

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Local Setup](#-installation--local-setup)
- [Environment Configuration](#-environment-configuration)
- [Useful Commands](#-useful-commands)
- [Deploy with Docker](#-deploy-with-docker)
- [Architecture & Data Flow](#-architecture--data-flow)
- [Development Guide](#-development-guide)
- [License](#-license)

---

## 🎯 Introduction

**Nha Tro Tuan Viet Management** is a rooming house management system consisting of 3 parts:

| Part | Description |
|------|-------------|
| **Frontend (this repo)** | Web UI for landlords/admins — Next.js 15 |
| **Backend** | API server (repo `quanlynhatro-backend`) |
| **Tenant Web** | Portal for tenants (repo `quanlynhatro-nguoithue`) |

This repo is the **landlord-facing frontend**, providing a dashboard to manage the entire rooming house business.

---

## ✨ Key Features

### 🔐 Authentication & Security
- Login / Register account
- Forgot password
- Email verification
- Two-factor authentication (2FA)
- Token-based auth (JWT Bearer token stored in `localStorage`)
- Auto-redirect to login on expired/invalid token (401)

### 🏢 Room Management (`/rooms`)
- View room list with pagination, search, and status filter
- Room statuses: **Empty** / **Occupied** / **Maintenance**
- Bulk room creation
- Quick info: room price, occupant count, latest invoice, invoice status

### 📄 Contract Management (`/contracts`)
- Create new contract for empty rooms
- View contract details
- Edit contracts
- Terminate contracts

### 🧾 Invoice Management (`/invoices`)
- View invoice details per room
- Track invoice status (paid / unpaid, etc.)
- Record payments

### 📒 Room Tab (Debt Ledger) (`/room-tabs`)
- Manage incidental debts for each room
- Statuses: **Pending invoice** / **Included in invoice**
- Add new debt entries

### 📊 Dashboard & Utilities
- Overview dashboard with analytics charts (Recharts)
- Calendar, messages, documents, user management
- Account settings, API keys, appearance (dark/light mode), notifications
- Professional error pages: 401, 403, 500, maintenance

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 15** (App Router, Turbopack) | React framework — SSR/CSR, routing |
| **React 19** | UI library |
| **TypeScript 5.8** | Type safety across the project |
| **Tailwind CSS 4** | Styling |
| **shadcn/ui** + Radix UI | Component library (button, dialog, table, form...) |
| **TanStack Query v5** | Data fetching, caching, server-state sync |
| **Axios** | HTTP client — interceptors for token injection & centralized error handling |
| **React Hook Form + Zod** | Form validation |
| **Recharts** | Analytics charts |
| **Sonner** | Toast notifications |
| **next-themes** | Dark/light mode |
| **date-fns / dayjs** | Date handling |
| **Docker** | Multi-stage build, standalone output |

---

## 📁 Project Structure

```
quanlynhatro-frontend/
├── app/
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/               #   Login
│   │   ├── register/            #   Register
│   │   ├── forgot-password/     #   Forgot password
│   │   ├── verify-email/        #   Email verification
│   │   └── setup-2fa/           #   2FA setup
│   ├── (dashboard)/             # Dashboard pages (with sidebar + topbar)
│   │   ├── dashboard/           #   Overview + analytics
│   │   ├── rooms/               #   Room management
│   │   ├── room-tabs/           #   Debt ledger
│   │   ├── contracts/           #   Contract management
│   │   ├── settings/            #   Settings (account, api-keys, appearance...)
│   │   └── ...                  #   Calendar, messages, documents, users...
│   ├── (error)/                 # Error pages (401, 403, 500, maintenance)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles + Tailwind
│   └── page.tsx                 # Home page
├── components/
│   ├── ui/                      # shadcn/ui components (button, dialog, table...)
│   ├── shared/                  # Sidebar, Topbar, AppSwitcher, ErrorPage...
│   ├── rooms/                   # Bulk room creation modal
│   ├── room-tab/                # Add debt modal
│   ├── contracts/               # Create/view/edit contract modals
│   ├── invoice/                 # Invoice detail & payment modals
│   └── providers/               # QueryProvider (TanStack Query)
├── hooks/                       # Custom hooks (useLogin, useInvoiceMutations...)
├── lib/
│   ├── api/axios-client.ts      # Axios instance + interceptors + token helpers
│   ├── constants/               # Constants (DEFAULT_CONTRACT...)
│   ├── configs/                 # Config (invoice-actions...)
│   ├── types/                   # TypeScript types
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── Dockerfile                   # Multi-stage build
├── next.config.ts               # Next.js config (output: standalone)
└── package.json
```

---

## 📦 Prerequisites

- **Node.js** 18.17 or later (recommended 20.x)
- **yarn** or **npm**
- Backend API running (see [Environment Configuration](#-environment-configuration))

---

## 🚀 Installation & Local Setup

### 1. Clone the repository

```bash
git clone git@github.com:VieEng121419/quanlynhatro-frontend.git
cd quanlynhatro-frontend
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` to point to your local backend:

```env
NEXT_PUBLIC_API_URL='http://localhost:3001/api'
```

### 4. Run the dev server

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.nhatrotuanviet.uk/api` (prod) / `http://localhost:3001/api` (local) |

> ⚠️ **Important notes:**
> - `NEXT_PUBLIC_*` variables are **inlined into the bundle at build time** → must be set correctly before building/deploying.
> - **Never commit** `.env` or `.env.local` to git (already in `.gitignore`).
> - `.env.example` is a template — copy it to `.env` (production) or `.env.local` (local dev).

---

## 📜 Useful Commands

| Command | Description |
|---------|-------------|
| `yarn dev` | Run dev server (Turbopack) |
| `yarn build` | Build for production |
| `yarn start` | Run production server |
| `yarn lint` | Run lint checks |
| `yarn test` | Run unit tests (Jest) |

---

## 🐳 Deploy with Docker

The project uses a **multi-stage Docker build** with `output: "standalone"` to optimize image size.

### Build the image

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL='https://api.nhatrotuanviet.uk/api' \
  -t quanlynhatro-frontend .
```

> `NEXT_PUBLIC_API_URL` must be passed via `--build-arg` because it's inlined into the bundle at build time.

### Run the container

```bash
docker run -p 3000:3000 quanlynhatro-frontend
```

### Dockerfile stages

| Stage | Description |
|-------|-------------|
| `deps` | Install dependencies with `yarn install --frozen-lockfile` |
| `builder` | Build Next.js (standalone output) |
| `runner` | Minimal runtime, runs as non-root user `nextjs` |

---

## 🔄 Architecture & Data Flow

```
┌─────────────────────┐      HTTP/JSON       ┌──────────────────────┐
│   Next.js Frontend  │ ───────────────────► │   Backend API        │
│   (this repo)       │   Bearer token       │   (quanlynhatro-     │
│                     │ ◄─────────────────── │    backend)          │
└─────────────────────┘      JSON response   └──────────────────────┘
```

### API handling flow (`lib/api/axios-client.ts`)

1. **Request interceptor** — automatically attaches `Authorization: Bearer <token>` to every request (token read from `localStorage`).
2. **Response interceptor** — centralized error handling:
   - `401` → Clear token, show toast "Session expired, please log in again", redirect to `/login`
   - `400` → Show toast for invalid input data
   - Other errors → Show toast for system errors

### Data fetching

- Uses **TanStack Query** (`useQuery` / `useMutation`) in pages and custom hooks.
- Query keys follow the pattern: `["rooms", page, limit, search, statusFilter]` — changing any param triggers a refetch.

---

## 👨‍💻 Development Guide

### Adding a new page

1. Create a file in `app/(dashboard)/<page-name>/page.tsx` (or `app/(auth)/` for auth pages).
2. Use `"use client"` if the page needs client-side state/hooks.
3. Use `axiosClient` from `@/lib/api/axios-client` to call the API.
4. Use `useQuery` from `@tanstack/react-query` to fetch data.
5. Reuse components from `components/ui/` (shadcn/ui).

### Adding a new UI component

```bash
npx shadcn@latest add <component-name>
```

### Code conventions

- **TypeScript** — always define types/interfaces for data.
- **Formatting** — uses Biome (see `biome.json`).
- **File naming** — `kebab-case` for files, `PascalCase` for components.
- **Language** — UI text uses Vietnamese (with diacritics).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.