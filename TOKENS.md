# 🏷️ Sistema de Tokens del Proyecto

Este proyecto utiliza un sistema estandarizado de tokens para facilitar la personalización y reutilización como template.

## 📋 Tokens Disponibles

| Token | Significado | Ejemplo | Uso |
|-------|-------------|---------|-----|
| `__PROJECT_NAME__` | Nombre visible del proyecto | "Mi Aplicación Genial" | UI, títulos, mensajes al usuario |
| `__PROJECT_SLUG__` | Nombre técnico (kebab-case) | "mi-aplicacion-genial" | package.json, carpetas de dist, nombres técnicos |
| `__PROJECT_FOLDER__` | Carpeta raíz del proyecto | "/path/to/mi-aplicacion-genial" | Rutas absolutas, configuraciones |

## 🔍 Ubicaciones de los Tokens

### `__PROJECT_NAME__` (Nombre Visible)
- `src/app/app.component.ts` → `title`
- `src/app/components/login/login.component.ts` → `appName`
- `src/app/components/home/home.component.ts` → `appName`
- `src/app/components/header/header.component.ts` → `appName`
- `src/environments/environment.ts` → `appName`
- `src/environments/environment.qa.ts` → `appName`
- `src/environments/environment.prod.ts` → `appName`
- `package.json` → `description`

### `__PROJECT_SLUG__` (Nombre Técnico)
- `package.json` → `name`
- `angular.json` → `projects` key
- `angular.json` → `outputPath`
- `angular.json` → `buildTarget` (3 ocurrencias)
- `src/app/core/services/storage.service.ts` → `PREFIX`
- `src/environments/environment.qa.ts` → URL de QA
- `src/environments/environment.prod.ts` → URL de producción

### `__PROJECT_FOLDER__` (Carpeta Raíz)
- Actualmente no se usa, pero está reservado para configuraciones que requieran la ruta absoluta del proyecto

## 🚀 Cómo Personalizar el Proyecto

### Método 1: Búsqueda y Reemplazo Manual

1. **Buscar todos los tokens:**
   ```bash
   # En VS Code, usa Cmd/Ctrl + Shift + F
   # Busca: __PROJECT_NAME__
   # Busca: __PROJECT_SLUG__
   # Busca: __PROJECT_FOLDER__
   ```

2. **Reemplazar con tus valores:**
   - `__PROJECT_NAME__` → "Mi Aplicación"
   - `__PROJECT_SLUG__` → "mi-aplicacion"
   - `__PROJECT_FOLDER__` → "/Users/mi-usuario/proyectos/mi-aplicacion"

### Método 2: Script Automatizado (Recomendado)

Puedes crear un script para reemplazar todos los tokens automáticamente:

```bash
#!/bin/bash

# Configuración
PROJECT_NAME="Mi Aplicación Genial"
PROJECT_SLUG="mi-aplicacion-genial"
PROJECT_FOLDER="/Users/mi-usuario/proyectos/mi-aplicacion-genial"

# Reemplazar en todos los archivos
find . -type f \( -name "*.ts" -o -name "*.json" -o -name "*.html" -o -name "*.md" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -not -path "*/.angular/*" \
  -exec sed -i '' "s|__PROJECT_NAME__|$PROJECT_NAME|g" {} + \
  -exec sed -i '' "s|__PROJECT_SLUG__|$PROJECT_SLUG|g" {} + \
  -exec sed -i '' "s|__PROJECT_FOLDER__|$PROJECT_FOLDER|g" {} +

echo "✅ Tokens reemplazados exitosamente"
```

## ✅ Validación

Después de reemplazar los tokens, verifica que no queden pendientes:

```bash
# Buscar tokens restantes
grep -r "__PROJECT_NAME__" --exclude-dir={node_modules,dist,.angular} .
grep -r "__PROJECT_SLUG__" --exclude-dir={node_modules,dist,.angular} .
grep -r "__PROJECT_FOLDER__" --exclude-dir={node_modules,dist,.angular} .
```

Si no hay resultados, ¡todos los tokens fueron reemplazados correctamente! 🎉

## 📝 Notas Importantes

1. **package.json name**: Debe seguir el formato npm (solo minúsculas, guiones, sin espacios)
2. **angular.json**: Asegúrate de que los `buildTarget` coincidan con el nombre del proyecto
3. **localStorage PREFIX**: Se agregará automáticamente un guion bajo al final (`__PROJECT_SLUG___`)
4. **URLs de API**: Personaliza las URLs en los archivos `environment.*.ts` según tu infraestructura

## 🔄 Después de Personalizar

1. Ejecuta `npm install` para asegurar consistencia
2. Ejecuta `npm run build` para verificar que todo compila correctamente
3. Elimina o personaliza este archivo `TOKENS.md`
4. Actualiza el `README.md` con la información específica de tu proyecto

---

**Fecha de creación:** 27 de noviembre, 2025  
**Versión de Angular:** 19.2.16
