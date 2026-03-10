# AWS AI Practitioner - Guía Teórica Completa

## Índice

1. SageMaker
2. Bedrock & Generative AI
3. Servicios NLP
4. Servicios de Visión
5. Sistemas de Recomendación y Predicción
6. Otros Servicios ML
7. Consideraciones de Costo
8. Seguridad & Gobernanza

---

## 1. AMAZON SAGEMAKER

### Definición General

Amazon SageMaker es un servicio completamente administrado que cubre el ciclo de vida completo de Machine Learning: preparación de datos, entrenamiento, ajuste de modelos, implementación e inferencia. No requiere gestionar infraestructura subyacente.

### Componentes Principales

#### SageMaker Data Wrangler

- **Propósito:** Preparar y transformar datos antes del entrenamiento
- **Características:**
  - Interfaz visual (sin código)
  - Exploración de datos interactiva
  - Transformaciones automáticas (normalización, codificación)
  - Detección de datos faltantes y outliers
  - Exportar workflows a jobs de training

#### SageMaker Feature Store

- **Propósito:** Almacenar y gestionar características (features) de forma centralizada
- **Ventajas:**
  - Reutilizar features entre modelos
  - Garantizar consistencia entre entrenamiento e inferencia
  - Versionado de features
  - Historial temporal para validaciones
- **Casos de uso:** Recomendaciones, detección de fraude, predicción

#### SageMaker Autopilot

- **Propósito:** Automatizar la búsqueda del mejor modelo sin expertise en ML
- **Flujo:**
  - Upload de datos
  - Selección automática de algoritmo
  - Ajuste de hiperparámetros
  - Generación de notebooks con código
- **Para quién:** Usuarios sin experiencia ML, analistas de negocio

#### SageMaker Clarify

- **Propósito:** Detectar sesgos (bias) e interpretar predicciones de modelos
- **Funcionalidades:**
  - Análisis de desproporción (disparate impact)
  - Explicabilidad con SHAP y LIME
  - Reporte de bias por grupo demográfico
  - Monitoreo continuo de drift
- **Importancia:** Cumplimiento normativo (GDPR, AI Act)

#### SageMaker Pipelines

- **Propósito:** Orquestar y automatizar workflows ML de múltiples pasos
- **Características:**
  - Integración CI/CD
  - Reproducibilidad
  - Gestión de dependencias
  - Pasos: Data prep → Entrenamiento → Validación → Deployment
  - Integración con MLflow y otros tools

#### SageMaker Canvas

- **Propósito:** Crear modelos sin código (interfaz visual)
- **Para quién:** Analistas de negocio, usuarios no-tech
- **Capacidades:** Pronósticos, clasificación, regresión
- **Ventaja:** Acceso a modelos sin aprender ML

#### SageMaker Ground Truth

- **Propósito:** Crear datasets etiquetados a escala
- **Métodos de etiquetado:**
  - Crowdsourcing (Amazon Mechanical Turk)
  - Etiquetado asistido por ML
  - Validación de calidad
  - Programmatic labeling (scripts)

### Entrenamientos en SageMaker

#### Entrenamiento Distribuido

- Escalar automáticamente entrenamiento en múltiples GPUs/nodos
- Framework support: TensorFlow, PyTorch, MXNet, scikit-learn, XGBoost, etc.
- Checkpointing para recuperación ante fallos
- Logs automáticos en CloudWatch

#### Spot Instances

- Instancias EC2 subutilizadas a precio de descuento
- **Ahorro:** hasta 70% vs on-demand
- **Riesgo:** pueden interrumpirse
- **Recomendación:** entrenamientos tolerantes a interrupciones

### Modelos de Precios

**Training:**

- Pago por segundo de instancia utilizada
- Spot Instances: 70% descuento
- Auto-scaling según demanda

**Endpoints (Inference):**

- On-demand: pago por segundo
- Multi-model: compartir infraestructura
- Batch Transform: procesar lotes offline (más barato)
- Auto-scaling: escalar con demand

---

