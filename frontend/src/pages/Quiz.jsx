import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { PlayCircle, Timer, TimerOff, ChevronRight, BookOpen, BarChart3 } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'

const TOPICS = [
  { key: 'all', label: 'Todos los temas' },
  { key: 'sagemaker', label: 'Amazon SageMaker' },
  { key: 'bedrock', label: 'Bedrock & GenAI' },
  { key: 'nlp', label: 'NLP Services' },
  { key: 'vision', label: 'Visión por Computadora' },
  { key: 'recommendations', label: 'Recomendaciones & Predicción' },
  { key: 'other_services', label: 'Otros Servicios' },
  { key: 'costs', label: 'Optimización de Costos' },
  { key: 'security', label: 'Seguridad & Gobernanza' },
  { key: 'scenarios', label: 'Escenarios del Mundo Real' },
]

const DIFFICULTIES = [
  { key: 'all', label: 'Todas' },
  { key: 'basico', label: 'Básico' },
  { key: 'intermedio', label: 'Intermedio' },
  { key: 'avanzado', label: 'Avanzado' },
]

function useTimer(active) {
  const [elapsed, setElapsed] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => clearInterval(ref.current)
  }, [active])

  return elapsed
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [topic, setTopic] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [numQuestions, setNumQuestions] = useState(10)
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [topicInfo, setTopicInfo] = useState([])

  useEffect(() => {
    api.get('/api/topics').then(r => setTopicInfo(r.data)).catch(console.error)
  }, [])

  const selectedInfo = topicInfo.find(t => t.key === topic)

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen size={40} className="text-aws-orange" />
        </div>
        <h1 className="text-3xl font-bold text-aws-dark">Configura tu Quiz</h1>
        <p className="text-gray-500 mt-2">Selecciona tema, dificultad y número de preguntas</p>
      </div>

      <div className="card space-y-6">
        {/* Topic */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tema</label>
          <select
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-aws-orange transition-colors"
          >
            {TOPICS.map(t => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
          {selectedInfo && (
            <p className="text-xs text-gray-400 mt-1">{selectedInfo.question_count} preguntas disponibles</p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Dificultad</label>
          <div className="grid grid-cols-4 gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  difficulty === d.key
                    ? 'border-aws-orange bg-orange-50 text-aws-orange'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Num questions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número de preguntas: <span className="text-aws-orange">{numQuestions}</span>
          </label>
          <input
            type="range" min={5} max={20} step={5}
            value={numQuestions}
            onChange={e => setNumQuestions(Number(e.target.value))}
            className="w-full accent-aws-orange"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5</span><span>10</span><span>15</span><span>20</span>
          </div>
        </div>

        {/* Timer toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            {timerEnabled ? <Timer size={20} className="text-aws-orange" /> : <TimerOff size={20} className="text-gray-400" />}
            <div>
              <p className="text-sm font-semibold text-gray-700">Cronómetro</p>
              <p className="text-xs text-gray-400">Registra el tiempo de cada sesión</p>
            </div>
          </div>
          <button
            onClick={() => setTimerEnabled(v => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${timerEnabled ? 'bg-aws-orange' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${timerEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <button
          onClick={() => onStart({ topic, difficulty, numQuestions, timerEnabled })}
          className="btn-primary w-full text-lg py-4"
        >
          <PlayCircle size={22} /> Iniciar Quiz
        </button>
      </div>
    </div>
  )
}

// ── Quiz Screen ───────────────────────────────────────────────────────────────
function QuizScreen({ config, onFinish }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({}) // { id: { correct_answer, explanation } }
  const [current, setCurrent] = useState(0)
  const [userAnswers, setUserAnswers] = useState([]) // array of AnswerRecord
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const startTime = useRef(new Date().toISOString())
  const timerActive = useRef(true)
  const elapsed = useTimer(config.timerEnabled && !loading)

  useEffect(() => {
    const { topic, difficulty, numQuestions } = config
    Promise.all([
      api.get(`/api/quiz/${topic}/${difficulty}?num_questions=${numQuestions}`),
      api.get(`/api/quiz/${topic}/${difficulty}/answers`),
    ])
      .then(([qRes, aRes]) => {
        setQuestions(qRes.data)
        setAnswers(aRes.data)
      })
      .catch(e => setError(e.response?.data?.detail || 'Error al cargar preguntas'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = useCallback((option) => {
    if (revealed) return
    setSelected(option)
    setRevealed(true)
  }, [revealed])

  const handleNext = useCallback(() => {
    const q = questions[current]
    const answerData = answers[q.id] || {}
    const isCorrect = selected === answerData.correct_answer

    const record = {
      id: q.id,
      user_answer: selected,
      correct_answer: answerData.correct_answer,
      is_correct: isCorrect,
    }
    const newAnswers = [...userAnswers, record]

    if (current + 1 >= questions.length) {
      // Done
      const finishedAt = new Date().toISOString()
      const score = newAnswers.filter(a => a.is_correct).length
      onFinish({
        topic: config.topic,
        difficulty: config.difficulty,
        score,
        total: questions.length,
        started_at: startTime.current,
        finished_at: finishedAt,
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
  }, [questions, current, selected, answers, userAnswers, elapsed])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-aws-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Cargando preguntas…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto card text-center py-12">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-outline">
          Volver a intentar
        </button>
      </div>
    )
  }

  const q = questions[current]
  const answerData = answers[q?.id] || {}
  const progress = ((current) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-gray-500">
            Pregunta <span className="text-aws-orange font-bold">{current + 1}</span> / {questions.length}
          </span>
          <ProgressBar value={progress} className="mt-1 w-48" />
        </div>
        {config.timerEnabled && (
          <div className="flex items-center gap-2 text-aws-dark font-mono text-xl font-bold">
            <Timer size={18} className="text-aws-orange" />
            {formatTime(elapsed)}
          </div>
        )}
      </div>

      {/* Question */}
      <QuestionCard
        question={q}
        selected={selected}
        revealed={revealed}
        correctAnswer={answerData.correct_answer}
        explanation={answerData.explanation}
        onSelect={handleSelect}
      />

      {/* Next button */}
      {revealed && (
        <div className="flex justify-end animate-slide-up">
          <button onClick={handleNext} className="btn-primary">
            {current + 1 >= questions.length ? 'Ver resultados' : 'Siguiente'}
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Quiz page ─────────────────────────────────────────────────────────────
export default function Quiz() {
  const [config, setConfig] = useState(null)
  const navigate = useNavigate()

  const handleFinish = async (result) => {
    try {
      await api.post('/api/results', {
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

  if (!config) {
    return <SetupScreen onStart={setConfig} />
  }

  return <QuizScreen config={config} onFinish={handleFinish} />
}
