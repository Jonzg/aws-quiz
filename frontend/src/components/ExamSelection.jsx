import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, Sparkles, Brain, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { getExams } from '../api'

const EXAM_ICONS = {
  ai_practitioner: Brain,
}

const EXAM_TAGS = {
  ai_practitioner: ['Machine Learning', 'Generative AI', 'AWS Services'],
  ml_engineer_associate: ['MLOps', 'Model Deployment', 'Feature Engineering'],
}

const EXAM_LEVEL = {
  ai_practitioner: 'Practitioner',
  ml_engineer_associate: 'Associate',
}

const EXAM_QUESTIONS = {
  ai_practitioner: '65 preguntas',
  ml_engineer_associate: '65 preguntas',
}

export default function ExamSelection() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('selectedExam')
    getExams()
      .then(setExams)
      .catch(() => setError('Error al cargar los exámenes'))
      .finally(() => setLoading(false))
  }, [])

  const handleExamSelect = (examId) => {
    localStorage.setItem('selectedExam', examId)
    navigate('/quiz')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="w-10 h-10 rounded-full border-2"
          style={{ borderColor: '#FF9900', borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="mb-4 text-sm" style={{ color: '#fca5a5' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-outline">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center space-y-4 pt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(255,153,0,0.08)',
            color: '#FF9900',
            border: '1px solid rgba(255,153,0,0.2)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.08em',
          }}
        >
          <Sparkles size={10} />
          CERTIFICACIONES AWS
        </motion.div>

        <motion.h1
          className="text-4xl font-black tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ color: '#E6EDF3', letterSpacing: '-0.03em' }}
        >
          Elige tu examen
        </motion.h1>

        <motion.p
          className="text-sm max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--muted)' }}
        >
          Selecciona la certificación que quieres practicar hoy
        </motion.p>
      </div>

      {/* Exam cards */}
      {exams.length === 0 ? (
        <div className="card text-center py-12">
          <p style={{ color: 'var(--muted)' }}>No hay exámenes disponibles.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam, i) => {
            const Icon = EXAM_ICONS[exam.id] || BookOpen
            const tags = EXAM_TAGS[exam.id] || []
            const level = EXAM_LEVEL[exam.id] || 'Certified'
            const isHovered = hovered === exam.id

            return (
              <motion.div
                key={exam.id}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset',
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.21, 1.11, 0.81, 0.99] }}
                whileHover={{
                  borderColor: 'rgba(255,153,0,0.35)',
                  y: -4,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,153,0,0.15), 0 1px 0 rgba(255,255,255,0.04) inset',
                  transition: { duration: 0.2 },
                }}
                onHoverStart={() => setHovered(exam.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => handleExamSelect(exam.id)}
              >
                {/* Gradient top line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,153,0,0.5), transparent)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Background glow */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at top left, rgba(255,153,0,0.06) 0%, transparent 60%)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative p-6">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                        style={{
                          background: 'rgba(255,153,0,0.1)',
                          border: '1px solid rgba(255,153,0,0.2)',
                        }}
                      >
                        <Icon size={22} style={{ color: '#FF9900' }} />
                      </div>
                      <div>
                        <div
                          className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                          style={{ color: '#FF9900', fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {level}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {EXAM_QUESTIONS[exam.id] || '65 preguntas'}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={18} style={{ color: '#FF9900' }} />
                    </motion.div>
                  </div>

                  {/* Name */}
                  <h3
                    className="font-bold text-lg mb-2 leading-tight"
                    style={{ color: '#E6EDF3', letterSpacing: '-0.02em' }}
                  >
                    {exam.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
                    {exam.description}
                  </p>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            color: 'var(--muted)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Bottom note */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs" style={{ color: '#30363D', fontFamily: 'JetBrains Mono, monospace' }}>
          Banco de preguntas actualizado · Modo examen disponible
        </p>
      </motion.div>
    </motion.div>
  )
}
