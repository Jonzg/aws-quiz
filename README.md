# AWS AI Practitioner Quiz App

Aplicación web interactiva para preparar el examen **AWS AI Practitioner**.

## Requisitos previos

- Python 3.11+
- Node.js 18+ (LTS)
- Git Bash (Windows) o terminal bash

## Inicio rápido

```bash
# 1. Instalar todo
bash setup.sh

# 2. Ejecutar
bash run.sh
```

La app abre automáticamente en `http://localhost:3000`.

---

## Estructura

```
aws app/
├── backend/
│   ├── main.py           # FastAPI (API REST)
│   ├── models.py         # Pydantic schemas
│   ├── database.py       # SQLite (aiosqlite)
│   ├── questions_db.json # 200+ preguntas
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/        # Dashboard, Quiz, Results
│       └── components/   # QuestionCard, ProgressBar, ScoreChart
├── setup.sh
└── run.sh
```

## API endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/topics` | Lista de temas disponibles |
| GET | `/api/quiz/{topic}/{difficulty}?num_questions=10` | Preguntas aleatorias |
| GET | `/api/quiz/{topic}/{difficulty}/answers` | Respuestas correctas + explicaciones |
| POST | `/api/results` | Guardar resultado de quiz |
| GET | `/api/stats` | Estadísticas globales |
| GET | `/api/stats/{topic}` | Estadísticas por tema |
| GET | `/api/export/csv` | Exportar histórico a CSV |
| GET | `/api/docs` | Documentación interactiva (Swagger) |

## Temas del banco de preguntas

- Amazon SageMaker
- Bedrock & Generative AI
- NLP Services
- Visión por Computadora
- Recomendaciones & Predicción
- Otros Servicios ML
- Optimización de Costos
- Seguridad & Gobernanza
- Escenarios del Mundo Real

## Dificultades

- **Básico** — Conceptos fundamentales
- **Intermedio** — Aplicaciones y comparativas
- **Avanzado** — Escenarios complejos y arquitecturas

## Notas

- Los datos se guardan localmente en `backend/quiz.db` (SQLite)
- Sin autenticación — solo para uso local
- El backend corre en `:8000`, el frontend en `:3000`
- API Swagger disponible en `http://localhost:8000/docs`
