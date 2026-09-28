import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Paperclip,
  AlertTriangle,
  FileText,
  CheckCircle2,
  X,
  Minus,
  Square,
  Search,
  Inbox,
  Send,
  Trash2,
  ShieldAlert,
  ArrowRight,
  Info,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { sound } from '../../utils/audio'

interface OutlookSimulatorProps {
  onMacroTrigger?: () => void
}

export default function OutlookSimulator({ onMacroTrigger }: OutlookSimulatorProps) {
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'junk'>('inbox')
  const [selectedMailId, setSelectedMailId] = useState<number>(1)
  const [isWordOpen, setIsWordOpen] = useState<boolean>(false)
  const [macroActivated, setMacroActivated] = useState<boolean>(false)
  const [showHeaderInspection, setShowHeaderInspection] = useState<boolean>(false)

  const emails = [
    {
      id: 1,
      sender: 'Direction des Ressources Humaines',
      email: 'rh-direction@societe-portail-rh.online',
      isPhishing: true,
      subject: '[URGENT] Mise à jour obligatoire des coordonnées bancaires avant suspension des virements',
      date: '09:14',
      unread: true,
      attachment: 'Grille_Salaires_2026_MiseAJour.docm',
      size: '342 Ko',
      preview: 'Chère Sophie, Suite à un audit fiscal urgent, nous constatons des incohérences dans votre dossier de rémunération...',
    },
    {
      id: 2,
      sender: 'Comité Social et Économique (CSE)',
      email: 'cse-contact@groupe-meridian.com',
      isPhishing: false,
      subject: 'Billetterie cinéma & chèques vacances du 2ème trimestre',
      date: '08:30',
      unread: false,
      attachment: null,
      size: '',
      preview: 'Bonjour à tous, Les commandes de chèques vacances pour la période estivale sont désormais ouvertes jusqu’au 15 avril...',
    },
    {
      id: 3,
      sender: 'Support Informatique DSI',
      email: 'support-dsi@groupe-meridian.com',
      isPhishing: false,
      subject: 'Rappel : Campagne de renouvellement des mots de passe trimestriels',
      date: 'Hier',
      unread: false,
      attachment: null,
      size: '',
      preview: 'Pour rappel, la politique de sécurité impose un mot de passe robuste de 14 caractères minimum avec double facteur MFA...',
    },
  ]

  const currentEmail = emails.find((e) => e.id === selectedMailId) || emails[0]

  const handleOpenAttachment = () => {
    sound.playClick()
    setIsWordOpen(true)
  }

  const handleEnableMacro = () => {
    sound.playAlarm()
    setMacroActivated(true)
    if (onMacroTrigger) {
      onMacroTrigger()
    }
  }

  return (
    <div className="relative w-full rounded-[3px] border border-[#E2E4E9] bg-[#1e222b] shadow-tactile overflow-hidden font-sans text-xs select-none">
      {/* 1. Barre de Titre Officielle Microsoft 365 Outlook */}
      <div className="flex items-center justify-between bg-[#002447] px-4 py-2 border-b border-[#00386b] text-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#0078d4] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            O
          </div>
          <span className="font-semibold text-slate-100 text-xs">
            Courrier - Sophie Martin (sophie.martin@groupe-meridian.com) - Microsoft Outlook 365
          </span>
        </div>

        {/* Barre de recherche centrale */}
        <div className="hidden md:flex items-center gap-2 bg-[#001830] px-4 py-1 rounded-md border border-[#003d75] w-72 text-slate-400">
          <Search size={13} />
          <span className="text-[11px]">Rechercher dans la boîte aux lettres</span>
        </div>

        {/* Boutons de fenêtre Windows */}
        <div className="flex items-center gap-2 text-slate-400">
          <button className="hover:text-white px-2 py-0.5"><Minus size={13} /></button>
          <button className="hover:text-white px-2 py-0.5"><Square size={12} /></button>
          <button className="hover:text-white hover:bg-red-600/80 px-2 py-0.5 rounded"><X size={13} /></button>
        </div>
      </div>

      {/* 2. Le Ruban Office 365 (Fichier, Accueil, Affichage...) */}
      <div className="bg-[#1f2937] px-4 py-1.5 border-b border-slate-700/80 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="text-white font-bold border-b-2 border-blue-500 pb-1 cursor-pointer">Accueil</span>
          <span className="text-slate-400 hover:text-white cursor-pointer pb-1">Envoyer / Recevoir</span>
          <span className="text-slate-400 hover:text-white cursor-pointer pb-1">Dossier</span>
          <span className="text-slate-400 hover:text-white cursor-pointer pb-1">Affichage</span>
          <span className="text-slate-400 hover:text-white cursor-pointer pb-1">Aide</span>
        </div>

        {/* Alerte Pédagogique RSSI */}
        <button
          onClick={() => setShowHeaderInspection(!showHeaderInspection)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition"
        >
          <ShieldAlert size={14} />
          <span>{showHeaderInspection ? 'Masquer l’analyse RFC822' : 'Inspecter l’expéditeur (Piège)'}</span>
        </button>
      </div>

      {/* 3. Corps Outlook (Dossiers + Liste des e-mails + Volet de lecture) */}
      <div className="grid grid-cols-12 min-h-[440px] max-h-[520px] bg-[#111827]">
        {/* Arborescence des Dossiers (Gauche) */}
        <div className="col-span-12 md:col-span-2 bg-[#0f172a] border-r border-slate-800 p-2 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-1 font-bold">
            Dossiers Sophie RH
          </div>
          <button
            onClick={() => setActiveFolder('inbox')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeFolder === 'inbox'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Inbox size={14} />
              <span>Boîte de réception</span>
            </span>
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </span>
          </button>

          <button
            onClick={() => setActiveFolder('sent')}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeFolder === 'sent'
                ? 'bg-blue-600/30 text-blue-300'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Send size={14} />
            <span>Éléments envoyés</span>
          </button>

          <button
            onClick={() => setActiveFolder('junk')}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeFolder === 'junk'
                ? 'bg-blue-600/30 text-blue-300'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Trash2 size={14} />
            <span>Courrier indésirable</span>
          </button>
        </div>

        {/* Liste des Messages (Milieu) */}
        <div className="col-span-12 md:col-span-4 bg-[#1a2333] border-r border-slate-800 overflow-y-auto">
          <div className="p-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <span className="font-bold text-slate-300 text-xs">Tous les messages (3)</span>
            <span className="text-[11px] text-blue-400 font-mono">Trier par : Date ↓</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {emails.map((e) => {
              const isSelected = selectedMailId === e.id
              return (
                <div
                  key={e.id}
                  onClick={() => {
                    sound.playClick()
                    setSelectedMailId(e.id)
                  }}
                  className={`p-3 cursor-pointer transition relative ${
                    isSelected
                      ? 'bg-[#1e293b] border-l-4 border-blue-500'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  {e.unread && (
                    <span className="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/80"></span>
                  )}

                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs truncate max-w-[180px] ${e.unread ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                      {e.sender}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{e.date}</span>
                  </div>

                  <div className={`text-[11px] truncate mb-1 ${e.unread ? 'font-bold text-blue-300' : 'text-slate-300'}`}>
                    {e.subject}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                    {e.preview}
                  </p>

                  {e.attachment && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 w-fit">
                      <Paperclip size={11} />
                      <span>{e.attachment}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Volet de Lecture Réaliste (Droite) */}
        <div className="col-span-12 md:col-span-6 bg-[#111827] flex flex-col justify-between overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Sujet de l'e-mail */}
            <h2 className="text-sm font-bold text-white leading-snug">
              {currentEmail.subject}
            </h2>

            {/* En-tête expéditeur */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow">
                  DR
                </div>
                <div>
                  <div className="font-bold text-slate-100 text-xs flex items-center gap-2">
                    <span>{currentEmail.sender}</span>
                    {currentEmail.isPhishing && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 border border-red-700">
                        HAMEÇONNAGE SUSPECTÉ
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    &lt;{currentEmail.email}&gt;
                  </div>
                  <div className="text-[10px] text-slate-500">
                    À : Sophie Martin &lt;sophie.martin@groupe-meridian.com&gt;
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{currentEmail.date}</span>
            </div>

            {/* Inspection technique de l'en-tête (Outil Pédagogique RSSI) */}
            <AnimatePresence>
              {showHeaderInspection && currentEmail.isPhishing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-950/40 border border-red-500/50 rounded-xl p-3 text-xs space-y-2 text-red-200"
                >
                  <div className="flex items-center gap-2 font-bold font-mono text-[11px] text-red-400 uppercase">
                    <AlertTriangle size={15} />
                    <span>Analyseur d'Ingénierie Sociale (Pourquoi ce mail est un piège)</span>
                  </div>
                  <div className="space-y-1 text-[11px] font-sans">
                    <p>
                      🔴 <b>Usurpation de domaine (Typosquatting) :</b> Le domaine expéditeur est <code className="bg-black/60 px-1 rounded text-amber-300">societe-portail-rh.online</code> alors que le domaine interne officiel est <code className="bg-black/60 px-1 rounded text-emerald-300">groupe-meridian.com</code>.
                    </p>
                    <p>
                      ⚠️ <b>Levier d'urgence artificielle :</b> Menace de « suspension des salaires » pour forcer Sophie à contourner sa vigilance.
                    </p>
                    <p>
                      ☣️ <b>Format dangereux :</b> Le fichier porte l'extension <code className="bg-black/60 px-1 rounded text-red-300">.docm</code> (document Word avec macros VBA intégrées).
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Corps du message */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-sans">
              <p>Chère Sophie,</p>
              <p>
                Suite aux récentes déclarations fiscales et au contrôle de l’exercice 2025, nous constatons une anomalie bloquante sur le fichier des rémunérations et primes du personnel.
              </p>
              <p className="font-semibold text-amber-200 bg-amber-950/30 p-2 rounded border-l-2 border-amber-500">
                ⚠️ Sans régularisation de votre part avant 11h00, le virement des salaires de l'ensemble du département sera temporairement suspendu par la banque.
              </p>
              <p>
                Veuillez ouvrir la pièce jointe ci-dessous, vérifier vos coordonnées et activer le contenu pour autoriser la validation cryptographique du document.
              </p>
              <p className="text-slate-400 italic">
                Direction des Ressources Humaines — Groupe Meridian
              </p>
            </div>

            {/* Bloc Pièce Jointe Word Réaliste */}
            {currentEmail.attachment && (
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                  1 pièce jointe attachée (342 Ko) :
                </span>
                <div
                  onClick={handleOpenAttachment}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-blue-500/40 hover:border-blue-400 hover:bg-slate-850 cursor-pointer transition shadow group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#2b579a] text-white flex items-center justify-center font-bold text-sm shadow">
                      W
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-xs group-hover:text-blue-300 transition">
                        {currentEmail.attachment}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Document Microsoft Word Macro-activé · 342 Ko
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow">
                    <span>Ouvrir</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Microsoft Exchange Server · Connexion sécurisée TLS 1.3</span>
            <span className="text-amber-400 font-mono">Poste : PC-RH-01 (Sophie Martin)</span>
          </div>
        </div>
      </div>

      {/* 4. MODALE MICROSOFT WORD 365 AVEC VRAIE BANNIÈRE JAUNE DE MACRO */}
      <AnimatePresence>
        {isWordOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-400 overflow-hidden flex flex-col font-sans"
            >
              {/* Barre de titre Word */}
              <div className="bg-[#2b579a] text-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-white text-[#2b579a] font-bold text-xs flex items-center justify-center">
                    W
                  </span>
                  <span className="font-semibold text-xs">
                    Grille_Salaires_2026_MiseAJour.docm [Mode Protégé] - Word
                  </span>
                </div>
                <button
                  onClick={() => setIsWordOpen(false)}
                  className="hover:bg-red-600 text-white px-2 py-0.5 rounded transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* VRAIE BANNIÈRE JAUNE OFFICIELLE DE SÉCURITÉ WORD */}
              <div className="bg-[#fff4ce] border-b border-[#ffe28a] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-900">
                <div className="flex items-center gap-2.5 text-xs font-semibold">
                  <AlertTriangle size={18} className="text-[#a4262c] shrink-0" />
                  <span>
                    <b>AVERTISSEMENT DE SÉCURITÉ :</b> Les macros ont été désactivées par votre administrateur pour protéger votre ordinateur.
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleEnableMacro}
                    className={`px-4 py-1.5 rounded font-bold text-xs shadow transition-all ${
                      macroActivated
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-[#a4262c] hover:bg-[#851e23] text-white'
                    }`}
                  >
                    {macroActivated ? '⚠️ CHARGE VIRALE ACTIVÉE' : 'Activer le contenu'}
                  </button>
                  <button
                    onClick={() => setIsWordOpen(false)}
                    className="px-3 py-1.5 rounded border border-slate-300 text-xs font-medium hover:bg-slate-100"
                  >
                    Ignorer
                  </button>
                </div>
              </div>

              {/* Document Factice Word */}
              <div className="p-8 bg-slate-50 min-h-[300px] overflow-y-auto space-y-4">
                <div className="max-w-2xl mx-auto bg-white p-6 shadow-md border border-slate-200 space-y-4 text-xs">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <span className="font-extrabold text-sm text-slate-800 tracking-wider uppercase">
                      GROUPE MERIDIAN · DÉPARTEMENT RH
                    </span>
                    <span className="text-slate-400 font-mono">CONFIDENTIEL</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 text-center">
                    GRILLE SALARIALE & PRIMES EXCEPTIONNELLES 2026
                  </h3>

                  <p className="text-slate-600 leading-relaxed text-justify">
                    Document officiel de synchronisation bancaire. Pour afficher le tableau dynamique des rémunérations et la fiche individuelle de validation, veuillez autoriser les macros du document via le bandeau jaune supérieur.
                  </p>

                  <table className="w-full text-[11px] border border-slate-200">
                    <thead className="bg-slate-100 font-bold">
                      <tr>
                        <th className="p-2 border">Matricule</th>
                        <th className="p-2 border">Collaborateur</th>
                        <th className="p-2 border">Statut Virement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-mono">RH-8412</td>
                        <td className="p-2 border font-semibold">Sophie Martin</td>
                        <td className="p-2 border text-amber-600 font-bold">En attente de validation</td>
                      </tr>
                    </tbody>
                  </table>

                  {macroActivated && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-red-100 border border-red-400 rounded-lg text-red-900 space-y-1 font-mono text-[11px]"
                    >
                      <div className="font-bold flex items-center gap-1.5 text-red-700">
                        <AlertTriangle size={15} />
                        <span>DÉCLENCHEMENT DE LA CHARGE VIRALE (VBA PAYLOAD)</span>
                      </div>
                      <p>▶ Exécution masquée : <code className="bg-red-200 px-1">powershell.exe -w hidden -enc JABz...</code></p>
                      <p>▶ Connexion sortante établie vers <code className="bg-red-200 px-1">185.22.14.89:443 (C2 Pirate)</code></p>
                      <p className="text-red-700 font-bold">⚠️ La machine est désormais compromise. L'attaquant a pris la main.</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
