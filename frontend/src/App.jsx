import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Trophy } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Quiz from './pages/Quiz'
import Results from './pages/Results'

function NavBar() {
  const base = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200'
  const active = 'bg-aws-orange text-white'
  const inactive = 'text-gray-300 hover:bg-white/10 hover:text-white'

  return (
    <nav className="bg-aws-dark text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-aws-orange rounded-lg flex items-center justify-center font-bold text-white text-sm">
            AWS
          </div>
          <div>
            <p className="font-bold text-white leading-none">AI Practitioner</p>
            <p className="text-xs text-gray-400 leading-none">Quiz App</p>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/quiz" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
            <BookOpen size={16} /> Quiz
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
        <footer className="bg-aws-dark text-gray-400 text-center text-xs py-4">
          AWS AI Practitioner Quiz App — Estudio local
        </footer>
      </div>
    </BrowserRouter>
  )
}
