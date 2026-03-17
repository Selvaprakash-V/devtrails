# DevTrails - Parametric Insurance (Frontend)

Demo React app (Vite) for an AI-powered parametric insurance platform for gig workers.

Getting started:

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm start
```

App pages:
- Register: register a user (stores a user in localStorage)
- Plan Selection: choose a weekly plan (mock API /localStorage)
- Dashboard: view user, simulate rain payouts
- Admin: summary stats

Notes:
- APIs are mocked in `src/services/api.js` using `localStorage`.
- Uses Tailwind CSS for styling.
