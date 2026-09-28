import React, { useState, useEffect } from 'react'
import { useGame } from '../../store/GameContext'
import { WHATSAPP, DIRECTOR_CALL, VALIDATED_MESSAGE } from '../../data/mock'
import { sound } from '../../utils/audio'
import {
  MessagesSquare,
  PhoneCall,
  Phone,
  PhoneOff,
  Copy,
  Check,
  Send,
  Radio,
  AlertTriangle,
  User,
  ShieldAlert,
  Mic,
  Volume2,
} from 'lucide-react'

export default function CrisisCenter({
  onAction,
  autoPlay,
}: {
  onAction: (text: string, suggested?: number, patch?: Parameters<ReturnType<typeof useGame>['update']>[0]) => void
  autoPlay?: boolean
}) {
  const g = useGame()
  const [copied, setCopied] = useState(false)
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [callActive, setCallActive] = useState(false)
  const [callAnswered, setCallAnswered] = useState(false)
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)

  const triggerCall = () => {
    sound.playPhoneRing()
    setCallModalOpen(true)
    setCallActive(false)
    setCallAnswered(false)
  }

  const acceptCall = () => {
    sound.playClick()
    setCallActive(true)
  }

  useEffect(() => {
    if (!autoPlay) return
    const t1 = setTimeout(() => triggerCall(), 1500)
    const t2 = setTimeout(() => acceptCall(), 3800)
    const t3 = setTimeout(() => {
      setSelectedResponse('opt1')
      setCallAnswered(true)
      g.update({ directorCallAnswered: true, directorCallReaction: DIRECTOR_CALL.options[0].dgReaction })
      onAction('Décision DG : Gouvernance collégiale & cellule de crise immédiate', 2)
      sound.playSuccess()
    }, 6500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [autoPlay])

  return (
    <div className="rounded-2xl border border-offsec-red/30 bg-[#0d0f17] shadow-2xl overflow-hidden text-slate-200 select-none">
      {/* Barre supérieure War Room de Crise */}
      <div className="bg-[#1f1416] border-b border-offsec-red/40 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-3 font-mono">
          <span className="p-1 rounded bg-offsec-red text-white font-black">CRISIS</span>
          <span className="font-bold text-sm text-white">WAR ROOM & CELLULE DE CRISE STRATÉGIQUE</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-offsec-amber font-bold flex items-center gap-1">
            <Radio size={12} className="animate-pulse" /> HOTLINE DIRECTEUR : EN ATTENTE D'ARBITRAGE
          </span>
        </div>
      </div>

      <div className="p-5 grid md:grid-cols-2 gap-5">
        {/* 1. SMARTPHONE WHATSAPP RÉALISTE */}
        <div className="rounded-3xl bg-[#0b141a] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col h-[460px]">
          {/* Header WhatsApp vert */}
          <div className="bg-[#202c33] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 font-black flex items-center justify-center text-xs font-mono">
                BM
              </div>
              <div>
                <div className="font-bold text-xs text-white">Bureau Meridian (42 collègues)</div>
                <div className="text-[10px] text-slate-400">Sophie, Léa, Thomas, Sara...</div>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-red-950/80 border border-offsec-red text-offsec-red font-mono font-bold">
              FUITE
            </span>
          </div>

          {/* Flux de messages WhatsApp */}
          <div className="p-3.5 space-y-2.5 flex-1 overflow-y-auto bg-[#0b141a] text-xs">
            {WHATSAPP.filter((w) => w.minScenario <= g.scenario).map((w, i) => (
              <div key={i} className="flex flex-col items-start space-y-0.5">
                <div className="p-2.5 rounded-2xl rounded-tl-none bg-[#202c33] text-slate-200 max-w-[85%] border border-slate-700/50 shadow">
                  <div className="text-[10px] font-bold text-emerald-400 mb-0.5">{w.author}</div>
                  <p className="text-xs leading-relaxed">{w.text}</p>
                  <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">{w.time} ✓✓</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sollicitation Journaliste */}
          {g.scenario >= 4 && (
            <div className="p-3 bg-red-950/60 border-t border-offsec-red text-xs space-y-1 font-mono">
              <div className="text-offsec-red font-black flex items-center gap-1">
                <AlertTriangle size={13} /> APPEL JOURNALISTE (LA VOIX ÉCO) :
              </div>
              <p className="text-slate-300 text-[11px]">
                « Confirmez-vous la cyberattaque ? Nous préparons la une de 11h. »
              </p>
            </div>
          )}
        </div>

        {/* 2. HOTLINE DG & COMMUNIQUÉ OFFICIEL */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Carte Téléphone DG */}
          <div className="p-4 rounded-2xl bg-black/80 border border-offsec-amber/60 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <PhoneCall size={16} className="text-offsec-amber" />
                <span className="font-bold text-xs text-white font-mono">HOTLINE DU DIRECTEUR GÉNÉRAL</span>
              </div>
              <button
                onClick={triggerCall}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono font-black text-xs rounded-lg flex items-center gap-1 shadow"
              >
                <Phone size={12} /> Faire Sonner l'Appel DG
              </button>
            </div>

            <p className="text-xs italic text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 font-sans">
              {DIRECTOR_CALL.opening}
            </p>

            {g.directorCallAnswered ? (
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-600 text-xs text-emerald-300 font-mono">
                <b>Arbitrage validé par le DG :</b> {g.directorCallReaction}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 font-mono">
                Cliquez sur « Faire Sonner l'Appel DG » pour vivre la conversation téléphonique interactive en direct.
              </div>
            )}
          </div>

          {/* Communiqué officiel validé */}
          <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-white font-mono">COMMUNIQUÉ OFFICIEL DE CRISE</span>
              {g.commValidated && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold border border-emerald-600 px-2 py-0.5 rounded">
                  DIFFUSÉ
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 italic bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
              « {VALIDATED_MESSAGE} »
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(VALIDATED_MESSAGE)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                  } catch {}
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1"
              >
                <Copy size={12} /> {copied ? 'Copié ✓' : 'Copier'}
              </button>
              {!g.commValidated && (
                <button
                  onClick={() =>
                    onAction('Communication de crise validée et diffusée (Direction + RSSI + Juridique)', 2, {
                      commValidated: true,
                    })
                  }
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold"
                >
                  Valider et Diffuser Officiellement (+2)
                </button>
              )}
              <button
                onClick={() => onAction('ERREUR : déclaration en solo au journaliste sans mandat', -3)}
                className="px-3 py-1.5 border border-offsec-red text-offsec-red hover:bg-red-950/40 rounded-lg text-xs font-mono font-bold"
              >
                Répondre en solo au journaliste (-3)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'Appel Téléphonique Entrant du DG */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-amber-500/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-lg shadow-amber-950">
              👨‍💼
            </div>

            <div>
              <h3 className="text-base font-black text-white font-mono">Monsieur Philippe V.</h3>
              <p className="text-xs text-amber-400 font-mono">Directeur Général — Groupe Meridian</p>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                {callActive ? 'Communication en cours · 00:24' : 'Appel Entrant Sécurisé...'}
              </div>
            </div>

            {/* Animation d'onde sonore quand en ligne */}
            {callActive && (
              <div className="flex items-center justify-center gap-1 h-8">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 bg-amber-400 rounded-full animate-pulse"
                    style={{ height: `${20 + (i % 4) * 8}px`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}

            {!callActive ? (
              <div className="flex items-center justify-center gap-6 pt-3">
                <button
                  onClick={() => setCallModalOpen(false)}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-950"
                  title="Refuser"
                >
                  <PhoneOff size={22} />
                </button>
                <button
                  onClick={acceptCall}
                  className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950 animate-bounce"
                  title="Décrocher"
                >
                  <Phone size={22} />
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-left font-mono text-xs">
                <div className="text-slate-400 text-[11px] font-bold">Votre arbitrage immédiat au téléphone :</div>
                {DIRECTOR_CALL.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sound.playClick()
                      setCallModalOpen(false)
                      g.update({ directorCallAnswered: true, directorCallReaction: opt.dgReaction })
                      onAction(`Décision Hotline DG : ${opt.label}`, opt.score)
                    }}
                    className="w-full text-left p-3 rounded-xl bg-black/80 hover:bg-slate-900 border border-slate-800 text-slate-200 transition font-sans text-xs"
                  >
                    {opt.label} ({opt.score > 0 ? `+${opt.score}` : opt.score} pts)
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
