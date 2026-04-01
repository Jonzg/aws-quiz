import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, Sparkles, Brain } from 'lucide-react'
import { motion } from 'framer-motion'
import { getExams } from '../api'

const EXAM_ICONS = {
  ai_practitioner: Brain,
}

const EXAM_TAGS = {
  ai_practitioner: ['Machine Learning', 'Generative AI', 'AWS Services'],
  ml_engineer_associate: ['MLOps', 'Model Deployment', 'Feature Engineering'],
}

export default function ExamSelection() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#FF9900', borderTopColor: 'transparent' }}
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
      className="max-w-4xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3"
          style={{
            background: 'rgba(255,153,0,0.1)',
            color: '#FF9900',
            border: '1px solid rgba(255,153,0,0.25)',
          }}
        >
          <Sparkles size={11} />
          Certificaciones AWS
        </div>
        <h1 className="text-3xl font-bold" style={{ color: '#E6EDF3' }}>
          Elige tu examen
        </h1>
        <p className="text-sm" style={{ color: '#8B949E' }}>
          Selecciona la certificación que quieres practicar
        </p>
      </div>

      {/* Exam cards */}
      {exams.length === 0 ? (
        <div className="card text-center py-12">
          <p style={{ color: '#8B949E' }}>No hay exámenes disponibles.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam, i) => {
            const Icon = EXAM_ICONS[exam.id] || BookOpen
            const tags = EXAM_TAGS[exam.id] || []
            return (
              <motion.div
                key={exam.id}
                className="card-hover group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleExamSelect(exam.id)}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(255,153,0,0.12)',
                      border: '1px solid rgba(255,153,0,0.2)',
                    }}
                  >
                    <Icon size={20} style={{ color: '#FF9900' }} />
                  </div>
                  <ChevronRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: '#8B949E' }}
                  />
                </div>

                <h3 className="font-semibold text-base mb-1.5" style={{ color: '#E6EDF3' }}>
                  {exam.name}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#8B949E' }}>
                  {exam.description}
                </p>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          color: '#8B949E',
                          border: '1px solid #21262D',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