## 2. AMAZON BEDROCK & GENERATIVE AI

### Definición General

Amazon Bedrock es un servicio que proporciona acceso a modelos generativos (LLMs, imagen, embedding) de múltiples proveedores vía API, sin necesidad de gestionar infraestructura.

### Modelos Disponibles

**Texto (LLMs):**

- Claude (Anthropic) - Claude 3 Opus, Sonnet, Haiku
- Llama (Meta)
- Mistral
- Cohere Command
- Amazon Titan (propio)

**Imagen:**

- Stable Diffusion
- DALL-E (próximamente)

**Embedding:**

- Titan Embeddings

**Análisis de Video:**

- Modelos especializados

### Componentes de Bedrock

#### Bedrock Knowledge Bases

- **Propósito:** Conectar datos propios al LLM para RAG (Retrieval Augmented Generation)
- **Flujo:**
  1. Sube documentos (S3, web internas, etc)
  2. Knowledge Base indexa y vectoriza
  3. LLM recupera información relevante
  4. Genera respuestas basadas en tu data
- **Ventaja:** Respuestas actualizadas sin reentrenamiento

#### Bedrock Agents

- **Propósito:** Crear agentes IA autónomos que resuelven tareas
- **Flujo:**
  1. Usuario hace pregunta
  2. Agent decide qué herramientas usar
  3. Llama APIs/Lambda/bases de datos
  4. Interpreta resultados
  5. Itera hasta resolver
- **Casos:** Soporte al cliente, automatización RPA, análisis de datos

#### Bedrock Prompt Management

- **Propósito:** Versionarr, testar y optimizar prompts
- **Funcionalidades:**
  - Control de versiones de prompts
  - Testing A/B entre prompts
  - Comparación de modelos
  - Gestión de variables
  - Histórico de cambios

#### Bedrock Data Automation

- **Propósito:** Automatizar tareas de procesamiento de documentos con GenAI
- **Casos:** Extracción de datos, clasificación, transformación a escala

### Modelos de Precios

**Pay-as-you-go (On-demand):**

- Cobra por tokens de entrada/salida
- Flexible para volumen variable
- No hay compromiso mínimo

**Provisioned Throughput:**

- Contrato mensual
- Mejor precio para volumen alto predecible
- Garantiza throughput
- Más económico si usas > X tokens/día

**Prompt Caching:**

- Reutilizar contexto (documentos largos)
- Ahorro de 90% en tokens

---

## 3. SERVICIOS NLP (PROCESAMIENTO DE LENGUAJE NATURAL)

### Amazon Comprehend

**Definición:** Servicio de análisis NLP que detecta sentimiento, entidades, lenguaje, sintaxis, temas.

**Capacidades:**

- **Sentiment:** Positivo, Negativo, Neutral, Mixto (confianza %)
- **Entidades:** Personas, lugares, eventos, productos, dinero, fechas
- **Palabras clave:** Términos importantes en el texto
- **Lenguaje detectado:** Identifica idioma
- **Sintaxis:** POS tagging (sustantivo, verbo, etc)
- **Clasificación de texto:** Custom (entrenar propio modelo)

**Amazon Comprehend Medical:**

- Versión especializada para textos clínicos
- Extrae medicamentos, dosis, síntomas, condiciones
- Cumple HIPAA (privacidad médica)

**Casos de uso:**

- Monitoreo de redes sociales (sentimiento)
- Análisis de reviews de clientes
- Análisis de feedback de empleados
- Extracción de datos de documentos médicos

### Amazon Translate

**Definición:** Traducción neural automática entre idiomas

**Características:**

- Mantiene contexto y significado
- Soporta 70+ idiomas
- Muy rápido (milisegundos)
- Bajo costo por caracteres

**Casos de uso:**

- Localización de contenido
- Traducción de chat en vivo
- Análisis de tweets multiidioma
- Documentos internacionales

### Amazon Polly

**Definición:** Conversión de texto a voz (Text-to-Speech)

**Características:**

