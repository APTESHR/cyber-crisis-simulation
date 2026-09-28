import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/GameContext'
import { sound } from '../utils/audio'
import {
  Skull,
  ShieldAlert,
  Terminal,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Zap,
  Radio,
  Eye,
  Server,
  Mail,
  Network,
  Lock,
  CheckCircle2,
  FileCode,
  Flame,
  ArrowRight,
} from 'lucide-react'

export interface AttackStage {
  id: number
  code: string
  title: string
  ttp: string
  threatLevel: number // 0 à 100
  victimView: string
  hackerView: string
  socView: string
  status: 'nominal' | 'active' | 'contained'
}

export const ATTACK_STAGES: AttackStage[] = [
  {
    id: 0,
    code: 'STG-00',
    title: 'Périmètre Nominal & Veille',
    ttp: 'RECON / NORMAL',
    threatLevel: 5,
    victimView: 'Journée nominale de travail. Les équipes se connectent à leur session Windows et consultent leurs courriels sans anomalie.',
    hackerView: 'L’attaquant achète le domaine typosquatté « societe-portail-rh.online » et prépare un modèle Word piégé avec macro VBA obfusquée.',
    socView: 'Sondes SIEM et EDR au vert. Flux nominal sur le pare-feu périmétrique. Aucune connexion suspecte détectée.',
    status: 'nominal',
  },
  {
    id: 1,
    code: 'STG-01',
    title: 'Hameçonnage & Détection E-mail',
    ttp: 'MITRE T1566.001',
    threatLevel: 25,
    victimView: 'Sophie reçoit un e-mail alarmant : « Suspension imminente de votre salaire ». L’expéditeur ressemble à la Direction RH.',
    hackerView: 'Envoi d’un courriel ciblé (Spear-Phishing) depuis un serveur relais non authentifié (SPF Fail, DKIM none) contenant la pièce jointe .docm.',
    socView: 'Le filtre de messagerie signale un SPF en échec. Si le collaborateur signale le mail immédiatement, la menace est neutralisée avant exécution.',
    status: 'active',
  },
  {
    id: 2,
    code: 'STG-02',
    title: 'Exécution Macro & PowerShell Furtif',
    ttp: 'MITRE T1204.002 / T1059.001',
    threatLevel: 55,
    victimView: 'Sophie ouvre le document et clique sur « Activer le contenu » sur le bandeau jaune Word. Rien ne semble s’ouvrir, mais le PC ralentit.',
    hackerView: 'La macro VBA lance en arrière-plan « powershell.exe -W Hidden -Enc... » sans afficher aucune fenêtre. Le code injecte un dropper en RAM.',
    socView: 'ALERTE EDR IMMÉDIATE : L’agent SentinelOne détecte un processus Word enfant engendrant PowerShell avec commande encodée en Base64.',
    status: 'active',
  },
  {
    id: 3,
    code: 'STG-03',
    title: 'Balise C2 & Canal Sortant',
    ttp: 'MITRE T1071.001',
    threatLevel: 70,
    victimView: 'L’ordinateur est de plus en plus lent. La connexion réseau semble saturée. Le collaborateur contacte le support informatique.',
    hackerView: 'Le payload établit un tunnel HTTPS chiffré vers le serveur Command & Control (Sofia, BG : 185.22.14.89:443) pour recevoir des ordres.',
    socView: 'Alerte réseau : Flux sortant persistant vers une IP réputée hostile sur le port 443. Le SOC doit déclencher l’isolement réseau d’urgence.',
    status: 'active',
  },
  {
    id: 4,
    code: 'STG-04',
    title: 'Pivot Latéral SMB & Propagation',
    ttp: 'MITRE T1021.002 / T1003',
    threatLevel: 85,
    victimView: 'D’autres collègues en comptabilité et RH commencent à constater des lenteurs et des déconnexions du lecteur réseau partagé.',
    hackerView: 'L’attaquant extrait des identifiants en mémoire (Mimikatz) et pivote via le port SMB 445 vers le contrôleur DC et le serveur FS-CORP-01.',
    socView: 'Multiplication des alertes EDR sur plusieurs hôtes. Détection de requêtes SMB anormales vers les partages administratifs C$ et ADMIN$.',
    status: 'active',
  },
  {
    id: 5,
    code: 'STG-05',
    title: 'Chiffrement Massif & Rançongiciel',
    ttp: 'MITRE T1486 (Data Encrypted)',
    threatLevel: 98,
    victimView: 'Tous les fichiers de travail sont renommés en .locked avec une icône de cadenas. Un message s’affiche : rançon exigée de 15 Bitcoins.',
    hackerView: 'Déploiement du binaire LockBit 3.0. Chiffrement AES-256 des partages de fichiers, suppression des clichés instantanés VSS et dépôt de la note.',
    socView: 'CRITIQUE MAJEURE : Activité de chiffrement massif détectée sur FS-CORP-01. Notification immédiate au RSSI et à la Direction Générale.',
    status: 'active',
  },
  {
    id: 6,
    code: 'STG-06',
    title: 'Crise, Fuites & Gouvernance',
    ttp: 'GOVERNANCE & INCIDENT RESPONSE',
    threatLevel: 80,
    victimView: 'Panique dans les couloirs : les factures ne peuvent plus être émises. Une capture d’écran fuite sur WhatsApp. La presse appelle.',
    hackerView: 'L’attaquant menace de publier 420 Go de données volées (double extorsion) sur son site Tor si la rançon n’est pas payée sous 72 heures.',
    socView: 'Cellule de crise réunie : décision formelle de NE PAS PAYER (directive DGSSI), confinement des VLANs et audit des sauvegardes immuables hors-ligne.',
    status: 'active',
  },
  {
    id: 7,
    code: 'STG-07',
    title: 'Neutralisation, Sauvegardes & 5 Réflexes',
    ttp: 'REMEDIATION & DEBRIEFING',
    threatLevel: 15,
    victimView: 'Les accès sont assainis, les mots de passe réinitialisés. L’entreprise reprend progressivement ses activités sur données restaurées.',
    hackerView: 'La porte dérobée est coupée, l’IP C2 bloquée au pare-feu. L’extorsion a échoué car les sauvegardes immuables étaient saines et isolées.',
    socView: 'Incident maîtrisé : 0 € versé aux pirates, données restaurées depuis le coffre Veeam Air-Gap, retour d’expérience et débriefing 5 réflexes.',
    status: 'contained',
  },
]

