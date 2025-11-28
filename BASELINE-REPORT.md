============================================================
🏗️ RESUMEN DEL PROYECTO (alto nivel)
============================================================
Versión detectada de Angular: 20.3.14 (CLI 20.3.12, Material/CDK 20.2.14, TypeScript 5.9.3, zone.js 0.15.1)

Tecnologías utilizadas:
- Angular standalone (sin NgModules de aplicación)
- Angular Router con `loadComponent` (lazy loading por componente)
- Angular Material (temado M2 compatibility API, no M3 todavía)
- RxJS básico (BehaviorSubject, firstValueFrom, operadores simples filter/finalize, sin alta complejidad)
- Sass moderno con `@use` y theming centralizado de colores/typografía
- Bootstrap 5 (solo CSS y JS bundle incluido en angular.json)
- Script de tokenización (`customize.sh`) y sistema de tokens (`__PROJECT_NAME__`, `__PROJECT_SLUG__`, `__PROJECT_FOLDER__`)

Arquitectura general: 100% standalone (componentes, guards, interceptores) organizada por carpetas clásicas (`core`, `components`, `services`, `shared`, `interfaces`). No existe mezcla con módulos legacy.

Patrón de organización observado:
- `core/`: infraestructura transversal (interceptors, guards, constants, servicios base como logger, storage, api)
- `components/`: features actuales (login, home, header) sin separación por dominio todavía
- `services/`: servicios funcionales de capa de aplicación (auth, utils)
- `shared/`: componentes reutilizables (solo `loading` actualmente)
- `interfaces/`: modelos de datos (user + DTOs)

Nivel general de calidad (1–10): 7.2
- Fortalezas: uso consistente de standalone, separación clara de interceptores, guard simple, theming SCSS estructurado, tokenización integral.
- Áreas de mejora: ausencia de pruebas, falta de desacoplo (ApiService mezcla Promises y Observables indirectamente), sin estrategia de error UX, Material aún en M2, sin Signals ni zoneless, Bootstrap + Material potencial solapamiento de estilos.

============================================================
📁 ESTRUCTURA DETECTADA (árbol lógico del proyecto)
============================================================
Raíz relevante (simplificado):
```
src/
  main.ts
  index.html
  styles.scss
  app/
    app.component.{ts,html,scss}
    app.config.ts
    app.routes.ts
    components/
      header/
      home/
      login/
    core/
      constants/
        colors.scss
        typography.scss
      guards/
        auth.guard.ts
      interceptors/
        auth.interceptor.ts
        base-url.interceptor.ts
        error.interceptor.ts
        loading.interceptor.ts
      services/
        api.service.ts
        api.service.example.ts
        logger.service.ts
        storage.service.ts
    interfaces/
      user.interface.ts
    services/
      auth.service.ts
      utils.service.ts
    shared/
      components/
        loading/
  environments/
    environment{.qa,.prod}.ts
TOKENS.md
TECHNICAL-STATE.md
customize.sh
```

Patrón de proyecto: mezcla inicial orientada a capas (core/shared/services) más que por dominios. Implementa lazy loading por componente pero aún no hay “vertical slices”.

Lo que falta según Angular 20 (mejor práctica actual):
- Signals en lugar de BehaviorSubject para estado simple (Auth, Loading).
- Defer Views (`@defer`) en componentes pesados (no presentes aún pero recomendación futura).
- Suspense / fallback UI reusable (loading centralizado ya existe pero falta integración declarativa con `@defer`).
- Migración temática a Material M3 (`mat.m3-*`) para tokens de color, dynamic elevation y shape.
- Estrategia de i18n (no existe configuración ni marcas de internacionalización).
- Linting y configuración de calidad (no se ve ESLint config en raíz). 
- Testing: escaso (solo un spec). Falta cobertura mínima para servicios críticos (auth, interceptores). 
- Estrategia de zoneless (`provideExperimentalZonelessChangeDetection`) si se quiere reducir overhead.