- Voz natural neural (NTTS)
- 130+ voces en 40+ idiomas
- Síntesis rápida
- Descarga de MP3 o streaming

**Casos de uso:**

- Audiobooks y e-learning
- Asistentes de voz
- Accesibilidad
- Aplicaciones móviles

### Amazon Transcribe

**Definición:** Conversión de audio/voz a texto (Speech-to-Text)

**Características:**

- Reconocimiento automático de voz (ASR)
- Identifica múltiples idiomas en mismo audio
- Modelos especializados: médico, legal, conversacional
- Timestamps (cuándo se habla qué)
- Identificación de hablante

**Casos de uso:**

- Transcripción de llamadas de soporte
- Subtítulos en video
- Transcripción de conferencias
- Análisis de conversaciones

### Amazon Lex

**Definición:** Servicio para construir chatbots y asistentes de voz inteligentes

**Componentes:**

- NLU (Natural Language Understanding): entiende intención
- Dialog Management: gestiona flujo de conversación
- Integración de servicios: Lambda, databases, APIs
- Multi-canal: texto, voz, aplicaciones

**Flujo típico:**

1. Usuario habla/escribe
2. Transcribe (si voz) con Amazon Transcribe
3. NLU entiende intención (intent) y datos (slots)
4. Dialog manager decide siguiente paso
5. Llama Lambda o API
6. Sintetiza respuesta con Polly (si voz)

**Casos de uso:**

- Chatbots de soporte
- Asistentes de voz
- Reservas de citas
- FAQ automatizado

---

## 4. SERVICIOS DE VISIÓN

### Amazon Rekognition

**Definición:** Análisis de imágenes y vídeos usando computer vision

**Capacidades:**

**Imágenes:**

- Detección de objetos (qué hay en la imagen)
- Detección de rostros (ubicación, atributos: edad, sexo, emoción)
- Reconocimiento de celebridades
- Detección de texto (OCR)
- Análisis de actividades/acciones
- Moderación de contenido (NSFW, violencia)
- Búsqueda de personas por cara
- Comparación de rostros (1-a-1)

**Vídeo:**

- Rastreo de objetos entre frames
- Detección de actividades temporales
- Identificación de escenas
- Extracción de keyframes

**Casos de uso:**

- Seguridad (vigilancia, identificación)
- Moderación de redes sociales
- Búsqueda de personas (missing persons)
- Análisis de eventos en vivo

### Amazon Textract

**Definición:** Extracción automática de texto y tablas de documentos (PDF, imágenes)

**Características:**

- OCR avanzado con ML
- Detección de tablas
- Detección de formularios
- Extracción de campos clave-valor
- Mantiene estructura espacial
- Maneja documentos de baja calidad
- Multiidioma

**Flujo típico:**

1. Documento (PDF/imagen) → Textract
2. Extrae texto, tablas, formularios
3. JSON estructurado con confianza %
4. Opcional: procesamiento posterior (validación, limpieza)

**Casos de uso:**

- Procesamiento de facturas (RPA)
- Análisis de pasaportes/DNI
- Digitalización de formularios
- Automatización de entrada de datos
- Análisis de recibos

### Amazon Kendra

**Definición:** Motor de búsqueda empresarial inteligente con ML

**Características:**

- Búsqueda semántica (entiende significado, no solo keywords)
- Soporte múltiples fuentes: S3, SharePoint, wikis, URLs, bases de datos
- Preguntas en lenguaje natural
- Ranking inteligente de resultados
- Filtrado por atributos
- Análisis de FAQ

**Ventaja sobre búsqueda tradicional:**

- "Cómo cambiar contraseña" encuentra respuesta aunque no tenga esas palabras exactas
- Entiende sinónimos y contexto
- Mejor precisión

**Casos de uso:**

- Portal de conocimiento empresarial
- Sistema de FAQ interno
- Búsqueda en documentación técnica
- Intranet inteligente

---

## 5. SISTEMAS DE RECOMENDACIÓN Y PREDICCIÓN

### Amazon Personalize

