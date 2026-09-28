import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Lock,
  AlertTriangle,
  Folder,
  HardDrive,
  Cpu,
  Activity,
  X,
  Minus,
  Square,
  Search,
  Wifi,
  Volume2,
  Calendar,
  Layers,
  FileCode,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  Skull,
  Mail,
  FileSpreadsheet,
  Database,
  ExternalLink,
} from 'lucide-react'
import { sound } from '../../utils/audio'

interface WindowsDesktopSimulatorProps {
  mode?: 'taskmanager' | 'explorer' | 'ransomware'
  initialEncrypted?: boolean
}

export default function WindowsDesktopSimulator({
  mode = 'explorer',
  initialEncrypted = false,
}: WindowsDesktopSimulatorProps) {
  const [activeWindow, setActiveWindow] = useState<'explorer' | 'taskmanager' | 'lockbit'>(
    mode === 'ransomware' ? 'lockbit' : mode
  )
  const [isEncrypted, setIsEncrypted] = useState<boolean>(initialEncrypted)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [showRansomNote, setShowRansomNote] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(36000) // 10:00:00

  useEffect(() => {
    if (mode === 'ransomware') {
      setIsEncrypted(true)
      setActiveWindow('lockbit')
    }
  }, [mode])

  // Décompte du rançongiciel
  useEffect(() => {
    let timer: any
    if (isEncrypted) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isEncrypted])

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const files = [
    {
      name: 'Grille_Salaires_Direction_2026.xlsx',
      lockedName: 'Grille_Salaires_Direction_2026.xlsx.lockbit',
      size: '14.2 Mo',
      date: 'Aujourd\'hui 09:14',
      type: 'Feuille de calcul Excel',
      icon: FileSpreadsheet,
      color: 'text-emerald-400',
    },
    {
      name: 'Contrats_Cadres_Clients_2026.pdf',
      lockedName: 'Contrats_Cadres_Clients_2026.pdf.lockbit',
      size: '88.4 Mo',
      date: 'Aujourd\'hui 09:14',
      type: 'Document Adobe Acrobat',
      icon: FileText,
      color: 'text-rose-400',
    },
    {
      name: 'Base_Collaborateurs_RH.mdf',
      lockedName: 'Base_Collaborateurs_RH.mdf.lockbit',
      size: '210.5 Mo',
      date: 'Aujourd\'hui 09:15',
      type: 'Base de données SQL Server',
      icon: Database,
      color: 'text-blue-400',
    },
    {
      name: 'Organigramme_Confidentiel_Groupe.docx',
      lockedName: 'Organigramme_Confidentiel_Groupe.docx.lockbit',
      size: '8.7 Mo',
      date: 'Aujourd\'hui 09:15',
      type: 'Document Microsoft Word',
      icon: FileText,
      color: 'text-indigo-400',
    },
  ]

  const processes = [
    {
      name: 'powershell.exe (Malveillant)',
      pid: 7220,
      cpu: '48.2 %',
      ram: '312 Mo',
      malicious: true,
      args: 'powershell.exe -w hidden -enc JABzACAAPQ... (C2 185.22.14.89:443)',
    },
    {
      name: 'lockbit_payload.exe',
      pid: 8140,
      cpu: '35.4 %',
      ram: '185 Mo',
      malicious: true,
      args: 'lockbit3.exe -pass 15btc --all-drives',
    },
    {
      name: 'Microsoft Outlook (OUTLOOK.EXE)',
      pid: 4812,
      cpu: '1.2 %',
      ram: '145 Mo',
      malicious: false,
      args: '',
    },
    {
      name: 'Explorateur Windows (explorer.exe)',
      pid: 1420,
      cpu: '0.8 %',
      ram: '92 Mo',
      malicious: false,
      args: '',
    },
  ]

  const handleSimulateEncryption = () => {
    sound.playAlarm()
    setIsEncrypted(true)
    setActiveWindow('lockbit')
  }

  const handleResetDesktop = () => {
    sound.playClick()
    setIsEncrypted(false)
    setActiveWindow('explorer')
    setShowRansomNote(false)
  }

  return (
    <div className="relative w-full rounded-[3px] border border-[#E2E4E9] bg-[#0f172a] shadow-tactile overflow-hidden font-sans select-none aspect-[16/10] max-h-[580px] flex flex-col justify-between">
      {/* 1. BUREAU WINDOWS 11 (FOND D'ÉCRAN BLOOM AUTHENTIQUE) */}
      <div
        className={`relative flex-1 p-4 transition-all duration-700 ${
          isEncrypted
            ? 'bg-gradient-to-br from-red-950 via-slate-950 to-black'
            : 'bg-gradient-to-br from-[#1b3a57] via-[#0d2137] to-[#08121f]'
        }`}
      >
        {/* Motif Bloom Windows 11 stylisé */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-400 via-blue-700 to-transparent"></div>

        {/* Raccourcis sur le Bureau Windows 11 */}
        <div className="grid grid-flow-col grid-rows-5 gap-3 w-fit relative z-10 text-[11px] text-white">
          <div
            onClick={() => setActiveWindow('explorer')}
            className="flex flex-col items-center gap-1 p-2 rounded-[3px] hover:bg-white/10 cursor-pointer w-20 text-center transition"
          >
            <Folder size={32} className="text-amber-400 drop-shadow" />
            <span className="drop-shadow line-clamp-2">Ce PC</span>
          </div>

          <div
            onClick={() => setActiveWindow('explorer')}
            className="flex flex-col items-center gap-1 p-2 rounded-[3px] hover:bg-white/10 cursor-pointer w-20 text-center transition"
          >
            <Folder size={32} className="text-sky-400 drop-shadow" />
            <span className="drop-shadow line-clamp-2">Dossier RH</span>
          </div>

          <div
            onClick={() => sound.playClick()}
            className="flex flex-col items-center gap-1 p-2 rounded-[3px] hover:bg-white/10 cursor-pointer w-20 text-center transition"
          >
            <div className="w-8 h-8 rounded-[2px] bg-blue-600 flex items-center justify-center font-bold text-white shadow">
              W
            </div>
            <span className="drop-shadow line-clamp-2">Word</span>
          </div>

          <div
            onClick={() => sound.playClick()}
            className="flex flex-col items-center gap-1 p-2 rounded-[3px] hover:bg-white/10 cursor-pointer w-20 text-center transition"
          >
            <div className="w-8 h-8 rounded-[2px] bg-[#0078d4] flex items-center justify-center font-bold text-white shadow">
              O
            </div>
            <span className="drop-shadow line-clamp-2">Outlook</span>
          </div>

          {isEncrypted && (
            <div
              onClick={() => {
                sound.playAlarm()
                setShowRansomNote(true)
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-[3px] bg-red-900/60 border border-red-500/80 hover:bg-red-800 cursor-pointer w-20 text-center transition animate-bounce"
            >
              <FileText size={32} className="text-red-300 drop-shadow" />
              <span className="text-red-200 font-bold drop-shadow line-clamp-2">
                RESTORE-FILES.txt
              </span>
            </div>
          )}
        </div>

        {/* 2. FENÊTRE ACTIVE CENTRALE */}

        {/* A. EXPLORATEUR DE FICHIERS WINDOWS 11 */}
        {activeWindow === 'explorer' && (
          <div className="absolute inset-6 md:inset-10 z-20 rounded-[3px] bg-slate-900/95 border border-slate-700 shadow-tactile flex flex-col overflow-hidden backdrop-blur-md">
            {/* Barre de titre Explorateur */}
            <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-slate-300">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Folder size={15} className="text-amber-400" />
                <span>Ce PC &gt; Disque Local (C:) &gt; Données RH Confidentielles</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveWindow('taskmanager')}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Gestionnaire Tâches
                </button>
                <button
                  onClick={handleSimulateEncryption}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Déclencher Chiffrement
                </button>
                <div className="flex items-center gap-1.5 ml-2 text-slate-400">
                  <Minus size={12} />
                  <Square size={11} />
                  <X size={13} className="text-red-400" />
                </div>
              </div>
            </div>

            {/* Contenu du dossier */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-900">
              {isEncrypted && (
                <div className="mb-3 p-3 rounded-[3px] bg-red-950/70 border border-red-500/80 text-xs text-red-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skull size={18} className="text-red-400 shrink-0" />
                    <span>
                      <b>ALERTE RANÇONGICIEL EN COURS :</b> Clé symétrique AES-256 appliquée sur 4 829 fichiers.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveWindow('lockbit')}
                    className="px-2.5 py-1 rounded-[2px] bg-red-600 text-white font-bold text-[11px] hover:bg-red-500 font-mono uppercase tracking-wider"
                  >
                    Voir l'écran LockBit
                  </button>
                </div>
              )}

              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[11px] font-mono">
                    <th className="pb-2">Nom du fichier</th>
                    <th className="pb-2">Date de modification</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Taille</th>
                    <th className="pb-2 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {files.map((file, idx) => {
                    const Icon = file.icon
                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedFileName(file.name)}
                        className={`hover:bg-slate-800/60 cursor-pointer transition ${
                          selectedFileName === file.name ? 'bg-slate-800/80' : ''
                        }`}
                      >
                        <td className="py-2.5 flex items-center gap-2.5">
                          <Icon size={18} className={isEncrypted ? 'text-red-400' : file.color} />
                          <span
                            className={`font-medium ${
                              isEncrypted ? 'text-red-300 font-mono line-through decoration-red-500' : 'text-slate-100'
                            }`}
                          >
                            {isEncrypted ? file.lockedName : file.name}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-[11px] text-slate-400">{file.date}</td>
                        <td className="py-2.5 text-[11px] text-slate-400">
                          {isEncrypted ? 'Fichier verrouillé (.lockbit)' : file.type}
                        </td>
                        <td className="py-2.5 font-mono text-[11px] text-slate-400">{file.size}</td>
                        <td className="py-2.5 text-right">
                          {isEncrypted ? (
                            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-bold bg-red-950 border border-red-600 text-red-300">
                              🔒 CHIFFRÉ
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono bg-emerald-950 border border-emerald-600 text-emerald-300">
                              ✓ NORMAL
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* B. GESTIONNAIRE DES TÂCHES WINDOWS 11 */}
        {activeWindow === 'taskmanager' && (
          <div className="absolute inset-6 md:inset-10 z-20 rounded-[3px] bg-slate-900/95 border border-slate-700 shadow-tactile flex flex-col overflow-hidden backdrop-blur-md">
            <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-slate-300">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Activity size={15} className="text-blue-400" />
                <span>Gestionnaire des tâches - Processus en arrière-plan</span>
              </div>
              <button
                onClick={() => setActiveWindow('explorer')}
                className="text-xs text-slate-400 hover:text-white px-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-slate-900 text-xs">
              <table className="w-full text-left text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[11px] font-mono">
                    <th className="pb-2">Nom du processus</th>
                    <th className="pb-2">PID</th>
                    <th className="pb-2">Processeur (CPU)</th>
                    <th className="pb-2">Mémoire (RAM)</th>
                    <th className="pb-2 text-right">Menace Détectée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {processes.map((p, idx) => (
                    <tr
                      key={idx}
                      className={p.malicious ? 'bg-red-950/40 text-red-200 font-bold' : ''}
                    >
                      <td className="py-2 flex items-center gap-2">
                        {p.malicious ? (
                          <AlertTriangle size={14} className="text-red-400 shrink-0" />
                        ) : (
                          <Cpu size={14} className="text-slate-400 shrink-0" />
                        )}
                        <span>{p.name}</span>
                      </td>
                      <td className="py-2">{p.pid}</td>
                      <td className="py-2">{p.cpu}</td>
                      <td className="py-2">{p.ram}</td>
                      <td className="py-2 text-right">
                        {p.malicious ? (
                          <span className="text-red-400">CRITIQUE (C2 / Malveillant)</span>
                        ) : (
                          <span className="text-slate-500">Légitime</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* C. ÉCRAN DE VERROUILLAGE TOTAL LOCKBIT 3.0 */}
        {activeWindow === 'lockbit' && (
          <div className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center p-6 text-center text-white select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-2xl w-full border-2 border-red-600 bg-red-950/40 p-6 rounded-[3px] shadow-tactile-lg space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 animate-pulse"></div>

              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-[3px] bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-inner animate-pulse">
                  <Skull size={36} />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-red-500 tracking-wider uppercase font-mono">
                LOCKBIT 3.0 · ALL YOUR FILES ARE ENCRYPTED
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                Tous vos contrats, bilans comptables, bases de données RH et serveurs sont verrouillés avec un chiffrement militaire AES-256 + RSA-4096.
              </p>

              {/* Compte à rebours dramatique */}
              <div className="bg-black/80 border border-red-600/60 p-3 rounded-[3px] inline-block font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                  Temps restant avant destruction irrémédiable de la clé :
                </span>
                <span className="text-2xl sm:text-3xl font-black text-red-400 tabular-nums">
                  {formatCountdown(countdown)}
                </span>
              </div>

              <div className="text-xs font-mono text-amber-300 bg-amber-950/40 p-2 rounded-[2px] border border-amber-600/40">
                💰 Rançon exigée : <b>15.00000000 BTC</b> (~950 000 €)
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowRansomNote(true)}
                  className="px-4 py-2 rounded-[3px] bg-red-600 hover:bg-red-500 text-white font-mono uppercase tracking-wider font-bold text-xs shadow-tactile transition active:translate-y-[1px]"
                >
                  Lire la Note de Rançon
                </button>

                <button
                  onClick={handleResetDesktop}
                  className="px-4 py-2 rounded-[3px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono uppercase tracking-wider font-bold text-xs border border-slate-700 transition active:translate-y-[1px]"
                >
                  Réinitialiser le Bureau
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* 3. BARRE DES TÂCHES CENTRÉE OFFICIELLE WINDOWS 11 */}
      <div className="h-12 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md px-4 flex items-center justify-between text-slate-200 relative z-30">
        {/* Espace gauche (Widgets) */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono bg-slate-900 px-2 py-1 rounded-[2px] border border-slate-800">
            <span className="w-2 h-2 rounded-[1px] bg-emerald-500"></span>
            <span>PC-RH-01 (Sophie Martin)</span>
          </span>
        </div>

        {/* ICÔNES CENTRÉES WINDOWS 11 */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-[3px] border border-slate-800">
          {/* Logo Windows Démarrer */}
          <button
            onClick={() => sound.playClick()}
            title="Démarrer"
            className="w-8 h-8 rounded-[3px] hover:bg-white/10 flex items-center justify-center transition"
          >
            <div className="grid grid-cols-2 gap-0.5">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-[1px]"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-[1px]"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-[1px]"></span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-[1px]"></span>
            </div>
          </button>

          {/* Recherche */}
          <button
            onClick={() => sound.playClick()}
            title="Recherche"
            className="w-8 h-8 rounded-[3px] hover:bg-white/10 flex items-center justify-center text-slate-300 transition"
          >
            <Search size={15} />
          </button>

          {/* Explorateur */}
          <button
            onClick={() => {
              sound.playClick()
              setActiveWindow('explorer')
            }}
            title="Explorateur de fichiers"
            className={`w-8 h-8 rounded-[3px] flex items-center justify-center transition relative ${
              activeWindow === 'explorer' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Folder size={16} className="text-amber-400" />
            <span className="absolute -bottom-1 w-1.5 h-0.5 bg-sky-400 rounded-full"></span>
          </button>

          {/* Gestionnaire de tâches */}
          <button
            onClick={() => {
              sound.playClick()
              setActiveWindow('taskmanager')
            }}
            title="Gestionnaire des tâches"
            className={`w-8 h-8 rounded-[3px] flex items-center justify-center transition relative ${
              activeWindow === 'taskmanager' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Activity size={16} className="text-blue-400" />
          </button>

          {isEncrypted && (
            <button
              onClick={() => {
                sound.playAlarm()
                setActiveWindow('lockbit')
              }}
              title="Alerte LockBit 3.0"
              className="w-8 h-8 rounded-[3px] bg-red-600/60 flex items-center justify-center text-red-300 animate-pulse"
            >
              <Skull size={16} />
            </button>
          )}
        </div>

        {/* Espace droit (Zone de notification Windows 11) */}
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Wifi size={14} className={isEncrypted ? 'text-red-400' : 'text-slate-300'} />
            <Volume2 size={14} />
          </div>

          <div className="text-right font-mono text-[11px] leading-tight">
            <div>09:15</div>
            <div className="text-[9px] text-slate-400">22/09/2026</div>
          </div>
        </div>
      </div>

      {/* MODALE NOTE DE RANÇON RESTORE-INSTRUCTIONS */}
      <AnimatePresence>
        {showRansomNote && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-black border border-red-600 text-red-400 p-6 rounded-[3px] shadow-tactile-lg space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-red-800 pb-2">
                <span className="font-bold flex items-center gap-2">
                  <Skull size={16} />
                  RESTORE_INSTRUCTIONS_LOCKBIT.txt - Bloc-notes
                </span>
                <button
                  onClick={() => setShowRansomNote(false)}
                  className="text-red-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 leading-relaxed text-[11px] bg-red-950/20 p-4 rounded-[2px] border border-red-900/60">
                <p>=======================================================</p>
                <p className="font-bold text-white">&gt;&gt;&gt; LOCKBIT 3.0 RANSOMWARE NOTICE &lt;&lt;&lt;</p>
                <p>Your files are encrypted with military grade algorithms.</p>
                <p>Decryption is only possible with our private key.</p>
                <p>Any attempt to modify or decrypt files with third-party tools will corrupt them permanently.</p>
                <p>PRICE: 15 BITCOINS (~950,000 EUR)</p>
                <p>TOR PORTAL: http://lockbit372k8s9j2.onion/order/meridian-corp</p>
                <p>=======================================================</p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-700 rounded-[3px] text-slate-300 font-sans text-xs">
                <b className="text-amber-400 block mb-1">⚖️ DOCTRINE OFFICIELLE DE L'ANSSI :</b>
                Ne jamais payer la rançon. Le paiement finance les réseaux criminels et n'offre aucune garantie de récupération des données. Mobiliser la cellule de crise et restaurer depuis les sauvegardes Air-Gap saines.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
