import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RotateCcw,
  Server,
  Database,
  ArrowRight,
  Activity,
  Play,
} from 'lucide-react'
import { sound } from '../../utils/audio'

export default function VeeamConsoleSimulator() {
  const [restoreProgress, setRestoreProgress] = useState(0)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleStartRestore = () => {
    sound.playClick()
    setIsRestoring(true)
    setRestoreProgress(0)
    setIsComplete(false)

    const interval = setInterval(() => {
      setRestoreProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRestoring(false)
          setIsComplete(true)
          sound.playSuccess()
          return 100
        }
        return prev + 4
      })
    }, 380)
  }

  return (
    <div className="w-full rounded-[3px] border border-[#E2E4E9] bg-[#061e16] shadow-tactile overflow-hidden font-sans text-xs select-none min-h-[440px] flex flex-col justify-between">
      {/* Barre de titre Veeam */}
      <div className="flex items-center justify-between bg-[#005f43] px-4 py-2 border-b border-emerald-900 text-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[2px] bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
            <HardDrive className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="font-bold text-xs text-white flex items-center gap-2">
              <span>Système de Sauvegarde Immuable WORM - Console de Reprise d'Activité</span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.2 rounded-[2px] text-[9px] font-mono">
                AIR-GAP IMMUABLE
              </span>
            </div>
            <div className="text-[10px] text-emerald-200">
              Infrastructure : Datacenter Central | Dépôt WORM Durci Hors-Ligne
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-300 text-[11px] font-mono flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Verrouillage WORM actif (30 jours)
          </span>
        </div>
      </div>

      {/* Corps Console Veeam */}
      <div className="p-4 space-y-4 bg-[#07130e] flex-1">
        {/* Synthèse du Dépôt Hors-Ligne */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-8 p-3 rounded-[3px] bg-slate-900/90 border border-emerald-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Dépôt de Sauvegarde : REPO-LINUX-HARDENED-01</span>
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-emerald-900/80 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                WORM (Write Once Read Many)
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Les snapshots stockés sont physiquement et logiquement inaltérables. Même avec un compte administrateur
              compromis, le rançongiciel ne peut ni supprimer ni chiffrer ces archives.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              <div className="bg-slate-950 p-2 rounded-[2px] border border-slate-800">
                <span className="text-slate-500 block text-[9px]">DERNIER SNAPSHOT</span>
                <span className="text-emerald-400 font-bold">Aujourd'hui 02h00</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-[2px] border border-slate-800">
                <span className="text-slate-500 block text-[9px]">TAILLE DONNÉES</span>
                <span className="text-white font-bold">420 Go (12 VMs)</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-[2px] border border-slate-800">
                <span className="text-slate-500 block text-[9px]">CONTRÔLE SHA-256</span>
                <span className="text-emerald-400 font-bold">VALIDÉ (100%)</span>
              </div>
            </div>
          </div>

          {/* Statut de restauration rapide */}
          <div className="col-span-4 p-3 rounded-[3px] bg-slate-900/90 border border-emerald-900/60 flex flex-col justify-between">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Cible de Restauration</span>
              <div className="mt-1 font-mono text-[11px] text-white font-semibold">
                \\FS-CORP-01\Partages_Metier
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Restauration propre des fichiers chiffrés en .locked.
              </div>
            </div>

            <button
              onClick={handleStartRestore}
              disabled={isRestoring}
              className={`w-full py-2 px-3 rounded-[3px] font-mono uppercase tracking-wider font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-tactile ${
                isRestoring
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 active:translate-y-[1px]'
              }`}
            >
              <RotateCcw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>{isRestoring ? 'Restauration en cours...' : 'LANCER LA RESTAURATION PROPRE'}</span>
            </button>
          </div>
        </div>

        {/* Jauge de Restauration en direct */}
        <div className="p-4 rounded-[3px] bg-slate-900/90 border border-emerald-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Progression de la Restauration des Volumes Métiers</span>
            </span>
            <span className="font-mono tabular-nums font-bold text-emerald-400 text-sm">
              {restoreProgress}% ({((restoreProgress * 420) / 100).toFixed(1)} Go / 420 Go)
            </span>
          </div>

          {/* Barre de progression visuelle */}
          <div className="h-3 bg-slate-950 rounded-[2px] border border-slate-800 overflow-hidden relative">
            <motion.div
              className="h-full bg-emerald-500 rounded-[1px]"
              initial={{ width: 0 }}
              animate={{ width: `${restoreProgress}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Débit de transfert moyen : <strong className="text-white">450 Mo/s (Réseau 10 GbE)</strong></span>
            <span>Estimation restante : <strong className="text-white font-mono tabular-nums">{restoreProgress === 100 ? '0s' : '1m 24s'}</strong></span>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-[3px] text-emerald-200 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white">Restauration Intégrale Terminée avec Succès !</strong>
                <div className="text-[11px] text-emerald-300">
                  Tous les fichiers d'entreprise sont rétablis à leur état nominal de 02h00 sans aucun paiement de rançon.
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

