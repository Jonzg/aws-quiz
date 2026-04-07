import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'

gsap.registerPlugin(useGSAP)

const LABELS = ['A', 'B', 'C', 'D', 'E']

const DIFFICULTY_STYLES = {
  basico:     { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.35)',  color: '#93c5fd', label: 'Básico' },
  intermedio: { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.35)',  color: '#fcd34d', label: 'Intermedio' },
  avanzado:   { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.35)',   color: '#fca5a5', label: 'Avanzado' },
}

export default function QuestionCard({
  question,
  selected,
  revealed,
  correctAnswer,
  explanation,
  onSelect,
}) {
  if (!question) return null

  const containerRef = useRef(null)
  const optionRefs = useRef([])
  const feedbackRef = useRef(null)
  const explanationRef = useRef(null)

  const diff = DIFFICULTY_STYLES[question.difficulty] || DIFFICULTY_STYLES.intermedio
  const isCorrect = selected === correctAnswer
  const correctIndex = question.options.indexOf(correctAnswer)
  const correctLabel = correctIndex >= 0 ? LABELS[correctIndex] : '?'

  // Entry: card fade+slide in, options stagger
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    tl.from(containerRef.current, { opacity: 0, y: 14, duration: 0.25 })
    tl.from(
      optionRefs.current.filter(Boolean),
      { opacity: 0, x: -10, stagger: 0.05, duration: 0.18 },
      '-=0.08'
    )
  }, { scope: containerRef, dependencies: [question.id], revertOnUpdate: true })

  // Reveal: correct bounce, wrong shake, feedback slides in
  useGSAP(() => {
    if (!revealed) return

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    // Correct answer: scale bounce
    const correctEl = optionRefs.current[correctIndex]
    if (correctEl) {
      tl.to(correctEl, { scale: 1.025, duration: 0.12 })
        .to(correctEl, { scale: 1, duration: 0.22, ease: 'back.out(2)' })
    }

    // Wrong answer: horizontal shake
    if (selected !== correctAnswer) {
      const selectedIdx = question.options.indexOf(selected)
      const wrongEl = optionRefs.current[selectedIdx]
      if (wrongEl) {
        tl.to(wrongEl, { x: -6, duration: 0.07 }, '<')
          .to(wrongEl, { x: 6, duration: 0.07 })
          .to(wrongEl, { x: -4, duration: 0.07 })
          .to(wrongEl, { x: 0, duration: 0.07, ease: 'power1.out' })
      }
    }

    // Feedback banner slides in
    if (feedbackRef.current) {
      tl.from(feedbackRef.current, { opacity: 0, x: -12, duration: 0.2 }, '-=0.1')
    }
    if (explanationRef.current) {
      tl.from(explanationRef.current, { opacity: 0, x: -12, duration: 0.2 }, '-=0.06')
    }
  }, { scope: containerRef, dependencies: [revealed] })

  const getOptionState = (option) => {
    if (!revealed) return 'idle'
    if (option === correctAnswer) return 'correct'
    if (option === selected) return 'wrong'
    return 'faded'
  }

  const optionStyles = {
    idle:    { bg: 'var(--surface-2)',          border: 'var(--border-2)',           color: 'var(--text)',  labelBg: 'rgba(255,255,255,0.05)', labelColor: 'var(--muted)' },
    correct: { bg: 'rgba(16,185,129,0.08)',     border: 'rgba(16,185,129,0.6)',      color: '#6ee7b7',      labelBg: 'rgba(16,185,129,0.2)',   labelColor: '#6ee7b7' },
    wrong:   { bg: 'rgba(239,68,68,0.08)',      border: 'rgba(239,68,68,0.6)',       color: '#fca5a5',      labelBg: 'rgba(239,68,68,0.2)',    labelColor: '#fca5a5' },
    faded:   { bg: 'rgba(0,0,0,0.2)',           border: 'var(--border)',             color: '#30363D',      labelBg: 'rgba(255,255,255,0.02)', labelColor: '#30363D' },
  }

  return (
    <div ref={containerRef} className="card space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <p
          className="text-sm font-medium leading-relaxed flex-1"
          style={{ color: '#E6EDF3', lineHeight: '1.7' }}
        >
          {question.question}
        </p>
        <div
          className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: diff.bg,
            border: `1px solid ${diff.border}`,
            color: diff.color,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.04em',
          }}
        >
          {diff.label}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option, i) => {
          const state = getOptionState(option)
          const s = optionStyles[state]

          return (
            <button
              key={i}
              ref={el => { optionRefs.current[i] = el }}
              onClick={() => onSelect(option)}
              disabled={revealed}
              className="w-full text-left rounded-xl font-medium text-sm disabled:cursor-not-allowed flex items-center gap-3 px-4 py-3.5 group/opt"
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                color: s.color,
                transition: 'background 0.18s, border-color 0.18s, color 0.18s, box-shadow 0.18s',
                boxShadow: state === 'correct' ? '0 0 12px rgba(16,185,129,0.1)' : state === 'wrong' ? '0 0 12px rgba(239,68,68,0.1)' : 'none',
              }}
              onMouseEnter={e => {
                if (!revealed) {
                  e.currentTarget.style.borderColor = 'rgba(255,153,0,0.4)'
                  e.currentTarget.style.background = 'rgba(255,153,0,0.05)'
                }
              }}
              onMouseLeave={e => {
                if (!revealed) {
                  e.currentTarget.style.borderColor = s.border
                  e.currentTarget.style.background = s.bg
                }
              }}
            >
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: s.labelBg,
                  color: s.labelColor,
                  fontFamily: 'JetBrains Mono, monospace',
                  transition: 'all 0.18s',
                }}
              >
                {LABELS[i]}
              </span>

              <span className="flex-1 text-left">{option}</span>

              {revealed && state === 'correct' && (
                <CheckCircle size={15} className="shrink-0" style={{ color: '#10b981' }} />
              )}
              {revealed && state === 'wrong' && (
                <XCircle size={15} className="shrink-0" style={{ color: '#ef4444' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {revealed && (
        <div className="space-y-3">
          <div
            ref={feedbackRef}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold"
            style={
              isCorrect
                ? {
                    background: 'rgba(16,185,129,0.08)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(16,185,129,0.2)',
                    boxShadow: '0 0 16px rgba(16,185,129,0.08)',
                  }
                : {
                    background: 'rgba(239,68,68,0.08)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239,68,68,0.2)',
                    boxShadow: '0 0 16px rgba(239,68,68,0.08)',
                  }
            }
          >
            {isCorrect
              ? <><CheckCircle size={15} /> ¡Correcto!</>
              : <><XCircle size={15} /> Incorrecto — Correcta: <strong
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >{correctLabel}</strong></>
            }
          </div>

          {explanation && (
            <div
              ref={explanationRef}
              className="flex gap-3 rounded-xl p-4 text-sm leading-relaxed"
              style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.15)',
                color: '#93c5fd',
              }}
            >
              <Lightbulb size={15} className="shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
              <p style={{ lineHeight: '1.7' }}>{explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
