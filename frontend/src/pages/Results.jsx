import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, RotateCcw, LayoutDashboard, CheckCircle, XCircle, ChevronDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import ScoreChart from '../components/ScoreChart'
import confetti from 'canvas-confetti'

const TOPIC_LABELS = {
  all: 'Todos',
  sagemaker: 'SageMaker',
  bedrock: 'Bedrock',
  bedrock_generative_ai: 'Bedrock & GenAI',
  nlp: 'NLP',
  nlp_services: 'NLP',
  vision: 'Visión',
  vision_services: 'Visión',
  recommendations: 'Rec.',
  recommendation_forecasting: 'Rec.',
  other_services: 'Otros',
  other_ml_services: 'Otros',
  costs: 'Costos',
  cost_optimization: 'Costos',
  security: 'Seguridad',
  security_governance: 'Seguridad',
  scenarios: 'Escenarios',
  real_world_scenarios: 'Escenarios',
  metrics_evaluation: 'Métricas',
  responsible_ai: 'IA Resp.',
  vector_databases: 'Vectores',
  governance_compliance: 'Gobernanza',
}

function formatDuration(s) {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

// Count-up hook
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (typeof target !== 'number') return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

const DIFF_COLORS = { basico: '#3b82f6', intermedio: '#f59e0b', avanzado: '#ef4444' }

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [reviewOpen, setReviewOpen] = useState(true)
  const firedConfetti = useRef(false)

  if (!state) {
    return (
      <div className="text-center py-20">
        <p className="text-sm mb-4" style={{ color: '#8B949E' }}>No hay resultados que mostrar.</p>
        <button onClick={() => navigate('/quiz')} className="btn-primary">Iniciar Quiz</button>
      </div>
    )
  }

  const { score, total, topic, difficulty, duration_seconds, answers, questions, answerMap } = state
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= 70
  const passColor = passed ? '#10b981' : '#ef4444'

  const animatedPct = useCountUp(percentage, 1200)

  // Confetti on pass
  useEffect(() => {
    if (passed && !firedConfetti.current) {
      firedConfetti.current = true
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: ['#FF9900', '#10b981', '#3b82f6', '#a855f7'] })
      }, 400)
    }
  }, [passed])

  // Stats by difficulty
  const byDifficulty = {}
  if (answers && questions) {
    questions.forEach(q => {
      const d = q.difficulty
      if (!byDifficulty[d]) byDifficulty[d] = { correct: 0, total: 0 }
      byDifficulty[d].total++
      const ans = answers.find(a => a.id === q.id)
      if (ans?.is_correct) byDifficulty[d].correct++
    })
  }
  const diffData = Object.entries(byDifficulty).map(([d, v]) => ({
    name: d.charAt(0).toUpperCase() + d.slice(1),
    key: d,
    aciertos: Math.round((v.correct / v.total) * 100),
    total: v.total,
  }))

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay },
  })

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Score header */}
      <motion.div
        className="card text-center py-12 relative overflow-hidden"
        style={{ borderColor: `${passColor}40` }}
        {...fadeUp(0)}
      >
        {/* Subtle glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${passColor}0f 0%, transparent 70%)` }}
        />

        {/* Trophy icon */}
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: `${passColor}15`,
            border: `2px solid ${passColor}40`,
            boxShadow: `0 0 32px ${passColor}30`,
          }}
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
        >
          <Trophy size={36} style={{ color: passColor }} />
        </motion.div>

        <motion.h1
          className="text-4xl font-extrabold tabular-nums"
          style={{ color: '#E6EDF3' }}
          {...fadeUp(0.2)}
        >
          {score} <span style={{ color: '#8B949E', fontWeight: 400 }}>/ {total}</span>
        </motion.h1>

        <motion.p
          className="text-6xl font-black mt-1 tabular-nums"
          style={{ color: passColor }}
          {...fadeUp(0.25)}
        >
          {animatedPct}%
        </motion.p>

        <motion.div
          className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full text-sm font-semibold"
          style={{ background: `${passColor}15`, color: passColor, border: `1px solid ${passColor}35` }}
          {...fadeUp(0.32)}
        >
          {passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {passed ? '¡Aprobado!' : 'Necesitas practicar más'}
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-5 text-xs"
          style={{ color: '#8B949E' }}
          {...fadeUp(0.38)}
        >
          <span><span style={{ color: '#E6EDF3', fontWeight: 600 }}>Tema:</span> {TOPIC_LABELS[topic] || topic}</span>
          <span><span style={{ color: '#E6EDF3', fontWeight: 600 }}>Dif.:</span> {difficulty}</span>
          <span><span style={{ color: '#E6EDF3', fontWeight: 600 }}>Tiempo:</span> {formatDuration(duration_seconds)}</span>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" {...fadeUp(0.1)}>
        <ScoreChart percentage={percentage} />

        {diffData.length > 0 && (
          <div className="card">
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#8B949E' }}>
              Aciertos por dificultad
            </p>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={diffData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8B949E' }} />
                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#8B949E' }} />
                <Tooltip
                  contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontSize: 12 }}
                  formatter={(v, n, p) => [`${v}% (${p.payload.total} preg.)`]}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="aciertos" radius={[5, 5, 0, 0]} maxBarSize={48}>
                  {diffData.map((entry, i) => (
                    <Cell key={i} fill={DIFF_COLORS[entry.key] || '#FF9900'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Answer review (collapsible) */}
      {answers && questions && (
        <motion.div className="card" {...fadeUp(0.15)}>
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setReviewOpen(o => !o)}
          >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B949E' }}>
              Revisión de respuestas
              <span className="ml-2 text-xs font-normal normal-case" style={{ color: '#444c56' }}>
                ({questions.length} preguntas)
              </span>
            </p>
            <motion.div
              animate={{ rotate: reviewOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} style={{ color: '#8B949E' }} />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {reviewOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 mt-4 max-h-[480px] overflow-y-auto pr-1">
                  {questions.map((q, i) => {
                    const ans = answers.find(a => a.id === q.id)
                    const am = answerMap?.[q.id] || {}
                    const correct = ans?.is_correct
                    const color = correct ? '#10b981' : '#ef4444'
                    const diffStyle = DIFF_COLORS[q.difficulty]

                    return (
                      <motion.div
                        key={q.id}
                        className="rounded-xl p-4"
                        style={{
                          background: correct ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                          border: `1px solid ${correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                        }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.025 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5" style={{ color }}>
                            {correct ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 flex-wrap">
                              <p className="text-sm font-medium leading-snug flex-1" style={{ color: '#E6EDF3' }}>
                                <span className="mr-2 text-xs" style={{ color: '#444c56' }}>#{i + 1}</span>
                                {q.question}
                              </p>
                              {q.difficulty && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                                  style={{ background: `${diffStyle}20`, color: diffStyle, border: `1px solid ${diffStyle}40` }}
                                >
                                  {q.difficulty}
                                </span>
                              )}
                            </div>
                            {!correct && (
                              <div className="mt-2 space-y-1 text-xs">
                                <p style={{ color: '#fca5a5' }}>
                                  Tu respuesta: <strong>{ans?.user_answer || '—'}</strong>
                                </p>
                                <p style={{ color: '#6ee7b7' }}>
                                  Correcta: <strong>{am.correct_answer}</strong>
                                </p>
                              </div>
                            )}
                            {am.explanation && (
                              <p
                                className="mt-2 text-xs leading-relaxed rounded-lg p-2.5"
                                style={{ background: 'rgba(255,255,255,0.04)', color: '#8B949E', border: '1px solid #21262D' }}
                              >
                                💡 {am.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div className="flex flex-wrap gap-3 justify-center pb-6" {...fadeUp(0.2)}>
        <motion.button
          onClick={() => navigate('/quiz')}
          className="btn-secondary"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        >
          <RotateCcw size={15} /> Nuevo Quiz
        </motion.button>
        <motion.button
          onClick={() => navigate('/')}
          className="btn-outline"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        >
          <LayoutDashboard size={15} /> Dashboard
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
