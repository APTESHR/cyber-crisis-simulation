import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../utils/audio'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  X,
  Radio,
  Sparkles,
  Zap,
  Film,
} from 'lucide-react'

export interface TourStep {
  step: number
  targetTab: 'mail' | 'soc' | 'topology' | 'server' | 'accounts' | 'backup' | 'crisis'
  toolName: string
  title: string
  audienceBriefing: string
  actionTrigger?: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    targetTab: 'mail',
    toolName: 'Microsoft Outlook 365 & Word',
    title: 'Hameçonnage Ciblé (09h15)',
    audienceBriefing:
      '🎬 ÉTAPE 1 : Observez la messagerie Outlook de Sophie. Un courriel urgent du support interne vient d’arriver avec une pièce jointe Word « Mise_a_jour_compte_RH.docm ». Regardez le bandeau jaune Microsoft : la macro malveillante est prête à être activée.',
    actionTrigger: 'Ouverture du courriel et activation de la macro VBA.',
  },
  {
    step: 2,
    targetTab: 'soc',
    toolName: 'Splunk Enterprise & SentinelOne EDR',
    title: 'Alerte EDR & Détection SOC (09h20)',
    audienceBriefing:
      '🎬 ÉTAPE 2 : Basculons dans la console SOC / SIEM de Sara. Les sondes EDR viennent de s’allumer en rouge vif ! Regardez l’arbre des processus : Word a engendré un PowerShell furtif (-W Hidden -Enc) qui ouvre une porte dérobée vers Sofia (Bulgarie).',
    actionTrigger: 'Confinement EDR immédiat de la machine compromise.',
  },
  {
    step: 3,
    targetTab: 'topology',
    toolName: 'Radar de Topologie Réseau',
    title: 'Pivot Réseau & Propagation SMB (09h25)',
    audienceBriefing:
      '🎬 ÉTAPE 3 : Regardez la topologie réseau. Des paquets laser rouges circulent entre le C2 pirate, le poste de Sophie et les autres machines. L’attaquant pivote sur le port SMB 445 pour atteindre le serveur de fichiers FS-CORP-01 !',
    actionTrigger: 'Observation du flux d’infection latérale.',
  },
  {
    step: 4,
    targetTab: 'server',
    toolName: 'Windows Server 2022 & LockBit 3.0',
    title: 'Chiffrement Massif & Extorsion (09h40)',
    audienceBriefing:
      '🎬 ÉTAPE 4 : Dans l’explorateur Windows du serveur partagé, tous les fichiers métiers (factures, paie, contrats) sont renommés en .locked ! La note LockBit 3.0 surgit avec une demande de rançon de 15 Bitcoins (~980 000 €).',
    actionTrigger: 'Activation de la cellule de crise et interdiction formelle de payer.',
  },
  {
    step: 5,
    targetTab: 'crisis',
    toolName: 'Hotline DG & Fuites WhatsApp',
    title: 'Crise Opérationnelle & Pression Médiatique (09h45)',
    audienceBriefing:
      '🎬 ÉTAPE 5 : Le téléphone sonne ! Le Directeur Général appelle en direct pour exiger un arbitrage. Dans le même temps, les employés paniqués publient des captures de la rançon sur WhatsApp et la presse économique contacte l’entreprise.',
    actionTrigger: 'Réponse à l’appel du DG et rédaction du communiqué officiel.',
  },
  {
    step: 6,
    targetTab: 'backup',
    toolName: 'Veeam Backup & Replication (Air-Gap)',
    title: 'Restauration Sécurisée & Sauvegardes (09h55)',
    audienceBriefing:
      '🎬 ÉTAPE 6 : L’entreprise refuse le chantage ! Dans la console Veeam, les snapshots immuables hors-ligne sont intacts. Le SOC lance un contrôle d’intégrité SHA256 et teste la restauration en bac à sable hermétique.',
    actionTrigger: 'Validation de l’éradication et reprise d’activité.',
  },
  {
    step: 7,
    targetTab: 'soc',
    toolName: 'Synthèse & Débriefing des 5 Réflexes',
    title: 'Incident Maîtrisé & Bilan de Crise (10h00)',
    audienceBriefing:
      '🎬 ÉTAPE 7 : L’attaque a été contenue avec 0 € versé aux pirates grâce à la réactivité collective ! Nous pouvons passer au débriefing avec les 5 réflexes fondamentaux : Détecter, Alerter, Isoler, Décider, et Communiquer.',
    actionTrigger: 'Bilan des scores et certification de l’exercice.',
  },
]

export default function GuidedTourBanner({
  currentStep,
  totalSteps,
  isRunning,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSpeedChange,
  onClose,
}: {
  currentStep: number
  totalSteps: number
  isRunning: boolean
  speed: number
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onSpeedChange: (s: number) => void
  onClose: () => void
}) {
  const stepData = TOUR_STEPS[currentStep - 1] ?? TOUR_STEPS[0]

  return (
    <div className="bg-[#0b0e17] border-2 border-offsec-red/80 rounded-3xl p-4 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Texture OffSec en fond */}
      <div className="absolute inset-0 bg-offsec-dots opacity-40 pointer-events-none" />

      <div className="relative z-10 space-y-3">
        {/* Barre d'état du narrateur */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-offsec-red/30 pb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-offsec-red text-white shadow-md shadow-offsec-red/50">
              <Film size={15} />
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xs text-offsec-red tracking-wider uppercase">
                [ VISITE GUIDÉE SCÉNARISÉE // ÉTAPE {currentStep} / {totalSteps} ]
              </span>
              <span className="w-2 h-2 rounded-full bg-offsec-red animate-ping" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Vitesse */}
            <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="text-slate-500 text-[10px] px-1 font-bold">VITESSE :</span>
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    speed === s ? 'bg-offsec-red text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>

            {/* Contrôles navigation */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentStep <= 1}
                onClick={onPrev}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Étape précédente"
              >
                <SkipBack size={13} />
              </button>

              <button
                onClick={isRunning ? onPause : onPlay}
                className="px-3 py-1.5 rounded-xl bg-offsec-red hover:bg-red-600 text-white font-mono font-black text-xs flex items-center gap-1.5 shadow-lg shadow-offsec-red/40"
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

              <button
                disabled={currentStep >= totalSteps}
                onClick={onNext}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Étape suivante"
              >
                <SkipForward size={13} />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              title="Quitter la visite guidée"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Message d'explication cinématique à destination de la salle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/80 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-offsec-cyan uppercase">
                Outil en cours : {stepData.toolName}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs font-bold text-white">{stepData.title}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
              {stepData.audienceBriefing}
            </p>
          </div>

          <div className="shrink-0 px-3 py-1.5 rounded-xl bg-offsec-red/20 border border-offsec-red/60 text-offsec-red font-mono text-xs font-bold">
            Action : {stepData.actionTrigger}
          </div>
        </div>
      </div>
    </div>
  )
}
