import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/GameContext'
import { sound } from '../utils/audio'
import { REFLEXES } from '../data/mock'
import OutlookClient from './tools/OutlookClient'
import SplunkConsole from './tools/SplunkConsole'
import TopologyRadar from './tools/TopologyRadar'
import WindowsExplorer from './tools/WindowsExplorer'
import CrisisCenter from './tools/CrisisCenter'
import VeeamConsole from './tools/VeeamConsole'
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  X,
  Radio,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Award,
  Terminal,
  Server,
  User,
  Skull,
  Lock,
} from 'lucide-react'

export interface CinematicStage {
  id: number
  time: string
  title: string
  targetTool: string
  ttp: string
  impact: number
  scenarioId: number
  briefing: string
  collaborateur: string
  hacker: string
  soc: string
  actionLabel: string
}

export const CINEMATIC_STAGES: CinematicStage[] = [
  {
    id: 1,
    time: '09h15',
    title: 'Hameçonnage Ciblé (Phishing RH) & Macro Word',
    targetTool: 'Microsoft Outlook 365 & Word',
    ttp: 'T1566.001 (Spearphishing Attachment)',
    impact: 25,
    scenarioId: 1,
    briefing:
      'Sophie (RH) reçoit un courriel urgent usurpant la direction. Le message la presse de valider son compte en ouvrant une pièce jointe Word contenant une macro VBA malveillante.',
    collaborateur:
      'Reçoit le courriel « Validation urgente compte RH ». Ouvre le fichier Word et clique sur le bandeau jaune « Activer le contenu » pour débloquer le formulaire.',
    hacker:
      'La macro VBA obfusquée s’exécute silencieusement en tâche de fond et lance une commande PowerShell encodée en Base64 sans ouvrir de fenêtre visible.',
    soc:
      'L’agent EDR enregistre un appel inhabituel de powershell.exe engendré par WINWORD.EXE et qualifie l’événement comme alerte prioritaire P2.',
    actionLabel: 'Ouverture du courriel, inspection en-têtes RFC822 et activation de la macro',
  },
  {
    id: 2,
    time: '09h20',
    title: 'Alerte EDR, Arbre de Processus & Canal C2',
    targetTool: 'Splunk SIEM Enterprise & SentinelOne EDR',
    ttp: 'T1059.001 (PowerShell) & T1071.001 (C2 Web Protocols)',
    impact: 55,
    scenarioId: 2,
    briefing:
      'La sonde EDR sonne en rouge vif. Le script PowerShell tente de joindre un serveur de Command & Control (C2) en Bulgarie pour télécharger la charge offensive LockBit.',
    collaborateur:
      'Le poste HOST_01 subit un ralentissement drastique. Sophie s’inquiète et prévient immédiatement le support informatique interne.',
    hacker:
      'La balise beacon.exe émet un signal heartbeat vers 185.22.14.89:443 et tente d’énumérer les privilèges du domaine Active Directory.',
    soc:
      'L’analyste SOC repère l’arbre de processus suspect (PID 7844 ➔ 8310) et déclenche l’action de confinement d’urgence pour isoler la machine du réseau.',
    actionLabel: 'Recherche SPL en direct, inspection d’arbre de processus et blocage C2',
  },
  {
    id: 3,
    time: '09h25',
    title: 'Propagation Latérale & Mouvement Réseau SMB',
    targetTool: 'Radar de Topologie Réseau (Flux Laser Temps Réel)',
    ttp: 'T1021.002 (SMB / Windows Admin Shares)',
    impact: 75,
    scenarioId: 2,
    briefing:
      'L’attaquant tente de rebondir sur le réseau d’entreprise via le port SMB 445 pour infecter les postes comptables voisins et cibler le serveur de fichiers FS-CORP-01.',
    collaborateur:
      'Les équipes du bureau constatent des déconnexions intermittentes et des blocages d’accès aux lecteurs réseau partagés.',
    hacker:
      'Tentative de propagation par rebond SMB vers HOST_02, HOST_03 et découverte du contrôleur de domaine DC-CORP-01.',
    soc:
      'Visualisation instantanée des flux laser anormaux sur le radar réseau. Isolement préventif des postes ciblés pour stopper la contamination.',
    actionLabel: 'Observation des faisceaux laser de paquets SMB et isolation des nœuds',
  },
  {
    id: 4,
    time: '09h40',
    title: 'Chiffrement Massif LockBit 3.0 & Demande de Rançon',
    targetTool: 'Windows Server 2022 & LockBit 3.0',
    ttp: 'T1486 (Data Encrypted for Impact)',
    impact: 98,
    scenarioId: 3,
    briefing:
      'L’attaque atteint son paroxysme : le rançongiciel LockBit 3.0 chiffre l’ensemble des répertoires métiers en .locked et dépose sa note d’extorsion réclamant 15 BTC.',
    collaborateur:
      'Constat de crise : tous les fichiers Word, Excel et bases de données affichent l’extension .locked et un cadenas d’inaccessibilité.',
    hacker:
      'Dépose la note .README_LOCKED_RESTORE.txt sur tous les partages et menace de divulguer les données confidentielles sur le darknet sous 48h.',
    soc:
      'Convocation d’urgence de la cellule de crise selon la doctrine DGSSI. Interdiction formelle et collégiale de payer la rançon et gel des preuves médico-légales (DFIR).',
    actionLabel: 'Constat des fichiers .locked, ouverture de la note LockBit et refus de paiement',
  },
  {
    id: 5,
    time: '09h45',
    title: 'Hotline de la Direction Générale & Fuite WhatsApp',
    targetTool: 'Hotline Téléphonique DG & Smartphone WhatsApp',
    ttp: 'Gouvernance de Crise & Relations Presse (ISO 27035)',
    impact: 80,
    scenarioId: 4,
    briefing:
      'Le Directeur Général appelle en direct sur la hotline de sécurité pour exiger un arbitrage. Au même instant, une photo de la rançon fuite sur WhatsApp et la presse appelle.',
    collaborateur:
      'Inquiétude générale sur les téléphones personnels ; rumeurs de faillite et sollicitation d’un journaliste économique.',
    hacker:
      'Pression psychologique maximale par double extorsion pour pousser le management à une transaction précipitée.',
    soc:
      'Posture de crise exemplaire : discours factuel et rassurant au DG, arbitrage pour la continuité et diffusion du communiqué officiel validé.',
    actionLabel: 'Prise d’appel DG avec waveform audio, arbitrage de crise et communiqué officiel',
  },
  {
    id: 6,
    time: '09h55',
    title: 'Sauvegardes Immuables Air-Gap & Reprise d’Activité',
    targetTool: 'Veeam Backup & Replication v12 (Air-Gap)',
    ttp: 'Résilience & Dépôt Durci Linux WORM',
    impact: 30,
    scenarioId: 4,
    briefing:
      'Refus du chantage. L’entreprise active son coffre-fort de sauvegardes déconnecté du réseau (Air-Gap) pour restaurer les données saines sans payer un centime.',
    collaborateur:
      'Attente ordonnée de la réouverture des services après validation formelle de l’éradication par les analystes.',
    hacker:
      'Échec cuisant de l’extorsion : les sauvegardes sont inatteignables et le canal pirate a été entièrement purgé.',
    soc:
      'Contrôle d’intégrité SHA256 des snapshots immuables WORM et test de restauration validé avec succès en bac à sable hermétique.',
    actionLabel: 'Audit d’intégrité SHA256 des snapshots et simulation de restauration en sandbox',
  },
  {
    id: 7,
    time: '10h00',
    title: 'Incident Maîtrisé & Débriefing des 5 Réflexes',
    targetTool: 'Synthèse Pédagogique & Bilan de Crise',
    ttp: 'Retour d’Expérience (RETEX) & Certification',
    impact: 10,
    scenarioId: 5,
    briefing:
      'La crise est maîtrisée avec succès ! Aucune rançon versée, intégrité des données préservée. Consolidation des 5 réflexes vitaux face à la cyberattaque.',
    collaborateur:
      'Compétences acquises : reconnaître le phishing, ne jamais activer les macros et alerter immédiatement sans éteindre le PC.',
    hacker:
      'Attaque totalement déjouée, indicateurs d’attaque (IOC) partagés au CERT national pour immuniser l’écosystème.',
    soc:
      'Rapport d’incident bouclé, renforcement des règles de sécurité et certification de la salle aux réflexes DGSSI / maCERT.',
    actionLabel: 'Bilan final, classement des équipes et ancrage des 5 réflexes',
  },
]

