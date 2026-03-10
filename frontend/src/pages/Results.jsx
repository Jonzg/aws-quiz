import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, RotateCcw, LayoutDashboard, BookOpen, CheckCircle, XCircle } from 'lucide-react'
import {
  RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import ScoreChart from '../components/ScoreChart'

const TOPIC_LABELS = {
  all: 'Todos',
  sagemaker: 'SageMaker',
  bedrock: 'Bedrock',
  nlp: 'NLP',
  vision: 'Visión',
  recommendations: 'Rec. & Pred.',
  other_services: 'Otros Servicios',
  costs: 'Costos',
  security: 'Seguridad',
  scenarios: 'Escenarios',
}

function formatDuration(s) {
  if (!s) return '-'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">No hay resultados que mostrar.</p>
        <button onClick={() => navigate('/quiz')} className="btn-primary">Iniciar Quiz</button>
      </div>
    )
  }

  const { score, total, topic, difficulty, duration_seconds, answers, questions, answerMap } = state
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= 70

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
    aciertos: Math.round((v.correct / v.total) * 100),
    total: v.total,
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      {/* Score header */}
      <div className={`card text-center py-10 border-4 ${passed ? 'border-green-400' : 'border-red-400'}`}>
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
          <Trophy size={44} className={passed ? 'text-green-500' : 'text-red-500'} />
        </div>

        <h1 className="text-4xl font-bold text-aws-dark">
          {score} / {total}
        </h1>
        <p className="text-6xl font-extrabold mt-2" style={{ color: passed ? '#28a745' : '#dc3545' }}>
          {percentage}%
        </p>

        <div className={`inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-full font-bold text-lg ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {passed ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {passed ? '¡Aprobado!' : 'Necesitas practicar más'}
        </div>

        <div className="flex justify-center gap-8 mt-6 text-sm text-gray-500">
          <span><strong>Tema:</strong> {TOPIC_LABELS[topic] || topic}</span>
          <span><strong>Dificultad:</strong> {difficulty}</span>
          <span><strong>Tiempo:</strong> {formatDuration(duration_seconds)}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreChart percentage={percentage} />

        {diffData.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">Aciertos por dificultad</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={diffData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, n, p) => [`${v}% (${p.payload.total} preguntas)`]} />
                <Bar dataKey="aciertos" radius={[4, 4, 0, 0]}>
                  {diffData.map((entry, i) => (
                    <Cell key={i} fill={entry.aciertos >= 70 ? '#28a745' : '#dc3545'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Answer review */}
      {answers && questions && (
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Revisión de respuestas</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {questions.map((q, i) => {
              const ans = answers.find(a => a.id === q.id)
              const am = answerMap?.[q.id] || {}
              const correct = ans?.is_correct

              return (
                <div key={q.id} className={`p-4 rounded-xl border-2 ${correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 mt-0.5 ${correct ? 'text-green-500' : 'text-red-500'}`}>
                      {correct ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">
                        <span className="text-gray-400 mr-2">#{i + 1}</span>
                        {q.question}
                      </p>
                      {!correct && (
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="text-red-700">
                            Tu respuesta: <strong>{ans?.user_answer || '—'}</strong>
                          </p>
                          <p className="text-green-700">
                            Correcta: <strong>{am.correct_answer}</strong>
                          </p>
                        </div>
                      )}
                      {am.explanation && (
                        <p className="mt-2 text-xs text-gray-600 bg-white/70 rounded-lg p-2 border border-gray-200">
                          💡 {am.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={() => navigate('/quiz')} className="btn-secondary">
          <RotateCcw size={18} /> Nuevo Quiz
        </button>
        <button onClick={() => navigate('/')} className="btn-outline">
          <LayoutDashboard size={18} /> Dashboard
        </button>
      </div>
    </div>
  )
}
