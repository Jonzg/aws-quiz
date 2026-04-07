import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
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
  const logoRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    const id = localStorage.getItem('selectedExam')
    setExamLabel(id ? (EXAM_NAMES[id] ?? '') : '')
  }, [location])

  useGSAP(() => {
    // Logo pulse on mount
    gsap.fromTo(logoRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )
    // Nav items stagger
    gsap.fromTo('.nav-item',
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
    )
  }, { scope: navRef })

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(8, 12, 16, 0.80)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(28,33,40,0.8)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,153,0,0.5) 50%, transparent 100%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <motion.div
            ref={logoRef}
            className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FF9900 0%, #e07b00 100%)',
              boxShadow: '0 0 16px rgba(255,153,0,0.4), 0 2px 4px rgba(0,0,0,0.4)',
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Zap size={14} fill="#080C10" color="#080C10" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span
              className="text-sm font-bold tracking-tight"
              style={{ color: '#E6EDF3' }}
            >
              AWS Quiz
            </span>
            {examLabel ? (
              <motion.span
                key={examLabel}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-medium"
                style={{ color: '#FF9900' }}
              >
                {examLabel}
              </motion.span>
            ) : (
              <span className="text-[10px]" style={{ color: '#6E7681' }}>Certificaciones</span>
            )}
          </div>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1 relative">
          {[
            { to: '/', end: true, icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/quiz', end: false, icon: BookOpen, label: 'Quiz' },
          ].map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="nav-item"
            >
              {({ isActive }) => (
                <motion.div
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{
                    color: isActive ? '#FF9900' : '#6E7681',
                    background: isActive ? 'rgba(255,153,0,0.08)' : 'transparent',
                  }}
                  whileHover={{ color: '#E6EDF3', background: 'rgba(255,255,255,0.05)' }}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg -z-10"
                      style={{ background: 'rgba(255,153,0,0.08)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

function PageWrapper({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col" style={{ background: '#080C10' }}>
        {/* Ambient background blobs */}
        <div
          className="ambient-blob"
          style={{
            width: 600,
            height: 400,
            top: '-10%',
            left: '-10%',
            background: 'rgba(255,153,0,0.04)',
            animationDelay: '0s',
          }}
        />
        <div
          className="ambient-blob"
          style={{
            width: 500,
            height: 500,
            bottom: '5%',
            right: '-15%',
            background: 'rgba(59,130,246,0.04)',
            animationDelay: '-4s',
          }}
        />

        <NavBar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          <Routes>
            <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/exam-selection" element={<PageWrapper><ExamSelection /></PageWrapper>} />
            <Route path="/quiz" element={<PageWrapper><Quiz /></PageWrapper>} />
            <Route path="/results" element={<PageWrapper><Results /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer
          className="text-center text-xs py-4 border-t"
          style={{
            color: '#30363D',
            borderColor: '#1C2128',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.05em',
          }}
        >
          AWS AI Practitioner Quiz · v2.0
        </footer>
      </div>
    </BrowserRouter>
  )
}