export default function AttackTheater({
  autoRunning = false,
  autoSpeed = 2,
  onStartAuto,
  onStopAuto,
  onSkipStep,
  onSetSpeed,
}: {
  autoRunning?: boolean
  autoSpeed?: number
  onStartAuto?: () => void
  onStopAuto?: () => void
  onSkipStep?: () => void
  onSetSpeed?: (s: number) => void
}) {
  const g = useGame()
  const [activeStageId, setActiveStageId] = React.useState<number>(0)
  const [expanded, setExpanded] = React.useState(true)

  const currentStageIndex = React.useMemo(() => {
    if (g.scenario === 0) return 0
    if (g.scenario === 1) return g.macroExecuted ? 2 : 1
    if (g.scenario === 2) return g.c2Blocked ? 4 : 3
    if (g.scenario === 3) return 5
    if (g.scenario === 4) return 6
    return 7
  }, [g.scenario, g.macroExecuted, g.c2Blocked])

  const stage = ATTACK_STAGES[activeStageId !== undefined ? activeStageId : currentStageIndex] ?? ATTACK_STAGES[0]

  React.useEffect(() => {
    setActiveStageId(currentStageIndex)
  }, [currentStageIndex])

  return (
    <div className="rounded-[3px] bg-white border border-[#E2E4E9] shadow-tactile overflow-hidden relative font-sans">
      {/* Top Clinical Telemetry Bar */}
      <div className="bg-[#F8F9FA] border-b border-[#E2E4E9] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-[2px] bg-[#090A0C] text-white">
            <Skull size={14} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#090A0C] text-[11px] font-extrabold uppercase tracking-widest">
                [ TACTICAL INCIDENT LAB // FORENSIC KILL-CHAIN PIPELINE ]
              </span>
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            </div>
            <div className="text-[10px] text-[#525866] font-mono">
              Compréhension visuelle de l’attaque pas à pas · Salarié vs Pirate vs SOC
            </div>
          </div>
        </div>

        {/* Threat Level & Demo Controls */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-white border border-[#E2E4E9] tabular-nums">
            <span className="text-[10px] text-[#525866] font-bold uppercase">NIVEAU DE MENACE :</span>
            <span
              className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-[2px] border ${
                stage.threatLevel > 75
                  ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                  : stage.threatLevel > 40
                  ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                  : 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]'
              }`}
            >
              {stage.threatLevel} %
            </span>
          </div>

          {onStartAuto && (
            <div className="flex items-center gap-1 bg-white p-1 rounded-[2px] border border-[#E2E4E9]">
              {autoRunning ? (
                <>
                  <button
                    onClick={onStopAuto}
                    className="px-2 py-0.5 rounded-[2px] bg-[#DC2626] text-white text-[10px] font-bold flex items-center gap-1 transition active:translate-y-[1px]"
                  >
                    <Pause size={11} /> Pause
                  </button>
                  {onSkipStep && (
                    <button
                      onClick={onSkipStep}
                      className="px-1.5 py-0.5 rounded-[2px] bg-[#F8F9FA] text-[#090A0C] hover:bg-[#E2E4E9] text-[10px] font-bold transition active:translate-y-[1px]"
                      title="Étape suivante"
                    >
                      <SkipForward size={11} />
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={onStartAuto}
                  className="px-2.5 py-0.5 rounded-[2px] bg-[#090A0C] text-white text-[10px] font-bold flex items-center gap-1.5 transition shadow-tactile active:translate-y-[1px]"
                >
                  <Play size={11} /> Démo Auto
                </button>
              )}
              {onSetSpeed && (
                <div className="flex items-center border-l border-[#E2E4E9] ml-1 pl-1">
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => onSetSpeed(s)}
                      className={`px-1 py-0.5 text-[9px] font-mono font-bold rounded-[2px] ${
                        autoSpeed === s ? 'bg-[#090A0C] text-white' : 'text-[#525866] hover:text-[#090A0C]'
                      }`}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-[#525866] hover:text-[#090A0C] font-mono px-2 py-1 rounded-[2px] bg-white border border-[#E2E4E9] active:translate-y-[1px]"
          >
            {expanded ? 'Réduire [-]' : 'Agrandir [+]'}
          </button>
        </div>
      </div>

      {/* Kill Chain Stepper Bar */}
      <div className="bg-white border-b border-[#E2E4E9] px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[720px]">
          {ATTACK_STAGES.map((s) => {
            const isCurrent = currentStageIndex === s.id
            const isSelected = activeStageId === s.id
            const isPassed = currentStageIndex > s.id

            return (
              <button
                key={s.id}
                onClick={() => {
                  sound.playClick()
                  setActiveStageId(s.id)
                }}
                className={`flex-1 min-w-[110px] p-2 rounded-[2px] text-left border transition active:translate-y-[1px] relative ${
                  isSelected
                    ? 'bg-[#FEF2F2] border-[#DC2626] text-[#090A0C] shadow-xs ring-1 ring-[#DC2626]'
                    : isPassed
                    ? 'bg-[#F8F9FA] border-[#E2E4E9] text-[#525866] hover:bg-white'
                    : 'bg-white border-[#E2E4E9] text-[#8C93A0] hover:text-[#090A0C]'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-mono text-[9px] font-bold text-[#525866]">{s.code}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-ping" />}
                  {isPassed && <CheckCircle2 size={10} className="text-[#059669]" />}
                </div>
                <div className="text-[11px] font-extrabold truncate text-[#090A0C]">{s.title}</div>
                <div className="font-mono text-[9px] text-[#DC2626] font-semibold truncate">{s.ttp}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Expanded Content: Triple Cyber View Matrix */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 sm:p-5 space-y-4 bg-white"
          >
            {/* Title & Stage Severity */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8F9FA] p-3 rounded-[3px] border border-[#E2E4E9]">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-[#DC2626] font-mono">{stage.code}</span>
                <div>
                  <h3 className="text-sm font-black text-[#090A0C] tracking-tight">{stage.title}</h3>
                  <span className="text-[11px] font-mono text-[#0284C7] font-bold">{stage.ttp}</span>
                </div>
              </div>

              {/* Linear Impact Gauge */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="text-right">
                  <div className="text-[9px] text-[#525866] font-mono uppercase font-bold">Impact Réseau</div>
                  <div className="text-xs font-bold text-[#090A0C] tabular-nums">{stage.threatLevel} / 100</div>
                </div>
                <div className="w-28 h-2 rounded-[1px] bg-[#E2E4E9] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      stage.threatLevel > 75
                        ? 'bg-[#DC2626]'
                        : stage.threatLevel > 40
                        ? 'bg-[#D97706]'
                        : 'bg-[#0284C7]'
                    }`}
                    style={{ width: `${stage.threatLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Triple Perspective Matrix */}
            <div className="grid md:grid-cols-3 gap-3">
              {/* 1. Victim View */}
              <div className="p-3.5 rounded-[3px] bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                <div className="flex items-center justify-between border-b border-[#FDE68A] pb-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#D97706] font-mono uppercase tracking-wider">
                    <Eye size={13} /> 1. VUE POSTE (COLLABORATEUR)
                  </span>
                  <span className="text-[9px] text-[#525866] font-mono">Écran Utilisateur</span>
                </div>
                <p className="text-xs text-[#090A0C] leading-relaxed min-h-[60px] font-normal">{stage.victimView}</p>
                <div className="text-[10px] font-mono text-[#D97706] bg-white p-2 rounded-[2px] border border-[#FDE68A]">
                  💡 <b>À retenir :</b> Signaler au moindre doute sans tenter de réparer seul.
                </div>
              </div>

              {/* 2. Hacker View */}
              <div className="p-3.5 rounded-[3px] bg-[#FEF2F2] border border-[#FECACA] space-y-2">
                <div className="flex items-center justify-between border-b border-[#FECACA] pb-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#DC2626] font-mono uppercase tracking-wider">
                    <Terminal size={13} /> 2. VUE ATTAQUANT (KALI / C2)
                  </span>
                  <span className="text-[9px] text-[#DC2626] font-mono">Charge Malveillante</span>
                </div>
                <p className="text-xs text-[#090A0C] leading-relaxed min-h-[60px] font-normal">{stage.hackerView}</p>
                <div className="text-[10px] font-mono text-[#DC2626] bg-white p-2 rounded-[2px] border border-[#FECACA]">
                  ⚡ <b>Tactique pirate :</b> Furtivité maximale et pivot latéral via SMB 445.
                </div>
              </div>

              {/* 3. SOC View */}
              <div className="p-3.5 rounded-[3px] bg-[#F0F9FF] border border-[#BAE6FD] space-y-2">
                <div className="flex items-center justify-between border-b border-[#BAE6FD] pb-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0284C7] font-mono uppercase tracking-wider">
                    <ShieldAlert size={13} /> 3. VUE DÉFENSE (SOC & EDR)
                  </span>
                  <span className="text-[9px] text-[#525866] font-mono">Télémétrie Blue Team</span>
                </div>
                <p className="text-xs text-[#090A0C] leading-relaxed min-h-[60px] font-normal">{stage.socView}</p>
                <div className="text-[10px] font-mono text-[#0284C7] bg-white p-2 rounded-[2px] border border-[#BAE6FD]">
                  🛡️ <b>Réflexe EDR :</b> Confinement réseau instantané pour couper l'hémorragie.
                </div>
              </div>
            </div>

            {/* Incident Physical Route Stream */}
            <div className="bg-[#F8F9FA] p-2.5 rounded-[2px] border border-[#E2E4E9] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-[#525866] font-bold uppercase text-[10px]">FLUX PHYSIQUE DE L'INCIDENT :</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-white border border-[#FECACA] rounded-[2px] text-[#DC2626] text-[10px] font-bold">
                  185.22.14.89 (C2)
                </span>
                <ArrowRight size={12} className="text-[#DC2626]" />
                <span
                  className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold border ${
                    g.macroExecuted
                      ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                      : 'bg-white border-[#E2E4E9] text-[#090A0C]'
                  }`}
                >
                  HOST_01 (Sophie RH)
                </span>
                <ArrowRight size={12} className="text-[#DC2626]" />
                <span
                  className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold border ${
                    g.scenario >= 2
                      ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]'
                      : 'bg-white border-[#E2E4E9] text-[#090A0C]'
                  }`}
                >
                  VLAN Postes (SMB 445)
                </span>
                <ArrowRight size={12} className="text-[#DC2626]" />
                <span
                  className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold border ${
                    g.scenario >= 3
                      ? 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626]'
                      : 'bg-white border-[#E2E4E9] text-[#090A0C]'
                  }`}
                >
                  FS-CORP-01 (.locked)
                </span>
                <span className="text-[#E2E4E9]">|</span>
                <span
                  className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold border ${
                    g.backupsChecked
                      ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]'
                      : 'bg-white border-[#E2E4E9] text-[#525866]'
                  }`}
                >
                  NAS Veeam (Air-Gap)
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
