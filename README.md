# Baseline Front Angular 20

Proyecto base para apps web modernas en Angular 20, 100% standalone (sin NgModules), con autenticación, interceptores, layout con shell, notificaciones tipo toast y estructura limpia para escalar por features.

## Requisitos

- **Node.js**: versión recomendada `>= 18.x` (LTS) o `>= 20.x` estable.
- **Angular CLI**: `npm i -g @angular/cli` (opcional si usas `npm start`).
- **npm**: `>= 9.x` (o `pnpm`/`yarn` si lo prefieres, ajustando comandos).

## Instrucciones

- **Instalación**

```bash
npm install
```

- **Desarrollo**

```bash
npm start        # si está mapeado a ng serve
# o
ng serve -o      # abrir automáticamente el navegador
```

- **Build producción**

```bash
npm run build
# salida: dist/__PROJECT_SLUG__
```

Opcional: servir estáticos

```bash
npx http-server dist/__PROJECT_SLUG__ -p 4200
```

## Comandos útiles

```bash
# Limpieza de instalación
rm -rf node_modules package-lock.json && npm install

# Linter (si está configurado)
npm run lint

# Pruebas unitarias (cuando se agreguen)
npm test

# Análisis de tamaño del bundle (Angular budgets)
ng build --configuration production

# Ejecutar con un entorno específico
ng serve --configuration=production
ng serve --configuration=qa

# Generar componentes standalone (CLI)
ng g component app/components/example --standalone --flat

# Generar guard funcional (CanMatchFn)
ng g guard app/core/guards/example --functional

# Generar servicio
ng g service app/services/example
```

## Arquitectura

- **Core**
  - Interceptores: `auth` (Bearer token), `base-url` (prepend de API base), `loading` (spinner global con contador), `error` (manejo y notificaciones 401/403/500/network).
  - Guards: `authMatchGuard` (CanMatchFn para rutas autenticadas), `roleGuard` (roles vía `Route.data.roles`).
  - Servicios:
    - `AuthService`: estado con signals (`user`, `token`), `login/logout/hasRole`.
    - `ApiService`: CRUD HTTP con opciones de headers/params y logging.
    - `StorageService`: wrapper de `localStorage` con prefijo tokenizado.
    - `LoggerService`: logging por ambiente.
    - `UtilsService`: `signal<boolean>` para loading global (contador de peticiones).
    - `NotificationService`: cola de toasts con signals y auto-dismiss.
    - `FormErrorService`: helper de mensajes de error para formularios reactivos.

- **Shared**
  - Componentes reutilizables standalone:
    - `LoadingComponent`: overlay de carga conectado a `UtilsService`.
    - `NotificationComponent`: toasts flotantes conectados a `NotificationService`.
    - Espacio para futuros UI genéricos (tablas, modals, chips, inputs).

- **Components / Features**
  - `LayoutComponent`: shell autenticado con `HeaderComponent` + `<router-outlet>` y `<app-notification>`.
  - `HeaderComponent`: navegación y acciones de sesión.
  - `LoginComponent`: formulario reactivo con `FormErrorService` para mensajes.
  - `HomeComponent`: página base autenticada.
  - `Error Pages`: `NotFoundComponent` (404), `ForbiddenComponent` (403).

- **Routing**
  - `app.routes.ts`: rutas standalone con `loadComponent` (lazy por componente), `canMatch` para autenticación y roles.
  - Wildcard `**` sirve `NotFoundComponent`.

- **Estilos**
  - `styles.scss` con theming (Angular Material M2), tokens de color/typografía, utilidades globales de UI.

## Estructura de carpetas (guía práctica)

```
src/app/
  app.routes.ts                # rutas principales
  layout/                      # shell de la app (global)
    layout.component.*         # shell autenticado
    header/                    # HeaderComponent (navbar)
      header.component.*
  features/                    # subdominios funcionales
    auth/
      login/                   # LoginComponent
        login.component.*
    home/                      # HomeComponent
      home.component.*
    error/                     # páginas de error
      forbidden/               # ForbiddenComponent
        forbidden.component.*
      not-found/               # NotFoundComponent
        not-found.component.*
  core/                        # infraestructura cross-cutting
    guards/                    # authMatchGuard, roleGuard
    interceptors/              # base-url, auth, loading, error
    services/                  # api, storage, logger, notification, form-error
    constants/                 # colores, tipografía
  shared/                      # componentes reutilizables
    components/
      loading/                 # overlay de carga global
      notification/            # toasts de notificaciones
```

## Crear un nuevo feature (subdominio)

Ejemplo: crear subdominio `profile` con una pantalla `ProfileComponent`.

1) Crear el componente standalone

```bash
ng g component app/features/profile --standalone --flat
```

Esto generará:

```
src/app/features/profile/
  profile.component.ts
  profile.component.html
  profile.component.scss
```

2) Añadir la ruta en `app.routes.ts`

```ts
// dentro de children del LayoutComponent autenticado
{
  path: 'profile',
  loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
}
```

