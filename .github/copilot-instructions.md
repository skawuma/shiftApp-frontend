## What this repo is

ShiftApp-frontend is an Angular 20 single-page application (no Angular CLI workspace subprojects). It uses standalone components (bootstrapApplication in `src/main.ts`) and Angular Material. The front-end talks to a backend REST API configured in `src/app/environments/environment.ts` (`environment.apiUrl`).

## High-level architecture

- Entry: `src/main.ts` uses bootstrapApplication(AppComponent, appConfig) — the app uses Angular's standalone components (no NgModule files).
- Root component: `src/app/app.ts` (selector `app-root`) provides the top toolbar and invokes `router-outlet` for navigation.
- Routing: `src/app/app.routes.ts` declares routes and uses `authGuard` for protected routes. Role-based route data is attached (example: `{ role: 'ROLE_ADMIN' }`).
- Services: look under `src/app/servicves/` (typo kept from project) for `auth.ts` and `request.service.ts` — these implement authentication and HTTP calls respectively.
- Components: major pages are in `admin-dashboard-component/`, `employee-dashboard-component/`, `login-component/`, and `register-component/`.

## Key files to reference

- `src/main.ts` — app bootstrap (standalone components)
- `src/app/app.ts` — root component, uses `Auth` service and Material toolbar
- `src/app/app.routes.ts` — route definitions and authGuard usage
- `src/app/environments/environment.ts` — API base URL and production flag
- `package.json` — build/test scripts (use `npm run start` / `ng serve`)

## Build, run, test quickly

- Start dev server: `npm start` (runs `ng serve`) — default host `localhost:4200`.
- Build production: `npm run build` (runs `ng build`) — outputs to `dist/`.
- Watch rebuilds: `npm run watch`.
- Unit tests: `npm test` (Karma + Jasmine) — see `package.json`.

If you need to run `ng` directly, project uses Angular CLI v20; prefer the npm scripts so local CLI version is used.

## Project-specific conventions and gotchas

- Standalone components: The project uses bootstrapApplication and component-level `imports` (standalone mode) instead of NgModules. See `AppComponent` in `src/app/app.ts` for the pattern.
- Service folder name typo: `src/app/servicves/` — reference services there (don't create `services/` duplicates).
- Role-based auth: Routes include `data: { role: 'ROLE_*' }`; `authGuard` enforces these. When adding routes follow this pattern.
- Environment API URL: `environment.apiUrl` (production is true by default in the file). Developers often uncomment local URLs for dev; keep `.env` or per-environment files consistent when adding CI.
- Material theming: app imports Material modules in component `imports`. Keep styles in `src/custom-theme.scss` and `src/styles.css`.

## Integration points

- REST API: All HTTP requests should use `environment.apiUrl` as the base. Search for usages in `request.service.ts`.
- Authentication: `src/app/servicves/auth.ts` handles login/logout and session state; many components inject `Auth` directly (see `AppComponent` constructor).

## Small examples and patterns

- Add a protected route with role check:

	- In `app.routes.ts` add: { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard], data: { role: 'ROLE_ADMIN' } }

- Use the API base URL in a service:

	- const url = `${environment.apiUrl}/shifts` (services import `environment` from `src/app/environments/environment`)

- Use standalone imports inside a component decorator (see `AppComponent` in `src/app/app.ts`):

	- imports: [NgIf, RouterModule, MatToolbarModule, MatButtonModule, RouterOutlet]

## Editing and PR guidance for AI agents

- Keep changes minimal and follow existing naming and folder conventions (note the `servicves` folder name).
- When adding new components prefer standalone components and include required Material/common imports in the `imports` array.
- Update `app.routes.ts` for navigation and preserve `authGuard` usage for protected routes. Add `data.role` when route is role-specific.
- Don't change `environment.ts` production flag unless adding a new environment file; prefer creating `environment.dev.ts` + angular build configurations if needed.

## Tests and quick checks

- After code changes run `npm test` and `npm run build` to catch type or template errors. Angular compiler errors are common if imports are missing in standalone components.

---

If any of these points are incomplete or you'd like the agent to follow stricter rules (commit message style, PR branch name format, or additional local scripts), tell me and I will update this file.  
