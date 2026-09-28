import React, { useState, useEffect } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Clock,
  Activity,
  Lock,
  WifiOff,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { sound } from '../utils/audio'

interface LiveThreatStatusBannerProps {
  threatLevel?: 'nominal' | 'elevated' | 'critical' | 'contained'
  incidentRef?: string
  targetSystem?: string
  className?: string
  onQuickIsolate?: () => void
}

export default function LiveThreatStatusBanner({
  threatLevel = 'critical',
  incidentRef = 'INC-2026-0915-01',
  targetSystem = 'HOST_01 (10.0.10.15) ➔ \\\\FS-CORP-01',
  className = '',
  onQuickIsolate,
}: LiveThreatStatusBannerProps) {
  const [timeString, setTimeString] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const utc = now.toISOString().replace('T', ' ').substring(11, 23) + ' UTC'
      setTimeString(utc)
    }
    updateTime()
    const timer = setInterval(updateTime, 250)
    return () => clearInterval(timer)
  }, [])

  const config = {
    critical: {
      bgClass: 'bg-[#FEF2F2] border-[#DC2626]',
      stripeClass: 'hazard-pinstripes-red',
      badgeClass: 'bg-[#DC2626] text-white border-[#B91C1C]',
      textClass: 'text-[#DC2626]',
      defcon: 'DEFCON 2 // INCIDENT CRITIQUE EN COURS',
      icon: ShieldAlert,
      message: 'PROPAGATION RANÇONGICIEL DÉTECTÉE — CONFINEMENT RÉSEAU REQUIS',
    },
    elevated: {
      bgClass: 'bg-[#FFFBEB] border-[#D97706]',
      stripeClass: 'hazard-pinstripes-amber',
      badgeClass: 'bg-[#D97706] text-white border-[#B45309]',
      textClass: 'text-[#D97706]',
      defcon: 'DEFCON 3 // ACTIVITÉ SUSPECTE IDENTIFIÉE',
      icon: AlertTriangle,
      message: 'VECTEUR PHISHING ACTIF — LIAISON BALISE C2 SORTANTE',
    },
    contained: {
      bgClass: 'bg-[#ECFDF5] border-[#059669]',
      stripeClass: 'hazard-pinstripes-cobalt',
      badgeClass: 'bg-[#059669] text-white border-[#047857]',
      textClass: 'text-[#059669]',
      defcon: 'DEFCON 4 // PÉRIMÈTRE ISOLÉ',
      icon: ShieldCheck,
      message: 'MENACE ENDIGUÉE — EXCLUSION LOGIQUE DU POSTE VALIDÉE',
    },
    nominal: {
      bgClass: 'bg-[#F0F9FF] border-[#0284C7]',
      stripeClass: '',
      badgeClass: 'bg-[#0284C7] text-white border-[#0369A1]',
      textClass: 'text-[#0284C7]',
      defcon: 'DEFCON 5 // VEILLE STANDARD',
      icon: Activity,
      message: 'SUPERVISION ANOMALIES NOMINALE — SOC EN VEILLE CONTINUE',
    },
  }

  const current = config[threatLevel] || config.critical
  const Icon = current.icon

  return (
    <div
      className={`border rounded-[3px] shadow-tactile overflow-hidden font-sans select-none relative ${current.bgClass} ${current.stripeClass} ${className}`}
    >
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 backdrop-blur-[1px] bg-white/70">
        {/* Left: Tactical DEFCON & Incident Reference */}
        <div className="flex items-center gap-3">
          <div
            className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-black tracking-widest uppercase border shadow-xs ${current.badgeClass}`}
          >
            {current.defcon}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#090A0C]">
            <Radio size={12} className={`${current.textClass} animate-pulse`} />
            <span className="text-[#525866] font-bold">CAS:</span>
            <span className="font-extrabold">{incidentRef}</span>
          </div>
        </div>

        {/* Center: Live Alert Message */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] font-bold text-[#090A0C]">
          <Icon size={14} className={current.textClass} />
          <span>{current.message}</span>
        </div>

        {/* Right: Tabular UTC Timestamp & Target Metric */}
        <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums">
          <div className="hidden sm:flex items-center gap-1 text-[#525866]">
            <span className="text-[9px] uppercase font-bold text-[#8C93A0]">CIBLE :</span>
            <span className="font-semibold text-[#090A0C]">{targetSystem}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-white border border-[#E2E4E9] text-[#090A0C] font-bold">
            <Clock size={11} className="text-[#525866]" />
            <span>{timeString || '09:39:35 UTC'}</span>
          </div>

          {onQuickIsolate && (
            <button
              onClick={() => {
                sound.playSuccess()
                onQuickIsolate()
              }}
              className="px-2.5 py-1 rounded-[2px] bg-[#DC2626] text-white font-mono text-[10px] font-bold uppercase tracking-wider border border-[#B91C1C] hover:bg-[#B91C1C] transition active:translate-y-[1px]"
            >
              ISOLER L'HÔTE
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

