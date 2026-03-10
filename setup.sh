#!/usr/bin/env bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AWS AI Practitioner Quiz — Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Resolve script directory ───────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# ── Python / venv ──────────────────────────────────────────────────────────────
echo ""
echo "▶ Verificando Python..."
if ! command -v python3 &>/dev/null && ! command -v python &>/dev/null; then
  echo "  ✗ Python no encontrado. Instala Python 3.11+ y vuelve a intentarlo."
  exit 1
fi

PYTHON=$(command -v python3 || command -v python)
echo "  ✓ Python: $($PYTHON --version)"

VENV_DIR="$SCRIPT_DIR/venv"
if [ ! -d "$VENV_DIR" ]; then
  echo ""
  echo "▶ Creando entorno virtual..."
  $PYTHON -m venv "$VENV_DIR"
  echo "  ✓ venv creado en $VENV_DIR"
fi

# Activate
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OS" == "Windows_NT" ]]; then
  ACTIVATE="$VENV_DIR/Scripts/activate"
else
  ACTIVATE="$VENV_DIR/bin/activate"
fi
source "$ACTIVATE"

echo ""
echo "▶ Instalando dependencias Python..."
pip install --quiet --upgrade pip
pip install --quiet -r "$BACKEND_DIR/requirements.txt"
echo "  ✓ Dependencias Python instaladas"

# ── Init DB ────────────────────────────────────────────────────────────────────
echo ""
echo "▶ Inicializando base de datos SQLite..."
cd "$BACKEND_DIR"
python -c "
import asyncio
import sys
sys.path.insert(0, '.')
from database import init_db
asyncio.run(init_db())
print('  ✓ Base de datos inicializada')
"
cd "$SCRIPT_DIR"

# ── Node / npm ─────────────────────────────────────────────────────────────────
echo ""
echo "▶ Verificando Node.js..."
if ! command -v node &>/dev/null; then
  echo "  ✗ Node.js no encontrado."
  echo "  Descarga e instala Node.js desde https://nodejs.org (LTS) y vuelve a ejecutar setup.sh"
  exit 1
fi
echo "  ✓ Node.js: $(node --version)  |  npm: $(npm --version)"

echo ""
echo "▶ Instalando dependencias frontend..."
cd "$FRONTEND_DIR"
npm install --silent
echo "  ✓ Dependencias frontend instaladas"
cd "$SCRIPT_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Setup completado con éxito"
echo ""
echo "  Ejecuta:  bash run.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
