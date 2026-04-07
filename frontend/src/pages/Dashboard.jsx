import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats, exportCSV } from '../api'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar,
} from 'recharts'
import {
  Trophy, Target, Zap, TrendingUp, Download, PlayCircle,
  BookOpen, Award, Activity,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

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
      className="relative overflow-hidden group rounded-2xl p-5 cursor-default"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.21, 1.11, 0.81, 0.99] }}
      whileHover={{
        borderColor: `${accent}45`,
        y: -3,
        boxShadow: `0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20, 0 1px 0 rgba(255,255,255,0.04) inset`,
        transition: { duration: 0.18 }
      }}
    >
      {/* Subtle gradient top */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }}
      />
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}06 0%, transparent 60%)` }}
      />
      <div className="relative flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
          style={{
            background: `${accent}12`,
            border: `1px solid ${accent}25`,
            boxShadow: `0 0 12px ${accent}10`,
          }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium truncate mb-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
          <p
            className="text-2xl font-bold leading-none tabular-nums"
            style={{ color: '#E6EDF3', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}
          >
            {displayValue}
          </p>
          {sub && <p className="text-xs mt-0.5" style={{ color: '#30363D' }}>{sub}</p>}
        </div>
      </div>
    </motion.div>
  )
}

// Skeleton loader
function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`rounded-lg shimmer ${className}`}
      style={{ ...style }}
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
    <div
      className="rounded-xl px-3 py-2.5 text-xs shadow-2xl"
      style={{
        background: 'rgba(15,20,25,0.95)',
        border: '1px solid #21262D',
        color: '#E6EDF3',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      <p className="font-semibold mb-1.5" style={{ color: '#6E7681', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-medium" style={{ color: p.color }}>
          {p.name}: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.value}%</span>
        </p>
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
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-1 h-6 rounded-full"
              style={{ background: 'linear-gradient(180deg, #FF9900, #e07b00)' }}
            />
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: '#E6EDF3', letterSpacing: '-0.02em' }}
            >
              Dashboard
            </h1>
          </div>
          <p className="text-sm ml-3.5" style={{ color: 'var(--muted)' }}>
            Seguimiento de tu progreso
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {hasData && (
            <motion.button
              onClick={handleExport}
              className="btn-outline text-xs gap-1.5"
              whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
            >
              <Download size={13} /> Exportar CSV
            </motion.button>
          )}
          <motion.button
            onClick={() => navigate('/exam-selection')}
            className="btn-primary text-sm"
            whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
          >
            <PlayCircle size={15} /> Empezar ahora
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
            <div className="card flex flex-col items-center py-6 relative overflow-hidden">
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: `radial-gradient(ellipse at center bottom, ${passColor}12 0%, transparent 70%)` }}
              />
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-4 self-start relative"
                style={{ color: 'var(--muted)' }}
              >
                % Global
              </p>
              <div className="relative">
                <RadialBarChart
                  width={180} height={160}
                  cx={90} cy={130}
                  innerRadius={70} outerRadius={108}
                  startAngle={180} endAngle={0}
                  data={[
                    { value: 100, fill: '#1C2128' },
                    { value: overallPct, fill: passColor },
                  ]}
                >
                  <RadialBar dataKey="value" cornerRadius={8} />
                </RadialBarChart>
                <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                  <span
                    className="text-3xl font-black tabular-nums"
                    style={{ color: passColor, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em' }}
                  >
                    {overallPct}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--muted)' }}>promedio</span>
                </div>
              </div>
              <div
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: `${passColor}12`,
                  color: passColor,
                  border: `1px solid ${passColor}30`,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                }}
              >
                {overallPct >= 70 ? '✓ Aprobado' : '✗ Por mejorar'}
              </div>
            </div>

            {/* Line chart */}
            <div className="card lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
                Progresión temporal
              </p>
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={historyChartData}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF9900" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#FF9900" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6E7681', fontFamily: 'JetBrains Mono, monospace' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6E7681', fontFamily: 'JetBrains Mono, monospace' }} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="porcentaje" name="Aciertos"
                    stroke="#FF9900" strokeWidth={2.5}
                    dot={{ fill: '#FF9900', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#FF9900', stroke: 'rgba(255,153,0,0.3)', strokeWidth: 6 }}
                  />
                  <Line
                    data={historyChartData.map(d => ({ ...d, umbral: 70 }))}
                    type="monotone" dataKey="umbral" name="Umbral 70%"
                    stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={false}
                    strokeOpacity={0.7}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar chart */}
          <motion.div className="card" variants={fadeUp} initial="hidden" animate="show" custom={3}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
              Rendimiento por tema
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topicChartData} margin={{ top: 0, right: 8, bottom: 36, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6E7681', fontFamily: 'JetBrains Mono, monospace' }} angle={-25} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6E7681', fontFamily: 'JetBrains Mono, monospace' }} tickFormatter={v => `${v}%`} />
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
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
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
