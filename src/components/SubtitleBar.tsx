import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Mic, Settings2, Check, RotateCcw } from 'lucide-react'
import { narrator, VoiceOption } from '../utils/voice'
import { sound } from '../utils/audio'

export default function SubtitleBar() {
  const [subtitle, setSubtitle] = useState<string>('')
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(narrator.isMuted())
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [voices, setVoices] = useState<VoiceOption[]>([])
  const [currentVoiceName, setCurrentVoiceName] = useState<string>(narrator.getCurrentVoiceName())
  const [speechRate, setSpeechRate] = useState<number>(narrator.getSpeechRate())

  useEffect(() => {
    const unsubSub = narrator.subscribeSubtitles((text, speaking) => {
      setSubtitle(text)
      setIsSpeaking(speaking)
    })

    const unsubMute = narrator.subscribe((muted) => setIsMuted(muted))

    const unsubVoices = narrator.subscribeVoices((list) => {
      setVoices(list)
      setCurrentVoiceName(narrator.getCurrentVoiceName())
    })

    return () => {
      unsubSub()
      unsubMute()
      unsubVoices()
    }
  }, [])

  const handleToggleMute = () => {
    const next = narrator.toggleMute()
    setIsMuted(next)
    sound.playClick()
  }

  const handleReplay = () => {
    sound.playClick()
    if (subtitle) {
      narrator.speak(subtitle)
    }
  }

  const handleSelectVoice = (name: string) => {
    narrator.setVoiceByName(name)
    setCurrentVoiceName(name)
    sound.playClick()
    narrator.speak("Bonjour, voici la voix configurée pour la présentation du scénario cyber.")
  }

  const handleRateChange = (newRate: number) => {
    narrator.setSpeechRate(newRate)
    setSpeechRate(newRate)
    sound.playClick()
  }

  return (
    <div className="relative z-40">
      {/* Barre de sous-titrage fixe élégante en bas (Blanc & Bleu Ciel) */}
      <AnimatePresence>
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="w-full bg-white/98 border-t border-slate-200/90 text-slate-900 shadow-floating backdrop-blur-xl px-5 py-3.5 transition-all"
          >
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Indicateur d'élocution & Voix */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isSpeaking
                      ? 'bg-sky-100 border-sky-400 text-sky-700 shadow-sm animate-pulse'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  <Mic size={18} />
                </div>

                {/* Texte des sous-titres grand format et net */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                      NARRATION PÉDAGOGIQUE
                    </span>
                    {isSpeaking && (
                      <span className="flex gap-0.5 items-end h-3.5">
                        <span className="w-1 bg-sky-500 h-2 animate-bounce"></span>
                        <span className="w-1 bg-sky-600 h-3.5 animate-bounce [animation-delay:0.15s]"></span>
                        <span className="w-1 bg-sky-400 h-2 animate-bounce [animation-delay:0.3s]"></span>
                      </span>
                    )}
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug select-text font-sans">
                    « {subtitle} »
                  </p>
                </div>
              </div>

              {/* Contrôles rapides Présentateur */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleReplay}
                  title="Réécouter la réplique"
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-sky-700 border border-slate-300 text-xs font-bold flex items-center gap-2 transition shadow-sm"
                >
                  <RotateCcw size={14} />
                  <span className="hidden md:inline font-sans">Répéter</span>
                </button>

                <button
                  onClick={handleToggleMute}
                  title={isMuted ? 'Activer la voix' : 'Couper la voix'}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition shadow-sm ${
                    !isMuted
                      ? 'bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100'
                      : 'bg-white border-slate-300 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {!isMuted ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  <span className="hidden md:inline font-sans">{isMuted ? 'Voix coupée' : 'Voix active'}</span>
                </button>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="Réglages de la voix"
                  className={`p-2 rounded-xl border transition shadow-sm ${
                    showSettings
                      ? 'bg-sky-600 text-white border-sky-600 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-sky-700'
                  }`}
                >
                  <Settings2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panneau de réglages de la voix (Blanc & Bleu Ciel) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed bottom-20 right-5 z-50 w-84 rounded-2xl bg-white border border-slate-200 shadow-floating p-5 text-xs font-sans text-slate-800 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="font-extrabold text-slate-900 flex items-center gap-2 font-sans text-sm">
                <Settings2 size={16} className="text-sky-600" />
                Studio Voix de Présentation
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            {/* Vitesse d'élocution */}
            <div className="space-y-2 mb-4">
              <span className="text-slate-600 font-bold">Cadence de parole :</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '0.8× (Posé)', rate: 0.8 },
                  { label: '0.9× (Idéal)', rate: 0.9 },
                  { label: '1.0× (Standard)', rate: 1.0 },
                ].map((item) => (
                  <button
                    key={item.rate}
                    onClick={() => handleRateChange(item.rate)}
                    className={`px-2 py-2 rounded-xl border font-bold text-xs transition ${
                      Math.abs(speechRate - item.rate) < 0.05
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 border-sky-500 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Choix de la voix */}
            <div className="space-y-2">
              <span className="text-slate-600 font-bold">Voix française disponible :</span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {voices.length === 0 ? (
                  <div className="p-2 text-slate-400 italic text-center">
                    Voix système par défaut
                  </div>
                ) : (
                  voices.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => handleSelectVoice(v.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition ${
                        currentVoiceName === v.name
                          ? 'bg-sky-50 border-sky-400 text-sky-800 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate">{v.displayName}</span>
                      {currentVoiceName === v.name && (
                        <Check size={14} className="text-sky-600 shrink-0 ml-1.5" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
              💡 Les voix étiquetées ⭐ sont des voix neuronales haute fidélité pour une diction naturelle.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
