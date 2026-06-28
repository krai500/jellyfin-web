# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install          # Install dependencies (requires Node.js >=24, npm >=11)
npm start            # Dev server with hot reload (webpack)
npm run build:development   # Build with sourcemaps
npm run build:production    # Production build
npm run build:check  # TypeScript type check only (no emit)
npm run lint         # ESLint
npm run stylelint    # Stylelint for CSS/SCSS files
npm test             # Run tests once (Vitest)
npm run test:watch   # Run tests in watch mode
```

To run a single test file:
```sh
npx vitest run src/utils/string.test.ts --config vite.config.ts
```

## Architecture

### Tech Stack

- **TypeScript** — all new files must be `.ts`/`.tsx`
- **React 18** with React Router v6 (hash router) for routing
- **TanStack Query** for all server state / API data fetching
- **MUI v6** components in Dashboard and Experimental apps only (not Stable/TV)
- **Webpack** for bundling; **Vitest** + jsdom for tests
- **Jellyfin TypeScript SDK** (`@jellyfin/sdk`) for all API interactions — not the legacy `jellyfin-apiclient`

### Application Entry

`src/index.jsx` → `src/RootApp.tsx` (providers) → `src/RootAppRouter.tsx` (router)

The router selects routes based on `layoutManager.layout`:
- **Experimental layout**: `EXPERIMENTAL_APP_ROUTES`
- **Default**: `STABLE_APP_ROUTES`
- Always includes `DASHBOARD_APP_ROUTES` and `WIZARD_APP_ROUTES`

### Four Sub-Apps

| App | Path | Notes |
|-----|------|-------|
| `src/apps/stable` | Main user UI | TV layout supported; legacy+React mix |
| `src/apps/experimental` | Rewrite in progress | MUI-based; no TV support |
| `src/apps/dashboard` | Admin/metadata | Fully MUI; no TV support |
| `src/apps/wizard` | Setup wizard | First-time setup only |

Each app has its own `routes/`, `features/`, and `components/` subdirectories (Bulletproof React structure).

### Key Providers (wrapping the whole app)

```
PersistQueryClientProvider  → TanStack Query with IDB persistence
  ApiProvider               → Jellyfin SDK client (useApi hook)
    UserSettingsProvider    → User preferences
      WebConfigProvider     → Server web config
        RootAppRouter
```

### Plugins (`src/plugins`)

Dynamically loaded at runtime. All media player implementations live here (not actual server plugins). Native wrappers can override them.

### Legacy vs. New Code

| Legacy (avoid for new code) | Replacement |
|-----------------------------|-------------|
| `src/elements` web components | MUI components |
| `src/components/router/appRouter.js` | React Router |
| `jellyfin-apiclient` package | `@jellyfin/sdk` |
| jQuery | Plain JS/TS |
| `src/controllers/` | React pages/routes |
| `src/scripts/` | `src/utils/` or app-specific code |

`src/controllers/` and `src/scripts/` are deprecated — do not add new files there.

### Adding New Code

- New files go under the relevant `src/apps/<app>/` directory unless they are shared across apps
- Shared utilities → `src/utils/`, hooks → `src/hooks/`, types → `src/types/`
- Dynamic imports should only be used at the page/route level; let webpack handle code splitting elsewhere
- Avoid referencing browser globals directly; use imports for dependencies

### Localization

Translation strings live in `src/strings/`. Only commit changes to `en-us.json` directly — all other languages are managed via Weblate. Do not rename existing keys without strong justification (it breaks all translations).

### Browser Compatibility

The `browserslist` in `package.json` includes old TV browser engines (Chrome 27, Edge 18, Firefox ESR). Use only JS/CSS features that are in the supported set or can be polyfilled. Polyfills are in `src/lib/legacy/`.
