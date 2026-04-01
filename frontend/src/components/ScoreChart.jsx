import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function ScoreChart({ percentage }) {
  const pct = Math.min(100, Math.max(0, percentage))
  const remaining = 100 - pct
  const passed = pct >= 70

  const data = [
    { name: 'Aciertos', value: pct },
    { name: 'Errores', value: remaining },
  ]

  const accentColor = passed ? '#10b981' : '#ef4444'

  return (
    <div className="card flex flex-col items-center">
      <h3 className="font-semibold mb-2 self-start text-sm" style={{ color: '#E6EDF3' }}>
        Puntuación
      </h3>
      <div className="relative">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx={100} cy={100}
              innerRadius={65} outerRadius={90}
              startAngle={90} endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={accentColor} />
              <Cell fill="#21262D" />
            </Pie>
            <Tooltip
              formatter={(v) => [`${v}%`]}
              contentStyle={{ background: '#1C2128', border: '1px solid #21262D', borderRadius: 8, color: '#E6EDF3', fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color: accentColor }}>
            {pct}%
          </span>
          <span className="text-xs" style={{ color: '#8B949E' }}>aciertos</span>
        </div>
      </div>
      <p className="mt-1 text-sm font-semibold" style={{ color: accentColor }}>
        {passed ? '✓ Aprobado (≥70%)' : '✗ Suspendido (<70%)'}
      </p>
    </div>
  )
}