Lo que sobra o está duplicado:
- Repetición de tipografía básica en `styles.scss` (duplicada sección body/html dos veces).
- `api.service.example.ts` dentro de `core/services` pero su import path sugiere que debería estar fuera (sirve como documentación; podría moverse a `docs/examples/`).
- Variables SCSS repetidas (p.ej. redefinición de `brand-blue` y `brand-light-blue` en colores complementarios que pueden causar confusión).

============================================================
🧩 SERVICIOS, GUARDS, INTERCEPTORES, HELPERS
============================================================
Formato: Nombre | Rol | Observaciones / Problemas | HttpClient correcto | Migrar a Signals | Standalone provider (ya / recomendado)

1. `core/services/api.service.ts`
- Rol: Abstracción HTTP CRUD con Promises, logging y opciones simplificadas.
- Problemas: Mezcla Promises sobre Observables limita cancelación y composición; carece de tipado fuerte para error; sin retry/backoff; no hay manejo de cache ni ETag.
- HttpClient: Sí, crea opciones correctamente (headers, params). Falta uso de `observe` para metadata.
- Signals: No aplica directamente (stateless) excepto si agrega cache reactiva.
- Provider: Root (ok).

2. `core/services/logger.service.ts`
- Rol: Logging con niveles según ambiente.
- Problemas: Sin integración externa (TODO pendiente), no serializa errores estructuralmente, falta rate limit en producción.
- HttpClient: N/A.
- Signals: No necesario.
- Provider: Root (ok).

3. `core/services/storage.service.ts`
- Rol: Abstracción localStorage con prefix tokenizado.
- Problemas: JSON parse silencioso sin logger; `clear()` elimina todo sin confirmación; sin manejo de expiración o versionado.
- HttpClient: N/A.
- Signals: Podría exponer un signal para cambios reactivos en claves críticas (token/user) evitando BehaviorSubject en Auth.
- Provider: Root (ok).

4. `services/auth.service.ts`
- Rol: Autenticación (login/logout, usuario actual, roles).
- Problemas: Convierte Promises a Observables manualmente (anti-pattern); falta refresh token flow; no invalida sesión ante 401 central (error interceptor redirige pero no limpia storage); estado mantenido por BehaviorSubject y storage (duplicada fuente).
- HttpClient: Vía ApiService (indirecto) correcto pero sin tipado de errores.
- Signals: Sí, recomendable: `currentUser` y `isAuthenticated` como `computed()` y `signal`.
- Provider: Root (ok).

5. `services/utils.service.ts`
- Rol: Loading global con BehaviorSubject.
- Problemas: Solo booleano; podría colisionar en peticiones concurrentes si un interceptor externo oculta antes de terminar otra petición (aunque manejado por contador en interceptor, sigue siendo extra).
- HttpClient: N/A.
- Signals: Sí, reemplazar BehaviorSubject por `signal<boolean>` y exponer `readonly` getter.
- Provider: Root (ok).

6. `core/guards/auth.guard.ts`
- Rol: Protege rutas y redirige a login.
- Problemas: Hace navegación directa dentro del guard (puede provocar doble render si se extiende); no limpia estado inválido; sin diferenciación de roles.
- HttpClient: N/A.
- Signals: Si Auth usa signals, guard se simplifica con `inject(AuthService).isAuthenticatedSignal()`.
- Provider: Función guard (ok).

7. `core/interceptors/base-url.interceptor.ts`
- Rol: Prepend base URL a rutas relativas.
- Problemas: No maneja doble slash robustamente (solo trailing base); no contempla WebSocket ni otros esquemas.
- HttpClient: Sí.
- Signals: No aplica.
- Provider: Config vía `withInterceptors` (ok).

8. `core/interceptors/auth.interceptor.ts`
- Rol: Adjunta header Authorization Bearer si token existe.
- Problemas: No maneja expiración; no intenta refresh; no evita enviar token a dominios externos si hubiesen futuros endpoints absolutos de terceros.
- HttpClient: Sí.
- Signals: Puede leer token signal para baja latencia.
- Provider: Ok.

9. `core/interceptors/loading.interceptor.ts`
- Rol: Maneja contador de peticiones activas y muestra/oculta loading.
- Problemas: Array/Lista de exclusiones manual; no filtra métodos (ej. GET vs silent POST); coupling con UtilsService.
- HttpClient: Sí.
- Signals: Si UtilsService migra a signal reduce overhead RxJS.
- Provider: Ok.

