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
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Network,
  Terminal,
  Server,
  Zap,
  Check,
  Building2,
  FileText,
  Activity,
  KeyRound,
  Mail,
  HardDrive,
  Cpu,
  Lock,
  Globe,
} from 'lucide-react'
import { sound } from '../utils/audio'
import { narrator } from '../utils/voice'
import NetworkMap from '../components/NetworkMap'

export default function DualAttackDefenseSimulation() {
  const [phaseIdx, setPhaseIdx] = useState<number>(0)
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'table'>('split')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(narrator.isMuted())
  const [offensiveTriggered, setOffensiveTriggered] = useState<boolean>(false)
  const [defensiveCountered, setDefensiveCountered] = useState<boolean>(false)

  useEffect(() => {
    const unsub = narrator.subscribe((muted) => setIsVoiceMuted(muted))
    return () => unsub()
  }, [])

  const phases = [
    {
      id: 0,
      number: '01',
      title: 'Infiltration & Campagne vs. Détection & Purge L1',
      objective: 'Neutraliser la propagation initiale par messagerie avant exécution massive.',
      mitre: 'T1566.001 (Spear-phishing Attachment)',
      sla: '< 15-30 minutes',
      attack: {
        actor: 'Opérateur Rançongiciel',
        title: 'Spear-Phishing Ciblé RH & Macro Masquée',
        description: 'Envoi d\'un courriel d\'usurpation de la paie avec pièce jointe piégée Note_Salaires_2026.docm contenant une macro malveillante armée.',
        tool: 'Générateur de Charge & Relais SMTP Furtif',
        status: 'CAMPAGNE DÉPLOYÉE',
        telemetry: [
          'root@sec-c2:~# swaks --to rh@entreprise.com --from "direction-rh@plateforme-paie.online" --attach Note_Salaires_2026.docm',
          '=== 250 2.0.0 OK Message accepté par passerelle de messagerie',
          'E-mail délivré sur le poste RH de Sophie (09h14)',
        ],
      },
      defense: {
        actor: 'Analyste SOC Niveau 1',
        title: 'Triage SIEM & Purge Globale Messagerie',
        description: 'Détection de la campagne par la passerelle de messagerie & le SIEM; extraction des métadonnées (expéditeur, hash SHA-256) et purge globale immédiate sur le tenant.',
        tool: 'SIEM & Passerelle de Messagerie Sécurisée',
        status: 'CAMPAGNE NEUTRALISÉE',
        telemetry: [
          'SIEM Alert L1 : Pièce jointe malveillante détectée (Hash e3b0c442...)',
          'Recherche Message Trace globale : 1 seule boîte réceptrice touchée (Sophie)',
          'Purge globale automatisée déclenchée sur 1 200 boîtes aux lettres',
        ],
      },
      voice: 'Phase 1 : Infiltration et campagne. L\'attaquant tente un spear-phishing ciblé sur le poste RH. Le SOC niveau 1 détecte la campagne, extrait le hash malveillant et déclenche la purge globale sur l\'ensemble des boîtes.',
    },
    {
      id: 1,
      number: '02',
      title: 'Détonation & Évasion vs. Détection Comportementale EDR',
      objective: 'Détection précoce en mémoire vive avant ancrage persistant sur l\'hôte.',
      mitre: 'T1059.001 (PowerShell) / T1562.001 (Impair Defenses / AMSI)',
      sla: '< 1 heure',
      attack: {
        actor: 'Agent de Détonation Local',
        title: 'PowerShell Obfusqué & Évasion AMSI',
        description: 'La macro exécute un processus PowerShell masqué en base64; contournement en mémoire vive de l\'interface AMSI et altération des journaux locaux.',
        tool: 'Interpréteur PowerShell & Module d\'Évasion AMSI',
        status: 'AMSI CONTOURNÉ EN RAM',
        telemetry: [
          'PS C:\\Users\\sophie> powershell.exe -NoP -NonI -W Hidden -Enc SQBFAFgAIAA...',
          '[!] AMSI (Antimalware Scan Interface) contourné en mémoire vive',
          '[+] Journalisation locale des scripts altérée pour neutraliser les logs',
        ],
      },
      defense: {
        actor: 'Analyste SOC L2 / Réponse à Incident',
        title: 'Détection Arbre de Processus EDR / XDR',
        description: 'Détection comportementale temps réel de l\'arborescence suspecte WINWORD.EXE vers cmd.exe et powershell.exe; corrélation instantanée par les capteurs EDR.',
        tool: 'Solution EDR / XDR Opérationnelle',
        status: 'ARBRE SUSPECT CORRÉLÉ',
        telemetry: [
          'EDR Detection Alert : Anomalous execution tree (WINWORD -> cmd.exe -> powershell.exe)',
          'Score de sévérité MITRE : 9.8 / 10 (CRITIQUE)',
          'Alerte transmise au SOC L2 pour confinement immédiat',
        ],
      },
      voice: 'Phase 2 : Détonation et évasion. Le code pirate contourne l\'interface AMSI en mémoire vive, mais la solution EDR repère immédiatement l\'arborescence de processus anormale.',
    },
    {
      id: 2,
      number: '03',
      title: 'Prise de Contrôle C2 vs. Confinement EDR & Pare-Feu',
      objective: 'Rompre le canal de communication externe sans détruire les preuves volatiles en RAM.',
      mitre: 'T1071.001 (Web Protocols / HTTPS C2)',
      sla: '< 1-2 heures',
      attack: {
        actor: 'Opérateur C2 Externe',
        title: 'Établissement du Tunnel Reverse HTTPS (443)',
        description: 'Établissement d\'un flux chiffré sortant HTTPS vers l\'infrastructure C2 distante (185.22.14.89) pour obtenir une session interactive de contrôle à distance.',
        tool: 'Interpréteur C2 / Gestionnaire d\'Écoute HTTPS',
        status: 'SESSION C2 INTERACTIVE',
        telemetry: [
          'root@sec-c2:~# c2-handler --listen --proto https --port 443',
          '[+] Connexion entrante reçue depuis 192.168.10.45:49812 (HOST-SOPHIE-01)',
          '[!] Contrôle interactif à distance validé (Contexte: ENTREPRISE\\sophie.rh)',
        ],
      },
      defense: {
        actor: 'Ingénieur SOC / Sécurité Réseau',
        title: 'Isolement Logique EDR & Blocage Pare-Feu',
        description: 'Déclenchement immédiat de l\'isolement logique réseau du poste de travail via l\'EDR tout en maintenant le PC sous tension. Inscription de l\'IP C2 en liste noire pare-feu.',
        tool: 'Console EDR & Pare-Feu NGFW',
        status: 'HÔTE CONFINÉ & FLUX C2 COUPÉ',
        telemetry: [
          'EDR Action : Host Network Isolation engaged on HOST-SOPHIE-01',
          'Consigne critique appliquée : Machine maintenue sous tension pour préserver la RAM',
          'Pare-Feu NGFW : Règle de blocage drop immédiat sur 185.22.14.89:443',
        ],
      },
      voice: 'Phase 3 : Prise de contrôle et confinement. L\'attaquant ouvre un tunnel HTTPS vers son serveur C2. Le SOC isole immédiatement l\'ordinateur du réseau sans l\'éteindre, tout en bloquant l\'adresse IP pirate sur le pare-feu.',
    },
    {
      id: 3,
      number: '04',
      title: 'Vol d\'Identifiants vs. Révocation Globale IAM',
      objective: 'Empêcher l\'utilisation des identifiants compromis pour verrouiller l\'Active Directory.',
      mitre: 'T1003.001 (OS Credential Dumping / LSASS)',
      sla: '< 2 heures',
      attack: {
        actor: 'Module d\'Élévation de Privilèges',
        title: 'Extraction Mémoire Vive LSASS & Tickets Kerberos',
        description: 'Injection dans le processus système local lsass.exe pour collecter les condensats d\'authentification et tickets Kerberos actifs du compte DA_admin.',
        tool: 'Module d\'Extraction Mémoire LSASS',
        status: 'HASH NTLM ADMINISTRATEUR DÉROBÉ',
        telemetry: [
          'c2-agent [1] > inject-mem-module --target lsass.exe --action dump-hashes',
          '[!] NTLM HASH : 8846f7eaee8fb117ad06bdd830b7586c (DA_admin)',
          '[+] Privilèges Administrateur du Domaine ciblés',
        ],
      },
      defense: {
        actor: 'Administrateur IAM & Sécurité des Accès',
        title: 'Révocation Sessions OAuth/Kerberos & Reset MFA',
        description: 'Révocation globale des jetons de session Kerberos TGT par double reset du compte KRBTGT; réinitialisation d\'urgence des mots de passe DA et forçage MFA.',
        tool: 'Active Directory & Gestionnaire des Accès IAM',
        status: 'JETONS INVALIDÉS & ACCÈS RÉVOQUÉS',
        telemetry: [
          'IAM Action : Double réinitialisation du compte Active Directory KRBTGT exécutée',
          '100% des tickets Kerberos TGT et sessions OAuth en cours révoqués',
          'Mot de passe DA_admin réinitialisé et ré-enrôlement MFA obligatoire appliqué',
        ],
      },
      voice: 'Phase 4 : Vol d\'identifiants et révocation. L\'attaquant tente d\'extraire les hashs de la mémoire LSASS. Les équipes IAM invalident tous les tickets Kerberos du domaine et bloquent les comptes à privilèges.',
    },
    {
      id: 4,
      number: '05',
      title: 'Rebond Latéral SMB vs. Détection NDR & Anti-Propagation',
      objective: 'Stopper l\'expansion latérale vers les serveurs de fichiers et bases de données de production.',
      mitre: 'T1550.002 (Pass the Hash / SMB 445)',
      sla: '< 2-3 heures',
      attack: {
        actor: 'Module de Propagation Réseau',
        title: 'Rebond Latéral Pass-the-Hash SMB (Port 445)',
        description: 'Tentative de propagation automatisée via SMB et commandes distantes WMI/RPC pour compromettre le serveur de fichiers central FS-CORP.',
        tool: 'Outil de Propagation SMB / RPC',
        status: 'TENTATIVE DE REBOND LATÉRAL',
        telemetry: [
          'root@sec-c2:~# smb-spread 192.168.10.0/24 -u DA_admin -H 8846f7ea...',
          'SMB 192.168.10.20:445 FS-CORP-01 [*] Tentative de connexion administrateur',
          'Requêtes WMI distantes envoyées sur le segment interne',
        ],
      },
      defense: {
        actor: 'Threat Hunter / Analyste Réseau',
        title: 'Détection Flux Anormaux NDR & Micro-segmentation',
        description: 'Détection des flux SMB internes inhabituels par l\'analyseur NDR; application du blocage inter-VLAN et isolation préventive du serveur de fichiers.',
        tool: 'Analyseur de Trafic Réseau (NDR) & Commutateurs Durcis',
        status: 'PROPAGATION LATÉRALE CIRCONSCRITE',
        telemetry: [
          'NDR Sensor Alert : Anomalous SMB lateral activity detected between VLAN Postes et VLAN Serveurs',
          'Filtrage dynamique inter-VLAN engagé sur le coeur de réseau',
          'Accès WMI/RPC bloqué; le serveur de fichiers est protégé de la contamination',
        ],
      },
      voice: 'Phase 5 : Rebond latéral et anti-propagation. Le ver pirate cherche à infecter le serveur de fichiers via SMB. La sonde NDR repère l\'anomalie et coupe les flux inter-VLAN, protégeant les serveurs de production.',
    },
    {
      id: 5,
      number: '06',
      title: 'Exfiltration Furtive vs. Rupture de Fuite NDR/SWG',
      objective: 'Borner et stopper la fuite de données avant le déclenchement de la charge de sabotage.',
      mitre: 'T1567.002 (Exfiltration to Cloud Storage)',
      sla: '< 3 heures',
      attack: {
        actor: 'Module de Double Extorsion',
        title: 'Compression & Exfiltration Chiffrée Cloud',
        description: 'Compression et chiffrement local des répertoires sensibles RH/Finances; tentative de transfert sortant vers un stockage cloud pirate pour levier d\'extorsion.',
        tool: 'Module d\'Exfiltration Chiffrée',
        status: 'TRANSFERT SORTANT ENGAGÉ',
        telemetry: [
          'c2-agent [FS-CORP] > data-collector --paths "D:\\RH","D:\\Finances" --compress',
          'Création d\'archive chiffrée AES-256 en segments de 50 Mo',
          'Upload furtif multi-flux vers stockage cloud distant...',
        ],
      },
      defense: {
        actor: 'Analyste SOC L2 / Ingénieur Télécom',
        title: 'Détection Pic d\'Upload & Coupure d\'Urgence SWG',
        description: 'Détection par la sonde NDR d\'un pic volumétrique d\'upload chiffré vers l\'extérieur; interruption d\'urgence des flux sortants et bornage des volumes exfiltrés.',
        tool: 'Analyseur NDR & Passerelle Web Sécurisée (SWG)',
        status: 'CANAL D\'EXFILTRATION SECTIONNÉ',
        telemetry: [
          'NDR Spike Detection : 42 Go d\'upload chiffré anormal interceptés',
          'Killswitch SWG activé : coupure nette des connexions sortantes actives',
          'Audit d\'impact préliminaire engagé pour identifier les dossiers touchés',
        ],
      },
      voice: 'Phase 6 : Exfiltration et rupture de fuite. L\'attaquant tente de voler 42 gigaoctets de données stratégiques. Le NDR et le proxy interceptent le pic de transfert et sectionnent immédiatement la liaison.',
    },
    {
      id: 6,
      number: '07',
      title: 'Détonation Rançongiciel vs. Crise & Refus DGSSI',
      objective: 'Protéger la gouvernance, refuser l\'extorsion et lancer les notifications légales (CNDP & DGSSI sous 72h).',
      mitre: 'T1486 (Data Encrypted for Impact) / T1490 (Inhibit System Recovery)',
      sla: '< 4-72 heures',
      attack: {
        actor: 'Détonateur Rançongiciel',
        title: 'Destruction VSS & Verrouillage Chiffré',
        description: 'Suppression des clichés instantanés vssadmin, arrêt des bases de données métiers, chiffrement des volumes locaux et dépôt de la note de rançon 72h.',
        tool: 'Détonateur Rançongiciel & Note d\'Extorsion',
        status: 'VOLUMES VERROUILLÉS (.LOCKED)',
        telemetry: [
          'vssadmin delete shadows /all /quiet -> Clichés instantanés supprimés',
          '4 829 fichiers chiffrés avec extension *.locked',
          'Note de rançon déposée réclamant le paiement sous 72 heures sous peine de fuite',
        ],
      },
      defense: {
        actor: 'Direction Générale, RSSI & Expert DFIR L3',
        title: 'Capture Forensique RAM & Doctrine DGSSI / CNDP',
        description: 'Acquisition à chaud de la mémoire RAM, convocation d\'urgence de la cellule de crise multidisciplinaire et application formelle de la doctrine DGSSI : refus absolu de payer.',
        tool: 'Live Forensics DFIR & Gouvernance Institutionnelle (DGSSI)',
        status: 'DOCTRINE OFFICIELLE : ZÉRO PAIEMENT',
        telemetry: [
          'Acquisition médico-légale de 16 Go de RAM à chaud pour extraire les injecteurs',
          'Cellule de crise : Arbitrage conforme à la DGSSI / maCERT (Refus total de paiement)',
          'Déclaration légale de violation sous 72h auprès de la CNDP et de la DGSSI',
        ],
      },
      voice: 'Phase 7 : Détonation et gouvernance de crise. Les criminels détruisent les clichés locaux et réclament une rançon. La cellule de crise applique la doctrine DGSSI : refus absolu de tout paiement et déclarations légales sous 72 heures.',
    },
    {
      id: 7,
      number: '08',
      title: 'Impasse Rançon vs. Restauration WORM & RETEX',
      objective: 'Reprise d\'activité intégrale sans rançon et remise des rapports forensiques L3 et exécutifs.',
      mitre: 'Post-Incident Recovery / Resilience',
      sla: 'Restauration 100% Intègre',
      attack: {
        actor: 'Cybercriminels en Impasse',
        title: 'Expiration du Décompte Tor & Échec de l\'Extorsion',
        description: 'Attente passive sur le portail Tor; échec complet de la négociation et aucune rançon perçue en raison de la posture hermétique de l\'entreprise.',
        tool: 'Portail de Paiement Tor Expiré',
        status: 'ÉCHEC TOTAL DES ATTAQUANTS',
        telemetry: [
          'Décompte de 72 heures écoulé sur le portail Tor',
          'Aucun versement enregistré : zéro Bitcoin versé',
          'Chaîne criminelle neutralisée par la résilience de l\'organisation',
        ],
      },
      defense: {
        actor: 'Équipe Infrastructure, Restauration & RSSI',
        title: 'Re-imaging Master & Restauration Coffre WORM',
        description: 'Re-imaging complet sur master certifié durci; restauration étanche des volumes depuis les sauvegardes immuables WORM; remise des rapports d\'expertise.',
        tool: 'Système de Sauvegarde Immuable WORM & Master Re-imaging',
        status: 'REPRISE D\'ACTIVITÉ 100% RÉUSSIE',
        telemetry: [
          'Re-imaging des postes clients à neuf depuis le master certifié d\'entreprise',
          'Restauration de 420 Go depuis le coffre immuable WORM sans rançon',
          'Remise du Rapport Technique Forensique L3 et du Rapport Exécutif RSSI / DG',
        ],
      },
      voice: 'Phase 8 : Restauration et retour d\'expérience. Les cybercriminels repartent les mains vides. L\'entreprise réinstalle ses postes sur master certifié et restaure ses données depuis le coffre immuable WORM, assurant 100% de reprise sans rançon.',
    },
  ]

  const currentPhase = phases[phaseIdx]

  useEffect(() => {
    if (!isPlaying) {
      narrator.stop()
      return
    }

    let timer: any = null
    narrator.speak(currentPhase.voice, () => {
      timer = setTimeout(() => {
        if (!isPlaying) return
        if (phaseIdx < phases.length - 1) {
          sound.playSuccess()
          setPhaseIdx((prev) => prev + 1)
          setOffensiveTriggered(false)
          setDefensiveCountered(false)
        } else {
          setIsPlaying(false)
          sound.playSuccess()
        }
      }, 2500)
    })

    return () => {
      if (timer) clearTimeout(timer)
      narrator.stop()
    }
  }, [isPlaying, phaseIdx])

  const goToPhase = (idx: number) => {
    sound.playLaser()
    narrator.stop()
    setPhaseIdx(idx)
    setOffensiveTriggered(false)
    setDefensiveCountered(false)
  }

  const togglePlay = () => {
    sound.playClick()
    setIsPlaying((prev) => !prev)
  }

  const nextPhase = () => {
    sound.playClick()
    narrator.stop()
    if (phaseIdx < phases.length - 1) {
      setPhaseIdx((p) => p + 1)
      setOffensiveTriggered(false)
      setDefensiveCountered(false)
    }
  }

  const prevPhase = () => {
    sound.playClick()
    narrator.stop()
    if (phaseIdx > 0) {
      setPhaseIdx((p) => p - 1)
      setOffensiveTriggered(false)
      setDefensiveCountered(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16 select-none font-sans text-[#393F49]">
      {/* 1. Header & Institutional Mode Selector */}
      <div className="bg-white rounded-2xl border border-[#E0E7FF] p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0254EC] text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
            04
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-[#393F49]">
                Confrontation Attaque vs. Défense
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[10px] font-mono font-bold text-[#BE185D]">
                8 PHASES SYNCHRONISÉES · DOCTRINE DGSSI
              </span>
            </div>
            <p className="text-xs text-[#717783] mt-0.5">
              Simulation simultanée des flux offensifs et des ripostes opérationnelles SecOps / SOC / Gouvernance.
            </p>
          </div>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-[#F5F0FF] p-1 rounded-full border border-[#E0E7FF] text-xs font-semibold">
            <button
              onClick={() => {
                sound.playClick()
                setViewMode('split')
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold transition ${
                viewMode === 'split' ? 'bg-[#0254EC] text-white shadow-xs' : 'text-[#717783] hover:text-[#393F49]'
              }`}
            >
              Vue Scindée
            </button>
            <button
              onClick={() => {
                sound.playClick()
                setViewMode('map')
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold transition ${
                viewMode === 'map' ? 'bg-[#0254EC] text-white shadow-xs' : 'text-[#717783] hover:text-[#393F49]'
              }`}
            >
              Carte Réseau
            </button>
            <button
              onClick={() => {
                sound.playClick()
                setViewMode('table')
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold transition ${
                viewMode === 'table' ? 'bg-[#0254EC] text-white shadow-xs' : 'text-[#717783] hover:text-[#393F49]'
              }`}
            >
              Tableau MITRE
            </button>
          </div>

          <button
            onClick={() => narrator.toggleMute()}
            className={`p-2 rounded-full border text-xs font-bold transition active:translate-y-[1px] flex items-center justify-center ${
              !isVoiceMuted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                : 'bg-white border-[#E0E7FF] text-[#717783] hover:text-[#393F49]'
            }`}
            title={isVoiceMuted ? 'Activer la voix' : 'Couper la voix'}
          >
            {!isVoiceMuted ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
      </div>

      {/* 2. Phase Navigation Ribbon */}
      <div className="bg-white rounded-2xl border border-[#E0E7FF] p-2 shadow-sm flex items-center gap-1.5 overflow-x-auto font-mono text-xs">
        {phases.map((ph, idx) => {
          const isSelected = phaseIdx === idx
          return (
            <button
              key={ph.id}
              onClick={() => goToPhase(idx)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold border transition shrink-0 active:translate-y-[1px] ${
                isSelected
                  ? 'bg-[#0254EC] text-white border-[#0254EC] shadow-sm'
                  : 'bg-[#F8F4FF] text-[#717783] hover:text-[#393F49] border-[#E0E7FF]'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-[#BE185D]'}>{ph.number}</span>
              <span className="hidden sm:inline">{ph.title.split(' vs.')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* 3. Objective & Checkpoint Banner */}
      <div className="bg-white rounded-2xl border border-[#E0E7FF] p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#E0E7FF] text-[#0254EC] font-bold font-mono">
            OBJECTIF CLÉ PHASE {currentPhase.number}
          </span>
          <span className="text-[#393F49] font-bold">{currentPhase.objective}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#717783] font-mono">
          <span>MITRE : <strong className="text-[#393F49]">{currentPhase.mitre}</strong></span>
          <span>•</span>
          <span>SLA DÉFENSE : <strong className="text-emerald-700 font-bold">{currentPhase.sla}</strong></span>
        </div>
      </div>

      {/* 4. Main Stage Content */}
      {viewMode === 'split' && (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* LEFT: OFFENSIVE PANE (ATTAQUANT) */}
          <div className="bg-white rounded-3xl border border-[#E0E7FF] shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Header Attaquant */}
            <div className="bg-[#FDF2F8] px-5 py-3.5 border-b border-[#FBCFE8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-full bg-[#BE185D] text-white shadow-xs">
                  <Skull size={15} />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#BE185D] uppercase tracking-wider block">
                    VECTEUR OFFENSIF // {currentPhase.attack.actor}
                  </span>
                  <h3 className="font-sans text-sm font-black text-[#393F49] tracking-tight">
                    {currentPhase.attack.title}
                  </h3>
                </div>
              </div>
              <span className="px-3 py-0.5 rounded-full bg-white border border-[#FBCFE8] font-mono text-[10px] font-bold text-[#BE185D]">
                {currentPhase.attack.status}
              </span>
            </div>

            {/* Content Attaquant */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#717783] leading-relaxed">
                {currentPhase.attack.description}
              </p>

              {/* Terminal Simulator Box */}
              <div className="rounded-2xl bg-[#0F172A] p-4 text-slate-300 font-mono text-xs border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>OUTIL : {currentPhase.attack.tool}</span>
                  <span className="text-rose-400 font-bold">TUNNEL ACTIF</span>
                </div>
                {currentPhase.attack.telemetry.map((line, lIdx) => (
                  <div key={lIdx} className="text-[11px] leading-tight text-slate-300">
                    {line.startsWith('root@') || line.startsWith('PS ') || line.startsWith('c2-agent') ? (
                      <span className="text-rose-400 font-bold">{line}</span>
                    ) : (
                      <span className="text-slate-400 pl-2">{line}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Button Offensive */}
              <button
                onClick={() => {
                  sound.playLaser()
                  setOffensiveTriggered(true)
                }}
                className={`w-full py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition shadow-sm active:translate-y-[1px] flex items-center justify-center gap-1.5 ${
                  offensiveTriggered
                    ? 'bg-[#BE185D] text-white border border-[#9D174D]'
                    : 'bg-[#F8F4FF] text-[#393F49] hover:bg-[#F0F5FF] border border-[#E0E7FF]'
                }`}
              >
                {offensiveTriggered ? (
                  <>
                    <Check size={14} />
                    <span>Charge Offensive Exécutée</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Déclencher le Vecteur Attaquant</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: DEFENSIVE PANE (ENTREPRISE & SOC) */}
          <div className="bg-white rounded-3xl border border-[#E0E7FF] shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Header Défense */}
            <div className="bg-[#ECFDF5] px-5 py-3.5 border-b border-[#A7F3D0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-full bg-emerald-600 text-white shadow-xs">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    RIPOSTE DÉFENSIVE // {currentPhase.defense.actor}
                  </span>
                  <h3 className="font-sans text-sm font-black text-[#393F49] tracking-tight">
                    {currentPhase.defense.title}
                  </h3>
                </div>
              </div>
              <span className="px-3 py-0.5 rounded-full bg-white border border-[#A7F3D0] font-mono text-[10px] font-bold text-emerald-700">
                {currentPhase.defense.status}
              </span>
            </div>

            {/* Content Défense */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#717783] leading-relaxed">
                {currentPhase.defense.description}
              </p>

              {/* SOC Telemetry Console Box */}
              <div className="rounded-2xl bg-[#0F172A] p-4 text-slate-300 font-mono text-xs border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>SOLUTION : {currentPhase.defense.tool}</span>
                  <span className="text-emerald-400 font-bold">PROTECTION ACTIVE</span>
                </div>
                {currentPhase.defense.telemetry.map((line, lIdx) => (
                  <div key={lIdx} className="text-[11px] leading-tight text-slate-300">
                    {line.includes('Alert') || line.includes('Action') ? (
                      <span className="text-emerald-400 font-bold">{line}</span>
                    ) : (
                      <span className="text-slate-400 pl-2">{line}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Button Defensive */}
              <button
                onClick={() => {
                  sound.playSuccess()
                  setDefensiveCountered(true)
                }}
                className={`w-full py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition shadow-sm active:translate-y-[1px] flex items-center justify-center gap-1.5 ${
                  defensiveCountered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0254EC] text-white hover:bg-[#0043C7]'
                }`}
              >
                {defensiveCountered ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Riposte Défensive Appliquée avec Succès</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    <span>Appliquer la Riposte & Confinement SecOps</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 2: Synchronized Network Map */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-3xl border border-[#E0E7FF] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-[#393F49]">CARTE DU RÉSEAU SYNCHRONISÉE // PHASE {currentPhase.number}</span>
            <span className="text-[#0254EC] font-bold">VUE GLOBALE CONFRONTATION</span>
          </div>
          <NetworkMap mode={phaseIdx % 2 === 0 ? 'hacker' : 'enterprise'} currentStep={Math.min(phaseIdx, 6)} />
        </div>
      )}

      {/* View Mode 3: Full MITRE Comparison Table */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-[#E0E7FF] shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F8F4FF] border-b border-[#E0E7FF] text-[#717783]">
                <th className="p-3.5 font-bold">Phase</th>
                <th className="p-3.5 font-bold text-[#BE185D]">Attaque (Offensive)</th>
                <th className="p-3.5 font-bold text-emerald-700">Défense (SOC / IR / DGSSI)</th>
                <th className="p-3.5 font-bold">Objectif Clé</th>
                <th className="p-3.5 font-bold">SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E7FF]">
              {phases.map((ph, idx) => (
                <tr
                  key={ph.id}
                  onClick={() => {
                    sound.playClick()
                    setPhaseIdx(idx)
                    setViewMode('split')
                  }}
                  className={`hover:bg-[#F8F4FF] cursor-pointer transition ${
                    phaseIdx === idx ? 'bg-[#F5F0FF] font-bold' : ''
                  }`}
                >
                  <td className="p-3.5 font-bold text-[#393F49]">{ph.number}</td>
                  <td className="p-3.5 text-[#393F49]">
                    <div className="font-bold">{ph.attack.title}</div>
                    <div className="text-[11px] text-[#717783] font-normal">{ph.mitre}</div>
                  </td>
                  <td className="p-3.5 text-[#393F49]">
                    <div className="font-bold text-emerald-700">{ph.defense.title}</div>
                    <div className="text-[11px] text-[#717783] font-normal">{ph.defense.tool}</div>
                  </td>
                  <td className="p-3.5 text-[#717783] font-normal">{ph.objective}</td>
                  <td className="p-3.5 text-[#393F49] font-bold">{ph.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Synchronized Remote Controller Bar */}
      <div className="bg-white rounded-2xl border border-[#E0E7FF] p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#717783]">PHASE ACTIVE :</span>
          <span className="font-black text-[#393F49]">{currentPhase.number} / 08</span>
          <span className="text-[#E0E7FF]">—</span>
          <span className="font-bold text-[#0254EC]">{currentPhase.title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={prevPhase}
            disabled={phaseIdx === 0}
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
            <span>{isPlaying ? 'Pause' : 'Lecture Synchronisée'}</span>
          </button>

          <button
            onClick={nextPhase}
            disabled={phaseIdx === phases.length - 1}
            className="p-2 rounded-full bg-white text-[#717783] hover:text-[#393F49] disabled:opacity-30 border border-[#E0E7FF] shadow-sm active:translate-y-[1px]"
            title="Suivant"
          >
            <SkipForward size={14} />
          </button>

          <button
            onClick={() => {
              sound.playLaser()
              goToPhase(0)
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
