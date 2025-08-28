# SmartForm UI (React + TypeScript + Vite)

This repository contains the frontend for the SmartForm project — a React + TypeScript app built with Vite. It provides a thin UI layer that talks to a backend API (see `src/services/*`) for authentication, form generation and form submissions.

This README covers:
- Quick start (install & run)
- Project structure and important files
- How the frontend talks to the API (endpoints discovered in `src/services`)
- Complete curl examples for every endpoint the UI currently calls
- Troubleshooting and notes

Checklist (what this README includes):

- [x] Install & dev run instructions
- [x] Key files and where to change API base URL
- [x] All API endpoints used by the frontend with example curl commands
- [x] Authentication token usage in curl examples

---

## Quick start

Prerequisites: Node.js (v18+ recommended) and npm on your machine.

Open a terminal (PowerShell on Windows):

```powershell
cd d:\void-pirates\SmartForm\smartform-ui
npm install
npm run dev
```

The app runs with Vite. By default the dev server will be available at http://localhost:5173.

Build for production:

```powershell
npm run build
npm run preview
```

Scripts available (from `package.json`):

- `dev` — start Vite dev server
- `build` — TypeScript build and Vite build
- `preview` — preview the production build
- `lint` — run ESLint

---

## Important files

- `src/services/apiService.ts` — axios client and helpers (base URL and interceptors live here)
- `src/services/authService.ts` — login/register helper functions
- `src/services/formService.ts` — form-related helpers (create form, send messages, get submissions)
- `src/pages/*` — UI pages (CreateForm, ViewForm, ViewFormSubmissions, Dashboard, etc.)

If you need to change the backend URL used by the UI, update `API_BASE_URL` at the top of `src/services/apiService.ts`. The file currently contains a placeholder/ngrok URL and a header `ngrok-skip-browser-warning` used during development.

---

## API endpoints used by the frontend

The frontend calls the following API endpoints (these are taken from `src/services/*.ts`). Replace <API_BASE_URL> with your API root (for example, `https://your-api.example.com/api`). Many examples below require a Bearer token in the `Authorization` header when the endpoint is protected.

Notes:
- The project uses an axios client at `src/services/apiService.ts` that sets `Content-Type: application/json` and adds `Authorization: Bearer <token>` from `localStorage.token` when present.
- Some endpoints are public (no token needed); others require authentication.

Base URL placeholder used in examples:

```
<API_BASE_URL> = https://your-api.example.com/api
```

### Authentication

1) Register (POST /Auth/register)

```bash
curl -X POST "<API_BASE_URL>/Auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"s3cret"}'
```

2) Login (POST /Auth/login)

```bash
curl -X POST "<API_BASE_URL>/Auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"s3cret"}'
```

Example: extract token from response (requires `jq`):

```bash
TOKEN=$(curl -s -X POST "<API_BASE_URL>/Auth/login" -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"s3cret"}' | jq -r '.token')
echo $TOKEN
```

On Windows PowerShell you can use `ConvertFrom-Json` to parse the response:

```powershell
$resp = curl -Method Post -Uri "<API_BASE_URL>/Auth/login" -Body (@{ email = 'john@example.com'; password = 's3cret' } | ConvertTo-Json) -Headers @{ 'Content-Type' = 'application/json' }
$token = ($resp.Content | ConvertFrom-Json).token
Write-Output $token
```

### Chat / Form creation

3) Create a new form / start Chat processing (POST /Chat)

This endpoint is invoked by `src/services/formService.ts` via `postData('/Chat', ...)`. Example payload used in the UI: { formName, message }.


```bash
curl -X POST "<API_BASE_URL>/Chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"formName":"My Survey","message":"Create a 3-question survey about product usage"}'
```

4) Send a message to a public form (PUT /Chat/form/public/{formId})

Used to send follow-up messages or progress messages to a form generator.

```bash
curl -X PUT "<API_BASE_URL>/Chat/form/public/{formId}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"message":"Please add a demographic question"}'
```

### Form finalization & retrieval

5) Submit final JSON for a form (PUT /Forms/{formId}/finaljson)

The UI calls this when the generated form JSON is finalized. The payload key is `finalJson` and typically contains a JSON string.

```bash
curl -X PUT "<API_BASE_URL>/Forms/{formId}/finaljson" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"finalJson":"{\"fields\":[...]}"}'
```

6) Get public form details (GET /Forms/public/{formId}/finaljson)

```bash
curl -X GET "<API_BASE_URL>/Forms/public/{formId}/finaljson"
```

7) Get submissions for a form (GET /Forms/{formId}/submissions)

This endpoint typically requires authentication (the frontend reads it through `getFormSubmissions`).

```bash
curl -X GET "<API_BASE_URL>/Forms/{formId}/submissions" \
  -H "Authorization: Bearer <TOKEN>"
```

8) Get all forms (GET /forms)

```bash
curl -X GET "<API_BASE_URL>/forms" \
  -H "Authorization: Bearer <TOKEN>"
```

9) Submit a public form response (POST /Forms/public/{id}/submit)

Some UI pages call `POST /Forms/public/:id/submit` when an end user completes a public form. The exact payload varies depending on the generated form schema — the UI constructs `payload` and posts it.

```bash
curl -X POST "<API_BASE_URL>/Forms/public/{id}/submit" \
  -H "Content-Type: application/json" \
  -d '{"answers": {"q1": "Yes", "q2": "No"}}'
```

---

## How to change the API base URL used by the frontend

Open `src/services/apiService.ts` and update the `API_BASE_URL` constant near the top of the file. Example:

```ts
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://your-api.example.com/api';
```

Using an environment variable like `VITE_API_BASE_URL` is recommended for multi-environment setups.

---

## Troubleshooting

- If you see CORS or `ngrok` related warnings, check whether the `ngrok-skip-browser-warning` header was added by the original developer in `apiService.ts` and remove it for production.
- If auth requests fail, verify tokens are stored in `localStorage` under `token` (the `apiClient` interceptor reads `localStorage.getItem('token')`).
- If Vite dev server won't start, ensure Node and npm are updated and run `npm install` again.

---

## Where to look next

- `src/pages/CreateForm.tsx` — UI that starts the Chat/form creation flow
- `src/pages/ViewForm.tsx` — public form rendering and submission (look for how `POST /Forms/public/:id/submit` is used)
- `src/pages/ViewFormSubmissions.tsx` — lists submissions for a given form

If you want, I can also:

- Add a small `.env.example` and wire `VITE_API_BASE_URL` into `apiService.ts`.
- Generate Postman collection / OpenAPI snippets from these endpoints.

---

Summary

This README describes how the frontend runs and how it communicates with the backend. The included curl examples should let you exercise the same endpoints the UI calls. Update `src/services/apiService.ts` to point at the correct API base URL before running the UI.