**Definición:** Servicio administrado para crear sistemas de recomendación personalizados

**Datos Necesarios:**

- Interacciones (clicks, compras, ratings) de usuarios
- Catálogo de items (productos, películas, etc)
- Metadata de usuarios (edad, ubicación, etc) - opcional

**Tipos de Recomendación:**

1. **USER_PERSONALIZATION:** Qué le recomendaría a este usuario
2. **SIMILAR_ITEMS:** Productos similares a este
3. **RANKING:** Ordenar items para este usuario
4. **PROMOTION:** Promover items específicos personalizadamente

**Cómo funciona:**

1. Ingesta de datos históricos
2. Entrenamiento automático de modelo (2-4 horas)
3. Deployment de "campaign" (endpoint)
4. Llamadas en tiempo real: `GetRecommendations(user_id, num=5)`

**Aprendizaje Continuo:**

- Procesa nuevas interacciones automáticamente
- Actualiza recomendaciones sin reentrenamiento manual
- Mejora con el tiempo

**Casos de uso:**

- E-commerce (recomienda productos)
- Streaming (recomienda películas/series)
- Noticias (recomienda artículos)
- Redes sociales (recomienda personas a seguir)

### Amazon Forecast

**Definición:** Predicción de series temporales (forecasting)

**Capacidades:**

- Predice valores futuros basado en datos históricos
- Maneja estacionalidad, tendencias, ciclos
- Soporta datos univariados y multivariados
- Integración automática de variables exógenas

**Algoritmos que Prueba:**

- Clásicos: ARIMA, Exponential Smoothing, TBATS
- Modernos: Prophet, DeepAR+ (neural), Wavenet
- Elige automáticamente el mejor para tus datos

**Flujo:**

1. Upload datos históricos (CSV)
2. Define horizon de predicción (cuántos pasos adelante)
3. Forecast entrena automáticamente
4. Devuelve predicciones + intervalos de confianza

**Casos de uso:**

- Predicción de demanda (retail)
- Pronóstico de tráfico/consumo (utilities)
- Predicción de ingresos
- Planeamiento de inventario
- Pronóstico de gastos

---

## 6. OTROS SERVICIOS ML

### Amazon Q

**Definición:** Asistente de IA generativa para empresas

**Características:**

- Responde preguntas sobre código fuente
- Recomendaciones de código
- Explicación de documentación
- Análisis de logs
- Acceso a datos empresariales
- Integración con IDEs (VS Code, JetBrains, etc)

**Casos de uso:**

- Onboarding de desarrolladores
- Documentación automática
- Debugging asistido

### Amazon Fraud Detector

**Definición:** Detección de transacciones fraudulentas usando ML

**Ventaja:** Entrena sin dataset grande de fraudes históricos

- Usa aprendizaje de anomalías
- Casos positivos limitados → aún efectivo

**Modelos:**

- Online fraud (e-commerce)
- Account takeover (acceso no autorizado)
- Custom (tu propia regla)

**Casos de uso:**

- Detección de fraude en transacciones
- Acceso no autorizado a cuentas
- Compra de robots (scalpers)

### Amazon DevOps Guru

**Definición:** Detectar y diagnosticar problemas operacionales automáticamente

**Funcionalidades:**

- Analiza logs, métricas, traces
- Detecta anomalías
- Predice problemas
- Sugiere soluciones
- Integración con AWS services (Lambda, RDS, ECS, etc)

**Casos de uso:**

- Monitoreo de aplicaciones
- Predicción de outages
- Optimización de performance

### AWS DeepLens

**Definición:** Cámara con IA integrada para ejecutar modelos en edge

**Características:**

- GPU integrada (Intel)
- Ejecuta modelos localmente (no envía a AWS)
- Bajo latencia (sin esperar a cloud)
- Privacidad de datos (no sale del dispositivo)

**Casos de uso:**

- Inspección de manufactura
- Seguridad en tiempo real
- Análisis de tiendas (foot traffic)
- Detección de equipos defectuosos

### Amazon CodeGuru

