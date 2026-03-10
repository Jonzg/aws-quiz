#!/usr/bin/env bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AWS AI Practitioner Quiz — Iniciando..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
VENV_DIR="$SCRIPT_DIR/venv"

# ── Activate venv ──────────────────────────────────────────────────────────────
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OS" == "Windows_NT" ]]; then
  ACTIVATE="$VENV_DIR/Scripts/activate"
else
  ACTIVATE="$VENV_DIR/bin/activate"
fi

if [ ! -f "$ACTIVATE" ]; then
  echo "  ✗ Entorno virtual no encontrado. Ejecuta primero: bash setup.sh"
  exit 1
fi

source "$ACTIVATE"

# ── Backend ────────────────────────────────────────────────────────────────────
echo ""
echo "▶ Iniciando backend (puerto 8000)..."
cd "$BACKEND_DIR"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "  ✓ Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "  Esperando que el backend arranque..."
for i in {1..15}; do
  if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "  ✓ Backend listo"
    break
  fi
  sleep 1
done

cd "$SCRIPT_DIR"

# ── Frontend ───────────────────────────────────────────────────────────────────
echo ""
echo "▶ Iniciando frontend (puerto 3000)..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!
echo "  ✓ Frontend PID: $FRONTEND_PID"

# Wait a moment then open browser
sleep 3
echo ""
echo "▶ Abriendo navegador..."
if command -v xdg-open &>/dev/null; then
  xdg-open http://localhost:3000
elif command -v open &>/dev/null; then
  open http://localhost:3000
elif command -v start &>/dev/null; then
  start http://localhost:3000
else
  # Windows Git Bash
  cmd.exe /c start http://localhost:3000 2>/dev/null || true
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 App corriendo:"
echo "     Frontend: http://localhost:3000"
echo "     Backend:  http://localhost:8000"
echo "     API Docs: http://localhost:8000/docs"
echo ""
echo "  Presiona Ctrl+C para detener ambos servicios"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Cleanup on exit ────────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "Deteniendo servicios..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  # Kill any lingering uvicorn/vite processes on those ports
  lsof -ti:8000 | xargs kill -9 2>/dev/null || true
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  echo "✓ Servicios detenidos."
}
trap cleanup EXIT INT TERM

wait