10. `core/interceptors/error.interceptor.ts`
- Rol: Manejo centralizado de errores HTTP (401/403/500/network) con redirecciones.
- Problemas: No limpia sesión en 401; no expone notificaciones UX (TODO); mezcla responsabilidad navegación + logging.
- HttpClient: Sí.
- Signals: Podría disparar un signal de estado global de error.
- Provider: Ok.

11. `core/services/api.service.example.ts` (UserService ejemplo)
- Rol: Documentación de uso de ApiService.
- Problemas: Ubicación dentro de `core/services` genera ruido; usar async/await repetido sin manejo de errores semánticos.
- HttpClient: Indirecto correcto.
- Signals: No aplica.
- Provider: Root (innecesario en producción; mover a docs).

============================================================
🌐 API SERVICE (si existe)
============================================================
Calidad: Media (sólido para CRUD básico, sin extensiones avanzadas).

Headers: Permite inyectar headers personalizados por llamada; Authorization se delega a interceptor (buena separación).

Base URL: Correctamente manejada por `baseUrlInterceptor` para rutas relativas; riesgo potencial si se agregan rutas absolutas externas (debería whitelist dominios para token).

Manejo de errores: Solo try/catch local + logger; re-lanza error sin normalizar estructura (no hay tipo `ApiError`). Confía en `error.interceptor.ts` para UX (incompleto).

Cache: Inexistente. Recomendación: capa de cache in-memory con TTL opcional + ETag/If-None-Match si API lo soporta.

Loader: Delegado al interceptor (correcto). Evita contaminación de lógica en servicios.

Políticas recomendadas:
- Normalizar respuesta y error (`ApiResult<T>` con `data`, `errorCode`, `message`).
- Añadir timeout configurable (AbortController ó RxJS `timeout` si se migra a Observables).
- Soportar cancelación (actualmente imposible con Promises).
- Agregar instrumentación (duración, status) para métricas.

Checklist de mejoras:
1. Cambiar implementación interna a Observables y retornar Observables (permitir composición) – mantener helper `toPromise()` si se requiere.
2. Crear `ApiError` con shape estándar.
3. Añadir soporte de timeout/cancel.
4. Integrar política de reintento (exponencial para 5xx; sin reintento para 4xx).
5. Capa de cache para GET idempotentes (Map + invalidación manual).
6. Sanitización de params (evitar `undefined` en query).
7. Integrar tracing (header `X-Request-Id`).
8. Validar tipos de body antes de enviar (opcional zod/io-ts).

============================================================
⚙️ CONFIGURACIÓN DE ARRANQUE (main.ts / app.config.ts / app.routes.ts)
============================================================
Standalone: Sí, `bootstrapApplication(AppComponent, appConfig)` sin AppModule.

Providers detectados:
- `provideZoneChangeDetection({ eventCoalescing: true })` (optimización parcial).
- `provideRouter(routes, withComponentInputBinding())` (lazy load por componente).
- `provideHttpClient(withInterceptors([...]))` (lista interceptores orden: baseUrl, auth, loading, error – orden razonable).
- `provideAnimationsAsync()` (carga diferida de animaciones – buena práctica).

Interceptores registrados: 4 (baseUrl, auth, loading, error) en orden adecuado (primero URL, luego auth, efectos visuales, finalmente errores).

Lazy loading: Cada ruta principal usa `loadComponent` (login, home). Correcto. Ruta wildcard redirige a `/home` (conviene redirigir a `/login` si no autenticado para coherencia).

Rutas duplicadas/inútiles: Redirección raíz `'' -> /login` y wildcard `** -> /home` puede provocar acceso forzado a home no autorizado (el guard gestiona). Mejor `** -> /login` para experiencia consistente.

Pendientes:
- Añadir `@defer` en vistas pesadas futuras.
- Considerar agrupación de rutas por dominio si crece.
- Añadir canMatch en lugar de canActivate para evitar carga de componente si falla auth.