export default function CinematicDirector({
  onClose,
  onAction,
  onOpenLockscreen,
}: {
  onClose: () => void
  onAction: (text: string, suggested?: number, patch?: Parameters<ReturnType<typeof useGame>['update']>[0]) => void
  onOpenLockscreen: () => void
}) {
  const g = useGame()
  const [currentStageIdx, setCurrentStageIdx] = useState(0) // 0 to 6
  const [phase, setPhase] = useState<'briefing' | 'execution'>('briefing')
  const [isRunning, setIsRunning] = useState(true)
  const [speed, setSpeed] = useState(1) // 1, 2, 4
  const [secondsLeft, setSecondsLeft] = useState(6)

  const stage = CINEMATIC_STAGES[currentStageIdx] ?? CINEMATIC_STAGES[0]

  // Durations in seconds (scaled by speed)
  const BRIEFING_DURATION = Math.max(3, Math.round(6 / speed))
  const EXECUTION_DURATION = Math.max(5, Math.round(10 / speed))

  // Synchronize scenario stage in game context
  useEffect(() => {
    g.update({ scenario: stage.scenarioId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.scenarioId])

  // Timer loop for automatic phase and stage switching
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition when timer hits 0
          if (phase === 'briefing') {
            // Switch from briefing to execution
            setPhase('execution')
            if (currentStageIdx === 1 || currentStageIdx === 3) sound.playAlarm()
            else if (currentStageIdx === 4) sound.playPhoneRing()
            else sound.playBlip()
            return EXECUTION_DURATION
          } else {
            // Switch from execution to next stage's briefing
            if (currentStageIdx < CINEMATIC_STAGES.length - 1) {
              const nextIdx = currentStageIdx + 1
              setCurrentStageIdx(nextIdx)
              setPhase('briefing')
              sound.playClick()
              return Math.max(3, Math.round(6 / speed))
            } else {
              // Completed all stages!
              setIsRunning(false)
              sound.playSuccess()
              return 0
            }
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, phase, currentStageIdx, speed, EXECUTION_DURATION])

  const handleSkipToExecution = () => {
    sound.playClick()
    setPhase('execution')
    setSecondsLeft(EXECUTION_DURATION)
  }

  const handleNextStage = () => {
    sound.playClick()
    if (currentStageIdx < CINEMATIC_STAGES.length - 1) {
      setCurrentStageIdx((prev) => prev + 1)
      setPhase('briefing')
      setSecondsLeft(BRIEFING_DURATION)
    } else {
      setIsRunning(false)
      sound.playSuccess()
    }
  }

  const handlePrevStage = () => {
    sound.playClick()
    if (currentStageIdx > 0) {
      setCurrentStageIdx((prev) => prev - 1)
      setPhase('briefing')
      setSecondsLeft(BRIEFING_DURATION)
    }
  }

  const togglePlayPause = () => {
    sound.playClick()
    setIsRunning((prev) => !prev)
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col bg-[#06070a] text-slate-100 overflow-hidden select-none">
      {/* 1. BARRE DE COMMANDE CINÉMATIQUE SUPÉRIEURE (COMPACTE, SANS SCROLL) */}
      <div className="bg-[#0b0e17] border-b border-offsec-red/40 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-offsec-red animate-ping" />
            <span className="font-mono font-black text-xs text-offsec-red tracking-wider">
              [ AUTO-DIRECTOR // ÉTAPE {stage.id} / 7 ]
            </span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Badge Phase Actuelle */}
          <span
            className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
              phase === 'briefing'
                ? 'bg-amber-950/60 border-offsec-amber text-offsec-amber'
                : 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
            }`}
          >
            {phase === 'briefing' ? '🎬 PHASE 1 : BRIEFING (CE QUI VA SE PASSER)' : '⚡ PHASE 2 : EXÉCUTION RÉELLE EN DIRECT'}
          </span>

          <span className="hidden sm:inline text-xs font-mono text-slate-400">
            {phase === 'briefing'
              ? `Bascule vers ${stage.targetTool} dans ${secondsLeft}s...`
              : `Prochaine étape dans ${secondsLeft}s...`}
          </span>
        </div>

        {/* Contrôles de lecture */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Sélecteur de vitesse */}
          <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-slate-800">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => {
                  sound.playClick()
                  setSpeed(s)
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  speed === s ? 'bg-offsec-red text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          <button
            onClick={togglePlayPause}
            className="px-3 py-1.5 rounded-xl bg-offsec-red hover:bg-red-600 text-white font-black flex items-center gap-1.5 shadow-md shadow-offsec-red/40"
          >
            {isRunning ? (
              <>
                <Pause size={13} /> Pause
              </>
            ) : (
              <>
                <Play size={13} /> Reprendre
              </>
            )}
          </button>

          {phase === 'briefing' ? (
            <button
              onClick={handleSkipToExecution}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-offsec-cyan text-offsec-cyan font-bold flex items-center gap-1"
            >
              Exécuter <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={handleNextStage}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-offsec-cyan text-slate-200 hover:text-white font-bold flex items-center gap-1"
            >
              Suivant <SkipForward size={13} />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Quitter la démonstration automatique"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 2. ZONE PRINCIPALE PLEIN ÉCRAN SANS SCROLL */}
      <div className="flex-1 overflow-hidden p-3 md:p-4 flex flex-col">
        <AnimatePresence mode="wait">
          {/* ======================= PHASE 1 : BRIEFING (CE QUI VA SE PASSER) ======================= */}
          {phase === 'briefing' && (
            <motion.div
              key={`briefing-${stage.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="h-full flex flex-col justify-between bg-[#0b0d14] border border-offsec-red/40 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-2xl"
            >
              {/* Texture OffSec */}
              <div className="absolute inset-0 bg-offsec-dots opacity-40 pointer-events-none" />
              <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-offsec-red/15 blur-3xl pointer-events-none" />

              {/* En-tête de l'étape */}
              <div className="relative z-10 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-offsec-red text-white text-xs font-mono font-black tracking-wider">
                      STG-0{stage.id} // {stage.time}
                    </span>
                    <span className="text-offsec-cyan font-mono text-xs font-bold bg-cyan-950/60 border border-cyan-700/60 px-2.5 py-1 rounded-lg">
                      [ {stage.ttp} ]
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">OUTIL DE DÉPLOIEMENT :</span>
                    <b className="text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                      {stage.targetTool}
                    </b>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans pt-1">
                  {stage.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed font-sans">
                  {stage.briefing}
                </p>
              </div>

              {/* LE TRIPLE REGARD CYBER (3 COLONNES D'IMPACT MAXIMUM) */}
              <div className="relative z-10 grid sm:grid-cols-3 gap-3 my-3">
                {/* 1. Salarié */}
                <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <User size={14} className="text-sky-400" /> 1. VUE SALARIÉ
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Sophie (RH)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{stage.collaborateur}</p>
                </div>

                {/* 2. Hacker sous le capot */}
                <div className="p-4 rounded-2xl bg-red-950/30 border border-offsec-red/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-offsec-red flex items-center gap-1.5">
                      <Skull size={14} /> 2. SOUS LE CAPOT (HACKER)
                    </span>
                    <span className="text-[10px] text-offsec-red font-mono">C2 185.22.14.89</span>
                  </div>
                  <p className="text-xs text-red-200 leading-relaxed font-sans">{stage.hacker}</p>
                </div>

                {/* 3. SOC EDR */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-700/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldAlert size={14} /> 3. VUE SOC / EDR
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Sara (Analyste L2)</span>
                  </div>
                  <p className="text-xs text-emerald-200 leading-relaxed font-sans">{stage.soc}</p>
                </div>
              </div>

              {/* Pied de briefing avec Jauge d'impact et Compte à rebours de bascule */}
              <div className="relative z-10 bg-[#07090f] p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 font-bold">NIVEAU DE MENACE :</span>
                  <div className="w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        stage.impact >= 75 ? 'bg-offsec-red' : stage.impact >= 40 ? 'bg-offsec-amber' : 'bg-offsec-cyan'
                      }`}
                      style={{ width: `${stage.impact}%` }}
                    />
                  </div>
                  <span className="font-mono font-black text-xs text-white">{stage.impact}%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-offsec-cyan animate-pulse">
                    ⚡ Bascule automatique dans {secondsLeft} seconde{secondsLeft > 1 ? 's' : ''}...
                  </span>
                  <button
                    onClick={handleSkipToExecution}
                    className="px-4 py-1.5 rounded-xl bg-offsec-red hover:bg-red-600 text-white font-mono font-bold text-xs flex items-center gap-1 shadow-lg shadow-offsec-red/40"
                  >
                    Voir l'exécution réelle ➔
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================= PHASE 2 : EXÉCUTION RÉELLE EN DIRECT ======================= */}
          {phase === 'execution' && (
            <motion.div
              key={`execution-${stage.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="h-full flex flex-col overflow-hidden"
            >
              {/* Outil d'entreprise correspondant à l'étape active */}
              <div className="flex-1 overflow-y-auto">
                {stage.id === 1 && <OutlookClient autoPlay onAction={onAction} />}
                {stage.id === 2 && <SplunkConsole autoPlay onAction={onAction} />}
                {stage.id === 3 && <TopologyRadar autoPlay onAction={onAction} />}
                {stage.id === 4 && (
                  <WindowsExplorer autoPlay onAction={onAction} onOpenLockscreen={onOpenLockscreen} />
                )}
                {stage.id === 5 && <CrisisCenter autoPlay onAction={onAction} />}
                {stage.id === 6 && <VeeamConsole autoPlay onAction={onAction} />}
                {stage.id === 7 && (
                  <div className="h-full rounded-3xl bg-[#0b0d14] border border-offsec-red/40 p-6 flex flex-col justify-between shadow-2xl">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="font-mono font-black text-sm text-emerald-400 flex items-center gap-2">
                          <Award size={18} /> BILAN FINAL & RETEX OFFICIEL DE CRISE
                        </span>
                        <span className="font-mono text-xs text-white bg-emerald-950/80 border border-emerald-600 px-3 py-1 rounded-xl">
                          SCORE TOTAL : +12 POINTS (EXCELLENT)
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">
                        L’Attaque Rançongiciel a été neutralisée avec 0 € versé !
                      </h2>
                      <p className="text-xs text-slate-300">
                        Grâce au respect de la chaîne de réponse à incident et à la concertation collégiale avec la
                        Direction, l’infrastructure a été préservée et les données restaurées depuis l’Air-Gap.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-5 gap-2.5 my-4">
                      {REFLEXES.map((r) => (
                        <div key={r.step} className="p-3 rounded-2xl bg-black/80 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-mono font-bold text-offsec-cyan">
                            RÉFLEXE #{r.step}
                          </span>
                          <div className="font-extrabold text-xs text-white">{r.title}</div>
                          <p className="text-[10px] text-slate-400 leading-snug">{r.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/80 border border-offsec-red/40 flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-300">
                        La démonstration automatisée est terminée. Vous pouvez relancer ou passer au mode manuel.
                      </span>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-offsec-red hover:bg-red-600 text-white font-mono font-bold text-xs"
                      >
                        Retourner à la Console Complète
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
