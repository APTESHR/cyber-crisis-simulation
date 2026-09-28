import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Award,
  ShieldCheck,
  Check,
  QrCode,
  Download,
  Copy,
  Maximize2,
  X,
  Sparkles,
  Wifi,
  User,
} from 'lucide-react'
import { sound } from '../utils/audio'
import { REFLEXES } from '../data/mock'
import { QRCodeSVG } from '../components/QRCodeSVG'
import { downloadCertificate, CertificateData } from '../utils/certificate'

interface QuizItem {
  id: number
  theme: string
  question: string
  contextBadge: string
  options: {
    letter: 'A' | 'B' | 'C' | 'D'
    label: string
    isCorrect: boolean
  }[]
  whyCorrect: string
  whyWrong: string
}

const AUDIENCE_QUESTIONS: QuizItem[] = [
  {
    id: 1,
    theme: 'Vecteur d’Entrée & Spear-Phishing',
    question: 'Qu’est-ce qui caractérise le spear-phishing (harponnage ciblé) reçu par Sophie par rapport à un spam classique ?',
    contextBadge: 'Scénario Sophie RH · Courriel usurpant la direction',
    options: [
      { letter: 'A', label: 'Il est envoyé à des millions de personnes au hasard sans personnalisation.', isCorrect: false },
      { letter: 'B', label: 'Il cible une personne précise avec des données réelles (paie, RH) et une urgence artificielle.', isCorrect: true },
      { letter: 'C', label: 'Il ne contient jamais de lien ni de document bureautique.', isCorrect: false },
      { letter: 'D', label: 'Il est immédiatement bloqué à 100% par tous les antivirus de bureau.', isCorrect: false },
    ],
    whyCorrect: 'Exactement ! Le spear-phishing étudie l’organigramme pour créer un prétexte crédible (paie/salaires) afin de tromper la vigilance humaine.',
    whyWrong: 'Attention : le spear-phishing n’est pas un envoi de masse anonyme, mais une attaque ultra-ciblée et préparée.',
  },
  {
    id: 2,
    theme: 'Le Piège des Macros Office',
    question: 'Dans le document Note_Salaires_2026.docm, pourquoi l’attaquant a-t-il besoin que Sophie clique sur « Activer le contenu » ?',
    contextBadge: 'Scénario Word & Macro VBA · Détonation locale',
    options: [
      { letter: 'A', label: 'Pour autoriser Microsoft Word à mettre à jour sa propre licence.', isCorrect: false },
      { letter: 'B', label: 'Pour déverrouiller l’exécution de scripts malveillants bloqués par défaut par le mode protégé.', isCorrect: true },
      { letter: 'C', label: 'Pour permettre l’impression du document en haute définition.', isCorrect: false },
      { letter: 'D', label: 'C’est une fausse alerte générée par la box Internet de Sophie.', isCorrect: false },
    ],
    whyCorrect: 'Parfait ! Microsoft bloque les macros par défaut (Mark of the Web). Le pirate a impérativement besoin de l’accord de l’utilisateur pour exécuter son payload.',
    whyWrong: 'Erreur critique : « Activer le contenu » n’a rien à voir avec une licence, cela octroie au document le droit d’exécuter du code exécutable.',
  },
  {
    id: 3,
    theme: 'Exécution & Évasion de Défense',
    question: 'Pourquoi le script PowerShell lancé par la macro est-il encodé en Base64 et cible-t-il la mémoire vive (AMSI) ?',
    contextBadge: 'MITRE T1059.001 & T1562.001 · Contournement EDR',
    options: [
      { letter: 'A', label: 'Pour accélérer le temps de démarrage du système d\'exploitation.', isCorrect: false },
      { letter: 'B', label: 'Pour dissimuler les commandes textuelles et neutraliser l’analyse antivirus en direct.', isCorrect: true },
      { letter: 'C', label: 'Pour compresser le disque dur et économiser de l’espace.', isCorrect: false },
      { letter: 'D', label: 'Pour crypter les fichiers vidéo de l’ordinateur.', isCorrect: false },
    ],
    whyCorrect: 'Exact ! L’obfuscation Base64 masque les mots-clés suspects et le patch AMSI en mémoire rend les scripts invisibles à la détection comportementale.',
    whyWrong: 'Non : le Base64 est utilisé ici pour duper les moteurs d’inspection statique et désarmer l’interface AMSI de Windows.',
  },
  {
    id: 4,
    theme: 'Premier Réflexe de Survie',
    question: 'Sophie constate un comportement anormal (écran figé, pop-up PowerShell fugace). Quel est le TOUT PREMIER réflexe à avoir ?',
    contextBadge: 'Incident Response · HOST_01 Sophie RH',
    options: [
      { letter: 'A', label: 'Éteindre l’ordinateur en coupant brutalement la prise de courant.', isCorrect: false },
      { letter: 'B', label: 'Isoler physiquement le poste du réseau (débrancher le câble Ethernet / couper Wi-Fi) SANS l’éteindre.', isCorrect: true },
      { letter: 'C', label: 'Relancer Word plusieurs fois pour vérifier si le document s’ouvre.', isCorrect: false },
      { letter: 'D', label: 'Supprimer l’historique du navigateur web et vider la corbeille.', isCorrect: false },
    ],
    whyCorrect: 'Règle d’or ! Déconnecter le réseau coupe immédiatement la propagation et le canal C2 tout en préservant les preuves indispensables.',
    whyWrong: 'Attention : éteindre la machine détruit la RAM, et relancer Word ne ferait qu’aggraver l’infection.',
  },
  {
    id: 5,
    theme: 'Forensique & Volatilité de la RAM',
    question: 'Pourquoi l’équipe de réponse à incident (DFIR) exige-t-elle formellement de NE PAS redémarrer ni éteindre la machine infectée ?',
    contextBadge: 'Investigation Numérique Légale · Préservation des Preuves',
    options: [
      { letter: 'A', label: 'Parce que les redémarrages Windows prennent trop de temps.', isCorrect: false },
      { letter: 'B', label: 'Parce que la RAM contient le code injecté, les clés de déchiffrement et les connexions actives qui disparaissent à l’extinction.', isCorrect: true },
      { letter: 'C', label: 'Parce que cela annulerait la garantie constructeur du matériel.', isCorrect: false },
      { letter: 'D', label: 'Parce que l’antivirus ne fonctionne que si la machine reste allumée 24h/24.', isCorrect: false },
    ],
    whyCorrect: 'Crucial ! La mémoire vive (RAM) est volatile. C’est là que se trouvent les processus injectés, les tokens d’authentification et souvent la clé de session de l’attaquant.',
    whyWrong: 'Faux : dès qu’une machine est éteinte, tout le contenu de la mémoire volatile s’efface, privant les analystes de preuves déterminantes.',
  },
  {
    id: 6,
    theme: 'Canal C2 (Commande & Contrôle)',
    question: 'Pourquoi l’attaquant fait-il passer ses communications C2 par le port HTTPS standard (port 443) plutôt qu’un port exotique ?',
    contextBadge: 'MITRE T1071.001 · Évasion de filtrage périmétrique',
    options: [
      { letter: 'A', label: 'Car le port 443 est le seul port existant sur les serveurs Linux.', isCorrect: false },
      { letter: 'B', label: 'Pour noyer son trafic malveillant dans les millions de requêtes web chiffrées légitimes de l’entreprise.', isCorrect: true },
      { letter: 'C', label: 'Car ce port est obligatoirement exempté de toute loi internationale.', isCorrect: false },
      { letter: 'D', label: 'Pour forcer l’ordinateur de Sophie à afficher des publicités.', isCorrect: false },
    ],
    whyCorrect: 'Parfaitement vu ! Le trafic HTTPS/443 est autorisé en sortie dans la quasi-totalité des entreprises, rendant la balise furtive sans inspection SSL approfondie.',
    whyWrong: 'Non : le choix du port 443 est une tactique délibérée pour contourner les pare-feux et masquer le flux malveillant dans le flux web.',
  },
  {
    id: 7,
    theme: 'Vol d’Identifiants & Privilèges',
    question: 'En s’injectant dans le processus système lsass.exe, quel trésor l’attaquant recherche-t-il en priorité ?',
    contextBadge: 'MITRE T1003.001 · Mimikatz & Compromission Domaine Active Directory',
    options: [
      { letter: 'A', label: 'Les photos de profil et les favoris du navigateur des employés.', isCorrect: false },
      { letter: 'B', label: 'Les condensats (hashs NTLM) et tickets Kerberos en mémoire pour usurper des comptes à privilèges.', isCorrect: true },
      { letter: 'C', label: 'Le code source de la suite bureautique installée.', isCorrect: false },
      { letter: 'D', label: 'La liste des imprimantes réseau partagées.', isCorrect: false },
    ],
    whyCorrect: 'Exact ! LSASS stocke les secrets d’authentification des sessions actives. Y dérober un token d’administrateur donne les clés du domaine à l’assaillant.',
    whyWrong: 'Erreur : LSASS est le service de sécurité locale gérant les tickets Kerberos et condensats de mots de passe, cible suprême des cyberattaquants.',
  },
  {
    id: 8,
    theme: 'Déplacement Latéral',
    question: 'Comment l’attaquant parvient-il à rebondir du PC RH de Sophie vers le serveur de fichiers sans connaître le mot de passe en clair ?',
    contextBadge: 'MITRE T1550.002 · Technique Pass-the-Hash & SMB 445',
    options: [
      { letter: 'A', label: 'Il envoie un SMS de réinitialisation au support technique.', isCorrect: false },
      { letter: 'B', label: 'Grâce à la technique Pass-the-Hash, en réinjectant directement le hash NTLM volé via le protocole SMB.', isCorrect: true },
      { letter: 'C', label: 'En devinant le mot de passe grâce à la date de naissance de Sophie.', isCorrect: false },
      { letter: 'D', label: 'En modifiant l’adresse IP physique de la carte mère.', isCorrect: false },
    ],
    whyCorrect: 'C’est toute la puissance du Pass-the-Hash ! Le protocole NTLM valide la preuve cryptographique du hash sans jamais exiger le mot de passe en texte clair.',
    whyWrong: 'Faux : les attaquants modernes n’ont pas besoin de casser le mot de passe s’ils disposent de son empreinte cryptographique (Pass-the-Hash).',
  },
  {
    id: 9,
    theme: 'Double Extorsion Moderne',
    question: 'Pourquoi les groupes de ransomware comme LockBit ou BlackCat exfiltrent-ils les données AVANT de chiffrer les disques ?',
    contextBadge: 'MITRE T1567.002 · Stratégie de Chantage & Double Extorsion',
    options: [
      { letter: 'A', label: 'Pour vérifier que les fichiers ne sont pas corrompus.', isCorrect: false },
      { letter: 'B', label: 'Pour exercer un chantage à la fuite publique si la victime dispose de sauvegardes pour restaurer ses données.', isCorrect: true },
      { letter: 'C', label: 'Pour libérer de l’espace disque avant de procéder au chiffrement.', isCorrect: false },
      { letter: 'D', label: 'C’est une obligation légale fixée par la convention de Genève.', isCorrect: false },
    ],
    whyCorrect: 'Exactement ! Même avec des sauvegardes parfaites, l’entreprise reste sous pression car l’attaquant menace de publier les données sensibles de ses clients et salariés.',
    whyWrong: 'Non : l’exfiltration préalable sert d’arme de chantage ultime en cas de restauration autonome des sauvegardes par l’entreprise.',
  },
  {
    id: 10,
    theme: 'Gestion de Crise & Rançon',
    question: 'Face à un écran de rançon exigeant 500 000 $ en cryptomonnaie sous 72h, quelle est la doctrine recommandée ?',
    contextBadge: 'Gouvernance & Stratégie Nationale de Cyberdéfense',
    options: [
      { letter: 'A', label: 'Payer immédiatement 50% de la somme pour négocier la clé de déchiffrement.', isCorrect: false },
      { letter: 'B', label: 'Ne JAMAIS payer, déposer plainte, alerter le CERT et restaurer depuis des sauvegardes immuables déconnectées.', isCorrect: true },
      { letter: 'C', label: 'Proposer à l’attaquant un contrat de travail de consultant en cybersécurité.', isCorrect: false },
      { letter: 'D', label: 'Formater immédiatement tous les disques sans faire de copie forensique.', isCorrect: false },
    ],
    whyCorrect: 'Parfait ! Payer finance le crime organisé, ne garantit jamais la restitution des données et classe l’organisation comme cible rentable pour de futures attaques.',
    whyWrong: 'Règle absolue : ne JAMAIS payer de rançon. Le paiement alimente l’écosystème criminel et n’offre aucune garantie de survie.',
  },
]

