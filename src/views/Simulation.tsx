import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../store/GameContext'
import { SCENARIOS } from '../data/mock'
import { Card, CardHeader, Badge, Btn, ConfirmModal, RansomwareSimulatorModal } from '../components/ui'
import AttackTheater from '../components/AttackTheater'
import CinematicDirector from '../components/CinematicDirector'
import OutlookClient from '../components/tools/OutlookClient'
import SplunkConsole from '../components/tools/SplunkConsole'
import TopologyRadar from '../components/tools/TopologyRadar'
import WindowsExplorer from '../components/tools/WindowsExplorer'
import EntraIdPortal from '../components/tools/EntraIdPortal'
import VeeamConsole from '../components/tools/VeeamConsole'
import CrisisCenter from '../components/tools/CrisisCenter'
import { sound } from '../utils/audio'
import {
  Mail,
  ShieldAlert,
  Server,
  KeyRound,
  Database,
  MessagesSquare,
  Network,
  Radio,
  Lock,
  Play,
  Film,
} from 'lucide-react'

type Tab = 'mail' | 'soc' | 'topology' | 'server' | 'accounts' | 'backup' | 'crisis'
const MIN_SC: Record<Tab, number> = { mail: 0, soc: 1, topology: 1, server: 2, accounts: 2, backup: 2, crisis: 3 }

export default function Simulation() {
  const g = useGame()
  const [tab, setTab] = useState<Tab>('mail')
  const [team] = useState(g.teams[0]?.name ?? 'Équipe Alpha (SOC / Blue Team)')
  const [confirm, setConfirm] = useState<null | {
    title: string
    body: string
    label: string
    danger?: boolean
    run: () => void
  }>(null)

  // Mode Cinématique Automatique (Sans Défilement / Zero-Scroll Auto Director)
  const [cinematicActive, setCinematicActive] = useState(false)

  const locked = (t: Tab) => g.scenario < MIN_SC[t]

  const act = (text: string, suggested?: number, patch?: Parameters<typeof g.update>[0]) => {
    g.log(text, team, suggested)
    if (suggested && suggested > 0) sound.playSuccess()
    else if (suggested && suggested < 0) sound.playError()
    else sound.playClick()

    if (patch) g.update(patch)
  }

  const startCinematic = () => {
    sound.playSuccess()
    setCinematicActive(true)
  }

  // =========================================================================
  // SI LE MODE CINÉMATIQUE AUTOMATIQUE EST ACTIF :
  // AFFICHE LE DIRECTEUR PLEIN ÉCRAN SANS SCROLL (BRIEFING ➔ OUTIL RÉEL ➔ BRIEFING ➔ ...)
  // =========================================================================
  if (cinematicActive) {
    return (
      <>
        <CinematicDirector
          onClose={() => {
            sound.playClick()
            setCinematicActive(false)
          }}
          onAction={act}
          onOpenLockscreen={() => g.update({ lockscreenOpen: true })}
        />

        <RansomwareSimulatorModal
          open={g.lockscreenOpen}
          onClose={() => g.update({ lockscreenOpen: false })}
        />
      </>
    )
  }

  // =========================================================================
  // MODE MANUEL STANDARD : CONSOLE COMPLÈTE AVEC BARRE LATÉRALE ET NAVIGATION
  // =========================================================================
  const unread = {
    mail: !g.macroExecuted && g.scenario >= 1 ? 1 : 0,
    soc: g.scenario >= 2 && !g.c2Blocked ? 2 : 0,
    crisis: (g.scenario >= 3 && !g.directorCallAnswered) || (g.scenario >= 4 && !g.commValidated) ? 1 : 0,
  }

  const tabs: { id: Tab; label: string; short: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'mail', label: 'Webmail Outlook 365', short: 'Mail', icon: <Mail size={16} />, badge: unread.mail },
    { id: 'soc', label: 'SIEM / EDR Console', short: 'SOC', icon: <ShieldAlert size={16} />, badge: unread.soc },
    { id: 'topology', label: 'Radar Topologie Réseau', short: 'Réseau', icon: <Network size={16} /> },
    { id: 'server', label: 'Serveur de Fichiers & Crise', short: 'Serveur', icon: <Server size={16} /> },
    { id: 'accounts', label: 'Identités Entra ID & MFA', short: 'IAM', icon: <KeyRound size={16} /> },
    { id: 'backup', label: 'Sauvegardes Veeam Air-Gap', short: 'Backup', icon: <Database size={16} /> },
    { id: 'crisis', label: 'Hotline DG & Communication', short: 'Crise', icon: <MessagesSquare size={16} />, badge: unread.crisis },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-[#06070a] text-slate-100">
      {/* Barre latérale gauche — Console d'infrastructure OffSec Style */}
      <aside className="w-full md:w-64 shrink-0 bg-[#0a0c13] border-r border-offsec-red/25 p-3.5 flex flex-col gap-1.5">
        <div className="px-3.5 py-3 rounded-2xl bg-gradient-to-br from-[#121522] to-[#0a0c13] border border-offsec-red/30 mb-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="offsec-tag text-offsec-red text-[11px] font-black">
              [ OFFSEC // CYBER DEFENSE ]
            </span>
            <span className="w-2 h-2 rounded-full bg-offsec-red animate-ping" />
          </div>
          <div className="mono text-[11px] text-slate-400 mt-1">Tenant : meridian-corp.eu</div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 mt-2">
            <Radio size={12} className="text-offsec-red animate-pulse" /> SÉVÉRITÉ :{' '}
            <span
              className={
                g.scenario >= 3
                  ? 'text-offsec-red font-black'
                  : g.scenario >= 1
                  ? 'text-offsec-amber'
                  : 'text-offsec-cyan'
              }
            >
              {g.scenario >= 3 ? 'P1 CRITIQUE' : g.scenario >= 1 ? 'P2 ALERTE' : 'NOMINALE'}
            </span>
          </div>
        </div>

        {/* Bouton Proéminent : DÉMO AUTO CINÉMATIQUE SANS SCROLL */}
        <button
          onClick={startCinematic}
          className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-offsec-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-mono font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-offsec-red/30 transition transform hover:-translate-y-0.5"
        >
          <Film size={15} /> DÉMO AUTO (SANS SCROLL) ➔
        </button>

        <div className="text-[10px] font-mono font-black text-slate-500 px-3 uppercase tracking-wider mb-1">
          CONSOLE OPÉRATIONS
        </div>
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              disabled={locked(t.id)}
              onClick={() => {
                sound.playClick()
                setTab(t.id)
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left relative ${
                tab === t.id
                  ? 'bg-offsec-red/20 text-white border border-offsec-red shadow-lg shadow-offsec-red/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              } ${locked(t.id) ? 'opacity-35 cursor-not-allowed hover:bg-transparent' : ''}`}
            >
              <span className={tab === t.id ? 'text-offsec-red' : 'text-slate-500'}>{t.icon}</span>
              <span className="flex-1 truncate">{t.label}</span>
              {locked(t.id) ? (
                <Lock size={12} className="text-slate-600 shrink-0" />
              ) : t.badge ? (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-offsec-red text-white text-[10px] font-black flex items-center justify-center alert-pulse-offsec">
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Statut de session en bas */}
        <div className="mt-auto pt-4 border-t border-slate-800/80 px-2 space-y-2 text-[11px] font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Blue Team :</span>
            <b className="text-offsec-cyan truncate max-w-[120px]">{team}</b>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Cadence :</span>
            <b className="text-offsec-amber">EXERCICE 30M</b>
          </div>
        </div>
      </aside>

      {/* Contenu principal de la console */}
      <main className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto space-y-5 overflow-y-auto">
        {/* LE THÉÂTRE VISUEL D'ATTAQUE (Kill Chain interactive) */}
        <AttackTheater
          autoRunning={false}
          autoSpeed={1}
          onStartAuto={startCinematic}
          onStopAuto={() => {}}
          onSkipStep={() => {}}
          onSetSpeed={() => {}}
        />

        {/* 1. MODULE WEBMAIL OUTLOOK 365 RÉALISTE */}
        {tab === 'mail' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <OutlookClient onAction={act} />
          </motion.div>
        )}

        {/* 2. MODULE SIEM SPLUNK & SENTINELONE EDR RÉALISTE */}
        {tab === 'soc' && !locked('soc') && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <SplunkConsole onAction={act} />
          </motion.div>
        )}

        {/* 3. MODULE RADAR TOPOLOGIE RÉSEAU AVEC ANIMATION DE PAQUETS SVG */}
        {tab === 'topology' && !locked('topology') && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TopologyRadar onAction={act} />
          </motion.div>
        )}

        {/* 4. MODULE SERVEUR DE FICHIERS & EXPLORATEUR WINDOWS 2022 AVEC LOCKBIT 3.0 */}
        {tab === 'server' && !locked('server') && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <WindowsExplorer
              onAction={act}
              onOpenLockscreen={() => g.update({ lockscreenOpen: true })}
            />
          </motion.div>
        )}

        {/* 5. MODULE IDENTITÉS MICROSOFT ENTRA ID & DÉTECTION MFA FATIGUE */}
        {tab === 'accounts' && !locked('accounts') && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <EntraIdPortal onAction={act} />
          </motion.div>
        )}

        {/* 6. MODULE SAUVEGARDES IMMUABLES VEEAM BACKUP AIR-GAP */}
        {tab === 'backup' && !locked('backup') && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <VeeamConsole onAction={act} />
          </motion.div>
        )}

        {/* 7. MODULE HOTLINE DG INTERACTIVE & FUITE WHATSAPP */}
        {tab === 'crisis' && !locked('crisis') && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <CrisisCenter onAction={act} />
          </motion.div>
        )}
      </main>

      {/* Modals globales */}
      <ConfirmModal
        open={!!confirm}
        title={confirm?.title ?? ''}
        body={confirm?.body ?? ''}
        confirmLabel={confirm?.label ?? 'Confirmer'}
        danger={confirm?.danger ?? true}
        onConfirm={() => {
          confirm?.run()
          setConfirm(null)
        }}
        onCancel={() => setConfirm(null)}
      />

      <RansomwareSimulatorModal
        open={g.lockscreenOpen}
        onClose={() => g.update({ lockscreenOpen: false })}
      />
    </div>
  )
}
