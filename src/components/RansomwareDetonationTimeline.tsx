import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Skull,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Key,
  Radio,
  ArrowRight,
} from 'lucide-react'
import { sound } from '../utils/audio'

export interface DetonationTimelineProps {
  currentStage?: number // 0: INGRESS, 1: LATERAL SPREAD, 2: CIPHER LOCK
  onStageChange?: (stage: number) => void
  interactive?: boolean
  className?: string
}

export default function RansomwareDetonationTimeline({
  currentStage = 0,
  onStageChange,
  interactive = true,
  className = '',
}: DetonationTimelineProps) {
  const [activeStage, setActiveStage] = useState<number>(currentStage)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [scrambleKey, setScrambleKey] = useState<string>('0x7A94B12C98EF')
  const [entropyRate, setEntropyRate] = useState<number>(12.4)
  const [encryptedFileCount, setEncryptedFileCount] = useState<number>(0)

  useEffect(() => {
    setActiveStage(currentStage)
  }, [currentStage])

  // Random hex cipher scramble simulation during active playback or cipher lock
  useEffect(() => {
    const chars = '0123456789ABCDEF'
    const interval = setInterval(() => {
      if (activeStage === 2) {
        let hex = '0x'
        for (let i = 0; i < 16; i++) {
          hex += chars[Math.floor(Math.random() * chars.length)]
        }
        setScrambleKey(hex)
        setEntropyRate((prev) => +(Math.min(99.8, prev + 2.8)).toFixed(1))
        setEncryptedFileCount((prev) => Math.min(4829, prev + 185))
      } else if (activeStage === 1) {
        let hex = '0x'
        for (let i = 0; i < 12; i++) {
          hex += chars[Math.floor(Math.random() * chars.length)]
        }
        setScrambleKey(hex)
        setEntropyRate(48.2)
        setEncryptedFileCount(120)
      } else {
        setScrambleKey('0x000000000000')
        setEntropyRate(4.1)
        setEncryptedFileCount(0)
      }
    }, 120)

    return () => clearInterval(interval)
  }, [activeStage])

  // Auto playback ticker
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setActiveStage((prev) => {
        const next = (prev + 1) % 3
        if (onStageChange) onStageChange(next)
        sound.playBlip()
        return next
      })
    }, 3200)

    return () => clearInterval(timer)
  }, [isPlaying, onStageChange])

  const stages = [
    {
      id: 0,
      code: 'STAGE 01',
      name: 'INGRESS',
      subtitle: 'Spear-Phishing & Beacon Execution',
      mitre: 'T1566.001 / T1059.001',
      vector: 'Word Macro (.docm) ➔ PowerShell Hidden',
      c2Target: '185.22.14.89:443 (Sofia, BG)',
      statusText: activeStage >= 0 ? 'COMPROMISED' : 'STANDBY',
      icon: Zap,
    },
    {
      id: 1,
      code: 'STAGE 02',
      name: 'LATERAL SPREAD',
      subtitle: 'LSASS Dump & SMB Pivot',
      mitre: 'T1003 / T1021.002',
      vector: 'Mimikatz Kiwi ➔ CrackMapExec SMB 445',
      c2Target: 'DC-CORP-01 ➔ SRV-FILE-01',
      statusText: activeStage >= 1 ? 'PIVOT ACTIVE' : 'CONTAINED',
      icon: Cpu,
    },
    {
      id: 2,
      code: 'STAGE 03',
      name: 'CIPHER LOCK',
      subtitle: 'Mass AES-256 Annihilation',
      mitre: 'T1486 (Data Encrypted)',
      vector: 'LockBit 3.0 Binary ➔ Shadow VSS Wiped',
      c2Target: '4,829 Files (.locked) // 15 BTC',
      statusText: activeStage >= 2 ? 'CRITICAL LOCK' : 'PENDING',
      icon: Skull,
    },
  ]

  const handleSelectStage = (index: number) => {
    sound.playClick()
    setActiveStage(index)
    if (onStageChange) onStageChange(index)
  }

  const togglePlay = () => {
    const next = !isPlaying
    setIsPlaying(next)
    if (next) sound.playLaser()
    else sound.playClick()
  }

  const handleReset = () => {
    sound.playClick()
    setIsPlaying(false)
    setActiveStage(0)
    if (onStageChange) onStageChange(0)
  }

  return (
    <div className={`bg-white border border-[#E3E8E6] rounded-2xl shadow-[0_2px_8px_-2px_rgba(21,23,26,0.04),0_1px_2px_rgba(21,23,26,0.02)] p-6 sm:p-8 font-sans select-none relative ${className}`}>
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3E8E6] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F6F1] border border-[#BCE6D7] text-[#0D9B6E]">
            <Radio size={13} className="animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Ransomware Progress Pipeline
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs text-[#6B7280]">
            Anatomie d'une attaque en 3 phases critiques
          </span>
        </div>

        {/* Playback action buttons */}
        {interactive && (
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all active:translate-y-[1px] ${
                isPlaying
                  ? 'bg-[#E04B3A] text-white shadow-[0_2px_8px_rgba(224,75,58,0.25)]'
                  : 'bg-[#E04B3A] hover:bg-[#D63A2F] text-white shadow-[0_2px_8px_rgba(224,75,58,0.25)] hover:shadow-[0_4px_14px_rgba(224,75,58,0.35)]'
              }`}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-white" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Simuler Détonation'}</span>
            </button>

            <button
              onClick={handleReset}
              title="Réinitialiser la timeline"
              className="p-2.5 rounded-xl bg-white text-[#6B7280] hover:text-[#15171A] hover:bg-[#EDF2F1] border border-[#E3E8E6] transition active:translate-y-[1px] shadow-[0_1px_2px_rgba(21,23,26,0.03)]"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Ransomware Progress Pipeline: Connected White Floating Pill Cards */}
      <div className="relative mb-6">
        {/* Connector Line behind cards */}
        <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-[#EDF2F1] z-0">
          <div
            className="h-full bg-[#0D9B6E] transition-all duration-500 ease-out"
            style={{ width: `${(activeStage / 2) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {stages.map((st, idx) => {
            const isSelected = activeStage === idx
            const isPast = activeStage > idx
            const Icon = st.icon

            return (
              <div
                key={st.id}
                onClick={() => interactive && handleSelectStage(idx)}
                className={`p-6 rounded-2xl border transition-all duration-200 relative cursor-pointer group ${
                  isSelected
                    ? 'bg-white border-2 border-[#0D9B6E] shadow-[0_0_0_1px_#0D9B6E,0_12px_28px_-4px_rgba(13,155,110,0.22)]'
                    : isPast
                    ? 'bg-white border-[#E3E8E6] hover:border-[#BCE6D7] shadow-[0_2px_8px_-2px_rgba(21,23,26,0.04)]'
                    : 'bg-[#F2F6F5] border-[#E3E8E6] hover:bg-white hover:border-[#BCE6D7]'
                }`}
              >
                {/* Top Node Pill & Status Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#0D9B6E] text-white'
                          : isPast
                          ? 'bg-[#15171A] text-white'
                          : 'bg-[#EDF2F1] text-[#6B7280]'
                      }`}
                    >
                      0{idx + 1}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                      {st.code}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-[#E8F6F1] text-[#0D9B6E] border-[#BCE6D7]'
                        : isPast
                        ? 'bg-[#EDF2F1] text-[#15171A] border-[#E3E8E6]'
                        : 'bg-white text-[#6B7280] border-[#E3E8E6]'
                    }`}
                  >
                    {st.statusText}
                  </span>
                </div>

                {/* Stage Title */}
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected
                        ? 'bg-[#E8F6F1] text-[#0D9B6E]'
                        : 'bg-[#EDF2F1] text-[#15171A]'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <h4 className="font-bold text-base text-[#15171A] tracking-[-0.02em]">
                    {st.name}
                  </h4>
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                  {st.subtitle}
                </p>

                {/* Technical Footprint in Secondary Surface */}
                <div className="p-3.5 rounded-xl bg-[#EDF2F1] border border-[#E3E8E6] text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#6B7280]">TTP MITRE :</span>
                    <span className="font-mono font-semibold text-[#15171A]">{st.mitre}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#6B7280]">Vecteur :</span>
                    <span className="font-mono font-medium truncate max-w-[150px] text-[#15171A]">
                      {st.vector}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scramble Entropy & Attack Metrics Bar */}
      <div className="bg-[#EDF2F1] border border-[#E3E8E6] rounded-2xl p-5 text-xs flex flex-wrap items-center justify-between gap-4">
        {/* Scramble Entropy Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#15171A] font-semibold text-xs">
            <Key size={14} className={activeStage === 2 ? 'text-[#E04B3A] animate-pulse' : 'text-[#0D9B6E]'} />
            <span>Chiffrement Symétrique :</span>
          </div>

          <div
            className={`px-3 py-1 rounded-full font-mono text-xs font-bold border tabular-nums ${
              activeStage === 2
                ? 'bg-[#FDF1EF] border-[#FACDC7] text-[#E04B3A]'
                : activeStage === 1
                ? 'bg-[#E8F6F1] border-[#BCE6D7] text-[#0D9B6E]'
                : 'bg-white border-[#E3E8E6] text-[#6B7280]'
            }`}
          >
            {activeStage === 2 ? `[LOCK: ${scrambleKey}]` : `[PLAINTEXT: ${scrambleKey}]`}
          </div>
        </div>

        {/* Live Attack Metrics Counters */}
        <div className="flex items-center gap-4 text-xs tabular-nums">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6B7280] font-medium">Fichiers Chiffrés :</span>
            <span className={`font-mono font-bold ${activeStage === 2 ? 'text-[#E04B3A]' : 'text-[#15171A]'}`}>
              {encryptedFileCount.toLocaleString()} / 4 829
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6B7280] font-medium">Entropie Disque :</span>
            <span className={`font-mono font-bold ${entropyRate > 80 ? 'text-[#E04B3A]' : 'text-[#15171A]'}`}>
              {entropyRate}%
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[#6B7280] font-medium">Rançon :</span>
            <span className="font-mono font-bold text-[#D97706]">15.00 BTC (~980 000 €)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
