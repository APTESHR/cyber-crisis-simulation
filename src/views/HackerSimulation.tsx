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
  Skull,
  Network,
  Monitor,
  Eye,
  Sparkles,
  ShieldAlert,
  Clock,
  Terminal,
} from 'lucide-react'
import { sound } from '../utils/audio'
import { narrator } from '../utils/voice'
import NetworkMap from '../components/NetworkMap'
import VisualPointer from '../components/VisualPointer'
import OutlookSimulator from '../components/simulators/OutlookSimulator'
import LinuxTerminalSimulator from '../components/simulators/LinuxTerminalSimulator'
import WindowsDesktopSimulator from '../components/simulators/WindowsDesktopSimulator'

export default function HackerSimulation() {
  const [stepIdx, setStepIdx] = useState<number>(0)
  const [slideType, setSlideType] = useState<'title' | 'map' | 'tool'>('title')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(narrator.isMuted())

  useEffect(() => {
    const unsub = narrator.subscribe((muted) => setIsVoiceMuted(muted))
    return () => unsub()
  }, [])

  const steps = [
    {
      id: 0,
      number: '01',
      title: 'Accès Initial (Phishing RH)',
      subtitle: 'Spear-phishing ciblé sur poste RH avec pièce jointe piégée et macro malveillante.',
      mitre: 'Initial Access (T1566.001)',
      target: 'Poste Collaborateur RH (Sophie)',
      result: 'Exécution locale de la charge utile sans alerte visible pour l\'utilisateur.',
      voiceTitle: 'Étape 1 : Accès Initial. Spear-phishing ciblé sur le poste RH avec pièce jointe piégée contenant une macro malveillante.',
      voiceMap: 'Sur la cartographie : le courriel traverse la passerelle de messagerie et infecte le poste de travail RH.',
      voiceTool: 'Sur le poste utilisateur, le document s\'ouvre. L\'activation de la macro déclenche immédiatement la chaîne d\'infection.',
      toolType: 'outlook',
      toolName: 'Messagerie & Document Piégé',
    },
    {
      id: 1,
      number: '02',
      title: 'Exécution & Évasion Défensive',
      subtitle: 'Processus PowerShell obfusqué en base64, contournement en mémoire vive d\'AMSI et neutralisation des logs.',
      mitre: 'Execution (T1059.001) / Defense Evasion (T1562.001)',
      target: 'Processus système local & Mémoire vive',
      result: 'Environnement local neutralisé; exécution furtive validée.',
      voiceTitle: 'Étape 2 : Exécution et évasion défensive. La macro lance un processus PowerShell obfusqué et contourne l\'interface AMSI.',
      voiceMap: 'Regardez la cartographie : le code s\'exécute en mémoire vive sur le poste hôte en contournant les défenses locales.',
      voiceTool: 'Dans la console : AMSI est neutralisé en mémoire vive et la journalisation locale est altérée pour garantir la furtivité.',
      toolType: 'terminal_amsi',
      toolName: 'Interpréteur de Commandes & Module d\'Évasion AMSI',
    },
    {
      id: 2,
      number: '03',
      title: 'Commande & Contrôle (C2)',
      subtitle: 'Évasion réseau via un canal chiffré sortant HTTPS sur le port 443 vers l\'infrastructure C2 distante.',
      mitre: 'Command & Control (T1071.001)',
      target: 'Poste RH -> Serveur C2 Distant',
      result: 'Session distante établie; prise de contrôle interactive de la machine hôte.',
      voiceTitle: 'Étape 3 : Commande et contrôle. Établissement d\'un flux chiffré sortant HTTPS vers l\'infrastructure C2 distante.',
      voiceMap: 'Sur la carte du réseau : un canal chiffré sortant traverse le pare-feu vers l\'infrastructure de commande distante.',
      voiceTool: 'Dans la console : la session interactive de contrôle s\'ouvre, offrant un pilotage à distance complet du poste.',
      toolType: 'terminal_c2',
      toolName: 'Interpréteur C2 / Gestionnaire d\'Écoute HTTPS',
    },
    {
      id: 3,
      number: '04',
      title: 'Vol d\'Identifiants Administrateur',
      subtitle: 'Extraction en mémoire vive (RAM) du processus lsass.exe pour collecter les hashs NTLM du compte Administrateur.',
      mitre: 'Credential Access (T1003.001)',
      target: 'Processus LSASS & Mémoire Vive (RAM)',
      result: 'Récupération des hashs NTLM du compte Administrateur du Domaine.',
      voiceTitle: 'Étape 4 : Vol d\'identifiants. Extraction en mémoire vive des condensats du compte administrateur du domaine.',
      voiceMap: 'Sur la cartographie : l\'attaquant extrait les privilèges administratifs pour préparer la traversée vers le domaine.',
      voiceTool: 'Voyez le module d\'extraction mémoire : le hash NTLM de l\'administrateur du domaine est dérobé.',
      toolType: 'terminal_lsass',
      toolName: 'Module d\'Extraction Mémoire LSASS',
    },
    {
      id: 4,
      number: '05',
      title: 'Déplacement Latéral (SMB / WMI)',
      subtitle: 'Propagation réseau via Pass-the-Hash sur le port SMB 445 et commandes distantes WMI/RPC.',
      mitre: 'Lateral Movement (T1550.002)',
      target: 'Serveur de Fichiers Central FS-CORP',
      result: 'Élévation des droits et compromission du serveur de fichiers central.',
      voiceTitle: 'Étape 5 : Déplacement latéral. L\'attaquant utilise les identifiants volés pour se propager au serveur de fichiers central.',
      voiceMap: 'Regardez la propagation : le flux SMB traverse le réseau interne pour infecter le serveur de fichiers.',
      voiceTool: 'Dans la console : l\'outil de propagation SMB valide l\'accès administrateur total sur le serveur de fichiers de production.',
      toolType: 'terminal_smb',
      toolName: 'Outil de Propagation SMB / RPC',
    },
    {
      id: 5,
      number: '06',
      title: 'Exfiltration Furtive (Double Extorsion)',
      subtitle: 'Compression et chiffrement des répertoires sensibles RH/Finances, transfert vers un stockage distant.',
      mitre: 'Exfiltration (T1567.002)',
      target: 'Données Stratégiques RH, Finances & Direction',
      result: 'Exfiltration réussie des données confidentielles comme levier de chantage.',
      voiceTitle: 'Étape 6 : Exfiltration furtive pour double extorsion. Vol des données stratégiques avant tout sabotage.',
      voiceMap: 'Sur la carte : les flux sortants acheminent les archives chiffrées vers le cloud de l\'attaquant avant le chiffrement.',
      voiceTool: 'Voyez la console d\'exfiltration : 42 gigaoctets de données hautement confidentielles sont dérobés pour servir d\'extorsion.',
      toolType: 'terminal_exfil',
      toolName: 'Module d\'Exfiltration Chiffrée',
    },
    {
      id: 6,
      number: '07',
      title: 'Sabotage & Chiffrement Rançongiciel',
      subtitle: 'Suppression des clichés instantanés vssadmin, arrêt des bases de données, chiffrement et note de rançon 72h.',
      mitre: 'Impact (T1486 / T1490)',
      target: 'Volumes Partagés FS-CORP & Systèmes Locaux',
      result: 'Partages chiffrés; note de rançon déposée réclamant le paiement sous 72 heures.',
      voiceTitle: 'Étape 7 : Sabotage et chiffrement rançongiciel. Destruction des sauvegardes locales et verrouillage des volumes.',
      voiceMap: 'Sur la carte : le serveur de fichiers passe en rouge critique, totalement inaccessible.',
      voiceTool: 'Sur l\'écran : tous les fichiers sont renommés en extension locked et les instructions de rançon sont affichées.',
      toolType: 'explorer_lock',
      toolName: 'Détonateur Rançongiciel & Explorateur Verrouillé',
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#BE185D] status-dot-pulse" />
            <span className="text-xs font-bold text-[#393F49] uppercase tracking-wider">
              RECONSTITUTION OFFENSIVE // VUE ATTAQUANT KALI C2
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
            to="/enterprise"
            onClick={() => {
              sound.playClick()
              narrator.stop()
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0254EC] text-white hover:bg-[#0043C7] font-bold transition shadow-sm active:translate-y-[1px]"
          >
            <span>Vue Entreprise & SOC</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 2. Main Stage */}
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] font-mono text-xs font-bold text-[#BE185D] tracking-widest uppercase">
                <span>VECTEUR OFFENSIF {currentStep.number} / 07</span>
                <span>•</span>
                <span className="text-[#393F49]">{currentStep.mitre}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#393F49] uppercase">
                {currentStep.title}
              </h2>

              <p className="text-sm sm:text-base text-[#717783] max-w-2xl mx-auto font-sans leading-relaxed">
                {currentStep.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left text-xs pt-1">
                <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                  <span className="text-[#BE185D] font-bold font-mono block mb-1">CIBLE & VECTEUR :</span>
                  <span className="text-[#393F49] font-medium">{currentStep.target}</span>
                </div>
                <div className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF]">
                  <span className="text-[#0254EC] font-bold font-mono block mb-1">RÉSULTAT OPÉRATIONNEL :</span>
                  <span className="text-[#393F49] font-medium">{currentStep.result}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setSlideType('map')}
                  className="px-6 py-3 rounded-full bg-[#0254EC] hover:bg-[#0043C7] text-white font-bold text-xs sm:text-sm shadow-[0_2px_8px_rgba(2,84,236,0.25)] flex items-center gap-2 transition"
                >
                  <span>Visualiser la Propagation Réseau</span>
                  <Network size={15} />
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
                  <span className="font-bold text-[#BE185D] uppercase">VECTEUR EN COURS :</span>
                  <span className="text-[#393F49] font-semibold">{currentStep.title}</span>
                </div>
                <button
                  onClick={() => setSlideType('tool')}
                  className="px-4 py-1.5 rounded-full bg-[#0254EC] text-white text-xs font-semibold hover:bg-[#0043C7] transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Passer à l'outil attaquant</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <NetworkMap mode="hacker" currentStep={stepIdx} />
            </motion.div>
          )}

          {/* SLIDE TYPE 3: LIVE SIMULATOR */}
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
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#BE185D] animate-pulse" />
                  <span className="font-bold text-[#393F49] uppercase font-mono">{currentStep.toolName}</span>
                </div>
                <button
                  onClick={() => setSlideType('map')}
                  className="px-4 py-1.5 rounded-full bg-[#F5F0FF] border border-[#E0E7FF] text-[#0254EC] hover:bg-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Network size={13} />
                  <span>Revoir la carte réseau</span>
                </button>
              </div>

              {stepIdx === 0 && (
                <div className="relative">
                  <VisualPointer
                    label="CLIQUER : Activer le contenu (Macros Word)"
                    direction="down"
                    color="amber"
                    className="absolute top-2 left-28"
                  />
                  <OutlookSimulator />
                </div>
              )}

              {stepIdx === 1 && <LinuxTerminalSimulator stageId={1} />}
              {stepIdx === 2 && <LinuxTerminalSimulator stageId={2} />}
              {stepIdx === 3 && <LinuxTerminalSimulator stageId={3} />}
              {stepIdx === 4 && <LinuxTerminalSimulator stageId={4} />}
              {stepIdx === 5 && <LinuxTerminalSimulator stageId={5} />}
              {stepIdx === 6 && (
                <div className="space-y-4">
                  <LinuxTerminalSimulator stageId={6} />
                  <WindowsDesktopSimulator mode="explorer" />
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
                  : 'bg-[#F5F0FF] text-[#717783] hover:text-[#393F49] border-[#E0E7FF]'
              }`}
            >
              <span>{st.number}</span>
              <span className="hidden md:inline ml-1">{st.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Sub-slide Selector */}
        <div className="flex items-center gap-1 bg-[#F5F0FF] p-1 rounded-full border border-[#E0E7FF]">
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
              slideType === 'tool' ? 'bg-[#0254EC] text-white shadow-xs' : 'text-[#717783] hover:text-[#393F49]'
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
            className="p-2 rounded-full bg-white text-[#717783] hover:text-[#393F49] disabled:opacity-30 border border-[#E0E7FF] shadow-xs active:translate-y-[1px]"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={togglePlay}
            className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 border transition shadow-sm active:translate-y-[1px] ${
              isPlaying
                ? 'bg-[#FDF2F8] text-[#BE185D] border-[#FBCFE8]'
                : 'bg-[#0254EC] text-white border-[#0254EC]'
            }`}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
          </button>

          <button
            onClick={nextSlide}
            disabled={stepIdx === steps.length - 1 && slideType === 'tool'}
            className="p-2 rounded-full bg-white text-[#717783] hover:text-[#393F49] disabled:opacity-30 border border-[#E0E7FF] shadow-xs active:translate-y-[1px]"
          >
            <SkipForward size={14} />
          </button>

          <button
            onClick={() => {
              sound.playLaser()
              goToStep(0)
            }}
            className="p-2 rounded-full bg-white text-[#717783] hover:text-[#393F49] border border-[#E0E7FF] shadow-xs active:translate-y-[1px]"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

