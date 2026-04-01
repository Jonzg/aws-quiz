# AWS Quiz App — Multi-Examen AWS

Aplicación web full-stack para preparar certificaciones **AWS**, con banco de preguntas por examen, estadísticas de progreso y despliegue en la nube.

## Exámenes disponibles

- **AWS Certified AI Practitioner** — Fundamentos de IA y ML en AWS
- **AWS Certified Machine Learning Engineer Associate** — Ingeniería de ML en AWS

## Demo en vivo

- **Frontend (Vercel):** https://aws-quiz-nu.vercel.app
- **Backend (Render):** https://aws-quiz-m3v4.onrender.com
- **API Docs:** https://aws-quiz-m3v4.onrender.com/docs

> El backend está en plan gratuito de Render — la primera petición tras 15 min de inactividad puede tardar ~30-60s en despertar.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Recharts |
| Backend | FastAPI (Python 3.11) + SQLite (aiosqlite) |
| Hosting frontend | Vercel |
| Hosting backend | Render.com |
| Repositorio | GitHub |

---

## Estructura del proyecto

```
aws app/
├── backend/
│   ├── main.py               # FastAPI — endpoints REST multi-examen
│   ├── models.py             # Pydantic v2 schemas (incluye Exam)
│   ├── database.py           # SQLite con aiosqlite
│   ├── question_banks/
│   │   ├── ai_practitioner.json          # Banco de preguntas AI Practitioner
│   │   └── ml_engineer_associate.json    # Banco de preguntas ML Engineer
│   ├── requirements.txt
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── api.js            # Axios con VITE_API_URL
│   │   ├── App.jsx           # Router + NavBar
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx # Estadísticas + gráficos
│   │   │   ├── Quiz.jsx      # Configuración + preguntas
│   │   │   └── Results.jsx   # Puntuación + revisión
│   │   └── components/
│   │       ├── ExamSelection.jsx  # Selección de examen (nuevo)
│   │       ├── QuestionCard.jsx
│   │       ├── ProgressBar.jsx
│   │       └── ScoreChart.jsx
│   ├── vercel.json           # SPA rewrite rule
│   ├── vite.config.js        # Proxy /api → localhost:8000
│   └── tailwind.config.js    # Colores AWS (#FF9900, #232F3E)
├── render.yaml               # Config despliegue Render
├── preguntas.py              # Script auxiliar banco de preguntas
├── migrate_questions.py      # Script migración al nuevo formato multi-examen
└── .gitignore
```

---

## API endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/exams` | Lista de exámenes disponibles |
| GET | `/api/topics/{exam_id}` | Temas con conteo de preguntas por examen |
| GET | `/api/quiz/{exam_id}/{topic}/{difficulty}` | Preguntas aleatorias |
| GET | `/api/quiz/{exam_id}/{topic}/{difficulty}/answers` | Respuestas + explicaciones |
| POST | `/api/results` | Guardar resultado de quiz |
| GET | `/api/stats` | Estadísticas globales del usuario |
| GET | `/api/stats/{topic}` | Estadísticas por tema |
| GET | `/api/export/csv` | Exportar histórico a CSV |
| GET | `/api/health` | Health check |
| GET | `/api/docs` | Documentación Swagger interactiva |

---

## Dificultades

- **Básico** — Conceptos fundamentales y definiciones
- **Intermedio** — Aplicaciones, comparativas y casos de uso
- **Avanzado** — Escenarios complejos, arquitecturas y trade-offs

---

## Despliegue

### Variables de entorno necesarias

**Vercel (frontend):**
| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://aws-quiz-m3v4.onrender.com` |

**Render (backend):**
| Variable | Valor |
|----------|-------|
| `ALLOWED_ORIGINS` | URLs de Vercel separadas por coma |

### Comandos de despliegue local

```bash
# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

La app abre en `http://localhost:3000`.

---

## Funcionalidades

- **Selección de examen** — elige entre AI Practitioner y ML Engineer Associate
- **Quiz configurable** — elige tema, dificultad, número de preguntas (5-20) y cronómetro opcional
- **Feedback inmediato** — respuesta correcta/incorrecta con explicación tras cada pregunta
- **Dashboard de progreso** — quizzes completados, % aciertos, racha, gráfico de evolución temporal y por tema
- **Exportar a CSV** — descarga el histórico completo de resultados
- **Revisión de respuestas** — repasa todas las preguntas del quiz con explicaciones al terminar

---

## Notas técnicas

- Los bancos de preguntas están en `backend/question_banks/` — un JSON por examen, formato unificado por pregunta
- Los resultados se guardan en SQLite (`backend/quiz.db`) — persistente en Render con disco efímero (se resetea en cada redespliegue)
- Sin autenticación — diseñado para uso personal
- CORS configurado via variable de entorno `ALLOWED_ORIGINS`
