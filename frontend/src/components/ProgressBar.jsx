export default function ProgressBar({ value, className = '', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, value))
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#FF9900' : '#ef4444'

  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          <span>Progreso</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--border-2)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 8px ${color}50`,
          }}
        >
          {/* Shimmer effect on progress bar */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
      </div>
    </div>
  )
}