export default function AudienceQuiz() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  // Determine if this user opened the quiz via the audience QR link
  const isAudienceMode =
    searchParams.get('mode') === 'audience' ||
    searchParams.has('audience') ||
    sessionStorage.getItem('audience_mode') === 'true'

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [participantName, setParticipantName] = useState('')
  const [showQRModal, setShowQRModal] = useState(false)
  const [copiedURL, setCopiedURL] = useState(false)

  // Direct Wi-Fi access URL for local audience (locks audience into standalone quiz mode)
  const liveQuizUrl = 'http://172.17.100.174:5173/quiz?mode=audience'

  const currentQ = AUDIENCE_QUESTIONS[currentIdx]

  const handleSelect = (letter: string) => {
    if (revealed) return
    setSelectedOption(letter)
    setRevealed(true)

    const opt = currentQ.options.find((o) => o.letter === letter)
    if (opt?.isCorrect) {
      sound.playLaser()
      setScore((s) => s + 1)
    } else {
      sound.playError()
    }
  }

  const handleNext = () => {
    sound.playClick()
    if (currentIdx < AUDIENCE_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1)
      setSelectedOption(null)
      setRevealed(false)
    } else {
      setCompleted(true)
    }
  }

  const restart = () => {
    sound.playClick()
    setCurrentIdx(0)
    setSelectedOption(null)
    setRevealed(false)
    setScore(0)
    setCompleted(false)
    setParticipantName('')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(liveQuizUrl)
    setCopiedURL(true)
    sound.playClick()
    setTimeout(() => setCopiedURL(false), 2500)
  }

  const finalPercentage = Math.round((score / AUDIENCE_QUESTIONS.length) * 100)
  const isExpert = finalPercentage >= 80
  const isGood = finalPercentage >= 50

  const handleDownloadCertificate = () => {
    sound.playLaser()
    const certData: CertificateData = {
      recipientName: participantName.trim() || 'Auditeur Cybersécurité',
      score: score,
      totalQuestions: AUDIENCE_QUESTIONS.length,
      dateString: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      certificateId: `CYBER-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      mention: isExpert
        ? 'DÉFENSEUR CYBER ÉLITE (Excellence Validée)'
        : isGood
        ? 'PRATICIEN AVERTI (Vigilance Validée)'
        : 'SENSIBILISATION EFFECTUÉE',
    }
    downloadCertificate(certData)
  }

  return (
    <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans select-none space-y-8">
      {/* ========================================================================= */}
      {/* 1. AUDIENCE BANNER (PRESENTER MODE vs AUDIENCE PHONE MODE)                */}
      {/* ========================================================================= */}
      {isAudienceMode ? (
        <section className="bg-gradient-to-r from-white via-[#F8F4FF] to-white rounded-3xl border border-[#E0E7FF] p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF5FF] border border-[#C7DBFE] flex items-center justify-center text-[#0254EC] shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#393F49] tracking-tight">
                Quiz de Sensibilisation & Certification
              </h2>
              <p className="text-xs text-[#717783]">
                10 questions · Répondez en direct et téléchargez votre attestation
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Session Connectée</span>
          </span>
        </section>
      ) : (
        <section className="bg-gradient-to-r from-white via-[#F8F4FF] to-white rounded-3xl border border-[#E0E7FF] p-6 sm:p-7 shadow-[0_8px_30px_rgba(2,84,236,0.06)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 min-w-0">
            <div className="relative group cursor-pointer" onClick={() => setShowQRModal(true)}>
              <div className="p-2.5 bg-white rounded-2xl border-2 border-[#0254EC]/20 shadow-md group-hover:border-[#0254EC] transition-all">
                <QRCodeSVG value={liveQuizUrl} size={84} fgColor="#0F172A" />
              </div>
              <div className="absolute inset-0 bg-[#0254EC]/70 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                <Maximize2 size={20} />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold">
                  <Wifi size={13} className="text-[#059669] animate-pulse" />
                  <span>Wi-Fi Salle · Accès Direct</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[#BE185D] text-xs font-semibold">
                  <Sparkles size={12} />
                  <span>10 Questions & Certificat</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#393F49] tracking-tight">
                Vote en Direct & Certification de l'Audience
              </h2>
              <p className="text-xs sm:text-sm text-[#717783] max-w-xl">
                Scannez le QR code avec votre smartphone sur le Wi-Fi de la salle pour répondre en temps réel et générer votre attestation officielle.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowQRModal(true)}
              className="px-5 py-3 rounded-full bg-white hover:bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF] font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition active:translate-y-[1px]"
            >
              <QrCode size={16} />
              <span>Agrandir le QR Code (Vidéoprojecteur)</span>
            </button>

            
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. QUIZ INTERACTION CONTAINER                                             */}
      {/* ========================================================================= */}
      {!completed ? (
        <section className="bg-white rounded-3xl border border-[#E0E7FF] shadow-[0_12px_40px_-6px_rgba(2,84,236,0.08)] overflow-hidden">
          {/* Header Progress Bar */}
          <div className="px-6 sm:px-8 py-5 border-b border-[#E0E7FF] bg-gradient-to-r from-white via-[#F8F4FF] to-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EFF5FF] border border-[#C7DBFE] flex items-center justify-center text-[#0254EC]">
                <HelpCircle size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0254EC] uppercase tracking-wider block">
                  Question {currentIdx + 1} sur {AUDIENCE_QUESTIONS.length}
                </span>
                <span className="text-sm font-bold text-[#393F49] tracking-tight">
                  {currentQ.theme}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-semibold text-[#717783]">Score actuel</div>
                <div className="text-base font-extrabold text-[#0254EC] font-mono tabular-nums">
                  {score} / {currentIdx + (revealed ? 1 : 0)}
                </div>
              </div>
              <div className="w-24 sm:w-36 bg-[#E0E7FF] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#0254EC] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIdx + 1) / AUDIENCE_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F0FF] border border-[#E0E7FF] text-[#0254EC] text-xs font-semibold">
              <AlertTriangle size={13} className="text-[#0254EC]" />
              <span>{currentQ.contextBadge}</span>
            </div>

            {/* Question Text */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#393F49] tracking-tight leading-snug">
              {currentQ.question}
            </h1>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {currentQ.options.map((opt) => {
                const isChosen = selectedOption === opt.letter
                let stateStyles = 'bg-white border-[#E0E7FF] hover:border-[#0254EC] hover:bg-[#F8F4FF]'

                if (revealed) {
                  if (opt.isCorrect) {
                    stateStyles = 'bg-[#ECFDF5] border-[#10B981] text-[#065F46] ring-2 ring-[#10B981]/20'
                  } else if (isChosen && !opt.isCorrect) {
                    stateStyles = 'bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]'
                  } else {
                    stateStyles = 'bg-white/50 border-[#E0E7FF] text-[#9CA3AF] opacity-60'
                  }
                }

                return (
                  <button
                    key={opt.letter}
                    disabled={revealed}
                    onClick={() => handleSelect(opt.letter)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-150 flex items-start gap-4 shadow-xs relative ${stateStyles} active:translate-y-[1px]`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                        revealed && opt.isCorrect
                          ? 'bg-[#10B981] text-white'
                          : revealed && isChosen && !opt.isCorrect
                          ? 'bg-[#EF4444] text-white'
                          : 'bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF]'
                      }`}
                    >
                      {opt.letter}
                    </div>

                    <div className="flex-1 pt-1 font-medium text-sm sm:text-base leading-relaxed text-[#393F49]">
                      {opt.label}
                    </div>

                    {revealed && opt.isCorrect && (
                      <CheckCircle2 size={22} className="text-[#10B981] flex-shrink-0 mt-1" />
                    )}
                    {revealed && isChosen && !opt.isCorrect && (
                      <XCircle size={22} className="text-[#EF4444] flex-shrink-0 mt-1" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Pedagogical Explanation Reveal */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-6 rounded-2xl border-2 ${
                    currentQ.options.find((o) => o.letter === selectedOption)?.isCorrect
                      ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                      : 'bg-[#FFFBEB] border-[#FDE68A]'
                  } space-y-2`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {currentQ.options.find((o) => o.letter === selectedOption)?.isCorrect ? (
                      <>
                        <CheckCircle2 size={18} className="text-[#059669]" />
                        <span className="text-[#065F46]">Bonne réponse !</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} className="text-[#D97706]" />
                        <span className="text-[#92400E]">Attention au piège !</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-[#374151]">
                    {currentQ.options.find((o) => o.letter === selectedOption)?.isCorrect
                      ? currentQ.whyCorrect
                      : currentQ.whyWrong}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Question Navigation */}
            {revealed && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-full bg-[#0254EC] hover:bg-[#0043C7] text-white font-semibold text-sm shadow-sm transition active:translate-y-[1px] flex items-center gap-2"
                >
                  <span>
                    {currentIdx < AUDIENCE_QUESTIONS.length - 1
                      ? 'Question Suivante'
                      : 'Voir les Résultats & Certificat'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* ========================================================================= */
        /* 3. FINAL RESULTS & ACCREDITATION CERTIFICATE SECTION                     */
        /* ========================================================================= */
        <section className="bg-white rounded-3xl border border-[#E0E7FF] shadow-[0_12px_40px_-6px_rgba(2,84,236,0.08)] p-8 sm:p-12 text-center space-y-8 max-w-4xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF] flex items-center justify-center shadow-xs">
            <Award size={44} />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717783]">
              Bilan Officiel du Vote de l'Audience · Simulation Sophie RH
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#393F49] tracking-tight">
              Score : {score} / {AUDIENCE_QUESTIONS.length} ({finalPercentage}%)
            </h1>
            <p className="text-sm sm:text-base text-[#717783] max-w-xl mx-auto leading-relaxed">
              {isExpert
                ? 'Excellente maîtrise opérationnelle ! Vos réflexes face à l’intrusion et à la crise ransomware sont parfaitement validés.'
                : isGood
                ? 'Bonne vigilance générale. Continuez à appliquer la doctrine stricte : isoler sans éteindre, alerter et ne jamais payer.'
                : 'Sensibilisation indispensable : retenez que le premier réflexe est d’alerter immédiatement le SOC sans tenter de remédier seul.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-bold text-sm shadow-xs">
            <ShieldCheck size={20} className="text-[#059669]" />
            <span>
              MENTION :{' '}
              <b className="text-[#047857]">
                {isExpert ? 'DÉFENSEUR CYBER ÉLITE' : isGood ? 'PRATICIEN AVERTI' : 'VIGILANCE REQUISE'}
              </b>
            </span>
          </div>

          {/* Certificate Download Card */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-[#F8F4FF] to-white rounded-3xl border border-[#E0E7FF] text-left space-y-5">
            <div className="flex items-center gap-3">
              <Award size={22} className="text-[#0254EC]" />
              <div>
                <h3 className="text-base font-bold text-[#393F49]">
                  Générer votre Certificat d'Accréditation Cyber (PNG HD)
                </h3>
                <p className="text-xs text-[#717783]">
                  Personnalisez votre attestation officielle pour valider votre participation à la simulation de crise.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717783]" />
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Entrez votre Prénom et Nom (ex: Sophie Martin)"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-[#E0E7FF] text-sm text-[#393F49] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0254EC] focus:ring-2 focus:ring-[#0254EC]/20 shadow-xs"
                />
              </div>

              <button
                onClick={handleDownloadCertificate}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0254EC] hover:bg-[#0043C7] text-white font-semibold text-sm shadow-sm transition active:translate-y-[1px] flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Download size={16} />
                <span>Télécharger le Certificat HD</span>
              </button>
            </div>
          </div>

          {/* 5 Golden Reflexes */}
          <div className="pt-6 border-t border-[#E0E7FF] text-left space-y-4">
            <h3 className="font-bold text-sm text-[#393F49] uppercase tracking-wider flex items-center gap-2">
              <span className="text-[#0254EC]">●</span>
              <span>Les 5 Réflexes Clés de Survie Cyber</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {REFLEXES.map((r) => (
                <div key={r.step} className="p-4 bg-[#F8F4FF] rounded-2xl border border-[#E0E7FF] text-xs shadow-xs">
                  <div className="font-bold text-[#0254EC] text-xs">{r.step}. {r.title}</div>
                  <div className="text-[#717783] text-[11px] mt-1.5 leading-snug font-medium">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F8F4FF] text-[#393F49] font-semibold text-xs border border-[#E0E7FF] shadow-xs transition active:translate-y-[1px]"
            >
              <RotateCcw size={14} />
              <span>Recommencer le Quiz</span>
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. FULL-SCREEN PROJECTOR MODAL FOR VENUE AUDIENCE                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-[#E0E7FF] p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#F5F0FF] text-[#717783] hover:text-[#0254EC] transition"
              >
                <X size={20} />
              </button>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[#BE185D] text-xs font-semibold uppercase tracking-wider">
                  Projection Amphithéâtre
                </span>
                <h3 className="text-2xl font-extrabold text-[#393F49] tracking-tight">
                  Scannez pour Participer au Quiz
                </h3>
                <p className="text-xs text-[#717783]">
                  Connectez-vous au réseau Wi-Fi local de la salle puis flashez le QR code
                </p>
              </div>

              <div className="p-6 bg-[#F8F4FF] rounded-3xl border-2 border-[#0254EC]/30 inline-block shadow-inner">
                <QRCodeSVG value={liveQuizUrl} size={280} fgColor="#0F172A" />
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#E0E7FF] font-mono text-sm font-bold text-[#0254EC] flex items-center justify-between gap-3">
                <span className="truncate">{liveQuizUrl}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 text-[#717783] hover:text-[#0254EC] transition"
                  title="Copier l'URL"
                >
                  {copiedURL ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
