#!/usr/bin/env bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AWS AI Practitioner Quiz — Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Resolve script directory ───────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# ── uv ─────────────────────────────────────────────────────────────────────────
echo ""
echo "▶ Verificando uv..."
if ! command -v uv &>/dev/null; then
  echo "  ✗ uv no encontrado. Instálalo con:  curl -LsSf https://astral.sh/uv/install.sh | sh"
  exit 1
fi
echo "  ✓ uv: $(uv --version)"

echo ""
echo "▶ Instalando dependencias Python..."
cd "$SCRIPT_DIR"
uv sync --quiet
echo "  ✓ Dependencias Python instaladas (.venv)"

# ── Init DB ────────────────────────────────────────────────────────────────────
echo ""
echo "▶ Inicializando base de datos SQLite..."
cd "$BACKEND_DIR"
uv run python -c "
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
