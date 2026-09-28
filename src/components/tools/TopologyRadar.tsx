import React, { useState } from 'react'
import { useGame } from '../../store/GameContext'
import { TOPOLOGY_NODES, NetworkNode } from '../../data/mock'
import { sound } from '../../utils/audio'
import { Card, CardHeader, Badge, Btn } from '../ui'
import { Network, Server, WifiOff, Check, AlertTriangle } from 'lucide-react'

export default function TopologyRadar({
  onAction,
  autoPlay,
}: {
  onAction: (text: string, suggested?: number, patch?: Parameters<ReturnType<typeof useGame>['update']>[0]) => void
  autoPlay?: boolean
}) {
  const g = useGame()
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)

  return (
    <Card className="overflow-hidden border-offsec-red/30 h-full flex flex-col">
      <CardHeader
        icon={<Network size={16} />}
        title="Radar & Topologie Réseau Interactive (Flux de Télémétrie en Direct)"
        sub="Visualisation physique de l’infection latérale et coupure immédiate lors de l’isolement"
        right={
          <Badge tone={g.scenario >= 3 ? 'red' : 'emerald'}>
            {g.scenario >= 3 ? '[ ALERTE : PROPAGATION SMB ACTIVE ]' : '[ SUPERVISION NOMINALE ]'}
          </Badge>
        }
      />
      <div className="p-4 sm:p-5 bg-black relative overflow-hidden flex-1 flex flex-col justify-between">
        {/* Trame de fond OffSec */}
        <div className="absolute inset-0 bg-offsec-grid opacity-25 pointer-events-none" />

        {/* Diagramme SVG interactif avec faisceaux de données animés */}
        <div className="relative z-10 mb-3 bg-[#0a0c13] p-3 rounded-2xl border border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400 mb-2 uppercase flex items-center justify-between">
            <span>SCHÉMA DES FLUX RÉSEAU TEMPS RÉEL (PAQUETS SMB & BALISE C2)</span>
            <span className="text-offsec-red flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-offsec-red animate-ping" /> Lignes animées = paquets actifs
            </span>
          </div>

          <svg viewBox="0 0 800 200" className="w-full h-auto max-h-48 overflow-visible select-none">
            {/* Liens réseau avec flux de paquets */}
            {/* C2 -> FW */}
            <line
              x1="80"
              y1="100"
              x2="220"
              y2="100"
              stroke={g.c2Blocked ? '#475569' : '#ea1e2b'}
              strokeWidth="2.5"
              strokeDasharray={g.c2Blocked ? '4,4' : '6,8'}
              className={g.c2Blocked ? '' : 'packet-pulse-fast'}
            />
            {/* FW -> HOST_01 */}
            <line
              x1="220"
              y1="100"
              x2="380"
              y2="60"
              stroke={g.isolated.HOST_01 ? '#475569' : g.macroExecuted ? '#ea1e2b' : '#00f0ff'}
              strokeWidth="2"
              strokeDasharray={g.isolated.HOST_01 ? '4,4' : '6,8'}
              className={g.isolated.HOST_01 ? '' : 'packet-pulse'}
            />
            {/* HOST_01 -> HOST_02 */}
            <line
              x1="380"
              y1="60"
              x2="520"
              y2="40"
              stroke={g.isolated.HOST_01 || g.isolated.HOST_02 ? '#475569' : g.scenario >= 2 ? '#ea1e2b' : '#334155'}
              strokeWidth="2"
              strokeDasharray="5,5"
              className={g.scenario >= 2 && !g.isolated.HOST_01 && !g.isolated.HOST_02 ? 'packet-pulse-fast' : ''}
            />
            {/* HOST_01 -> FILE_SERVER */}
            <line
              x1="380"
              y1="60"
              x2="660"
              y2="100"
              stroke={g.isolated.HOST_01 || g.isolated.FILE_SERVER ? '#475569' : g.scenario >= 2 ? '#ea1e2b' : '#334155'}
              strokeWidth="2.5"
              strokeDasharray="5,5"
              className={g.scenario >= 2 && !g.isolated.HOST_01 ? 'packet-pulse-fast' : ''}
            />
            {/* FILE_SERVER -> NAS_VEEAM */}
            <line
              x1="660"
              y1="100"
              x2="740"
              y2="160"
              stroke={g.backupsChecked ? '#10b981' : '#ffb703'}
              strokeWidth="2"
              strokeDasharray="4,4"
            />

            {/* Nœud 1 : C2 Attaquant */}
            <g transform="translate(80, 100)">
              <circle r="26" fill="#1f1116" stroke="#ea1e2b" strokeWidth="2" />
              <text textAnchor="middle" y="4" fill="#ff2a3a" fontSize="18">
                💀
              </text>
              <text textAnchor="middle" y="42" fill="#ff2a3a" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                C2 Attaquant
              </text>
              <text textAnchor="middle" y="54" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                185.22.14.89
              </text>
            </g>

            {/* Nœud 2 : Pare-feu */}
            <g transform="translate(220, 100)">
              <circle r="22" fill="#0b1322" stroke={g.c2Blocked ? '#10b981' : '#00f0ff'} strokeWidth="2" />
              <text textAnchor="middle" y="4" fill="#00f0ff" fontSize="14">
                🛡️
              </text>
              <text textAnchor="middle" y="38" fill="#00f0ff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                Palo Alto FW
              </text>
            </g>

            {/* Nœud 3 : HOST_01 (Sophie) */}
            <g transform="translate(380, 60)">
              <circle
                r="24"
                fill={g.isolated.HOST_01 ? '#1e293b' : g.macroExecuted ? '#2b0f16' : '#0a1727'}
                stroke={g.isolated.HOST_01 ? '#64748b' : g.macroExecuted ? '#ea1e2b' : '#00f0ff'}
                strokeWidth="2.5"
              />
              <text textAnchor="middle" y="4" fill="#ffffff" fontSize="14">
                💻
              </text>
              <text textAnchor="middle" y="38" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                HOST_01 (Sophie)
              </text>
              {g.isolated.HOST_01 && (
                <text textAnchor="middle" y="50" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                  [ ISOLÉ ]
                </text>
              )}
            </g>

            {/* Nœud 4 : HOST_02 */}
            <g transform="translate(520, 40)">
              <circle
                r="20"
                fill={g.isolated.HOST_02 ? '#1e293b' : g.scenario >= 2 ? '#2b0f16' : '#0a1727'}
                stroke={g.isolated.HOST_02 ? '#64748b' : g.scenario >= 2 ? '#ea1e2b' : '#334155'}
                strokeWidth="2"
              />
              <text textAnchor="middle" y="4" fill="#ffffff" fontSize="12">
                🖥️
              </text>
              <text textAnchor="middle" y="34" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                HOST_02 (Compta)
              </text>
            </g>

            {/* Nœud 5 : FILE_SERVER */}
            <g transform="translate(660, 100)">
              <circle
                r="26"
                fill={g.scenario >= 3 ? '#2b0f16' : '#0b1322'}
                stroke={g.scenario >= 3 ? '#ea1e2b' : '#00f0ff'}
                strokeWidth="2.5"
              />
              <text textAnchor="middle" y="4" fill="#ffffff" fontSize="16">
                {g.scenario >= 3 ? '🔒' : '🗄️'}
              </text>
              <text
                textAnchor="middle"
                y="42"
                fill={g.scenario >= 3 ? '#ea1e2b' : '#00f0ff'}
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                FS-CORP-01
              </text>
              <text textAnchor="middle" y="54" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                {g.scenario >= 3 ? '.LOCKED' : '10.0.0.12'}
              </text>
            </g>

            {/* Nœud 6 : NAS VEEAM */}
            <g transform="translate(740, 160)">
              <circle r="22" fill="#091c16" stroke="#10b981" strokeWidth="2" />
              <text textAnchor="middle" y="4" fill="#10b981" fontSize="14">
                💾
              </text>
              <text textAnchor="middle" y="36" fill="#10b981" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                Veeam Air-Gap
              </text>
            </g>
          </svg>
        </div>

        {/* Cartes interactives des nœuds */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
          {TOPOLOGY_NODES.map((node) => {
            const isIsolated = g.isolated[node.id]
            const isCompromised =
              node.id === 'HOST_01'
                ? g.scenario >= 1
                : node.id === 'HOST_02' || node.id === 'HOST_03'
                ? g.scenario >= 2
                : node.id === 'FILE_SERVER'
                ? g.scenario >= 2
                : node.id === 'EXT_C2'

            return (
              <button
                key={node.id}
                onClick={() => {
                  sound.playClick()
                  setSelectedNode(node)
                }}
                className={`p-2.5 rounded-xl border text-left transition relative overflow-hidden ${
                  isIsolated
                    ? 'bg-slate-900/60 border-slate-700 opacity-60'
                    : isCompromised
                    ? 'bg-red-950/40 border-offsec-red shadow-md shadow-offsec-red/30'
                    : 'bg-[#0d0f17] border-slate-800 hover:border-offsec-cyan'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="mono text-[9px] text-slate-400">{node.vlan}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isIsolated
                        ? 'bg-slate-500'
                        : isCompromised
                        ? 'bg-offsec-red animate-ping'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="font-extrabold text-xs text-white truncate">{node.name}</div>
                <div className="mono text-[10px] text-slate-400 mt-0.5">{node.ip}</div>
                <div className="mt-1.5 text-[9px] font-mono font-bold">
                  {isIsolated ? (
                    <span className="text-slate-400 flex items-center gap-1">
                      <WifiOff size={10} /> [ ISOLÉ RÉSEAU ]
                    </span>
                  ) : isCompromised ? (
                    <span className="text-offsec-red flex items-center gap-1">
                      <AlertTriangle size={10} /> [ COMPROMIS // C2 ]
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check size={10} /> [ NOMINAL // SAIN ]
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Tiroir d'inspection du nœud sélectionné */}
        {selectedNode && (
          <div className="mt-3 p-3 rounded-xl bg-[#0d0f17] border border-offsec-red/40 space-y-2 relative z-10 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server size={14} className="text-offsec-cyan" />
                <span className="font-black text-xs text-white font-mono">{selectedNode.name}</span>
                <Badge tone="slate">{selectedNode.os}</Badge>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-white font-mono"
              >
                ✕ Fermer
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 text-xs mono">
              <div className="p-2 rounded-lg bg-black/80 border border-slate-800 text-[11px]">IP : {selectedNode.ip}</div>
              <div className="p-2 rounded-lg bg-black/80 border border-slate-800 text-[11px]">Rôle : {selectedNode.role}</div>
              <div className="p-2 rounded-lg bg-black/80 border border-slate-800 text-[11px]">
                Ports : {selectedNode.ports.join(', ')}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {selectedNode.id !== 'EXT_C2' && selectedNode.id !== 'FW_EDGE' && (
                <Btn
                  variant={g.isolated[selectedNode.id] ? 'outline' : 'red'}
                  onClick={() => {
                    const v = !g.isolated[selectedNode.id]
                    g.update({ isolated: { ...g.isolated, [selectedNode.id]: v } })
                    onAction(
                      `${v ? 'Isolation d’urgence' : 'Reconnexion'} de ${selectedNode.name}`,
                      v ? 3 : undefined
                    )
                  }}
                >
                  {g.isolated[selectedNode.id] ? (
                    <>
                      <Check size={12} /> Reconnecter au réseau
                    </>
                  ) : (
                    <>
                      <WifiOff size={12} /> Isoler immédiatement du réseau (+3)
                    </>
                  )}
                </Btn>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
