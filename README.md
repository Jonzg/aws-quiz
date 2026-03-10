# AWS AI Practitioner Quiz App

Aplicación web full-stack para preparar el examen **AWS Certified AI Practitioner**, con banco de preguntas, estadísticas de progreso y despliegue en la nube.

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
│   ├── main.py               # FastAPI — 8 endpoints REST
│   ├── models.py             # Pydantic v2 schemas
│   ├── database.py           # SQLite con aiosqlite
│   ├── questions_db.json     # 241 preguntas en 13 temas
│   ├── requirements.txt      # fastapi, uvicorn, aiosqlite, pydantic
│   ├── .python-version       # 3.11.0 (pin para Render)
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
│   │       ├── QuestionCard.jsx
│   │       ├── ProgressBar.jsx
│   │       └── ScoreChart.jsx
│   ├── vercel.json           # SPA rewrite rule
│   ├── vite.config.js        # Proxy /api → localhost:8000
│   └── tailwind.config.js    # Colores AWS (#FF9900, #232F3E)
├── render.yaml               # Config despliegue Render
├── preguntas.py              # Script auxiliar con banco de preguntas Whizlabs
└── .gitignore
```

---

## API endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/topics` | Lista de temas con conteo de preguntas |
| GET | `/api/quiz/{topic}/{difficulty}?num_questions=10` | Preguntas aleatorias |
| GET | `/api/quiz/{topic}/{difficulty}/answers` | Respuestas correctas + explicaciones |
| POST | `/api/results` | Guardar resultado de quiz |
| GET | `/api/stats` | Estadísticas globales del usuario |
| GET | `/api/stats/{topic}` | Estadísticas por tema |
| GET | `/api/export/csv` | Exportar histórico a CSV |
| GET | `/api/health` | Health check |
| GET | `/api/docs` | Documentación Swagger interactiva |

---

## Banco de preguntas — 241 preguntas en 13 temas

| Tema | Preguntas |
|------|-----------|
| Amazon SageMaker | 20+ |
| Amazon Bedrock & GenAI | 23+ |
| NLP: Comprehend, Translate, Polly, Transcribe, Lex | 19+ |
| Visión: Rekognition, Textract, Kendra | 7+ |
| Recomendaciones & Predicción: Personalize, Forecast | 7+ |
| Otros Servicios: Q, Fraud Detector, DevOps Guru, CodeGuru | 13+ |
| Optimización de Costos en AI/ML | 6+ |
| Seguridad & Gobernanza | 30+ |
| Escenarios del Mundo Real | 8+ |
| Métricas de Evaluación (ROUGE, BLEU, BERTScore...) | 12+ |
| IA Responsable en AWS | 12+ |
| Bases de Datos Vectoriales (OpenSearch, pgvector, RAG) | 8+ |
| Gobernanza y Cumplimiento (Config, Inspector, Artifact...) | 13+ |

Fuentes: material propio del curso + banco Whizlabs.

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

- **Quiz configurable** — elige tema, dificultad, número de preguntas (5-20) y cronómetro opcional
- **Feedback inmediato** — respuesta correcta/incorrecta con explicación tras cada pregunta
- **Dashboard de progreso** — quizzes completados, % aciertos, racha, gráfico de evolución temporal y por tema
- **Exportar a CSV** — descarga el histórico completo de resultados
- **Revisión de respuestas** — repasa todas las preguntas del quiz con explicaciones al terminar

---

## Notas técnicas

- Los resultados se guardan en SQLite (`backend/quiz.db`) — persistente en Render con disco efímero (se resetea en cada redespliegue)
- Sin autenticación — diseñado para uso personal
- Python 3.11 pinado con `.python-version` para compatibilidad con pydantic-core en Render
- CORS configurado via variable de entorno `ALLOWED_ORIGINS`
