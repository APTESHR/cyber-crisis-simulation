import React, { useState, useEffect } from 'react'
import { useGame } from '../../store/GameContext'
import { PARK_FILES } from '../../data/mock'
import { sound } from '../../utils/audio'
import {
  Folder,
  FileText,
  FileSpreadsheet,
  Lock,
  Skull,
  Server,
  ChevronRight,
  HardDrive,
  Copy,
  Trash2,
  Share2,
  RefreshCw,
  Search,
  Maximize2,
  Minimize2,
  X,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react'

export default function WindowsExplorer({
  onAction,
  onOpenLockscreen,
  autoPlay,
}: {
  onAction: (text: string, suggested?: number, patch?: Parameters<ReturnType<typeof useGame>['update']>[0]) => void
  onOpenLockscreen: () => void
  autoPlay?: boolean
}) {
  const g = useGame()
  const [notepadOpen, setNotepadOpen] = useState(false)
  const isEncrypted = g.scenario >= 3

  useEffect(() => {
    if (!autoPlay) return
    const t1 = setTimeout(() => {
      setNotepadOpen(true)
      sound.playAlarm()
    }, 2000)
    const t2 = setTimeout(() => {
      onAction('Cellule de crise convoquée : Direction + RSSI + DSI + Juridique', 2, { crisisCell: true })
      sound.playSuccess()
    }, 5500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [autoPlay])

  return (
    <div className="rounded-2xl border border-offsec-red/30 bg-[#0d0f17] shadow-2xl overflow-hidden text-slate-200 select-none">
      {/* Barre de fenêtre Windows Server 2022 */}
      <div className="bg-[#1f2430] border-b border-slate-700 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Folder size={15} className="text-amber-400" />
          <span className="font-semibold text-white">
            Explorateur de fichiers — \\FS-CORP-01\Partages\Finances_RH
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="cursor-pointer hover:text-white">─</span>
          <span className="cursor-pointer hover:text-white">□</span>
          <span className="cursor-pointer hover:text-white">✕</span>
        </div>
      </div>

      {/* Ruban Windows Toolbar */}
      <div className="bg-[#141824] border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
        <button className="flex items-center gap-1 hover:text-white font-semibold">
          <Folder size={13} className="text-amber-400" /> Nouveau
        </button>
        <span className="w-px h-4 bg-slate-700" />
        <button className="flex items-center gap-1 hover:text-white opacity-60">
          <Copy size={13} /> Copier
        </button>
        <button className="flex items-center gap-1 hover:text-white opacity-60">
          <Share2 size={13} /> Partager
        </button>
        <button className="flex items-center gap-1 hover:text-white opacity-60">
          <Trash2 size={13} /> Supprimer
        </button>
      </div>

      {/* Barre d'adresse UNC */}
      <div className="bg-[#0b0d14] border-b border-slate-800/80 px-4 py-2 flex items-center gap-2 text-xs font-mono">
        <span className="text-slate-500 flex items-center">
          <Server size={13} className="mr-1 text-offsec-cyan" /> Réseau
          <ChevronRight size={13} /> FS-CORP-01
          <ChevronRight size={13} /> Partages
          <ChevronRight size={13} /> Finances_RH
        </span>
        <div className="ml-auto flex items-center gap-2 bg-black/60 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
          <Search size={11} className="text-slate-500" />
          <span className="text-slate-500">Rechercher dans Finances_RH</span>
        </div>
      </div>

      {/* Contenu : Volet gauche & Liste des fichiers partagés */}
      <div className="flex flex-col md:flex-row min-h-[380px]">
        {/* Volet arborescence gauche */}
        <div className="w-full md:w-56 bg-[#0a0c13] border-r border-slate-800 p-2.5 space-y-1 text-xs font-mono text-slate-400">
          <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">EMPLACEMENTS RÉSEAU</div>
          <div className="p-1.5 rounded hover:bg-white/5 flex items-center gap-2">
            <HardDrive size={13} className="text-slate-400" /> Ce PC (C:)
          </div>
          <div className="p-1.5 rounded bg-[#1a2030] text-white font-bold flex items-center gap-2">
            <Server size={13} className="text-offsec-cyan" /> \\FS-CORP-01
          </div>
          <div className="pl-6 space-y-1 text-[11px]">
            <div className="text-offsec-amber font-bold">📁 Direction_Finances</div>
            <div>📁 RH_Salaires</div>
            <div>📁 R&D_Brevets</div>
          </div>
          <div className="p-1.5 rounded hover:bg-white/5 flex items-center gap-2 text-slate-500">
            <Server size={13} /> \\DC-CORP-01
          </div>
          <div className="p-1.5 rounded hover:bg-white/5 flex items-center gap-2 text-emerald-400 font-bold">
            <HardDrive size={13} /> \\NAS-VEEAM-AIRGAP
          </div>
        </div>

        {/* Fichiers du serveur */}
        <div className="flex-1 bg-[#07090e] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                {isEncrypted ? '5 éléments verrouillés · 1 note de rançon' : '5 éléments nominaux'}
              </span>
              {isEncrypted && (
                <button
                  onClick={onOpenLockscreen}
                  className="px-3 py-1 bg-offsec-red hover:bg-red-600 text-white font-mono font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-lg shadow-offsec-red/40"
                >
                  <Skull size={13} /> Écran de Rançon Plein Écran LockBit
                </button>
              )}
            </div>

            {/* Note de rançon .README_LOCKED_RESTORE.txt */}
            {isEncrypted && (
              <div
                onClick={() => {
                  sound.playClick()
                  setNotepadOpen(true)
                }}
                className="p-3 bg-red-950/40 border border-offsec-red rounded-xl flex items-center justify-between cursor-pointer hover:bg-red-950/60 transition shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <div className="font-bold text-xs text-red-200 font-mono flex items-center gap-1.5">
                      .README_LOCKED_RESTORE.txt <span className="text-[10px] text-offsec-red">[ OUVRIR NOTEPAD ]</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Instructions de paiement LockBit 3.0 · 4 Ko
                    </div>
                  </div>
                </div>
                <button className="px-2.5 py-1 bg-offsec-red text-white text-xs font-mono font-bold rounded">
                  Lire la Note
                </button>
              </div>
            )}

            {/* Tableau des fichiers */}
            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              {PARK_FILES.map((f) => (
                <div key={f.name} className="py-2.5 flex items-center justify-between gap-2 hover:bg-white/5 px-2 rounded">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{isEncrypted ? '🔒' : '📊'}</span>
                    <div>
                      <span className={`font-bold ${isEncrypted ? 'text-red-300' : 'text-white'}`}>
                        {f.name}
                        {isEncrypted ? '.locked' : ''}
                      </span>
                      <div className="text-[10px] text-slate-500">{f.path}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <span className="w-16 text-right">{f.size}</span>
                    <span className="w-24 text-right">{isEncrypted ? 'Fichier LOCKED' : 'Feuille Excel'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arbitrage et Cellule de Crise */}
          {isEncrypted && (
            <div className="p-3.5 bg-black/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-offsec-red font-bold uppercase">[ GOUVERNANCE DE CRISE // ANSSI ]</span>
                <span className="text-slate-400">Décision collégiale obligatoire</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    onAction('Cellule de crise activée : Direction + RSSI + DSI + Juridique', 2, { crisisCell: true })
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs"
                >
                  Activer la Cellule de Crise (+2)
                </button>
                <button
                  onClick={() =>
                    onAction('Arrêt contrôlé des partages compromis et maintien des flux vitaux', undefined, {
                      activityHalted: true,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs"
                >
                  Arbitrer la Continuité
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fenêtre Bloc-Notes Windows (Notepad) */}
      {notepadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl font-mono text-xs flex flex-col text-slate-100">
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-slate-700 font-sans">
              <span>.README_LOCKED_RESTORE.txt — Bloc-notes Windows</span>
              <button onClick={() => setNotepadOpen(false)} className="hover:opacity-80">
                ✕
              </button>
            </div>
            <div className="bg-[#252526] px-4 py-1 flex gap-4 text-[11px] text-slate-400 border-b border-slate-700">
              <span>Fichier</span>
              <span>Édition</span>
              <span>Format</span>
              <span>Affichage</span>
              <span>Aide</span>
            </div>
            <div className="p-4 bg-black text-red-400 space-y-3 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
{`=============================================================================
                    LOCKBIT 3.0 RANSOMWARE NOTICE
=============================================================================

All your sensitive corporate files on FS-CORP-01 have been encrypted with AES-256 and RSA-4096.
Before encryption, 420.5 GB of proprietary data were downloaded to our servers.

To recover your decryption tool, you must pay 15.00 BTC (~980,000 EUR) within 72 hours.
After 72 hours, all your files will be permanently deleted and published on Tor.

Tor Negotiation Portal:
http://lockbitapt73xk4v7l2qm9n8z.onion/meridian-case-915

Bitcoin Address:
bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq

DO NOT ATTEMPT TO MODIFY OR DECRYPT FILES YOURSELF. YOUR PRIVATE KEY WILL BE DESTROYED.`}
            </div>
            <div className="p-3 bg-[#1e1e1e] border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setNotepadOpen(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs"
              >
                Fermer Notepad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
