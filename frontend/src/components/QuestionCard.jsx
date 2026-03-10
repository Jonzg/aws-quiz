import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'

const LABELS = ['A', 'B', 'C', 'D', 'E']

export default function QuestionCard({
  question,
  selected,
  revealed,
  correctAnswer,
  explanation,
  onSelect,
}) {
  if (!question) return null

  const getOptionClass = (option) => {
    if (!revealed) {
      return 'option-btn'
    }
    if (option === correctAnswer) {
      return 'option-btn option-correct'
    }
    if (option === selected && option !== correctAnswer) {
      return 'option-btn option-wrong'
    }
    return 'option-btn opacity-60'
  }

  const getIcon = (option) => {
    if (!revealed) return null
    if (option === correctAnswer) return <CheckCircle size={18} className="text-green-600 shrink-0" />
    if (option === selected && option !== correctAnswer) return <XCircle size={18} className="text-red-600 shrink-0" />
    return null
  }

  const difficultyBadge = {
    basico: 'badge-basico',
    intermedio: 'badge-intermedio',
    avanzado: 'badge-avanzado',
  }[question.difficulty] || 'badge'

  return (
    <div className="card space-y-5 animate-slide-up">
      {/* Question header */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-lg font-semibold text-gray-800 leading-relaxed flex-1">
          {question.question}
        </p>
        <span className={difficultyBadge}>{question.difficulty}</span>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => onSelect(option)}
            disabled={revealed}
            className={`${getOptionClass(option)} flex items-center gap-3`}
          >
            <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
              {LABELS[i]}
            </span>
            <span className="flex-1">{option}</span>
            {getIcon(option)}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {revealed && (
        <div className="animate-slide-up">
          {/* Result banner */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold ${
            selected === correctAnswer
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {selected === correctAnswer
              ? <><CheckCircle size={20} /> ¡Correcto!</>
              : <><XCircle size={20} /> Incorrecto — La respuesta era: <strong>{correctAnswer}</strong></>
            }
          </div>

          {/* Explanation */}
          {explanation && (
            <div className="mt-3 flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Lightbulb size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">{explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
