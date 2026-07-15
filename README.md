# PRscribe — AI Code Review for GitHub Pull Requests

PRscribe is a GitHub App that automatically reviews pull requests with AI. A user signs into a Next.js dashboard with GitHub, installs the **PRscribe GitHub App** on their repos, and from then on every opened PR gets: an in-progress check run, an AI-generated code review comment (via Gemini), a pass/fail check-run conclusion, sending email notification to repo maintainer and an automatic approve/request-changes review — all visible afterward on the dashboard.

| Repo | Role | Stack |
|---|---|---|
| `PRscribe` (frontend) | Marketing site, GitHub login, dashboard, session handling | Next.js 15 (App Router), React, TypeScript, NextAuth, Tailwind, Recharts |
| `repo-manager` (backend) | GitHub OAuth user-sync, GitHub App installation tracking, webhook-driven AI PR review, data API | Node.js, Express 5, TypeScript, Prisma + PostgreSQL, Octokit (GitHub App auth), Google Generative AI SDK |


---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Repository Structure](#2-repository-structure)
3. [Database Schema (Prisma / PostgreSQL)](#3-database-schema-prisma--postgresql)
4. [Frontend — Route & Component Map](#4-frontend--route--component-map)
5. [Sign-in & User Sync Flow](#5-sign-in--user-sync-flow)
6. [GitHub App Installation Flow](#6-github-app-installation-flow)
7. [Pull Request AI Review Pipeline](#7-pull-request-ai-review-pipeline)
8. [Dashboard Data Flow](#8-dashboard-data-flow)
9. [Backend Route Reference](#9-backend-route-reference)
10. [Environment Variables](#10-environment-variables)
11. [Running Locally](#11-running-locally)
12. [Tech Stack Summary](#12-tech-stack-summary)
---

## 1. High-Level Architecture

```mermaid
flowchart TB
    subgraph Client["🧑 User's Browser"]
        UI[PRscribe Web App]
    end

    subgraph Frontend["Frontend — Next.js (Vercel)"]
        Pages["Pages: / , /login , /dashboard , /logout"]
        NextAuthAPI["/api/auth/[...nextauth]\n(NextAuth handler)"]
        Middleware["middleware.ts\n(protects /dashboard)"]
    end

    subgraph Backend["Backend — repo-manager (Express + TS)"]
        UserRoute["POST /user"]
        CheckRoute["POST /check"]
        GetPrRoute["POST /getPr"]
        Webhook["POST /webhook"]
        GithubAuth["utils/githubAuth.ts\ngetInstallationToken()"]
        Gemini["integrations/gemini.ts\ngiveContent()"]
    end

    DB[("PostgreSQL\nvia Prisma\nUser / Installation / PullRequest")]
    GitHubOAuth["GitHub OAuth App\n(user identity)"]
    GitHubApp["GitHub App: PRscribe\n(installation, checks, comments, reviews)"]
    GeminiAPI["Google Gemini API\n(gemini-2.5-flash)"]

    UI -->|"1. Continue with GitHub"| Pages
    Pages --> NextAuthAPI
    NextAuthAPI <-->|"OAuth redirect + callback"| GitHubOAuth
    NextAuthAPI -->|"signIn event"| UserRoute
    UserRoute --> DB
    Middleware -->|guards| Pages

    Pages -->|"2. Install GitHub App"| GitHubApp
    GitHubApp -->|"installation created/deleted webhook"| Webhook
    Webhook --> DB

    GitHubApp -->|"pull_request opened webhook"| Webhook
    Webhook --> GithubAuth
    GithubAuth -->|"installation access token"| GitHubApp
    Webhook -->|"list PR file diffs"| GitHubApp
    Webhook --> Gemini
    Gemini --> GeminiAPI
    GeminiAPI -->|"review text"| Gemini
    Webhook -->|"check run + comment + review"| GitHubApp
    Webhook -->|"save PullRequest row"| DB

    Pages -->|"POST /check, POST /getPr"| CheckRoute
    Pages --> GetPrRoute
    CheckRoute --> DB
    GetPrRoute --> DB
```

Two distinct GitHub integrations are in play, and they're linked by `githubId`:

- **GitHub OAuth App** — used only for *user login* on the frontend (NextAuth, `lib/authOptions.ts`). Produces a session + syncs a `User` row.
- **GitHub App ("PRscribe")** — installed by the user on specific repos/orgs. It's what actually gets webhook deliveries (`installation`, `pull_request`) and what the backend authenticates as (via `@octokit/app` + a private key) to comment, create check runs, and submit reviews on PRs.

---

## 2. Repository Structure

### Frontend — `PRscribe/`

```
PRscribe/
├── app/
│   ├── api/auth/[...nextauth]/route.ts   # NextAuth API handler (GET/POST)
│   ├── dashboard/page.tsx                # Protected dashboard (PR list + chart)
│   ├── login/page.tsx                    # GitHub sign-in button
│   ├── logout/page.tsx                   # Sign-out confirmation
│   ├── layout.tsx                        # Root layout, fonts, <Providers>
│   └── page.tsx                          # Marketing / landing page
├── components/
│   ├── providers.tsx                     # <SessionProvider> wrapper
│   ├── LightRays.tsx / .css              # Decorative hero background
│   └── ui/                               # shadcn/ui primitives
├── lib/
│   ├── authOptions.ts                    # NextAuth config: GitHub provider + signIn event
│   └── utils.ts                          # `cn()` class-merge helper
├── middleware.ts                         # Route guard for /dashboard/*
└── package.json
```

### Backend — `repo-manager/`

```
repo-manager/
├── prisma/
│   ├── schema.prisma          # User, Installation, PullRequest models
│   └── migrations/            # 8 migrations tracking schema evolution
├── src/
│   ├── index.ts                # Express app: /user, /check, /dashboard, /getPr, /webhook
│   ├── integrations/
│   │   └── gemini.ts           # giveContent() — Gemini code-review prompt (streamed)
│   ├── utils/
│   │   └── githubAuth.ts       # getInstallationToken() — GitHub App auth via Octokit
│   └── types/
│       └── Github.d.ts         # GitHubUser type (currently unused in index.ts)
├── prisma.config.ts
├── tsconfig.json
└── package.json
```

The backend is TypeScript, compiled with `tsc -b` and run from `dist/index.js` (see `"dev": "tsc -b && node dist/index.js"` in `package.json`).

---

## 3. Database Schema (Prisma / PostgreSQL)

```mermaid
erDiagram
    User ||--o{ Installation : has
    User ||--o{ PullRequest : owns

    User {
        string id PK
        string email UK
        int githubId UK
        string username UK
        string avatarUrl
        string accessToken
        boolean hasInstalledApp
        datetime createdAt
        datetime updatedAt
    }

    Installation {
        string id PK
        int installationId UK
        string accountLogin
        string accountType
        string appSlug
        int repositoryCount
        string targetType
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    PullRequest {
        string id PK
        int pullRequestId UK
        string title
        string url
        string branches
        string reponame
        string summary
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
```

- `User.githubId` is the join key between the OAuth login identity and everything else (installations, PRs).
- `User.hasInstalledApp` is a denormalized flag flipped by the `installation` webhook, so `/check` can answer with a single row lookup instead of joining `Installation`.
- `PullRequest.summary` stores the Gemini-generated review text, which is what the dashboard's PR-detail modal displays.
- Migration history (`prisma/migrations/`) shows the schema evolving from a bare `username`/`password` table → dropping `password` → adding `PullRequest` → making `username`/`email` unique → adding `url`/extra fields — i.e. auth was originally going to be credential-based before GitHub OAuth was adopted.

---

## 4. Frontend — Route & Component Map

```mermaid
flowchart LR
    RootLayout["app/layout.tsx"]
    Providers["components/providers.tsx\n<SessionProvider>"]

    Home["app/page.tsx  →  /\nLanding page"]
    Login["app/login/page.tsx  →  /login\nsignIn('github')"]
    Dashboard["app/dashboard/page.tsx  →  /dashboard\n(protected by middleware.ts)"]
    Logout["app/logout/page.tsx  →  /logout\nsignOut()"]
    NextAuthRoute["app/api/auth/[...nextauth]/route.ts"]

    RootLayout --> Providers
    Providers --> Home
    Providers --> Login
    Providers --> Dashboard
    Providers --> Logout

    Login -->|signIn| NextAuthRoute
    Dashboard -->|useSession| NextAuthRoute
    Logout -->|signOut| NextAuthRoute
    NextAuthRoute --> AuthOptions["lib/authOptions.ts"]

    Dashboard --> UICard["components/ui/card.tsx"]
    Dashboard --> Recharts["recharts (ComposedChart)"]
    Home --> LightRays["components/LightRays.tsx"]
```

`middleware.ts` uses `withAuth` from `next-auth/middleware`, scoped via `matcher` to `/dashboard` and `/dashboard/:path*` — unauthenticated requests are redirected to `/login`.

---

## 5. Sign-in & User Sync Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant NextAuth as NextAuth (frontend)
    participant GitHub as GitHub OAuth
    participant Backend as repo-manager\nPOST /user
    participant DB as PostgreSQL

    User->>Browser: Click "Continue with GitHub"
    Browser->>NextAuth: signIn("github", { callbackUrl: "/dashboard" })
    NextAuth->>GitHub: Redirect to authorize URL
    GitHub-->>User: Consent screen
    User->>GitHub: Approve
    GitHub-->>NextAuth: code → exchanged for access_token + profile
    NextAuth->>NextAuth: profile() maps id, login, avatar_url, name, email
    NextAuth->>Backend: events.signIn → POST /user\n{githubId, username, avatarUrl, accessToken, email}
    Backend->>Backend: validate required fields (400 if missing)
    Backend->>DB: prisma.user.upsert({ where: {githubId}, update / create })
    DB-->>Backend: User row
    Backend-->>NextAuth: 200 { message, user }
    NextAuth-->>Browser: Set session cookie, redirect to /dashboard
```

- `POST /user` requires `githubId`, `username`, `avatarUrl`, `accessToken`, `email` — missing any returns `400`.

---

## 6. GitHub App Installation Flow

Once logged in, the dashboard prompts the user to install the **PRscribe GitHub App** (`github.com/apps/pr-managers`) if `hasInstalledApp` is `false`. GitHub then sends `installation` webhook events.

```mermaid
sequenceDiagram
    participant GitHub
    participant Webhook as POST /webhook
    participant DB as PostgreSQL

    Note over GitHub,DB: Installation created
    GitHub->>Webhook: X-Github-Event: installation, action: "created"
    Webhook->>DB: find User where githubId = installation.account.id
    alt user found
        Webhook->>DB: update User.hasInstalledApp = true
        Webhook->>DB: create Installation\n(installationId, accountLogin, accountType, appSlug, userId)
    end
    Webhook-->>GitHub: 200 OK

    Note over GitHub,DB: Installation deleted (uninstalled)
    GitHub->>Webhook: X-Github-Event: installation, action: "deleted"
    Webhook->>DB: delete Installation where installationId = ...
    alt deletion succeeded
        Webhook->>DB: update User.hasInstalledApp = false
        Webhook-->>GitHub: 200 OK
    else installation row missing
        Webhook-->>GitHub: 500 (installation not found)
    end
```

---

## 7. Pull Request AI Review Pipeline

The core feature. Triggered on `pull_request` events where `action === "opened"`.

```mermaid
sequenceDiagram
    participant GitHub
    participant Webhook as POST /webhook
    participant Auth as githubAuth.ts
    participant Octokit as Octokit (installation-scoped)
    participant Gemini as gemini.ts
    participant GeminiAPI as Google Gemini\n(gemini-2.5-flash)
    participant DB as PostgreSQL

    GitHub->>Webhook: pull_request "opened" payload
    Webhook-->>GitHub: 200 OK (ack immediately, avoid timeout)

    Webhook->>Auth: getInstallationToken(owner)
    Auth->>DB: find Installation by accountLogin = owner
    Auth->>Octokit: App.getInstallationOctokit(installationId)
    Octokit-->>Auth: installation access token
    Auth-->>Webhook: token

    Webhook->>DB: find User by githubId = PR author's id
    alt user not found
        Webhook->>Webhook: log error, stop
    end

    Webhook->>Octokit: checks.create (status: in_progress,\n"PRscribe reviewing your pull request...")
    Webhook->>Octokit: issues.createComment ("wait, PRscribe is reviewing the PR")

    Webhook->>Octokit: pulls.listFiles(owner, repo, prNumber)
    Octokit-->>Webhook: changed files + patches

    Webhook->>Webhook: build diff text: "File: X\nChanges:\n<patch>" per file
    Webhook->>Gemini: giveContent(diffText)
    Gemini->>GeminiAPI: generateContentStream(reviewPrompt + diffs)
    GeminiAPI-->>Gemini: streamed chunks
    Gemini-->>Webhook: full review text (concatenated)

    Webhook->>DB: pullRequest.upsert(by pullRequestId)\n{title, summary, url, branches, reponame}
    Webhook->>Octokit: issues.deleteComment(waiting comment)
    Webhook->>Octokit: issues.createComment(review text)

    Webhook->>Webhook: decision = review contains "fix"/"error" ? failure : success
    Webhook->>Octokit: checks.update(status: completed, conclusion: decision)
    Webhook->>Octokit: pulls.createReview(event: APPROVE or REQUEST_CHANGES)
```
---

## 8. Dashboard Data Flow

```mermaid
flowchart TD
    Mount["Dashboard component mounts"]
    Session{"useSession()\nauthenticated?"}
    CheckCall["POST /check { email }"]
    Installed{"installed?"}
    GetPrCall["POST /getPr { email }"]
    BuildChart["Bucket PRs into last-14-days\ncreated vs updated counts"]
    RenderInstallCTA["Render 'Install GitHub App' CTA"]
    RenderChart["Recharts ComposedChart:\nCreated vs Updated"]
    RenderList["Render PR cards grid"]
    RenderModal["Click card → modal\ntitle, summary, repo, branch, link"]

    Mount --> Session
    Session -->|no| End1["render nothing"]
    Session -->|yes| CheckCall
    CheckCall --> Installed
    Installed -->|false| RenderInstallCTA
    Installed -->|true| GetPrCall
    GetPrCall --> BuildChart --> RenderChart
    GetPrCall --> RenderList --> RenderModal
```

- `POST /check` looks up `User` by `email` and returns `{ installed: user.hasInstalledApp }`. If no user row exists, it returns `404`.
- `POST /getPr` looks up the `User` by `email`, then `prisma.pullRequest.findMany({ where: { userId } })`, returning `{ prdata: PullRequest[] }` — exactly the shape `app/dashboard/page.tsx` expects.
- The 14-day activity chart and the summary shown in the click-through modal (`selectedPr.summary`) are both fed directly from the `PullRequest.summary` column written by the webhook pipeline in [§7](#7-pull-request-ai-review-pipeline).

---

## 9. Backend Route Reference

| Method | Path | Purpose | Backed by |
|---|---|---|---|
| `GET` | `/` | Health/landing text ("Home Page. Welcome") | — |
| `POST` | `/user` | Upsert a user by `githubId` | Prisma `User` |
| `POST` | `/check` | Return `{ installed: boolean }` for a given email | Prisma `User.hasInstalledApp` |
| `GET` | `/dashboard` | Plain-text placeholder ("Dashboard page") | — (not the real dashboard; that's the Next.js `/dashboard`) |
| `POST` | `/getPr` | Return `{ prdata: PullRequest[] }` for a given email | Prisma `PullRequest` |
| `POST` | `/webhook` | Handles `installation` (created/deleted) and `pull_request` (opened) GitHub webhook events | Prisma `User`/`Installation`/`PullRequest` + Octokit + Gemini |


---

## 10. Environment Variables

### Frontend (`PRscribe/.env.local`)

| Variable | Used in | Purpose |
|---|---|---|
| `GITHUB_CLIENT_ID` | `lib/authOptions.ts` | GitHub **OAuth App** client ID (login) |
| `GITHUB_CLIENT_SECRET` | `lib/authOptions.ts` | GitHub OAuth App client secret |
| `NEXT_PUBLIC_BACKEND_URL` | `authOptions.ts`, `dashboard/page.tsx` | Base URL of the backend (must end in `/`) |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | NextAuth (implicit) | Session signing/config |

### Backend (`repo-manager/.env`)

| Variable | Used in | Purpose |
|---|---|---|
| `DATABASE_URL` | `prisma.config.ts`, all Prisma calls | PostgreSQL connection string |
| `GEMINI_API_KEY` | `integrations/gemini.ts` | Google Generative AI API key |
| `GITHUB_APP_ID` | `utils/githubAuth.ts` | GitHub **App** ID (installation auth, not OAuth) |
| `GITHUB_PRIVATE_KEY` | `utils/githubAuth.ts` | GitHub App private key (PEM, `\n`-escaped in env) |


---

## 11. Running Locally

```mermaid
flowchart LR
    A["1. Backend:\ncd repo-manager\nnpm install\ncreate .env (§10)\nnpx prisma migrate dev"] --> B["2. npm run dev\n(tsc -b && node dist/index.js)"]
    B --> C["3. Frontend:\ncd PRscribe\nnpm install\ncreate .env.local (§10)\nnpm run dev"]
    C --> D["4. Open http://localhost:3000"]
    D --> E["5. Create a GitHub App\n(for GITHUB_APP_ID / PRIVATE_KEY)\nand a GitHub OAuth App\n(for GITHUB_CLIENT_ID/SECRET)"]
    E --> F["6. Expose backend via tunnel\n(e.g. ngrok) and point the\nGitHub App's webhook URL\nat {tunnel-url}/webhook"]
```

---

## 12. Tech Stack Summary

**Frontend**
- Next.js 15 (App Router) + React + TypeScript
- NextAuth v4 (GitHub OAuth provider)
- Tailwind CSS v4 + shadcn/ui (`new-york` style) + `lucide-react`
- Recharts for the PR activity chart
- `axios` for calling the backend

**Backend**
- Node.js + Express 5, TypeScript (ESM, `"type": "module"`)
- Prisma ORM + PostgreSQL (8 migrations tracking schema evolution)
- `@octokit/app` + `octokit` — GitHub App authentication, checks, comments, reviews
- `@google/generative-ai`, model `gemini-2.5-flash`, streamed generation
- `cors`, `express-session`, `cookie-parser`, `jsonwebtoken` are installed but session/cookie/JWT machinery isn't exercised in `index.ts` — likely scaffolding for future auth-hardening

---