**Componentes:**

**Reviewer:**

- Análisis estático de código
- Detecta defectos (bugs)
- Identifica vulnerabilidades de seguridad
- Recomienda optimizaciones
- Integración con GitHub/CodeCommit
- Lenguajes: Python, Java

**Profiler:**

- Análisis de performance en runtime
- Identifica bottlenecks
- Recomienda optimizaciones
- Bajo overhead

**Casos de uso:**

- Code review automático
- Mejora de seguridad
- Optimización de performance

### Amazon CodeWhisperer

**Definición:** Asistente de codificación con IA (similar a GitHub Copilot)

**Características:**

- Autocomplete inteligente
- Sugiere líneas/funciones completas
- Detecta vulnerabilidades en código
- Soporte multilenguaje
- Integración IDEs: VS Code, JetBrains, Visual Studio
- Gratuito para usuarios individuales

**Casos de uso:**

- Acelerar desarrollo
- Aprender patrones de código
- Mejorar seguridad

### Amazon Titan

**Definición:** Modelos base de AWS para GenerativeAI

**Modelos:**

- **Titan Text:** LLM para texto (chat, summarización)
- **Titan Embeddings:** Convertir texto a vectores
- **Titan Image Generator:** Generar imágenes desde texto
- **Titan Multimodal:** Análisis de imagen + texto

---

## 7. OPTIMIZACIÓN DE COSTOS

### Estrategias por Servicio

**SageMaker Training:**

- ✅ Spot Instances (ahorro 70%)
- ✅ Distribuir entre múltiples GPUs
- ✅ Training jobs cortos cuando sea posible
- ❌ No: Training on-demand continuo

**SageMaker Inference:**

- ✅ Multi-model endpoints (compartir infraestructura)
- ✅ Auto-scaling (escalar solo si demanda sube)
- ✅ Batch Transform para predicciones offline
- ✅ Endpoints sin usar → pausar
- ❌ No: Endpoints always-on con poco tráfico

**Bedrock:**

- ✅ On-demand para experimentación
- ✅ Provisioned Throughput si volumen > 100K tokens/día
- ✅ Prompt caching para contexto reutilizable
- ✅ Elegir modelo adecuado (Haiku < Sonnet < Opus)

**Rekognition:**

- ✅ Batch processing (más barato que real-time)
- ✅ Filtrar localmente antes de enviar
- ✅ Comprimir imágenes

**Free Tier AWS:**

- 12 meses gratuitos
- SageMaker: 250 entrenimientos, inference
- Comprehend: 100K unidades
- Translate: 2M caracteres
- Mucho más

---

## 8. SEGURIDAD & GOBERNANZA

### Sesgos (Bias) en ML

**Definición:** Modelo discrimina injustamente contra grupo específico

**Ejemplos:**

- Algoritmo de hiring rechaza mujeres (datos históricos sexistas)
- Modelo de crédito discrimina por raza (datos no balanceados)
- Facial recognition falla más en personas oscuras

**Cómo ocurre:**

1. Datos históricos contienen discriminación
2. Modelo aprende patrón discriminatorio
3. Lo perpetúa o amplifica

**Mitigación:**

- Análisis de datos (balancear por grupos)
- Amazon SageMaker Clarify detecta automáticamente
- Resampling, pesos, etc

### Explicabilidad (Interpretability)

**Problema:** Modelos complejos = "caja negra"

**Solución:** Explicar qué features influenciaron predicción

**Métodos:**

- **SHAP:** Shapley Additive exPlanations (matemáticamente fundado)
- **LIME:** Local Interpretable Model Explanations (aproximación local)
- **Feature Importance:** Qué variable es más importante
- **Partial Dependence:** Cómo change predicción si cambio feature

**Herramienta:** Amazon SageMaker Clarify

### Consideraciones Éticas en GenAI

**Sesgos en LLMs:**

- Entrenas con internet → contiene sesgos humanos
- Perpetúa estereotipos

**Hallucinations:**

