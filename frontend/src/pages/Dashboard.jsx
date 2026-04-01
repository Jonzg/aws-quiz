import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats, exportCSV } from '../api'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar,
} from 'recharts'
import {
  Trophy, Target, Zap, TrendingUp, Download, PlayCircle,
  BookOpen,
} from 'lucide-react'
import { motion } from 'framer-motion'

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

const CHART_COLORS = [
  '#FF9900', '#10b981', '#3b82f6', '#a855f7', '#ec4899',
  '#f59e0b', '#14b8a6', '#6366f1', '#ef4444',
]

// Count-up animation hook
function useCountUp(target, duration = 1000, enabled = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!enabled || typeof target !== 'number') return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, enabled])
  return value
}

function StatCard({ icon: Icon, label, value, sub, accent = '#FF9900', index = 0 }) {
  // Parse numeric value for count-up
  const isPercent = typeof value === 'string' && value.endsWith('%')
  const numericTarget = isPercent
    ? parseInt(value)
    : typeof value === 'number' ? value : null

  const animated = useCountUp(numericTarget ?? 0, 900, numericTarget !== null)
  const displayValue = numericTarget !== null
    ? isPercent ? `${animated}%` : animated
    : value

  return (
    <motion.div
      className="card group"
      style={{ borderColor: 'var(--border)' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      whileHover={{ borderColor: `${accent}50`, y: -2, transition: { duration: 0.15 } }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
          style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: '#8B949E' }}>{label}</p>
          <p className="text-xl font-bold leading-tight tabular-nums" style={{ color: '#E6EDF3' }}>
            {displayValue}
          </p>
          {sub && <p className="text-xs" style={{ color: '#444c56' }}>{sub}</p>}
        </div>
      </div>
    </motion.div>
  )
}

// Skeleton loader
function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: '#21262D', ...style }}
    />
  )
}

function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-11 h-11 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl lg:col-span-2" />
      </div>
      <Skeleton className="h-56 rounded-xl" />
    </div>
  )
}

