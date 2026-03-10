import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend
} from 'recharts'
import { Trophy, Target, Zap, Clock, Download, PlayCircle, TrendingUp } from 'lucide-react'

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

function StatCard({ icon: Icon, label, value, sub, color = 'text-aws-orange' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50 ${color} shrink-0`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}

function formatDuration(seconds) {
  if (!seconds) return '-'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

const COLORS = ['#FF9900', '#232F3E', '#28a745', '#dc3545', '#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleExport = () => {
    window.open((import.meta.env.VITE_API_URL || '') + '/api/export/csv', '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-aws-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const hasData = stats && stats.total_quizzes > 0

  // Prepare chart data
  const historyChartData = hasData
    ? [...stats.history].reverse().slice(-15).map((h, i) => ({
        name: `#${i + 1}`,
        porcentaje: h.percentage,
        tema: TOPIC_LABELS[h.topic] || h.topic,
      }))
    : []

  const topicChartData = hasData
    ? stats.by_topic.map(t => ({
        name: TOPIC_LABELS[t.topic] || t.topic,
        promedio: t.avg_percentage,
        mejor: t.best_percentage,
      }))
    : []

  const gaugeData = hasData
    ? [{ name: 'Aciertos', value: stats.overall_percentage, fill: '#FF9900' }]
    : [{ name: 'Aciertos', value: 0, fill: '#e5e7eb' }]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aws-dark">Dashboard</h1>
          <p className="text-gray-500 mt-1">Seguimiento de tu progreso para el examen</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {hasData && (
            <button onClick={handleExport} className="btn-outline gap-2 text-sm">
              <Download size={16} /> Exportar CSV
            </button>
          )}
          <button onClick={() => navigate('/quiz')} className="btn-primary gap-2">
            <PlayCircle size={18} /> Iniciar Quiz
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Trophy}
          label="Quizzes completados"
          value={stats?.total_quizzes ?? 0}
        />
        <StatCard
          icon={Target}
          label="% Aciertos global"
          value={hasData ? `${stats.overall_percentage}%` : '—'}
          color={hasData && stats.overall_percentage >= 70 ? 'text-green-500' : 'text-red-500'}
        />
        <StatCard
          icon={Zap}
          label="Racha actual (≥70%)"
          value={hasData ? stats.best_streak : '—'}
          sub="quizzes consecutivos"
        />
        <StatCard
          icon={TrendingUp}
          label="Temas practicados"
          value={hasData ? stats.by_topic.length : '—'}
        />
      </div>

      {/* Empty state */}
      {!hasData && (
        <div className="card text-center py-16">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={36} className="text-aws-orange" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">¡Aún no hay datos!</h2>
          <p className="text-gray-400 mb-6">Completa tu primer quiz para ver tus estadísticas aquí.</p>
          <button onClick={() => navigate('/quiz')} className="btn-primary mx-auto">
            <PlayCircle size={18} /> Empezar ahora
          </button>
        </div>
      )}

      {hasData && (
        <>
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gauge */}
            <div className="card flex flex-col items-center">
              <h3 className="font-semibold text-gray-700 mb-4 self-start">% Global</h3>
              <RadialBarChart
                width={200} height={180}
                cx={100} cy={140}
                innerRadius={80} outerRadius={120}
                startAngle={180} endAngle={0}
                data={[{ value: 100, fill: '#e5e7eb' }, { value: stats.overall_percentage, fill: '#FF9900' }]}
              >
                <RadialBar dataKey="value" cornerRadius={8} />
              </RadialBarChart>
              <p className="text-4xl font-bold text-aws-dark -mt-12">{stats.overall_percentage}%</p>
              <p className="text-sm text-gray-400 mt-1">promedio general</p>
              <p className={`mt-2 text-sm font-semibold ${stats.overall_percentage >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                {stats.overall_percentage >= 70 ? '✓ Aprobado' : '✗ Por mejorar'}
              </p>
            </div>

            {/* Line chart */}
            <div className="card lg:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-4">Progresión temporal</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={historyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Aciertos']}
                    labelFormatter={(l) => `Quiz ${l}`}
                  />
                  <Line
                    type="monotone" dataKey="porcentaje" stroke="#FF9900"
                    strokeWidth={2.5} dot={{ fill: '#FF9900', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {/* 70% pass line */}
                  <Line
                    data={historyChartData.map(d => ({ ...d, umbral: 70 }))}
                    type="monotone" dataKey="umbral" stroke="#28a745"
                    strokeWidth={1.5} strokeDasharray="5 5" dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-400 mt-1">— línea verde = 70% (aprobado)</p>
            </div>
          </div>

          {/* Bar chart by topic */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">Rendimiento por tema</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topicChartData} margin={{ top: 0, right: 10, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v) => [`${v}%`]} />
                <Bar dataKey="promedio" name="Promedio" radius={[4, 4, 0, 0]}>
                  {topicChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* History table */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">Últimos 10 quizzes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left py-2 font-medium">Fecha</th>
                    <th className="text-left py-2 font-medium">Tema</th>
                    <th className="text-left py-2 font-medium">Dificultad</th>
                    <th className="text-center py-2 font-medium">Resultado</th>
                    <th className="text-right py-2 font-medium">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.history.slice(0, 10).map(h => (
                    <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-gray-500">
                        {new Date(h.finished_at).toLocaleDateString('es-ES', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 font-medium">{TOPIC_LABELS[h.topic] || h.topic}</td>
                      <td className="py-3">
                        <span className={`badge-${h.difficulty}`}>{h.difficulty}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`font-bold ${h.percentage >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                          {h.score}/{h.total} ({h.percentage}%)
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400">{formatDuration(h.duration_seconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Missing import fix
function BookOpen({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
