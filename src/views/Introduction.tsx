import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  ArrowRight,
  Shield,
  Sparkles,
  Swords,
  Radio,
  FileCheck,
} from 'lucide-react'
import { sound } from '../utils/audio'
import { narrator } from '../utils/voice'

export default function Introduction() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Video playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
      sound.playClick()
    } else {
      videoRef.current.play()
      setIsPlaying(true)
      sound.playLaser()
    }
  }

  const handleRestart = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setIsPlaying(true)
    sound.playClick()
  }

  const handleFullscreen = () => {
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
    sound.playClick()
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration || 0)
    }
  }

  const formatSecs = (sec: number) => {
    if (isNaN(sec) || sec === 0) return '00:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleLaunchSimulation = () => {
    sound.playLaser()
    narrator.speak(
      "Démarrage de la simulation interactive. Découvrons le déroulement offensif sous le capot."
    )
    navigate('/hacker')
  }

  return (
    <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans select-none space-y-10">
      {/* ========================================================================= */}
      {/* 1. WELCOME HERO SECTION : PURE WIZ.IO CLARITY                            */}
      {/* ========================================================================= */}
      <section className="text-center max-w-4xl mx-auto space-y-4 pt-2 pb-2">
        {/* Top Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[#BE185D] text-xs font-semibold tracking-wide uppercase shadow-xs">
            <Sparkles size={14} className="text-[#BE185D]" />
            <span>Simulation Officielle Cyber-Crisis</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E0E7FF] text-xs font-semibold text-[#717783] shadow-xs">
            <Radio size={13} className="text-[#0254EC] animate-pulse" />
            <span>Scénario : Sophie RH (Patient Zéro)</span>
          </div>
        </div>

        {/* Display Headline */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#393F49]">
            Welcome to the Cybersecurity Crisis Simulation
          </h2>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#0254EC]">
            Phishing Attacks & Ransomware Simulation
          </h1>
        </div>

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg text-[#717783] font-normal leading-relaxed max-w-2xl mx-auto pt-1">
          Découvrez en immersion complète l’anatomie d’une cyberattaque moderne : du piège initial par courriel piégé jusqu’à la détonation du rançongiciel et à la riposte de crise coordonnée.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN VIDEO PLAYER SECTION : introduction_video.mp4                     */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-[#E0E7FF] shadow-[0_12px_40px_-6px_rgba(2,84,236,0.08)] overflow-hidden transition-all max-w-6xl mx-auto">
        {/* Chassis Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#E0E7FF] flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-white via-[#F8F4FF] to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#EFF5FF] border border-[#C7DBFE] flex items-center justify-center text-[#0254EC] shadow-xs">
              <Shield size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0254EC] animate-ping" />
                <h3 className="text-base sm:text-lg font-bold text-[#393F49] tracking-tight">
                  Introduction Video : Anatomie de l'Attaque
                </h3>
              </div>
              <p className="text-xs text-[#717783]">
                Briefing vidéo officiel · Comprendre la chaîne d'infection et la réponse à incident
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[#BE185D]">
              Vidéo d'Introduction
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EFF5FF] border border-[#C7DBFE] text-[#0254EC]">
              HD 1080p
            </span>
          </div>
        </div>

        {/* Video Frame */}
        <div className="relative aspect-video bg-[#0F172A] flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/introduction_video.mp4"
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            playsInline
          />

          {/* Big Visual Play Overlay when paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-[#0F172A]/55 backdrop-blur-[3px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#0F172A]/45 group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0254EC] text-white flex items-center justify-center shadow-[0_12px_32px_rgba(2,84,236,0.45)] transform group-hover:scale-110 active:scale-95 transition-all border-2 border-white/20">
                <Play size={36} className="fill-white ml-1.5" />
              </div>
              <div className="mt-4 text-center px-4">
                <div className="font-bold text-white text-lg sm:text-2xl tracking-tight drop-shadow-sm">
                  Lancer la Vidéo d'Introduction
                </div>
                <div className="text-xs sm:text-sm text-slate-300 mt-1">
                  Cliquez pour démarrer la lecture du briefing vidéo
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Playback Controls Bar with Secondary Surface Background */}
        <div className="bg-[#F8F4FF] px-6 py-4 border-t border-[#E0E7FF] flex items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="px-5 py-2.5 rounded-full bg-[#0254EC] hover:bg-[#0043C7] text-white font-semibold transition shadow-sm active:translate-y-[1px] flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause size={14} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={14} className="fill-white" />
                  <span>Lecture</span>
                </>
              )}
            </button>

            <button
              onClick={handleRestart}
              title="Recommencer la vidéo"
              className="p-2.5 rounded-full bg-white hover:bg-[#EFF5FF] text-[#393F49] hover:text-[#0254EC] transition border border-[#E0E7FF] shadow-sm active:translate-y-[1px]"
            >
              <RotateCcw size={15} />
            </button>

            <button
              onClick={toggleMute}
              title={isMuted ? 'Activer le son' : 'Couper le son'}
              className="p-2.5 rounded-full bg-white hover:bg-[#EFF5FF] text-[#393F49] hover:text-[#0254EC] transition border border-[#E0E7FF] shadow-sm active:translate-y-[1px]"
            >
              {isMuted ? <VolumeX size={15} className="text-[#BE185D]" /> : <Volume2 size={15} />}
            </button>

            <div className="font-mono text-xs text-[#393F49] font-semibold tabular-nums ml-2">
              {formatSecs(currentTime)} / {formatSecs(duration)}
            </div>
          </div>

          {/* Scrubbable Timeline Track */}
          <div className="flex-1 mx-4">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const pos = (e.clientX - rect.left) / rect.width
                if (videoRef.current && duration) {
                  videoRef.current.currentTime = pos * duration
                }
              }}
              className="w-full bg-[#E0E7FF] h-2.5 rounded-full cursor-pointer relative overflow-hidden"
            >
              <div
                className="bg-[#0254EC] h-full transition-all rounded-full"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleFullscreen}
            title="Plein Écran"
            className="p-2.5 rounded-full bg-white hover:bg-[#EFF5FF] text-[#717783] hover:text-[#0254EC] transition border border-[#E0E7FF] shadow-sm active:translate-y-[1px]"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CALL TO ACTIONS : ADVANCE TO SIMULATION                                */}
      {/* ========================================================================= */}
      <section className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={handleLaunchSimulation}
          className="px-8 py-4 rounded-full bg-[#0254EC] hover:bg-[#0043C7] text-white font-semibold text-sm sm:text-base tracking-wide shadow-[0_4px_16px_rgba(2,84,236,0.25)] flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-[1px]"
        >
          <span>Démarrer la Simulation : 02. Vue Attaquant</span>
          <ArrowRight size={18} />
        </button>

        <Link
          to="/confrontation"
          onClick={() => sound.playLaser()}
          className="px-7 py-4 rounded-full bg-white hover:bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF] font-semibold text-sm sm:text-base tracking-wide shadow-sm flex items-center gap-2.5 active:translate-y-[1px] transition-all"
        >
          <Swords size={18} className="text-[#0254EC]" />
          <span>Confrontation Attaque vs Défense</span>
        </Link>

        <Link
          to="/quiz"
          onClick={() => sound.playClick()}
          className="px-6 py-4 rounded-full bg-white hover:bg-[#F5F0FF] text-[#717783] hover:text-[#0254EC] border border-[#E0E7FF] font-semibold text-sm tracking-wide shadow-sm flex items-center gap-2.5 active:translate-y-[1px] transition-all"
        >
          <FileCheck size={18} className="text-[#BE185D]" />
          <span>Accéder au Quiz & Certificat</span>
        </Link>
      </section>
    </div>
  )
}

