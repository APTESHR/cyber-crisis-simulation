import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Lock,
  DollarSign,
  Scale,
  Users,
  Building,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Flame,
  Award,
} from 'lucide-react'
import { sound } from '../utils/audio'
import { narrator } from '../utils/voice'

export default function NonTechAwareness() {
  const [activeTab, setActiveTab] = useState<'scenario' | 'impacts' | 'reflexes'>('scenario')
  const [isVoiceMuted, setIsVoiceMuted] = useState(narrator.isMuted())
  const [activeStoryStep, setActiveStoryStep] = useState<number>(0)

  // États pour l'atelier interactif "Détectez les 4 pièges du faux courriel"
  const [foundClues, setFoundClues] = useState<{ [key: string]: boolean }>({})
  const [showExplanation, setShowExplanation] = useState<string | null>(null)

  const toggleVoice = () => {
    const muted = narrator.toggleMute()
    setIsVoiceMuted(muted)
  }

  // 1. LE SCÉNARIO EXPLIQUÉ SANS JARGON (L'Analogie du Cambriolage Moderne)
  const storySteps = [
    {
      id: 0,
      stepNum: 'Étape 1',
      title: 'Le Faux Facteur à la Porte',
      analogy: 'Un inconnu frappe à l\'accueil en tenue de livreur avec un colis urgent à signer.',
      explanation:
        'Dans la vraie vie, un collaborateur reçoit un email anodin, souvent déguisé en facture urgente ou en note de service RH. Le pirate ne force rien : il trompe la confiance.',
      impactSimple: 'Le piège est tendu par la curiosité ou le sentiment d\'urgence.',
      icon: Mail,
      accentColor: 'from-amber-500/20 to-amber-600/10 border-amber-500/50 text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      voiceText:
        'Étape 1 : Le faux facteur. L\'attaque démarre toujours par un email anodin. Le pirate mise sur la précipitation ou la curiosité d\'un employé, comme un faux livreur demandant d\'ouvrir la porte.',
    },
    {
      id: 1,
      stepNum: 'Étape 2',
      title: 'La Porte Laissée Entrouverte',
      analogy: 'Un employé ouvre la porte au livreur sans vérifier son badge.',
      explanation:
        'En cliquant sur la pièce jointe ou le lien, un petit programme invisible s\'installe sur l\'ordinateur. Rien ne clignote, l\'écran fonctionne normalement, mais l\'attaquant a désormais les clés de cet ordinateur.',
      impactSimple: 'L\'ordinateur est infecté, mais personne ne s\'en aperçoit encore.',
      icon: AlertTriangle,
      accentColor: 'from-rose-500/20 to-rose-600/10 border-rose-500/50 text-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      voiceText:
        'Étape 2 : La porte entrouverte. Le clic déclenche l\'installation d\'une porte dérobée invisible. Tout semble normal à l\'écran, pourtant l\'intrus a déjà un pied dans la maison.',
    },
    {
      id: 2,
      stepNum: 'Étape 3',
      title: 'Le Voleur Silencieux la Nuit',
      analogy: 'Le voleur reste caché dans un placard, attend minuit et visite chaque pièce sans bruit.',
      explanation:
        'Pendant plusieurs jours (souvent la nuit ou le week-end), le pirate explore discrètement le réseau de l\'entreprise. Il recherche les fichiers confidentiels, les comptes bancaires et le coffre-fort des sauvegardes.',
      impactSimple: 'Vol de documents secrets et repérage des points faibles.',
      icon: Building,
      accentColor: 'from-purple-500/20 to-purple-600/10 border-purple-500/50 text-purple-400',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      voiceText:
        'Étape 3 : L\'exploration silencieuse. Le pirate n\'abîme rien au début. Il passe plusieurs jours à visiter le réseau pour repérer où dorment les sauvegardes et les données confidentielles.',
    },
    {
      id: 3,
      stepNum: 'Étape 4',
      title: 'Les Cadenas sur Tous les Placards',
      analogy: 'Le voleur met des chaînes et des cadenas blindés sur chaque tiroir et chaque porte.',
      explanation:
        'C\'est le Rançongiciel (Ransomware) : en quelques minutes, le pirate verrouille avec un chiffrement mathématique incassable toutes les données, contrats, logiciels de caisse et dossiers RH.',
      impactSimple: 'L\'entreprise est totalement paralysée, plus aucun fichier ne s\'ouvre.',
      icon: Lock,
      accentColor: 'from-red-600/30 to-red-950/40 border-red-500/60 text-red-400',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      voiceText:
        'Étape 4 : Les cadenas sur tous les placards. En quelques minutes, le rançongiciel verrouille tous les fichiers avec un cadenas incassable. Les logiciels de gestion s\'arrêtent.',
    },
    {
      id: 4,
      stepNum: 'Étape 5',
      title: 'La Demande de Rançon & le Chantage',
      analogy: 'Un mot sur la table : "Payez 500 000 euros, sinon je détruis tout et je vends vos secrets".',
      explanation:
        'Un message rouge s\'affiche sur tous les écrans réclamant des cryptomonnaies pour fournir la clé de déverrouillage, sous peine de publier les données des clients sur Internet (double extorsion).',
      impactSimple: 'Chantage financier majeur et crise de réputation publique.',
      icon: DollarSign,
      accentColor: 'from-orange-600/30 to-amber-950/40 border-amber-500/60 text-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      voiceText:
        'Étape 5 : La rançon et le chantage. L\'attaquant réclame une somme colossale pour débloquer les fichiers et menace de diffuser les secrets de l\'entreprise sur Internet.',
    },
  ]

  const handleReadStoryStep = (idx: number) => {
    sound.playClick()
    setActiveStoryStep(idx)
    narrator.speak(storySteps[idx].voiceText)
  }

  // 2. LES IMPACTS RÉELS SUR L'ENTREPRISE
  const impactsList = [
    {
      title: 'Paralysie Opérationnelle Immédiate',
      subtitle: 'La machine économique s\'arrête net',
      stat: '5 à 14 jours',
      statLabel: 'd\'arrêt total moyen',
      description:
        'Impossible d\'émettre une facture, de livrer des colis, d\'accéder aux dossiers clients, ni même de payer les salaires à la fin du mois. Les usines et entrepôts tournent au ralenti avec du papier et des stylos.',
      severity: 'Critique',
      icon: Flame,
      color: 'border-[#FBCFE8] bg-[#FDF2F8] text-[#BE185D]',
    },
    {
      title: 'Pertes Financières Colossales',
      subtitle: 'Bien au-delà de la rançon demandée',
      stat: '1,2 M€',
      statLabel: 'coût moyen d\'une cyberattaque PME/ETI',
      description:
        'Comprend la perte directe de chiffre d\'affaires, les honoraires d\'experts en cybersécurité (2 500 €/jour), le rachat de serveurs et le non-remboursement potentiel par les assurances si des négligences graves sont relevées.',
      severity: 'Majeur',
      icon: DollarSign,
      color: 'border-amber-200 bg-amber-50 text-amber-800',
    },
    {
      title: 'Sanctions Juridiques & Conformité CNDP',
      subtitle: 'La loi sanctionne la fuite de données',
      stat: '72 heures',
      statLabel: 'pour alerter obligatoirement la CNDP & DGSSI',
      description:
        'La réglementation marocaine (Loi 09-08 CNDP & directives DGSSI) oblige l\'entreprise à notifier l\'incident aux autorités sous 72h. En cas de manquement grave à la protection des données, des sanctions administratives et judiciaires sévères sont appliquées.',
      severity: 'Légal',
      icon: Scale,
      color: 'border-[#E0E7FF] bg-[#F5F0FF] text-[#0254EC]',
    },
    {
      title: 'Perte de Confiance & Réputation',
      subtitle: 'La confiance perdue ne s\'achète pas',
      stat: '60%',
      statLabel: 'des PME déposent le bilan sous 18 mois',
      description:
        'Les clients dont les coordonnées bancaires ont fuité résilient leurs contrats par peur. Les partenaires refusent de se connecter au réseau de l\'entreprise. La marque se retrouve citée dans la presse spécialisée.',
      severity: 'Durable',
      icon: Users,
      color: 'border-purple-200 bg-purple-50 text-purple-800',
    },
  ]

  // 3. ATELIER PHISHING INTERACTIF (Les 4 Pièges à Détecter)
  const phishingClues = {
    sender: {
      title: 'Adresse de l\'expéditeur falsifiée',
      detail:
        'Le nom affiché est "Service Paies", mais l\'adresse réelle est "rh-direction@societe-portail-rh.online" au lieu du domaine officiel de l\'entreprise.',
    },
    urgency: {
      title: 'Pression psychologique & Urgence injustifiée',
      detail:
        'La mention "ACTION OBLIGATOIRE SOUS 2 HEURES" sous menace de suspension du salaire est la marque de fabrique des cybercriminels pour provoquer la panique.',
    },
    attachment: {
      title: 'Pièce jointe piégée (.docm / macro)',
      detail:
        'Le fichier "Grille_Salaires_2026.docm" contient des macros exécutables capables d\'injecter un virus dès l\'ouverture sans nécessiter de mot de passe administrateur.',
    },
    button: {
      title: 'Lien externe non sécurisé',
      detail:
        'Le gros bouton invite à se connecter sur un faux portail copié pour voler vos identifiants professionnels.',
    },
  }

  const handleClueClick = (key: 'sender' | 'urgency' | 'attachment' | 'button') => {
    sound.playClick()
    setFoundClues((prev) => ({ ...prev, [key]: true }))
    setShowExplanation(key)
    if (!foundClues[key]) {
      sound.playSuccess()
    }
  }

  const totalCluesFound = Object.keys(foundClues).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans text-[#393F49] select-none space-y-6">
      {/* 1. En-tête Pédagogique Dédié */}
      <div className="bg-white rounded-2xl border border-[#E0E7FF] p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} />
              Guide Vulgarisé Sans Jargon
            </span>
            <span className="text-xs text-[#717783]">· Spécial Collaborateurs & Décideurs</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-[#393F49]">
            Comprendre la Cyberattaque & ses Impacts Réels
          </h1>
          <p className="text-xs sm:text-sm text-[#717783] mt-1">
            Pas besoin d'être informaticien : découvrez l'histoire pas à pas, ce que risque l'entreprise et les réflexes qui sauvent.
          </p>
        </div>

        {/* Contrôles Utilitaires & Audio */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition active:translate-y-[1px] ${
              !isVoiceMuted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                : 'bg-white border-[#E0E7FF] text-[#717783] hover:text-[#393F49]'
            }`}
            title="Activer ou désactiver les explications vocales"
          >
            {!isVoiceMuted ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{!isVoiceMuted ? 'Voix active' : 'Voix coupée'}</span>
          </button>

          <Link
            to="/quiz"
            onClick={() => sound.playClick()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0254EC] hover:bg-[#0043C7] text-white font-bold text-xs shadow-sm transition active:translate-y-[1px]"
          >
            <span>Tester mes connaissances</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 2. Barre d'Onglets de Navigation Pédagogique */}
      <div className="flex items-center gap-2 bg-[#F5F0FF] p-1.5 rounded-full border border-[#E0E7FF] max-w-2xl mx-auto shadow-xs">
        <button
          onClick={() => {
            sound.playClick()
            setActiveTab('scenario')
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full font-bold text-xs transition ${
            activeTab === 'scenario'
              ? 'bg-[#0254EC] text-white shadow-xs'
              : 'text-[#717783] hover:text-[#393F49] hover:bg-white'
          }`}
        >
          <BookOpen size={15} />
          <span>1. L'Histoire Sans Jargon</span>
        </button>

        <button
          onClick={() => {
            sound.playClick()
            setActiveTab('impacts')
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full font-bold text-xs transition ${
            activeTab === 'impacts'
              ? 'bg-[#0254EC] text-white shadow-xs'
              : 'text-[#717783] hover:text-[#393F49] hover:bg-white'
          }`}
        >
          <TrendingDown size={15} />
          <span>2. Les Impacts Réels</span>
        </button>

        <button
          onClick={() => {
            sound.playClick()
            setActiveTab('reflexes')
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full font-bold text-xs transition ${
            activeTab === 'reflexes'
              ? 'bg-[#0254EC] text-white shadow-xs'
              : 'text-[#717783] hover:text-[#393F49] hover:bg-white'
          }`}
        >
          <ShieldCheck size={15} />
          <span>3. Réflexes & Atelier</span>
        </button>
      </div>

      {/* 3. CONTENU DES ONGLETS */}

      {/* ONGLET 1 : LE SCÉNARIO EXPLIQUÉ EN 5 ÉTAPES VISUELLES */}
      {activeTab === 'scenario' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Bannière introductive */}
          <div className="p-4 rounded-2xl bg-[#F8F4FF] border border-[#E0E7FF] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF] flex items-center justify-center font-black">
                💡
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#393F49]">L'analogie du cambriolage moderne</h3>
                <p className="text-xs text-[#717783]">
                  Un pirate informatique n'attaque pas les murs en béton : il dupe un habitant pour entrer sans forcer la serrure.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-[#717783]">
              Cliquez sur chaque étape pour écouter l'explication 🎙️
            </span>
          </div>

          {/* Grille des 5 cartes du scénario */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {storySteps.map((step, idx) => {
              const Icon = step.icon
              const isSelected = activeStoryStep === idx
              return (
                <div
                  key={step.id}
                  onClick={() => handleReadStoryStep(idx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#0254EC] ring-2 ring-[#0254EC]/20 shadow-md scale-[1.02]'
                      : 'bg-white border-[#E0E7FF] hover:border-[#0254EC] text-[#393F49]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF]">
                        {step.stepNum}
                      </span>
                      <Icon size={18} className={isSelected ? 'text-[#0254EC]' : 'text-[#717783]'} />
                    </div>
                    <h4 className="font-bold text-sm text-[#393F49] mb-2 leading-snug">{step.title}</h4>
                    <p className="text-[11px] text-[#717783] italic mb-2">« {step.analogy} »</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E0E7FF] flex items-center justify-between text-[11px]">
                    <span className="text-[#717783]">{isSelected ? 'En écoute...' : 'Cliquer pour voir'}</span>
                    <Play size={12} className={isSelected ? 'text-[#0254EC] fill-[#0254EC]' : 'text-[#717783]'} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Fiche Détaillée de l'Étape Sélectionnée */}
          <div className="p-6 rounded-3xl bg-white border border-[#E0E7FF] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E0E7FF]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF]">
                  {React.createElement(storySteps[activeStoryStep].icon, { size: 24 })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0254EC] uppercase">
                      {storySteps[activeStoryStep].stepNum}
                    </span>
                    <span className="text-[#E0E7FF]">/</span>
                    <h3 className="text-lg font-black text-[#393F49]">{storySteps[activeStoryStep].title}</h3>
                  </div>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">
                    Analogie : « {storySteps[activeStoryStep].analogy} »
                  </p>
                </div>
              </div>

              <button
                onClick={() => narrator.speak(storySteps[activeStoryStep].voiceText)}
                className="px-3.5 py-2 rounded-full bg-[#F8F4FF] hover:bg-white text-[#393F49] text-xs font-semibold flex items-center gap-2 border border-[#E0E7FF] transition shadow-xs"
              >
                <Volume2 size={15} className="text-[#0254EC]" />
                <span>Réécouter la voix</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#717783] uppercase tracking-wider font-bold">
                  Ce qui se passe concrètement
                </span>
                <p className="text-[#393F49] leading-relaxed bg-[#F8F4FF] p-4 rounded-2xl border border-[#E0E7FF]">
                  {storySteps[activeStoryStep].explanation}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-[#BE185D] uppercase tracking-wider font-bold">
                  Conséquence immédiate
                </span>
                <div className="bg-[#FDF2F8] border border-[#FBCFE8] p-4 rounded-2xl text-[#BE185D] leading-relaxed flex items-center gap-3 font-medium">
                  <AlertTriangle size={24} className="text-[#BE185D] shrink-0" />
                  <span>{storySteps[activeStoryStep].impactSimple}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ONGLET 2 : LES IMPACTS RÉELS SUR L'ENTREPRISE */}
      {activeTab === 'impacts' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* En-tête des impacts */}
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#393F49]">
              Une cyberattaque n'est pas un problème informatique : c'est une crise d'entreprise majeure.
            </h2>
            <p className="text-xs sm:text-sm text-[#717783]">
              Lorsque les ordinateurs s'arrêtent, l'ensemble des métiers (commerce, production, comptabilité, logistique) est touché en quelques secondes.
            </p>
          </div>

          {/* Grille des 4 piliers d'impacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impactsList.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between ${item.color}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-white/80 border border-current/20 shadow-xs">
                          <Icon size={20} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-[#393F49] text-base leading-tight">{item.title}</h3>
                          <span className="text-xs text-[#717783]">{item.subtitle}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-current/20 text-[10px] font-bold uppercase shadow-xs">
                        {item.severity}
                      </span>
                    </div>

                    <p className="text-xs text-[#393F49] leading-relaxed mt-4 bg-white/70 p-4 rounded-2xl border border-current/10">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-current/15 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#393F49]">{item.stat}</span>
                    <span className="text-xs text-[#717783] font-medium">{item.statLabel}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Infographie : Faut-il payer la rançon ? Recommandation DGSSI */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FEF2F2] border border-[#FECACA] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white text-[#DC2626] border border-[#FECACA] shrink-0 shadow-xs">
                <AlertTriangle size={28} />
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#393F49]">
                    Pourquoi la DGSSI, le maCERT et la Justice recommandent de NE JAMAIS PAYER la rançon
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#DC2626] border border-[#FECACA] text-[10px] font-bold">
                    RÈGLE OFFICIELLE
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-white p-4 rounded-2xl border border-[#FECACA] shadow-xs">
                    <span className="font-bold text-[#DC2626] block mb-1">❌ Aucune Garantie</span>
                    <p className="text-[#717783] leading-relaxed">
                      Dans 40% des cas où la rançon a été payée, la clé de déchiffrement ne fonctionne pas ou les données sont corrompues.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#FECACA] shadow-xs">
                    <span className="font-bold text-amber-700 block mb-1">🔄 Cible Récidiviste</span>
                    <p className="text-[#717783] leading-relaxed">
                      80% des entreprises ayant payé sont réattaquées dans les 12 mois car les criminels savent qu'elles cèdent au chantage.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#FECACA] shadow-xs">
                    <span className="font-bold text-[#0254EC] block mb-1">🛡️ La Seule Issue</span>
                    <p className="text-[#717783] leading-relaxed">
                      Avoir des sauvegardes immuables hors-ligne étanches (Air-Gap) permet de restaurer l'entreprise sans donner un seul centime aux pirates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ONGLET 3 : SENSIBILISATION & ATELIER PRATIQUE */}
      {activeTab === 'reflexes' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Les 5 Réflexes Clés pour Tous les Employés */}
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#393F49] mb-3 flex items-center gap-2">
              <Award className="text-[#0254EC]" size={20} />
              <span>Les 5 Réflexes d'Or du Collaborateur Vigilant</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {[
                {
                  num: '1',
                  title: 'La pause de 3 secondes',
                  text: 'Avant de cliquer, observez le nom et l\'adresse réelle complète de l\'expéditeur.',
                  tag: 'Vérification',
                },
                {
                  num: '2',
                  title: 'Méfiez-vous de l\'urgence',
                  text: '« URGENT », « DERNIER RAPPEL », « FACTURE BLOQUÉE » : le pirate veut vous faire paniquer.',
                  tag: 'Psychologie',
                },
                {
                  num: '3',
                  title: 'Le réflexe qui sauve',
                  text: 'Si vous avez cliqué par erreur : débranchez votre câble réseau immédiatement et prévenez l\'IT.',
                  tag: 'Réaction Choc',
                },
                {
                  num: '4',
                  title: 'Le double cadenas (MFA)',
                  text: 'Activez la validation sur téléphone pour chaque mot de passe important.',
                  tag: 'Protection',
                },
                {
                  num: '5',
                  title: 'Zéro culpabilité',
                  text: 'Signalez immédiatement une erreur. Plus vite l\'IT est prévenue, moins l\'impact est lourd.',
                  tag: 'Transparence',
                },
              ].map((reflexe, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-[#E0E7FF] flex flex-col justify-between shadow-xs hover:border-[#0254EC] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF] text-xs font-black flex items-center justify-center">
                        {reflexe.num}
                      </span>
                      <span className="text-[10px] font-mono text-[#717783] uppercase">{reflexe.tag}</span>
                    </div>
                    <h4 className="font-bold text-xs text-[#393F49] mb-1.5">{reflexe.title}</h4>
                    <p className="text-[11px] text-[#717783] leading-relaxed">{reflexe.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ATELIER INTERACTIF : Détectez les 4 pièges du faux courriel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E0E7FF] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E0E7FF]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#FDF2F8] text-[#BE185D] border border-[#FBCFE8] text-xs font-bold uppercase">
                    Atelier Interactif
                  </span>
                  <span className="text-xs font-bold text-[#717783]">
                    Trouvés : {totalCluesFound} / 4 indices
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#393F49] mt-1">
                  Exercice Pratique : Cliquez sur les 4 éléments suspects de ce faux courriel !
                </h3>
              </div>

              {totalCluesFound === 4 ? (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-xs shadow-xs">
                  <CheckCircle2 size={16} />
                  <span>Félicitations ! Vous avez déjoué le piège !</span>
                </div>
              ) : (
                <span className="text-xs text-[#717783] italic">
                  💡 Cliquez sur l'expéditeur, l'urgence, la pièce jointe ou le bouton pour révéler le piège.
                </span>
              )}
            </div>

            {/* Faux Client Mail Outlook Interactif */}
            <div className="max-w-3xl mx-auto rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 font-sans shadow-xs">
              {/* En-tête de message */}
              <div className="border-b border-[#E2E8F0] pb-4 mb-4 space-y-3">
                {/* 1. Zone Expéditeur Cliquable */}
                <div
                  onClick={() => handleClueClick('sender')}
                  className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                    foundClues.sender
                      ? 'bg-[#FEF2F2] border-[#DC2626] ring-2 ring-[#DC2626]/20'
                      : 'bg-white hover:bg-[#F1F5F9] border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#717783]">De : </span>
                      <span className="font-bold text-[#393F49]">Direction des Ressources Humaines </span>
                      <span className="text-[#DC2626] font-mono text-[11px] underline">
                        &lt;rh-direction@societe-portail-rh.online&gt;
                      </span>
                    </div>
                    {foundClues.sender ? (
                      <span className="text-[10px] text-[#DC2626] font-bold flex items-center gap-1">
                        <XCircle size={13} /> Fausse adresse !
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#717783]">❓ Suspect ?</span>
                    )}
                  </div>
                </div>

                {/* Objet & Urgence Cliquable */}
                <div
                  onClick={() => handleClueClick('urgency')}
                  className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                    foundClues.urgency
                      ? 'bg-[#FEF2F2] border-[#DC2626] ring-2 ring-[#DC2626]/20'
                      : 'bg-white hover:bg-[#F1F5F9] border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#717783]">Objet : </span>
                      <span className="font-bold text-[#DC2626]">
                        [URGENT] Mise à jour obligatoire de vos coordonnées bancaires avant suspension
                      </span>
                    </div>
                    {foundClues.urgency ? (
                      <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                        <AlertTriangle size={13} /> Fausses menaces d'urgence !
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#717783]">❓ Suspect ?</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Corps de l'email */}
              <div className="text-xs text-[#393F49] space-y-4 py-2">
                <p>Bonjour,</p>
                <p>
                  Suite à un changement de prestataire bancaire d'entreprise, tous les collaborateurs doivent impérativement vérifier leur fiche salariale dans les <b>2 prochaines heures</b> sous peine de blocage du prochain virement de salaire.
                </p>

                {/* 3. Pièce Jointe Cliquable */}
                <div
                  onClick={() => handleClueClick('attachment')}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all inline-flex items-center gap-3 ${
                    foundClues.attachment
                      ? 'bg-[#FEF2F2] border-[#DC2626] ring-2 ring-[#DC2626]/20'
                      : 'bg-white hover:bg-[#F1F5F9] border-[#E2E8F0]'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-[#F5F0FF] text-[#0254EC]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-[#393F49] block text-xs">
                      Grille_Salaires_2026_MiseAJour.docm
                    </span>
                    <span className="text-[10px] text-[#717783]">Document Word avec Macros (.docm) - 48 Ko</span>
                  </div>
                  {foundClues.attachment && (
                    <span className="text-[10px] font-bold text-[#DC2626] ml-2">⚠️ Macro malveillante !</span>
                  )}
                </div>

                {/* 4. Bouton Lien Cliquable */}
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClueClick('button')
                    }}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition active:translate-y-[1px] ${
                      foundClues.button
                        ? 'bg-[#DC2626] text-white shadow-sm'
                        : 'bg-[#0254EC] hover:bg-[#0043C7] text-white shadow-sm'
                    }`}
                  >
                    <span>Valider mon dossier sur le portail externe</span>
                    {foundClues.button && <span className="text-[10px]">(Faux portail !)</span>}
                  </button>
                </div>

                <p className="text-[11px] text-[#717783] pt-3">
                  Cordialement,<br />
                  Le Service des Ressources Humaines
                </p>
              </div>
            </div>

            {/* Explication pédagogique contextuelle */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl bg-[#F5F0FF] border border-[#E0E7FF] flex items-start gap-3 text-xs"
              >
                <Info size={18} className="text-[#0254EC] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#393F49] text-sm">
                    {phishingClues[showExplanation as keyof typeof phishingClues].title}
                  </h4>
                  <p className="text-[#717783] mt-1 leading-relaxed">
                    {phishingClues[showExplanation as keyof typeof phishingClues].detail}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* 4. Barre de Navigation Inférieure */}
      <div className="mt-12 pt-6 border-t border-[#E0E7FF] flex flex-wrap items-center justify-between gap-4 text-xs text-[#717783]">
        <Link
          to="/enterprise"
          onClick={() => sound.playClick()}
          className="flex items-center gap-1.5 hover:text-[#393F49] font-medium transition"
        >
          <ArrowLeft size={14} />
          <span>Retour à la Vue Entreprise</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/quiz"
            onClick={() => sound.playClick()}
            className="px-5 py-2.5 rounded-full bg-[#0254EC] hover:bg-[#0043C7] text-white font-bold flex items-center gap-2 shadow-sm transition active:translate-y-[1px]"
          >
            <span>Passer au Quiz de Clôture</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

