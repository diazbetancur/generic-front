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

