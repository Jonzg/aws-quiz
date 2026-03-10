import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function ScoreChart({ percentage }) {
  const pct = Math.min(100, Math.max(0, percentage))
  const remaining = 100 - pct
  const passed = pct >= 70

  const data = [
    { name: 'Aciertos', value: pct },
    { name: 'Errores', value: remaining },
  ]

  return (
    <div className="card flex flex-col items-center">
      <h3 className="font-semibold text-gray-700 mb-2 self-start">Puntuación</h3>
      <div className="relative">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx={100}
              cy={100}
              innerRadius={65}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={passed ? '#28a745' : '#dc3545'} />
              <Cell fill="#e5e7eb" />
            </Pie>
            <Tooltip formatter={(v) => [`${v}%`]} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color: passed ? '#28a745' : '#dc3545' }}>
            {pct}%
          </span>
          <span className="text-xs text-gray-400">aciertos</span>
        </div>
      </div>
      <p className={`mt-1 font-semibold ${passed ? 'text-green-600' : 'text-red-500'}`}>
        {passed ? '✓ Aprobado (≥70%)' : '✗ Suspendido (<70%)'}
      </p>
    </div>
  )
}
