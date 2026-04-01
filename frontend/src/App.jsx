import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import ExamSelection from './components/ExamSelection'

const EXAM_NAMES = {
  ai_practitioner: 'AI Practitioner',
  ml_engineer_associate: 'ML Engineer',
}

function NavBar() {
  const location = useLocation()
  const [examLabel, setExamLabel] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('selectedExam')
    setExamLabel(id ? (EXAM_NAMES[id] ?? '') : '')
  }, [location])

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(13, 17, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: '#21262D',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{
              background: 'linear-gradient(135deg, #FF9900 0%, #e07b00 100%)',
              boxShadow: '0 0 12px rgba(255,153,0,0.4)',
              color: '#0D1117',
            }}
          >
            <Zap size={14} fill="currentColor" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold" style={{ color: '#E6EDF3' }}>AWS Quiz</span>
            {examLabel && (
              <span className="text-[10px]" style={{ color: '#8B949E' }}>{examLabel}</span>
            )}
          </div>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {[
            { to: '/', end: true, icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/quiz', end: false, icon: BookOpen, label: 'Quiz' },
          ].map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-brand-500'
                    : 'text-aws-muted hover:text-[#E6EDF3]'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: 'rgba(255,153,0,0.1)' }
                  : {}
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col" style={{ background: '#0D1117' }}>
        <NavBar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exam-selection" element={<ExamSelection />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer
          className="text-center text-xs py-4 border-t"
          style={{ color: '#444c56', borderColor: '#21262D' }}
        >
          AWS AI Practitioner Quiz — Estudio local
        </footer>
      </div>
    </BrowserRouter>
  )
}