3) Proteger la ruta (opcional)

- Requiere autenticación:

```ts
// la ruta ya está dentro del layout con canMatch: [authMatchGuard]
```

- Requiere rol específico (ej. Admin):

```ts
{
  path: 'admin',
  canMatch: [authMatchGuard, roleGuard],
  data: { roles: ['Admin'] },
  loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
}
```

## Uso de componentes ya creados

- `LayoutComponent`
  - Es el shell de las rutas autenticadas. No necesitas importar `HeaderComponent` en cada página; el layout lo renderiza de forma global.

- `HeaderComponent`
  - Muestra navegación y acciones de sesión. Para cerrar sesión, usa `AuthService.logout()`.

- `LoadingComponent`
  - Ya está conectado al `UtilsService` y al `loading.interceptor.ts`. No necesitas manejar loading manual en cada servicio.

- `NotificationComponent` + `NotificationService`
  - Muestra toasts globales. Puedes disparar notificaciones desde cualquier lugar inyectando el servicio:
  
  ```ts
  constructor(private notification: NotificationService) {}
  onSave() {
    this.notification.success('Guardado correctamente');
  }
  ```

- `FormErrorService`
  - Centraliza mensajes de error para formularios reactivos:
  
  ```ts
  this.formError.getErrorMessage(this.form.get('email'), 'Email');
  ```

## Autenticación y rutas

- `AuthService`
  - Signals: `user`, `token`, `isAuthenticatedSignal`.
  - Métodos: `login`, `logout`, `hasRole`.

- Guards
  - `authMatchGuard`: evita cargar children si no hay sesión.
  - `roleGuard`: valida roles vía `Route.data.roles` y redirige si falta permiso.

- Interceptores
  - `auth.interceptor.ts`: agrega `Authorization: Bearer <token>` si existe.
  - `base-url.interceptor.ts`: agrega la base del API a rutas relativas.
  - `loading.interceptor.ts`: contador de peticiones y muestra `LoadingComponent`.
  - `error.interceptor.ts`: maneja 401/403/500/0 y muestra notificaciones.

## Configuración y personalización

- **Tokens del proyecto**: `__PROJECT_NAME__`, `__PROJECT_SLUG__`, `__PROJECT_FOLDER__`.
  - Puedes usar `customize.sh` (si está presente) para reemplazarlos automáticamente.

- **Environments**: define `apiUrl` y flags en `src/environments/`.

- **Temas y estilos**:
  - `styles.scss` incluye theming Material (M2), tokens de colores y tipografía.
  - Ajusta variables en `core/constants/colors.scss` y `typography.scss`.

## Buenas prácticas recomendadas

- Usar `signals` para estado UI local y global.
- Preferir `canMatch` sobre `canActivate` en rutas protegidas.
- Añadir `@defer` para vistas pesadas con placeholder de loading.
- Centralizar errores y notificaciones en los interceptores.
- Mantener features en `app/components/<feature>` con lazy por componente.

## Cómo reutilizar este baseline

- **Cambiar el nombre del proyecto**
  - Tokens: busca y reemplaza `__PROJECT_NAME__`, `__PROJECT_SLUG__`, `__PROJECT_FOLDER__`.
  - Usa el script `customize.sh` si está incluido para automatizar la tokenización.

- **Configurar environments**
  - Edita `src/environments/environment.ts`, `environment.qa.ts`, `environment.prod.ts`.
  - Define `apiUrl`, flags de producción, y otras constantes necesarias.

- **Añadir nuevas rutas/features**
  - Crea componentes standalone bajo `src/app/components/<feature>/`.
  - Añade la ruta con `loadComponent` en `app.routes.ts`.
  - Si requiere autenticación: ponla dentro del `LayoutComponent` y usa `canMatch: [authMatchGuard]`.
  - Si requiere roles: añade `roleGuard` y `data: { roles: ['Admin'] }`.
  - Para vistas pesadas: considera `@defer` y loading con `placeholder`.

## Pendientes / Extensiones futuras

- **Tests unitarios**
  - Cobertura básica para servicios críticos (`AuthService`, interceptores, guards).
  - Pruebas de componentes con `TestBed` y harnesses.

- **CI/CD**
  - Pipeline: build, test, lint, audit de dependencias, budget de bundle.
  - Despliegue a hosting estático o contenedores.

- **i18n**
  - Internacionalización con `@angular/localize` y mensajes traducibles.

- **Integraciones extra**
  - Observabilidad: Sentry / OpenTelemetry.
  - Linting: ESLint con reglas de Angular y RxJS.
  - Zoneless: evaluar `provideExperimentalZonelessChangeDetection` y efectos/signals.
  - Material M3: migración de theming cuando sea pertinente.
  - ApiService avanzado: errores tipados, cancelación, retry/backoff, cache TTL.

## Referencias y documentación

- `BASELINE-REPORT.md`: documento de arquitectura y recomendaciones.
- Angular Docs: https://angular.dev
- Angular Material: https://material.angular.io

