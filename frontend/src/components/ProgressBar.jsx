export default function ProgressBar({ value, className = '', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, value))
  const color = pct >= 70 ? '#28a745' : pct >= 40 ? '#FF9900' : '#dc3545'

  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progreso</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
