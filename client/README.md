# Portfolio Frontend

Personal portfolio frontend built with React, Vite, Tailwind CSS, and Zustand.

## Structure

- `src/components/common` – Reusable UI (Navbar, Footer, Button, Card, etc.)
- `src/components/sections` – Page sections (Hero, About, Skills, Projects, Contact, Stats)
- `src/components/admin` – Admin panel components
- `src/stores` – Zustand stores (auth, theme, projects)
- `src/pages` – Page components and admin pages
- `src/services` – API services (auth, projects, contact)
- `src/utils` – Constants, formatters, validators
- `src/styles` – Global CSS and Tailwind

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint
