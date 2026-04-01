import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { getTopics, getQuiz, getAnswers, saveResult } from '../api'
import { PlayCircle, Timer, TimerOff, ChevronRight, BookOpen, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'

gsap.registerPlugin(useGSAP)

const DIFFICULTIES = [
  { key: 'all', label: 'Todas' },
  { key: 'basico', label: 'Básico' },
  { key: 'intermedio', label: 'Intermedio' },
  { key: 'avanzado', label: 'Avanzado' },
]

const TOPIC_LABELS = {
  all: 'Todos los temas',
  sagemaker: 'Amazon SageMaker',
  bedrock_generative_ai: 'Bedrock & GenAI',
  nlp_services: 'NLP Services',
  vision_services: 'Vision Services',
  recommendation_forecasting: 'Recomendaciones & Forecast',
  other_ml_services: 'Otros Servicios ML',
  cost_optimization: 'Optimización de Costos',
  security_governance: 'Seguridad & Gobernanza',
  real_world_scenarios: 'Escenarios Reales',
  metrics_evaluation: 'Métricas de Evaluación',
  responsible_ai: 'IA Responsable',
  vector_databases: 'Bases de Datos Vectoriales',
  governance_compliance: 'Gobernanza y Cumplimiento',
}

function useTimer(active) {
  const [elapsed, setElapsed] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (active) ref.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(ref.current)
  }, [active])
  return elapsed
}

function formatTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [topic, setTopic] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [numQuestions, setNumQuestions] = useState(10)
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [topicInfo, setTopicInfo] = useState([])

  useEffect(() => {
    getTopics().then(setTopicInfo).catch(console.error)
  }, [])

  const allOption = topicInfo.find(t => t.key === 'all')
  const otherTopics = topicInfo.filter(t => t.key !== 'all')
  const selectedInfo = topicInfo.find(t => t.key === topic)

  const selStyle = {
    borderColor: 'rgba(255,153,0,0.6)',
    background: 'rgba(255,153,0,0.08)',
    color: '#FF9900',
  }
  const idleStyle = {
    borderColor: '#30363D',
    background: '#1C2128',
    color: '#8B949E',
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: 'rgba(255,153,0,0.1)', border: '1px solid rgba(255,153,0,0.2)' }}
        >
          <BookOpen size={26} style={{ color: '#FF9900' }} />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: '#E6EDF3' }}>Configura tu Quiz</h1>
        <p className="text-sm" style={{ color: '#8B949E' }}>Elige tema, dificultad y número de preguntas</p>
      </div>

      <div className="card space-y-6">
        {/* Topic */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>
            Tema
          </label>
          {allOption && (
            <div className="flex justify-center">
              <button
                onClick={() => setTopic('all')}
                className="w-full py-2 px-4 rounded-lg border text-sm font-medium transition-all duration-150"
                style={topic === 'all' ? selStyle : idleStyle}
              >
                {TOPIC_LABELS['all']}
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {otherTopics.map(t => (
              <button
                key={t.key}
                onClick={() => setTopic(t.key)}
                className="py-2 px-3 rounded-lg border text-xs font-medium transition-all duration-150 text-center"
                style={topic === t.key ? selStyle : idleStyle}
              >
                {TOPIC_LABELS[t.key] || t.name || t.key}
              </button>
            ))}
          </div>
          {selectedInfo && (
            <p className="text-xs" style={{ color: '#444c56' }}>
              {selectedInfo.question_count} preguntas disponibles
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>
            Dificultad
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className="py-2 rounded-lg border text-xs font-medium transition-all duration-150"
                style={difficulty === d.key ? selStyle : idleStyle}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Num questions */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>
            Preguntas:{' '}
            <span style={{ color: '#FF9900' }}>{numQuestions}</span>
          </label>
          <input
            type="range" min={5} max={20} step={5}
            value={numQuestions}
            onChange={e => setNumQuestions(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs" style={{ color: '#444c56' }}>
            <span>5</span><span>10</span><span>15</span><span>20</span>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Timer toggle */}
        <div
          className="flex items-center justify-between p-4 rounded-xl"
          style={{ background: '#1C2128', border: '1px solid #30363D' }}
        >
          <div className="flex items-center gap-3">
            {timerEnabled
              ? <Timer size={18} style={{ color: '#FF9900' }} />
              : <TimerOff size={18} style={{ color: '#8B949E' }} />
            }
            <div>
              <p className="text-sm font-medium" style={{ color: '#E6EDF3' }}>Cronómetro</p>
              <p className="text-xs" style={{ color: '#8B949E' }}>
                {timerEnabled ? 'Activado' : 'Desactivado'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTimerEnabled(v => !v)}
            className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
            style={{ background: timerEnabled ? '#FF9900' : '#30363D' }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{
                transform: timerEnabled
                  ? 'translateX(20px)'   // derecha
                  : 'translateX(0px)'    // izquierda
              }}
            />
          </button>
        </div>

        <button
          onClick={() => onStart({ topic, difficulty, numQuestions, timerEnabled })}
          className="btn-primary w-full py-3"
        >
          <PlayCircle size={18} /> Iniciar Quiz
        </button>
      </div>
    </motion.div>
  )
}

// ── Quiz Screen ───────────────────────────────────────────────────────────────
function QuizScreen({ config, onFinish }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const startTime = useRef(new Date().toISOString())
  const elapsed = useTimer(config.timerEnabled && !loading)

  // Refs for GSAP targets
  const questionWrapRef = useRef(null)
  const nextBtnRef = useRef(null)
  // Keep latest state values accessible inside contextSafe callbacks
  const stateRef = useRef({})
  stateRef.current = { questions, current, selected, answers, userAnswers, elapsed }

  useEffect(() => {
    const { topic, difficulty, numQuestions } = config
    Promise.all([
      getQuiz(topic, difficulty, numQuestions),
      getAnswers(topic, difficulty),
    ])
      .then(([qRes, aRes]) => { setQuestions(qRes); setAnswers(aRes) })
      .catch(e => setError(e.response?.data?.detail || 'Error al cargar preguntas'))
      .finally(() => setLoading(false))
  }, [])

  // Animate question in when current changes (or on first load)
  const { contextSafe } = useGSAP(() => {
    if (loading || !questionWrapRef.current) return
    gsap.fromTo(
      questionWrapRef.current,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' }
    )
  }, { scope: questionWrapRef, dependencies: [current, loading], revertOnUpdate: true })

  // Animate "next" button in when revealed
  useGSAP(() => {
    if (!revealed || !nextBtnRef.current) return
    gsap.fromTo(
      nextBtnRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', delay: 0.05 }
    )
  }, { dependencies: [revealed] })

  const handleSelect = useCallback((option) => {
    if (revealed) return
    setSelected(option)
    setRevealed(true)
  }, [revealed])

  // contextSafe so the out-animation is tracked by the GSAP context
  const handleNext = contextSafe(() => {
    const { questions, current, selected, answers, userAnswers, elapsed } = stateRef.current
    const q = questions[current]
    const answerData = answers[q.id] || {}
    const correctText = answerData.correct_answer
    const isCorrect = selected === correctText
    const record = { id: q.id, user_answer: selected, correct_answer: correctText, is_correct: isCorrect }
    const newAnswers = [...userAnswers, record]

    // Slide question out, then advance state (triggers animate-in via useGSAP dependency)
    gsap.to(questionWrapRef.current, {
      opacity: 0,
      x: -24,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        if (current + 1 >= questions.length) {
          onFinish({
            exam_id: localStorage.getItem('selectedExam') || 'ai_practitioner',
            topic: config.topic,
            difficulty: config.difficulty,
            score: newAnswers.filter(a => a.is_correct).length,
            total: questions.length,
            started_at: startTime.current,
            finished_at: new Date().toISOString(),
            duration_seconds: elapsed,
            answers: newAnswers,
            questions,
            answerMap: answers,
          })
        } else {
          setUserAnswers(newAnswers)
          setCurrent(c => c + 1)
          setSelected(null)
          setRevealed(false)
        }
      },
    })
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#FF9900', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: '#8B949E' }}>Cargando preguntas…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto card text-center py-12">
        <p className="text-sm mb-4" style={{ color: '#fca5a5' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-outline">
          Volver a intentar
        </button>
      </div>
    )
  }

  const q = questions[current]
  const answerData = answers[q?.id] || {}
  const correctAnswerText = answerData.correct_answer ?? null
  const progress = (current / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{ background: '#161B22', border: '1px solid #21262D' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium" style={{ color: '#8B949E' }}>
            Pregunta{' '}
            <span style={{ color: '#FF9900', fontWeight: 700 }}>{current + 1}</span>
            {' '}/{' '}{questions.length}
          </span>
          <ProgressBar value={progress} className="w-32" />
        </div>
        {config.timerEnabled && (
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold" style={{ color: '#E6EDF3' }}>
            <Timer size={14} style={{ color: '#FF9900' }} />
            {formatTime(elapsed)}
          </div>
        )}
      </div>

      {/* Question — GSAP handles slide-in/out via questionWrapRef */}
      <div ref={questionWrapRef}>
        <QuestionCard
          question={q}
          selected={selected}
          revealed={revealed}
          correctAnswer={correctAnswerText}
          explanation={answerData.explanation}
          onSelect={handleSelect}
        />
      </div>

      {/* Next button — GSAP animates in when revealed */}
      {revealed && (
        <div ref={nextBtnRef} className="flex justify-end">
          <button onClick={handleNext} className="btn-primary">
            {current + 1 >= questions.length ? 'Ver resultados' : 'Siguiente'}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Quiz page ─────────────────────────────────────────────────────────────
export default function Quiz() {
  const selectedExam = localStorage.getItem('selectedExam')
  if (!selectedExam) {
    return <Navigate to="/exam-selection" replace />
  }
  const [config, setConfig] = useState(null)
  const navigate = useNavigate()

  const handleFinish = async (result) => {
    try {
      await saveResult({
        exam_id: localStorage.getItem('selectedExam') || 'ai_practitioner',
        topic: result.topic,
        difficulty: result.difficulty,
        score: result.score,
        total: result.total,
        started_at: result.started_at,
        finished_at: result.finished_at,
        duration_seconds: result.duration_seconds,
        answers: result.answers,
      })
    } catch (e) {
      console.error('Error saving result:', e)
    }
    navigate('/results', { state: result })
  }

  return config
    ? <QuizScreen config={config} onFinish={handleFinish} />
    : <SetupScreen onStart={setConfig} />
}
