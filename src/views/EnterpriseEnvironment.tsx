import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Network,
  Monitor,
  Eye,
  Zap,
  PhoneCall,
  X,
  Radio,
  Server,
  ShieldAlert,
  Mail,
  KeyRound,
  Activity,
} from 'lucide-react'
import { sound } from '../utils/audio'
import { narrator } from '../utils/voice'
import NetworkMap from '../components/NetworkMap'
import EdrConsoleSimulator from '../components/simulators/EdrConsoleSimulator'
import VeeamConsoleSimulator from '../components/simulators/VeeamConsoleSimulator'
import VisualPointer from '../components/VisualPointer'

export default function EnterpriseEnvironment() {
  const [stepIdx, setStepIdx] = useState<number>(0)
  const [slideType, setSlideType] = useState<'title' | 'map' | 'tool'>('title')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(narrator.isMuted())

  const [cableUnplugged, setCableUnplugged] = useState(false)
  const [hostIsolated, setHostIsolated] = useState(false)
  const [emailPurged, setEmailPurged] = useState(false)
  const [firewallBlocked, setFirewallBlocked] = useState(false)
  const [iamRevoked, setIamRevoked] = useState(false)
  const [exfilCut, setExfilCut] = useState(false)
  const [ramCaptured, setRamCaptured] = useState(false)
  const [reimaged, setReimaged] = useState(false)
  const [dgChoice, setDgChoice] = useState<'refuse' | 'pay' | null>(null)

  useEffect(() => {
    const unsub = narrator.subscribe((muted) => setIsVoiceMuted(muted))
    return () => unsub()
  }, [])

  const steps = [
    {
      id: 0,
      number: '01',
      title: 'Ingestion & Triage L1',
      subtitle: 'Extraction des métadonnées e-mail suspect et purge globale de la campagne sur la messagerie.',
      actor: 'Analyste SOC Niveau 1',
      solution: 'SIEM & Passerelle de messagerie sécurisée',
      sla: 'Ticket d\'incident qualifié & campagne neutralisée (< 15-30 min)',
      voiceTitle: 'Étape 1 : Ingestion et triage SOC niveau 1. La passerelle de messagerie et le SIEM détectent la pièce jointe piégée et purgent la campagne.',
      voiceMap: 'Sur la cartographie : les flux de messagerie sont analysés par le SIEM et la purge stoppe l\'infection d\'autres boîtes aux lettres.',
      voiceTool: 'Sur la console de messagerie : l\'analyste L1 trace le message frauduleux et déclenche la purge globale sur l\'ensemble du domaine.',
      toolType: 'soc_l1',
      toolName: 'Console Passerelle de Messagerie & SIEM',
    },
    {
      id: 1,
      number: '02',
      title: 'Détection EDR & Confinement L2',
      subtitle: 'Détection comportementale WINWORD vers PowerShell, isolement réseau logique et maintien sous tension pour la RAM.',
      actor: 'Analyste SOC Niveau 2 / Réponse à Incident (IR)',
      solution: 'Solution EDR / XDR',
      sla: 'Hôte confiné & rapport de détection préliminaire (< 1 heure)',
      voiceTitle: 'Étape 2 : Détection EDR et confinement niveau 2. Analyse de l\'arbre des processus et isolement logique immédiat de l\'hôte.',
      voiceMap: 'Regardez la surveillance : l\'EDR verrouille le poste de travail pour empêcher tout rebond vers les serveurs tout en le maintenant allumé.',
      voiceTool: 'Sur la console EDR : l\'analyste active le confinement de l\'hôte, coupant ses accès réseau tout en préservant la mémoire vive.',
      toolType: 'edr',
      toolName: 'Console Opérationnelle EDR / XDR',
    },
    {
      id: 2,
      number: '03',
      title: 'Riposte Périmétrique & IAM',
      subtitle: 'Blocage pare-feu/proxy de l\'IP et domaine C2, révocation des jetons OAuth/Kerberos et reset des mots de passe DA.',
      actor: 'Ingénieur Sécurité Réseau & IAM',
      solution: 'Pare-feu de Nouvelle Génération, SWG & Gestion des Accès (IAM)',
      sla: 'Périmètre hermétique & rupture d\'accès aux identifiants (< 2 heures)',
      voiceTitle: 'Étape 3 : Riposte périmétrique et IAM. Blocage de l\'infrastructure C2 et révocation globale des sessions administratives.',
      voiceMap: 'Sur la cartographie réseau : le pare-feu coupe le flux C2 sortant et le contrôleur d\'accès révoque tous les jetons actifs.',
      voiceTool: 'Dans la console réseau et IAM : l\'IP pirate est bannie et la révocation immédiate des tickets Kerberos neutralise le pirate.',
      toolType: 'perimeter_iam',
      toolName: 'Console Pare-Feu NGFW & Gestion des Accès IAM',
    },
    {
      id: 3,
      number: '04',
      title: 'Chasse Réseau & Blocage d\'Exfiltration',
      subtitle: 'Détection par analyseur NDR de volumes d\'upload anormaux et coupure d\'urgence des canaux d\'exfiltration.',
      actor: 'Threat Hunter / Analyste SOC L2',
      solution: 'Analyseur de Trafic Réseau (NDR) & Passerelle Web Sécurisée',
      sla: 'Télémétrie d\'exfiltration bornée & flux coupés (< 3 heures)',
      voiceTitle: 'Étape 4 : Chasse réseau et blocage d\'exfiltration. L\'analyseur NDR repère un flux sortant massif et coupe les canaux.',
      voiceMap: 'Sur la cartographie : les flux sortants suspects vers le cloud pirate sont interceptés et neutralisés par la sonde NDR.',
      voiceTool: 'Sur la console NDR : la détection d\'un pic d\'upload chiffré déclenche le blocage immédiat des sessions et le bornage des fuites.',
      toolType: 'ndr_hunt',
      toolName: 'Console Analyseur Réseau NDR & Passerelle Web',
    },
    {
      id: 4,
      number: '05',
      title: 'Forensique L3 & Mobilisation Crise',
      subtitle: 'Capture à chaud de la RAM, triage $MFT/Logs, notification RSSI et convocation d\'urgence de la cellule de crise.',
      actor: 'Expert Forensique L3 (DFIR) & RSSI',
      solution: 'Outils d\'Analyse Médico-légale Live Forensics',
      sla: 'Image RAM acquise & cellule de crise activée (< 4 heures)',
      voiceTitle: 'Étape 5 : Forensique niveau 3 et cellule de crise. Acquisition à chaud de la mémoire vive et convocation de la cellule de crise.',
      voiceMap: 'Sur la carte : les experts DFIR isolent les preuves numériques sans éteindre le poste pour préserver les clés en mémoire.',
      voiceTool: 'Voyez l\'outil forensique : la mémoire vive est acquise pour extraire les injecteurs et la cellule de crise est mobilisée.',
      toolType: 'forensics_crisis',
      toolName: 'Poste d\'Acquisition Live Forensics & Triage Mémoire',
    },
    {
      id: 5,
      number: '06',
      title: 'Décision Stratégique & Conformité (DGSSI / CNDP)',
      subtitle: 'Refus formel de payer la rançon selon la doctrine DGSSI, déclaration CNDP et DGSSI sous 72h, dépôt de plainte.',
      actor: 'Direction Générale, RSSI & Conseiller Juridique',
      solution: 'Procédure de Gestion de Crise & Cadre Règlementaire National (DGSSI / CNDP)',
      sla: 'Déclarations CNDP & DGSSI déposées (< 72 heures)',
      voiceTitle: 'Étape 6 : Décision stratégique et conformité. Refus formel de payer selon la doctrine DGSSI et déclarations légales sous 72 heures.',
      voiceMap: 'La cellule de crise engage les communications institutionnelles avec la DGSSI, le maCERT et la CNDP.',
      voiceTool: 'Dans la cellule de crise : la décision unanime est confirmée : zéro rançon versée, déclaration légale déposée à la CNDP et DGSSI.',
      toolType: 'crisis_dgssi',
      toolName: 'Cellule de Crise Stratégique & Déclaration DGSSI / CNDP',
    },
    {
      id: 6,
      number: '07',
      title: 'Éradication, Restauration & Retex',
      subtitle: 'Re-imaging complet sur master certifié, restauration étanche depuis le coffre WORM et livraison des rapports L3 & RSSI.',
      actor: 'Équipe Infrastructure, Restauration & RSSI',
      solution: 'Système de Sauvegarde Immuable (Air-Gap / WORM) & Master Certifié',
      sla: 'Rapport Technique Forensique L3 & Rapport Exécutif RSSI / DG',
      voiceTitle: 'Étape 7 : Éradication, restauration et retour d\'expérience. Re-imaging certifié des postes et restauration saine WORM.',
      voiceMap: 'Sur la cartographie : les données saines affluent depuis le coffre immuable WORM vers les serveurs réinstallés à neuf.',
      voiceTool: 'Sur la console de sauvegarde WORM : restauration certifiée sans paiement de rançon et remise des rapports de synthèse.',
      toolType: 'veeam_restore',
      toolName: 'Système de Sauvegarde Immuable WORM & Master Re-imaging',
    },
  ]

  const currentStep = steps[stepIdx]

  useEffect(() => {
    if (!isPlaying) {
      narrator.stop()
      return
    }

    let advanceTimeout: any = null
    let textToSpeak = ''

    if (slideType === 'title') {
      textToSpeak = currentStep.voiceTitle
    } else if (slideType === 'map') {
      textToSpeak = currentStep.voiceMap
    } else {
      textToSpeak = currentStep.voiceTool
    }

    narrator.speak(textToSpeak, () => {
      const visualBufferMs = slideType === 'tool' ? 3000 : 1800
      advanceTimeout = setTimeout(() => {
        if (!isPlaying) return

        if (slideType === 'title') {
          sound.playClick()
          setSlideType('map')
        } else if (slideType === 'map') {
          sound.playLaser()
          setSlideType('tool')
        } else {
          if (stepIdx < steps.length - 1) {
            sound.playSuccess()
            setStepIdx((prev) => prev + 1)
            setSlideType('title')
          } else {
            setIsPlaying(false)
            sound.playSuccess()
          }
        }
      }, visualBufferMs)
    })

    return () => {
      if (advanceTimeout) clearTimeout(advanceTimeout)
      narrator.stop()
    }
  }, [isPlaying, stepIdx, slideType])

  const goToStep = (idx: number) => {
    sound.playLaser()
    narrator.stop()
    setStepIdx(idx)
    setSlideType('title')
  }

  const togglePlay = () => {
    sound.playClick()
    setIsPlaying((prev) => !prev)
  }

  const nextSlide = () => {
    sound.playClick()
    narrator.stop()
    if (slideType === 'title') {
      setSlideType('map')
    } else if (slideType === 'map') {
      setSlideType('tool')
    } else {
      if (stepIdx < steps.length - 1) {
        setStepIdx((curr) => curr + 1)
        setSlideType('title')
      }
    }
  }

  const prevSlide = () => {
    sound.playClick()
    narrator.stop()
    if (slideType === 'tool') {
      setSlideType('map')
    } else if (slideType === 'map') {
      setSlideType('title')
    } else {
      if (stepIdx > 0) {
        setStepIdx((curr) => curr - 1)
        setSlideType('tool')
      }
    }
  }

  const toggleVoice = () => {
    const muted = narrator.toggleMute()
    setIsVoiceMuted(muted)
  }

  return (
    <div className="min-h-[90vh] flex flex-col justify-between max-w-[1440px] mx-auto px-4 sm:px-6 py-6 select-none font-sans text-[#393F49] space-y-6">
      {/* 1. Header Bar */}
      <div className="bg-white border border-[#E0E7FF] rounded-2xl px-4 sm:px-6 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => {
              sound.playClick()
              narrator.stop()
            }}
            className="text-[#717783] hover:text-[#393F49] flex items-center gap-1.5 text-xs font-semibold transition"
          >
            <ArrowLeft size={14} />
            <span>Accueil</span>
          </Link>
          <span className="text-[#E0E7FF]">/</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0254EC] status-dot-pulse" />
            <span className="text-xs font-bold text-[#393F49] uppercase tracking-wider">
              PRÉSENTATION OPÉRATIONNELLE // RIPOSTE ENTREPRISE & SOC
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition active:translate-y-[1px] ${
              !isVoiceMuted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                : 'bg-white border-[#E0E7FF] text-[#717783] hover:text-[#393F49]'
            }`}
          >
            {!isVoiceMuted ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{isVoiceMuted ? 'Voix coupée' : 'Voix active'}</span>
          </button>

          <Link
            to="/quiz"
            onClick={() => {
              sound.playClick()
              narrator.stop()
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0254EC] text-white hover:bg-[#0043C7] font-bold transition shadow-sm active:translate-y-[1px]"
          >
            <span>Passer au Quiz</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 2. Main Stage Chassis */}
      <div className="flex-1 flex flex-col justify-center min-h-[500px]">
        <AnimatePresence mode="wait">
          {/* SLIDE TYPE 1: TITLE */}
          {slideType === 'title' && (
            <motion.div
              key={`title-${stepIdx}`}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-white border border-[#E0E7FF] shadow-sm text-center space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F0FF] border border-[#E0E7FF] font-mono text-xs font-bold text-[#0254EC] tracking-widest uppercase">
                <span>PHASE OPÉRATIONNELLE {currentStep.number} / 07</span>
                <span>•</span>
                <span className="text-[#393F49]">{currentStep.actor}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#393F49] uppercase">
                {currentStep.title}
              </h2>

              <p className="text-sm sm:text-base text-[#717783] max-w-2xl mx-auto font-sans leading-relaxed">
                {currentStep.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left text-xs pt-1">
                <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                  <span className="text-[#0254EC] font-bold font-mono block mb-1">SOLUTIONS DÉPLOYÉES :</span>
                  <span className="text-[#393F49] font-medium">{currentStep.solution}</span>
                </div>
                <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                  <span className="text-emerald-700 font-bold font-mono block mb-1">LIVRABLES & SLA :</span>
                  <span className="text-[#393F49] font-medium">{currentStep.sla}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setSlideType('map')}
                  className="px-6 py-2.5 rounded-full bg-[#0254EC] text-white hover:bg-[#0043C7] font-bold text-xs transition shadow-sm flex items-center gap-2 active:translate-y-[1px]"
                >
                  <span>Afficher sur la Carte Réseau</span>
                  <Network size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* SLIDE TYPE 2: NETWORK MAP */}
          {slideType === 'map' && (
            <motion.div
              key={`map-${stepIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-[#E0E7FF] text-xs shadow-sm">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-[#0254EC] uppercase">VUE RÉSEAU EN DIRECT :</span>
                  <span className="text-[#393F49] font-semibold">{currentStep.title}</span>
                </div>
                <button
                  onClick={() => setSlideType('tool')}
                  className="px-4 py-1.5 rounded-full bg-[#0254EC] text-white text-xs font-semibold hover:bg-[#0043C7] transition flex items-center gap-1.5 shadow-sm active:translate-y-[1px]"
                >
                  <span>Passer à l'outil réel</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <NetworkMap mode="enterprise" currentStep={stepIdx} isolatedHost={cableUnplugged || hostIsolated} />
            </motion.div>
          )}

          {/* SLIDE TYPE 3: LIVE TOOL SIMULATOR */}
          {slideType === 'tool' && (
            <motion.div
              key={`tool-${stepIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-[#E0E7FF] text-xs shadow-sm">
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-[#393F49] uppercase">{currentStep.toolName}</span>
                </div>
                <button
                  onClick={() => setSlideType('map')}
                  className="px-4 py-1.5 rounded-full bg-[#F5F0FF] border border-[#E0E7FF] text-[#0254EC] hover:bg-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Network size={13} />
                  <span>Revoir la carte réseau</span>
                </button>
              </div>

              {/* Step 1: Ingestion & Triage L1 */}
              {stepIdx === 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E0E7FF] shadow-sm space-y-5">
                  <div className="flex items-start justify-between border-b border-[#E0E7FF] pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#0254EC] uppercase tracking-widest block">
                        ANALYSEUR DE MESSAGERIE SÉCURISÉE & SIEM // NIVEAU 1
                      </span>
                      <h3 className="text-xl font-black text-[#393F49] tracking-tight mt-0.5">
                        Triage de Campagne Malveillante & Message Trace
                      </h3>
                      <p className="text-xs text-[#717783] mt-0.5">
                        Détection automatique d'une pièce jointe armée ciblant le service RH.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] font-mono text-xs font-bold text-[#DC2626]">
                      ALERTE SIEM L1
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                      <span className="text-[#717783] block text-[10px]">EXPÉDITEUR USURPÉ</span>
                      <span className="text-[#393F49] font-bold">direction-rh@plateforme-paie.online</span>
                    </div>
                    <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                      <span className="text-[#717783] block text-[10px]">PIÈCE JOINTE & TYPE</span>
                      <span className="text-[#DC2626] font-bold">Note_Salaires_2026.docm (Macro)</span>
                    </div>
                    <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                      <span className="text-[#717783] block text-[10px]">HASH SHA-256</span>
                      <span className="text-[#393F49] font-mono text-[11px] truncate block">e3b0c44298fc1c149afbf4c8...</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0F172A] text-slate-300 font-mono text-xs space-y-2 border border-slate-800">
                    <div className="text-emerald-400 font-bold flex items-center gap-2">
                      <Mail size={14} />
                      <span>Message Trace : 1 e-mail délivré dans la boîte de Sophie (RH)</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Recherche transversale globale : 0 autre boîte impactée. Propagation bloquée au périmètre d'entrée.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEmailPurged(true)
                      sound.playSuccess()
                    }}
                    className={`w-full py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition shadow-sm active:translate-y-[1px] flex items-center justify-center gap-2 ${
                      emailPurged
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                    }`}
                  >
                    {emailPurged ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>✓ Campagne Purge Globale Effectuée (Délai &lt; 15 min respecté)</span>
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        <span>Déclencher la Purge Globale de la Campagne sur le Tenant</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: Détection EDR & Confinement L2 */}
              {stepIdx === 1 && (
                <div className="relative">
                  <VisualPointer
                    label="CONSTAT & CONFINEMENT : Isoler l'hôte tout en maintenant le PC allumé pour la RAM"
                    direction="down"
                    color="blue"
                    className="absolute top-2 left-10"
                  />
                  <EdrConsoleSimulator
                    onHostIsolatedChange={(isolated) => setHostIsolated(isolated)}
                  />
                </div>
              )}

              {/* Step 3: Riposte Périmétrique & IAM */}
              {stepIdx === 2 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E0E7FF] shadow-sm space-y-5">
                  <div className="flex items-start justify-between border-b border-[#E0E7FF] pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#0254EC] uppercase tracking-widest block">
                        RIPOSTE PÉRIMÉTRIQUE & CONTRÔLE D'ACCÈS // SÉCURITÉ RÉSEAU & IAM
                      </span>
                      <h3 className="text-xl font-black text-[#393F49] tracking-tight mt-0.5">
                        Blocage Pare-Feu C2 & Révocation Globale des Sessions IAM
                      </h3>
                      <p className="text-xs text-[#717783] mt-0.5">
                        Verrouillage étanche du périmètre sortant et invalidation des jetons d'authentification compromis.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] font-mono text-xs font-bold text-[#0254EC]">
                      SLA &lt; 2H
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Bloc Pare-Feu NGFW */}
                    <div className="p-5 rounded-2xl bg-[#F8F4FF] border border-[#E0E7FF] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#393F49] flex items-center gap-1.5">
                          <Network size={15} className="text-[#0254EC]" />
                          Pare-Feu de Nouvelle Génération (NGFW)
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          firewallBlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {firewallBlocked ? 'RÈGLE APPLIQUÉE' : 'EN ATTENTE'}
                        </span>
                      </div>
                      <p className="text-xs text-[#717783]">
                        Cible C2 : IP <span className="font-mono text-[#DC2626] font-bold">185.22.14.89</span> (Port 443 HTTPS). Inscription immédiate en liste noire périmétrique et blocage DNS.
                      </p>
                      <button
                        onClick={() => {
                          setFirewallBlocked(true)
                          sound.playSuccess()
                        }}
                        className={`w-full py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition ${
                          firewallBlocked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0254EC] text-white hover:bg-[#0043C7]'
                        }`}
                      >
                        {firewallBlocked ? '✓ Flux Sortant C2 Interrompu' : 'Bloquer IP & Domaine C2'}
                      </button>
                    </div>

                    {/* Bloc IAM */}
                    <div className="p-5 rounded-2xl bg-[#F8F4FF] border border-[#E0E7FF] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#393F49] flex items-center gap-1.5">
                          <KeyRound size={15} className="text-emerald-700" />
                          Gestion des Identités & Accès (IAM)
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          iamRevoked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {iamRevoked ? 'SESSIONS RÉVOQUÉES' : 'EN ATTENTE'}
                        </span>
                      </div>
                      <p className="text-xs text-[#717783]">
                        Compte ciblé : <span className="font-mono text-[#393F49] font-bold">DA_admin</span>. Révocation des tickets Kerberos TGT et réinitialisation mot de passe + MFA obligatoire.
                      </p>
                      <button
                        onClick={() => {
                          setIamRevoked(true)
                          sound.playSuccess()
                        }}
                        className={`w-full py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition ${
                          iamRevoked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0254EC] text-white hover:bg-[#0043C7]'
                        }`}
                      >
                        {iamRevoked ? '✓ Jetons Révoqués & MFA Ré-enrôlé' : 'Révoquer Jetons & Forcer Reset'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Chasse Réseau & Blocage d'Exfiltration */}
              {stepIdx === 3 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E0E7FF] shadow-sm space-y-5">
                  <div className="flex items-start justify-between border-b border-[#E0E7FF] pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#DC2626] uppercase tracking-widest block">
                        ANALYSEUR DE TRAFIC RÉSEAU (NDR) & THREAT HUNTING
                      </span>
                      <h3 className="text-xl font-black text-[#393F49] tracking-tight mt-0.5">
                        Détection d'Anomalie de Trafic & Rupture de Fuite de Données
                      </h3>
                      <p className="text-xs text-[#717783] mt-0.5">
                        Identification de volumes d'upload inhabituels depuis le serveur de fichiers vers l'extérieur.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] font-mono text-xs font-bold text-[#DC2626]">
                      ANOMALIE NDR CRITIQUE
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F172A] text-slate-200 font-mono text-xs space-y-3 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                      <span>SONDE NDR : CAPTEUR-LAN-01 (VLAN SERVEURS)</span>
                      <span className="text-rose-400 font-bold">ALERTE EXFILTRATION DÉTECTÉE</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Volume Sortant Inhabituel :</span>
                        <span className="text-rose-400 font-bold">42 Go (Upload chiffré TLS multi-flux)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dossiers ciblés :</span>
                        <span className="text-white">\\FS-CORP\Partages\RH &amp; \Finances</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Statut de la fuite :</span>
                        <span className={exfilCut ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold animate-pulse'}>
                          {exfilCut ? 'FLUX COMPLÈTEMENT SECTIONNÉ - PÉRIMÈTRE CIRCONSCRIT' : 'TRANSFERT EN COURS D\'INTERCEPTION'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setExfilCut(true)
                      sound.playSuccess()
                    }}
                    className={`w-full py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition shadow-sm active:translate-y-[1px] flex items-center justify-center gap-2 ${
                      exfilCut
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                    }`}
                  >
                    {exfilCut ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>✓ Canaux d'Exfiltration Interrompus & Partages Verrouillés</span>
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        <span>Sectionner Immédiatement les Flux Sortants Suspects</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step 5: Forensique L3 & Mobilisation Crise */}
              {stepIdx === 4 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E0E7FF] shadow-sm space-y-5">
                  <div className="flex items-start justify-between border-b border-[#E0E7FF] pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#0254EC] uppercase tracking-widest block">
                        ANALYSE MÉDICO-LÉGALE EN DIRECT // DFIR NIVEAU 3
                      </span>
                      <h3 className="text-xl font-black text-[#393F49] tracking-tight mt-0.5">
                        Acquisition à Chaud de la Mémoire RAM & Triage Disque
                      </h3>
                      <p className="text-xs text-[#717783] mt-0.5">
                        Capture des preuves volatiles sur l'hôte maintenu sous tension avant toute intervention destructive.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] font-mono text-xs font-bold text-[#0254EC]">
                      PREUVE VOLATILE
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                      <span className="text-[#717783] block text-[10px]">IMAGE RAM ($DUMP)</span>
                      <span className="text-[#393F49] font-bold">16 Go bruts acquis (Clés AES & DLL injectées)</span>
                    </div>
                    <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                      <span className="text-[#717783] block text-[10px]">TRIAGE DU DISQUE</span>
                      <span className="text-[#393F49] font-bold">$MFT, Shimcache, Journaux Sysmon / Sec</span>
                    </div>
                    <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                      <span className="text-[#717783] block text-[10px]">CELLULE DE CRISE</span>
                      <span className="text-emerald-700 font-bold">Directeur Général, RSSI, DSI & Juriste</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setRamCaptured(true)
                      sound.playSuccess()
                    }}
                    className={`w-full py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition shadow-sm active:translate-y-[1px] flex items-center justify-center gap-2 ${
                      ramCaptured
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0254EC] text-white hover:bg-[#0043C7]'
                    }`}
                  >
                    {ramCaptured ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>✓ Empreinte Forensique RAM Acquise & Cellule de Crise Notifiée</span>
                      </>
                    ) : (
                      <>
                        <Activity size={16} />
                        <span>Lancer l'Acquisition RAM à Chaud & Convoquer la Cellule de Crise</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step 6: Décision Stratégique & Conformité (DGSSI / CNDP) */}
              {stepIdx === 5 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E0E7FF] shadow-sm space-y-5">
                  <div className="flex items-start gap-4 border-b border-[#E0E7FF] pb-4">
                    <div className="p-3.5 rounded-2xl bg-[#F8F4FF] border border-[#E0E7FF] text-[#393F49]">
                      <PhoneCall size={28} className="text-[#DC2626] animate-pulse" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-[#717783] uppercase tracking-widest">
                        HOTLINE CELLULE DE CRISE // DIRECTION GÉNÉRALE & CONFORMITÉ
                      </span>
                      <h3 className="text-xl font-black text-[#393F49] tracking-tight mt-0.5">
                        Arbitrage Institutionnel : Faut-il Payer la Rançon ?
                      </h3>
                      <p className="text-xs text-[#717783] mt-0.5">
                        « Les attaquants exigent 15 Bitcoins sous 72 heures sous peine de divulgation des dossiers RH et financiers. Quelle est la doctrine officielle ? »
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        sound.playSuccess()
                        setDgChoice('refuse')
                        narrator.speak('Décision conforme à la doctrine DGSSI et au maCERT : refus formel de tout paiement de rançon et déclarations réglementaires immédiates.')
                      }}
                      className={`p-5 rounded-2xl border text-left font-sans transition active:translate-y-[1px] ${
                        dgChoice === 'refuse'
                          ? 'bg-[#ECFDF5] border-[#059669] shadow-sm'
                          : 'bg-white border-[#E0E7FF] hover:border-[#0254EC]'
                      }`}
                    >
                      <div className="text-[#059669] font-mono font-black text-sm mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 size={16} />
                        <span>REFUSER DE PAYER (DOCTRINE DGSSI / maCERT)</span>
                      </div>
                      <p className="text-xs text-[#717783] leading-relaxed">
                        Doctrine officielle nationale : zéro paiement, notification de violation de données à caractère personnel à la <strong>CNDP</strong> sous 72h, déclaration à la <strong>DGSSI / maCERT</strong>, et dépôt de plainte judiciaire.
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        sound.playAlarm()
                        setDgChoice('pay')
                        narrator.speak('Attention : payer la rançon est formellement interdit et déconseillé par la DGSSI.')
                      }}
                      className={`p-5 rounded-2xl border text-left font-sans transition active:translate-y-[1px] ${
                        dgChoice === 'pay'
                          ? 'bg-[#FEF2F2] border-[#DC2626] shadow-sm'
                          : 'bg-white border-[#E0E7FF] hover:border-[#DC2626]'
                      }`}
                    >
                      <div className="text-[#DC2626] font-mono font-black text-sm mb-1.5 flex items-center gap-1.5">
                        <X size={16} />
                        <span>PAYER LA RANÇON EN BITCOINS</span>
                      </div>
                      <p className="text-xs text-[#717783] leading-relaxed">
                        Piège fatal formellement réprouvé : finance le terrorisme cyber, aucune garantie de restitution des données, ré-attaque statistique garantie dans les 6 mois et sanctions légales.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 7: Éradication, Restauration & Retex */}
              {stepIdx === 6 && (
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E0E7FF] shadow-sm flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-3.5 h-3.5 rounded-full ${reimaged ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <div>
                        <span className="font-bold text-[#393F49] block">RE-IMAGING SUR MASTER CERTIFIÉ DURCI</span>
                        <span className="text-[#717783] text-[11px]">
                          {reimaged ? 'Postes clients réinstallés à neuf à partir du master d\'entreprise certifié' : 'Reconstruction préalable nécessaire avant reconnexion au réseau'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setReimaged(true)
                        sound.playSuccess()
                      }}
                      className={`px-4 py-2 rounded-full font-bold uppercase transition shadow-sm ${
                        reimaged ? 'bg-emerald-600 text-white' : 'bg-[#0254EC] text-white hover:bg-[#0043C7]'
                      }`}
                    >
                      {reimaged ? '✓ Master Appliqué' : 'Appliquer le Master Sain'}
                    </button>
                  </div>

                  <div className="relative">
                    <VisualPointer
                      label="LANCER : Restauration des volumes d'entreprise depuis le coffre WORM"
                      direction="down"
                      color="emerald"
                      className="absolute top-2 right-12"
                    />
                    <VeeamConsoleSimulator />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Presenter Remote Control Bar */}
      <div className="bg-white rounded-2xl border border-[#E0E7FF] p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        {/* Step Selectors */}
        <div className="flex flex-wrap items-center gap-1.5">
          {steps.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => goToStep(idx)}
              className={`px-3.5 py-1.5 rounded-full font-bold border transition active:translate-y-[1px] ${
                stepIdx === idx
                  ? 'bg-[#0254EC] text-white border-[#0254EC] shadow-sm'
                  : 'bg-[#F8F4FF] text-[#717783] hover:text-[#393F49] border-[#E0E7FF]'
              }`}
            >
              <span>{st.number}</span>
              <span className="hidden md:inline ml-1">{st.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Sub-slide Selector */}
        <div className="flex items-center gap-1 bg-[#F8F4FF] p-1 rounded-full border border-[#E0E7FF]">
          <button
            onClick={() => {
              sound.playClick()
              setSlideType('title')
            }}
            className={`px-3 py-1 rounded-full font-bold transition ${
              slideType === 'title' ? 'bg-[#0254EC] text-white shadow-xs' : 'text-[#717783] hover:text-[#393F49]'
            }`}
          >
            1. Titre
          </button>
          <button
            onClick={() => {
              sound.playClick()
              setSlideType('map')
            }}
            className={`px-3 py-1 rounded-full font-bold transition ${
              slideType === 'map' ? 'bg-[#0254EC] text-white shadow-xs' : 'text-[#717783] hover:text-[#393F49]'
            }`}
          >
            2. Carte
          </button>
          <button
            onClick={() => {
              sound.playClick()
              setSlideType('tool')
            }}
            className={`px-3 py-1 rounded-full font-bold transition ${
              slideType === 'tool' ? 'bg-emerald-600 text-white shadow-xs' : 'text-[#717783] hover:text-[#393F49]'
            }`}
          >
            3. Outil
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevSlide}
            disabled={stepIdx === 0 && slideType === 'title'}
            className="p-2 rounded-full bg-white text-[#717783] hover:text-[#393F49] disabled:opacity-30 border border-[#E0E7FF] shadow-sm active:translate-y-[1px]"
            title="Précédent"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={togglePlay}
            className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 border transition shadow-sm active:translate-y-[1px] ${
              isPlaying
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-[#0254EC] text-white border-[#0254EC] hover:bg-[#0043C7]'
            }`}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
          </button>

          <button
            onClick={nextSlide}
            disabled={stepIdx === steps.length - 1 && slideType === 'tool'}
            className="p-2 rounded-full bg-white text-[#717783] hover:text-[#393F49] disabled:opacity-30 border border-[#E0E7FF] shadow-sm active:translate-y-[1px]"
            title="Suivant"
          >
            <SkipForward size={14} />
          </button>

          <button
            onClick={() => {
              sound.playLaser()
              goToStep(0)
            }}
            className="p-2 rounded-full bg-white text-[#717783] hover:text-[#393F49] border border-[#E0E7FF] shadow-sm active:translate-y-[1px]"
            title="Réinitialiser"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