============================================================
🎨 COMPONENTES (estructura por features)
============================================================
Features actuales:
1. LoginComponent
2. HomeComponent
3. HeaderComponent
4. LoadingComponent (shared)

LoginComponent:
- Estado local manejado por FormGroup y variables simples (`loading`, `errorMessage`).
- Mejora: usar `signal` para `loading` y `errorMessage`, reemplazando sus mutaciones; validar patrón de error por tipo HTTP.
- CSS: Separado; correcto. Podría usar clases utilitarias para botones definidos globalmente.

HomeComponent:
- Componente mínimo (solo `appName`). Sin lógica. OK.
- Reutilización: Podría excluir `HeaderComponent` y dejar el header solo en root para no repetir imports.

HeaderComponent:
- Estado de menú (`isMenuOpen`) – candidato a `signal<boolean>`.
- Usa AuthService para visibilidad. Podría configurar proyección de login/logout y separar en `NavbarUserAreaComponent` si escala.

LoadingComponent:
- Observa `loading$` de UtilsService – migrar a `computed` derivado de signal.
- Podría ofrecer slot para mensajes o skeleton.

General refactors:
- Centralizar layout (header + outlet) en root y evitar re-importar header en `HomeComponent`.
- Añadir un `LayoutComponent` si se suman más páginas.
- Unificar estilos de botones (ya existen clases globales; usar `class="btn-primary"`).

============================================================
📦 SHARED Y CORE
============================================================
Separación:
- `core`: correcto para cross-cutting (interceptors, guards, constants, infra services).
- `shared`: mínimo (solo loading). Escalable para futuros UI reutilizables.

Problemas típicos NO presentes aún: no hay imports circulares; `shared` no está sobrecargado.

Riesgos futuros:
- Meter servicios de dominio en `core` (evitarlo, deben vivir en features/domains).
- Crecimiento de `shared` sin subcarpetas (introducir `shared/components`, `shared/directives`, `shared/pipes`).
- Duplicación de constantes (centralizar tokens SCSS).

Sugerencias:
1. Crear carpeta `shared/ui` para componentes visuales genéricos (cards, modals, buttons si se abstraen).
2. Mover `api.service.example.ts` fuera de core hacia `docs/examples`.
3. Introducir `domain/` para futuras áreas (usuarios, dashboard, reports) con estructura vertical: cada dominio con su `routes`, `components`, `services`.

============================================================
🧪 DETECCIÓN DE DEUDA TÉCNICA
============================================================
Código muerto:
- `api.service.example.ts` no utilizado en runtime.
- Duplicaciones en estilos (`html, body` repetidos; botones estilos parcialmente redundantes con mixins).

Servicios sin usar: Ejemplo `UserService` (documentación) – marcar explícito.

Componentes duplicados: No.

Rutas nunca usadas: Wildcard a `/home` puede usarse sin auth – delegada al guard; ajustar.

Imports innecesarios: Algunos `CommonModule` en componentes que solo usan directivas básicas (aceptable). `HeaderComponent` importado en `HomeComponent` y también en root (duplicado de layout).

Arquitectura híbrida inconsistente: No, completamente standalone.

TODOs pendientes (detectados):
- Error interceptor: notificaciones en 500 y network error.
- Logger: integración externa (Sentry/LogRocket).

Faltan tests: Cobertura mínima inexistente en servicios críticos (Auth, interceptores).

