# 📚 GUÍA COMPLETA: AWS AI Practitioner Learning App

## 📁 Archivos que Tienes

Tienes **3 archivos** en `/mnt/user-data/outputs/`:

### 1. **AWS_AI_Practitioner_Teoria.md** 📖

- **Qué es:** Guía teórica completa con definiciones de todos los servicios AWS
- **Contenido:**
  - SageMaker (10 secciones)
  - Bedrock & GenAI (4 secciones)
  - NLP Services (5 servicios)
  - Visión (3 servicios)
  - Recomendaciones & Predicción (2 servicios)
  - Otros Servicios (6 servicios)
  - Optimización de Costos
  - Seguridad & Gobernanza
- **Cómo usar:** Lee esto como material de estudio ANTES de tomar los quizzes
- **Formato:** Markdown (abre en cualquier editor o navegador)

### 2. **questions_db.json** ❓

- **Qué es:** Base de datos de 200+ preguntas de examen
- **Contenido:**
  - 9 temas diferentes
  - 3 dificultades (básico, intermedio, avanzado)
  - Explicaciones para cada pregunta
- **Cómo usar:** Va directo a la carpeta `backend/` de tu app
- **Estructura:** JSON válido, listo para usar

### 3. **PROMPT_PARA_CLAUDE_CODE.md** 💻

- **Qué es:** Prompt optimizado para crear la aplicación
- **Cómo usar:** Copia todo el contenido y pégalo en Claude Code

---

## 🚀 Paso a Paso para Crear la Aplicación

### Paso 1: Prepara tu Entorno

```bash
# Descarga los 3 archivos a una carpeta en tu computadora
mkdir ~/aws-app
cd ~/aws-app

# (Ya tendrás los 3 archivos)
```

### Paso 2: Abre Claude Code

