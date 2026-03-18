# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

BrokerFlow is a multi-step mortgage fact-find form built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.

### Multi-step wizard flow

The app is a 6-step sequential form wizard:
1. **`/`** — Introduction (server component)
2. **`/applicants`** — Applicant selection (server component)
3. **`/personal-details`** — Personal/contact/address details (server component)
4. **`/employment-income`** — Employment history with dynamic add/remove (client component)
5. **`/assets`** — All asset types with dynamic sections (client component)
6. **`/liabilities`** — (forthcoming)

Pages with dynamic data (add/remove records) use `"use client"` and `useState`. Static form pages are server components.

### Layout pattern

All pages share a consistent layout:
- **Sticky header** — Fixed top bar with logo and user info
- **`SidebarNav`** — Left navigation with 6-step progress, uses `usePathname()` for active state
- **Main content** — Centered, max-width constrained (`max-w-5xl`)

### State management

Client pages use local `useState` only — no global state, no Context, no external store. Dynamic list items use `id: Date.now()` for keying. All form state is ephemeral (no persistence yet).

### Key components

- **`src/components/SidebarNav.tsx`** — Step navigation with progress indicator
- **`src/components/CurrencyInput.tsx`** — Currency input with `$` prefix, comma formatting, 2-decimal limit
- **`CollapsibleSection` / `PhaseDivider`** — Defined inline in `assets/page.tsx`, not extracted to components yet

### Styling

- Tailwind 4 utility classes throughout; dark mode via `dark:` variant
- Custom theme tokens in `src/app/globals.css`: primary navy `#1a2b3d`, light bg `#f6f7f7`, dark bg `#15191d`
- Material Symbols Outlined icons loaded from Google Fonts CDN in `layout.tsx`
- Path alias `@/*` maps to `src/*`
