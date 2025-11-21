# Cardio Front Admin

Proyecto Angular para administración de Cardio.

## Estructura del Proyecto

```
src/
└── app/
    ├── components/          # Componentes de la aplicación
    │   └── home/           # Componente de ejemplo
    ├── core/               # Módulo core (singletons)
    │   ├── constants/      # Constantes de estilos
    │   │   ├── colors.scss
    │   │   └── typography.scss
    │   ├── guards/         # Guards de rutas
    │   │   ├── auth.guard.ts
    │   │   └── role.guard.ts
    │   └── interceptors/   # Interceptors HTTP
    │       ├── auth.interceptor.ts
    │       └── error.interceptor.ts
    ├── interfaces/         # Interfaces TypeScript
    │   └── user.interface.ts
    ├── services/           # Servicios Angular
    │   ├── auth.service.ts
    │   └── user.service.ts
    ├── app.component.ts
    ├── app.module.ts
    └── app-routing.module.ts
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar el servidor de desarrollo:
```bash
npm start
```

3. Abrir en el navegador: `http://localhost:4200`

## Dependencias Principales

- **Angular Material**: Framework de componentes UI
- **@fontsource/material-icons**: Iconos de Material Design
- **@fontsource/roboto**: Fuente Roboto
- **@fontsource/prompt**: Fuente Prompt (fuente principal del manual de marca)

## Características

- **Interfaces**: Definiciones de tipos TypeScript para mantener la consistencia de datos
- **Servicios**: Lógica de negocio y comunicación con APIs
- **Core Module**: 
  - **Constants**: Variables de colores y tipografía del manual de marca (en `core/constants`)
  - **Guards**: Protección de rutas con autenticación y roles (en `core/guards`)
  - **Interceptors**: Interceptores HTTP para autenticación y manejo de errores (en `core/interceptors`)
- **Componentes**: Componentes reutilizables organizados en carpetas
- **Angular Material**: Tema personalizado basado en el manual de marca
- **SCSS**: Estilos con variables y mixins del manual de identidad corporativa

## Desarrollo

Este proyecto fue generado con Angular CLI.

## Build y Deploy de Producción

### 1. Generar el build de producción

```bash
npm run build:prod
```

O directamente:

```bash
ng build --configuration production
```

Esto generará los archivos optimizados en el directorio `dist/cardio-front-admin/`.

### 2. Archivos generados

El build de producción genera:
- **main-[hash].js**: Código principal de la aplicación (~775 KB, ~153 KB comprimido)
- **styles-[hash].css**: Estilos compilados (~384 KB, ~33 KB comprimido)
- **scripts-[hash].js**: Scripts externos (Bootstrap) (~79 KB, ~21 KB comprimido)
- **polyfills-[hash].js**: Polyfills necesarios (~34 KB, ~11 KB comprimido)

### 3. Configuración de producción

La configuración de producción (`environment.prod.ts`) apunta a:
- **API URL**: `https://apiportalpacientetest.lacardio.org:5254/api`

### 4. Deploy

Los archivos generados en `dist/cardio-front-admin/` están listos para ser desplegados en cualquier servidor web estático:

#### Opción A: Servidor web (Apache/Nginx)
Copiar el contenido de `dist/cardio-front-admin/` al directorio del servidor web.

#### Opción B: Azure Static Web Apps / Azure App Service
```bash
# Subir los archivos desde dist/cardio-front-admin/
```

#### Opción C: Servidor Node.js simple para pruebas
```bash
npm install -g http-server
http-server dist/cardio-front-admin -p 8080
```

### 5. Configuración del servidor

Importante: Configure el servidor para redirigir todas las rutas al `index.html` (reescritura de URL) para que funcione el routing de Angular.

**Nginx ejemplo:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess) ejemplo:**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