function formatDuration(seconds) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{ background: '#1C2128', border: '1px solid #30363D', color: '#E6EDF3' }}>
      <p className="font-semibold mb-1" style={{ color: '#8B949E' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.08 } }),
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getStats().then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleExport = () => {
    exportCSV().then(blob => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'quiz_history.csv'
      link.click()
    }).catch(console.error)
  }

  if (loading) return <SkeletonDashboard />

  const hasData = stats && stats.total_quizzes > 0

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
      }))
    : []

  const overallPct = hasData ? stats.overall_percentage : 0
  const passColor = overallPct >= 70 ? '#10b981' : '#ef4444'

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        variants={fadeUp} initial="hidden" animate="show" custom={0}
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#E6EDF3' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8B949E' }}>Seguimiento de tu progreso</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {hasData && (
            <motion.button
              onClick={handleExport}
              className="btn-outline text-xs gap-1.5"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <Download size={14} /> Exportar CSV
            </motion.button>
          )}
          <motion.button
            onClick={() => navigate('/exam-selection')}
            className="btn-primary text-sm"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <PlayCircle size={16} /> Empezar ahora
          </motion.button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard index={0} icon={Trophy} label="Quizzes completados" value={stats?.total_quizzes ?? 0} />
        <StatCard
          index={1} icon={Target} label="Aciertos global"
          value={hasData ? stats.overall_percentage : '—'}
          accent={hasData && stats.overall_percentage >= 70 ? '#10b981' : '#ef4444'}
        />
        <StatCard
          index={2} icon={Zap} label="Racha (≥70%)"
          value={hasData ? stats.best_streak : '—'}
          sub="consecutivos" accent="#a855f7"
        />
        <StatCard
          index={3} icon={TrendingUp} label="Temas practicados"
          value={hasData ? stats.by_topic.length : '—'}
          accent="#3b82f6"
        />
      </div>

      {/* Empty state */}
      {!hasData && (
        <motion.div
          className="card text-center py-20 space-y-5"
          variants={fadeUp} initial="hidden" animate="show" custom={1}
        >
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: 'rgba(255,153,0,0.1)', border: '1px solid rgba(255,153,0,0.25)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <BookOpen size={32} style={{ color: '#FF9900' }} />
          </motion.div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#E6EDF3' }}>¡Aún no hay datos!</h2>
            <p className="text-sm mt-1 max-w-xs mx-auto" style={{ color: '#8B949E' }}>
              Completa tu primer quiz para ver tus estadísticas aquí.
            </p>
          </div>
          <motion.button
            onClick={() => navigate('/exam-selection')}
            className="btn-primary mx-auto"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <PlayCircle size={16} /> Empezar ahora
          </motion.button>
        </motion.div>
      )}

      {hasData && (
        <>
          {/* Charts row */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            variants={fadeUp} initial="hidden" animate="show" custom={2}
          >
            {/* Gauge */}
            <div className="card flex flex-col items-center py-6">
              <p className="text-xs font-semibold uppercase tracking-wide mb-4 self-start" style={{ color: '#8B949E' }}>
                % Global
              </p>
              <div className="relative">
                <RadialBarChart
                  width={180} height={160}
                  cx={90} cy={130}
                  innerRadius={70} outerRadius={108}
                  startAngle={180} endAngle={0}
                  data={[
                    { value: 100, fill: '#21262D' },
                    { value: overallPct, fill: passColor },
                  ]}
                >
                  <RadialBar dataKey="value" cornerRadius={6} />
                </RadialBarChart>
                <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                  <span className="text-3xl font-extrabold tabular-nums" style={{ color: passColor }}>
                    {overallPct}%
                  </span>
                  <span className="text-xs" style={{ color: '#8B949E' }}>promedio</span>
                </div>
              </div>
              <div
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: `${passColor}18`,
                  color: passColor,
                  border: `1px solid ${passColor}35`,
                }}
              >
                {overallPct >= 70 ? '✓ Aprobado' : '✗ Por mejorar'}
              </div>
            </div>

            {/* Line chart */}
            <div className="card lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#8B949E' }}>
                Progresión temporal
              </p>
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={historyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8B949E' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#8B949E' }} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="porcentaje" name="Aciertos"
                    stroke="#FF9900" strokeWidth={2.5}
                    dot={{ fill: '#FF9900', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#FF9900', stroke: '#FF990050', strokeWidth: 4 }}
                  />
                  <Line
                    data={historyChartData.map(d => ({ ...d, umbral: 70 }))}
                    type="monotone" dataKey="umbral" name="Umbral 70%"
                    stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 5" dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar chart */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="show" custom={3}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#8B949E' }}>
              Rendimiento por tema
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topicChartData} margin={{ top: 0, right: 8, bottom: 36, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8B949E' }} angle={-25} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#8B949E' }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontSize: 12 }}
                  formatter={(v) => [`${v}%`]}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="promedio" name="Promedio" radius={[5, 5, 0, 0]} maxBarSize={40}>
                  {topicChartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* History table */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="show" custom={4}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#8B949E' }}>
              Últimos 10 quizzes
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #21262D' }}>
                    {['Fecha', 'Tema', 'Dificultad', 'Resultado', 'Duración'].map((h, i) => (
                      <th
                        key={h}
                        className={`pb-2 text-xs font-medium ${i === 3 ? 'text-center' : i === 4 ? 'text-right' : 'text-left'}`}
                        style={{ color: '#8B949E' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.history.slice(0, 10).map((h, rowIdx) => (
                    <motion.tr
                      key={h.id}
                      style={{ borderBottom: '1px solid #21262D' }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + rowIdx * 0.04 }}
                      className="transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = '#1C2128'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="py-3 text-xs" style={{ color: '#8B949E' }}>
                        {new Date(h.finished_at).toLocaleDateString('es-ES', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 text-xs font-medium" style={{ color: '#E6EDF3' }}>
                        {TOPIC_LABELS[h.topic] || h.topic}
                      </td>
                      <td className="py-3">
                        <span className={`badge-${h.difficulty}`}>{h.difficulty}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className="text-xs font-bold tabular-nums"
                          style={{ color: h.percentage >= 70 ? '#10b981' : '#ef4444' }}
                        >
                          {h.score}/{h.total} ({h.percentage}%)
                        </span>
                      </td>
                      <td className="py-3 text-right text-xs" style={{ color: '#8B949E' }}>
                        {formatDuration(h.duration_seconds)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
