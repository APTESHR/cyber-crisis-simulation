import React, { useState, useEffect } from 'react'
import { useGame } from '../../store/GameContext'
import { sound } from '../../utils/audio'
import {
  Database,
  HardDrive,
  ShieldCheck,
  Check,
  AlertTriangle,
  Server,
  Lock,
  RefreshCw,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'

export default function VeeamConsole({
  onAction,
  autoPlay,
}: {
  onAction: (text: string, suggested?: number, patch?: Parameters<ReturnType<typeof useGame>['update']>[0]) => void
  autoPlay?: boolean
}) {
  const g = useGame()
  const [checking, setChecking] = useState(false)
  const [checkPct, setCheckPct] = useState(0)
  const [restorePct, setRestorePct] = useState<number | null>(null)

  const runCheck = () => {
    setChecking(true)
    setCheckPct(0)
    sound.playBlip()
    const id = setInterval(() => {
      setCheckPct((p) => {
        if (p >= 100) {
          clearInterval(id)
          setChecking(false)
          sound.playSuccess()
          onAction('Sauvegardes vérifiées : intégrité SHA256 des snapshots immuables certifiée', 2, {
            backupsChecked: true,
          })
          return 100
        }
        sound.playBlip()
        return p + 25
      })
    }, 300)
  }

  useEffect(() => {
    if (!autoPlay) return
    const t1 = setTimeout(() => runCheck(), 1500)
    return () => clearTimeout(t1)
  }, [autoPlay])

  const runRestoreSandbox = () => {
    if (!g.c2Blocked || !g.accountsSecured) {
      sound.playError()
      onAction('ERREUR : tentative de restauration sur une infrastructure non assainie', -2)
      return
    }

    setRestorePct(0)
    sound.playBlip()
    const id = setInterval(() => {
      setRestorePct((p) => {
        if (p !== null && p >= 100) {
          clearInterval(id)
          sound.playSuccess()
          onAction('Restauration étanche réussie en bac à sable isolé (VLAN 99)', 2)
          setTimeout(() => setRestorePct(null), 1000)
          return 100
        }
        sound.playBlip()
        return (p ?? 0) + 20
      })
    }, 250)
  }

  return (
    <div className="rounded-2xl border border-offsec-red/30 bg-[#0d0f17] shadow-2xl overflow-hidden text-slate-200 select-none">
      {/* Barre supérieure Veeam Backup & Replication */}
      <div className="bg-[#005f27] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-wider flex items-center gap-2 font-mono">
            <Database size={16} /> VEEAM BACKUP & REPLICATION v12
          </span>
          <span className="text-emerald-300 font-mono text-[11px]">· Hardened Repository Console</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-emerald-300">Statut : Prêt</span>
          <span className="text-slate-400">|</span>
          <span>adm.backup@meridian.eu</span>
        </div>
      </div>

      {/* Disposition principale Veeam */}
      <div className="flex flex-col md:flex-row min-h-[420px]">
        {/* Volet arborescence gauche */}
        <div className="w-full md:w-60 bg-[#0a0c13] border-r border-slate-800 p-3 space-y-1 text-xs font-mono text-slate-400">
          <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">INFRASTRUCTURE VEEAM</div>
          <div className="p-2 rounded hover:bg-white/5 flex items-center gap-2">
            Vue d'ensemble des travaux
          </div>
          <div className="p-2 rounded bg-[#005f27]/30 text-white font-bold flex items-center gap-2 border border-[#005f27]">
            <HardDrive size={14} className="text-emerald-400" /> Dépôts Immuables (Air-Gap)
          </div>
          <div className="pl-6 space-y-1 text-[11px]">
            <div className="text-emerald-400 font-bold">NAS-VEEAM (VLAN 99)</div>
            <div className="text-slate-500">Stockage WORM 30j</div>
          </div>
          <div className="p-2 rounded hover:bg-white/5 flex items-center gap-2 text-slate-400">
            <Server size={14} /> Serveurs Gérés
          </div>
          <div className="p-2 rounded hover:bg-white/5 flex items-center gap-2 text-slate-400">
            <ShieldCheck size={14} /> Secure Restore & Antivirus
          </div>
        </div>

        {/* Panneau principal de contrôle des sauvegardes */}
        <div className="flex-1 bg-[#07090e] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white font-mono">
                  Dépôt Linux Hardened Repository (NAS-VEEAM-AIRGAP)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  IP : 10.0.99.100 · Snapshot WORM immuable déconnecté du réseau bureautique
                </span>
              </div>
              {g.backupsChecked ? (
                <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Intégrité Validée
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-offsec-amber text-offsec-amber text-xs font-mono font-bold flex items-center gap-1">
                  <AlertTriangle size={13} /> Contrôle Requis
                </span>
              )}
            </div>

            {/* Carte Snapshot */}
            <div className="p-4 bg-black/70 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold">
                  <HardDrive size={15} className="text-emerald-400" />
                  <span>Job_Backup_FS_Complet_J-1 (02h00)</span>
                </div>
                <span className="text-emerald-400 font-bold">[ IMMUABLE · LECTURE SEULE ]</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-2 text-[11px] text-slate-400">
                <div>Taille volume : 14.2 To</div>
                <div>Hash SHA256 : d8a7...41b0</div>
                <div>Statut réseau : Déconnecté (Air-Gap)</div>
              </div>
              <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                ℹ️ Les fichiers de sauvegarde sont verrouillés par le protocole WORM Linux. Même un compte administrateur du domaine compromis ne peut pas les modifier ou les chiffrer.
              </p>
            </div>

            {/* Barre de progression vérification */}
            {checking && (
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Calcul et vérification des empreintes SHA256 des blocs...</span>
                  <span>{checkPct} %</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${checkPct}%` }} />
                </div>
              </div>
            )}

            {restorePct !== null && (
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Restauration en bac à sable hermétique (Secure Restore)...</span>
                  <span>{restorePct} %</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-offsec-cyan transition-all duration-300" style={{ width: `${restorePct}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Actions Veeam */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
            {!g.backupsChecked ? (
              <button
                disabled={checking}
                onClick={runCheck}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950"
              >
                <Check size={14} /> Lancer le Contrôle d'Intégrité des Sauvegardes (+2)
              </button>
            ) : (
              <button
                onClick={runRestoreSandbox}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-950"
              >
                <Play size={14} /> Simuler la Restauration en Bac à Sable Isolé (+2)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
