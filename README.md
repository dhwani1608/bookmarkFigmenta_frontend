# Bookmark UI (Frontend)

React + Vite frontend for the Bookmark Manager.

## Requirements

- Node.js 18+

## Setup

```bash
npm install
npm run dev
```

App runs on http://localhost:5173

## Environment Variables

- `VITE_API_URL` (optional) - Base URL for the backend API. Leave empty to use the dev proxy.

## Build

```bash
npm run build
npm run preview
```

## Notes

- Uses Tailwind CSS with dark mode via the `dark` class on `html`.
- `frontend/.env.example` shows the production API URL shape.