- LLM genera información falsa pero creíble
- "Las ballenas son peces" (falso)
- Mitigación: RAG, fine-tuning, prompts específicos

**Privacidad:**

- LLM no debe revelar datos de entrenamiento
- GDPR: derecho a olvidar
- Bedrock: garantiza no usar datos para mejorar modelo

**Derechos de Autor:**

- ¿Puedo usar contenido con copyright para entrenar?
- Generadores de imagen: Stable Diffusion entrenado con millones de imágenes
- Regulación: AI Act (EU), DMCA (USA)

**Transparencia:**

- Usuario debe saber que interactúa con IA
- Divulgar limitaciones

### Privacidad en ML

**Técnicas:**

1. **Anonimización:**
   - Remover PII (nombre, email, número ID)
   - Generalizar edad a rangos
   - Hashear campos sensibles

2. **Encriptación:**
   - En tránsito (TLS/SSL)
   - En reposo (KMS)
   - End-to-end si crítico

3. **Differential Privacy:**
   - Añadir ruido a datos
   - Garantía matemática de privacidad
   - Trade-off: privacidad vs. precisión

4. **Acceso Basado en Roles (RBAC):**
   - Solo quién necesita → acceso
   - Auditoría de accesos
   - MFA (autenticación multifactor)

### Regulaciones

**GDPR (Unión Europea):**

- Derecho a explicación de decisiones automatizadas
- Derecho a olvido (borrar datos)
- Consentimiento explícito
- Data protection officer

**CCPA (California):**

- Derecho a saber qué datos recopilan
- Derecho a borrar
- No discriminación si ejerces derechos

**AI Act (EU):**

- Alto riesgo (hiring, crédito, etc) requiere auditoría
- Transparencia obligatoria
- Documentación del modelo

**Industria-específico:**

- HIPAA (salud): privacidad de datos médicos
- PCI-DSS (tarjetas): seguridad de pagos
- SOC 2 (servicios): control de acceso

### Seguridad en Bedrock

**Mejores prácticas:**

1. **VPC Endpoints:**
   - Aislamiento de red
   - No pasa por internet público

2. **Encriptación:**
   - KMS para datos en reposo
   - TLS para tránsito
   - HTTPS siempre

3. **IAM Roles:**
   - Principio de mínimo privilegio
   - Role por equipo/aplicación
   - Políticas granulares

4. **Content Filtering:**
   - Bedrock content filters
   - Rechaza input/output inapropiado
   - Configurable por política

5. **Auditoría:**
   - CloudTrail logs
   - Saber quién usó Bedrock cuándo
   - Revisar prompts sensibles

6. **No enviar PII:**
   - Bedrock no cifra a nivel de token
   - Asume proveedor ve tokens
   - Usar Knowledge Bases con datos no-sensitive mejor

---

## Resumen Rápido: Cuándo Usar Cada Servicio

| Caso de Uso                    | Servicio                     |
| ------------------------------ | ---------------------------- |
| Recomendaciones personalizadas | Personalize                  |
| Predecir demanda futura        | Forecast                     |
| Análisis de sentimiento        | Comprehend                   |
| Traducir documentos            | Translate                    |
| Chatbot de voz                 | Lex + Transcribe/Polly       |
| Extraer datos de facturas      | Textract                     |
| Buscar en documentos internos  | Kendra                       |
| Inspeccionar manufactura       | DeepLens + Rekognition       |
| Chatbot GenAI sobre tus datos  | Bedrock + Knowledge Bases    |
| Crear modelo sin código        | SageMaker Canvas / Autopilot |
| Entrenar modelo custom         | SageMaker Training           |
| Detectar fraude                | Fraud Detector               |
| Explicabilidad del modelo      | SageMaker Clarify            |
| Asistente de codificación      | CodeWhisperer                |
| Review automático de código    | CodeGuru Reviewer            |
| Optimizar performance          | CodeGuru Profiler            |

---

**Última actualización:** 2026-03-09
**Nivel:** AWS AI Practitioner
**Idioma:** Español (España)
