import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../store/GameContext'
import { MAILS, VBA_MACRO_CODE } from '../../data/mock'
import { sound } from '../../utils/audio'
import {
  Mail,
  Search,
  Paperclip,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Send,
  Trash2,
  Archive,
  Inbox,
  Clock,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Fingerprint,
  Calendar,
  Users,
  CheckSquare,
  HardDrive,
  Eye,
  Zap,
} from 'lucide-react'

export default function OutlookClient({
  onAction,
  autoPlay,
}: {
  onAction: (text: string, suggested?: number, patch?: Parameters<ReturnType<typeof useGame>['update']>[0]) => void
  autoPlay?: boolean
}) {
  const g = useGame()
  const [openMailId, setOpenMailId] = useState('m1')
  const [headersOpen, setHeadersOpen] = useState(false)
  const [wordModalOpen, setWordModalOpen] = useState(false)
  const [showVba, setShowVba] = useState(false)

  // Auto execution effect when in cinematic mode
  useEffect(() => {
    if (!autoPlay) return
    setOpenMailId('m1')
    const t1 = setTimeout(() => {
      setHeadersOpen(true)
      sound.playBlip()
    }, 1500)
    const t2 = setTimeout(() => {
      setWordModalOpen(true)
      sound.playClick()
    }, 3200)
    const t3 = setTimeout(() => {
      setWordModalOpen(false)
      sound.playAlarm()
      onAction('Macro activée dans Word : charge PowerShell lancée en arrière-plan', undefined, {
        macroExecuted: true,
      })
    }, 6000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [autoPlay])

  const activeMail = MAILS.find((m) => m.id === openMailId) ?? MAILS[0]

  return (
    <div className="rounded-2xl border border-offsec-red/30 bg-[#0d0f17] shadow-2xl overflow-hidden text-slate-200 select-none">
      {/* Barre supérieure Microsoft 365 / Outlook Desktop */}
      <div className="bg-[#0078d4] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-3">
          {/* Lanceur d'applications Microsoft 365 (9 points) */}
          <div className="grid grid-cols-3 gap-0.5 w-4 h-4 cursor-pointer hover:opacity-80">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="w-1 h-1 bg-white rounded-full" />
            ))}
          </div>
          <span className="font-bold text-sm tracking-tight flex items-center gap-1.5">
            <Mail size={16} /> Outlook 365 <span className="text-[10px] font-mono opacity-80">· Enterprise</span>
          </span>
        </div>

        {/* Barre de recherche Outlook */}
        <div className="flex-1 max-w-md mx-4 hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/25 focus-within:bg-white focus-within:text-slate-900 transition px-3 py-1 rounded-md text-xs">
          <Search size={14} className="opacity-70" />
          <input
            placeholder="Rechercher dans tous les dossiers (Ctrl+E)"
            className="bg-transparent outline-none w-full placeholder:text-white/70 focus:placeholder:text-slate-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 bg-black/30 rounded text-[11px]">sophie.rh@meridian-groupe.fr</span>
          <span className="w-7 h-7 rounded-full bg-white text-[#0078d4] font-black flex items-center justify-center text-xs">
            SR
          </span>
        </div>
      </div>

      {/* Ruban Outlook Action Ribbon */}
      <div className="bg-[#121622] border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center gap-1 text-xs">
        <button className="px-3 py-1 bg-[#0078d4] text-white rounded font-semibold flex items-center gap-1.5 hover:bg-[#106ebe] transition">
          <Mail size={13} /> Nouveau courrier
        </button>
        <span className="w-px h-5 bg-slate-800 mx-1" />
        <button
          onClick={() => {
            sound.playClick()
            onAction('Signalement du courriel au SOC via le bouton Outlook Phishing Report', 2)
          }}
          className="px-2.5 py-1 rounded hover:bg-white/10 text-offsec-red font-bold flex items-center gap-1 border border-offsec-red/40 bg-red-950/30"
        >
          <ShieldAlert size={14} /> Signaler Hameçonnage (PhishAlarm)
        </button>
        <button
          onClick={() => {
            sound.playClick()
            onAction('HOST_01 isolé du réseau (EDR / déconnexion filaire)', 3, {
              isolated: { ...g.isolated, HOST_01: true },
            })
          }}
          className="px-2.5 py-1 rounded hover:bg-white/10 text-offsec-cyan font-bold flex items-center gap-1"
        >
          <Zap size={14} /> Isoler la machine (+3)
        </button>
        <button
          onClick={() => setHeadersOpen(!headersOpen)}
          className="px-2.5 py-1 rounded hover:bg-white/10 text-slate-300 flex items-center gap-1 font-mono text-[11px]"
        >
          <Fingerprint size={13} /> {headersOpen ? 'Masquer RFC822' : 'En-têtes RFC822'}
        </button>
      </div>

      {/* Disposition principale : Volet dossiers, Liste messages, Volet de lecture */}
      <div className="flex flex-col md:flex-row min-h-[460px]">
        {/* Volet de gauche (Rail icônes + Arborescence des dossiers) */}
        <div className="w-full md:w-56 bg-[#0a0c13] border-r border-slate-800 p-2 flex flex-col gap-2">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2">Favoris & Boîtes</div>
          <nav className="space-y-0.5 text-xs">
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1a2030] text-white font-bold">
              <span className="flex items-center gap-2">
                <Inbox size={14} className="text-[#0078d4]" /> Boîte de réception
              </span>
              <span className="text-[10px] font-mono font-black text-white px-1.5 py-0.2 rounded-full bg-[#0078d4]">
                1
              </span>
            </button>
            <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
              <Send size={14} /> Éléments envoyés
            </button>
            <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
              <Archive size={14} /> Brouillons
            </button>
            <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
              <Trash2 size={14} /> Éléments supprimés
            </button>
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
              <span className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-offsec-amber" /> Courrier indésirable
              </span>
            </button>
          </nav>

          <div className="mt-auto p-2 bg-black/60 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400">
            <div className="text-slate-500 font-bold">POSTE DE TRAVAIL</div>
            <div>Hôte : HOST_01</div>
            <div>User : sophie.rh</div>
            <div>IP : 10.0.10.15</div>
          </div>
        </div>

        {/* Liste des courriels */}
        <div className="w-full md:w-72 bg-[#0d0f17] border-r border-slate-800 divide-y divide-slate-800/60 overflow-y-auto max-h-[500px]">
          <div className="p-2.5 bg-[#0a0c13] text-[11px] font-bold text-slate-400 flex items-center justify-between">
            <span>Aujourd'hui</span>
            <span className="text-[10px] text-slate-500 font-mono">Trier par date ▾</span>
          </div>

          {MAILS.filter((m) => (m.minScenario ?? 0) <= g.scenario).map((m) => {
            const isSelected = openMailId === m.id
            return (
              <button
                key={m.id}
                onClick={() => {
                  sound.playClick()
                  setOpenMailId(m.id)
                }}
                className={`w-full text-left p-3 transition relative flex gap-2.5 ${
                  isSelected ? 'bg-[#141824]' : 'hover:bg-white/5'
                }`}
              >
                {/* Barre bleue non-lu à gauche */}
                <div
                  className={`w-1 self-stretch rounded-full ${
                    m.phishing && !g.macroExecuted ? 'bg-[#0078d4]' : 'bg-transparent'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                    <b className={`truncate max-w-[130px] ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {m.fromName ?? m.from}
                    </b>
                    <span className="mono text-[10px]">{m.time}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-100 truncate">{m.subject}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5 opacity-80">{m.body.slice(0, 45)}...</div>
                  {m.attachment && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-offsec-amber font-bold">
                      <Paperclip size={11} /> {m.attachment}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Volet de lecture du message sélectionné */}
        <div className="flex-1 bg-[#090b12] p-5 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[500px]">
          {/* En-tête de message officiel */}
          <div className="border-b border-slate-800 pb-3 space-y-2">
            <h2 className="text-base font-extrabold text-white">{activeMail.subject}</h2>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-amber-600 text-white font-black flex items-center justify-center text-xs font-mono shadow">
                  {(activeMail.fromName ?? 'IT').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span>{activeMail.fromName ?? activeMail.from}</span>
                    <span className="text-slate-400 font-mono text-[11px]">&lt;{activeMail.from}&gt;</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    À : Sophie Renaud &lt;sophie.rh@meridian-groupe.fr&gt; · {activeMail.time}
                  </div>
                </div>
              </div>

              {activeMail.phishing && (
                <span className="px-2 py-1 rounded bg-amber-950/80 border border-amber-500 text-amber-300 text-[10px] font-mono font-black">
                  [ HAMEÇONNAGE SUSPECT ]
                </span>
              )}
            </div>
          </div>

          {/* En-têtes RFC822 détaillées */}
          {headersOpen && activeMail.headers && (
            <div className="p-3.5 rounded-xl bg-black border border-offsec-red/40 text-xs font-mono space-y-1 text-slate-300">
              <div className="text-[10px] text-offsec-red font-bold uppercase tracking-wider mb-1">
                EN-TÊTES DE TRANSPORT RFC 822 :
              </div>
              <div>Return-Path: {activeMail.headers.returnPath}</div>
              <div>
                SPF: <span className="text-offsec-red font-bold font-mono">{activeMail.headers.spf}</span>
              </div>
              <div>
                DKIM: <span className="text-offsec-amber font-bold font-mono">{activeMail.headers.dkim}</span>
              </div>
              <div>
                DMARC: <span className="text-offsec-red font-bold font-mono">{activeMail.headers.dmarc}</span>
              </div>
              <div>IP Source: {activeMail.headers.clientIp}</div>
              <div className="p-2 bg-red-950/80 rounded border border-offsec-red text-red-200 text-[11px] font-bold mt-2">
                ⚠️ {activeMail.headers.typosquattingAlert}
              </div>
            </div>
          )}

          {/* Corps de l'email */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
            {activeMail.body}
          </div>

          {/* Bloc pièce jointe Word interactive */}
          {activeMail.attachment && (
            <div className="p-3.5 rounded-xl bg-black/80 border border-amber-500/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#2b579a] text-white font-black font-mono text-xs shadow">
                  DOCM
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Paperclip size={14} /> {activeMail.attachment}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Document Word avec macros · {activeMail.attachmentSize}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWordModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center gap-1.5"
                >
                  <Eye size={13} /> Ouvrir dans Microsoft Word
                </button>
                {!g.macroExecuted ? (
                  <button
                    onClick={() => {
                      sound.playAlarm()
                      onAction('Macro activée sur HOST_01 : charge PowerShell silencieuse, machine ralentie', undefined, {
                        macroExecuted: true,
                      })
                    }}
                    className="px-3 py-1.5 rounded-lg bg-offsec-amber text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-1 shadow-md"
                  >
                    <Zap size={13} /> Activer le contenu
                  </button>
                ) : (
                  <span className="text-xs font-mono font-bold text-offsec-red flex items-center gap-1">
                    <AlertTriangle size={13} /> CHARGE EXÉCUTÉE
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Pied de page avec actions officielles */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400 text-[10px]">MERIDIAN WORKPLACE SECURITY AGENT · CONNECTÉ</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAction('Signalement immédiat au SOC et support IT', 2)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                🚨 Signaler au SOC (+2)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Authentique Microsoft Word */}
      {wordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-slate-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col text-slate-100">
            {/* Barre de titre Word */}
            <div className="bg-[#2b579a] text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <FileText size={15} />
                <span>Mise_a_jour_compte_RH.docm - Microsoft Word</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setWordModalOpen(false)} className="hover:opacity-80">
                  ✕
                </button>
              </div>
            </div>

            {/* Ruban Word Fichier, Accueil... */}
            <div className="bg-[#252526] border-b border-slate-700 px-4 py-1 flex gap-3 text-[11px] text-slate-300">
              <span className="bg-[#2b579a] px-2 py-0.5 rounded text-white font-bold">Fichier</span>
              <span className="font-semibold text-white">Accueil</span>
              <span>Insertion</span>
              <span>Conception</span>
              <span>Mise en page</span>
              <span>Références</span>
              <span>Affichage</span>
            </div>

            {/* Le bandeau jaune de sécurité officiel Microsoft */}
            <div className="bg-[#fff4ce] text-[#323130] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[#fed95b]">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                <span>AVERTISSEMENT DE SÉCURITÉ : Les macros ont été désactivées.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVba(!showVba)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-800 hover:bg-slate-100 font-mono"
                >
                  {showVba ? 'Masquer VBA' : 'Inspecter Code VBA'}
                </button>
                <button
                  onClick={() => {
                    setWordModalOpen(false)
                    sound.playAlarm()
                    onAction('Macro activée dans Word : charge PowerShell lancée en arrière-plan', undefined, {
                      macroExecuted: true,
                    })
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-black shadow"
                >
                  Activer le contenu
                </button>
              </div>
            </div>

            {/* Page Word */}
            <div className="p-6 bg-[#2d2d2d] flex-1 min-h-[300px] flex items-center justify-center overflow-y-auto">
              {showVba ? (
                <div className="w-full bg-black p-4 rounded-xl border border-offsec-red/40 font-mono text-xs space-y-2">
                  <div className="text-offsec-cyan font-bold">Microsoft Visual Basic for Applications — Module1 :</div>
                  <pre className="text-emerald-400 overflow-x-auto text-[11px] p-2">{VBA_MACRO_CODE}</pre>
                </div>
              ) : (
                <div className="bg-white text-slate-900 p-8 rounded-lg shadow-xl max-w-lg w-full space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2b579a] flex items-center justify-center mx-auto text-xl font-bold">
                    M
                  </div>
                  <h3 className="text-base font-black text-slate-900 uppercase">Groupe Meridian · Portail RH & IT</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ce document sécurisé nécessite l’activation des composants interactifs. Veuillez cliquer sur{' '}
                    <b>« Activer le contenu »</b> dans le bandeau supérieur pour mettre à jour vos droits d’accès réseau.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setWordModalOpen(false)
                        sound.playAlarm()
                        onAction('Macro activée dans Word : charge PowerShell lancée en arrière-plan', undefined, {
                          macroExecuted: true,
                        })
                      }}
                      className="px-4 py-2 bg-[#2b579a] text-white rounded-lg text-xs font-bold hover:bg-[#1f3f70]"
                    >
                      Valider la mise à jour (Exécuter)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#1e1e1e] border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setWordModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white"
              >
                Fermer le document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
