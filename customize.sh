#!/bin/bash

# Script de personalización del template Angular
# Reemplaza todos los tokens del proyecto con tus valores personalizados

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 Personalizador de Template Angular   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Función para validar el nombre técnico (slug)
validate_slug() {
    local slug=$1
    if [[ ! $slug =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
        echo -e "${RED}❌ Error: El nombre técnico solo puede contener letras minúsculas, números y guiones${NC}"
        return 1
    fi
    return 0
}

# Solicitar información al usuario
echo -e "${YELLOW}📝 Ingresa la información de tu proyecto:${NC}"
echo ""

# PROJECT_NAME
read -p "Nombre visible del proyecto (ej: Mi Aplicación Genial): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ El nombre visible no puede estar vacío${NC}"
    exit 1
fi

# PROJECT_SLUG
read -p "Nombre técnico (slug, ej: mi-aplicacion-genial): " PROJECT_SLUG
if [ -z "$PROJECT_SLUG" ]; then
    echo -e "${RED}❌ El nombre técnico no puede estar vacío${NC}"
    exit 1
fi

# Validar el slug
if ! validate_slug "$PROJECT_SLUG"; then
    exit 1
fi

# PROJECT_FOLDER (usar el directorio actual por defecto)
DEFAULT_FOLDER=$(pwd)
read -p "Carpeta raíz del proyecto [${DEFAULT_FOLDER}]: " PROJECT_FOLDER
PROJECT_FOLDER=${PROJECT_FOLDER:-$DEFAULT_FOLDER}

# Confirmar información
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 Resumen de la personalización:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "  Nombre visible:  ${GREEN}${PROJECT_NAME}${NC}"
echo -e "  Nombre técnico:  ${GREEN}${PROJECT_SLUG}${NC}"
echo -e "  Carpeta raíz:    ${GREEN}${PROJECT_FOLDER}${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

read -p "¿Deseas continuar? (s/n): " CONFIRM
if [[ ! $CONFIRM =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}❌ Operación cancelada${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔄 Reemplazando tokens...${NC}"

# Función para reemplazar en archivos
replace_in_files() {
    local pattern=$1
    local replacement=$2
    local description=$3

    echo -e "${YELLOW}   → Reemplazando ${description}...${NC}"

    # Reemplazar en archivos TypeScript, JSON, HTML, SCSS, MD
    find . -type f \( \
        -name "*.ts" -o \
        -name "*.json" -o \
        -name "*.html" -o \
        -name "*.scss" -o \
        -name "*.md" \
    \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.angular/*" \
    -not -path "*/.git/*" \
    -not -path "*/customize.sh" \
    -exec sed -i '' "s|${pattern}|${replacement}|g" {} +
}

# Reemplazar tokens
replace_in_files "__PROJECT_NAME__" "$PROJECT_NAME" "nombre visible"
replace_in_files "__PROJECT_SLUG__" "$PROJECT_SLUG" "nombre técnico"
replace_in_files "__PROJECT_FOLDER__" "$PROJECT_FOLDER" "carpeta raíz"

echo ""
echo -e "${BLUE}🔍 Verificando tokens restantes...${NC}"

# Verificar si quedan tokens
REMAINING=$(grep -r "__PROJECT_" --exclude-dir={node_modules,dist,.angular,.git} --exclude="customize.sh" . 2>/dev/null | wc -l | tr -d ' ')

if [ "$REMAINING" -eq "0" ]; then
    echo -e "${GREEN}✅ Todos los tokens fueron reemplazados correctamente${NC}"
else
    echo -e "${YELLOW}⚠️  Advertencia: Se encontraron ${REMAINING} tokens sin reemplazar${NC}"
    echo -e "${YELLOW}   Ejecuta: grep -r '__PROJECT_' --exclude-dir={node_modules,dist,.angular,.git} .${NC}"
fi

echo ""
echo -e "${BLUE}🧹 Limpieza...${NC}"
echo -e "${YELLOW}   → Eliminando archivos de documentación de tokens...${NC}"

# Opcional: eliminar archivos de documentación del template
rm -f TOKENS.md

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ ¡Personalización completa!    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📌 Próximos pasos:${NC}"
echo -e "   1. Ejecuta: ${GREEN}npm install${NC}"
echo -e "   2. Ejecuta: ${GREEN}npm run build${NC} para verificar"
echo -e "   3. Personaliza README.md con información de tu proyecto"
echo -e "   4. ¡Comienza a desarrollar! 🚀"
echo ""
echo -e "${YELLOW}💡 Tip: Puedes eliminar este script (customize.sh) cuando termines${NC}"
echo ""
