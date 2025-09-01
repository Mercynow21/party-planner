# Party Planner

A kid‑friendly React + TypeScript app to plan a 60‑minute classroom party for 24 students on a $30 budget.

## Features
- Items with price and quantity, live total with $30 cap
- Peanut‑allergy filter (hides items marked as containing peanuts)
- 60‑minute schedule editor (one line per minute)
- Export plan as Markdown (copy or download)
- Templates selector (pre‑built peanut‑free plans)
- Smart budgeting suggestions + Auto‑balance to fit the budget
- Local save/load (persists in browser `localStorage`)
- Tailwind UI with playful theme; Vitest unit tests for math

## Tech
- React + TypeScript + Vite
- Tailwind CSS
- Vitest (+ jsdom)

## Getting started
```bash
npm install
npm run dev
```
Open the URL shown (e.g., `http://localhost:5173`). To share on your LAN:
```bash
npm run dev -- --host --port 5174
```
Then open `http://<your-local-ip>:5174` on your phone/tablet.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – type‑check and build
- `npm run preview` – preview the production build
- `npm run test` – run unit tests

## How to use
1) Choose a template (or start with the defaults)
2) Add/edit items. Toggle “Contains peanuts” on any item when needed
3) Use the Peanut‑allergy filter to hide unsafe items from the total
4) Check Remaining and Per‑student badges; click Auto‑balance if needed
5) Edit the 60‑minute schedule on the bottom
6) Export your plan as Markdown (copy or download) or print it

Your plan auto‑saves in the browser. Use the “Reset” button to restore the default template.

## Smart budgeting
When over budget, the app suggests:
- Reducing quantities of the highest cost items first
- Optionally swapping one drink for a cheaper mix/water
Click “Auto‑balance” to apply suggestions until within the cap.

## Accessibility
- Keyboard‑focus styles on inputs and buttons
- High‑contrast header colors

## Deploy
Any static host works (Netlify, Vercel, GitHub Pages). Example steps:
```bash
npm run build
# deploy the dist/ folder to your hosting provider
```

## License
MIT
