export default function ProgressBar({ value, className = '', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, value))
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#FF9900' : '#ef4444'

  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1" style={{ color: '#8B949E' }}>
          <span>Progreso</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
