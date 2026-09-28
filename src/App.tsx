import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { GameProvider, useGame } from './store/GameContext'
import { INCIDENT_REF } from './data/mock'
import Introduction from './views/Introduction'
import HackerSimulation from './views/HackerSimulation'
import EnterpriseEnvironment from './views/EnterpriseEnvironment'
import NonTechAwareness from './views/NonTechAwareness'
import CyberRangeLab from './views/CyberRangeLab'
import AudienceQuiz from './views/AudienceQuiz'
import DualAttackDefenseSimulation from './views/DualAttackDefenseSimulation'
import { sound } from './utils/audio'
import {
  Terminal,
  Building2,
  HelpCircle,
  Volume2,
  VolumeX,
  Film,
  Radio,
  Swords,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

/** Sleek Enterprise Vector Brand Mark */
function BrandLogo() {
  return (
    <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 drop-shadow-[0_2px_8px_rgba(2,84,236,0.25)] group-hover:scale-105 transition-transform duration-200"
      >
        <defs>
          <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0254EC" />
            <stop offset="100%" stopColor="#0B3CB0" />
          </linearGradient>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
          <linearGradient id="pinkPill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB6D9" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>
        </defs>
        {/* Rounded Container */}
        <rect width="44" height="44" rx="14" fill="url(#brandGrad)" />
        {/* Layered Cyber Shield Geometry */}
        <path
          d="M22 8L33 13.5V21.5C33 27.8 28.3 33.6 22 35.1C15.7 33.6 11 27.8 11 21.5V13.5L22 8Z"
          stroke="white"
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
        <path
          d="M22 11.5L29.5 15.2V21.5C29.5 25.8 26.5 29.8 22 31C17.5 29.8 14.5 25.8 14.5 21.5V15.2L22 11.5Z"
          fill="url(#shieldGrad)"
        />
        <path
          d="M22 15L26 17.5V21.5C26 23.8 24.3 26 22 26.8C19.7 26 18 23.8 18 21.5V17.5L22 15Z"
          fill="#0254EC"
        />
        {/* Central Core Pulse */}
        <circle cx="22" cy="21.5" r="2.2" fill="url(#pinkPill)" />
        {/* Signal Radar Dot */}
        <circle cx="33" cy="11" r="2.5" fill="#BE185D" />
        <circle cx="33" cy="11" r="4.5" stroke="#FFB6D9" strokeWidth="0.8" strokeOpacity="0.7" />
      </svg>
    </div>
  )
}

function TopBar({ isAudienceMode }: { isAudienceMode?: boolean }) {
  const loc = useLocation()
  const g = useGame()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { to: '/', label: '01. Sophie RH', shortLabel: '01. Sophie RH', icon: <Film size={15} /> },
    { to: '/hacker', label: '02. Vue Attaquant', shortLabel: '02. Attaque', icon: <Terminal size={15} /> },
    { to: '/enterprise', label: '03. Vue Défense', shortLabel: '03. Défense', icon: <Building2 size={15} /> },
    { to: '/confrontation', label: '04. Confrontation Attaque vs Défense', shortLabel: '04. Confrontation', icon: <Swords size={15} /> },
    { to: '/quiz', label: 'Quiz', shortLabel: 'Quiz', icon: <HelpCircle size={15} /> },
  ]

  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Audience Mode: restricted header, NO navigation links away from quiz
  if (isAudienceMode) {
    return (
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-[#E0E7FF] shadow-xs font-sans">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 max-w-[1680px] mx-auto">
          <div className="flex items-center gap-3 select-none min-w-0">
            <BrandLogo />
            <div className="leading-tight min-w-0">
              <span className="font-extrabold text-sm sm:text-base tracking-[-0.02em] text-[#393F49] block truncate">
                TACTICAL INCIDENT LAB
              </span>
              <span className="text-[11px] text-[#717783] block truncate font-medium">
                Exercice Phishing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Session Quiz</span>
            </span>

            <button
              onClick={g.toggleSound}
              title={g.soundMuted ? 'Activer le son' : 'Couper le son'}
              className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-[#F5F0FF] border border-[#E0E7FF] text-[#717783] hover:text-[#0254EC] transition shadow-xs active:translate-y-[1px]"
            >
              {g.soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-[#0254EC]" />}
            </button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-[#E0E7FF] shadow-xs font-sans">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 max-w-[1680px] mx-auto">
        {/* Brand & Logo Section */}
        <Link
          to="/"
          onClick={() => {
            sound.playClick()
            closeMobileMenu()
          }}
          className="flex items-center gap-3 group select-none min-w-0"
        >
          <BrandLogo />

          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-[-0.02em] text-[#393F49] group-hover:text-[#0254EC] transition-colors truncate">
                TACTICAL INCIDENT LAB
              </span>
            </div>
            <span className="text-[11px] text-[#717783] block truncate font-medium">
              Exercice Phishing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Ribbon (Hidden on Tablet / Mobile) */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#F5F0FF] p-1.5 rounded-full border border-[#E0E7FF] shadow-xs">
          {navItems.map((item) => {
            const isActive = loc.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => sound.playClick()}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0254EC] text-white shadow-[0_2px_8px_rgba(2,84,236,0.25)]'
                    : 'text-[#717783] hover:text-[#393F49] hover:bg-white'
                }`}
              >
                {item.icon}
                <span className="whitespace-nowrap hidden 2xl:inline">{item.label}</span>
                <span className="whitespace-nowrap 2xl:hidden">{item.shortLabel}</span>
              </Link>
            )
          })}
        </nav>

        {/* Controls, Live Status & Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Live Incident Dossier Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4FF] border border-[#E0E7FF] text-xs">
            <Radio size={13} className="text-[#0254EC] animate-pulse" />
            <span className="text-[#717783] font-medium">Dossier :</span>
            <span className="font-bold text-[#393F49] font-mono">{INCIDENT_REF}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={g.toggleSound}
            title={g.soundMuted ? 'Activer le son' : 'Couper le son'}
            className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-[#F5F0FF] border border-[#E0E7FF] text-[#717783] hover:text-[#0254EC] transition shadow-xs active:translate-y-[1px]"
          >
            {g.soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-[#0254EC]" />}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 sm:p-2.5 rounded-full bg-white hover:bg-[#F5F0FF] border border-[#E0E7FF] text-[#393F49] hover:text-[#0254EC] transition shadow-xs"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Collapsible Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#E0E7FF] px-4 py-4 space-y-2.5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Dossier status in mobile */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#F8F4FF] border border-[#E0E7FF] text-xs mb-3">
            <div className="flex items-center gap-2">
              <Radio size={13} className="text-[#0254EC] animate-pulse" />
              <span className="text-[#717783] font-medium">Dossier actif :</span>
            </div>
            <span className="font-bold text-[#393F49] font-mono">{INCIDENT_REF}</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const isActive = loc.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    sound.playClick()
                    closeMobileMenu()
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#0254EC] text-white shadow-sm font-bold'
                      : 'bg-[#F8F4FF] text-[#393F49] hover:bg-[#F0F5FF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-[#0254EC]'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={14} className={isActive ? 'text-white' : 'text-[#717783]'} />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

function AppLayout() {
  const loc = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(loc.search)

  const isAudienceParam = searchParams.get('mode') === 'audience' || searchParams.has('audience')

  useEffect(() => {
    if (isAudienceParam) {
      sessionStorage.setItem('audience_mode', 'true')
    }
  }, [isAudienceParam])

  const isAudienceSession = sessionStorage.getItem('audience_mode') === 'true' || isAudienceParam

  // Restrict audience members to the quiz page
  useEffect(() => {
    if (isAudienceSession && loc.pathname !== '/quiz') {
      navigate('/quiz?mode=audience', { replace: true })
    }
  }, [isAudienceSession, loc.pathname, navigate])

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#393F49] flex flex-col justify-between selection:bg-[#0254EC]/15 selection:text-[#0254EC]">
      <div>
        <TopBar isAudienceMode={isAudienceSession} />
        <main className="relative z-10 pb-12">
          <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/hacker" element={<HackerSimulation />} />
            <Route path="/enterprise" element={<EnterpriseEnvironment />} />
            <Route path="/confrontation" element={<DualAttackDefenseSimulation />} />
            <Route path="/attack-defense" element={<DualAttackDefenseSimulation />} />
            <Route path="/lab" element={<CyberRangeLab />} />
            <Route path="/range" element={<CyberRangeLab />} />
            <Route path="/awareness" element={<NonTechAwareness />} />
            <Route path="/non-it" element={<NonTechAwareness />} />
            <Route path="/quiz" element={<AudienceQuiz />} />
            {/* Redirections de compatibilité */}
            <Route path="/simulation" element={<EnterpriseEnvironment />} />
            <Route path="/trainer" element={<AudienceQuiz />} />
          </Routes>
        </main>
      </div>

      {/* Clean Modern Footer - Hidden in audience mode for maximum focus */}
      {!isAudienceSession && (
        <footer className="border-t border-[#E0E7FF] bg-white text-center text-xs text-[#717783] py-5 relative z-10 shadow-[0_1px_3px_rgba(2,84,236,0.02)]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0254EC]"></span>
              <span className="font-bold text-[#393F49] tracking-[-0.01em]">TACTICAL INCIDENT LAB</span>
              <span className="text-[#E0E7FF]">|</span>
              <span>Environnement Forensique & Démonstration de Crise</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3.5 py-1 rounded-full bg-[#F5F0FF] border border-[#E0E7FF] text-[#0254EC] font-semibold">
                Exercice Phishing
              </span>
              <span className="text-[#717783]">Build 3.2.0 · Édition Entreprise</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </GameProvider>
  )
}
