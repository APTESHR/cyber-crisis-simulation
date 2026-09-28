import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Network,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Terminal,
  Database,
  ArrowRight,
  WifiOff,
} from 'lucide-react'
import { sound } from '../../utils/audio'

interface EdrConsoleSimulatorProps {
  onHostIsolatedChange?: (isolated: boolean) => void
}

export default function EdrConsoleSimulator({ onHostIsolatedChange }: EdrConsoleSimulatorProps) {
  const [isIsolated, setIsIsolated] = useState(false)
  const [processKilled, setProcessKilled] = useState(false)
  const [forensicCaptured, setForensicCaptured] = useState(false)

  const toggleIsolate = () => {
    const nextState = !isIsolated
    setIsIsolated(nextState)
    if (nextState) {
      sound.playSuccess()
    } else {
      sound.playClick()
    }
    if (onHostIsolatedChange) {
      onHostIsolatedChange(nextState)
    }
  }

  const handleKillProcess = () => {
    sound.playLaser()
    setProcessKilled(true)
  }

  const handleCaptureForensics = () => {
    sound.playClick()
    setForensicCaptured(true)
  }

  return (
    <div className="w-full rounded-[3px] border border-[#E2E4E9] bg-[#070b14] shadow-tactile overflow-hidden font-sans text-xs select-none min-h-[440px] flex flex-col justify-between">
      {/* Barre de titre Console SOC EDR */}
      <div className="flex items-center justify-between bg-[#0b1329] px-4 py-2 border-b border-slate-800 text-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-rose-600 flex items-center justify-center text-white font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-white flex items-center gap-2">
              <span>Solution EDR / XDR Opérationnelle</span>
              <span className="bg-rose-950 text-rose-300 border border-rose-600/50 px-1.5 py-0.2 rounded text-[9px] font-mono">
                P1 - ALERTE CRITIQUE
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Tenant : ENTREPRISE-PRODUCTION | SOC Opérationnel 24/7</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Agents actifs : 1 200/1 200
          </span>
        </div>
      </div>

      {/* Corps EDR */}
      <div className="p-4 space-y-4 bg-[#070b14] flex-1">
        {/* Fiche incident résumé */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-8 p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-400 text-[11px]">ID : INC-2026-0916-0042</span>
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                Score MITRE : 9.8 / 10 (CRITIQUE)
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Chaîne anormale : WINWORD.EXE ➔ cmd.exe ➔ powershell.exe</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300 font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px]">HÔTE CIBLÉ</span>
                <span className="text-white font-bold">HOST-SOPHIE-01</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px]">ADRESSE IP</span>
                <span className="text-white font-bold">192.168.10.45</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px]">DESTINATION C2</span>
                <span className="text-rose-400 font-bold">185.22.14.89:443</span>
              </div>
            </div>
          </div>

          {/* Statut d'isolation de l'hôte */}
          <div className="col-span-4 p-3 rounded bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Posture de l'Hôte</span>
              <div className="mt-1">
                {isIsolated ? (
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div>HÔTE CONFINÉ</div>
                      <div className="text-[9px] font-normal text-emerald-400">Flux réseau bloqués à 100%</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded bg-rose-950/60 border border-rose-500 text-rose-300 font-bold flex items-center gap-2">
                    <WifiOff className="w-5 h-5 text-rose-400 animate-pulse" />
                    <div>
                      <div>HÔTE EXPOSÉ</div>
                      <div className="text-[9px] font-normal text-rose-400">Liaison C2 active</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={toggleIsolate}
              className={`w-full py-2 px-3 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                isIsolated
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 animate-bounce'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isIsolated ? 'Réintégrer au réseau' : 'ISOLER L\'HÔTE IMMÉDIATEMENT'}</span>
            </button>
          </div>
        </div>

        {/* Arbre d'exécution des processus (Process Tree) */}
        <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Arborescence des Processus Détectés (Process Tree)</span>
            </span>
            <span className="text-[10px] text-slate-500">Heuristique comportementale EDR</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] space-y-2">
            {/* Niveau 1 */}
            <div className="flex items-center gap-2 text-slate-400">
              <FileCode className="w-3.5 h-3.5 text-slate-500" />
              <span>explorer.exe [PID 1420]</span>
              <span className="text-slate-600 text-[10px]">Session Sophie (08:30)</span>
            </div>

            {/* Niveau 2 */}
            <div className="flex items-center gap-2 pl-4 text-slate-300">
              <span className="text-slate-600">└──</span>
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-white">WINWORD.EXE [PID 4812]</span>
              <span className="text-slate-500 text-[10px]">Note_Revalorisation_2026.docm</span>
            </div>

            {/* Niveau 3 */}
            <div className="flex items-center gap-2 pl-8 text-amber-300">
              <span className="text-slate-600">└──</span>
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>cmd.exe /c [PID 5910]</span>
              <span className="text-slate-500 text-[10px]">Appel silencieux</span>
            </div>

            {/* Niveau 4 - Processus malicieux */}
            <div
              className={`flex items-center justify-between pl-12 p-2 rounded transition-colors ${
                processKilled
                  ? 'bg-slate-900 text-slate-500 line-through'
                  : 'bg-rose-950/60 border border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-600">└──</span>
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="font-bold text-rose-300">powershell.exe -w hidden -enc... [PID 7220]</span>
                <span className="bg-rose-600 text-white text-[9px] px-1 py-0.2 rounded font-bold">
                  MALWARE C2 BEACON
                </span>
              </div>
              {!processKilled ? (
                <button
                  onClick={handleKillProcess}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[10px] flex items-center gap-1 shadow"
                >
                  <Zap className="w-3 h-3" />
                  <span>Kill PID 7220</span>
                </button>
              ) : (
                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PROCESSUS TERMINÉ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions complémentaires du SOC */}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCaptureForensics}
              className={`px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-all ${
                forensicCaptured
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>{forensicCaptured ? 'Dump RAM extrait (16 Go)' : 'Collecter le Dump RAM (Preuve légale)'}</span>
            </button>
          </div>
          <span className="text-slate-400 text-[10px] italic">
            Directive SOC : L'isolement réseau bloque le mouvement latéral sans détruire les preuves en RAM.
          </span>
        </div>
      </div>
    </div>
  )
}