============================================================
🚀 RECOMENDACIONES PARA ACTUALIZAR A ANGULAR 20 (OPTIMIZAR)
============================================================
1. Signals: Migrar `AuthService` (usuario actual), `UtilsService` (loading), `HeaderComponent` (toggle). 
2. Zoneless: Evaluar `provideExperimentalZonelessChangeDetection()` + reemplazar listeners críticos con manual `effect` + forms reactivos sin dependencia de zone (revisar necesidad de third-party libs compatibles).
3. Defer Views: Aplicar `@defer` para cargar `HomeComponent` y módulos pesados futuros (gráficos, tablas grandes) mostrando `LoadingComponent` como `@placeholder`.
4. Material M3: Migrar a API moderna (`mat.define-theme` si disponible en versión posterior) para soporte dinámico (color-schemes, density adaptativo).
5. Error UX: Crear `NotificationService` + componente toast; integrar en `error.interceptor.ts` (remover TODOs).
6. ApiService evolución: Cambiar a Observables, añadir cancelación y cache, normalizar errores.
7. Seguridad: Limpiar sesión en 401 central y refrescar token (introducir `refreshToken()` flujo y silent renew).
8. Rutas: Cambiar wildcard a `/login`; usar `canMatch` en lugar de `canActivate` para evitar carga innecesaria.
9. Testing: Añadir pruebas unitarias (AuthService, interceptores), e2e básico de flujo login → home.
10. Linting: Integrar ESLint config + rules de accesibilidad y rxjs/no-ignored-subscription.
11. CI: Pipeline con build + test + lint + audit (npm audit). 
12. Theming SCSS: Eliminar duplicaciones y consolidar tokens en un solo archivo design-tokens.scss.

============================================================
📋 CHECKLIST PARA DEJAR EL PROYECTO COMO UN BASELINE PERFECTO
============================================================
Configuración:
[] Añadir ESLint + reglas recomendadas Angular + RxJS.
[] Ajustar rutas: wildcard → `/login`, usar `canMatch`.
[] Evaluar zoneless y medir impacto (activar en rama).
[] Integrar `@defer` en componentes futuros pesados.

Servicios base:
[] Migrar `UtilsService` a signal (`loadingSignal`).
[] Migrar `AuthService` a signals (`userSignal`, `isAuthenticatedSignal`).
[] Añadir `NotificationService` (toast/snackbar wrapper + queue). 
[] Refactor `ApiService` a Observables + timeout + retry + cache.

Guards:
[] Convertir guard a `canMatch` para auth.
[] Añadir guard de roles (ej. `roleGuard`) si se amplía autorización.

Interceptores:
[] Añadir `retryInterceptor` (exponencial para 5xx).
[] Añadir `requestIdInterceptor` (X-Request-Id). 
[] Mejorar `auth.interceptor` para evitar token en dominios externos (whitelist base URL). 
[] `error.interceptor` → limpiar sesión en 401 + notificación.

Layout base:
[] Extraer `LayoutComponent` (header + `<router-outlet>`). 
[] Evitar importar `HeaderComponent` en cada feature.

Sistema de temas:
[] Migrar a Material M3 (cuando se habilite).
[] Consolidar design tokens SCSS (colors, typography, spacing). 
[] Añadir modo oscuro (css vars + toggler). 
[] Centralizar estilos de botones (reusar clases en templates).

Routing estándar:
[] Adoptar vertical slice: `features/auth`, `features/dashboard`, etc.
[] Definir archivo `app.routes.ts` con agrupación por lazy feature.
[] Añadir prefetch selectivo (cuando crezcan features).

Patterns recomendados:
[] Signals para estado UI local y global.
[] Efectos (`effect`) para sincronizar storage y auth signal.
[] Reemplazar Promises manuales por Observables nativos.
[] Monorepo-ready (preparar estructura para añadir libs internas).
[] Documentar convenciones (naming, architecture decision record).

Calidad y Observabilidad:
[] Integrar Sentry / OpenTelemetry para trazas.
[] Añadir pruebas unitarias clave (AuthService, interceptores, guard).
[] Añadir pruebas de accessibility (axe).
[] Pipeline CI con build, test, lint, audit, bundle size budget.

Seguridad:
[] Sanitizar inputs (formularios) y validar tipos.
[] Implementar refresh token seguro (rotación). 
[] Evitar exponer detalles internos en errores (normalizar ApiError).

Documentación:
[] Completar TECHNICAL-STATE.md con matriz de decisiones.
[] Mover ejemplos a carpeta `docs/`.
[] Actualizar TOKENS.md si se agregan nuevos tokens (ej. __API_BASE_URL__).

Estado actual tras análisis: Base sólida para evolución rápida; la adopción de Signals + vertical slices y mejoras de API elevarían la calidad a >8.5.

---
Generated: 28 Nov 2025
Authoring context: Baseline analysis by senior Angular architect persona.
---
