import React, { useState, useEffect } from 'react'
import { useGame } from '../../store/GameContext'
import { EDR_LOGS, IOCS } from '../../data/mock'
import { sound } from '../../utils/audio'
import {
  ShieldAlert,
  Search,
  Terminal,
  Activity,
  AlertTriangle,
  Play,
  Ban,
  Check,
  Skull,
  FileCode,
  WifiOff,
  Filter,
  BarChart3,
  Flame,
  Radio,
  Clock,
  Layers,
} from 'lucide-react'

export default function SplunkConsole({
  onAction,
  autoPlay,
}: {
  onAction: (text: string, suggested?: number, patch?: Parameters<ReturnType<typeof useGame>['update']>[0]) => void
  autoPlay?: boolean
}) {
  const g = useGame()
  const [sevFilter, setSevFilter] = useState<'all' | 'crit' | 'warn'>('all')
  const [splQuery, setSplQuery] = useState(
    'index=edr (host="HOST_01" OR host="FS-CORP-01") (process="powershell.exe" OR ttp="T1059.001") | stats count by host, level, ttp'
  )
  const [acked, setAcked] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<'events' | 'process_tree' | 'iocs'>('events')

  // Auto execution effect in cinematic mode
  useEffect(() => {
    if (!autoPlay) return
    const t1 = setTimeout(() => {
      setActiveTab('process_tree')
      sound.playBlip()
    }, 2200)
    const t2 = setTimeout(() => {
      onAction('Confinement EDR immédiat : HOST_01-03 isolés, balise C2 coupée, segmentation VLAN', 3, {
        c2Blocked: true,
        isolated: { ...g.isolated, HOST_01: true, HOST_02: true, HOST_03: true },
      })
      sound.playSuccess()
    }, 5000)
    const t3 = setTimeout(() => {
      onAction('Arbre de processus malveillant tué (PID 7844 & 8310)', 2, { processKilled: true })
    }, 6500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [autoPlay])

  const logs = EDR_LOGS.map((l, i) => ({ ...l, i })).filter(
    (l) => l.minScenario <= g.scenario && (sevFilter === 'all' || l.level === sevFilter)
  )

  const critCount = EDR_LOGS.filter((l) => l.level === 'crit' && l.minScenario <= g.scenario).length
  const warnCount = EDR_LOGS.filter((l) => l.level === 'warn' && l.minScenario <= g.scenario).length

  return (
    <div className="rounded-2xl border border-offsec-red/30 bg-[#07090e] shadow-2xl overflow-hidden text-slate-100 select-none">
      {/* Barre supérieure Splunk Enterprise & CrowdStrike Falcon */}
      <div className="bg-[#11131a] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-black text-sm text-white font-mono tracking-wider">
            <span className="text-[#e20074] font-black">&gt;</span>splunk
            <span className="text-offsec-cyan font-bold text-xs">enterprise</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono text-[11px]">App : CrowdStrike Falcon Incident Workbench</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-offsec-red font-bold">
            <Radio size={12} className="animate-pulse" /> SENSORS : 8 CONNECTÉS
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">User : sara.s (Analyste SOC L2)</span>
        </div>
      </div>

      {/* Barre de navigation interne SIEM */}
      <div className="bg-[#0b0d14] border-b border-slate-800/80 px-4 py-1.5 flex gap-4 text-xs font-mono text-slate-400">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-1 font-bold transition ${
            activeTab === 'events' ? 'text-white border-b-2 border-offsec-red' : 'hover:text-white'
          }`}
        >
          Télémétrie EDR & Alertes ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('process_tree')}
          className={`pb-1 font-bold transition ${
            activeTab === 'process_tree' ? 'text-white border-b-2 border-offsec-red' : 'hover:text-white'
          }`}
        >
          Arbre d'Exécution des Processus (PID)
        </button>
        <button
          onClick={() => setActiveTab('iocs')}
          className={`pb-1 font-bold transition ${
            activeTab === 'iocs' ? 'text-white border-b-2 border-offsec-red' : 'hover:text-white'
          }`}
        >
          Indicateurs de Menace (IOC & MITRE)
        </button>
      </div>

      {/* Barre de recherche SPL (Splunk Search Processing Language) */}
      <div className="p-3 bg-[#0a0c13] border-b border-slate-800 space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 bg-black/90 p-2 rounded-xl border border-slate-800">
          <Search size={14} className="text-offsec-red shrink-0" />
          <input
            value={splQuery}
            onChange={(e) => setSplQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-offsec-cyan text-xs font-mono selection:bg-offsec-red"
          />
          <button
            onClick={() => {
              sound.playClick()
            }}
            className="px-3 py-1 bg-offsec-red hover:bg-red-600 text-white font-bold rounded-lg shrink-0 text-xs shadow-md"
          >
            Run SPL
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500">
          <span>Temps d'exécution : 0.14 s · 1 842 événements inspectés</span>
          <div className="flex items-center gap-2">
            <span>Période : Dernières 15 minutes</span>
            <span>Échantillonnage : 1:1</span>
          </div>
        </div>
      </div>

      {/* Widgets de télémétrie en direct */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-[#080a10] border-b border-slate-800/80 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-black/60 border border-red-900/40">
          <div className="text-[10px] text-slate-400 font-bold uppercase">ALERTES CRITIQUES</div>
          <div className="text-xl font-black text-offsec-red mt-0.5">{critCount}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-black/60 border border-amber-900/40">
          <div className="text-[10px] text-slate-400 font-bold uppercase">AVERTISSEMENTS</div>
          <div className="text-xl font-black text-offsec-amber mt-0.5">{warnCount}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-black/60 border border-cyan-900/40">
          <div className="text-[10px] text-slate-400 font-bold uppercase">C2 HOSTS ACTIFS</div>
          <div className="text-xl font-black text-offsec-cyan mt-0.5">
            {g.c2Blocked ? '0 (BLOQUÉ)' : '1 (185.22.14.89)'}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase">HÔTES EN QUARANTAINE</div>
          <div className="text-xl font-black text-white mt-0.5">
            {Object.values(g.isolated).filter(Boolean).length} / 6
          </div>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="p-4 space-y-4 min-h-[320px]">
        {/* TAB 1 : FLUX D'ÉVÉNEMENTS EN DIRECT */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Événements SentinelOne / Sysmon captés :</span>
              <div className="flex items-center gap-1.5">
                {(['all', 'crit', 'warn'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      sound.playClick()
                      setSevFilter(f)
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      sevFilter === f ? 'bg-offsec-red text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? 'Tous' : f === 'crit' ? 'Critiques' : 'Alertes'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto font-mono text-xs pr-1">
              {logs.map((l) => (
                <div
                  key={l.i}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                    l.level === 'crit'
                      ? 'bg-red-950/40 border-offsec-red/70 text-red-200'
                      : l.level === 'warn'
                      ? 'bg-amber-950/30 border-amber-600/60 text-amber-200'
                      : 'bg-black/60 border-slate-800 text-slate-300'
                  } ${acked.includes(l.i) ? 'opacity-40' : ''}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">{l.t}</span>
                      <span className="px-1.5 py-0.2 bg-black rounded text-[10px] text-offsec-cyan border border-cyan-900 font-bold">
                        {l.host}
                      </span>
                      <span className="text-[10px] text-slate-400">{l.process}</span>
                    </div>
                    <div className="font-semibold text-xs leading-relaxed">{l.msg}</div>
                  </div>
                  {!acked.includes(l.i) ? (
                    <button
                      onClick={() => {
                        sound.playClick()
                        setAcked([...acked, l.i])
                      }}
                      className="shrink-0 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase"
                    >
                      Acquitter
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold shrink-0">✓ Traitée</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2 : ARBRE D'EXÉCUTION DES PROCESSUS */}
        {activeTab === 'process_tree' && (
          <div className="p-4 bg-black rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-offsec-cyan">
                LIGNÉE DES PROCESSUS SUSPECTS (HOST_01 - 10.0.10.15)
              </span>
              <span className="text-[10px] text-slate-500">Source : Sysmon EventID 1</span>
            </div>
            <div className="space-y-2 text-slate-300">
              <div>
                <span className="text-slate-500">PID 3420 :</span> explorer.exe (Session interactive Sophie)
              </div>
              <div className="pl-4">
                <span className="text-slate-500">PID 4892 :</span> └─ OUTLOOK.EXE (Réception du message avec PJ)
              </div>
              <div className="pl-8 text-offsec-amber font-bold">
                <span className="text-slate-500">PID 6104 :</span> └─ WINWORD.EXE [Mise_a_jour_compte_RH.docm]
              </div>
              <div className="pl-12 text-offsec-red font-bold">
                <span className="text-slate-500">PID 7212 :</span> └─ cmd.exe /c powershell.exe -W Hidden -Enc aQBmACgAKAB...
              </div>
              <div className="pl-16 text-offsec-red font-black flex items-center gap-2">
                <span className="text-slate-500">PID 8310 :</span> └─ beacon.exe ➔ 185.22.14.89:443 (Reverse HTTPS)
                {g.processKilled ? (
                  <span className="text-emerald-400 text-[10px] border border-emerald-500 px-1.5 rounded">
                    KILL EFFECTUÉ PAR EDR
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-offsec-red animate-ping" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 : IOC & TTPs MITRE */}
        {activeTab === 'iocs' && (
          <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto font-mono text-xs">
            {IOCS.map((o) => (
              <div key={o.value} className="p-3 bg-black/80 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400 font-bold">{o.type}</span>
                  <span className="text-offsec-cyan font-bold">{o.ttp}</span>
                </div>
                <div className="text-offsec-red font-bold break-all text-[11px]">{o.value}</div>
                <div className="text-slate-500 text-[10px]">{o.context}</div>
              </div>
            ))}
          </div>
        )}

        {/* Barre d'action EDR / Real-Time Response (RTR) */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              onAction('Confinement EDR immédiat : HOST_01-03 isolés, balise C2 coupée, segmentation VLAN', 3, {
                c2Blocked: true,
                isolated: { ...g.isolated, HOST_01: true, HOST_02: true, HOST_03: true },
              })
            }
            className="px-3.5 py-2 rounded-xl bg-offsec-red hover:bg-red-600 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-offsec-red/40"
          >
            <Ban size={13} /> Confinement EDR (+3)
          </button>
          <button
            onClick={() => onAction('Identification étendue : 3 postes touchés, serveur SMB ciblé', 2)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-xs"
          >
            Qualifier l’étendue (+2)
          </button>
          <button
            onClick={() => onAction('Arbre de processus malveillant tué (PID 7844 & 8310)', 2, { processKilled: true })}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-xs flex items-center gap-1.5"
          >
            <Skull size={13} /> Kill Process (+2)
          </button>
          <button
            onClick={() => onAction('Image mémoire RAM collectée pour analyse DFIR Volatility', 2, { ramDumped: true })}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-xs flex items-center gap-1.5"
          >
            <FileCode size={13} /> Dump Mémoire (+2)
          </button>
        </div>
      </div>
    </div>
  )
}