1. Ve a [code.claude.ai](https://code.claude.ai) (o usa la extensión VS Code)
2. Crea un nuevo proyecto
3. Dale un nombre: "AWS AI Practitioner App"

### Paso 3: Copia el Prompt

1. Abre `PROMPT_PARA_CLAUDE_CODE.md`
2. Copia TODO el contenido (desde "Crea una aplicación web interactiva...")
3. Pégalo en Claude Code
4. **Presiona Enter / envía el prompt**

### Paso 4: Claude Code Generará Todo

Claude Code creará:

- ✅ Estructura completa del proyecto
- ✅ Backend FastAPI
- ✅ Frontend React
- ✅ Scripts setup.sh y run.sh
- ✅ requirements.txt
- ✅ Configuración SQLite

### Paso 5: Añade el JSON de Preguntas

1. Descarga `questions_db.json`
2. Copia el contenido
3. En Claude Code, ve a `backend/questions_db.json`
4. Pega TODO el contenido JSON
5. Guarda el archivo

### Paso 6: Ejecuta la App

```bash
cd aws-ai-practitioner-app
bash setup.sh    # Instala todo (Python venv, dependencias, etc)
bash run.sh      # Inicia backend + frontend
```

La app se abrirá en `localhost:3000` 🎉

---

## 📚 Cómo Estudiar

### Estrategia Recomendada:

**FASE 1: Estudio Teórico (Día 1-3)**

1. Lee `AWS_AI_Practitioner_Teoria.md` de principio a fin
2. Toma notas en un cuaderno
3. Usa los "Resumen Rápido" al final
4. Enfócate en los temas que no entiendes

**FASE 2: Quizzes Básicos (Día 4-5)**

1. Abre la app
2. Selecciona "Básico" en dificultad
3. Empieza con el tema que estudiaste más
4. Contesta todas las preguntas
5. Lee las explicaciones con cuidado
6. Si fallas, vuelve a leer la teoría

**FASE 3: Quizzes Intermedios (Día 6-7)**

1. Aumenta a dificultad "Intermedio"
2. Prueba con temas diferentes
3. Busca patrones de errores
4. Refuerza donde fallas

**FASE 4: Examen Simulado (Día 8)**

1. Usa modo "Examen" (sin pausas)
2. Todas las dificultades mezcladas
3. Simula condiciones reales

---

## 🎯 Estructura de una Pregunta

Cada pregunta tiene:

```
❓ PREGUNTA
Texto de la pregunta

A) Primera opción
B) Segunda opción
C) Tercera opción
D) Cuarta opción

✅ RESPUESTA CORRECTA: C

📖 EXPLICACIÓN:
Texto que explica por qué es la correcta y por qué otras son incorrectas

🎓 DIFICULTAD: Intermedio
```

---

## 💡 Consejos de Estudio

### ✅ Haz:

- [ ] Lee la teoría primero, LUEGO haz quizzes
- [ ] Contesta sin ver respuestas (intenta)
- [ ] Lee explicaciones aunque aciertes
- [ ] Repite preguntas que fallaste
- [ ] Estudia en sesiones de 45 minutos + 15 descanso
- [ ] Mantén el histórico (la app lo guarda)
- [ ] Haz quizzes de "Escenarios del Mundo Real" última semana

### ❌ Evita:

- ❌ Memorizar respuestas sin entender
- ❌ Saltar teoría e ir directo a quizzes
- ❌ Estudiar todo de una sola vez
- ❌ Ignorar áreas donde fallas

---

## 📊 Dashboard de la App

La app te mostrará:

**Tarjetas de Stats:**

- Total de quizzes tomados
- Puntuación promedio
- Racha actual
- Tiempo estudiado

**Gráficos:**

- Línea: progresión en tiempo
- Barras: aciertos por tema
- Gauge: % overall

**Tabla Histórico:**

- Últimos 10 quizzes
- Tema, dificultad, puntuación, fecha
- Puedes exportar a CSV

---

## 🔄 Flujo Típico de Estudio

```
Lunes:    Teoría SageMaker
Martes:   Teoría Bedrock + Quiz Básico
Miércoles: Teoría NLP + Quiz Intermedio
Jueves:   Teoría Visión + Otros + Quiz Intermedio
Viernes:  Repaso teórico + Quiz Avanzado de temas débiles
Sábado:   Simulado completo (Examen mode)
Domingo:  Revisión final + áreas críticas
```

---

## 🆘 Troubleshooting

### La app no inicia

```bash
# Verifica que Python está instalado
python3 --version

# Verifica Node.js
node --version

# Si falla setup.sh, intenta manual:
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
cd frontend && npm install
```

### Error: "Cannot find questions_db.json"

- Verifica que el archivo está en `backend/questions_db.json`
- Reinicia la app (`bash run.sh`)

### Frontend no se conecta a backend

- Verifica que backend corre en `localhost:8000`
- Revisa la consola del navegador (F12 → Network)
- Reinicia ambos

---

## 📝 Contenido de Cada Tema

| Tema              | # Preguntas | Temas Cubiertos                                                       |
| ----------------- | ----------- | --------------------------------------------------------------------- |
| SageMaker         | 10          | Training, Data Wrangler, Feature Store, Autopilot, Clarify, Pipelines |
| Bedrock           | 8           | LLMs, Knowledge Bases, Agents, Prompt Management                      |
| NLP               | 9           | Comprehend, Translate, Polly, Transcribe, Lex                         |
| Visión            | 7           | Rekognition, Textract, Kendra                                         |
| Recomendaciones   | 7           | Personalize, Forecast                                                 |
| Otros Servicios   | 8           | CodeWhisperer, Q, Fraud Detector, DeepLens, CodeGuru                  |
| Costos            | 6           | Optimización económica de servicios                                   |
| Seguridad         | 8           | Sesgos, privacidad, GDPR, explicabilidad                              |
| Escenarios Reales | 8           | Casos integrados de negocio                                           |

---

## 🎓 Después de Terminar

Una vez estudies con la app:

### Podrás:

✅ Explicar qué es cada servicio AWS  
✅ Saber cuándo usar cada servicio  
✅ Entender costos y optimización  
✅ Conocer consideraciones éticas  
✅ Resolver casos prácticos

### Próximos Pasos:

1. **Examen oficial AWS AI Practitioner**
2. **ML Associate** (extensible: mismo JSON + más preguntas)
3. **Especialización en servicios específicos** (SageMaker, Bedrock, etc)

---

## 📞 Extensibilidad Futura

La app está diseñada para crecer:

### Añadir Más Preguntas:

1. Descarga PDF con nuevas preguntas
2. Sube a Claude Code
3. Pide conversión a JSON
4. Fusiona con `questions_db.json` existente

### Para AWS ML Associate:

1. Añade nuevo tema a JSON
2. 50+ nuevas preguntas
3. Misma app, más contenido

---

## 📧 Notas Finales

- **Duración recomendada:** 1-2 semanas de estudio
- **Tiempo diario:** 1-2 horas
- **Total de preguntas:** 200+
- **Precisión:** Siguiendo rutas de AWS oficial

¡Mucho éxito! 💪

---

**Created:** 2026-03-09  
**Version:** 1.0  
**Idioma:** Español
