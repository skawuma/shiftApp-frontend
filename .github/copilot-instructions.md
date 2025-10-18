# Copilot Instructions for AI Agents

## Project Overview
- **Framework:** Angular (with Vite for dev server)
- **Purpose:** Shift request management for employees and admins
- **Key Domains:** Authentication, shift requests, admin approval, user dashboards

## Architecture & Patterns
- **Component Structure:**
  - `src/app/` contains feature folders (e.g., `admin-dashboard-component`, `employee-dashboard-component`, `login-component`, `register-component`)
  - Shared UI in `src/app/shared/`
  - Services in `src/app/servicves/` (note typo: "servicves" not "services")
  - Data models in `src/app/models/models.ts`
- **Routing:**
  - Defined in `app.routes.ts` with role-based guards (`authGuard`)
  - Main entry: `<app-root>` in `index.html`, renders `AppComponent` with Angular Material toolbar and router outlet
- **State & Auth:**
  - Auth state (JWT, role, userId, username) stored in `localStorage` with keys like `shift-app-token`
  - Auth logic in `servicves/auth.ts` (login, logout, register, token/role helpers)
- **API Integration:**
  - Backend API base URL from `environments/environment.ts` (`apiUrl`)
  - All requests use JWT from localStorage in `Authorization` header
  - Shift request logic in `servicves/request.service.ts` (submit, fetch, approve, reject)

## Developer Workflows
- **Start Dev Server:**
  - `ng serve` (Angular CLI, default port 4200)
  - Or use Vite: `vite` (configured in `vite.config.js`)
- **Build:**
  - `ng build`
- **Unit Tests:**
  - `ng test` (Karma)
- **E2E Tests:**
  - `ng e2e` (framework not included by default)

## Project Conventions
- **Component Naming:**
  - Folders and files use kebab-case, but some have inconsistent naming (e.g., `admin-dashboard-component`)
- **Service Directory:**
  - Services are under `servicves/` (typo is intentional in codebase)
- **Material UI:**
  - Uses Angular Material (see `MatToolbarModule`, `MatButtonModule` in `app.ts`)
- **Role-based Routing:**
  - Route `data` property specifies required role; enforced by `authGuard`
- **Environment Config:**
  - API URL is set in `src/app/environments/environment.ts` (dev/prod switching is manual)

## Integration Points
- **Backend:**
  - Expects REST API at `apiUrl` (see environment config)
  - Auth endpoints: `/auth/login`, `/auth/register`
  - Shift request endpoints: `/requests`, `/requests/admin`, `/requests/{id}/approve|reject`

## Examples
- **Add a new feature:**
  - Generate with Angular CLI: `ng generate component feature-name`
  - Register route in `app.routes.ts`
- **Access user info:**
  - Use `Auth` service methods: `getToken()`, `getRole()`, `getUsername()`, `getUserId()`
- **Submit a shift request:**
  - Use `RequestService.submitRequest()` with `{ requestedDates, shift }`

## Key Files
- `src/app/app.ts` (root component)
- `src/app/app.routes.ts` (routing)
- `src/app/servicves/auth.ts` (auth logic)
- `src/app/servicves/request.service.ts` (shift request logic)
- `src/app/models/models.ts` (data types)
- `vite.config.js` (Vite dev server config)
- `README.md` (basic CLI usage)

---

**If any conventions or workflows are unclear, please ask for clarification or check for updates in this file.**
